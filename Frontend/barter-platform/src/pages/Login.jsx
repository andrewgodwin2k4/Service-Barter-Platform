import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "@/lib/api";
import { AuthContext } from "@/context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", form);
      setToken(res.data.token);
      navigate("/");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-[#151515] p-8 rounded-2xl shadow-lg text-[#F0F0F0] border border-[#333333]">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Login to <span className="text-[#E67E22]">XERV</span>
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="p-2 bg-[#0D0D0D] border border-[#404040] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E67E22] text-[#F0F0F0] placeholder-[#B0B0B0]"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="p-2 bg-[#0D0D0D] border border-[#404040] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E67E22] text-[#F0F0F0] placeholder-[#B0B0B0]"
          required
        />

        {error && <p className="text-[#DC2626] text-sm text-center">{error}</p>}

        <button
          type="submit"
          className="bg-[#1E5430] hover:bg-[#1e5430d1] text-[#E8F5E9] cursor-pointer py-2 rounded-lg font-semibold"
        >
          Login
        </button>
      </form>

      <p className="text-[#B0B0B0] text-sm text-center mt-4">
        Don't have an account?{" "}
        <Link to="/register" className="text-[#E67E22] hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}