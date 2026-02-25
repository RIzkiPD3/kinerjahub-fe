import { useState, useEffect } from "react";
import {
  Building,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  RefreshCw,
  LayoutGrid,
  UserCircle,
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
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

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

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Filter departments
  useEffect(() => {
    let filtered = departments;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (dept) =>
          dept.name.toLowerCase().includes(term) ||
          (dept.division?.name || "").toLowerCase().includes(term) ||
          (dept.head || "").toLowerCase().includes(term),
      );
    }

    setFilteredDepartments(filtered);
  }, [searchTerm, departments]);

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
            Kelola data departemen di bawah divisi masing-masing.
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
              placeholder="Cari departemen atau divisi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-secondary rounded-lg border-none focus:ring-2 focus:ring-primary/20 text-sm outline-none"
            />
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
              {searchTerm
                ? "Tidak ada departemen yang sesuai dengan filter"
                : "Belum ada departemen yang ditambahkan"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
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
                      Divisi (Parent)
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Kepala Departemen
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
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-foreground">
                          <LayoutGrid
                            size={16}
                            className="text-muted-foreground"
                          />
                          {dept.division?.name || "Tanpa Divisi"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-foreground">
                          <UserCircle
                            size={16}
                            className="text-muted-foreground"
                          />
                          {dept.head || "Belum ditentukan"}
                        </div>
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
