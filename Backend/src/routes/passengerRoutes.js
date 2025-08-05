import express from "express";
import {
  getAllPassengers,
  getPassengerById,
  createPassenger,
  updatePassenger,
  deletePassenger,
  loginPassenger
} from "../controllers/passengerController.js";

const router = express.Router();

router.get("/", getAllPassengers);
router.get("/:id", getPassengerById);
router.post("/", createPassenger);
router.put("/:id", updatePassenger);
router.delete("/:id", deletePassenger);
router.post("/login", loginPassenger)

export default router;
