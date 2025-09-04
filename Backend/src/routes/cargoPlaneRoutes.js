import express from "express";
import CargoPlane from "../models/cargoplane.js";
import {
  getAllCargoPlanes,
  getCargoPlaneById,
  bookCargoPlane
} from "../controllers/cargoPlaneController.js";

const router = express.Router();

// POST - Add a new cargo plane
router.post("/", async (req, res) => {
  try {
    const cargoPlane = new CargoPlane(req.body);
    await cargoPlane.save();
    res.status(201).json(cargoPlane);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET - List all cargo planes
router.get("/", getAllCargoPlanes);

// GET - Get cargo plane by ID
router.get("/:id", getCargoPlaneById);

// POST - Book cargo plane
router.post("/:id/book", bookCargoPlane);

// NEW: GET - Get cargo plane booked by a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Find cargo flight(s) booked by this user
    const cargoFlight = await CargoPlane.findOne({ bookedBy: userId });

    if (!cargoFlight) {
      return res.status(404).json({ message: "No cargo flight booked by this user" });
    }

    res.json(cargoFlight);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
