import { useEffect, useState, useContext } from "react";
import api from "@/lib/api";
import { AuthContext } from "@/context/AuthContext";
import { Layers, Coins, Pencil, Trash2, Search, Handshake, RefreshCw } from "lucide-react";
import { toast } from "sonner";

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
      } 
      catch (err) {
        toast.error("Failed to load user");
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  useEffect(() => {
    if (!user) 
      return;

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
    } 
    catch (err) {
      toast.error("Failed to load services");
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!user) 
      return setError("User not loaded yet");

    const t = toast.loading(isEditing ? "Updating service..." : "Adding service...");

    try {
      const payload = { ...form, ownerId: user.id };
      if (isEditing) {
        await api.put(`/listings/${editId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Service updated successfully", { id: t });
      } 
      else {
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
    } 
    catch (err) {
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
    if (!confirm("Are you sure you want to delete this listing?")) 
      return;

    const t = toast.loading("Deleting service...");

    try {
      await api.delete(`/listings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Service deleted", { id: t });
      fetchUserListings();
    } 
    catch (err) {
      console.error("Failed to delete listing", err);
      toast.error("Failed to delete service", { id: t });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-[#E67E22]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F0F0F0] px-6 py-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold">
            My <span className="text-[#E67E22]">Services</span>
          </h1>
          <button
            onClick={() => {
              setForm({ title: "", description: "", category: "", creditValue: 1 });
              setIsEditing(false);
              setIsModalOpen(true);
            }}
            className="bg-[#1E5430] hover:bg-[#1e5430d1] text-[#E8F5E9] font-semibold px-5 py-2 rounded-lg cursor-pointer transition-colors"
          >
            Offer New Service
          </button>
        </div>

        <div className="flex items-center gap-3 bg-gray-300 border border-[#404040] px-4 py-3 rounded-xl mb-10">
          <Search className="text-gray-950 w-5 h-5" />
          <input
            type="text"
            placeholder="Search your services"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-gray-900 w-full placeholder-gray-700"
          />
        </div>

        {listings.length === 0 ? (
          <p className="text-[#B0B0B0] italic text-center mt-10">
            You haven't offered any services yet!
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="flex flex-col gap-2 p-5 rounded-2xl border border-[#333333] hover:border-[#E67E22] bg-[#151515] shadow-md hover:shadow-[#E67E2233] transition-all"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Handshake className="text-[#E67E22]" size={22} />
                    <h3 className="font-semibold text-[#F0F0F0] text-lg">{listing.title}</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleEdit(listing)}
                      className="text-[#B0B0B0] hover:text-[#E67E22] transition cursor-pointer"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(listing.id)}
                      className="text-[#B0B0B0] hover:text-[#DC2626] transition cursor-pointer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <p className="text-[#B0B0B0]">{listing.description}</p>
                <div className="flex justify-between text-sm text-[#B0B0B0] mt-2">
                  <span className="flex items-center gap-2">
                    <Layers size={16} />
                    {listing.category}
                  </span>
                  <span className="flex items-center gap-2">
                    <Coins size={16} className="text-[#E67E22]" />
                    {listing.creditValue} Credits
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50">
          <div className="bg-[#151515] rounded-2xl shadow-lg p-6 w-full max-w-lg text-[#F0F0F0] border border-[#333333]">
            <h2 className="text-2xl font-bold mb-6 text-center text-[#E67E22]">
              {isEditing ? "Update Service" : "Offer a New Service"}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="title"
                placeholder="Service Title"
                value={form.title}
                onChange={handleChange}
                className="p-2 bg-[#0D0D0D] border border-[#404040] rounded-lg focus:outline-none placeholder-[#B0B0B0] text-[#F0F0F0] focus:ring-2 focus:ring-[#E67E22]"
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                className="p-2 h-32 bg-[#0D0D0D] border border-[#404040] rounded-lg focus:outline-none placeholder-[#B0B0B0] text-[#F0F0F0] focus:ring-2 focus:ring-[#E67E22]"
              />
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="p-2 bg-[#0D0D0D] border border-[#404040] rounded-lg focus:outline-none text-[#F0F0F0]"
                required
              >
                <option value="">Select Category</option>
                <option value="PROGRAMMING_TECH">Programming & Tech</option>
                <option value="CREATIVE_ARTS">Creative Arts</option>
                <option value="WRITING">Writing</option>
                <option value="MUSIC">Music</option>
                <option value="EDUCATION">Education</option>
                <option value="FITNESS">Fitness</option>
                <option value="COOKING">Cooking</option>
                <option value="BUSINESS_MARKETING">Business & Marketing</option>
                <option value="SPORTS">Sports</option>
                <option value="PERSONAL_DEVELOPMENT">Personal Development</option>
                <option value="DIY_HANDICRAFTS">DIY & Handicrafts</option>
                <option value="LANGUAGE_LEARNING">Language Learning</option>
                <option value="OTHER">Other</option>
              </select>
              <input
                type="number"
                name="creditValue"
                min="1"
                placeholder="Credits"
                value={form.creditValue}
                onChange={handleChange}
                className="p-2 bg-[#0D0D0D] border border-[#404040] rounded-lg focus:outline-none placeholder-[#B0B0B0] text-[#F0F0F0] focus:ring-2 focus:ring-[#E67E22]"
                required
              />

              {error && <p className="text-[#DC2626] text-sm text-center">{error}</p>}

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[#DC2626] hover:bg-[#B91C1C] rounded-lg cursor-pointer font-semibold text-[#F0F0F0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1E5430] hover:bg-[#1e5430d1] text-[#E8F5E9] font-semibold rounded-lg cursor-pointer"
                >
                  {isEditing ? "Update" : "Add Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
