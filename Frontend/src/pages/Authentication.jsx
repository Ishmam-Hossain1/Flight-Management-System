import { useNavigate } from "react-router-dom";

const Authentication = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-3xl font-bold">Welcome to Ayaan Flights</h1>
      <div className="flex gap-4">
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
