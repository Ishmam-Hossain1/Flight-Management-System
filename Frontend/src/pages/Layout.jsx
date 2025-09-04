import { Plane } from "lucide-react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const Layout = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-100 to-blue-200">
      {/* Background watermark */}
      <Plane className="absolute text-blue-500 opacity-20 w-[30rem] h-[30rem] -right-28 top-28 blur-[1px]" />

      {/* Navbar visible everywhere */}
      <Navbar />

      {/* Main page content */}
      <main className="relative z-10 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
