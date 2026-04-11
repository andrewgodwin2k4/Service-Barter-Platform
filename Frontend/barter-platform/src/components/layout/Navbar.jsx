import { NavLink, Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { BarChart3, User, Home, List, ClipboardList, Menu, X, Hexagon, MessageCircle } from "lucide-react";
import { AuthContext } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "../ThemeToggle";

const links = [
  { path: "/", label: "Home", icon: <Home size={18} /> },
  { path: "/listings", label: "Listings", icon: <List size={18} /> },
  { path: "/transactions", label: "Transactions", icon: <BarChart3 size={18} /> },
  { path: "/offer-services", label: "My Services", icon: <ClipboardList size={18} /> },
  { path: "/messages", label: "Messages", icon: <MessageCircle size={18} /> },
  { path: "/profile", label: "Profile", icon: <User size={18} /> },
];

export default function Navbar() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!token) return;
    const fetchUnread = async () => {
      try {
        const res = await api.get("/chat/unread", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUnreadCount(res.data);
      } catch (err) {
        console.error("Unread count fetch failed", err);
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 3000);
    return () => clearInterval(interval);
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border transition-colors duration-300">
      <div className="w-full flex items-center px-4 sm:px-10 py-3">
        {/* Left Section - Brand */}
        <div className="flex-1 flex justify-start">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
              <Hexagon className="w-5 h-5 text-primary-foreground fill-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              XERV
            </span>
          </Link>
        </div>

        {/* Center Section - Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {links.map(({ path, label, icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `relative flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                ${isActive
                  ? "text-primary bg-primary/10"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                }`
              }
            >
              <div className="relative">
                {icon}
                {label === "Messages" && unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-black text-white ring-2 ring-white dark:ring-black">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
              {label}
            </NavLink>
          ))}
        </div>

        {/* Right Section - Desktop Auth & Theme Toggle */}
        <div className="flex-1 flex justify-end items-center gap-3">
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            
            {token ? (
              <Button
                size="sm"
                variant="outline"
                onClick={handleLogout}
                className="border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
              >
                Logout
              </Button>
            ) : (
              <Link to="/login">
                <Button size="sm" className="font-medium shadow-sm">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Toggle Icons */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black"
          >
            <div className="px-4 py-4 space-y-1">
              {links.map(({ path, label, icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive
                      ? "text-primary bg-primary/10"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                    }`
                  }
                >
                  {icon}
                  {label}
                  {label === "Messages" && unreadCount > 0 && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-black text-white">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </NavLink>
              ))}

              <div className="pt-3 mt-2 border-t border-zinc-200 dark:border-zinc-800">
                {token ? (
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="w-full flex justify-center text-zinc-700 dark:text-zinc-300"
                  >
                    Logout
                  </Button>
                ) : (
                  <Link to="/login" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full flex justify-center">
                      Login
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}