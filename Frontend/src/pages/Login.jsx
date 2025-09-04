import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Plane } from "lucide-react"; // ✅ plane background

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5001/api/passenger/login", {
        email: formData.email,
        password: formData.password
      });

      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/home");
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
      {/* ✅ Plane watermark in background */}
      <Plane className="absolute text-blue-500 opacity-25 w-[30rem] h-[30rem] -right-28 top-28 blur-[1px]" />

      {/* ✅ Login card */}
      <form
        onSubmit={handleLogin}
        className="bg-white/90 p-8 rounded-lg shadow-lg w-full max-w-md relative z-10"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          Login
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 rounded w-full mb-4"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="border p-2 rounded w-full mb-6"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded w-full hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
