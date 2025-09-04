import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BookCargoPlane = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plane, setPlane] = useState(null);
  const [weight, setWeight] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Get logged-in passenger from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const passengerId = user?._id;

  // Fetch cargo plane by ID
  useEffect(() => {
    const fetchPlane = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/cargo-planes/${id}`);
        setPlane(res.data);
      } catch (err) {
        setError("Failed to load cargo plane");
      }
    };
    fetchPlane();
  }, [id]);

  const handleBooking = async () => {
    setError("");
    setSuccess("");

    if (!weight || Number(weight) <= 0) {
      setError("Enter a valid weight in kg");
      return;
    }

    if (!passengerId) {
      setError("Passenger not logged in");
      return;
    }

    try {
      const res = await axios.post(`http://localhost:5001/api/cargo-planes/${id}/book`, {
        weight: Number(weight),
        passengerId,
      });

      setSuccess(`Booking successful! Total price: ${res.data.total_price}`);
      setPlane(res.data.updatedPlane); // Refresh plane details
      setWeight("");

      // Update passenger info in localStorage so UserProfile shows updated cargo info
      localStorage.setItem("user", JSON.stringify(res.data.passenger));
    } catch (err) {
      setError(err.response?.data?.error || "Booking failed");
    }
  };

  if (!plane) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300"
        >
          ← Back
        </button>

        <h2 className="text-2xl font-bold">Cargo Plane Details</h2>

        <div className="border rounded p-4 space-y-2">
          <p><strong>From:</strong> {plane.from_location}</p>
          <p><strong>To:</strong> {plane.to_location}</p>
          <p><strong>Departure:</strong> {plane.departure_time?.split("T")[0]}</p>
          <p><strong>Arrival:</strong> {plane.arrival_time?.split("T")[0]}</p>
          <p><strong>Total Capacity:</strong> {plane.total_cargo_weight} kg</p>
          <p><strong>Available:</strong> {plane.cargo_weight_available} kg</p>
          <p><strong>Price per kg:</strong> {plane.price_per_kg}</p>
          <p><strong>Status:</strong> {plane.booking_status}</p>
        </div>

        <div className="border rounded p-4 space-y-4">
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="border p-2 w-full rounded"
            placeholder="Enter weight in kg"
          />
          <button
            onClick={handleBooking}
            disabled={
              !weight ||
              Number(weight) > plane.cargo_weight_available ||
              plane.booking_status === "Full"
            }
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            Book Cargo
          </button>

          {error && <p className="text-red-600">{error}</p>}
          {success && <p className="text-green-600">{success}</p>}
        </div>
      </div>
    </div>
  );
};

export default BookCargoPlane;
