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
    <section className="min-h-screen bg-[#12071F] text-[#F5EFFF] px-6 py-4">
      <div className="max-w-5xl mx-auto mb-10 text-center">
        <h1 className="text-3xl font-bold mb-2">
          Explore <span className="text-[#E67E22]">Services</span>
        </h1>
        <p className="text-[#C3B8E2] max-w-xl mx-auto">
          Discover what others are offering and connect through meaningful service exchange.
        </p>
      </div>

      <div className="max-w-3xl mx-auto flex items-center gap-3 bg-gray-200 border border-[#9B5DE5] rounded-xl px-4 py-3 mb-12">
        <Search className="w-5 h-5 text-[#12071F]" />
        <input
          type="text"
          placeholder="Search services"
          className="flex-1 bg-transparent outline-none text-[#12071F] placeholder-[#5E3D8B]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading && <p className="text-[#C3B8E2] text-center col-span-full">Loading listings...</p>}
        {error && <p className="text-[#FF4E50] text-center col-span-full">{error}</p>}

        {!loading && !error && listings.length > 0 &&
          listings.map((listing) => (
            <div
              key={listing.id}
              className="bg-[#1E0B2E] border border-[#9B5DE5] hover:border-[#00C9A7] rounded-2xl shadow-md p-4 flex flex-col hover:shadow-[#9B5DE5] transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-[#F5EFFF]">{listing.title}</h3>
                <span className="text-xs bg-sky-900 px-3 py-1 rounded-full text-gray-100">
                  {listing.category || "General"}
                </span>
              </div>

              <p className="text-[#C3B8E2] text-sm mb-4 line-clamp-3 flex-1">
                {listing.description || "No description available."}
              </p>

              <div className="flex justify-between items-center mt-auto">
                <p className="text-sm text-[#C3B8E2]">
                  by {listing.owner.profileName || "Unknown"}
                </p>
                <Button
                  onClick={() => setSelectedListing(listing)}
                  className="bg-[#2F8D46] hover:bg-[#2f8d46d2] text-gray-100 font-semibold cursor-pointer"
                >
                  View
                </Button>
              </div>
            </div>
        ))}

        {!loading && !error && listings.length === 0 && (
          <p className="text-[#C3B8E2] text-center col-span-full">No listings found.</p>
        )}
      </div>

      {selectedListing && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#1E0B2E] rounded-2xl p-6 w-11/12 max-w-lg relative text-[#F5EFFF]">
            <button
              className="absolute top-4 right-4 text-[#C3B8E2] hover:text-[#F5EFFF]"
              onClick={() => { setSelectedListing(null); setRequestError(""); setRequestSuccess(""); }}
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-2 text-[#ff871d]">{selectedListing.title}</h2>
            <p className="text-[#C3B8E2] mb-4">{selectedListing.description || "No description provided."}</p>
            <p className="text-sm text-[#C3B8E2] mb-1"><strong>Category:</strong> {selectedListing.category}</p>
            <p className="text-sm text-[#C3B8E2] mb-1"><strong>Credits:</strong> {selectedListing.creditValue}</p>
            <p className="text-sm text-[#C3B8E2] mb-4"><strong>Owner:</strong> {selectedListing.owner.profileName}</p>

            {requestError && <p className="text-[#FF4E50] mb-2">{requestError}</p>}
            {requestSuccess && <p className="text-[#00C9A7] mb-2">{requestSuccess}</p>}

            <Button
              onClick={handleRequest}
              className="bg-[#2F8D46] hover:bg-[#2f8d46d2] text-gray-100 cursor-pointer w-full font-semibold"
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
