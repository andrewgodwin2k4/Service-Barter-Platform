import { useEffect, useState, useContext } from "react";
import api from "@/lib/api";
import { AuthContext } from "@/context/AuthContext";
import { Search,Clock,CheckCircle,XCircle,Truck,Handshake,AlertTriangle,RefreshCw,Filter,Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

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

  const statusConfig = {
    PENDING: { label: "Pending", color: "bg-[#B59E0B]" },
    ACCEPTED: { label: "Accepted", color: "bg-[#3B82F6]" },
    REJECTED: { label: "Rejected", color: "bg-[#DC2626]" },
    DELIVERED: { label: "Delivered", color: "bg-[#8B5CF6]" },
    COMPLETED: { label: "Completed", color: "bg-[#E67E22]" },
    AUTO_COMPLETED: { label: "Auto Completed", color: "bg-[#F39C12]" },
    DISPUTED: { label: "Disputed", color: "bg-[#F97316]" },
    CANCELLED: { label: "Cancelled", color: "bg-[#6B7280]" }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } 
      catch (err) {
        console.error("Failed to fetch user", err);
      }
    };
    fetchUser();
  }, [token]);

  useEffect(() => {
    if (!user) 
      return;
    fetchData();
    setStatusFilter("ALL");
  }, [user, activeTab]);

  const fetchData = async () => {
    if (!user?.id) 
      return;
    if (activeTab === "my-transactions") {
      setLoadingTransactions(true);
      try {
        const res = await api.get(`/transactions/user/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(res.data);
      } 
      catch (err) {
        console.error("Failed to fetch transactions", err);
      } 
      setLoadingTransactions(false);
    } 
    else {
      setLoadingRequests(true);
      try {
        const res = await api.get(`/transactions/requests/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(res.data);
      } 
      catch (err) {
        console.error("Failed to fetch requests", err);
      } 
      setLoadingRequests(false);
    }
  };

  const handleAction = async (transactionId, action, confirmMessage) => {
    if (confirmMessage && !confirm(confirmMessage)) 
      return;

    try {
      await api.put(
        `/transactions/${transactionId}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Transaction ${action}ed successfully.`);
      fetchData();

    } 
    catch (err) {
      console.error(`Failed to ${action} transaction`, err);
      toast.error(`Failed to ${action} transaction.`);
    }
  };

  const getActionButtons = (transaction) => {
    if (!user) 
      return null;
    const isLearner = transaction.learner.id === user.id;
    const status = transaction.status;

    switch (status) {
      case "PENDING":
        if (isLearner) {
          return (
            <Button variant="destructive" size="sm" className="bg-[#DC2626] hover:bg-[#B91C1C]" 
              onClick={() => handleAction(transaction.id, "cancel", "Cancel this transaction?")}>
              <XCircle className="w-4 h-4 mr-1" />Cancel
            </Button>
          );
        } 
        else {
          return (
            <div className="flex gap-2">
              <Button variant="default" size="sm" className="bg-[#3B82F6] hover:bg-[#2563EB]" 
                onClick={() => handleAction(transaction.id, "accept")}>
                <CheckCircle className="w-4 h-4 mr-1" />Accept
              </Button>
              <Button variant="destructive" size="sm" className="bg-[#DC2626] hover:bg-[#B91C1C]" 
                onClick={() => handleAction(transaction.id, "reject", "Reject this request?")}>
                <XCircle className="w-4 h-4 mr-1" />Reject
              </Button>
            </div>
          );
        }

      case "ACCEPTED":
        if (!isLearner) {
          return (
            <Button variant="default" size="sm" className="bg-[#8B5CF6] hover:bg-[#7C3AED]" 
              onClick={() => handleAction(transaction.id, "deliver")}>
              <Truck className="w-4 h-4 mr-1" />Mark Delivered
            </Button>
          );
        }
        break;

      case "DELIVERED":
        if (isLearner) {
          return (
            <div className="flex gap-2">
              <Button variant="default" size="sm" className="bg-[#E67E22] hover:bg-[#D35400]" 
                onClick={() => handleAction(transaction.id, "complete")}>
                <Handshake className="w-4 h-4 mr-1" />Complete
              </Button>
              <Button variant="outline" size="sm" className="border-[#F97316] text-[#F97316] hover:bg-[#F9731622]" 
                onClick={() => handleAction(transaction.id, "dispute", "Raise a dispute?")}>
                <AlertTriangle className="w-4 h-4 mr-1" />Dispute
              </Button>
            </div>
          );
        }
        break;

      default:
        return null;
    }
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.listing.title.toLowerCase().includes(search.toLowerCase()) || t.listing.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredRequests = requests.filter(r => {
    const matchesSearch = r.listing.title.toLowerCase().includes(search.toLowerCase()) || r.listing.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const loading = activeTab === "my-transactions" ? loadingTransactions : loadingRequests;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-[#E67E22]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] p-6 text-[#F0F0F0]">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My <span className="text-[#E67E22]">Transactions</span></h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 gap-4 bg-transparent p-0 h-auto">
            <TabsTrigger
              value="my-transactions"
              className="text-[#B0B0B0] data-[state=active]:text-[#F0F0F0] data-[state=active]:bg-[#151515] data-[state=active]:border data-[state=active]:border-[#E67E22] py-3 px-6 rounded-xl border border-[#333333] transition-all duration-200 hover:text-[#F0F0F0] hover:border-[#555555]"
            >
              My Transactions
            </TabsTrigger>

            <TabsTrigger
              value="requests"
              className="text-[#B0B0B0] data-[state=active]:text-[#F0F0F0] data-[state=active]:bg-[#151515] data-[state=active]:border data-[state=active]:border-[#E67E22] py-3 px-6 rounded-xl border border-[#333333] transition-all duration-200 hover:text-[#F0F0F0] hover:border-[#555555]"
            >
              Service Requests
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-4 items-center mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-900 w-4 h-4" />
              <Input
                placeholder="Search transactions"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-gray-300 text-gray-950 placeholder:text-gray-800 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-[#151515] border border-[#333333] text-[#F0F0F0] hover:border-[#E67E22]">
                  <Filter className="w-4 h-4 mr-2" />
                  Status: {statusFilter === "ALL" ? "All" : statusConfig[statusFilter]?.label}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#151515] border border-[#333333] text-[#F0F0F0]">
                <DropdownMenuItem onClick={() => setStatusFilter("ALL")}>All Status</DropdownMenuItem>
                {Object.entries(statusConfig).map(([status, config]) => (
                  <DropdownMenuItem key={status} onClick={() => setStatusFilter(status)}>{config.label}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <TabsContent value="my-transactions" className="space-y-4">
            {filteredTransactions.length === 0 ? (
              <Card className="bg-[#151515] border border-[#333333]">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Handshake className="w-12 h-12 text-[#B0B0B0] mb-4" />
                  <p className="text-[#B0B0B0] text-center">
                    {transactions.length === 0 ? "You don't have any transactions yet." : "No transactions match your search criteria."}
                  </p>
                </CardContent>
              </Card>
            ) : filteredTransactions.map(t => (
              <TransactionCard key={t.id} transaction={t} isLearner={t.learner.id === user.id} statusConfig={statusConfig} actionButtons={getActionButtons(t)} />
            ))}
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            {filteredRequests.length === 0 ? (
              <Card className="bg-[#151515] border border-[#333333]">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Clock className="w-12 h-12 text-[#B0B0B0] mb-4" />
                  <p className="text-[#B0B0B0] text-center">
                    {requests.length === 0 ? "You don't have any service requests yet." : "No requests match your search criteria."}
                  </p>
                </CardContent>
              </Card>
            ) : filteredRequests.map(r => (
              <TransactionCard key={r.id} transaction={r} isLearner={false} statusConfig={statusConfig} actionButtons={getActionButtons(r)} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function TransactionCard({ transaction, isLearner, statusConfig, actionButtons }) {
  const status = statusConfig[transaction.status];
  const otherParty = isLearner ? transaction.tutor : transaction.learner;

  return (
    <Card className="bg-[#151515] border border-[#333333] hover:border-[#E67E22] rounded-2xl shadow-md hover:shadow-[#E67E2233] transition-all">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg text-[#F0F0F0]">{transaction.listing.title}</CardTitle>
            <CardDescription className="text-[#B0B0B0]">{transaction.listing.description}</CardDescription>
          </div>
          <Badge className={status.color}>{status.label}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-1 text-[#B0B0B0]">
        <div className="flex justify-between items-start gap-6 text-sm whitespace-nowrap overflow-x-auto py-2">
          
          <div className="flex flex-col">
            <span className="font-medium">Service Value:</span>
            <div className="flex items-center gap-1 mt-1">
              <Coins className="w-4 h-4 text-yellow-500" />
              <span className="font-semibold">{transaction.credits} Credits</span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="font-medium">{isLearner ? "Tutor" : "Learner"}:</span>
            <p className="font-semibold mt-1">{otherParty.profileName}</p>
          </div>

          <div className="flex flex-col">
            <span className="font-medium">Created:</span>
            <p className="mt-1">{new Date(transaction.createdAt).toLocaleString()}</p>
          </div>

          {transaction.deliveredAt && (
            <div className="flex flex-col">
              <span className="font-medium">Delivered:</span>
              <p className="mt-1">{new Date(transaction.deliveredAt).toLocaleString()}</p>
            </div>
          )}
        </div>

        {actionButtons && (
          <div className="flex justify-end pt-4 border-t border-[#333333]">{actionButtons}</div>
        )}
      </CardContent>
    </Card>
  );
}