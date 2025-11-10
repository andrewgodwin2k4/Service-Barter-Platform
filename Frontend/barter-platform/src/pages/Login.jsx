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
    } 
    catch (err) {
        setError("Invalid email or password");
    }
  };

  return (
    
    <div className="max-w-md mx-auto bg-gray-900 p-8 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Login to <span className="text-green-600">XERV</span></h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button type="submit" className="bg-green-800 hover:bg-green-900 cursor-pointer py-2 rounded-lg font-semibold">Login</button>
      
      </form>
      <p className="text-gray-400 text-sm text-center mt-4">
        Don’t have an account?{" "}
        <Link to="/register" className="text-cyan-600 hover:underline">
          Register
        </Link>
      </p>
    </div>
    
  );
}
