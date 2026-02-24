import { useState, useEffect } from "react";
import {
  Building,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { departmentsService } from "@/services/departments";
import type { Department, CreateDepartmentDto } from "@/types/department";
import DepartmentModal from "@/components/departments/DepartmentModal";
import DeleteConfirmModal from "@/components/departments/DeleteConfirmModal";
import { toast } from "@/lib/toast";
import axios from "axios";

interface ApiError {
  response?: {
    status: number;
    data?: {
      message?: string;
    };
  };
  message?: string;
}

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState<Department[]>([
    // Technology Division
    {
      id: "1",
      name: "Software Engineering",
      head: "Dr. Ir. Budi Santoso, M.T.",
      head_email: "budi.santoso@kinerjahub.com",
      members: 45,
      status: "active",
      description:
        "Pengembangan dan pemeliharaan produk software utama perusahaan",
      created_at: "2024-01-15T08:00:00Z",
    },
    {
      id: "2",
      name: "Quality Assurance",
      head: "Ratna Dewi, S.Kom., M.M.",
      head_email: "ratna.dewi@kinerjahub.com",
      members: 28,
      status: "active",
      description:
        "Memastikan kualitas produk melalui pengujian manual dan automated testing",
      created_at: "2024-01-20T09:30:00Z",
    },
    {
      id: "3",
      name: "DevOps & Infrastructure",
      head: "Ahmad Hidayat, CISA",
      head_email: "ahmad.hidayat@kinerjahub.com",
      members: 15,
      status: "active",
      description: "Mengelola infrastruktur cloud, CI/CD, dan keandalan sistem",
      created_at: "2024-02-01T10:15:00Z",
    },
    {
      id: "4",
      name: "Data Science & AI",
      head: "Dr. Sarah Wijaya, Ph.D.",
      head_email: "sarah.wijaya@kinerjahub.com",
      members: 12,
      status: "active",
      description: "Pengembangan model AI, machine learning, dan analisis data",
      created_at: "2024-02-10T11:00:00Z",
    },
    {
      id: "5",
      name: "Cybersecurity",
      head: "Capt. Indra Lesmana, CISSP",
      head_email: "indra.lesmana@kinerjahub.com",
      members: 11,
      status: "inactive",
      description: "Keamanan sistem, proteksi data, dan incident response",
      created_at: "2024-02-15T13:20:00Z",
    },

    // Product & Design
    {
      id: "6",
      name: "Product Management",
      head: "Fahmi Alamsyah, M.B.A.",
      head_email: "fahmi.alamsyah@kinerjahub.com",
      members: 14,
      status: "active",
      description: "Pengembangan produk dan riset pasar",
      created_at: "2024-01-25T14:00:00Z",
    },
    {
      id: "7",
      name: "UI/UX Design",
      head: "Anisa Putri, S.Ds.",
      head_email: "anisa.putri@kinerjahub.com",
      members: 19,
      status: "active",
      description: "Desain antarmuka dan pengalaman pengguna",
      created_at: "2024-01-18T15:30:00Z",
    },
    {
      id: "8",
      name: "Research & Development",
      head: "Prof. Dr. I Made Sudarma",
      head_email: "imade.sudarma@kinerjahub.com",
      members: 31,
      status: "active",
      description: "Inovasi produk dan riset teknologi masa depan",
      created_at: "2024-01-05T09:00:00Z",
    },

    // Business & Strategy
    {
      id: "9",
      name: "Business Development",
      head: "Andre Kurniawan, M.M.",
      head_email: "andre.kurniawan@kinerjahub.com",
      members: 16,
      status: "active",
      description: "Pengembangan bisnis dan kemitraan strategis",
      created_at: "2024-02-05T10:45:00Z",
    },
    {
      id: "10",
      name: "Corporate Strategy",
      head: "Dr. Widodo, M.B.A.",
      head_email: "widodo@kinerjahub.com",
      members: 7,
      status: "active",
      description: "Perencanaan strategis dan pengembangan korporat",
      created_at: "2024-01-12T11:30:00Z",
    },
    {
      id: "11",
      name: "Digital Marketing",
      head: "Maya Anggraini, S.I.Kom.",
      head_email: "maya.anggraini@kinerjahub.com",
      members: 24,
      status: "active",
      description: "Strategi pemasaran digital dan brand awareness",
      created_at: "2024-02-20T13:15:00Z",
    },
    {
      id: "12",
      name: "Public Relations",
      head: "Nadia Salsabila, M.I.Kom.",
      head_email: "nadia.salsabila@kinerjahub.com",
      members: 12,
      status: "inactive",
      description: "Hubungan media dan komunikasi publik",
      created_at: "2024-02-22T14:30:00Z",
    },

    // Support Functions
    {
      id: "13",
      name: "Human Capital",
      head: "Dian Purnama, S.Psi., M.M.",
      head_email: "dian.purnama@kinerjahub.com",
      members: 18,
      status: "active",
      description: "Manajemen SDM dan pengembangan karyawan",
      created_at: "2024-01-08T08:45:00Z",
    },
    {
      id: "14",
      name: "Finance & Accounting",
      head: "Hendra Wijaya, CPA, M.Ak.",
      head_email: "hendra.wijaya@kinerjahub.com",
      members: 22,
      status: "active",
      description: "Pengelolaan keuangan dan akuntansi perusahaan",
      created_at: "2024-01-10T10:00:00Z",
    },
    {
      id: "15",
      name: "Corporate Legal",
      head: "Dr. Rizky Firmansyah, S.H., M.Kn.",
      head_email: "rizky.firmansyah@kinerjahub.com",
      members: 8,
      status: "active",
      description: "Legalitas perusahaan dan kontrak bisnis",
      created_at: "2024-01-28T16:00:00Z",
    },
    {
      id: "16",
      name: "Internal Audit",
      head: "Siti Aisyah, CIA, CFE",
      head_email: "siti.aisyah@kinerjahub.com",
      members: 9,
      status: "active",
      description: "Audit internal dan manajemen risiko",
      created_at: "2024-02-08T09:30:00Z",
    },

    // Operations
    {
      id: "17",
      name: "Supply Chain",
      head: "Rudi Hermawan, S.T., M.Log.",
      head_email: "rudi.hermawan@kinerjahub.com",
      members: 23,
      status: "inactive",
      description: "Manajemen rantai pasok dan logistik",
      created_at: "2024-02-12T13:45:00Z",
    },
    {
      id: "18",
      name: "Customer Success",
      head: "Linda Hartati, S.Psi.",
      head_email: "linda.hartati@kinerjahub.com",
      members: 35,
      status: "active",
      description: "Pendampingan customer dan retensi pelanggan",
      created_at: "2024-01-30T11:20:00Z",
    },
    {
      id: "19",
      name: "Technical Support",
      head: "Rizki Pratama, S.Kom.",
      head_email: "rizki.pratama@kinerjahub.com",
      members: 27,
      status: "active",
      description: "Dukungan teknis dan troubleshooting",
      created_at: "2024-02-18T15:50:00Z",
    },
    {
      id: "20",
      name: "Facility Management",
      head: "Haryono, S.T.",
      head_email: "haryono@kinerjahub.com",
      members: 14,
      status: "active",
      description: "Pengelolaan fasilitas dan aset perusahaan",
      created_at: "2024-02-25T08:15:00Z",
    },
  ]);

  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  // Filter departments
  useEffect(() => {
    let filtered = departments;

    if (searchTerm) {
      filtered = filtered.filter(
        (dept) =>
          dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dept.head.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (dept.head_email?.toLowerCase() || "").includes(
            searchTerm.toLowerCase(),
          ) ||
          (dept.description?.toLowerCase() || "").includes(
            searchTerm.toLowerCase(),
          ),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((dept) => dept.status === statusFilter);
    }

    setFilteredDepartments(filtered);
  }, [searchTerm, statusFilter, departments]);

  const fetchDepartments = async () => {
    setIsLoading(true);
    try {
      const data = await departmentsService.getAll();
      setDepartments(data);
      setFilteredDepartments(data);
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.response?.status === 401) {
        console.log("Unauthorized access to departments");
      } else {
        toast.error("Gagal memuat data departemen");
      }
      console.error("Error fetching departments:", apiError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (data: CreateDepartmentDto) => {
    try {
      await departmentsService.create(data);
      toast.success("Departemen berhasil ditambahkan");
      fetchDepartments();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Gagal menambahkan departemen",
        );
      } else {
        toast.error("Gagal menambahkan departemen");
      }
      throw error;
    }
  };

  const handleUpdate = async (data: CreateDepartmentDto) => {
    if (!selectedDepartment) return;
    try {
      await departmentsService.update(selectedDepartment.id, data);
      toast.success("Departemen berhasil diperbarui");
      fetchDepartments();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Gagal memperbarui departemen",
        );
      } else {
        toast.error("Gagal memperbarui departemen");
      }
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!selectedDepartment) return;
    try {
      await departmentsService.delete(selectedDepartment.id);
      toast.success("Departemen berhasil dihapus");
      fetchDepartments();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Gagal menghapus departemen",
        );
      } else {
        toast.error("Gagal menghapus departemen");
      }
      throw error;
    }
  };

  const openCreateModal = () => {
    setSelectedDepartment(null);
    setIsModalOpen(true);
  };

  const openEditModal = (department: Department) => {
    setSelectedDepartment(department);
    setIsModalOpen(true);
    setDropdownOpen(null);
  };

  const openDeleteModal = (department: Department) => {
    setSelectedDepartment(department);
    setIsDeleteModalOpen(true);
    setDropdownOpen(null);
  };

  useEffect(() => {
    const handleClickOutside = () => setDropdownOpen(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const activeCount = departments.filter((d) => d.status === "active").length;
  const inactiveCount = departments.filter(
    (d) => d.status === "inactive",
  ).length;

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
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
        <div className="flex gap-3">
          <button
            onClick={fetchDepartments}
            className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2"
            title="Refresh data"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            Tambah Departemen
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full border border-green-200">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="font-medium">Active: {activeCount}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-full border border-gray-200">
          <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
          <span className="font-medium">Inactive: {inactiveCount}</span>
        </div>
        <div className="text-muted-foreground">
          Total: {departments.length} departemen
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari departemen, kepala departemen, atau email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-secondary rounded-lg border-none focus:ring-2 focus:ring-primary/20 text-sm outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm bg-secondary border-none rounded-lg px-4 py-2 outline-none font-medium text-foreground cursor-pointer hover:bg-muted transition-colors"
            >
              <option value="all" className="bg-background">
                Semua Status
              </option>
              <option
                value="active"
                className="bg-background text-green-600 font-semibold"
              >
                Active
              </option>
              <option value="inactive" className="bg-background text-gray-500">
                Inactive
              </option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="inline-block w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <p className="mt-4 text-muted-foreground">Memuat data...</p>
          </div>
        ) : filteredDepartments.length === 0 ? (
          <div className="p-12 text-center">
            <Building className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              Tidak ada data
            </h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== "all"
                ? "Tidak ada departemen yang sesuai dengan filter"
                : "Belum ada departemen yang ditambahkan"}
            </p>
            {(searchTerm || statusFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
                className="mt-4 text-primary hover:underline text-sm font-medium"
              >
                Reset filter
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Table */}
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
                  {filteredDepartments.map((dept) => (
                    <tr
                      key={dept.id}
                      className="hover:bg-secondary/30 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {dept.name[0]}
                          </div>
                          <div>
                            <span className="font-semibold text-foreground block">
                              {dept.name}
                            </span>
                            {dept.description && (
                              <span className="text-xs text-muted-foreground line-clamp-1">
                                {dept.description}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {dept.head}
                          </p>
                          {dept.head_email && (
                            <p className="text-xs text-primary/70 mt-0.5">
                              {dept.head_email}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-foreground">
                          {dept.members}{" "}
                          {dept.members > 1 ? "Karyawan" : "Karyawan"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1.5 text-xs font-bold rounded-full inline-flex items-center gap-1.5 ${
                            dept.status === "active"
                              ? "bg-green-100 text-green-800 border border-green-200 shadow-sm"
                              : "bg-gray-100 text-gray-700 border border-gray-200"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${dept.status === "active" ? "bg-green-500 animate-pulse" : "bg-gray-500"}`}
                          />
                          {dept.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right relative">
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDropdownOpen(
                                dropdownOpen === dept.id ? null : dept.id,
                              );
                            }}
                            className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-secondary rounded-lg"
                          >
                            <MoreVertical size={18} />
                          </button>

                          {dropdownOpen === dept.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-border z-10">
                              <button
                                onClick={() => openEditModal(dept)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-secondary flex items-center gap-2"
                              >
                                <Edit size={16} className="text-primary" />
                                Edit
                              </button>
                              <button
                                onClick={() => openDeleteModal(dept)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-secondary text-red-600 flex items-center gap-2"
                              >
                                <Trash2 size={16} />
                                Hapus
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Info */}
            <div className="p-6 border-t border-border flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Menampilkan {filteredDepartments.length} dari{" "}
                {departments.length} departemen
              </p>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <DepartmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={selectedDepartment ? handleUpdate : handleCreate}
        department={selectedDepartment}
        title={selectedDepartment ? "Edit Departemen" : "Tambah Departemen"}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        departmentName={selectedDepartment?.name || ""}
      />
    </div>
  );
};

export default DepartmentsPage;
