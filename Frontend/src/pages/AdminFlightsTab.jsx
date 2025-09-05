// src/pages/admin/FlightsTab.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function FlightsTab() {
  const [flights, setFlights] = useState([]);
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    departure_date: "",
    arrival_date: "",
    seat: "",
    first_class: "",
    business_class: "",
    economy_class: "",
    first_ticket_price: "",
    business_ticket_price: "",
    economy_ticket_price: "",
    delay: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch flights
  const fetchFlights = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/admin/flights");
      setFlights(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  // Handle input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await axios.put(
          `http://localhost:5001/api/admin/flights/${editingId}`,
          formData
        );
        setFlights(flights.map((f) => (f._id === editingId ? res.data : f)));
        setEditingId(null);
      } else {
        const res = await axios.post(
          "http://localhost:5001/api/admin/flights",
          formData
        );
        setFlights([...flights, res.data]);
      }
      // Reset form
      setFormData({
        from: "",
        to: "",
        departure_date: "",
        arrival_date: "",
        seat: "",
        first_class: "",
        business_class: "",
        economy_class: "",
        first_ticket_price: "",
        business_ticket_price: "",
        economy_ticket_price: "",
        delay: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Edit flight
  const handleEdit = (flight) => {
    setFormData({
      from: flight.from,
      to: flight.to,
      departure_date: flight.departure_date.slice(0, 16),
      arrival_date: flight.arrival_date.slice(0, 16),
      seat: flight.seat,
      first_class: flight.first_class,
      business_class: flight.business_class,
      economy_class: flight.economy_class,
      first_ticket_price: flight.first_ticket_price,
      business_ticket_price: flight.business_ticket_price,
      economy_ticket_price: flight.economy_ticket_price,
      delay: flight.delay || "",
    });
    setEditingId(flight._id);
  };

  // Delete flight
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/admin/flights/${id}`);
      setFlights(flights.filter((f) => f._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">
        {editingId ? "Update Flight" : "Add New Flight"}
      </h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
      >
        {/* From */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">From</label>
          <input
            name="from"
            type="text"
            value={formData.from}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />
        </div>

        {/* To */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">To</label>
          <input
            name="to"
            type="text"
            value={formData.to}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />
        </div>

        {/* Departure Date */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Departure Date</label>
          <input
            name="departure_date"
            type="datetime-local"
            value={formData.departure_date}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />
        </div>

        {/* Arrival Date */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Arrival Date</label>
          <input
            name="arrival_date"
            type="datetime-local"
            value={formData.arrival_date}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />
        </div>

        {/* Seats */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Total Seats</label>
          <input
            name="seat"
            type="number"
            value={formData.seat}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">First Class Seats</label>
          <input
            name="first_class"
            type="number"
            value={formData.first_class}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Business Class Seats</label>
          <input
            name="business_class"
            type="number"
            value={formData.business_class}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Economy Class Seats</label>
          <input
            name="economy_class"
            type="number"
            value={formData.economy_class}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />
        </div>

        {/* Prices */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">First Class Price</label>
          <input
            name="first_ticket_price"
            type="number"
            value={formData.first_ticket_price}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Business Class Price</label>
          <input
            name="business_ticket_price"
            type="number"
            value={formData.business_ticket_price}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Economy Class Price</label>
          <input
            name="economy_ticket_price"
            type="number"
            value={formData.economy_ticket_price}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />
        </div>

        {/* Optional delay */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Delay (minutes)</label>
          <input
            name="delay"
            type="number"
            value={formData.delay}
            onChange={handleInputChange}
            className="border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-green-600 text-white px-4 py-2 rounded"
        >
          {editingId ? "Update Flight" : "Add Flight"}
        </button>
      </form>

      {/* Flights List */}
      <h2 className="text-xl font-semibold mb-2">Flights List</h2>
      <ul className="space-y-2">
        {flights.map((f) => (
          <li
            key={f._id}
            className="flex flex-col md:flex-row justify-between border p-2 rounded"
          >
            <div>
              <div className="font-medium">
                {f.from} → {f.to}
              </div>
              <div>Seats: {f.seat}</div>
              <div>
                Prices: ${f.first_ticket_price}/{f.business_ticket_price}/
                {f.economy_ticket_price}
              </div>
            </div>
            <div className="space-x-2 mt-2 md:mt-0">
              <button
                onClick={() => handleEdit(f)}
                className="bg-blue-500 text-white px-2 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(f._id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
