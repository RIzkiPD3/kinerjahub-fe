import { useState } from "react";
import AuthModal from "../auth/AuthModal";

const Navbar = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <>
      <nav className="w-full bg-linear-to-r from-(--color-primary) to-(--color-secondary) shadow-lg">
        <div className="w-full px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="text-2xl font-bold text-white drop-shadow-lg">
              Kinerja<span className="text-yellow-300">Hub</span>
            </div>

            {/* Menu tengah */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#fitur"
                className="text-white/90 hover:text-white font-medium transition-all hover:scale-105"
              >
                Fitur
              </a>
              <a
                href="#harga"
                className="text-white/90 hover:text-white font-medium transition-all hover:scale-105"
              >
                Harga
              </a>
              <a
                href="#tentang"
                className="text-white/90 hover:text-white font-medium transition-all hover:scale-105"
              >
                Tentang
              </a>
              <a
                href="#kontak"
                className="text-white/90 hover:text-white font-medium transition-all hover:scale-105"
              >
                Kontak
              </a>
            </div>

            {/* Tombol Masuk */}
            <div className="flex items-center space-x-4">
              <button className="hidden md:block text-white/90 hover:text-white font-medium">
                Daftar
              </button>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-white text-(--color-primary) px-6 py-2 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all"
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
