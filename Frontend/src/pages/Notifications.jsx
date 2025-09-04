import { useEffect, useState } from "react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get the logged-in passenger
  const stored = JSON.parse(localStorage.getItem("user"));
  const passengerId = stored?._id;

  useEffect(() => {
    if (!passengerId) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    const fetchNotifications = async () => {
      try {
        const res = await fetch(
          `http://localhost:5001/api/passenger/${passengerId}/notifications`
        );
        if (!res.ok) throw new Error("Failed to fetch notifications");
        const data = await res.json();

        // Reverse to show latest notifications first
        setNotifications(
          Array.isArray(data.notifications)
            ? data.notifications.slice().reverse()
            : []
        );
      } catch (err) {
        console.error(err);
        setError("Failed to load notifications. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [passengerId]);

  // Delete a notification by its original index
  const handleDelete = async (reversedIndex) => {
    try {
      // Convert reversed index to original index
      const originalIndex = notifications.length - 1 - reversedIndex;

      const res = await fetch(
        `http://localhost:5001/api/passenger/${passengerId}/notifications/${originalIndex}`,
        { method: "DELETE" }
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to delete notification");

      // Remove notification from frontend state immediately
      setNotifications((prev) =>
        prev.filter((_, idx) => idx !== reversedIndex)
      );
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Your Notifications</h2>

      {loading && <p className="p-4">Loading notifications...</p>}

      {!loading && error && <p className="p-4 text-red-500">{error}</p>}

      {!loading && !error && notifications.length === 0 && (
        <p className="text-gray-500">You have no notifications yet.</p>
      )}

      {!loading && !error && notifications.length > 0 && (
        <ul className="space-y-3">
          {notifications.map((note, idx) => (
            <li
              key={idx}
              className="p-3 border rounded-lg shadow-sm bg-white flex justify-between items-center"
            >
              <span>{note}</span>
              <button
                className="text-red-500 font-bold ml-4"
                onClick={() => handleDelete(idx)} // Pass reversed index
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
