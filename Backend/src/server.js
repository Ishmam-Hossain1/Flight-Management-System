import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import flightRoutes from "./routes/flightRoutes.js";
import passengerRoutes from "./routes/passengerRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import cargoPlaneRoutes from "./routes/cargoPlaneRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/adminRoutes.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB()
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(rateLimiter);
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// Routes
app.use("/api/flight", flightRoutes);
app.use("/api/passenger", passengerRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/cargo-planes", cargoPlaneRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);



// Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server started on PORT: ${PORT}`);
});
