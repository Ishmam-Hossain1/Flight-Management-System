import CargoPlane from "../models/cargoplane.js";
import Passenger from "../models/passenger.js";

// Get all cargo planes
export const getAllCargoPlanes = async (req, res) => {
  try {
    const planes = await CargoPlane.find();
    res.json(planes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cargo planes" });
  }
};

// Get single cargo plane by ID
export const getCargoPlaneById = async (req, res) => {
  try {
    const plane = await CargoPlane.findById(req.params.id);
    if (!plane) return res.status(404).json({ error: "Plane not found" });
    res.json(plane);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cargo plane" });
  }
};

// Book cargo plane
export const bookCargoPlane = async (req, res) => {
  const { weight, passengerId } = req.body; // passengerId must come from frontend

  try {
    const plane = await CargoPlane.findById(req.params.id);
    if (!plane) return res.status(404).json({ error: "Plane not found" });

    if (!weight || weight <= 0) 
      return res.status(400).json({ error: "Weight must be greater than 0" });
    if (plane.cargo_weight_available < weight) 
      return res.status(400).json({ error: "Not enough cargo space available" });

    // Reduce available weight in the cargo plane
    plane.cargo_weight_available -= weight;
    if (plane.cargo_weight_available === 0) plane.booking_status = "Full";
    await plane.save();

    let passenger = null;
    // Update passenger cargo info
    if (passengerId) {
      passenger = await Passenger.findById(passengerId);
      if (passenger) {
        passenger.cargo_plane_weight = (passenger.cargo_plane_weight || 0) + weight;
        passenger.cargo_plane_booking_status = "Booked";
        passenger.cargo_plane_flight_id = plane._id;

        // ✅ Add notification
        const newNotification = "Cargo plane booked successfully";
        if (!passenger.notifications) passenger.notifications = [];
        passenger.notifications.push(newNotification);

        // Keep at most 10 notifications (remove oldest if necessary)
        if (passenger.notifications.length > 10) {
          passenger.notifications.shift();
        }

        await passenger.save();
      }
    }

    const total_price = weight * plane.price_per_kg;

    res.json({ 
      total_price, 
      updatedPlane: plane,
      passenger
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Booking failed" });
  }
};
