import express from "express";
import {
  getAllPassengers,
  getPassengerById,
  createPassenger,
  updatePassenger,
  deletePassenger,
  loginPassenger,
  bookFlight,
  deleteNotification,
  cargoBookingStatus ,// ✅ import the booking controller
} from "../controllers/passengerController.js";

import Passenger from "../models/passenger.js";

const router = express.Router();

// Passenger routes
router.get("/", getAllPassengers);
router.get("/:id", getPassengerById);
router.post("/", createPassenger);
router.put("/:id", updatePassenger);
router.delete("/:id", deletePassenger);
router.post("/login", loginPassenger);
router.patch("/:id/cargo-status", cargoBookingStatus);
router.delete("/:id/notifications/:index", deleteNotification);

// ✅ Booking route
router.post("/book", bookFlight); // POST /api/passenger/book

// POST /api/passenger/:passengerId/book-cargo/:planeId
router.post("/:passengerId/book-cargo/:planeId", async (req, res) => {
  req.body.passengerId = req.params.passengerId;
  req.params.id = req.params.planeId; // plane id
  await bookCargoPlane(req, res);
});


import { cancelSeat } from "../controllers/flightController.js";
router.put("/:id/cancel-seat", cancelSeat);


import { updateSeatClass } from "../controllers/flightController.js";
router.put("/:id/seat-class", updateSeatClass);

router.get("/:id/notifications", async (req, res) => {
  try {
    const passenger = await Passenger.findById(req.params.id);

    if (!passenger) {
      return res.status(404).json({ message: "Passenger not found" });
    }

    // ✅ return notifications properly
    res.json({ notifications: passenger.notifications || [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



export default router;
