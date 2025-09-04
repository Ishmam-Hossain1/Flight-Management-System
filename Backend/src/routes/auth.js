// backend/routes/auth.js
import express from "express";
import Passenger from "../models/passenger.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, phoneNo } = req.body;

    if (!name || !email || !password || !phoneNo) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await Passenger.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const passenger = new Passenger({
      name,
      email,
      password, // store password as plain text
      phoneNo,
    });

    await passenger.save();

    res.status(201).json({ message: "Account created successfully", passenger });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
