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
    <nav className="flex items-center justify-between px-8 py-4 bg-[#1E0B2E] shadow-lg border-b border-[#2d0f52]">
      <h1 className="text-xl font-bold tracking-widest text-gray-100"
        style={{ fontFamily: "Trebuchet MS, sans-serif" }}>XERV</h1>

      <div className="flex items-center gap-4">
        {links.map(({ path, label, icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition
              ${isActive ? "bg-[#4f2b7b] text-[#F5EFFF]" : "text-[#C3B8E2] hover:text-[#F5EFFF] hover:bg-[#4f2b7b]"}` 
            }>
                {icon}
                {label}
          </NavLink>
        ))}
      </div>

      {token ? (
        <Button size="sm" onClick={handleLogout} className="bg-[#c93434] hover:bg-[#c93434e8] text-[#F5EFFF] cursor-pointer">
          Logout
        </Button>
      ) : (
        <Link to="/login">
          <Button size="sm" className="bg-[#2F8D46] hover:bg-[#2f8d46d2] text-gray-100 cursor-pointer font-semibold">
            Login
          </Button>
        </Link>
      )}
    </nav>
  );
}
