import mongoose from "mongoose";

const flightSchema = new mongoose.Schema(
  {
    from: {
      type: String,
      required: true
    },
    to: {
      type: String,
      required: true,
    },
    arrival_date: {
      type: Date,
      required: true,
    },
    departure_date: {
      type: Date,
      required: true,
    },
    seat: {
      type: Number,
      required: true,
    },
    first_class: {
      type: Number,
      required: true,
    },
    economy_class: {
      type: Number,
      required: true,
    },
    business_class: {
      type: Number,
      required: true,
    }, 
      first_ticket_price: {
      type: Number,
      required: true,
    }, 
      business_ticket_price: {
      type: Number,
      required: true,
    }, 
      economy_ticket_price: {
      type: Number,
      required: true,
    }, 
      delay: {
      type: Number,
      default: 0,
    }, 
  },
  { timestamps: true }
);

const Flight = mongoose.model('Flight', flightSchema);

export default Flight;
