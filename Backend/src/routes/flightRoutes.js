import express from "express";
import { 
  getFlightbyId,
  createFlight,
  deleteFlight,
  getAllFlight,
  updateFlight,
  bookSeat,
  updateSeatClass,
  cancelSeat,
  getFlightAvailability 
} from "../controllers/flightController.js";

const router = express.Router();

// Flight CRUD
router.get("/", getAllFlight);
router.get("/:id", getFlightbyId);
router.post("/", createFlight);
router.put("/:id", updateFlight);
router.delete("/:id", deleteFlight);
router.get("/:id/availability", getFlightAvailability);


// Seat management
router.post("/book", bookSeat);
router.put("/update-seat", updateSeatClass);
router.put("/cancel-seat", cancelSeat);

export default router;
