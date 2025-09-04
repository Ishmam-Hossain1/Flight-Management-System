import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Plane } from "lucide-react"; // ✅ keep only Plane

const user = JSON.parse(localStorage.getItem("user"));

const weatherIcons = {
  0: "☀️",
  1: "🌤️",
  2: "🌤️",
  3: "☁️",
  45: "🌫️",
  48: "🌫️",
  51: "🌦️",
  53: "🌦️",
  55: "🌦️",
  61: "🌧️",
  63: "🌧️",
  65: "🌧️",
  71: "❄️",
  73: "❄️",
  75: "❄️",
  80: "🌦️",
  81: "🌦️",
  82: "🌦️",
  95: "⛈️",
  96: "⛈️",
  99: "⛈️"
};

const HomePage = () => {
  const [flight, setFlight] = useState([]);
  const [search, setSearch] = useState({
    from: "",
    to: "",
    departure_date: "",
    arrival_date: "",
    flight_class: ""
  });

  const [weather, setWeather] = useState(null);
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

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const lat = 23.8103; // Dhaka
        const lon = 90.4125;

        const res = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Asia/Dhaka`
        );
        setWeather(res.data.daily);
      } catch (error) {
        console.error("Error fetching weather", error);
      }
    };

    fetchWeather();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearch((prevSearch) => ({
      ...prevSearch,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate("/flight-details", { state: search });
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-100 to-blue-200">
      <Plane className="absolute text-blue-500 opacity-25 w-[30rem] h-[30rem] -right-28 top-28 blur-[1px]" />

      {/* Main content card */}
      <div className="max-w-4xl mx-auto p-6 bg-white/80 rounded-lg shadow-lg relative z-10 mt-10">
        <h2 className="text-2xl font-bold mb-4">Search Flights</h2>
        <form
          onSubmit={handleSearch}
          className="grid gap-4 grid-cols-1 md:grid-cols-2"
        >
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

      {/* Weather Forecast */}
      {weather && (
        <div className="max-w-4xl mx-auto p-6 bg-white/80 rounded-lg shadow-lg relative z-10 mt-6">
          <h2 className="text-2xl font-bold mb-4">7-Day Weather Forecast</h2>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {weather.time.map((day, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center p-2 border rounded-lg"
              >
                <p className="font-bold">
                  {new Date(day).toLocaleDateString("en-US", { weekday: "short" })}
                </p>
                <p className="text-2xl">
                  {weatherIcons[weather.weathercode[idx]]}
                </p>
                <p>{Math.round(weather.temperature_2m_max[idx])}°C</p>
                <p className="text-gray-500">
                  {Math.round(weather.temperature_2m_min[idx])}°C
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
