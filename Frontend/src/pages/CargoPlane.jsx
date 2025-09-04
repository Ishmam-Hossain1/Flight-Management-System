import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Plane } from "lucide-react"; // ✅ background icon

const CargoPlane = () => {
  const [cargoPlanes, setCargoPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCargoPlanes();
  }, []);

  const fetchCargoPlanes = async () => {
    try {
      const { data } = await axios.get("http://localhost:5001/api/cargo-planes");
      setCargoPlanes(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch cargo planes:", error.response?.data || error.message);
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading cargo planes...</div>;
  if (!cargoPlanes.length) return <div className="text-center mt-10">No cargo planes available.</div>;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-100 to-blue-200">
      {/* ✅ Removed duplicate <Navbar /> (Layout already provides it) */}

      {/* Plane watermark in background */}
      <Plane className="absolute text-blue-500 opacity-25 w-[30rem] h-[30rem] -right-28 top-28 blur-[1px]" />

      {/* Main content card */}
      <div className="max-w-6xl mx-auto mt-10 p-6 bg-white/80 shadow-lg rounded-lg relative z-10">
        <h2 className="text-2xl font-bold text-center text-black mb-6">
          Available Cargo Planes
        </h2>

        <div className="overflow-x-auto">
          <table className="table-auto w-full border border-gray-300 bg-white/90 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">From</th>
                <th className="px-4 py-2 border">To</th>
                <th className="px-4 py-2 border">Departure</th>
                <th className="px-4 py-2 border">Arrival</th>
                <th className="px-4 py-2 border">Total Capacity (kg)</th>
                <th className="px-4 py-2 border">Available (kg)</th>
                <th className="px-4 py-2 border">Price per kg</th>
                <th className="px-4 py-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {cargoPlanes.map((plane) => (
                <tr
                  key={plane._id}
                  className="text-center hover:bg-blue-50 cursor-pointer transition"
                  onClick={() => navigate(`/cargo-plane/${plane._id}`)}
                >
                  <td className="px-4 py-2 border">{plane.from_location}</td>
                  <td className="px-4 py-2 border">{plane.to_location}</td>
                  <td className="px-4 py-2 border">{new Date(plane.departure_time).toLocaleString()}</td>
                  <td className="px-4 py-2 border">{new Date(plane.arrival_time).toLocaleString()}</td>
                  <td className="px-4 py-2 border">{plane.total_cargo_weight}</td>
                  <td className="px-4 py-2 border">{plane.cargo_weight_available}</td>
                  <td className="px-4 py-2 border">{plane.price_per_kg}</td>
                  <td className="px-4 py-2 border">{plane.booking_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CargoPlane;
