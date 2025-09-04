// src/pages/SignUp.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Plane } from "lucide-react"; // ✅ plane background

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNo: "", // Mobile number
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send signup request to backend
      const res = await axios.post("http://localhost:5001/api/auth/signup", formData);

      const newUser = res.data.passenger; // newly created passenger
      localStorage.setItem("user", JSON.stringify(newUser)); // store user locally

      alert("Account created successfully!");
      navigate("/home"); // redirect to homepage
    } catch (error) {
      console.error("Signup error", error);
      alert(error.response?.data?.message || "Failed to create account. Try again.");
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
      {/* ✅ Plane watermark in background */}
      <Plane className="absolute text-blue-500 opacity-25 w-[30rem] h-[30rem] -right-28 top-28 blur-[1px]" />

      {/* ✅ Signup card */}
      <div className="bg-white/90 p-8 rounded-lg shadow-lg w-full max-w-md relative z-10">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          Create an Account
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />
          <input
            type="tel"
            name="phoneNo"
            placeholder="Mobile Number"
            value={formData.phoneNo}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Sign Up
          </button>
        </form>
        <p className="text-sm text-center mt-4 text-black">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
