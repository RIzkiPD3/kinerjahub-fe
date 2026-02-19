import { useState } from "react";
import {
  Users,
  ShoppingBag,
  TrendingUp,
  Settings,
  LogOut,
  Bell,
  Search,
  LayoutDashboard,
  Box,
  ClipboardList,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const stats = [
    {
      title: "Total Penjualan",
      value: "Rp 12.450.000",
      icon: <TrendingUp className="text-green-500" />,
      trend: "+12%",
    },
    {
      title: "Produk Terjual",
      value: "1,250",
      icon: <ShoppingBag className="text-blue-500" />,
      trend: "+5%",
    },
    {
      title: "Pelanggan Baru",
      value: "48",
      icon: <Users className="text-orange-500" />,
      trend: "+18%",
    },
    {
      title: "Stok Rendah",
      value: "12",
      icon: <Box className="text-red-500" />,
      trend: "-2",
    },
  ];

  return (
    <div className="flex h-screen bg-secondary overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white flex flex-col shadow-xl z-20">
        <div className="p-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Kinerja<span className="text-accent">Hub</span>
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === "overview" ? "bg-white/20" : "hover:bg-white/5"}`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Ringkasan</span>
            {activeTab === "overview" && (
              <ChevronRight size={16} className="ml-auto" />
            )}
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-all text-white/70 hover:text-white">
            <ShoppingBag size={20} />
            <span className="font-medium">Penjualan</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-all text-white/70 hover:text-white">
            <Box size={20} />
            <span className="font-medium">Produk</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-all text-white/70 hover:text-white">
            <ClipboardList size={20} />
            <span className="font-medium">Laporan</span>
          </button>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-all text-white/70 hover:text-white">
            <Settings size={20} />
            <span className="font-medium">Pengaturan</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 text-red-300 transition-all mt-2"
          >
            <LogOut size={20} />
            <span className="font-medium">Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-8 z-10">
          <div className="relative w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari data, produk, atau transaksi..."
              className="w-full pl-10 pr-4 py-2 bg-secondary rounded-full border-none focus:ring-2 focus:ring-primary/20 text-sm outline-none"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-muted-foreground hover:text-primary transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                3
              </span>
            </button>
            <div className="h-8 w-px bg-border" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-foreground">
                  {user?.name || "User KinerjaHub"}
                </p>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
                  {user?.email || "Admin"}
                </p>
              </div>
              <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center text-white font-bold shadow-md">
                {(user?.name || "U")[0]}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-secondary/30">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Halo, {user?.name?.split(" ")[0] || "Partner"}! 👋
              </h2>
              <p className="text-muted-foreground">
                Berikut adalah ringkasan kinerja bisnis Anda hari ini.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-white border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors shadow-sm">
                Unduh Laporan
              </button>
              <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all">
                + Tambah Transaksi
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl shadow-sm border border-border hover:shadow-md transition-shadow group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-secondary rounded-xl group-hover:scale-110 transition-transform">
                    {stat.icon}
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend.startsWith("+") ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                  >
                    {stat.trend}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm font-medium">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-bold text-foreground mt-1">
                  {stat.value}
                </h3>
              </div>
            ))}
          </div>

          {/* Charts/Activity Mockup */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Grafik Penjualan Mingguan</h3>
                <select className="text-sm bg-secondary border-none rounded-lg px-2 py-1 outline-none font-medium">
                  <option>7 Hari Terakhir</option>
                  <option>30 Hari Terakhir</option>
                </select>
              </div>
              <div className="h-64 flex items-end justify-around gap-2 px-4">
                {[45, 60, 40, 75, 55, 85, 70].map((h, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-2 group cursor-pointer w-full"
                  >
                    <div
                      className="w-full bg-primary/20 group-hover:bg-primary transition-all rounded-t-lg relative"
                      style={{ height: `${h}%` }}
                    >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-foreground text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Rp {h * 100}k
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">
                      {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
              <h3 className="text-lg font-bold mb-6">Aktivitas Terakhir</h3>
              <div className="space-y-6">
                {[
                  {
                    name: "John Doe",
                    action: "Membeli Kopi Gula Aren",
                    time: "2 menit yang lalu",
                    amount: "+Rp 25.000",
                  },
                  {
                    name: "Jane Smith",
                    action: "Membeli Roti Bakar",
                    time: "15 menit yang lalu",
                    amount: "+Rp 18.000",
                  },
                  {
                    name: "Admin",
                    action: "Update Stok Kopi",
                    time: "1 jam yang lalu",
                    amount: "-10 Items",
                  },
                  {
                    name: "Budi",
                    action: "Membeli Paket Sarapan",
                    time: "3 jam yang lalu",
                    amount: "+Rp 45.000",
                  },
                ].map((act, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-secondary rounded-full flex items-center justify-center font-bold text-primary text-sm shadow-inner">
                      {act.name[0]}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold">{act.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {act.action}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-xs font-bold ${act.amount.startsWith("+") ? "text-green-600" : "text-foreground"}`}
                      >
                        {act.amount}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {act.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-2 text-primary font-bold text-sm border-2 border-primary/10 rounded-xl hover:bg-primary/5 transition-all">
                Lihat Semua Aktivitas
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
