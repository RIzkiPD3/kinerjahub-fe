import { Users, Building, Briefcase } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: "Total User",
      value: "156",
      icon: <Users className="text-blue-500" />,
      trend: "+4",
    },
    {
      title: "Total Department",
      value: "8",
      icon: <Building className="text-green-500" />,
      trend: "0",
    },
    {
      title: "Total Division",
      value: "12",
      icon: <Briefcase className="text-orange-500" />,
      trend: "+2",
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
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
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
      </div>
    </div>
  );
};

export default Dashboard;
