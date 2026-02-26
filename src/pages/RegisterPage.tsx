import { useNavigate, Link } from "react-router-dom";
import RegisterForm from "@/components/auth/RegisterForm";
import { useState } from "react";
import { CheckCircle, ShieldCheck, TrendingUp, Globe } from "lucide-react";

const perks = [
  {
    icon: <ShieldCheck size={20} />,
    title: "Keamanan Data Terjamin",
    desc: "Data organisasi Anda dienkripsi dan dilindungi sepenuhnya.",
  },
  {
    icon: <TrendingUp size={20} />,
    title: "Kinerja Meningkat 40%",
    desc: "Tim yang menggunakan KinerjaHub rata-rata 40% lebih produktif.",
  },
  {
    icon: <Globe size={20} />,
    title: "Akses Dimana Saja",
    desc: "Platform berbasis cloud yang bisa diakses dari mana saja, kapan saja.",
  },
];

const RegisterPage = () => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegisterSuccess = () => {
    setSuccessMessage("Registrasi berhasil! Silakan login dengan akun Anda.");
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left Panel: Branding ────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-700 to-primary" />

        {/* Decorative blobs */}
        <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-blue-400/20 rounded-full blur-3xl" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          {/* Logo */}
          <Link to="/" className="text-3xl font-bold text-white">
            Kinerja<span className="text-blue-200">Hub</span>
          </Link>

          {/* Center content */}
          <div className="max-w-sm">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium px-4 py-2 rounded-full mb-8 border border-white/20">
              🚀 Coba Gratis 14 Hari
            </div>

            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Mulai Perjalanan
              <br />
              <span className="text-blue-200">Produktivitas</span> Anda
            </h1>

            <p className="text-white/70 text-base leading-relaxed mb-10">
              Daftar sekarang dan rasakan perbedaan nyata dalam pengelolaan
              kinerja tim Anda. Tanpa kartu kredit.
            </p>

            {/* Perks list */}
            <div className="space-y-3">
              {perks.map((p, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/10 hover:bg-white/15 transition-colors"
                >
                  <div className="shrink-0 w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center text-white">
                    {p.icon}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{p.title}</p>
                    <p className="text-white/60 text-xs mt-0.5">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-3 mt-8 p-4 bg-white/10 rounded-xl border border-white/10">
              <div className="flex -space-x-2">
                {["bg-blue-300", "bg-purple-300", "bg-pink-300", "bg-yellow-300"].map(
                  (color, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full border-2 border-white/20 ${color}`}
                    />
                  )
                )}
              </div>
              <p className="text-white/80 text-sm">
                <span className="font-semibold text-white">500+</span> perusahaan
                sudah bergabung
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-6 text-white/40 text-sm">
            <span>© 2025 KinerjaHub</span>
            <span>·</span>
            <a href="#" className="hover:text-white/70 transition-colors">
              Privasi
            </a>
          </div>
        </div>
      </div>

      {/* ── Right Panel: Form ───────────────────────────────────── */}
      <div className="flex-1 flex flex-col bg-background overflow-y-auto">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center justify-between p-6 border-b border-border">
          <Link to="/" className="text-2xl font-bold text-foreground">
            Kinerja<span className="text-primary">Hub</span>
          </Link>
          <Link
            to="/login"
            className="text-sm text-primary font-medium hover:underline"
          >
            Masuk
          </Link>
        </div>

        {/* Form area */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 sm:px-12">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground">
                Buat Akun Baru ✨
              </h2>
              <p className="text-muted-foreground mt-2">
                Daftar dan mulai kelola tim Anda dalam menit
              </p>
            </div>

            {/* Success message */}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-600 text-sm font-medium rounded-xl flex items-center gap-3">
                <CheckCircle size={18} className="shrink-0" />
                {successMessage}
              </div>
            )}

            {/* Register form */}
            <RegisterForm
              onSuccess={handleRegisterSuccess}
              onSwitchToLogin={() => navigate("/login")}
            />

            {/* Bottom switch */}
            <p className="text-center text-sm text-muted-foreground mt-8">
              Sudah punya akun?{" "}
              <Link
                to="/login"
                className="text-primary font-semibold hover:underline"
              >
                Masuk Sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
