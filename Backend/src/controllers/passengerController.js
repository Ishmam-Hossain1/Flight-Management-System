import Passenger from "../models/passenger.js";

export async function getAllPassengers(_, res) {
  try {
    const passengers = await Passenger.find().sort({ createdAt: 1 });
    console.log("Fetched passengers:", passengers); // Logs to backend console
    res.status(200).json(passengers);
  } catch (error) {
    console.error("Error in getAllPassengers controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getPassengerById(req, res) {
  try {
    const passenger = await Passenger.findById(req.params.id);

    if (!passenger) return res.status(404).json({ message: "Passenger not found" });

    res.status(200).json(passenger);
  } catch (error) {
    console.error("Error in getPassengerById controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createPassenger(req, res) {
  try {
  const {
    name,
    password,
    email,
    phoneNo,
    goldTag,
    silverTag,
    bronzeTag,
    flightHistory,
    notifications,
    flightClass,
    seatBooked
  } = req.body;


    const passenger = new Passenger({
      name,
      password,
      email,
      phoneNo,
      goldTag,
      silverTag,
      bronzeTag,
      flightHistory,
      notifications,
      flightClass,
      seatBooked
    });

    const savedPassenger = await passenger.save();
    res.status(201).json(savedPassenger);
  } catch (error) {
    console.error("Error in createPassenger controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updatePassenger(req, res) {
  try {
    const updateData = req.body;

    const updatedPassenger = await Passenger.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedPassenger) {
      return res.status(404).json({ message: "Passenger not found" });
    }

    res.status(200).json({ message: "Passenger updated successfully", passenger: updatedPassenger });
  } catch (error) {
    console.error("Error in updatePassenger controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deletePassenger(req, res) {
  try {
    const deletedPassenger = await Passenger.findByIdAndDelete(req.params.id);

    if (!deletedPassenger) {
      return res.status(404).json({ message: "Passenger not found" });
    }

    res.status(200).json({ message: "Passenger deleted successfully" });
  } catch (error) {
    console.error("Error in deletePassenger controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


export async function loginPassenger(req, res) {
  try {
    console.log("Received login request:", req.body);

    const { email, password } = req.body;

    // Basic validation
    const passenger = await Passenger.findOne({ email });

    if (!passenger) {
      return res.status(404).json({ message: "User not found" });
    }

    if (passenger.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.status(200).json({ message: "Login successful", user: passenger });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
