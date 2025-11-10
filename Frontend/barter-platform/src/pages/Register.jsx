import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/lib/api";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    profileName: "",
    bio: ""
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } 
    catch (err) {
      setError("Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-900 p-8 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Register to <span className="text-green-600">XERV</span></h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="p-2 bg-gray-800 rounded-lg focus:outline-none"
            required
        />
        <input
            type="text"
            name="profileName"
            placeholder="Profile Name"
            value={form.profileName}
            onChange={handleChange}
            className="p-2 bg-gray-800 rounded-lg focus:outline-none"
        />
        <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="p-2 bg-gray-800 rounded-lg focus:outline-none"
            required
        />
        <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="p-2 bg-gray-800 rounded-lg focus:outline-none"
            required
        />
        <textarea
            name="bio"
            placeholder="Tell about yourself"
            value={form.bio}
            onChange={handleChange}
            className="p-2 bg-gray-800 rounded-lg focus:outline-none"
        />

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button type="submit" className="bg-green-800 hover:bg-green-900 cursor-pointer py-2 rounded-lg font-semibold">Register</button>
      
      </form>

      <p className="text-gray-400 text-sm text-center mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-cyan-600 hover:underline">
          Login
        </Link>
      </p>

    </div>
  );
}
