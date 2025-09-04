import { useState } from "react";
import FlightsTab from "./AdminFlightsTab";
import PassengersTab from "./AdminPassengersTab";
import CargoPlanesTab from "./AdminCargoPlanesTab";
import ReviewsTab from "./AdminReviewsTab";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("flights");

  const renderTab = () => {
    switch (activeTab) {
      case "flights":
        return <FlightsTab />;
      case "passengers":
        return <PassengersTab />;
      case "cargoPlanes":
        return <CargoPlanesTab />;
      case "reviews":
        return <ReviewsTab />;
      default:
        return <FlightsTab />;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-200 p-4">
        <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
        <ul className="space-y-2">
          <li>
            <button onClick={() => setActiveTab("flights")} className="w-full text-left">
              Flights
            </button>
          </li>
          <li>
            <button onClick={() => setActiveTab("passengers")} className="w-full text-left">
              Passengers
            </button>
          </li>
          <li>
            <button onClick={() => setActiveTab("cargoPlanes")} className="w-full text-left">
              Cargo Planes
            </button>
          </li>
          <li>
            <button onClick={() => setActiveTab("reviews")} className="w-full text-left">
              Reviews
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 p-6 bg-gray-100">
        {renderTab()}
      </main>
    </div>
  );
}
