import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, Users, Zap, CheckCircle2 } from "lucide-react";

const Home = () => {
  const stats = [
    {
      label: "Pengguna Aktif",
      value: "10K+",
      icon: <Users className="w-6 h-6 text-blue-500" />,
      description: "Bergabung dengan ribuan profesional lainnya.",
    },
    {
      label: "Perusahaan Percaya",
      value: "500+",
      icon: <CheckCircle2 className="w-6 h-6 text-green-500" />,
      description: "Solusi terpercaya untuk skala startup hingga enterprise.",
    },
    {
      label: "Peningkatan Efisiensi",
      value: "40%",
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      description: "Rata-rata peningkatan produktivitas tim.",
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-white selection:bg-primary/30">
      {/* Background decorations - Animated Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[120px] animate-pulse delay-700" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-indigo-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 transition-all">
        <div className="text-center mb-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-8 animate-fade-in shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
            ✨ Transformasi Digital untuk Tim Anda
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 text-slate-900 leading-[1.1]">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-600 to-indigo-600">
              Kelola Kinerja Tim
            </span>
            <br />
            <span className="text-slate-800">Lebih Cerdas & Cepat</span>
          </h1>

          {/* Description */}
          <p className="text-xl sm:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            Tingkatkan output tim Anda dengan platform manajemen kinerja tercanggih.
            Pantau progres secara real-time dan capai target lebih efisien.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-20">
            <Link
              to="/register"
              className="group relative bg-primary text-white ml-0 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-blue-700 shadow-[0_20px_50px_rgba(8,112,184,0.3)] hover:shadow-[0_20px_50px_rgba(8,112,184,0.5)] transition-all active:scale-95 flex items-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 group-hover:translate-x-full transition-transform duration-500" />
              Mulai Sekarang — Gratis
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="px-10 py-5 rounded-2xl font-bold text-xl text-slate-700 border-2 border-slate-200 hover:border-primary hover:text-primary transition-all active:scale-95 bg-white/50 backdrop-blur-sm"
            >
              Lihat Demo
            </Link>
          </div>


          {/* Stats / Features section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="group relative flex flex-col items-start text-left bg-white/60 backdrop-blur-md border border-slate-100 rounded-[2rem] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] hover:-translate-y-2 transition-all duration-300"
              >
                <div className="mb-6 p-4 bg-slate-50 rounded-2xl group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  {stat.icon}
                </div>
                <div className="text-4xl font-extrabold text-slate-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-lg font-bold text-slate-800 mb-2">
                  {stat.label}
                </div>
                <p className="text-slate-500 font-medium">
                  {stat.description}
                </p>
                <div className="mt-6 w-full h-1 bg-slate-50 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-0 group-hover:w-full transition-all duration-700 ease-out" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
