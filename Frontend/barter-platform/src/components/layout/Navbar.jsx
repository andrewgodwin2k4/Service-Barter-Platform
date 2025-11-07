import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BarChart3, User, Home, List } from "lucide-react";

const links = [
    { path: "/", label: "Home", icon: <Home size={18}/> },
    { path: "/listings", label: "Listings", icon: <List size={18}/> },
    { path: "/transactions", label: "Transactions", icon: <BarChart3 size={18}/> },
    { path: "/profile", label: "Profile", icon: <User size={18}/> }
];

export default function Navbar() {
    return(
        <nav className="flex items-center justify-between px-8 py-4 bg-gray-900 shadow-lg">
            <h1 className="text-xl font-bold tracking-widest text-gray-100"
                style={{ fontFamily: 'Trebuchet MS, sans-serif' }} >XERV</h1>
            <div className="flex items-center gap-4">
                {links.map(({path,label,icon}) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({isActive}) =>
                            `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition
                            ${isActive ? "bg-gray-800 text-gray-100" : "text-gray-400 hover:text-gray-100 hover:bg-gray-800"}}`
                        }
                    >
                        {icon}
                        {label}
                    </NavLink>
               ))}
            </div>

            <Button size="sm" className="bg-green-800 text-gray-200 hover:bg-green-900 cursor-pointer">Login</Button>
        </nav>
    );
}
  