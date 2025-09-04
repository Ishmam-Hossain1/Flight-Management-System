// src/pages/AdminPassengersTab.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const AdminPassengersTab = () => {
  const [passengers, setPassengers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    email: "",
    phoneNo: "",
    flightClass: "",
    seatBooked: 0,
    cargo_plane_booking_status: "Not Booked",
    cargo_plane_weight: 0,
    extra_luggage: 0,
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch passengers
  const fetchPassengers = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/admin/passengers");
      setPassengers(res.data);
    } catch (err) {
      console.error("Fetch passengers error:", err);
    }
  };

  useEffect(() => {
    fetchPassengers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await axios.put(
          `http://localhost:5001/api/admin/passengers/${editingId}`,
          formData
        );
        setPassengers(passengers.map(p => (p._id === editingId ? res.data : p)));
        setEditingId(null);
      } else {
        const res = await axios.post(
          "http://localhost:5001/api/admin/passengers",
          formData
        );
        setPassengers([...passengers, res.data]);
      }

      setFormData({
        name: "",
        password: "",
        email: "",
        phoneNo: "",
        flightClass: "",
        seatBooked: 0,
        cargo_plane_booking_status: "Not Booked",
        cargo_plane_weight: 0,
        extra_luggage: 0,
      });
    } catch (err) {
      console.error("Submit passenger error:", err);
    }
  };

  const handleEdit = (passenger) => {
    setFormData({
      name: passenger.name,
      password: passenger.password,
      email: passenger.email,
      phoneNo: passenger.phoneNo,
      flightClass: passenger.flightClass || "",
      seatBooked: passenger.seatBooked || 0,
      cargo_plane_booking_status: passenger.cargo_plane_booking_status || "Not Booked",
      cargo_plane_weight: passenger.cargo_plane_weight || 0,
      extra_luggage: passenger.extra_luggage || 0,
    });
    setEditingId(passenger._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/admin/passengers/${id}`);
      setPassengers(passengers.filter(p => p._id !== id));
    } catch (err) {
      console.error("Delete passenger error:", err);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        {editingId ? "Edit Passenger" : "Add New Passenger"}
      </h2>

      {/* Passenger Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {[
          { label: "Name", name: "name", type: "text" },
          { label: "Password", name: "password", type: "password" },
          { label: "Email", name: "email", type: "email" },
          { label: "Phone Number", name: "phoneNo", type: "text" },
          { label: "Flight Class", name: "flightClass", type: "text" },
          { label: "Seat Booked", name: "seatBooked", type: "number" },
          { label: "Cargo Booking Status", name: "cargo_plane_booking_status", type: "text" },
          { label: "Cargo Plane Weight", name: "cargo_plane_weight", type: "number" },
          { label: "Extra Luggage", name: "extra_luggage", type: "number" },
        ].map(field => (
          <div key={field.name} className="flex flex-col">
            <label className="mb-1 font-medium">{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleInputChange}
              required={field.name !== "flightClass" && field.name !== "seatBooked"}
              className="border p-2 rounded"
            />
          </div>
        ))}
        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {editingId ? "Update Passenger" : "Add Passenger"}
        </button>
      </form>

      {/* Passenger List */}
      <ul className="space-y-2">
        {passengers.map(p => (
          <li key={p._id} className="flex justify-between border p-2 items-center">
            <div>
              {p.name} | {p.email} | Phone: {p.phoneNo} | Flight Class: {p.flightClass || "-"} | Seats: {p.seatBooked}
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(p)}
                className="bg-blue-500 text-white px-2 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p._id)}
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
};

export default AdminPassengersTab;
