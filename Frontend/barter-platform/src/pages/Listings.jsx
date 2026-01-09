import { useEffect, useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Search, RefreshCw } from "lucide-react";
import api from "@/lib/api";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "sonner";

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
      } 
      catch (err) {
        toast.error("Failed to fetch user");
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
      } 
      catch (err) {
        console.error(err);
        setError("Unable to load listings. Please try again later.");
        toast.error("Failed to load listings");
      } 
      setLoading(false);
    };

    fetchListings();
  }, [search]);

  const handleRequest = async () => {
    if (!selectedListing || !currentUserId) 
      return;
    setRequesting(true);
    setRequestError("");
    setRequestSuccess("");

    const id = toast.loading("Sending request...");

    try {
      await api.post("/transactions", {
        learnerId: currentUserId,
        tutorId: selectedListing.owner.id,
        listingId: selectedListing.id,
        credits: selectedListing.creditValue
      });

      setRequestSuccess("Transaction request sent!");
      toast.dismiss(id);
      toast.success("Request sent!");
    } 
    catch (err) {
      console.error(err);
      setRequestError("Failed to request this service.");
      toast.dismiss(id);
      toast.error("Request failed");
    } 
    setRequesting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-[#E67E22]" />
      </div>
    );
  }
  
  return (
    <section className="min-h-screen bg-[#0D0D0D] text-[#F0F0F0] px-6 py-4">
      <div className="max-w-5xl mx-auto mb-10 text-center">
        <h1 className="text-3xl font-bold mb-4">
          Explore <span className="text-[#E67E22]">Services</span>
        </h1>
        <p className="text-[#B0B0B0] max-w-xl mx-auto">
          Discover what others are offering and connect through meaningful service exchange.
        </p>
      </div>

      <div className="max-w-3xl mx-auto flex items-center gap-3 bg-gray-300 border border-[#404040] rounded-xl px-4 py-3 mb-12">
        <Search className="w-5 h-5 text-gray-800" />
        <input
          type="text"
          placeholder="Search services"
          className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-700"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* {loading && <p className="text-[#B0B0B0] text-center col-span-full">Loading listings...</p>} */}
        {error && <p className="text-[#DC2626] text-center col-span-full">{error}</p>}

        {!loading && !error && listings.length > 0 &&
          listings.map((listing) => (
            <div
              key={listing.id}
              className="bg-[#151515] border border-[#333333] hover:border-[#E67E22] rounded-2xl shadow-md p-4 flex flex-col hover:shadow-[#E67E2233] transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-[#F0F0F0]">{listing.title}</h3>
                <span className="text-xs bg-[#0f354a] px-3 py-1 rounded-full text-gray-100">
                  {listing.category || "General"}
                </span>
              </div>

              <p className="text-[#B0B0B0] text-sm mb-4 line-clamp-3 flex-1">
                {listing.description || "No description available."}
              </p>

              <div className="flex justify-between items-center mt-auto">
                <p className="text-sm text-[#B0B0B0]">
                  by {listing.owner.profileName || "Unknown"}
                </p>
                <Button
                  onClick={() => setSelectedListing(listing)}
                  className="bg-[#1E5430] hover:bg-[#1e5430d1] text-[#E8F5E9] font-semibold cursor-pointer"
                >View</Button>
              </div>
            </div>
        ))}

        {!loading && !error && listings.length === 0 && (
          <p className="text-[#B0B0B0] text-center col-span-full">No listings found.</p>
        )}
      </div>

      {selectedListing && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-[#151515] rounded-2xl p-6 w-11/12 max-w-lg relative text-[#F0F0F0] border border-[#333333]">
            <button
              className="absolute top-4 right-4 text-[#B0B0B0] hover:text-[#F0F0F0]"
              onClick={() => { setSelectedListing(null); setRequestError(""); setRequestSuccess(""); }}
            >✕</button>

            <h2 className="text-2xl font-bold mb-2 text-[#E67E22]">{selectedListing.title}</h2>
            <p className="text-[#B0B0B0] mb-4">{selectedListing.description || "No description provided."}</p>
            <p className="text-sm text-[#B0B0B0] mb-1"><strong>Category:</strong> {selectedListing.category}</p>
            <p className="text-sm text-[#B0B0B0] mb-1"><strong>Credits:</strong> {selectedListing.creditValue}</p>
            <p className="text-sm text-[#B0B0B0] mb-4"><strong>Owner:</strong> {selectedListing.owner.profileName}</p>

            {/* {requestError && <p className="text-[#DC2626] mb-2">{requestError}</p>}
            {requestSuccess && <p className="text-[#059669] mb-2">{requestSuccess}</p>} */}

            <Button
              onClick={handleRequest}
              className="bg-[#1E5430] hover:bg-[#1e5430d1] text-[#E8F5E9] cursor-pointer w-full font-semibold"
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
