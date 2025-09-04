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

  const fetchFlights = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/admin/flights");
      setFlights(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchFlights(); }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await axios.put(`http://localhost:5001/api/admin/flights/${editingId}`, formData);
        setFlights(flights.map(f => f._id === editingId ? res.data : f));
        setEditingId(null);
      } else {
        const res = await axios.post("http://localhost:5001/api/admin/flights", formData);
        setFlights([...flights, res.data]);
      }
      setFormData({
        from: "", to: "", departure_date: "", arrival_date: "",
        seat: "", first_class: "", business_class: "", economy_class: "",
        first_ticket_price: "", business_ticket_price: "", economy_ticket_price: "", delay: "",
      });
    } catch (err) { console.error(err); }
  };

  const handleEdit = (flight) => {
    setFormData({
      ...flight,
      departure_date: flight.departure_date.slice(0,16),
      arrival_date: flight.arrival_date.slice(0,16)
    });
    setEditingId(flight._id);
  };

  const handleDelete = async (id) => {
    try { await axios.delete(`http://localhost:5001/api/admin/flights/${id}`);
      setFlights(flights.filter(f => f._id !== id));
    } catch (err) { console.error(err); }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">{editingId ? "Update Flight" : "Add New Flight"}</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {Object.keys(formData).map(key => (
          <div key={key} className="flex flex-col">
            <label className="mb-1 font-medium">{key.replace(/_/g," ").toUpperCase()}</label>
            <input
              name={key} type={key.includes("date") ? "datetime-local" : "number"}
              value={formData[key]} onChange={handleInputChange}
              className="border p-2 rounded" required={key!=="delay"}
            />
          </div>
        ))}
        <button type="submit" className="col-span-1 md:col-span-2 bg-green-600 text-white px-4 py-2 rounded">
          {editingId ? "Update Flight" : "Add Flight"}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">Flights List</h2>
      <ul className="space-y-2">
        {flights.map(f => (
          <li key={f._id} className="flex justify-between border p-2 items-center">
            <div>{f.from} → {f.to} | Seats: {f.seat} | Prices: ${f.first_ticket_price}/{f.business_ticket_price}/{f.economy_ticket_price}</div>
            <div className="space-x-2">
              <button onClick={() => handleEdit(f)} className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
              <button onClick={() => handleDelete(f._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
