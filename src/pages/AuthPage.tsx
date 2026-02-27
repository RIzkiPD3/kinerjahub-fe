import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  Building2,
  MapPin,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import axios from "axios";

// ============================================================
// Feature Lists
// ============================================================
const loginFeatures = [
  "Tracking KPI waktu nyata",
  "Visualisasi struktur organisasi",
  "Delegasi tugas cerdas",
  "Laporan kinerja instan",
];

const registerFeatures = [
  "Kolaborasi tim tanpa batas",
  "Manajemen proyek terpadu",
  "Analitik pertumbuhan tim",
  "Keamanan data enterprise",
];

// ============================================================
// AuthPage
// ============================================================
type Mode = "login" | "register";

interface AuthPageProps {
  initialMode?: Mode;
}

export default function AuthPage({ initialMode = "login" }: AuthPageProps) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const isLogin = mode === "login";

  const switchMode = (newMode: Mode) => {
    if (newMode === mode || isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setMode(newMode);
      setIsAnimating(false);
    }, 350);
  };

  // ---- Login State ----
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [showLoginPwd, setShowLoginPwd] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);
    try {
      await login({ email: loginData.email, password: loginData.password });
      setTimeout(() => navigate("/dashboard"), 500);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setLoginError(
          err.response?.data?.message || "Email atau password salah.",
        );
      } else {
        setLoginError("Terjadi kesalahan. Silakan coba lagi.");
      }
    } finally {
      setLoginLoading(false);
    }
  };

  // ---- Register State ----
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone_number: "",
    password: "",
    organization_name: "",
    organization_address: "",
  });
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [showRegPwd, setShowRegPwd] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterLoading(true);
    setRegisterError(null);
    try {
      await register(registerData);
      setRegisterSuccess(true);
      setTimeout(() => switchMode("login"), 2000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setRegisterError(err.response?.data?.message || "Registrasi gagal.");
      } else {
        setRegisterError("Terjadi kesalahan. Silakan coba lagi.");
      }
    } finally {
      setRegisterLoading(false);
    }
  };

  const features = isLogin ? loginFeatures : registerFeatures;

  return (
    <div className="min-h-screen bg-white flex overflow-hidden relative">
      {/* ====================================================
          SLIDING OVERLAY PANEL (Desktop only)
      ==================================================== */}
      <div
        className={`absolute top-0 h-full w-1/2 z-20 transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] hidden lg:block ${
          isLogin ? "left-1/2" : "left-0"
        }`}
      >
        <div className="absolute inset-0 bg-primary overflow-hidden">
          <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-white/10 rounded-full blur-[80px] animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] bg-accent/20 rounded-full blur-[80px] animate-pulse delay-1000" />
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,1) 20px, rgba(255,255,255,1) 21px)",
            }}
          />
        </div>

        <div
          className={`relative z-10 h-full flex flex-col justify-center p-14 transition-all duration-500 ${
            isAnimating
              ? "opacity-0 translate-y-4"
              : "opacity-100 translate-y-0"
          }`}
        >
          <Link to="/" className="inline-flex items-center gap-3 mb-8 group">
            <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white font-black text-lg border border-white/30 group-hover:bg-white/30 transition-all">
              K
            </div>
            <span className="text-2xl font-bold text-white">
              Kinerja<span className="text-white/70">Hub</span>
            </span>
          </Link>

          <h1 className="text-4xl font-black text-white leading-[1.1] tracking-tight mb-3">
            {isLogin
              ? "Kelola Kinerja\nTanpa Hambatan."
              : "Bangun Tim yang\nLebih Solid."}
          </h1>
          <p className="text-white/70 text-base font-medium leading-relaxed mb-6">
            {isLogin
              ? "Platform manajemen tim all-in-one untuk produktivitas dan transparansi organisasi."
              : "Daftar sekarang dan akses alat kolaborasi tercanggih untuk pertumbuhan tim Anda."}
          </p>

          <div className="space-y-4 mb-8">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="text-white w-4 h-4" />
                </div>
                <span className="text-white/85 text-sm font-semibold">{f}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-white/20 pt-8">
            <p className="text-white/60 text-sm mb-3">
              {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}
            </p>
            <button
              onClick={() => switchMode(isLogin ? "register" : "login")}
              className="inline-flex items-center gap-2 px-6 py-2.5 border-2 border-white/40 text-white text-sm font-bold rounded-xl hover:bg-white hover:text-primary transition-all duration-300 group"
            >
              {isLogin ? "Daftar Sekarang" : "Masuk"}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* ====================================================
          LEFT: Login Form
      ==================================================== */}
      <div
        className={`flex-1 flex flex-col justify-center items-center px-8 py-6 lg:px-12 lg:py-10 overflow-y-auto transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          isLogin ? "opacity-100" : "opacity-30 pointer-events-none"
        }`}
      >
        <div
          className={`w-full max-w-sm transition-all duration-500 ${
            isAnimating && !isLogin
              ? "opacity-0 -translate-x-8"
              : isLogin
                ? "opacity-100 translate-x-0"
                : "opacity-0"
          }`}
        >
          <div className="lg:hidden mb-8 text-center">
            <Link to="/" className="text-2xl font-bold">
              Kinerja<span className="text-primary">Hub</span>
            </Link>
          </div>

          <h2 className="text-3xl font-extrabold text-foreground tracking-tight mb-1">
            Selamat Datang
          </h2>
          <p className="text-muted-foreground mb-6 text-sm font-medium">
            Masuk untuk mengelola tim Anda.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl animate-in fade-in slide-in-from-top-2">
                {loginError}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-foreground/70 uppercase tracking-widest mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-secondary/30 text-foreground text-sm transition-all"
                  placeholder="email@contoh.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground/70 uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type={showLoginPwd ? "text" : "password"}
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  className="w-full pl-10 pr-12 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-secondary/30 text-foreground text-sm transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPwd(!showLoginPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showLoginPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <a
                href="#"
                className="text-xs text-primary hover:underline font-semibold"
              >
                Lupa Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              {loginLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Memproses...
                </>
              ) : (
                "Masuk ke Akun"
              )}
            </button>
          </form>

          {/* Mobile switch + back to home */}
          <div className="mt-6 space-y-3 text-center lg:text-left">
            <p className="lg:hidden text-sm text-muted-foreground">
              Belum punya akun?{" "}
              <button
                onClick={() => switchMode("register")}
                className="text-primary font-bold hover:underline"
              >
                Daftar
              </button>
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors group"
            >
              <ArrowRight className="w-3.5 h-3.5 rotate-180 group-hover:-translate-x-1 transition-transform" />
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>

      {/* ====================================================
          RIGHT: Register Form
      ==================================================== */}
      <div
        className={`flex-1 flex flex-col justify-center items-center px-8 py-6 lg:px-12 lg:py-10 overflow-y-auto transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          !isLogin ? "opacity-100" : "opacity-30 pointer-events-none"
        }`}
      >
        <div
          className={`w-full max-w-sm transition-all duration-500 ${
            isAnimating && isLogin
              ? "opacity-0 translate-x-8"
              : !isLogin
                ? "opacity-100 translate-x-0"
                : "opacity-0"
          }`}
        >
          <div className="lg:hidden mb-6 text-center">
            <Link to="/" className="text-2xl font-bold">
              Kinerja<span className="text-primary">Hub</span>
            </Link>
          </div>

          <h2 className="text-3xl font-extrabold text-foreground tracking-tight mb-1">
            Bergabunglah
          </h2>
          <p className="text-muted-foreground mb-4 text-sm font-medium">
            Buat akun dan mulai perjalanan Anda.
          </p>

          <form onSubmit={handleRegister} className="space-y-3">
            {registerSuccess && (
              <div className="p-3 bg-green-50 border border-green-200 text-green-600 text-sm rounded-xl animate-in fade-in">
                Registrasi berhasil! Mengalihkan ke halaman login...
              </div>
            )}
            {registerError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl animate-in fade-in slide-in-from-top-2">
                {registerError}
              </div>
            )}

            {/* Nama Lengkap */}
            <div>
              <label className="block text-xs font-bold text-foreground/70 uppercase tracking-widest mb-1.5">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  value={registerData.name}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, name: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-secondary/30 text-foreground text-sm transition-all"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            {/* Nama Organisasi */}
            <div>
              <label className="block text-xs font-bold text-foreground/70 uppercase tracking-widest mb-1">
                Nama Organisasi
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  value={registerData.organization_name}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      organization_name: e.target.value,
                    })
                  }
                  className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-secondary/30 text-foreground text-sm transition-all"
                  placeholder="PT Maju Bersama"
                  required
                />
              </div>
            </div>

            {/* Alamat Organisasi */}
            <div>
              <label className="block text-xs font-bold text-foreground/70 uppercase tracking-widest mb-1">
                Alamat Organisasi
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  value={registerData.organization_address}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      organization_address: e.target.value,
                    })
                  }
                  className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-secondary/30 text-foreground text-sm transition-all"
                  placeholder="Jl. Merdeka No. 123"
                  required
                />
              </div>
            </div>

            {/* Telepon */}
            <div>
              <label className="block text-xs font-bold text-foreground/70 uppercase tracking-widest mb-1">
                Telepon
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="tel"
                  value={registerData.phone_number}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      phone_number: e.target.value,
                    })
                  }
                  className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-secondary/30 text-foreground text-sm transition-all"
                  placeholder="08xx"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-foreground/70 uppercase tracking-widest mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="email"
                  value={registerData.email}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, email: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-secondary/30 text-foreground text-sm transition-all"
                  placeholder="email@"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-foreground/70 uppercase tracking-widest mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type={showRegPwd ? "text" : "password"}
                  value={registerData.password}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      password: e.target.value,
                    })
                  }
                  className="w-full pl-10 pr-12 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-secondary/30 text-foreground text-sm transition-all"
                  placeholder="Min. 8 karakter"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowRegPwd(!showRegPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showRegPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={registerLoading}
              className="w-full bg-primary text-white py-2.5 rounded-xl font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm mt-1"
            >
              {registerLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Mendaftar...
                </>
              ) : (
                "Buat Akun"
              )}
            </button>
          </form>

          {/* Mobile switch + back to home */}
          <div className="mt-5 space-y-3 text-center lg:text-left">
            <p className="lg:hidden text-sm text-muted-foreground">
              Sudah punya akun?{" "}
              <button
                onClick={() => switchMode("login")}
                className="text-primary font-bold hover:underline"
              >
                Masuk
              </button>
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors group"
            >
              <ArrowRight className="w-3.5 h-3.5 rotate-180 group-hover:-translate-x-1 transition-transform" />
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
