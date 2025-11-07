import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Listings from "./pages/Listings";
import Transactions from "./pages/Transactions";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Navbar from "./components/layout/Navbar"

function App() {
  return(
    <Router>
      <div className="min-h-screen bg-gray-950 text-gray-200">
        <Navbar />
        <main className="px-6 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;