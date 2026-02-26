import { useState, useEffect } from "react";
import { X, LayoutGrid, Info, UserCircle } from "lucide-react";
import { divisionService, type Division } from "@/services/divisonService";
import type { Department } from "@/types/department";
import axios from "axios";

interface DivisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    organization_id: string;
    department_id: string;
    head?: string;
    description?: string;
  }) => Promise<void>;
  division?: Division | null;
  departments: Department[];
  organizationId: string;
  title: string;
}

const DivisionModal = ({
  isOpen,
  onClose,
  onSubmit,
  division,
  departments,
  organizationId,
  title,
}: DivisionModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    department_id: "",
    head: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (division) {
      setFormData({
        name: division.name,
        department_id: division.department_id,
        head: division.head || "",
        description: division.description || "",
      });
    } else {
      setFormData({
        name: "",
        department_id: "",
        head: "",
        description: "",
      });
    }
  }, [division, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Nama divisi harus diisi");
      return;
    }

    if (!formData.department_id) {
      setError("Departemen harus dipilih");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onSubmit({
        name: formData.name.trim(),
        organization_id: organizationId,
        department_id: formData.department_id,
        head: formData.head.trim() || undefined,
        description: formData.description.trim() || undefined,
      });
      onClose();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
          "Terjadi kesalahan. Silakan coba lagi.",
        );
      } else {
        setError("Terjadi kesalahan. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50">
        <div className="bg-background rounded-2xl shadow-2xl border border-border overflow-hidden">
          <div className="relative bg-primary p-6">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-white/80 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <p className="text-white/80 text-sm mt-1">
              {division
                ? "Edit informasi divisi yang sudah ada"
                : "Isi informasi untuk divisi baru"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nama Divisi *
              </label>
              <div className="relative">
                <LayoutGrid className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground"
                  placeholder="Contoh: Teknologi Informasi"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Departemen *
              </label>
              <div className="relative">
                <Info className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <select
                  name="department_id"
                  value={formData.department_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, department_id: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground"
                  required
                >
                  <option value="">Pilih Departemen</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Kepala Divisi
              </label>
              <div className="relative">
                <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  name="head"
                  value={formData.head}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground"
                  placeholder="Masukkan nama kepala divisi"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Deskripsi
              </label>
              <div className="relative">
                <Info className="absolute left-3 top-3 text-muted-foreground w-5 h-5" />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground resize-none"
                  placeholder="Deskripsi singkat tentang divisi ini..."
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground font-medium hover:bg-muted transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default DivisionModal;
