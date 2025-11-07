import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { api } from "@/lib/api"; 

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchListings = async () => {
        try {
            const res = await api.get("/listings", {params: {search}});
            setListings(res.data || []);
        } 
        catch (err) {
            console.error(err);
            setError("Unable to load listings. Please try again later.");
        } 
        setLoading(false);
    };

    fetchListings();
  }, [search]);

  return (
    <section className="min-h-screen bg-gray-950 text-gray-100 px-6 py-4">
      <div className="max-w-5xl mx-auto mb-10">
        <h1 className="text-3xl font-bold mb-6 tracking-wide text-center">Explore <span className="text-gray-500">Services</span></h1>
        <p className="text-gray-400 text-center max-w-xl mx-auto">Discover what others are offering and connect through meaningful service exchange.</p>
      </div>

      {/* Search Bar */}
      <div className="max-w-3xl mx-auto flex items-center gap-3 bg-gray-300 border border-gray-800 rounded-xl px-4 py-3 mb-12">
        <Search className="w-5 h-5 text-gray-950" />
        <input
          type="text"
          placeholder="Search services"
          className="flex-1 bg-transparent outline-none text-gray-950 placeholder-gray-900"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading && (
          <p className="text-gray-400 text-center col-span-full">Loading listings...</p>
        )}

        {error && (
          <p className="text-red-500 text-center col-span-full">{error}</p>
        )}

        {!loading && !error && listings.length > 0 &&
          listings.map((listing) => (
            <div
              key={listing.id}
              className="bg-[#001334] border border-gray-800 rounded-2xl shadow-md p-4 flex flex-col hover:shadow-gray-800 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-100">{listing.title}</h3>
                <span className="text-xs bg-[#272c39] px-3 py-1 rounded-full text-gray-100">{listing.category || "General"}</span>
              </div>

              <p className="text-gray-300 text-sm mb-4 line-clamp-3 flex-1">{listing.description || "No description available."}</p>

              <div className="flex justify-between items-center mt-auto">
                <p className="text-sm text-gray-400">by {listing.ownername || "Unknown"}</p>
                <Link to={`/listing/${listing.id}`}>
                  <Button className="bg-green-800 hover:bg-green-900 text-gray-100 cursor-pointer">View</Button>
                </Link>
              </div>
            </div>
          ))}

        {!loading && !error && listings.length === 0 && (
          <p className="text-gray-500 text-center col-span-full">No listings found.</p>
        )}
      </div>
    </section>
  );
}
