import { useEffect, useState, useContext } from "react";
import api from "@/lib/api";
import { AuthContext } from "@/context/AuthContext";
import { Layers, Coins, Pencil, Trash2, Search, Handshake } from "lucide-react";

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
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };
    fetchUser();
  }, [token]);

  useEffect(() => {
    if (user) fetchUserListings(search);
  }, [user, search]);

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
      console.error("Failed to fetch listings", err);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!user) return setError("User not loaded yet");

    try {
      const payload = { ...form, ownerId: user.id };
      if (isEditing) {
        await api.put(`/listings/${editId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post("/listings", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchUserListings();
      setIsModalOpen(false);
      setForm({ title: "", description: "", category: "", creditValue: 1 });
      setIsEditing(false);
      setEditId(null);
    } catch (err) {
      console.error(err);
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
    try {
      await api.delete(`/listings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUserListings();
    } catch (err) {
      console.error("Failed to delete listing", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#12071F] text-[#F5EFFF] px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold">
            Your <span className="text-[#E67E22]">Services</span>
          </h1>
          <button
            onClick={() => {
              setForm({ title: "", description: "", category: "", creditValue: 1 });
              setIsEditing(false);
              setIsModalOpen(true);
            }}
            className="bg-[#2F8D46] hover:bg-[#2f8d46d2] text-gray-100 font-semibold px-5 py-2 rounded-lg cursor-pointer transition-colors"
          >
            Offer New Service
          </button>
        </div>

        <div className="flex items-center gap-3 bg-gray-200 border border-[#9B5DE5] px-4 py-3 rounded-xl mb-10">
          <Search className="text-[#12071F] w-5 h-5" />
          <input
            type="text"
            placeholder="Search your services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-[#12071F] w-full placeholder-[#5E3D8B]"
          />
        </div>

        {listings.length === 0 ? (
          <p className="text-[#C3B8E2] italic text-center mt-10">
            You haven’t offered any services yet!
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="flex flex-col gap-2 p-5 rounded-2xl border border-[#9B5DE5] hover:border-[#00C9A7] bg-[#1E0B2E] shadow-md hover:shadow-[#9B5DE5]/50 transition-all"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Handshake className="text-[#E67E22]" size={22} />
                    <h3 className="font-semibold text-[#F5EFFF] text-lg">{listing.title}</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleEdit(listing)}
                      className="text-[#C3B8E2] hover:text-[#E67E22] transition cursor-pointer"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(listing.id)}
                      className="text-[#C3B8E2] hover:text-[#FF4E50] transition cursor-pointer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <p className="text-[#C3B8E2]">{listing.description}</p>
                <div className="flex justify-between text-sm text-[#C3B8E2] mt-2">
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
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-[#1E0B2E] rounded-2xl shadow-lg p-6 w-full max-w-lg text-[#F5EFFF] border border-[#9B5DE5]">
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
                className="p-2 bg-[#12071F] border border-[#9B5DE5] rounded-lg focus:outline-none placeholder-[#C3B8E2]"
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                className="p-2 h-32 bg-[#12071F] border border-[#9B5DE5] rounded-lg focus:outline-none placeholder-[#C3B8E2]"
              />
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="p-2 bg-[#12071F] border border-[#9B5DE5] rounded-lg focus:outline-none"
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
                className="p-2 bg-[#12071F] border border-[#9B5DE5] rounded-lg focus:outline-none placeholder-[#C3B8E2]"
                required
              />

              {error && <p className="text-[#FF4E50] text-sm text-center">{error}</p>}

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[#c93434] hover:bg-[#c93434e8] rounded-lg cursor-pointer font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2F8D46] hover:bg-[#2f8d46d2] text-gray-100 font-semibold rounded-lg cursor-pointer"
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
