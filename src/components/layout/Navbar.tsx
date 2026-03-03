import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full bg-primary/80 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-white drop-shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            Kinerja<span className="text-yellow-300">Hub</span>
          </Link>


          {/* Tombol Masuk / Dashboard */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-white text-primary px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all"
              >
                Dashboard
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-white text-primary px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all"
              >
                Masuk
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
