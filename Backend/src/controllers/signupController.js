import Passenger from "../models/passenger.js";
import bcrypt from "bcryptjs";

export const signupPassenger = async (req, res) => {
  try {
    const { name, email, password, phoneNo } = req.body;

    // Check if email already exists
    const existingPassenger = await Passenger.findOne({ email });
    if (existingPassenger) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create passenger
    const newPassenger = new Passenger({
      name,
      email,
      password: hashedPassword,
      phoneNo,
      flightHistory: 0, // optional but ensures customTag is calculated correctly
    });

    await newPassenger.save();

    res.status(201).json({ message: "Account created successfully", passenger: newPassenger });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
