import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ for logout redirect
import axios from "axios";

const CLASS_ORDER = ["economy", "business", "first"];

const UserProfile = () => {
  const navigate = useNavigate(); // ✅ for logout
  const [user, setUser] = useState(null);
  const [flight, setFlight] = useState(null); // passenger flight
  const [cargoFlight, setCargoFlight] = useState(null); // cargo flight
  const [availability, setAvailability] = useState(null);
  const [seatAction, setSeatAction] = useState("");
  const [targetClass, setTargetClass] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNo: "",
  });

  // Load user and flight info
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setFormData({
        name: storedUser.name || "",
        email: storedUser.email || "",
        password: storedUser.password || "",
        phoneNo: storedUser.phoneNo || "",
      });

      if (storedUser.flightId) fetchFlightDetails(storedUser.flightId);
      if (storedUser.cargo_plane_flight_id) fetchCargoFlightDetails(storedUser.cargo_plane_flight_id);
    }
  }, []);

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("user"); // clear localStorage
    setUser(null); // reset state
    navigate("/login"); // redirect to login page
  };

  // Fetch passenger flight
  const fetchFlightDetails = async (flightId) => {
    try {
      const { data } = await axios.get(`http://localhost:5001/api/flight/${flightId}`);
      setFlight(data);
      fetchAvailability(flightId);
    } catch (error) {
      console.error("Failed to fetch flight info", error.response?.data || error.message);
    }
  };

  // Fetch cargo flight
  const fetchCargoFlightDetails = async (flightId) => {
    try {
      const { data } = await axios.get(`http://localhost:5001/api/cargo-planes/${flightId}`);
      setCargoFlight(data);
    } catch (error) {
      console.error("Failed to fetch cargo flight info", error.response?.data || error.message);
    }
  };

  // Fetch seat availability
  const fetchAvailability = async (flightId) => {
    try {
      const { data } = await axios.get(`http://localhost:5001/api/flight/${flightId}/availability`);
      setAvailability(data);
    } catch (error) {
      console.error("Failed to fetch availability", error.response?.data || error.message);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:5001/api/passenger/${user._id}`, formData);
      const updatedUser = res.data.passenger;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      if (updatedUser.flightId) fetchFlightDetails(updatedUser.flightId);
      if (updatedUser.cargo_plane_flight_id) fetchCargoFlightDetails(updatedUser.cargo_plane_flight_id);

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Update failed:", error.response?.data || error.message);
      alert("Failed to update profile.");
    }
  };

  const isBooked = user?.seatBooked > 0;
  const currentClass = user?.flightClass || null;

  const allowedTargets = useMemo(() => {
    if (!isBooked || !currentClass) return [];
    const idx = CLASS_ORDER.indexOf(currentClass);
    let candidates = [];
    if (seatAction === "upgrade") candidates = CLASS_ORDER.slice(idx + 1);
    if (seatAction === "downgrade") candidates = CLASS_ORDER.slice(0, idx);
    if (!availability) return candidates;
    return candidates.filter((c) => (availability?.[c]?.available ?? 0) > 0);
  }, [seatAction, currentClass, isBooked, availability]);

  const handleSeatAction = async (e) => {
    e.preventDefault();
    if (!isBooked) return alert("You have not booked a seat yet.");
    if (!flight?._id) return alert("Flight ID is missing for this booking.");

    try {
      let endpoint = "";
      let body = {};

      if (seatAction === "cancel") {
        if (!confirm("Cancel your current seat?")) return;
        endpoint = `http://localhost:5001/api/passenger/${user._id}/cancel-seat`;
        body = { passengerId: user._id, flightId: flight._id };
      } else {
        if (!targetClass) return alert("Choose a target class first.");
        endpoint = `http://localhost:5001/api/passenger/${user._id}/seat-class`;
        body = { passengerId: user._id, flightId: flight._id, newClass: targetClass };
      }

      const { data } = await axios.put(endpoint, body);
      const updatedUser = data.passenger;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      if (updatedUser.flightId) fetchFlightDetails(updatedUser.flightId);
      if (updatedUser.cargo_plane_flight_id) fetchCargoFlightDetails(updatedUser.cargo_plane_flight_id);

      setSeatAction("");
      setTargetClass("");
      alert("Seat updated!");
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.message || "Seat update failed.");
    }
  };

  if (!user) return <div className="text-center mt-10">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded space-y-8">
      <h2 className="text-2xl font-bold text-center text-black">User Profile</h2>

      {/* Profile Form */}
      <form onSubmit={handleUpdateProfile} className="space-y-4">
        <input className="input input-bordered w-full" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
        <input className="input input-bordered w-full" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        <input className="input input-bordered w-full" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
        <input className="input input-bordered w-full" type="text" name="phoneNo" value={formData.phoneNo} onChange={handleChange} placeholder="Phone Number" required />
        <button type="submit" className="btn btn-primary w-full">Update Profile</button>
      </form>

      {/* Flights side by side */}
      <div className="grid grid-cols-2 gap-4">
        {isBooked && flight && (
          <div className="p-4 rounded border">
            <h3 className="text-lg font-semibold mb-2 text-black">Passenger Flight</h3>
            <p className="text-black"><strong>From:</strong> {flight.from}</p>
            <p className="text-black"><strong>To:</strong> {flight.to}</p>
            <p className="text-black"><strong>Departure:</strong> {new Date(flight.departure_date).toLocaleString()}</p>
            <p className="text-black"><strong>Arrival:</strong> {new Date(flight.arrival_date).toLocaleString()}</p>
          </div>
        )}

        {user.cargo_plane_booking_status === "Booked" && cargoFlight && (
          <div className="p-4 rounded border">
            <h3 className="text-lg font-semibold mb-2 text-black">Cargo Flight</h3>
            <p className="text-black"><strong>From:</strong> {cargoFlight.from_location}</p>
            <p className="text-black"><strong>To:</strong> {cargoFlight.to_location}</p>
            <p className="text-black"><strong>Departure:</strong> {new Date(cargoFlight.departure_time).toLocaleString()}</p>
            <p className="text-black"><strong>Arrival:</strong> {new Date(cargoFlight.arrival_time).toLocaleString()}</p>
            <p className="text-black"><strong>Booked Cargo Weight:</strong> {user.cargo_plane_weight} kg</p>
          </div>
        )}
      </div>

      {/* Seat Status + Actions */}
      <div className="p-4 rounded border">
        <h3 className="text-lg font-semibold mb-2 text-black">Seat Status</h3>
        <p className="mb-2 text-black">
          Status: <span className={isBooked ? "text-green-600 font-medium" : "text-red-600 font-medium"}>{isBooked ? "Booked" : "Not Booked"}</span>
        </p>
        <p className="mb-4 text-black">Membership Tag: <span className="font-medium capitalize">{user.customTag || "None"}</span></p>

        {isBooked && (
          <>
            <p className="mb-4 text-black">Current Class: <span className="font-medium capitalize">{currentClass}</span></p>
            <form onSubmit={handleSeatAction} className="space-y-3">
              <select className="select select-bordered w-full" value={seatAction} onChange={(e) => { setSeatAction(e.target.value); setTargetClass(""); }}>
                <option value="">-- Select Action --</option>
                <option value="upgrade">Upgrade</option>
                <option value="downgrade">Downgrade</option>
                <option value="cancel">Cancel Seat</option>
              </select>

              {seatAction && seatAction !== "cancel" && (
                <select className="select select-bordered w-full capitalize" value={targetClass} onChange={(e) => setTargetClass(e.target.value)}>
                  <option value="">-- Select Target Class --</option>
                  {allowedTargets.map((c) => (
                    <option key={c} value={c} className="capitalize">{c} {availability ? `(available: ${availability?.[c]?.available ?? 0})` : ""}</option>
                  ))}
                </select>
              )}

              <button type="submit" className="btn btn-outline w-full">Apply</button>
            </form>
          </>
        )}

        {/* ✅ Logout button placed at the bottom */}
        <div className="mt-4">
          <button onClick={handleLogout} className="btn btn-error w-full text-white">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
