import { useState, useEffect } from "react";
import { Building, Plus, Search, Trash2, Loader2, Edit2 } from "lucide-react";
import { getDepartments, deleteDepartment } from "@/services/departementService";
import type { Department } from "@/services/departementService";
import DepartmentForm from "@/components/departments/DepartmentForm";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | undefined>(undefined);

  // Delete modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<{ id: string; name: string } | null>(null);

  const fetchDepartments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (err) {
      console.error("Failed to fetch departments:", err);
      setError("Gagal memuat data departemen.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleCreate = () => {
    setEditingDepartment(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (dept: Department) => {
    setEditingDepartment(dept);
    setIsModalOpen(true);
  };

  const openDeleteModal = (id: string, name: string) => {
    setDepartmentToDelete({ id, name });
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!departmentToDelete) return;

    setIsDeleting(departmentToDelete.id);
    try {
      await deleteDepartment(departmentToDelete.id);
      setIsDeleteModalOpen(false);
      fetchDepartments();
    } catch (err) {
      console.error("Failed to delete department:", err);
      alert("Gagal menghapus departemen.");
    } finally {
      setIsDeleting(null);
      setDepartmentToDelete(null);
    }
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    fetchDepartments();
  };

  return (
    <div className="p-8 space-y-8 relative min-h-screen">
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
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all flex items-center gap-2"
        >
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
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="text-primary animate-spin" size={40} />
              <p className="text-muted-foreground text-sm font-medium">Memuat data...</p>
            </div>
          ) : error ? (
            <div className="py-20 text-center">
              <p className="text-destructive font-medium">{error}</p>
              <button
                onClick={fetchDepartments}
                className="mt-4 text-primary hover:underline text-sm"
              >
                Coba lagi
              </button>
            </div>
          ) : departments.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-muted-foreground">Belum ada data departemen.</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-secondary/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Nama Departemen
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Divisi ID
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
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {dept.division_id}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(dept)}
                          className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-lg group/btn"
                          title="Edit Departemen"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(dept.id, dept.name)}
                          disabled={isDeleting === dept.id}
                          className="text-muted-foreground hover:text-destructive transition-colors p-2 hover:bg-destructive/10 rounded-lg disabled:opacity-50"
                          title="Hapus Departemen"
                        >
                          {isDeleting === dept.id ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-6 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Menampilkan {departments.length} departemen
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

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-lg animate-in zoom-in-95 duration-200">
            <DepartmentForm
              initialData={editingDepartment}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
      {/* Custom Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        title="Hapus Departemen"
        description={`Apakah Anda yakin ingin menghapus departemen "${departmentToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus Departemen"
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        isLoading={!!isDeleting}
      />
    </div>
  );
};

export default DepartmentsPage;
