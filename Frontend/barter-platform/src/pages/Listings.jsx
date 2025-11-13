import { useEffect, useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import api from "@/lib/api";
import { AuthContext } from "@/context/AuthContext";

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

  const [selectedListing, setSelectedListing] = useState(null);
  const [requesting, setRequesting] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [requestSuccess, setRequestSuccess] = useState("");

  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUserId(res.data.id);
      } catch (err) {
        console.error("Failed to fetch current user", err);
      }
    };
    fetchUser();
  }, [token]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await api.get("/listings", { params: { search } });
        setListings(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Unable to load listings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [search]);

  const handleRequest = async () => {
    if (!selectedListing || !currentUserId) return;
    setRequesting(true);
    setRequestError("");
    setRequestSuccess("");

    try {
      await api.post("/transactions", {
        learnerId: currentUserId,
        tutorId: selectedListing.owner.id, 
        listingId: selectedListing.id,
        credits: selectedListing.creditValue
      });

      setRequestSuccess("Transaction request sent!");
    } catch (err) {
      console.error(err);
      setRequestError("Failed to request this service.");
    } finally {
      setRequesting(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-950 text-gray-100 px-6 py-4">
      <div className="max-w-5xl mx-auto mb-10 text-center">
        <h1 className="text-3xl font-bold mb-2">Explore <span className="text-gray-500">Services</span></h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          Discover what others are offering and connect through meaningful service exchange.
        </p>
      </div>

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

      <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading && <p className="text-gray-400 text-center col-span-full">Loading listings...</p>}
        {error && <p className="text-red-500 text-center col-span-full">{error}</p>}

        {!loading && !error && listings.length > 0 &&
          listings.map((listing) => (
            <div
              key={listing.id}
              className="bg-[#001334] border border-gray-800 hover:border-green-800 rounded-2xl shadow-md p-4 flex flex-col hover:shadow-gray-800 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-100">{listing.title}</h3>
                <span className="text-xs bg-[#272c39] px-3 py-1 rounded-full text-gray-100">{listing.category || "General"}</span>
              </div>

              <p className="text-gray-300 text-sm mb-4 line-clamp-3 flex-1">{listing.description || "No description available."}</p>

              <div className="flex justify-between items-center mt-auto">
                <p className="text-sm text-gray-400">by {listing.owner.profileName || "Unknown"}</p>
                <Button
                  onClick={() => setSelectedListing(listing)}
                  className="bg-green-800 hover:bg-green-900 text-gray-100 cursor-pointer"
                >
                  View
                </Button>
              </div>
            </div>
        ))}

        {!loading && !error && listings.length === 0 && (
          <p className="text-gray-500 text-center col-span-full">No listings found.</p>
        )}
      </div>

      {selectedListing && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-950 rounded-2xl p-6 w-11/12 max-w-lg relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-100"
              onClick={() => { setSelectedListing(null); setRequestError(""); setRequestSuccess(""); }}
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-2">{selectedListing.title}</h2>
            <p className="text-gray-400 mb-4">{selectedListing.description || "No description provided."}</p>
            <p className="text-sm text-gray-500 mb-1"><strong>Category:</strong> {selectedListing.category}</p>
            <p className="text-sm text-gray-500 mb-1"><strong>Credits:</strong> {selectedListing.creditValue}</p>
            <p className="text-sm text-gray-500 mb-4"><strong>Owner:</strong> {selectedListing.owner.profileName}</p>

            {requestError && <p className="text-red-500 mb-2">{requestError}</p>}
            {requestSuccess && <p className="text-green-500 mb-2">{requestSuccess}</p>}

            <Button
              onClick={handleRequest}
              className="bg-green-800 hover:bg-green-900 text-gray-100 w-full"
              disabled={requesting || !currentUserId}
            >
              {requesting ? "Requesting..." : "Request Service"}
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
