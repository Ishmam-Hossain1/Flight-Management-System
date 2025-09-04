// src/pages/AdminCargoPlanesTab.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const AdminCargoPlanesTab = () => {
  const [cargoPlanes, setCargoPlanes] = useState([]);
  const [formData, setFormData] = useState({
    from_location: "",
    to_location: "",
    departure_time: "",
    arrival_time: "",
    total_cargo_weight: "",
    cargo_weight_available: "",
    price_per_kg: "",
    booking_status: "Available",
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch all cargo planes
  const fetchCargoPlanes = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/admin/cargo-planes");
      setCargoPlanes(res.data);
    } catch (err) {
      console.error("Fetch cargo planes error:", err);
    }
  };

  useEffect(() => {
    fetchCargoPlanes();
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
          `http://localhost:5001/api/admin/cargo-planes/${editingId}`,
          formData
        );
        setCargoPlanes(cargoPlanes.map(c => (c._id === editingId ? res.data : c)));
        setEditingId(null);
      } else {
        const res = await axios.post(
          "http://localhost:5001/api/admin/cargo-planes",
          formData
        );
        setCargoPlanes([...cargoPlanes, res.data]);
      }
      setFormData({
        from_location: "",
        to_location: "",
        departure_time: "",
        arrival_time: "",
        total_cargo_weight: "",
        cargo_weight_available: "",
        price_per_kg: "",
        booking_status: "Available",
      });
    } catch (err) {
      console.error("Submit cargo plane error:", err);
    }
  };

  const handleEdit = (plane) => {
    setFormData({
      from_location: plane.from_location,
      to_location: plane.to_location,
      departure_time: plane.departure_time.slice(0,16),
      arrival_time: plane.arrival_time.slice(0,16),
      total_cargo_weight: plane.total_cargo_weight,
      cargo_weight_available: plane.cargo_weight_available,
      price_per_kg: plane.price_per_kg,
      booking_status: plane.booking_status,
    });
    setEditingId(plane._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/admin/cargo-planes/${id}`);
      setCargoPlanes(cargoPlanes.filter(c => c._id !== id));
    } catch (err) {
      console.error("Delete cargo plane error:", err);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        {editingId ? "Edit Cargo Plane" : "Add New Cargo Plane"}
      </h2>

      {/* Cargo Plane Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {[
          { label: "From Location", name: "from_location", type: "text" },
          { label: "To Location", name: "to_location", type: "text" },
          { label: "Departure Time", name: "departure_time", type: "datetime-local" },
          { label: "Arrival Time", name: "arrival_time", type: "datetime-local" },
          { label: "Total Cargo Weight (kg)", name: "total_cargo_weight", type: "number" },
          { label: "Available Weight (kg)", name: "cargo_weight_available", type: "number" },
          { label: "Price per Kg", name: "price_per_kg", type: "number" },
          { label: "Booking Status", name: "booking_status", type: "text" },
        ].map(field => (
          <div key={field.name} className="flex flex-col">
            <label className="mb-1 font-medium">{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleInputChange}
              required
              className="border p-2 rounded"
            />
          </div>
        ))}
        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {editingId ? "Update Cargo Plane" : "Add Cargo Plane"}
        </button>
      </form>

      {/* Cargo Planes List */}
      <ul className="space-y-2">
        {cargoPlanes.map(c => (
          <li key={c._id} className="flex justify-between border p-2 items-center">
            <div>
              {c.from_location} → {c.to_location} | Available: {c.cargo_weight_available}/{c.total_cargo_weight} kg | ${c.price_per_kg}/kg | Status: {c.booking_status}
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(c)}
                className="bg-blue-500 text-white px-2 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(c._id)}
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

export default AdminCargoPlanesTab;

