import Passenger from "../models/passenger.js";
import Flight from "../models/flight.js";

// 🔹 Helper to compute custom tag
function getCustomTag(history) {
  if (!history || history <= 20) return "None";
  if (history <= 40) return "Bronze";
  if (history <= 60) return "Silver";
  if (history <= 80) return "Gold";
  return "Gold"; // cap at Gold
}

// Get all passengers
export async function getAllPassengers(_, res) {
  try {
    const passengers = await Passenger.find().sort({ createdAt: 1 });

    const withTags = passengers.map((p) => {
      const obj = p.toObject();
      obj.customTag = getCustomTag(obj.flightHistory);
      return obj;
    });

    res.status(200).json(withTags);
  } catch (error) {
    console.error("Error in getAllPassengers controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get a passenger by ID
export async function getPassengerById(req, res) {
  try {
    const passenger = await Passenger.findById(req.params.id);

    if (!passenger)
      return res.status(404).json({ message: "Passenger not found" });

    const passengerData = passenger.toObject();
    passengerData.customTag = getCustomTag(passenger.flightHistory);

    res.status(200).json(passengerData);
  } catch (error) {
    console.error("Error in getPassengerById controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Create a new passenger
export async function createPassenger(req, res) {
  try {
    const {
      name,
      password,
      email,
      phoneNo,
      flightHistory,
      notifications,
      flightClass,
      seatBooked,
      extra_luggage = 0, // ✅ default luggage
    } = req.body;

    const passenger = new Passenger({
      name,
      password,
      email,
      phoneNo,
      flightHistory,
      notifications,
      flightClass,
      seatBooked,
      extra_luggage,
    });

    const savedPassenger = await passenger.save();
    const obj = savedPassenger.toObject();
    obj.customTag = getCustomTag(obj.flightHistory);

    res.status(201).json(obj);
  } catch (error) {
    console.error("Error in createPassenger controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Update a passenger
export async function updatePassenger(req, res) {
  try {
    const updateData = req.body;

    const updatedPassenger = await Passenger.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedPassenger) {
      return res.status(404).json({ message: "Passenger not found" });
    }

    // ✅ Add notification
    const newNotification = "Profile updated successfully";
    if (!updatedPassenger.notifications) updatedPassenger.notifications = [];
    updatedPassenger.notifications.push(newNotification);

    // ✅ Keep max 10 notifications
    if (updatedPassenger.notifications.length > 10) {
      updatedPassenger.notifications.shift();
    }

    await updatedPassenger.save();

    const obj = updatedPassenger.toObject();
    obj.customTag = getCustomTag(obj.flightHistory);

    res.status(200).json({
      message: "Passenger updated successfully",
      passenger: obj,
    });
  } catch (error) {
    console.error("Error in updatePassenger controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


// Delete a passenger
export async function deletePassenger(req, res) {
  try {
    const deletedPassenger = await Passenger.findByIdAndDelete(req.params.id);

    if (!deletedPassenger) {
      return res.status(404).json({ message: "Passenger not found" });
    }

    res.status(200).json({ message: "Passenger deleted successfully" });
  } catch (error) {
    console.error("Error in deletePassenger controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Login passenger
// Login passenger
export async function loginPassenger(req, res) {
  try {
    const { email, password } = req.body;

    const passenger = await Passenger.findOne({ email });

    if (!passenger) {
      return res.status(404).json({ message: "User not found" });
    }

    if (passenger.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // --- Check for flight delay ---
    if (passenger.flightId) {
      const flight = await Flight.findById(passenger.flightId);

      if (flight && flight.delay && flight.delay > 0) {
        const delayNotification = `Your flight is delayed by ${flight.delay} hour/s`;

        if (!passenger.notifications) passenger.notifications = [];

        // Avoid duplicate delay notification
        if (!passenger.notifications.includes(delayNotification)) {
          passenger.notifications.push(delayNotification);

          // Keep only last 10 notifications
          if (passenger.notifications.length > 10) passenger.notifications.shift();

          await passenger.save();
        }
      }
    }

    const obj = passenger.toObject();
    obj.customTag = getCustomTag(passenger.flightHistory);

    res.status(200).json({ message: "Login successful", user: obj });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


// ✅ Book a flight with extra luggage
export async function bookFlight(req, res) {
  try {
    const { passengerId, flightId, seatClass, numPassengers, extra_luggage = 0 } = req.body;

    const passenger = await Passenger.findById(passengerId);
    const flight = await Flight.findById(flightId);

    if (!passenger || !flight) {
      return res.status(404).json({ message: "Passenger or Flight not found" });
    }

    // Check availability
    const availableSeats = {
      economy: flight.economy_class,
      business: flight.business_class,
      first: flight.first_class,
    };

    if (availableSeats[seatClass] < numPassengers) {
      return res
        .status(400)
        .json({ message: `Not enough seats in ${seatClass} class` });
    }

    // Deduct seats from flight
    if (seatClass === "economy") {
      flight.economy_class -= numPassengers;
    } else if (seatClass === "business") {
      flight.business_class -= numPassengers;
    } else if (seatClass === "first") {
      flight.first_class -= numPassengers;
    }

    flight.seat -= numPassengers;

    // ✅ Increment instead of overwrite
    passenger.seatBooked = (passenger.seatBooked || 0) + numPassengers;
    passenger.flightClass = seatClass;
    passenger.flightId = flightId;
    passenger.flightHistory = (passenger.flightHistory || 0) + 1; // increment history

    // ✅ Extra luggage multiplied by number of passengers
    passenger.extra_luggage =
      (passenger.extra_luggage || 0) + extra_luggage * numPassengers;

    await flight.save();
    await passenger.save();

    const obj = passenger.toObject();
    obj.customTag = getCustomTag(obj.flightHistory);

    res
      .status(200)
      .json({ message: "Flight booked successfully", passenger: obj });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Update cargo_plane_booking_status
export const cargoBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { cargo_plane_booking_status } = req.body;

    const updatedPassenger = await Passenger.findByIdAndUpdate(
      id,
      { cargo_plane_booking_status },
      { new: true }
    );

    if (!updatedPassenger) {
      return res.status(404).json({ message: "Passenger not found" });
    }

    res.json(updatedPassenger);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const deleteNotification = async (req, res) => {
  try {
    const { id, index } = req.params; // passengerId and notification index
    const passenger = await Passenger.findById(id);

    if (!passenger) return res.status(404).json({ message: "Passenger not found" });

    if (!passenger.notifications || passenger.notifications.length === 0) {
      return res.status(400).json({ message: "No notifications to delete" });
    }

    const notifIndex = parseInt(index, 10);
    if (isNaN(notifIndex) || notifIndex < 0 || notifIndex >= passenger.notifications.length) {
      return res.status(400).json({ message: "Invalid notification index" });
    }

    // Remove the notification
    passenger.notifications.splice(notifIndex, 1);
    await passenger.save();

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (err) {
    console.error("Delete notification error:", err);
    res.status(500).json({ message: "Failed to delete notification" });
  }
};
