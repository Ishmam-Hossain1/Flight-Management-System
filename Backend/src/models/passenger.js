import mongoose from "mongoose";

const passengerSchema = new mongoose.Schema(
  {
    flightId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flight", // optional: helps with population
      default: null
    },

    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      // Consider hashing the password before saving!
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },

    customTag: {
      type: String,
      enum: ["None", "Bronze", "Silver", "Gold"],
      default: "None",
    },

    flightHistory: {
      type: Number,
    },
    notifications: {
      type: [String],   
      default: [],      
    },
    flightClass: {
      type: String,
      default: null
    },
    seatBooked: {
      type: Number,
      default: 0
    },
    cargo_plane_booking_status: {
      type: String,
      enum: ["Not Booked", "Booked"],
      default: "Not Booked"
    },
    cargo_plane_weight: {
      type: Number,
      default: 0, 
    },
    cargo_plane_flight_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CargoPlane",
      default: null,  // Will store the booked cargo plane's ID
    },
    extra_luggage: {
      type: Number,
      default: 0,
    },

  },
  { timestamps: true }
);

passengerSchema.pre("save", function (next) {
  if (this.flightHistory <= 20) {
    this.customTag = "None";
  } else if (this.flightHistory <= 40) {
    this.customTag = "Bronze";
  } else if (this.flightHistory <= 60) {
    this.customTag = "Silver";
  } else if (this.flightHistory <= 80) {
    this.customTag = "Gold";
  }
  next();
});

const Passenger = mongoose.model("Passenger", passengerSchema);

export default Passenger;
