import { NavLink, Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Button } from "@/components/ui/button";
import { BarChart3, User, Home, List, ClipboardList } from "lucide-react";
import { AuthContext } from "@/context/AuthContext";

const links = [
  { path: "/", label: "Home", icon: <Home size={18}/> },
  { path: "/listings", label: "Listings", icon: <List size={18}/> },
  { path: "/transactions", label: "Transactions", icon: <BarChart3 size={18}/> },
  { path: "/offer-services", label: "My Services", icon: <ClipboardList size={18}/> },
  { path: "/profile", label: "Profile", icon: <User size={18}/> }
];

export default function Navbar() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-[#151515] shadow-lg border-b border-[#333333]">
      <h1 className="text-xl font-bold tracking-widest text-[#E67E22]"
        style={{ fontFamily: "Trebuchet MS, sans-serif" }}>XERV</h1>

      <div className="flex items-center gap-4">
        {links.map(({ path, label, icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition
              ${isActive ? "bg-[#2A2A2A] text-[#F0F0F0]" : "text-[#B0B0B0] hover:text-[#F0F0F0] hover:bg-[#2A2A2A]"}` 
            }>
                {icon}
                {label}
          </NavLink>
        ))}
      </div>

      {token ? (
        <Button size="sm" onClick={handleLogout} className="bg-[#DC2626] hover:bg-[#B91C1C] text-[#F0F0F0] cursor-pointer">Logout</Button>
      ) : (
        <Link to="/login">
          <Button size="sm" className="bg-[#1E5430] hover:bg-[#1e5430d1] text-[#E8F5E9] cursor-pointer font-semibold">Login</Button>
        </Link>
      )}
    </nav>
  );
}