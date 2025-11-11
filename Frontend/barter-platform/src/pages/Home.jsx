import { Button } from "@/components/ui/button";
import { ArrowRight, Handshake } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center text-center text-gray-100 px-6 overflow-hidden">

      {/* SVG Background */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 1440 320"
      >
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#111827" />
            <stop offset="50%" stopColor="#1f2937" />
            <stop offset="100%" stopColor="#374151" />
          </linearGradient>
        </defs>
        <path
          fill="url(#grad)"
          fillOpacity="0.4"
          d="M0,160L80,144C160,128,320,96,480,101.3C640,107,800,149,960,160C1120,171,1280,149,1360,138.7L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
        ></path>
      </svg>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">

        <div className="flex items-center gap-2 text-gray-400 mb-4">
          <Handshake className="w-5 h-5 text-gray-300" />
          <span className="uppercase text-xs tracking-widest font-medium">
            Service Barter Platform
          </span>
        </div>

        <h1 className="text-5xl font-bold mb-8 max-w-xl tracking-widest">
          Exchange <span className="text-gray-400">Services</span>, 
          Build <span className="text-gray-400">Connections</span>
        </h1>

        <p className="text-gray-400 max-w-2xl mx-auto mb-10 text-lg">
          Offer what you’re good at - whether it’s tutoring, design, repairs, or advice - 
          and get help in return. A community built on mutual exchange, not money.
        </p>

        <div className="flex flex-wrap justify-center gap-4">

          <Link to="/offer-services">
            <Button className="bg-zinc-700 hover:bg-zinc-800 text-gray-100 cursor-pointer">
              Offer a Service
            </Button>
          </Link>

          <Link to="/listings">
            <Button className="bg-green-800 text-gray-200 hover:bg-green-900 cursor-pointer">
              Explore Listings
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>

        </div>

      </div>
    </section>
  );
}
