// routes/adminRoutes.js
import express from "express";
import Admin from "../models/admin.js";
import Flight from "../models/flight.js";
import Passenger from "../models/passenger.js";
import CargoPlane from "../models/cargoplane.js";
import Review from "../models/review.js";

// import * as AdminMod from "../models/admin.js";
// // console.log("AdminMod exports:", AdminMod);

// const Admin = AdminMod.default ?? AdminMod.Admin ?? AdminMod.admin;

console.log("Admin:", Admin); // should log a function (the model)

const router = express.Router();

/* ---------------- Admin Auth ---------------- */

// One-time register (create admin)
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username?.trim() || !password?.trim()) {
      return res.status(400).json({ error: "username and password are required" });
    }

    const exists = await Admin.findOne({ username });
    if (exists) return res.status(400).json({ error: "Admin already exists" });

    const newAdmin = new Admin({ username, password }); // ⚠️ hash in production
    await newAdmin.save();
    res.json({ message: "Admin created", admin: newAdmin });
  } catch (err) {
    console.error("Admin register error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username, password }); // ⚠️ use bcrypt in production
    if (!admin) return res.status(401).json({ error: "Invalid credentials" });

    res.json({ message: "Login successful", adminId: admin._id });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ---------------- Flights CRUD ---------------- */

router.get("/flights", async (_req, res) => {
  try {
    const flights = await Flight.find();
    res.json(flights);
  } catch (err) {
    console.error("Fetch flights error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/flights/:id", async (req, res) => {
  try {
    const updated = await Flight.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Flight not found" });
    res.json(updated);
  } catch (err) {
    console.error("Update flight error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/flights/:id", async (req, res) => {
  try {
    const removed = await Flight.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ error: "Flight not found" });
    res.json({ message: "Flight deleted" });
  } catch (err) {
    console.error("Delete flight error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Add a new flight
router.post("/flights", async (req, res) => {
  try {
    const flight = new Flight(req.body);
    await flight.save();
    res.status(201).json(flight);
  } catch (err) {
    console.error("Add flight error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ---------------- Passengers CRUD ---------------- */

router.get("/passengers", async (_req, res) => {
  try {
    const passengers = await Passenger.find();
    res.json(passengers);
  } catch (err) {
    console.error("Fetch passengers error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/passengers/:id", async (req, res) => {
  try {
    const updated = await Passenger.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Passenger not found" });
    res.json(updated);
  } catch (err) {
    console.error("Update passenger error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/passengers/:id", async (req, res) => {
  try {
    const removed = await Passenger.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ error: "Passenger not found" });
    res.json({ message: "Passenger deleted" });
  } catch (err) {
    console.error("Delete passenger error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// Add new passenger
router.post("/passengers", async (req, res) => {
  try {
    const {
      name,
      password,
      email,
      phoneNo,
      flightId,
      flightClass,
      seatBooked,
      extra_luggage,
      cargo_plane_booking_status,
      cargo_plane_weight,
      cargo_plane_flight_id
    } = req.body;

    // Required fields check
    if (!name || !password || !email || !phoneNo) {
      return res.status(400).json({ error: "Name, password, email, and phone number are required" });
    }

    // Check if email already exists
    const existing = await Passenger.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Passenger with this email already exists" });
    }

    // Create passenger
    const passenger = new Passenger({
      name,
      password, // ⚠️ Should hash before saving in real apps
      email,
      phoneNo,
      flightId: flightId || null,
      flightClass: flightClass || null,
      seatBooked: seatBooked || 0,
      extra_luggage: extra_luggage || 0,
      cargo_plane_booking_status: cargo_plane_booking_status || "Not Booked",
      cargo_plane_weight: cargo_plane_weight || 0,
      cargo_plane_flight_id: cargo_plane_flight_id || null,
      flightHistory: 0, // default on signup
    });

    await passenger.save();
    res.status(201).json(passenger);
  } catch (err) {
    console.error("Add passenger error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


/* ---------------- Cargo Planes CRUD ---------------- */

router.get("/cargo-planes", async (_req, res) => {
  try {
    const cargoPlanes = await CargoPlane.find();
    res.json(cargoPlanes);
  } catch (err) {
    console.error("Fetch cargo planes error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/cargo-planes/:id", async (req, res) => {
  try {
    const updated = await CargoPlane.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Cargo plane not found" });
    res.json(updated);
  } catch (err) {
    console.error("Update cargo plane error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/cargo-planes/:id", async (req, res) => {
  try {
    const removed = await CargoPlane.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ error: "Cargo plane not found" });
    res.json({ message: "Cargo plane deleted" });
  } catch (err) {
    console.error("Delete cargo plane error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

//Create Cargo Plane
router.post("/cargo-planes", async (req, res) => {
  try {
    const newPlane = new CargoPlane(req.body);
    await newPlane.save();
    res.status(201).json(newPlane);
  } catch (err) {
    console.error("Create cargo plane error:", err);
    res.status(500).json({ error: "Failed to add cargo plane" });
  }
});

/* ---------------- Reviews CRUD ---------------- */

// Get all reviews
router.get("/reviews", async (_req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (err) {
    console.error("Fetch reviews error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Add review
router.post("/reviews", async (req, res) => {
  try {
    const { userId, userName, review, rating } = req.body;

    if (!userName || !review || !rating) {
      return res.status(400).json({ error: "userName, review, and rating are required" });
    }

    const newReview = new Review({
      userId: userId || null,  // allow null for admin-added reviews
      userName,
      review,
      rating,
    });

    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    console.error("Add review error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// Edit review
router.put("/reviews/:id", async (req, res) => {
  try {
    const updated = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Review not found" });
    res.json(updated);
  } catch (err) {
    console.error("Update review error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete review
router.delete("/reviews/:id", async (req, res) => {
  try {
    const removed = await Review.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ error: "Review not found" });
    res.json({ message: "Review deleted" });
  } catch (err) {
    console.error("Delete review error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;

