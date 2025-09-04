import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const flight = location.state?.flight;
  const [seatClass, setSeatClass] = useState("economy");
  const [numPassengers, setNumPassengers] = useState(1);
  const [extraLuggage, setExtraLuggage] = useState(0); // in KG

  if (!flight) return <p>No flight selected.</p>;

  const getAvailableSeats = () => {
    if (seatClass === "economy") return flight.economy_class;
    if (seatClass === "business") return flight.business_class;
    if (seatClass === "first") return flight.first_class;
  };

  // 🔹 Seat prices
  const getSeatPrice = () => {
    if (seatClass === "economy") return 1500;
    if (seatClass === "business") return 3000;
    if (seatClass === "first") return 5000;
    return 0;
  };

  // 🔹 Luggage price (per passenger)
  const getLuggagePrice = () => {
    if (extraLuggage === 5) return 5000;
    if (extraLuggage === 10) return 9000;
    return 0;
  };

  // 🔹 Total Price
  const totalPrice = numPassengers * (getSeatPrice() + getLuggagePrice());

  const handleBooking = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please log in first.");
      navigate("/login");
      return;
    }

    const availableSeats = getAvailableSeats();
    if (numPassengers > availableSeats) {
      alert(`Only ${availableSeats} seats available in ${seatClass} class.`);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5001/api/passenger/book", {
        passengerId: user._id,
        flightId: flight._id,
        seatClass,
        numPassengers,
        // ✅ Send extra_luggage multiplied by number of passengers
        extra_luggage: extraLuggage * numPassengers,
        totalPrice, 
      });

      localStorage.setItem("user", JSON.stringify(response.data.passenger));

      alert("Booking successful!");
      navigate("/profile");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Booking failed.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Confirm Booking</h2>

      <div className="mb-4">
        <p><strong>From:</strong> {flight.from}</p>
        <p><strong>To:</strong> {flight.to}</p>
        <p><strong>Departure:</strong> {new Date(flight.departure_date).toLocaleDateString()}</p>
        <p><strong>Arrival:</strong> {new Date(flight.arrival_date).toLocaleDateString()}</p>
      </div>

      <div className="mb-4">
        <label>Select Class:</label>
        <select
          className="select select-bordered w-full max-w-xs"
          value={seatClass}
          onChange={(e) => setSeatClass(e.target.value)}
        >
          <option value="economy">Economy ({flight.economy_class} seats left - 1500tk)</option>
          <option value="business">Business ({flight.business_class} seats left - 3000tk)</option>
          <option value="first">First ({flight.first_class} seats left - 5000tk)</option>
        </select>
      </div>

      <div className="mb-4">
        <label>Number of Passengers:</label>
        <input
          type="number"
          min="1"
          className="input input-bordered w-full max-w-xs"
          value={numPassengers}
          onChange={(e) => setNumPassengers(Number(e.target.value))}
        />
      </div>

      <div className="mb-4">
        <label>Extra Luggage (per passenger):</label>
        <select
          className="select select-bordered w-full max-w-xs"
          value={extraLuggage}
          onChange={(e) => setExtraLuggage(Number(e.target.value))}
        >
          <option value={0}>No extra luggage</option>
          <option value={5}>5 kg (+5000 tk)</option>
          <option value={10}>10 kg (+9000 tk)</option>
        </select>
      </div>

      {/* 🔹 Show Total Price */}
      <div className="mb-4">
        <p className="text-lg font-semibold">Total Price: {totalPrice} tk</p>
      </div>

      <button className="btn btn-primary mt-4" onClick={handleBooking}>
        Book Now
      </button>
    </div>
  );
};

export default BookingPage;
