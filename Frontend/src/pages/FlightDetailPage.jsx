// src/pages/FlightDetailPage.jsx
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const FlightDetailPage = () => {
  const location = useLocation();
  const searchCriteria = location.state || {};
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    const fetchMatchingFlights = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/flight");
        console.log("All flights from backend:", res.data);
        const allFlights = res.data;

        // Filter flights based on searchCriteria
        const filtered = allFlights.filter(flight =>
          flight.from.toLowerCase() === searchCriteria.from.toLowerCase() &&
          flight.to.toLowerCase() === searchCriteria.to.toLowerCase() &&
          flight.departure_date.slice(0, 10) === searchCriteria.departure_date &&
          flight.arrival_date.slice(0, 10) === searchCriteria.arrival_date
        );

        setFlights(filtered);
      } catch (error) {
        console.error("Error fetching filtered flights:", error);
      }
    };

    fetchMatchingFlights();
  }, [searchCriteria]);

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
