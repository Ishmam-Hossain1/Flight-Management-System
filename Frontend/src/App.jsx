import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./pages/Layout";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import FlightDetailPage from "./pages/FlightDetailPage";
import Authentication from "./pages/Authentication";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp"; 
import Profile from "./pages/Profile";
import Review from "./pages/Review";
import BookingPage from "./pages/BookingPage";
import CargoPlane from "./pages/CargoPlane";
import BookCargoPlane from "./pages/BookCargoPlane";
import Notifications from "./pages/Notifications";

// Admin pages
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

const App = () => {

  // Protected Admin Route Wrapper
  const AdminProtectedRoute = ({ children }) => {
    const adminId = localStorage.getItem("adminId");
    if (!adminId) {
      return <Navigate to="/admin-login" replace />;
    }
    return children;
  };

  return (
    <div data-theme="cupcake">
      <Routes>
        {/* Public routes (no layout / no navbar) */}
        <Route path="/" element={<Authentication />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} /> 
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Protected routes inside Layout (with navbar / consistent background) */}
        <Route element={<Layout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/review" element={<Review />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/flight-details" element={<FlightDetailPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/cargo-plane" element={<CargoPlane />} />
          <Route path="/cargo-plane/:id" element={<BookCargoPlane />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>

        {/* Admin Dashboard protected */}
        <Route
          path="/admin-dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />

        {/* Redirect unknown paths */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </div>
  );
};

export default App;
