import { useState } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLoginSuccess = () => {
    setSuccessMessage("Login berhasil! Mengalihkan...");
    setTimeout(() => {
      navigate("/dashboard");
      onClose();
      setSuccessMessage(null);
    }, 1500);
  };

  const handleRegisterSuccess = () => {
    setSuccessMessage("Registrasi berhasil! Silakan login.");
    setTimeout(() => {
      setIsLogin(true);
      setSuccessMessage(null);
    }, 2000);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50">
        <div className="bg-background rounded-2xl shadow-2xl border border-border overflow-hidden">
          {/* Header */}
          <div className="relative bg-primary p-6">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-white/80 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold text-white">
              {isLogin ? "Selamat Datang Kembali" : "Buat Akun Baru"}
            </h2>
            <p className="text-white/80 text-sm mt-1">
              {isLogin
                ? "Masuk ke akun KinerjaHub Anda"
                : "Daftar untuk mulai menggunakan KinerjaHub"}
            </p>
          </div>

          <div className="p-6">
            {successMessage && (
              <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 text-green-600 text-sm rounded-lg">
                {successMessage}
              </div>
            )}

            {isLogin ? (
              <LoginForm
                onSuccess={handleLoginSuccess}
                onSwitchToRegister={() => setIsLogin(false)}
              />
            ) : (
              <RegisterForm
                onSuccess={handleRegisterSuccess}
                onSwitchToLogin={() => setIsLogin(true)}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthModal;
