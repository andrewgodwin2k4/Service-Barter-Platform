import { useEffect, useState, useContext } from "react";
import api from "@/lib/api";
import { AuthContext } from "@/context/AuthContext";
import {
  Search, Clock, CheckCircle, XCircle, Truck, Handshake,
  AlertTriangle, RefreshCw, Filter, Coins, Link2, ExternalLink, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function Transactions() {
  const { token } = useContext(AuthContext);

  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [activeTab, setActiveTab] = useState("my-transactions");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Delivery modal state
  const [deliveryModal, setDeliveryModal] = useState(null);
  const [deliveryForm, setDeliveryForm] = useState({ deliveryLink: "", deliveryNote: "" });
  const [delivering, setDelivering] = useState(false);

  // Rating modal state
  const [ratingModal, setRatingModal] = useState(null);
  const [ratingScore, setRatingScore] = useState(0);
  const [hoverScore, setHoverScore] = useState(0);
  const [ratingLoading, setRatingLoading] = useState(false);

  // Revision modal state
  const [revisionModal, setRevisionModal] = useState(null);
  const [revisionComment, setRevisionComment] = useState("");
  const [revisionLoading, setRevisionLoading] = useState(false);

  // Dispute modal state
  const [disputeModal, setDisputeModal] = useState(null);
  const [disputeReason, setDisputeReason] = useState("");
  const [disputeLoading, setDisputeLoading] = useState(false);

  // Complete modal state
  const [completeModal, setCompleteModal] = useState(null);
  const [completeReview, setCompleteReview] = useState("");
  const [completeLoading, setCompleteLoading] = useState(false);

  const statusConfig = {
    PENDING: { label: "Pending", color: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200 dark:border-amber-500/30" },
    ACCEPTED: { label: "Accepted", color: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200 dark:border-blue-500/30" },
    REJECTED: { label: "Rejected", color: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 border-red-200 dark:border-red-500/30" },
    DELIVERED: { label: "Delivered", color: "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400 border-purple-200 dark:border-purple-500/30" },
    COMPLETED: { label: "Completed", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30" },
    AUTO_COMPLETED: { label: "Auto Completed", color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-500/20" },
    DISPUTED: { label: "Disputed", color: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 border-rose-200 dark:border-rose-500/30" },
    CANCELLED: { label: "Cancelled", color: "bg-zinc-100 text-zinc-700 dark:bg-zinc-500/20 dark:text-zinc-400 border-zinc-200 dark:border-zinc-500/30" },
    REVISION_REQUESTED: { label: "Revision Requested", color: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200 dark:border-amber-500/30" },
  };

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
    if (!user) return;
    fetchData();
    setStatusFilter("ALL");
  }, [user, activeTab]);

  const fetchData = async () => {
    if (!user?.id) return;
    if (activeTab === "my-transactions") {
      setLoadingTransactions(true);
      try {
        const res = await api.get(`/transactions/user/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(res.data);
      } catch (err) {
        console.error("Failed to fetch transactions", err);
      }
      setLoadingTransactions(false);
    } else {
      setLoadingRequests(true);
      try {
        const res = await api.get(`/transactions/requests/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(res.data);
      } catch (err) {
        console.error("Failed to fetch requests", err);
      }
      setLoadingRequests(false);
    }
  };

  const handleAction = async (transactionId, action, confirmMessage) => {
    if (confirmMessage && !confirm(confirmMessage)) return;

    try {
      await api.put(
        `/transactions/${transactionId}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Transaction ${action}ed successfully.`);
      fetchData();
    } catch (err) {
      console.error(`Failed to ${action} transaction`, err);
      toast.error(`Failed to ${action} transaction.`);
    }
  };

  const handleDeliver = async (e) => {
    e.preventDefault();
    if (!deliveryModal) return;
    if (!deliveryForm.deliveryLink.trim()) {
      toast.error("Please provide a delivery link.");
      return;
    }
    setDelivering(true);

    try {
      await api.put(
        `/transactions/${deliveryModal}/deliver`,
        deliveryForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Deliverable submitted successfully!");
      setDeliveryModal(null);
      setDeliveryForm({ deliveryLink: "", deliveryNote: "" });
      fetchData();
    } catch (err) {
      console.error("Failed to deliver", err);
      toast.error("Failed to submit deliverable.");
    }
    setDelivering(false);
  };

  const submitRating = async () => {
    if (!ratingModal || ratingScore < 1) return;
    setRatingLoading(true);
    try {
      await api.put(`/transactions/${ratingModal}/rate?score=${ratingScore}`, {}, {
         headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Provider rated successfully!");
      setRatingModal(null);
      setRatingScore(0);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit rating.");
    }
    setRatingLoading(false);
  };

  const handleRevisionSubmit = async (e) => {
    e.preventDefault();
    if (!revisionModal || !revisionComment.trim()) return;
    setRevisionLoading(true);
    try {
      await api.put(`/transactions/${revisionModal}/revision`, 
        { revisionComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Revision requested successfully!");
      setRevisionModal(null);
      setRevisionComment("");
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to request revision.");
    }
    setRevisionLoading(false);
  };

  const handleDisputeSubmit = async (e) => {
    e.preventDefault();
    if (!disputeModal || !disputeReason.trim()) return;
    setDisputeLoading(true);
    try {
      await api.put(`/transactions/${disputeModal}/dispute`, 
        { disputeReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Dispute raised successfully.");
      setDisputeModal(null);
      setDisputeReason("");
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to raise dispute.");
    }
    setDisputeLoading(false);
  };

  const handleCompleteSubmit = async (e) => {
    e.preventDefault();
    if (!completeModal) return;
    setCompleteLoading(true);
    try {
      await api.put(`/transactions/${completeModal}/complete`, 
        { completionReview: completeReview.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Transaction marked as completed.");
      setCompleteModal(null);
      setCompleteReview("");
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark as completed.");
    }
    setCompleteLoading(false);
  };

  const getActionButtons = (transaction) => {
    if (!user) return null;
    const isBuyer = transaction.buyer.id === user.id;
    const status = transaction.status;

    switch (status) {
      case "PENDING":
        if (isBuyer) {
          return (
            <Button size="sm" onClick={() => handleAction(transaction.id, "cancel", "Cancel this transaction?")}
              className="bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400 border border-red-200 dark:border-red-500/20 cursor-pointer font-medium shadow-sm transition-colors">
              <XCircle className="w-4 h-4 mr-1.5" />Cancel
            </Button>
          );
        } else {
          return (
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => handleAction(transaction.id, "accept")}
                className="bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 cursor-pointer font-medium shadow-sm transition-colors">
                <CheckCircle className="w-4 h-4 mr-1.5" />Accept
              </Button>
              <Button size="sm" onClick={() => handleAction(transaction.id, "reject", "Reject this request?")}
                className="bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400 border border-red-200 dark:border-red-500/20 cursor-pointer font-medium shadow-sm transition-colors">
                <XCircle className="w-4 h-4 mr-1.5" />Reject
              </Button>
            </div>
          );
        }

      case "ACCEPTED":
        if (!isBuyer) {
          return (
            <Button size="sm" onClick={() => {
              setDeliveryModal(transaction.id);
              setDeliveryForm({ deliveryLink: "", deliveryNote: "" });
            }}
              className="bg-purple-50 hover:bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:hover:bg-purple-500/20 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20 cursor-pointer font-medium shadow-sm transition-colors">
              <Truck className="w-4 h-4 mr-1.5" />Submit Delivery
            </Button>
          );
        }
        break;

      case "DELIVERED":
        if (isBuyer) {
          return (
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => setCompleteModal(transaction.id)}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 cursor-pointer font-medium shadow-sm transition-colors">
                <Handshake className="w-4 h-4 mr-1.5" />Complete
              </Button>
              <Button size="sm" onClick={() => setRevisionModal(transaction.id)}
                className="bg-amber-50 hover:bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 cursor-pointer font-medium shadow-sm transition-colors">
                <RefreshCw className="w-4 h-4 mr-1.5" />Request Revision
              </Button>
              <Button size="sm" onClick={() => setDisputeModal(transaction.id)}
                className="bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 cursor-pointer font-medium shadow-sm transition-colors">
                <AlertTriangle className="w-4 h-4 mr-1.5" />Dispute
              </Button>
            </div>
          );
        }
        break;

      case "REVISION_REQUESTED":
        if (!isBuyer) {
          return (
            <Button size="sm" onClick={() => {
              setDeliveryModal(transaction.id);
              setDeliveryForm({ deliveryLink: transaction.deliveryLink || "", deliveryNote: "" });
            }}
              className="bg-purple-50 hover:bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:hover:bg-purple-500/20 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20 cursor-pointer font-medium shadow-sm transition-colors">
              <Truck className="w-4 h-4 mr-1.5" />Resubmit Work
            </Button>
          );
        }
        break;

      case "COMPLETED":
      case "AUTO_COMPLETED":
        if (isBuyer && !transaction.rating) {
           return (
             <Button size="sm" onClick={() => setRatingModal(transaction.id)}
               className="bg-amber-50 hover:bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 cursor-pointer font-medium shadow-sm transition-colors">
               <Star className="w-4 h-4 mr-1.5 fill-current" />Rate Provider
             </Button>
           );
        }
        break;

      default:
        return null;
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.listing.title.toLowerCase().includes(search.toLowerCase()) ||
      t.listing.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.listing.title.toLowerCase().includes(search.toLowerCase()) ||
      r.listing.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const loading = activeTab === "my-transactions" ? loadingTransactions : loadingRequests;

  if (loading && transactions.length === 0 && requests.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 sm:mb-10 text-zinc-900 dark:text-zinc-50 tracking-tight"
        >
          My <span className="text-primary">Transactions</span>
        </motion.h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <TabsList className="grid w-full grid-cols-2 gap-3 bg-zinc-100 dark:bg-zinc-900/50 p-1.5 rounded-2xl h-auto border border-zinc-200 dark:border-zinc-800">
              <TabsTrigger
                value="my-transactions"
                className="py-3 px-4 sm:px-6 rounded-xl transition-all duration-200 text-zinc-600 dark:text-zinc-400 font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-primary data-[state=active]:shadow-sm cursor-pointer"
              >
                Purchases
              </TabsTrigger>

              <TabsTrigger
                value="requests"
                className="py-3 px-4 sm:px-6 rounded-xl transition-all duration-200 text-zinc-600 dark:text-zinc-400 font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-primary data-[state=active]:shadow-sm cursor-pointer"
              >
                Sales
              </TabsTrigger>
            </TabsList>
          </motion.div>

          {/* Search & Filter */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center"
          >
            <div className="relative flex-1 sm:max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
              <input
                placeholder="Search transactions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 transition-all duration-200 shadow-sm"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 w-full sm:w-auto justify-center rounded-xl cursor-pointer transition-all duration-200 py-6 px-6 font-medium shadow-sm">
                  <Filter className="w-5 h-5 mr-2 text-zinc-400" />
                  Status: {statusFilter === "ALL" ? "All" : statusConfig[statusFilter]?.label}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl shadow-xl min-w-[200px] p-2">
                <DropdownMenuItem onClick={() => setStatusFilter("ALL")} className="cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg py-2.5 font-medium px-4">
                  All Status
                </DropdownMenuItem>
                {Object.entries(statusConfig).map(([status, config]) => (
                  <DropdownMenuItem key={status} onClick={() => setStatusFilter(status)} className="cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg py-2.5 font-medium px-4">
                    {config.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>

          <TabsContent value="my-transactions" className="space-y-4">
            {filteredTransactions.length === 0 ? (
              <EmptyState
                icon={<Handshake className="w-12 h-12 text-zinc-400" />}
                message={transactions.length === 0 ? "You don't have any purchases yet." : "No purchases match your search criteria."}
              />
            ) : (
              filteredTransactions.map((t, i) => (
                <TransactionCard key={t.id} index={i} transaction={t} isBuyer={t.buyer.id === user.id} statusConfig={statusConfig} actionButtons={getActionButtons(t)} />
              ))
            )}
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            {filteredRequests.length === 0 ? (
              <EmptyState
                icon={<Handshake className="w-12 h-12 text-zinc-400" />}
                message={requests.length === 0 ? "You don't have any sales yet." : "No sales match your search criteria."}
              />
            ) : (
              filteredRequests.map((r, i) => (
                <TransactionCard key={r.id} index={i} transaction={r} isBuyer={false} statusConfig={statusConfig} actionButtons={getActionButtons(r)} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Delivery Modal */}
      {deliveryModal && (
        <div className="fixed inset-0 bg-zinc-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 w-full max-w-lg border border-zinc-200 dark:border-zinc-800 shadow-2xl relative"
          >
            <button
              className="absolute top-4 right-4 sm:top-5 sm:right-5 w-10 h-10 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors cursor-pointer"
              onClick={() => { setDeliveryModal(null); setDeliveryForm({ deliveryLink: "", deliveryNote: "" }); }}
            >
              <XCircle size={20} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Truck className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Submit Delivery</h2>
            </div>

            <p className="text-zinc-600 dark:text-zinc-400 text-base mb-6 leading-relaxed">
              Provide a link to your deliverable (Google Drive, Dropbox, Figma, etc.) so the buyer can review and accept your work.
            </p>

            <form onSubmit={handleDeliver} className="flex flex-col gap-5">
              <div className="relative">
                <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 pointer-events-none" />
                <input
                  type="url"
                  placeholder="https://drive.google.com/..."
                  value={deliveryForm.deliveryLink}
                  onChange={(e) => setDeliveryForm({ ...deliveryForm, deliveryLink: e.target.value })}
                  className="w-full pl-12 pr-4 p-4 bg-white dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 transition-all font-medium"
                  required
                />
              </div>
              <textarea
                placeholder="Optional note about what you're delivering..."
                value={deliveryForm.deliveryNote}
                onChange={(e) => setDeliveryForm({ ...deliveryForm, deliveryNote: e.target.value })}
                rows={3}
                className="w-full p-4 bg-white dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 transition-all resize-none"
              />
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => { setDeliveryModal(null); setDeliveryForm({ deliveryLink: "", deliveryNote: "" }); }}
                  className="px-6 py-3.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl font-semibold text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={delivering}
                  className="px-8 py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/20 transition-all cursor-pointer w-full sm:w-auto disabled:opacity-50"
                >
                  {delivering ? "Submitting..." : "Submit Delivery"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Rating Provider Modal */}
      {ratingModal && (
        <div className="fixed inset-0 bg-zinc-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
           <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-10 w-full max-w-sm border border-zinc-200 dark:border-zinc-800 shadow-2xl relative text-center"
           >
             <button
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors cursor-pointer"
              onClick={() => { setRatingModal(null); setRatingScore(0); }}
             >
              <XCircle size={20} />
             </button>

             <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-500 flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Star className="w-8 h-8 fill-current" />
             </div>
             
             <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">Rate Provider</h2>
             <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-8 px-2 leading-relaxed">How satisfied were you with the quality of work delivered by the provider?</p>

             <div className="flex justify-center gap-2 mb-10">
               {[1,2,3,4,5].map(star => (
                 <motion.button 
                   key={star}
                   whileHover={{ scale: 1.15 }}
                   whileTap={{ scale: 0.9 }}
                   onMouseEnter={() => setHoverScore(star)}
                   onMouseLeave={() => setHoverScore(0)}
                   onClick={() => setRatingScore(star)}
                   className="focus:outline-none cursor-pointer p-1"
                 >
                   <Star className={`w-10 h-10 transition-colors duration-200 ${star <= (hoverScore || ratingScore) ? "text-amber-400 fill-amber-400 drop-shadow-md" : "text-zinc-200 dark:text-zinc-700"}`} />
                 </motion.button>
               ))}
             </div>

             <Button 
               onClick={submitRating} 
               disabled={ratingScore === 0 || ratingLoading}
               className="w-full font-bold py-6 rounded-xl shadow-xl shadow-amber-500/20 bg-amber-500 text-white hover:bg-amber-600 transition-all text-lg"
             >
                {ratingLoading ? "Submitting..." : "Submit Rating"}
             </Button>
           </motion.div>
        </div>
      )}

      {/* Revision Modal */}
      {revisionModal && (
        <div className="fixed inset-0 bg-zinc-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 w-full max-w-lg border border-zinc-200 dark:border-zinc-800 shadow-2xl relative"
          >
            <button
              className="absolute top-4 right-4 sm:top-5 sm:right-5 w-10 h-10 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors cursor-pointer"
              onClick={() => { setRevisionModal(null); setRevisionComment(""); }}
            >
              <XCircle size={20} />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Request Revision</h2>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 text-base mb-6 leading-relaxed">
              Please explain what needs to be changed or improved in the delivered work. This will be sent to the provider.
            </p>
            <form onSubmit={handleRevisionSubmit} className="flex flex-col gap-5">
              <textarea
                placeholder="Detail what needs revision..."
                value={revisionComment}
                onChange={(e) => setRevisionComment(e.target.value)}
                rows={4}
                className="w-full p-4 bg-white dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 transition-all resize-none"
                required
              />
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => { setRevisionModal(null); setRevisionComment(""); }}
                  className="px-6 py-3.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl font-semibold text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={revisionLoading}
                  className="px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer w-full sm:w-auto disabled:opacity-50"
                >
                  {revisionLoading ? "Requesting..." : "Submit Revision Request"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Dispute Modal */}
      {disputeModal && (
        <div className="fixed inset-0 bg-zinc-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 w-full max-w-lg border border-zinc-200 dark:border-zinc-800 shadow-2xl relative"
          >
            <button
              className="absolute top-4 right-4 sm:top-5 sm:right-5 w-10 h-10 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors cursor-pointer"
              onClick={() => { setDisputeModal(null); setDisputeReason(""); }}
            >
              <XCircle size={20} />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Raise Dispute</h2>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 text-base mb-6 leading-relaxed">
              If the provider failed to deliver the agreed-upon work or is unresponsive, provide a reason below to alert the platform admins.
            </p>
            <form onSubmit={handleDisputeSubmit} className="flex flex-col gap-5">
              <textarea
                placeholder="Explain the reason for the dispute..."
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                rows={4}
                className="w-full p-4 bg-white dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 transition-all resize-none"
                required
              />
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => { setDisputeModal(null); setDisputeReason(""); }}
                  className="px-6 py-3.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl font-semibold text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={disputeLoading}
                  className="px-8 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl shadow-lg shadow-rose-500/20 transition-all cursor-pointer w-full sm:w-auto disabled:opacity-50"
                >
                  {disputeLoading ? "Raising Dispute..." : "Raise Dispute"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Complete Modal */}
      {completeModal && (
        <div className="fixed inset-0 bg-zinc-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 w-full max-w-lg border border-zinc-200 dark:border-zinc-800 shadow-2xl relative"
          >
            <button
              className="absolute top-4 right-4 sm:top-5 sm:right-5 w-10 h-10 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors cursor-pointer"
              onClick={() => { setCompleteModal(null); setCompleteReview(""); }}
            >
              <XCircle size={20} />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                <Handshake className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Complete Order</h2>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 text-base mb-6 leading-relaxed">
              Are you satisfied with the delivered work? Leave a review for the provider below to mark the transaction as completed.
            </p>
            <form onSubmit={handleCompleteSubmit} className="flex flex-col gap-5">
              <textarea
                placeholder="Write your review here..."
                value={completeReview}
                onChange={(e) => setCompleteReview(e.target.value)}
                rows={4}
                className="w-full p-4 bg-white dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 transition-all resize-none"
              />
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => { setCompleteModal(null); setCompleteReview(""); }}
                  className="px-6 py-3.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl font-semibold text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={completeLoading}
                  className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer w-full sm:w-auto disabled:opacity-50"
                >
                  {completeLoading ? "Completing..." : "Complete Order"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function EmptyState({ icon, message }) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl flex flex-col items-center justify-center py-16 sm:py-24 shadow-sm">
      <div className="w-20 h-20 rounded-3xl bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center mb-6">
        {icon}
      </div>
      <p className="text-zinc-500 font-medium text-lg text-center max-w-sm px-4 leading-relaxed">{message}</p>
    </div>
  );
}

function TransactionCard({ transaction, isBuyer, statusConfig, actionButtons, index }) {
  const status = statusConfig[transaction.status];
  const otherParty = isBuyer ? transaction.provider : transaction.buyer;
  const hasDelivery = transaction.deliveryLink;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.2), duration: 0.3 }}
    >
      <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-3xl transition-all duration-300 shadow-sm hover:shadow-md">
        <CardHeader className="p-5 sm:p-7 border-b border-zinc-100 dark:border-zinc-800/50">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="space-y-1.5 min-w-0">
              <CardTitle className="text-lg sm:text-xl text-zinc-900 dark:text-zinc-50 tracking-tight">{transaction.listing.title}</CardTitle>
              <CardDescription className="text-zinc-500 text-sm line-clamp-2 leading-relaxed">{transaction.listing.description}</CardDescription>
            </div>
            <Badge className={`${status.color} border px-3 py-1.5 rounded-lg shrink-0 text-xs font-bold tracking-wide shadow-sm`}>{status.label}</Badge>
          </div>
        </CardHeader>

        <CardContent className="p-5 sm:p-7 space-y-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <div className="flex flex-col">
              <span className="font-semibold text-zinc-500 uppercase tracking-wider text-xs mb-1.5">Service Value</span>
              <div className="flex items-center gap-1.5">
                <Coins className="w-5 h-5 text-primary" />
                <span className="font-bold text-zinc-900 dark:text-zinc-50">{transaction.credits} Credits</span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="font-semibold text-zinc-500 uppercase tracking-wider text-xs mb-1.5">{isBuyer ? "Provider" : "Buyer"}</span>
              <div className="flex items-center gap-2">
                 <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-[10px] text-zinc-700 dark:text-zinc-300 shrink-0">
                  {otherParty.profileName?.charAt(0).toUpperCase() || "?"}
                </div>
                <div className="flex flex-col">
                   <p className="font-bold truncate text-zinc-900 dark:text-zinc-50 leading-tight">{otherParty.profileName}</p>
                   {otherParty.averageRating > 0 && (
                     <p className="text-[10px] font-bold text-amber-500 flex items-center gap-0.5 mt-0.5 leading-none">
                       <Star className="w-2.5 h-2.5 fill-current" />{otherParty.averageRating.toFixed(1)}
                     </p>
                   )}
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="font-semibold text-zinc-500 uppercase tracking-wider text-xs mb-1.5">Created</span>
              <p className="font-medium text-zinc-700 dark:text-zinc-300">{new Date(transaction.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>

            {transaction.deliveredAt && (
              <div className="flex flex-col">
                <span className="font-semibold text-zinc-500 uppercase tracking-wider text-xs mb-1.5">Delivered</span>
                <p className="font-medium text-zinc-700 dark:text-zinc-300">{new Date(transaction.deliveredAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              </div>
            )}
            
            {transaction.rating && (
              <div className="flex flex-col col-span-2 md:col-span-full mt-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <span className="font-semibold text-zinc-500 uppercase tracking-wider text-xs mb-2">Transaction Rating</span>
                <div className="flex items-center gap-1">
                   {[1,2,3,4,5].map(star => (
                     <Star key={star} className={`w-4 h-4 ${star <= transaction.rating ? "text-amber-500 fill-amber-500" : "text-zinc-200 dark:text-zinc-800"} `}/>
                   ))}
                </div>
              </div>
            )}
          </div>

          {/* Dispute Link Section */}
          {transaction.status === "DISPUTED" && transaction.disputeReason && (
            <div className="mt-5 p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span className="text-sm font-bold text-rose-900 dark:text-rose-50">Dispute Reason</span>
              </div>
              <p className="text-sm text-rose-700 dark:text-rose-300 italic">
                "{transaction.disputeReason}"
              </p>
            </div>
          )}

          {/* Revision Link Section */}
          {transaction.status === "REVISION_REQUESTED" && transaction.revisionComment && (
            <div className="mt-5 p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-sm font-bold text-amber-900 dark:text-amber-50">Revision Request</span>
              </div>
              <p className="text-sm text-amber-700 dark:text-amber-300 italic">
                "{transaction.revisionComment}"
              </p>
            </div>
          )}

          {/* Completion Review Section */}
          {transaction.status === "COMPLETED" && transaction.completionReview && (
            <div className="mt-5 p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <Handshake className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-bold text-emerald-900 dark:text-emerald-50">Completion Review</span>
              </div>
              <p className="text-sm text-emerald-700 dark:text-emerald-300 italic">
                "{transaction.completionReview}"
              </p>
            </div>
          )}

          {/* Delivery Link Section */}
          {hasDelivery && (
            <div className="mt-5 p-4 bg-white dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <Link2 className="w-4 h-4 text-zinc-400" />
                <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Deliverable Link</span>
              </div>
              <a
                href={transaction.deliveryLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-primary hover:text-primary/80 underline flex items-center gap-1.5 break-all w-fit transition-colors"
              >
                {transaction.deliveryLink}
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>
              {transaction.deliveryNote && (
                <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 italic">"{transaction.deliveryNote}"</p>
                </div>
              )}
            </div>
          )}

          {actionButtons && (
            <div className="flex flex-wrap justify-end gap-3 pt-6 mt-4 border-t border-zinc-100 dark:border-zinc-800">{actionButtons}</div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}