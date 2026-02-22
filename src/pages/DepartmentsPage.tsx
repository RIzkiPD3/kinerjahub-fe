import { Building, Plus, Search, MoreVertical } from "lucide-react";

const DepartmentsPage = () => {
  const departments = [
    {
      id: 1,
      name: "Human Resources",
      head: "Dian Sastro",
      members: 12,
      status: "Active",
    },
    {
      id: 2,
      name: "Information Technology",
      head: "Budi Tabuti",
      members: 45,
      status: "Active",
    },
    {
      id: 3,
      name: "Marketing",
      head: "Siti Aminah",
      members: 28,
      status: "Active",
    },
    {
      id: 4,
      name: "Finance",
      head: "Andi Wijaya",
      members: 15,
      status: "Active",
    },
    {
      id: 5,
      name: "Operations",
      head: "Eko Prasetyo",
      members: 32,
      status: "Active",
    },
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Building className="text-primary" size={28} />
            Manajemen Departemen
          </h2>
          <p className="text-muted-foreground">
            Kelola data departemen dan penanggung jawab masing-masing area.
          </p>
        </div>
        <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all flex items-center gap-2">
          <Plus size={18} />
          Tambah Departemen
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
              placeholder="Cari departemen..."
              className="w-full pl-10 pr-4 py-2 bg-secondary rounded-lg border-none focus:ring-2 focus:ring-primary/20 text-sm outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <select className="text-sm bg-secondary border-none rounded-lg px-4 py-2 outline-none font-medium text-foreground">
              <option>Semua Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-secondary/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Nama Departemen
                </th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Kepala Departemen
                </th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Jumlah Anggota
                </th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {departments.map((dept) => (
                <tr
                  key={dept.id}
                  className="hover:bg-secondary/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {dept.name[0]}
                      </div>
                      <span className="font-semibold text-foreground">
                        {dept.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground font-medium">
                    {dept.head}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {dept.members} Karyawan
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase">
                      {dept.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-secondary rounded-lg">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Menampilkan 5 dari 8 departemen
          </p>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 border border-border rounded text-sm disabled:opacity-50"
              disabled
            >
              Sebelumnya
            </button>
            <button className="px-3 py-1 border border-border rounded text-sm hover:bg-secondary">
              Selanjutnya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentsPage;
