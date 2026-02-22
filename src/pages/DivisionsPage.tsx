import { Briefcase, Plus, Search, MoreVertical, Filter } from "lucide-react";

const DivisionsPage = () => {
  const divisions = [
    {
      id: 1,
      name: "Web Development",
      dept: "Information Technology",
      lead: "Rizky",
      status: "Active",
    },
    {
      id: 2,
      name: "Mobile App",
      dept: "Information Technology",
      lead: "Fahmi",
      status: "Active",
    },
    {
      id: 3,
      name: "Recruitment",
      dept: "Human Resources",
      lead: "Sarah",
      status: "Active",
    },
    {
      id: 4,
      name: "Content Creator",
      dept: "Marketing",
      lead: "Jessica",
      status: "Active",
    },
    {
      id: 5,
      name: "Payroll",
      dept: "Finance",
      lead: "Hendra",
      status: "Active",
    },
    {
      id: 6,
      name: "UI/UX Design",
      dept: "Information Technology",
      lead: "Anisa",
      status: "Active",
    },
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Briefcase className="text-primary" size={28} />
            Manajemen Divisi
          </h2>
          <p className="text-muted-foreground">
            Kelola sub-unit atau divisi di bawah setiap departemen.
          </p>
        </div>
        <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all flex items-center gap-2">
          <Plus size={18} />
          Tambah Divisi
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari divisi..."
              className="w-full pl-10 pr-4 py-2 bg-secondary rounded-lg border-none focus:ring-2 focus:ring-primary/20 text-sm outline-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-border rounded-lg text-sm font-medium transition-colors text-foreground">
              <Filter size={16} />
              Filter
            </button>
            <select className="text-sm bg-secondary border-none rounded-lg px-4 py-2 outline-none font-medium text-foreground">
              <option>Semua Departemen</option>
              <option>IT</option>
              <option>HR</option>
              <option>Marketing</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {divisions.map((div) => (
            <div
              key={div.id}
              className="p-6 rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all group relative"
            >
              <button className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                <MoreVertical size={18} />
              </button>

              <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary mb-4 group-hover:bg-primary transition-colors group-hover:text-white">
                <Briefcase size={24} />
              </div>

              <h4 className="text-lg font-bold text-foreground mb-1">
                {div.name}
              </h4>
              <p className="text-sm text-primary font-medium mb-4">
                {div.dept}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">
                    Lead
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    {div.lead}
                  </p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase">
                  {div.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-border flex items-center justify-center">
          <button className="text-sm font-bold text-primary hover:underline">
            Lihat Lebih Banyak Divisi
          </button>
        </div>
      </div>
    </div>
  );
};

export default DivisionsPage;
