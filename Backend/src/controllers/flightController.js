import Flight from "../models/flight.js"

export async function getAllFlight(_, res) {
  try {
    const flights = await Flight.find().sort({ createdAt: 1 });
    console.log("Fetched flights:", flights);  // This will log to your backend console
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
      from,to,arrival_date,departure_date,seat,first_class,economy_class,business_class,first_ticket_price,business_ticket_price,economy_ticket_price
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
    const { title, content } = req.body;

    const updatedFlight = await Flight.findByIdAndUpdate(
      req.params.id,
      { title, content },
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
