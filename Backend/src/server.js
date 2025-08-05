import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import flightRoutes from "./routes/flightRoutes.js";
import passengerRoutes from "./routes/passengerRoutes.js"; 
import reviewRoutes from "./routes/reviewRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

console.log(process.env.MONGO_URI);

const app = express ();
const PORT = process.env.PORT || 5001

// connectDB()


app.use(express.json ()); //this middleware will pars JSON bodies: req.body
app.use(rateLimiter);
app.use(cors({
  origin: "http://localhost:5173"
}));

app.use("/api/flight", flightRoutes);
app.use("/api/passenger", passengerRoutes); 
app.use("/api/review", reviewRoutes);

connectDB().then(() => {
app.listen(5001, () => {
  console.log("Server started on PORT:", PORT);
});
});

