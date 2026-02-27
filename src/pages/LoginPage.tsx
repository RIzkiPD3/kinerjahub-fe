import { useNavigate, Link } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import AuthLayout from "@/components/auth/AuthLayout";
import { useState } from "react";
import { CheckCircle, BarChart3, Users, Zap } from "lucide-react";

const features = [
  {
    icon: <BarChart3 size={20} />,
    title: "Pantau Kinerja Real-time",
    desc: "Dashboard interaktif untuk memonitor produktivitas tim secara langsung.",
  },
  {
    icon: <Users size={20} />,
    title: "Manajemen Tim Mudah",
    desc: "Kelola departemen, divisi, dan anggota tim dalam satu platform.",
  },
  {
    icon: <Zap size={20} />,
    title: "Otomatisasi Tugas",
    desc: "Assign, track, dan selesaikan tugas dengan alur kerja yang efisien.",
  },
];

const LoginPage = () => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    setSuccessMessage("Login berhasil! Mengalihkan...");
    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <>
      <AuthLayout
        formPosition="left"
        title="Selamat Datang"
        subtitle="Masuk untuk mengelola tim Anda dengan lebih efisien."
        marketingContent={{
          hero: "Kelola Kinerja Tanpa Hambatan.",
          description:
            "Platform manajemen tim all-in-one untuk meningkatkan produktivitas dan transparansi organisasi Anda.",
          features: [
            "Tracking KPI waktu nyata",
            "Visualisasi struktur organisasi",
            "Delegasi tugas cerdas",
            "Laporan kinerja instan",
          ],
        }}
      >
        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-600 text-sm font-semibold rounded-2xl animate-in fade-in slide-in-from-top-2">
            {successMessage}
          </div>
        )}

        <LoginForm
          onSuccess={handleLoginSuccess}
          onSwitchToRegister={() => navigate("/register")}
        />
      </AuthLayout>
      <div className="min-h-screen flex">
        {/* ── Left Panel: Branding ────────────────────────────────── */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-blue-700 to-blue-900" />

          {/* Decorative blobs */}
          <div className="absolute top-[-10%] left-[-10%] w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-blue-400/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

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
            <div className="max-w-lg">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium px-4 py-2 rounded-full mb-8 border border-white/20">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Platform Manajemen Kinerja #1
              </div>

              <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
                Tingkatkan Produktivitas
                <br />
                <span className="text-blue-200">Tim Anda</span> Setiap Hari
              </h1>

              <p className="text-white/70 text-lg leading-relaxed mb-10">
                Bergabung dengan lebih dari 500 perusahaan yang telah
                mengoptimalkan kinerja tim mereka menggunakan KinerjaHub.
              </p>

              {/* Features list */}
              <div className="space-y-4">
                {features.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/15 transition-colors"
                  >
                    <div className="shrink-0 w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white">
                      {f.icon}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{f.title}</p>
                      <p className="text-white/60 text-sm mt-0.5">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-6 text-white/40 text-sm">
              <span>© 2025 KinerjaHub</span>
              <span>·</span>
              <a href="#" className="hover:text-white/70 transition-colors">
                Kebijakan Privasi
              </a>
              <span>·</span>
              <a href="#" className="hover:text-white/70 transition-colors">
                Syarat & Ketentuan
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
              to="/register"
              className="text-sm text-primary font-medium hover:underline"
            >
              Daftar
            </Link>
          </div>

          {/* Form area */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 sm:px-12">
            <div className="w-full max-w-md">
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground">
                  Selamat Datang Kembali 👋
                </h2>
                <p className="text-muted-foreground mt-2">
                  Masuk ke akun KinerjaHub Anda
                </p>
              </div>

              {/* Success message */}
              {successMessage && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-600 text-sm font-medium rounded-xl flex items-center gap-3">
                  <CheckCircle size={18} className="shrink-0" />
                  {successMessage}
                </div>
              )}

              {/* Login form */}
              <LoginForm
                onSuccess={handleLoginSuccess}
                onSwitchToRegister={() => navigate("/register")}
              />

              {/* Bottom switch */}
              <p className="text-center text-sm text-muted-foreground mt-8">
                Belum punya akun?{" "}
                <Link
                  to="/register"
                  className="text-primary font-semibold hover:underline"
                >
                  Daftar Sekarang
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
