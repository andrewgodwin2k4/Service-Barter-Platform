import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { UserPlus, User, Mail, Lock, AtSign, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    profileName: "",
    bio: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const id = toast.loading("Creating your account...");

    try {
      await api.post("/auth/register", form);

      toast.dismiss(id);
      toast.success("Account created successfully!");

      navigate("/login");
    } catch (err) {
      toast.dismiss(id);
      toast.error("Registration failed");
      setError("Registration failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-10 sm:py-16 bg-white dark:bg-black transition-colors duration-300">
      
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-white dark:bg-zinc-900 p-8 sm:p-10 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl shadow-zinc-200/50 dark:shadow-none transition-all duration-300">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <UserPlus className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
              Create Account
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-3">
              Join the <span className="text-primary font-medium">XERV</span> community
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Username */}
            <div className="relative group">
              <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 text-sm transition-all duration-200"
                required
              />
            </div>

            {/* Profile Name */}
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                name="profileName"
                placeholder="Profile Name"
                value={form.profileName}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 text-sm transition-all duration-200"
              />
            </div>

            {/* Email */}
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-primary transition-colors" />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 text-sm transition-all duration-200"
                required
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-primary transition-colors" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 text-sm transition-all duration-200"
                required
              />
            </div>

            {/* Bio */}
            <div className="relative group">
              <FileText className="absolute left-4 top-4 w-5 h-5 text-zinc-400 group-focus-within:text-primary transition-colors" />
              <textarea
                name="bio"
                placeholder="Tell about yourself"
                value={form.bio}
                onChange={handleChange}
                rows={3}
                className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 text-sm transition-all duration-200 resize-none"
              />
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-destructive text-sm text-center bg-destructive/10 border border-destructive/20 py-2.5 rounded-lg"
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-6 rounded-xl text-base shadow-lg shadow-primary/20 hover:shadow-primary/30"
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-zinc-500 dark:text-zinc-400 text-sm text-center mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
