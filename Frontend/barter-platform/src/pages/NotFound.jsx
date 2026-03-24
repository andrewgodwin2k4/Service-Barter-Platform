import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden bg-white dark:bg-black transition-colors duration-300">
      {/* Soft Background Accents */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center max-w-lg mx-auto"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white dark:bg-zinc-900 flex items-center justify-center mb-8 border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none"
        >
          <AlertTriangle className="w-12 h-12 sm:w-16 sm:h-16 text-primary" />
        </motion.div>

        <h1 className="text-7xl sm:text-9xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight mb-4">404</h1>

        <h2 className="text-2xl sm:text-3xl font-bold text-zinc-800 dark:text-zinc-200 mb-4">
          Page Not Found
        </h2>

        <p className="text-zinc-600 dark:text-zinc-400 mb-10 text-base sm:text-lg leading-relaxed">
          Oops! The page you're looking for doesn't exist or has been moved.
          Let's get you back to exchanging services.
        </p>

        <Link to="/">
          <Button size="lg" className="px-8 py-6 rounded-xl font-bold text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300">
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}