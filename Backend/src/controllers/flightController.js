import Flight from "../models/flight.js";
import Passenger from "../models/passenger.js";

// ------------------- Helper -------------------
function pushNotification(passenger, message) {
  if (!passenger.notifications) passenger.notifications = [];
  passenger.notifications.push(message);

  // Keep only the last 10 notifications
  if (passenger.notifications.length > 10) {
    passenger.notifications.shift(); // remove the oldest
  }
}

// ------------------- Flight Controllers -------------------

export async function getAllFlight(_, res) {
  try {
    const flights = await Flight.find().sort({ createdAt: 1 });
    console.log("Fetched flights:", flights);
    res.status(200).json(flights);
  } catch (error) {
    console.error("Error in getAllFlight controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getFlightbyId(req, res) {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) return res.status(404).json({ message: "Flight not found" });
    res.status(200).json(flight);
  } catch (error) {
    console.error("Error in getFlightById controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createFlight(req, res) {
  try {
    const {
      from,
      to,
      arrival_date,
      departure_date,
      seat,
      first_class,
      economy_class,
      business_class,
      first_ticket_price,
      business_ticket_price,
      economy_ticket_price,
    } = req.body;

    const flight = new Flight({
      from,
      to,
      arrival_date,
      departure_date,
      seat,
      first_class,
      economy_class,
      business_class,
      first_ticket_price,
      business_ticket_price,
      economy_ticket_price,
    });

    const savedFlight = await flight.save();
    res.status(201).json(savedFlight);
  } catch (error) {
    console.error("Error in createFlight controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateFlight(req, res) {
  try {
    const updatedFlight = await Flight.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedFlight) {
      return res.status(404).json({ message: "Flight not found" });
    }
    res.status(200).json({ message: "Flight updated successfully" });
  } catch (error) {
    console.error("Error in updateFlight controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteFlight(req, res) {
  try {
    const deletedFlight = await Flight.findByIdAndDelete(req.params.id);
    if (!deletedFlight) {
      return res.status(404).json({ message: "Flight not found" });
    }
    res.status(200).json({ message: "Flight deleted successfully" });
  } catch (error) {
    console.error("Error in deleteFlight controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// ------------------- Booking / Seat Controllers -------------------

export async function bookSeat(req, res) {
  try {
    const { passengerId, flightId, seatClass } = req.body;
    const flight = await Flight.findById(flightId);
    const passenger = await Passenger.findById(passengerId);

    if (!flight || !passenger) return res.status(404).json({ message: "Flight or Passenger not found" });
    if (flight[`${seatClass}_class`] <= 0) return res.status(400).json({ message: `No seats available in ${seatClass} class` });

    // Deduct seat from flight
    flight[`${seatClass}_class`] -= 1;
    flight.seat -= 1;
    await flight.save();

    // Update passenger booking
    passenger.flightClass = seatClass;
    passenger.flightId = flightId;
    passenger.seatBooked = 1;

    // Add notification
    pushNotification(passenger, "Your flight has been booked successfully.");

    await passenger.save();

    res.status(200).json({ message: "Seat booked successfully", passenger, flight });
  } catch (error) {
    console.error("Error booking seat:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const updateSeatClass = async (req, res) => {
  try {
    const { passengerId, flightId, newClass } = req.body;

    const passenger = await Passenger.findById(passengerId);
    const flight = await Flight.findById(flightId);

    if (!passenger || !flight) return res.status(404).json({ message: "Passenger or Flight not found" });

    const oldClass = passenger.flightClass;
    const seatsBooked = passenger.seatBooked;

    if (!oldClass || seatsBooked <= 0) return res.status(400).json({ message: "Passenger has no seats booked" });
    if (flight[`${newClass}_class`] < seatsBooked) return res.status(400).json({ message: "Not enough seats in target class" });

    // Free old seats
    flight[`${oldClass}_class`] += seatsBooked;

    // Deduct new class
    flight[`${newClass}_class`] -= seatsBooked;

    // Update passenger info
    passenger.flightClass = newClass;

    // Add notification
    pushNotification(passenger, `Your seat class has been updated to ${newClass}.`);

    await flight.save();
    await passenger.save();

    res.status(200).json({ message: "Seat class updated successfully", passenger, flight });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Seat update failed" });
  }
};

export async function cancelSeat(req, res) {
  try {
    const { passengerId, flightId } = req.body;
    const passenger = await Passenger.findById(passengerId);
    const flight = await Flight.findById(flightId);

    if (!passenger) return res.status(404).json({ message: "Passenger not found" });
    if (!flight) return res.status(404).json({ message: "Flight not found" });
    if (!passenger.flightClass || passenger.seatBooked === 0) return res.status(400).json({ message: "Passenger has no booking" });

    // Restore seats to flight
    flight[`${passenger.flightClass}_class`] += passenger.seatBooked;
    flight.seat += passenger.seatBooked;

    // Add notification
    pushNotification(passenger, "Your flight booking has been cancelled successfully.");

    // Clear passenger booking
    passenger.flightClass = null;
    passenger.seatBooked = 0;
    passenger.flightId = undefined;

    await flight.save();
    await passenger.save();

    res.status(200).json({ message: "Booking cancelled successfully", passenger, flight });
  } catch (error) {
    console.error("Error cancelling seat:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getFlightAvailability(req, res) {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) return res.status(404).json({ message: "Flight not found" });

    res.status(200).json({
      first: { available: flight.first_class },
      business: { available: flight.business_class },
      economy: { available: flight.economy_class }
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
