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
    } catch (err) {
      setError("Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-[#1E0B2E] p-8 rounded-2xl shadow-lg text-[#F5EFFF]">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Register to <span className="text-[#E67E22]">XERV</span>
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="p-2 bg-[#2A1744] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B5DE5]"
          required
        />
        <input
          type="text"
          name="profileName"
          placeholder="Profile Name"
          value={form.profileName}
          onChange={handleChange}
          className="p-2 bg-[#2A1744] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B5DE5]"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="p-2 bg-[#2A1744] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B5DE5]"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="p-2 bg-[#2A1744] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B5DE5]"
          required
        />
        <textarea
          name="bio"
          placeholder="Tell about yourself"
          value={form.bio}
          onChange={handleChange}
          className="p-2 bg-[#2A1744] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B5DE5]"
        />

        {error && <p className="text-[#E67E22] text-sm text-center">{error}</p>}

        <button
          type="submit"
          className="bg-[#2F8D46] hover:bg-[#2f8d46d2] text-gray-100 cursor-pointer py-2 rounded-lg font-semibold"
        >
          Register
        </button>
      </form>

      <p className="text-[#C3B8E2] text-sm text-center mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-[#E67E22] hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
