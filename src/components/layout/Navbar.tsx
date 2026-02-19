import { useState } from "react";
import { Link } from "react-router-dom";
import AuthModal from "../auth/AuthModal";

const Navbar = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <>
      <nav className="w-full bg-primary border-b border-white/10 shadow-md">
        <div className="w-full px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link
              to="/"
              className="text-2xl font-bold text-white drop-shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              Kinerja<span className="text-yellow-300">Hub</span>
            </Link>

            {/* Menu tengah */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="/dashboard"
                className="text-white/90 hover:text-white font-medium transition-all hover:scale-105"
              >
                Dashboard
              </a>
              <a
                href="#about"
                className="text-white/90 hover:text-white font-medium transition-all hover:scale-105"
              >
                About us
              </a>
              <a
                href="#contact"
                className="text-white/90 hover:text-white font-medium transition-all hover:scale-105"
              >
                Contact
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-white text-primary px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all"
              >
                Masuk
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
