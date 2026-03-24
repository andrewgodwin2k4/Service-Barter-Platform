import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, RefreshCw, X, ArrowRight, Coins, Tag, Hexagon, Star } from "lucide-react";
import api from "@/lib/api";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

  const [selectedListing, setSelectedListing] = useState(null);
  const [requesting, setRequesting] = useState(false);

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
    if (token) fetchUser();
  }, [token]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await api.get("/listings", { params: { search } });
        const all = res.data || [];
        // Hide the current user's own listings
        setListings(currentUserId ? all.filter(l => l.owner?.id !== currentUserId) : all);
      } catch (err) {
        console.error(err);
        setError("Unable to load listings. Please try again later.");
        toast.error("Failed to load listings");
      }
      setLoading(false);
    };

    fetchListings();
  }, [search, currentUserId]);

  const handleRequest = async () => {
    if (!selectedListing || !currentUserId) return;
    setRequesting(true);

    const id = toast.loading("Sending request...");

    try {
      await api.post("/transactions", {
        buyerId: currentUserId,
        providerId: selectedListing.owner.id,
        listingId: selectedListing.id,
        credits: selectedListing.creditValue,
      });

      toast.dismiss(id);
      toast.success("Request sent!");
      setSelectedListing(null);
    } catch (err) {
      console.error(err);
      toast.dismiss(id);
      toast.error(err.response?.data?.message || "Request failed");
    }
    setRequesting(false);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-white dark:bg-black transition-colors duration-300">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8 sm:mb-12 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          Explore <span className="text-primary">Services</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto text-base sm:text-lg"
        >
          Browse digital services offered by the community — logos, websites, marketing, and more.
        </motion.p>
      </div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="max-w-2xl mx-auto flex items-center gap-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 mb-10 sm:mb-14 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all duration-200"
      >
        <Search className="w-5 h-5 text-zinc-400 shrink-0" />
        <input
          type="text"
          placeholder="Search services..."
          className="flex-1 bg-transparent outline-none text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 text-base min-w-0"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </motion.div>

      {/* Listings Grid */}
      <div className="max-w-6xl mx-auto grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {error && <p className="text-destructive font-medium text-center col-span-full bg-destructive/10 py-4 rounded-xl border border-destructive/20">{error}</p>}

        {!error && listings.length > 0 &&
          listings.map((listing, i) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.05, 0.3), duration: 0.4 }}
              className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 flex flex-col transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-50 line-clamp-1">{listing.title}</h3>
                <span className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-lg shrink-0 whitespace-nowrap font-bold tracking-wide">
                  {listing.category?.replace(/_/g, " ") || "General"}
                </span>
              </div>

              <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-6 line-clamp-3 flex-1 leading-relaxed">
                {listing.description || "No description available."}
              </p>

              <div className="flex justify-between items-center mt-auto pt-5 border-t border-zinc-100 dark:border-zinc-800">
                <Link to={`/profile/${listing.owner.id}`} className="flex items-center gap-2.5 text-sm text-zinc-600 dark:text-zinc-400 hover:text-primary transition-colors group/provider">
                  <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-700 dark:text-zinc-300 overflow-hidden">
                    {listing.owner.avatarUrl ? (
                      <img src={`http://localhost:8080${listing.owner.avatarUrl}`} alt="" className="w-full h-full object-cover" />
                    ) : (
                      (listing.owner.profileName || "?").charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="truncate max-w-[120px] font-bold text-zinc-900 dark:text-white leading-tight group-hover/provider:text-primary">{listing.owner.profileName || "Unknown"}</span>
                    {listing.owner.averageRating > 0 && (
                      <span className="text-[11px] font-bold text-amber-500 flex items-center gap-0.5 leading-none mt-0.5">
                        <Star className="w-2.5 h-2.5 fill-current" /> {listing.owner.averageRating.toFixed(1)} ({listing.owner.totalRatings})
                      </span>
                    )}
                  </div>
                </Link>
                <Button
                  onClick={() => setSelectedListing(listing)}
                  variant="ghost"
                  className="hover:bg-primary/10 text-primary hover:text-primary cursor-pointer text-sm font-semibold rounded-xl px-4 transition-all duration-200"
                  size="sm"
                >
                  View Details
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </motion.div>
          ))}

        {!error && listings.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm">
             <div className="w-16 h-16 rounded-3xl bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center mb-4">
                <Hexagon className="w-8 h-8 text-zinc-400" />
              </div>
              <p className="text-zinc-500 font-medium text-lg">No listings found matching your search.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedListing && (
        <div className="fixed inset-0 bg-zinc-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 w-full max-w-lg relative border border-zinc-200 dark:border-zinc-800 shadow-2xl"
          >
            <button
              className="absolute top-4 right-4 sm:top-5 sm:right-5 w-10 h-10 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors cursor-pointer"
              onClick={() => setSelectedListing(null)}
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-zinc-900 dark:text-zinc-50 pr-10">{selectedListing.title}</h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6 text-base leading-relaxed">{selectedListing.description || "No description provided."}</p>

            <div className="flex flex-wrap gap-3 mb-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
              <span className="flex items-center gap-1.5 text-sm font-medium bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg text-zinc-700 dark:text-zinc-300">
                <Tag size={16} className="text-primary" />
                {selectedListing.category?.replace(/_/g, " ")}
              </span>
              <span className="flex items-center gap-1.5 text-sm font-bold bg-primary/10 px-3 py-1.5 rounded-lg text-primary">
                <Coins size={16} className="text-primary" />
                {selectedListing.creditValue} Credits
              </span>
            </div>

            <div className="flex items-center gap-3 mb-8">
               <Link to={`/profile/${selectedListing.owner.id}`} className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center font-bold text-zinc-700 dark:text-zinc-300 overflow-hidden hover:ring-2 hover:ring-primary transition-all">
                  {selectedListing.owner.avatarUrl ? (
                    <img src={`http://localhost:8080${selectedListing.owner.avatarUrl}`} alt="" className="w-full h-full object-cover" />
                  ) : (
                    (selectedListing.owner.profileName || "?").charAt(0).toUpperCase()
                  )}
                </Link>
              <div>
                 <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-0.5">Offered By</p>
                 <div className="flex items-center gap-2">
                   <Link to={`/profile/${selectedListing.owner.id}`} className="text-zinc-900 dark:text-zinc-50 font-bold hover:text-primary transition-colors">{selectedListing.owner.profileName}</Link>
                   {selectedListing.owner.averageRating > 0 && (
                     <span className="text-xs font-bold text-amber-500 flex items-center gap-0.5 bg-amber-50 dark:bg-amber-500/10 px-1.5 py-0.5 rounded-md border border-amber-200 dark:border-amber-500/20">
                       <Star className="w-3 h-3 fill-current" /> {selectedListing.owner.averageRating.toFixed(1)} ({selectedListing.owner.totalRatings} ratings)
                     </span>
                   )}
                 </div>
              </div>
            </div>

            <Button
              onClick={handleRequest}
              className="w-full font-bold py-6 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 text-lg"
              disabled={requesting || !currentUserId}
              size="lg"
            >
              {requesting ? "Requesting..." : "Request Service"}
            </Button>
          </motion.div>
        </div>
      )}
    </section>
  );
}
