import mongoose from "mongoose";

const passengerSchema = new mongoose.Schema(
  {
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
    goldTag: {
      type: Boolean,
      default: false
    },
    silverTag: {
      type: Boolean,
      default: false
    },
    bronzeTag: {
      type: Boolean,
      default: false
    },
    flightHistory: {
        type: Number,
    },
    notifications: {
      type: String
    },
   
    flightClass: {
      type: String,
      required: true
    },
    seatBooked: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

const Passenger = mongoose.model("Passenger", passengerSchema);

export default Passenger;
