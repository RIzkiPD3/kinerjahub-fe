import { useState, useEffect } from "react";
import { Briefcase, Plus, Search, Trash2, Filter, Loader2, Edit2 } from "lucide-react";
import { getDivisions, deleteDivision } from "@/services/divisonService";
import type { Division } from "@/services/divisonService";
import DivisionForm from "@/components/divisions/DivisionForm";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";

const DivisionsPage = () => {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDivision, setEditingDivision] = useState<Division | undefined>(undefined);

  // Delete modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [divisionToDelete, setDivisionToDelete] = useState<{ id: string; name: string } | null>(null);

  const fetchDivisions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getDivisions();
      setDivisions(data);
    } catch (err) {
      console.error("Failed to fetch divisions:", err);
      setError("Gagal memuat data divisi.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDivisions();
  }, []);

  const handleCreate = () => {
    setEditingDivision(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (div: Division) => {
    setEditingDivision(div);
    setIsModalOpen(true);
  };

  const openDeleteModal = (id: string, name: string) => {
    setDivisionToDelete({ id, name });
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!divisionToDelete) return;

    setIsDeleting(divisionToDelete.id);
    try {
      await deleteDivision(divisionToDelete.id);
      setIsDeleteModalOpen(false);
      fetchDivisions();
    } catch (err) {
      console.error("Failed to delete division:", err);
      alert("Gagal menghapus divisi.");
    } finally {
      setIsDeleting(null);
      setDivisionToDelete(null);
    }
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    fetchDivisions();
  };

  return (
    <div className="p-8 space-y-8 relative min-h-screen">
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
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all flex items-center gap-2"
        >
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

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="text-primary animate-spin" size={40} />
            <p className="text-muted-foreground text-sm font-medium">Memuat data...</p>
          </div>
        ) : error ? (
          <div className="py-20 text-center">
            <p className="text-destructive font-medium">{error}</p>
            <button
              onClick={fetchDivisions}
              className="mt-4 text-primary hover:underline text-sm"
            >
              Coba lagi
            </button>
          </div>
        ) : divisions.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">Belum ada data divisi.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {divisions.map((div) => (
              <div
                key={div.id}
                className="p-6 rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all group relative"
              >
                <div className="absolute top-4 right-4 flex gap-1">
                  <button
                    onClick={() => handleEdit(div)}
                    className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    title="Edit Divisi"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => openDeleteModal(div.id, div.name)}
                    disabled={isDeleting === div.id}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50"
                    title="Hapus Divisi"
                  >
                    {isDeleting === div.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>

                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary mb-4 group-hover:bg-primary transition-colors group-hover:text-white">
                  <Briefcase size={24} />
                </div>

                <h4 className="text-lg font-bold text-foreground mb-1">
                  {div.name}
                </h4>
                <p className="text-xs text-muted-foreground font-mono truncate">
                  {div.id}
                </p>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-border">
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase">
                    Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="p-6 border-t border-border flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Menampilkan {divisions.length} divisi
          </p>
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
            <DivisionForm
              initialData={editingDivision}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
      {/* Custom Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        title="Hapus Divisi"
        description={`Apakah Anda yakin ingin menghapus divisi "${divisionToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus Divisi"
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        isLoading={!!isDeleting}
      />
    </div>
  );
};

export default DivisionsPage;
