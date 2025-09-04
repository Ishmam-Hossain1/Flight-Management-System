import { useNavigate } from "react-router-dom";
import { Plane } from "lucide-react"; // ✅ plane background

const Authentication = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex flex-col items-center justify-center gap-6">
      {/* ✅ Plane watermark */}
      <Plane className="absolute text-blue-500 opacity-25 w-[30rem] h-[30rem] -right-28 top-28 blur-[1px]" />

      <h1 className="text-3xl font-bold text-black relative z-10">
        Welcome to Chrono Fleet Airlines
      </h1>

      <div className="flex gap-4 relative z-10">
        <button
          className="btn btn-primary"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Authentication;
