import { Users, Building, Briefcase, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: "Total Karyawan",
      value: "156",
      icon: <Users className="text-blue-500" />,
      trend: "+4",
    },
    {
      title: "Total Departemen",
      value: "8",
      icon: <Building className="text-green-500" />,
      trend: "0",
    },
    {
      title: "Posisi Aktif",
      value: "12",
      icon: <Briefcase className="text-orange-500" />,
      trend: "+2",
    },
    {
      title: "Permohonan Cuti",
      value: "5",
      icon: <Calendar className="text-red-500" />,
      trend: "-3",
    },
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Halo, {user?.name?.split(" ")[0] || "Partner"}! 👋
          </h2>
          <p className="text-muted-foreground">
            Berikut adalah ringkasan operasional perusahaan Anda hari ini.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors shadow-sm">
            Unduh Laporan
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all">
            + Tambah Karyawan
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
            <h3 className="text-lg font-bold">Statistik Kehadiran Mingguan</h3>
            <select className="text-sm bg-secondary border-none rounded-lg px-2 py-1 outline-none font-medium text-foreground">
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
                    {h}% Hadir
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
                name: "Budi Santoso",
                action: "Mencatatkan kehadiran (Check-in)",
                time: "2 menit yang lalu",
                status: "Sesuai Jadwal",
              },
              {
                name: "Siti Aminah",
                action: "Mengajukan cuti tahunan",
                time: "15 menit yang lalu",
                status: "Menunggu Approval",
              },
              {
                name: "Admin HR",
                action: "Update divisi IT",
                time: "1 jam yang lalu",
                status: "Pembaruan Data",
              },
              {
                name: "Ahmad",
                action: "Mencatatkan kehadiran (Check-out)",
                time: "3 jam yang lalu",
                status: "Sesuai Jadwal",
              },
            ].map((act, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-10 w-10 bg-secondary rounded-full flex items-center justify-center font-bold text-primary text-sm shadow-inner">
                  {act.name[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground">
                    {act.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{act.action}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-foreground">
                    {act.status}
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
  );
};

export default Dashboard;
