import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const HomePage = () => {
  const [flight, setFlight] = useState([]);
  const [search, setSearch] = useState({
    from: "",
    to: "",
    departure_date: "",
    arrival_date: "",
    flight_class: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/flight");
        setFlight(res.data);
      } catch (error) {
        console.log("Error fetching flights", error);
      }
    };

    fetchFlight();
  }, []);

  const handleChange = (e) => {
    setSearch({
      ...search,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to FlightDetailPage with search criteria as state
    navigate("/flight-details", { state: search });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Search Flights</h2>
        <form onSubmit={handleSearch} className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <input
            type="text"
            name="from"
            value={search.from}
            onChange={handleChange}
            placeholder="From Location"
            className="input input-bordered"
            required
          />
          <input
            type="text"
            name="to"
            value={search.to}
            onChange={handleChange}
            placeholder="To Location"
            className="input input-bordered"
            required
          />
          <input
            type="date"
            name="departure_date"
            value={search.departure_date}
            onChange={handleChange}
            className="input input-bordered"
            required
          />
          <input
            type="date"
            name="arrival_date"
            value={search.arrival_date}
            onChange={handleChange}
            className="input input-bordered"
            required
          />
          <select
            name="flight_class"
            value={search.flight_class}
            onChange={handleChange}
            className="input input-bordered"
            required
          >
            <option value="">Select Class</option>
            <option value="economy">Economy</option>
            <option value="business">Business</option>
            <option value="first">First</option>
          </select>

          <button
            type="submit"
            className="btn btn-primary col-span-1 md:col-span-2"
          >
            Search Flights
          </button>
        </form>
      </div>
    </div>
  );
};

export default HomePage;
