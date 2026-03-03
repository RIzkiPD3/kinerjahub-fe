import { useState, useEffect } from "react";
import {
  Building,
  Plus,
  Search,
  Edit,
  Trash2,
  RefreshCw,
  LayoutGrid,
  UserCircle,
} from "lucide-react";
import { departmentsService } from "@/services/departmentService";
import type { Department, CreateDepartmentDto } from "@/types/department";
import DepartmentModal from "@/components/departments/DepartmentModal";
import RoleGuard from "@/components/auth/RoleGuard";
import DeleteConfirmModal from "@/components/departments/DeleteConfirmModal";
import { toast } from "@/lib/toast";
import axios from "axios";


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

  const fetchDepartments = async () => {
    setIsLoading(true);
    try {
      const data = await departmentsService.getAll();
      setDepartments(data);
      setFilteredDepartments(data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.log("Unauthorized access to departments");
      } else {
        toast.error("Gagal memuat data departemen");
      }
      console.error("Error fetching departments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    let filtered = departments;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (dept) =>
          dept.name.toLowerCase().includes(term) ||
          (dept.division?.name || "").toLowerCase().includes(term) ||
          (typeof dept.head === "string"
            ? dept.head
            : dept.head?.name || ""
          ).toLowerCase().includes(term) ||
          (dept.description || "").toLowerCase().includes(term),
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
      setIsDeleteModalOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Gagal menghapus departemen",
        );
      } else {
        toast.error("Gagal menghapus departemen");
      }
    }
  };

  const openCreateModal = () => {
    setSelectedDepartment(null);
    setIsModalOpen(true);
  };

  const openEditModal = (department: Department) => {
    setSelectedDepartment(department);
    setIsModalOpen(true);
  };

  const openDeleteModal = (department: Department) => {
    setSelectedDepartment(department);
    setIsDeleteModalOpen(true);
  };

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
          <RoleGuard allowedRoles="admin">
            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all flex items-center gap-2"
            >
              <Plus size={18} />
              Tambah Departemen
            </button>
          </RoleGuard>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="flex items-center gap-4 text-sm">
        <div className="text-muted-foreground">
          Total: {departments.length} departemen
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari departemen, divisi, atau kepala..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-secondary rounded-lg border-none focus:ring-2 focus:ring-primary/20 text-sm outline-none"
            />
          </div>
        </div>

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
                            <span className="font-semibold text-foreground block text-sm">
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
                        <div className="flex items-center gap-2 text-sm">
                          <UserCircle
                            size={16}
                            className="text-muted-foreground flex-shrink-0"
                          />
                          {(() => {
                            let headName: string | null = null;
                            if (dept.head && typeof dept.head === "object") {
                              headName = dept.head.name;
                            } else if (typeof dept.head === "string" && dept.head.trim()) {
                              headName = dept.head.trim();
                            }
                            return headName ? (
                              <span className="font-medium text-foreground">{headName}</span>
                            ) : (
                              <span className="text-muted-foreground italic">Belum ditentukan</span>
                            );
                          })()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <RoleGuard allowedRoles="admin" fallback="-">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openEditModal(dept)}
                              className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => openDeleteModal(dept)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Hapus"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </RoleGuard>
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
