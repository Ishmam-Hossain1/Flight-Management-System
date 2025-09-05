// src/pages/FlightDetailPage.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const FlightDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchCriteria = location.state || {};
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    const fetchMatchingFlights = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/flight");
        const allFlights = res.data;

        const filtered = allFlights.filter(
          (flight) =>
            flight.from.toLowerCase() === searchCriteria.from.toLowerCase() &&
            flight.to.toLowerCase() === searchCriteria.to.toLowerCase() &&
            flight.departure_date.slice(0, 10) === searchCriteria.departure_date &&
            flight.arrival_date.slice(0, 10) === searchCriteria.arrival_date
        );

        setFlights(filtered);
      } catch (error) {
        console.error("Error fetching flights:", error);
      }
    };

    fetchMatchingFlights();
  }, [searchCriteria]);

  const handleBook = (flight) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please log in to book a flight");
      navigate("/login");
      return;
    }

    navigate("/booking", { state: { flight } }); // ✅ Redirect to BookingPage
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Available Flights</h2>

      {flights.length === 0 ? (
        <p>No matching flights found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>From</th>
                <th>To</th>
                <th>Departure</th>
                <th>Arrival</th>
                <th>Seats</th>
                <th>Economy</th>
                <th>Business</th>
                <th>First</th>
                <th>Economy Price</th>
                <th>Business Price</th>
                <th>First Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((flight, idx) => (
                <tr key={idx}>
                  <td>{flight.from}</td>
                  <td>{flight.to}</td>
                  <td>{new Date(flight.departure_date).toLocaleDateString()}</td>
                  <td>{new Date(flight.arrival_date).toLocaleDateString()}</td>
                  <td>{flight.seat}</td>
                  <td>{flight.economy_class}</td>
                  <td>{flight.business_class}</td>
                  <td>{flight.first_class}</td>
                  <td>{flight.economy_ticket_price}</td>
                  <td>{flight.business_ticket_price}</td>
                  <td>{flight.first_ticket_price}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleBook(flight)}
                    >
                      Book
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FlightDetailPage;
