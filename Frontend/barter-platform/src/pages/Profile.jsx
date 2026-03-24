import { useEffect, useState, useContext, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import api from "@/lib/api";
import { AuthContext } from "@/context/AuthContext";
import {
  User, Mail, AtSign, Coins, Pencil, X, RefreshCw, FileText,
  TrendingUp, TrendingDown, Package, CheckCircle, Clock, ArrowUpRight,
  Layers, BarChart3, Activity, Wallet, Medal, Sparkles, Star, Upload
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from "recharts";

const COLORS = ['var(--color-primary)', 'var(--color-sky-500)', 'var(--color-emerald-500)', 'var(--color-amber-500)', 'var(--color-rose-500)'];

export default function Profile() {
  const { id } = useParams();
  const { token, user: currentUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ profileName: "", bio: "" });
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const isOwnProfile = !id || (currentUser && currentUser.id === parseInt(id));

  // Stats
  const [myListings, setMyListings] = useState([]);
  const [myTransactions, setMyTransactions] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);

  // Animation Controls
  const [isChart1Visible, setIsChart1Visible] = useState(false);
  const [isChart2Visible, setIsChart2Visible] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const userEndpoint = id ? `/users/${id}` : "/users/me";
        const userRes = await api.get(userEndpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = userRes.data;
        setUser(userData);
        setForm({ profileName: userData.profileName || "", bio: userData.bio || "" });

        const [listingsRes, transRes, reqRes] = await Promise.all([
          api.get("/listings", { params: { userId: userData.id }, headers: { Authorization: `Bearer ${token}` } }),
          api.get(`/transactions/user/${userData.id}`, { headers: { Authorization: `Bearer ${token}` } }),
          api.get(`/transactions/requests/${userData.id}`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setMyListings(listingsRes.data || []);
        setMyTransactions(transRes.data || []);
        setIncomingRequests(reqRes.data || []);
      } catch (err) {
        console.error("Failed to fetch profile data", err);
        toast.error("Failed to load profile");
      }
      setLoading(false);
    };
    fetchAll();
  }, [token, id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const t = toast.loading("Updating profile...");
    try {
      const res = await api.put(`/users/${user.id}`, { ...form, username: user.username, email: user.email }, { headers: { Authorization: `Bearer ${token}` } });
      setUser(res.data);
      setIsEditing(false);
      toast.success("Profile updated!", { id: t });
    } catch (err) {
      console.error("Failed to update profile", err);
      toast.error("Failed to update profile", { id: t });
    }
    setSaving(false);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    setUploadingAvatar(true);
    const t = toast.loading("Uploading avatar...");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post(`/users/${user.id}/avatar`, formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
      toast.success("Avatar updated successfully!", { id: t });
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload avatar.", { id: t });
    }
    setUploadingAvatar(false);
  };

  const downloadReport = () => {
    const allData = [
      ...myTransactions.map(t => ({ ...t, type: 'Expense' })),
      ...incomingRequests.map(r => ({ ...r, type: 'Income' }))
    ].sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    const headers = ["Date", "Type", "Service", "Partner", "Credits", "Status"];
    const rows = allData.map(t => [
      new Date(t.updatedAt).toLocaleDateString(),
      t.type,
      t.listing?.title || "N/A",
      t.type === 'Expense' ? t.provider?.profileName : t.buyer?.profileName,
      t.credits,
      t.status
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `XERV_Financial_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Financial report downloaded!");
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black"><RefreshCw className="w-10 h-10 animate-spin text-primary" /></div>;
  }
  if (!user) return <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black"><p className="text-zinc-500 text-xl font-bold">Unable to load profile.</p></div>;

  // Compute stats
  const allTransactions = [...myTransactions, ...incomingRequests];
  const creditsEarned = incomingRequests.filter(t => t.status === "COMPLETED" || t.status === "AUTO_COMPLETED").reduce((sum, t) => sum + t.credits, 0);
  const creditsSpent = myTransactions.filter(t => t.status === "COMPLETED" || t.status === "AUTO_COMPLETED").reduce((sum, t) => sum + t.credits, 0);

  // Chart 1: Financial Flow (Group by Month for Area Chart)
  // Generating last 6 months dynamically based on available data or filling empty
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonth = new Date().getMonth();
  const flowData = Array.from({ length: 6 }).map((_, i) => {
    const m = new Date();
    m.setMonth(currentMonth - (5 - i));
    return { name: months[m.getMonth()], Earned: 0, Spent: 0, monthIndex: m.getMonth() };
  });

  incomingRequests.forEach(req => {
     if(req.status === 'COMPLETED' || req.status === 'AUTO_COMPLETED') {
        const reqMonth = new Date(req.createdAt).getMonth();
        const bin = flowData.find(d => d.monthIndex === reqMonth);
        if(bin) bin.Earned += req.credits;
     }
  });
  myTransactions.forEach(tx => {
    if(tx.status === 'COMPLETED' || tx.status === 'AUTO_COMPLETED') {
        const txMonth = new Date(tx.createdAt).getMonth();
        const bin = flowData.find(d => d.monthIndex === txMonth);
        if(bin) bin.Spent += tx.credits;
     }
  });

  // Chart 2: Category Distribution
  const categoryCount = {};
  myListings.forEach(l => {
    const cat = l.category?.replace(/_/g, " ") || "Other";
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  });
  const pieData = Object.entries(categoryCount).map(([name, value]) => ({ name, value }));

  // Custom Tooltip for Charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl shadow-xl">
          <p className="font-bold text-zinc-900 dark:text-white mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} className="text-sm font-semibold flex items-center gap-2" style={{ color: entry.color }}>
              <span className="w-2 h-2 rounded-full" style={{ background: entry.color }}/>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-10 bg-zinc-50 dark:bg-black transition-colors duration-300 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ═══ TOP: PROFILE HEADER ═══ */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
          {/* Banner */}
          <div className="h-48 sm:h-64 bg-zinc-900 relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-indigo-500/20 to-transparent" />
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.4] mix-blend-overlay" />
             <div className="absolute top-8 right-8 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full hidden sm:flex items-center gap-2 text-white font-bold text-sm">
                <Sparkles className="w-4 h-4 text-yellow-400" /> Executive Member
             </div>
          </div>

          <div className="px-6 sm:px-12 pb-10 sm:pb-12">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8 -mt-20 sm:-mt-24 relative z-10 w-full">
              <div className="relative">
                <motion.div whileHover={{ scale: 1.05 }} className="w-32 h-32 sm:w-40 sm:h-40 rounded-[2rem] bg-white dark:bg-black p-2 shadow-2xl relative group overflow-hidden cursor-pointer">
                   <div className="w-full h-full rounded-[1.5rem] bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center border-4 border-transparent bg-clip-padding overflow-hidden relative">
                     {user.avatarUrl ? (
                        <img src={`http://localhost:8080${user.avatarUrl}`} alt="Avatar" className="w-full h-full object-cover" />
                     ) : (
                        <span className="text-6xl sm:text-7xl font-black text-white drop-shadow-lg">
                          {(user.profileName || user.username || "?").charAt(0).toUpperCase()}
                        </span>
                     )}
                     
                     {isOwnProfile && (
                       <label className="absolute bottom-2 right-2 w-10 h-10 rounded-2xl bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 flex items-center justify-center opacity-100 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all cursor-pointer shadow-xl group/edit z-20">
                          <span className="text-zinc-900 dark:text-zinc-100 flex items-center justify-center transition-transform group-hover/edit:scale-110">
                            {uploadingAvatar ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Pencil className="w-5 h-5" />}
                          </span>
                          <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploadingAvatar} />
                       </label>
                     )}
                   </div>
                </motion.div>
              </div>
              
              <div className="flex-1 text-center sm:text-left min-w-0 mb-3">
                <h1 className="text-4xl sm:text-5xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center justify-center sm:justify-start gap-3">
                  {user.profileName || user.username}
                  {creditsEarned > 500 && <Medal className="w-8 h-8 text-primary" />}
                </h1>
                
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-3 mb-1">
                  {user.averageRating > 0 && (
                    <div className="flex items-center gap-1.5 text-amber-500 font-black text-lg bg-amber-50 dark:bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-200 dark:border-amber-500/30 w-fit mx-auto sm:mx-0 shadow-sm">
                      <Star className="w-5 h-5 fill-current" />
                      {user.averageRating.toFixed(1)} <span className="text-sm text-zinc-500 dark:text-zinc-500 font-bold ml-1">({user.totalRatings} Ratings)</span>
                    </div>
                  )}
                  <p className="text-zinc-500 dark:text-zinc-400 font-bold text-lg">
                    @{user.username} <span className="hidden sm:inline mx-2 text-zinc-300 dark:text-zinc-700">•</span> <span className="block sm:inline">{user.email}</span>
                  </p>
                </div>
              </div>
              
                {isOwnProfile && (
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsEditing(!isEditing)} className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-sm mb-4 transition-colors shadow-lg shadow-black/10 dark:shadow-white/10 shrink-0">
                    {isEditing ? <X size={18} /> : <Pencil size={18} />}
                    {isEditing ? "Close" : "Edit Profile"}
                  </motion.button>
                )}
            </div>

            <AnimatePresence mode="wait">
              {!isEditing ? (
                <motion.p key="bio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-zinc-600 dark:text-zinc-400 text-lg sm:text-xl mt-8 leading-relaxed font-medium max-w-4xl">
                  {user.bio || "Complete your profile by adding a biography. Buyers trust providers with rich profiles."}
                </motion.p>
              ) : (
                <motion.form key="form" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} onSubmit={handleSave} className="flex flex-col gap-6 mt-8 p-8 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-2 block uppercase tracking-wider">Display Name</label>
                      <input type="text" name="profileName" value={form.profileName} onChange={handleChange} className="w-full p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-zinc-900 dark:text-white font-semibold text-lg" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-2 block uppercase tracking-wider">Biography</label>
                    <textarea name="bio" value={form.bio} onChange={handleChange} rows={4} className="w-full p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-zinc-900 dark:text-white font-medium text-lg resize-none" />
                  </div>
                  <div className="flex justify-end gap-4 mt-2">
                    <button type="submit" disabled={saving} className="px-10 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all text-lg border border-primary">
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ═══ MIDDLE: KPI STAT CARDS ═══ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={<Wallet className="w-8 h-8" />} label="Current Balance" value={user.credits} suffix="CR" delay={0.1} />
          <StatCard icon={<TrendingUp className="w-8 h-8 text-emerald-500" />} label="Lifetime Earned" value={creditsEarned} suffix="CR" delay={0.2} />
          <StatCard icon={<TrendingDown className="w-8 h-8 text-rose-500" />} label="Lifetime Spent" value={creditsSpent} suffix="CR" delay={0.3} />
          <StatCard icon={<Package className="w-8 h-8 text-indigo-500" />} label="Active Listings" value={myListings.length} suffix="" delay={0.4} />
        </div>

        {/* ═══ CHARTS & DATA VISUALIZATION ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* Line Chart: Financial Flow */}
           <motion.div 
             initial={{ opacity: 0, y: 30 }} 
             whileInView={{ opacity: 1, y: 0 }} 
             onViewportEnter={() => setIsChart1Visible(true)}
             viewport={{ once: true, amount: 0.1 }}
             className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl shadow-black/5 dark:shadow-none"
           >
             <div className="flex items-center justify-between mb-8">
                <div>
                   <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Credit Flow</h2>
                   <p className="text-zinc-500 dark:text-zinc-400 font-medium mt-1">Earned vs Spent over the last 6 months</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-black flex items-center justify-center">
                   <Activity className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
                </div>
             </div>
             
             <div className="h-[300px] w-full">
               {isChart1Visible && (
                 <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={flowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                     <defs>
                       <linearGradient id="colorEarned" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                         <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                       </linearGradient>
                       <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="var(--color-rose-500)" stopOpacity={0.3}/>
                         <stop offset="95%" stopColor="var(--color-rose-500)" stopOpacity={0}/>
                       </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-zinc-200 dark:text-zinc-800" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-zinc-500)', fontSize: 12, fontWeight: 600 }} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-zinc-500)', fontSize: 12, fontWeight: 600 }} />
                     <RechartsTooltip content={<CustomTooltip />} />
                     <Area type="monotone" dataKey="Earned" stroke="var(--color-primary)" strokeWidth={4} fillOpacity={1} fill="url(#colorEarned)" />
                     <Area type="monotone" dataKey="Spent" stroke="var(--color-rose-500)" strokeWidth={4} fillOpacity={1} fill="url(#colorSpent)" />
                   </AreaChart>
                 </ResponsiveContainer>
               )}
             </div>

             {/* Financial Report Section */}
             <div className="mt-10 pt-8 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-emerald-500" />
                   </div>
                   <div>
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Financial Export</h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-500 font-medium">Download your full transaction history as a CSV file</p>
                   </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }}
                  onClick={downloadReport}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-black dark:hover:bg-zinc-800 text-zinc-900 dark:text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 border border-zinc-200 dark:border-zinc-800 shadow-sm"
                >
                  <Upload className="w-4 h-4 rotate-180" /> Export CSV Report
                </motion.button>
             </div>
           </motion.div>

           {/* Pie Chart: Skills Breakdown */}
           <motion.div 
             initial={{ opacity: 0, y: 30 }} 
             whileInView={{ opacity: 1, y: 0 }} 
             onViewportEnter={() => setIsChart2Visible(true)}
             viewport={{ once: true, amount: 0.1 }}
             transition={{ delay: 0.2 }} 
             className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl shadow-black/5 dark:shadow-none flex flex-col"
           >
             <div className="flex items-center justify-between mb-2">
                <div>
                   <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Portfolio</h2>
                   <p className="text-zinc-500 dark:text-zinc-400 font-medium mt-1">Active categories</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-black flex items-center justify-center">
                   <Layers className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
                </div>
             </div>
             
             <div className="flex-1 min-h-[250px] w-full mt-4 flex items-center justify-center">
               {pieData.length === 0 ? (
                 <div className="text-center">
                   <Layers className="w-16 h-16 text-zinc-300 dark:text-zinc-800 mx-auto mb-4" />
                   <p className="text-zinc-500 font-bold">No active listings.</p>
                 </div>
               ) : (
                 <>
                   {isChart2Visible && (
                     <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                         <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none">
                           {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} /> )}
                         </Pie>
                         <RechartsTooltip content={<CustomTooltip />} />
                         <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-zinc-500)' }}/>
                       </PieChart>
                     </ResponsiveContainer>
                   )}
                 </>
               )}
             </div>
           </motion.div>
        </div>

        {/* ═══ BOTTOM: RECENT TRANSACTION FEED ═══ */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once:true }} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl shadow-black/5 dark:shadow-none">
          <div className="flex items-center justify-between mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-6">
            <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-3">
              <Clock className="w-8 h-8 text-primary" /> Activity Feed
            </h2>
            <Link to="/transactions">
              <span className="text-primary font-bold text-sm hover:underline cursor-pointer">View All</span>
            </Link>
          </div>

          {allTransactions.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 font-bold text-lg">Your activity feed is empty. Start trading!</div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {allTransactions.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 6).map((tx, i) => {
                const isBuyer = tx.buyer?.id === user.id;
                const isSuccess = tx.status === "COMPLETED" || tx.status === "AUTO_COMPLETED";
                
                return (
                  <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once:true }} transition={{ delay: i * 0.1 }} key={tx.id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-[1.5rem] bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-5 mb-4 sm:mb-0">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${
                        isSuccess ? "bg-emerald-500/10 text-emerald-500" :
                        tx.status === "PENDING" ? "bg-amber-500/10 text-amber-500" :
                        tx.status === "REJECTED" || tx.status === "CANCELLED" ? "bg-rose-500/10 text-rose-500" :
                        "bg-primary/10 text-primary"
                      }`}>
                        {isSuccess ? <CheckCircle className="w-7 h-7" /> : tx.status === "PENDING" ? <Clock className="w-7 h-7" /> : <ArrowUpRight className="w-7 h-7" />}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight mb-1 group-hover:text-primary transition-colors">{tx.listing?.title}</h4>
                        <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm flex items-center gap-2">
                          <span className={isBuyer ? "text-rose-500" : "text-emerald-500"}>{isBuyer ? "Outgoing Request" : "Incoming Service"}</span>
                          <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                          <span className="uppercase tracking-widest text-[10px] font-black">{tx.status.replace(/_/g, " ")}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-zinc-200 dark:border-zinc-800 pt-4 sm:pt-0">
                      <p className={`text-2xl font-black ${isBuyer ? "text-zinc-900 dark:text-white" : "text-emerald-500"}`}>
                        {isBuyer ? "-" : "+"}{tx.credits} <span className="text-sm font-bold text-zinc-500 dark:text-zinc-400">CR</span>
                      </p>
                      <p className="text-sm font-bold text-zinc-400 dark:text-zinc-500">
                        {new Date(tx.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}

function StatCard({ icon, label, value, suffix, delay }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once:true }} transition={{ duration: 0.5, delay }} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-8 shadow-2xl shadow-black/5 dark:shadow-none hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden group">
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000 pointer-events-none" />
      <div className="w-14 h-14 rounded-[1.5rem] bg-zinc-100 dark:bg-black flex items-center justify-center mb-6 text-zinc-900 dark:text-white shadow-inner">
        {icon}
      </div>
      <p className="text-4xl sm:text-5xl font-black text-zinc-900 dark:text-white tracking-tighter mb-2">
        {value}<span className="text-2xl text-zinc-400 dark:text-zinc-600 ml-1 font-bold">{suffix}</span>
      </p>
      <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">{label}</p>
    </motion.div>
  );
}