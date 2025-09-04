import mongoose from "mongoose";

const cargoPlaneSchema = new mongoose.Schema({
  from_location: { type: String, required: true },        // e.g., Dhaka
  to_location: { type: String, required: true },          // e.g., Chittagong
  departure_time: { type: Date, required: true },
  arrival_time: { type: Date, required: true },
  total_cargo_weight: { type: Number, required: true },   // total capacity (kg)
  cargo_weight_available: { type: Number, required: true }, // remaining (kg)
  price_per_kg: { type: Number, required: true },

  booking_status: {
    type: String,
    enum: ["Available", "Full"],
    default: "Available"
  }
});

// Auto-update booking_status before saving
cargoPlaneSchema.pre("save", function (next) {
  if (this.cargo_weight_available > 0) {
    this.booking_status = "Available";
  } else {
    this.booking_status = "Full";
  }
  next();
});

const CargoPlane = mongoose.model("CargoPlane", cargoPlaneSchema);

export default CargoPlane;
