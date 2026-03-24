import { useEffect, useState, useContext } from "react";
import api from "@/lib/api";
import { AuthContext } from "@/context/AuthContext";
import { Layers, Coins, Pencil, Trash2, Search, Handshake, RefreshCw, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const CATEGORIES = [
  { value: "WEB_DEVELOPMENT", label: "Web Development" },
  { value: "GRAPHIC_DESIGN", label: "Graphic Design" },
  { value: "DIGITAL_MARKETING", label: "Digital Marketing" },
  { value: "CONTENT_WRITING", label: "Content Writing" },
  { value: "VIDEO_EDITING", label: "Video Editing" },
  { value: "UI_UX_DESIGN", label: "UI/UX Design" },
  { value: "DATA_ANALYTICS", label: "Data Analytics" },
];

export default function OfferServices() {
  const [listings, setListings] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    creditValue: 1,
  });
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setLoading(false);
      } catch (err) {
        toast.error("Failed to load user");
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  useEffect(() => {
    if (!user) return;

    const timer = setTimeout(() => {
      fetchUserListings(search);
    }, 250);

    return () => clearTimeout(timer);
  }, [search, user]);

  const fetchUserListings = async (query = "") => {
    try {
      const res = await api.get(`/listings`, {
        params: {
          search: query || undefined,
          userId: user.id,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      setListings(res.data);
    } catch (err) {
      toast.error("Failed to load services");
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!user) return setError("User not loaded yet");

    const t = toast.loading(isEditing ? "Updating service..." : "Adding service...");

    try {
      const payload = { ...form, ownerId: user.id };
      if (isEditing) {
        await api.put(`/listings/${editId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Service updated successfully", { id: t });
      } else {
        await api.post("/listings", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Service added successfully", { id: t });
      }

      fetchUserListings();
      setIsModalOpen(false);
      setForm({ title: "", description: "", category: "", creditValue: 1 });
      setIsEditing(false);
      setEditId(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save service", { id: t });
      setError("Failed to save listing");
    }
  };

  const handleEdit = (listing) => {
    setForm({
      title: listing.title,
      description: listing.description,
      category: listing.category,
      creditValue: listing.creditValue,
    });
    setEditId(listing.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    const t = toast.loading("Deleting service...");

    try {
      await api.delete(`/listings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Service deleted", { id: t });
      fetchUserListings();
    } catch (err) {
      console.error("Failed to delete listing", err);
      toast.error("Failed to delete service", { id: t });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 sm:mb-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            My <span className="text-primary">Services</span>
          </motion.h1>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onClick={() => {
              setForm({ title: "", description: "", category: "", creditValue: 1 });
              setIsEditing(false);
              setIsModalOpen(true);
            }}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-xl cursor-pointer transition-all duration-300 shadow-md shadow-primary/20 hover:shadow-lg w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Offer New Service
          </motion.button>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex items-center gap-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-5 py-4 rounded-2xl mb-8 sm:mb-10 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all duration-200"
        >
          <Search className="text-zinc-400 w-5 h-5 shrink-0" />
          <input
            type="text"
            placeholder="Search your services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-zinc-900 dark:text-zinc-50 w-full placeholder-zinc-400 text-base min-w-0"
          />
        </motion.div>

        {/* Listings */}
        {listings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm"
          >
            <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Handshake className="w-10 h-10 text-primary" />
            </div>
            <p className="text-zinc-900 dark:text-zinc-50 text-xl font-bold">No services offered yet</p>
            <p className="text-zinc-500 text-base mt-2">Click "Offer New Service" to get started.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing, i) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.05, 0.3), duration: 0.4 }}
                className="group flex flex-col gap-4 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Handshake className="text-primary" size={20} />
                    </div>
                    <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-lg truncate" title={listing.title}>{listing.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleEdit(listing)}
                      className="w-10 h-10 rounded-xl bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-primary transition-colors cursor-pointer"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(listing.id)}
                      className="w-10 h-10 rounded-xl bg-zinc-50 hover:bg-red-50 dark:bg-zinc-800 dark:hover:bg-red-500/10 border border-zinc-200 dark:border-zinc-700 dark:hover:border-red-500/30 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <p className="text-zinc-600 dark:text-zinc-400 text-sm line-clamp-3 leading-relaxed flex-1">
                  {listing.description}
                </p>

                <div className="flex justify-between text-sm font-medium mt-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <span className="flex items-center gap-1.5 text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg">
                    <Layers size={14} />
                    {listing.category?.replace(/_/g, " ")}
                  </span>
                  <span className="flex items-center gap-1.5 text-zinc-900 dark:text-zinc-50 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg font-bold">
                    <Coins size={14} className="text-primary" />
                    {listing.creditValue} Max
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-zinc-900/60 dark:bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 w-full max-w-lg border border-zinc-200 dark:border-zinc-800 shadow-2xl relative"
          >
            {/* Close button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 w-10 h-10 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-zinc-900 dark:text-zinc-50 pr-8">
              {isEditing ? "Update Service" : "Offer a New Service"}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="title"
                placeholder="Service Title"
                value={form.title}
                onChange={handleChange}
                className="p-4 bg-white dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 text-base transition-all"
                required
              />
              <textarea
                name="description"
                placeholder="Describe your service in detail..."
                value={form.description}
                onChange={handleChange}
                className="p-4 h-32 bg-white dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 text-base resize-none transition-all"
                required
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="p-4 bg-white dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-zinc-900 dark:text-zinc-50 transition-all font-medium"
                  required
                >
                  <option value="" disabled>Category</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>

                <div className="relative">
                  <Coins className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5 pointer-events-none" />
                  <input
                    type="number"
                    name="creditValue"
                    min="1"
                    placeholder="Credits"
                    value={form.creditValue}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 p-4 bg-white dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              {error && <p className="text-destructive text-sm text-center font-medium mt-2">{error}</p>}

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl font-semibold text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/20 transition-all cursor-pointer w-full sm:w-auto"
                >
                  {isEditing ? "Update Service" : "Add Service"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
