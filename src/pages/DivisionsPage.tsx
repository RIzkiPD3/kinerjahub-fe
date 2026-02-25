import { useState, useEffect } from "react";
import {
  Briefcase,
  Plus,
  Search,
  MoreVertical,
  RefreshCw,
  Edit,
  Trash2,
} from "lucide-react";
import { divisionService, type Division } from "@/services/divisonService";
import { departmentsService } from "@/services/departments";
import type { Department } from "@/types/department";
import { toast } from "@/lib/toast";

const DivisionsPage = () => {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [divData, deptData] = await Promise.all([
        divisionService.getAll(),
        departmentsService.getAll(),
      ]);
      setDivisions(divData);
      setDepartments(deptData);
    } catch (error) {
      console.error("Error fetching division data:", error);
      toast.error("Gagal memuat data divisi");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getDepartmentName = (deptId: string) => {
    return (
      departments.find((d) => d.id === deptId)?.name || "Unknown Department"
    );
  };

  const filteredDivisions = divisions.filter((div) => {
    const matchesSearch = div.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDept =
      departmentFilter === "all" || div.department_id === departmentFilter;
    return matchesSearch && matchesDept;
  });

  useEffect(() => {
    const handleClickOutside = () => setDropdownOpen(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

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
        <div className="flex gap-3">
          <button
            onClick={fetchData}
            className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2"
            title="Refresh data"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all flex items-center gap-2">
            <Plus size={18} />
            Tambah Divisi
          </button>
        </div>
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-secondary rounded-lg border-none focus:ring-2 focus:ring-primary/20 text-sm outline-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="text-sm bg-secondary border-none rounded-lg px-4 py-2 outline-none font-medium text-foreground cursor-pointer hover:bg-muted transition-colors"
            >
              <option value="all">Semua Departemen</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center">
            <div className="inline-block w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <p className="mt-4 text-muted-foreground">Memuat data...</p>
          </div>
        ) : filteredDivisions.length === 0 ? (
          <div className="p-12 text-center">
            <Briefcase className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              Tidak ada data
            </h3>
            <p className="text-muted-foreground">
              {searchTerm || departmentFilter !== "all"
                ? "Tidak ada divisi yang sesuai dengan filter"
                : "Belum ada divisi yang ditambahkan"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredDivisions.map((div) => (
              <div
                key={div.id}
                className="p-6 rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all group relative"
              >
                <div className="absolute top-4 right-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen(dropdownOpen === div.id ? null : div.id);
                    }}
                    className="text-muted-foreground hover:text-foreground p-1 hover:bg-secondary rounded"
                  >
                    <MoreVertical size={18} />
                  </button>
                  {dropdownOpen === div.id && (
                    <div className="absolute right-0 mt-1 w-36 bg-white border border-border rounded-lg shadow-lg z-10 py-1">
                      <button className="w-full px-4 py-2 text-left text-sm hover:bg-secondary flex items-center gap-2">
                        <Edit size={14} className="text-primary" />
                        Edit
                      </button>
                      <button className="w-full px-4 py-2 text-left text-sm hover:bg-secondary text-red-600 flex items-center gap-2">
                        <Trash2 size={14} />
                        Hapus
                      </button>
                    </div>
                  )}
                </div>

                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary mb-4 group-hover:bg-primary transition-colors group-hover:text-white">
                  <Briefcase size={24} />
                </div>

                <h4 className="text-lg font-bold text-foreground mb-1">
                  {div.name}
                </h4>
                <p className="text-sm text-primary font-medium mb-4">
                  {getDepartmentName(div.department_id)}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                  <div className="flex-1">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">
                      Status
                    </p>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase">
                      Active
                    </span>
                  </div>
                  {div.description && (
                    <div className="flex-1 text-right">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">
                        Info
                      </p>
                      <p className="text-[10px] text-muted-foreground line-clamp-1">
                        {div.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && filteredDivisions.length > 0 && (
          <div className="p-6 border-t border-border flex items-center justify-center">
            <span className="text-sm text-muted-foreground">
              Menampilkan {filteredDivisions.length} divisi
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DivisionsPage;
