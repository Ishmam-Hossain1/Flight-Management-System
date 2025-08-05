import express from "express"
import { getFlightbyId,createFlight,deleteFlight,getAllFlight,updateFlight } from "../controllers/flightController.js";

const router = express.Router();

router.get("/", getAllFlight);

router.get("/:id", getFlightbyId);

router.post("/", createFlight);

router.put("/:id", updateFlight);

router.delete("/:id", deleteFlight);

export default router;