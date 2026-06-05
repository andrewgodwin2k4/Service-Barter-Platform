import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, User, Mail, Lock, AtSign, FileText, ArrowRight, ArrowLeft, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
  { value: "WEB_DEVELOPMENT", label: "Web Development", emoji: "🌐" },
  { value: "GRAPHIC_DESIGN", label: "Graphic Design", emoji: "🎨" },
  { value: "DIGITAL_MARKETING", label: "Digital Marketing", emoji: "📈" },
  { value: "CONTENT_WRITING", label: "Content Writing", emoji: "✍️" },
  { value: "VIDEO_EDITING", label: "Video Editing", emoji: "🎬" },
  { value: "UI_UX_DESIGN", label: "UI/UX Design", emoji: "🖌️" },
  { value: "DATA_ANALYTICS", label: "Data Analytics", emoji: "📊" },
  { value: "OTHER", label: "Other", emoji: "⚡" },
];

export default function Register() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    profileName: "",
    bio: "",
  });
  const [selectedPreferences, setSelectedPreferences] = useState([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const togglePreference = (value) => {
    setSelectedPreferences((prev) =>
      prev.includes(value)
        ? prev.filter((p) => p !== value)
        : [...prev, value]
    );
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setError("");
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    const id = toast.loading("Creating your account...");

    try {
      await api.post("/auth/register", {
        ...form,
        preferences: selectedPreferences,
      });

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
          
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${step === 1 ? "bg-primary text-white scale-110" : "bg-primary/20 text-primary"}`}>
              {step > 1 ? <Check className="w-4 h-4" /> : "1"}
            </div>
            <div className={`w-12 h-0.5 rounded-full transition-all duration-500 ${step === 2 ? "bg-primary" : "bg-zinc-200 dark:bg-zinc-700"}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${step === 2 ? "bg-primary text-white scale-110" : "bg-zinc-200 dark:bg-zinc-700 text-zinc-500"}`}>
              2
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
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

                <form onSubmit={handleNext} className="flex flex-col gap-5">
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
                    className="mt-2 w-full py-6 rounded-xl text-base shadow-lg shadow-primary/20 hover:shadow-primary/30"
                  >
                    Continue
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </form>

                <p className="text-zinc-500 dark:text-zinc-400 text-sm text-center mt-8">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                    Login
                  </Link>
                </p>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
                    Your Interests
                  </h1>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-3">
                    Pick services you're interested in — we'll personalize your feed
                  </p>
                </div>

                {/* Category Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {CATEGORIES.map((cat) => {
                    const isSelected = selectedPreferences.includes(cat.value);
                    return (
                      <motion.button
                        key={cat.value}
                        type="button"
                        whileTap={{ scale: 0.95 }}
                        onClick={() => togglePreference(cat.value)}
                        className={`relative flex flex-col items-center gap-2 py-4 px-3 rounded-2xl border-2 transition-all duration-200 cursor-pointer group ${
                          isSelected
                            ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                            : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 hover:border-primary/40 hover:shadow-sm"
                        }`}
                      >
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                          >
                            <Check className="w-3 h-3 text-white" />
                          </motion.div>
                        )}
                        <span className="text-2xl">{cat.emoji}</span>
                        <span className={`text-xs font-semibold transition-colors ${isSelected ? "text-primary" : "text-zinc-600 dark:text-zinc-400"}`}>
                          {cat.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>

                <p className="text-zinc-400 text-xs text-center mb-6">
                  {selectedPreferences.length === 0
                    ? "You can skip this — we'll show all services"
                    : `${selectedPreferences.length} selected`}
                </p>

                {error && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="text-destructive text-sm text-center bg-destructive/10 border border-destructive/20 py-2.5 rounded-lg mb-4"
                  >
                    {error}
                  </motion.p>
                )}

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="py-6 rounded-xl px-5"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 py-6 rounded-xl text-base shadow-lg shadow-primary/20 hover:shadow-primary/30"
                  >
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
