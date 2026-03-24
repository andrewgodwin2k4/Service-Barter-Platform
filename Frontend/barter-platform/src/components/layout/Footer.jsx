import { Link } from "react-router-dom";
import { Handshake, Hexagon, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="relative bg-zinc-50 dark:bg-black border-t border-zinc-200 dark:border-zinc-900 transition-colors duration-300 overflow-hidden pt-24 pb-12">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Call to Action within Footer */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-20 pb-12 border-b border-zinc-200 dark:border-zinc-800">
           <div>
             <h3 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-2">Ready to trade skills?</h3>
             <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-md">Join the fastest growing network of digital creators exchanging value.</p>
           </div>
           <Link to="/register">
             <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center gap-4 bg-primary text-white px-8 py-5 rounded-full font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-shadow"
             >
                Get Started Free
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </div>
             </motion.button>
           </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6 group w-fit">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                <Hexagon className="w-6 h-6 text-white fill-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
                XERV
              </span>
            </Link>
            <p className="text-zinc-500 dark:text-zinc-400 text-base leading-relaxed max-w-sm font-medium mb-8">
              A professional digital service exchange. Build your startup, your portfolio, and your network without spending cash.
            </p>
          </div>

          {/* Links Columns */}
          {[
            {
               title: "Platform",
               links: [
                  { to: "/listings", label: "Browse Services" },
                  { to: "/offer-services", label: "Offer a Service" },
                  { to: "/transactions", label: "Transactions" },
               ]
            },
            {
               title: "Community",
               links: [
                  { to: "/profile", label: "My Profile" },
                  { to: "#", label: "Success Stories" },
                  { to: "#", label: "Leaderboard" },
               ]
            },
            {
               title: "Account",
               links: [
                  { to: "/login", label: "Sign In" },
                  { to: "/register", label: "Create Account" },
                  { to: "#", label: "Support" },
               ]
            }
          ].map((column, idx) => (
             <div key={idx}>
               <h4 className="text-zinc-900 dark:text-white font-bold text-lg mb-6 flex items-center gap-2">
                 {column.title}
               </h4>
               <ul className="space-y-4">
                 {column.links.map((link) => (
                   <li key={link.label}>
                     <Link to={link.to} className="group flex items-center text-zinc-500 hover:text-primary dark:text-zinc-400 dark:hover:text-primary font-medium transition-colors duration-200 w-fit">
                        <span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-300 ease-out flex items-center"><ArrowRight className="w-3 h-3" /></span>
                        {link.label}
                     </Link>
                   </li>
                 ))}
               </ul>
             </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500 dark:text-zinc-500 text-sm font-medium">
            © {new Date().getFullYear()} XERV. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-500 text-sm font-bold bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <Handshake size={14} className="text-primary" />
            Built on trust
          </div>
        </div>
      </div>
    </footer>
  );
}
