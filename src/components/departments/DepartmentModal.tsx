import { useState, useEffect } from "react";
import { X, Building2, LayoutGrid, UserCircle } from "lucide-react";
import type { Department, CreateDepartmentDto } from "@/types/department";
import { divisionService, type Division } from "@/services/divisionService";
import axios from "axios";

interface DepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateDepartmentDto) => Promise<void>;
  department?: Department | null;
  title: string;
}

const DepartmentModal = ({
  isOpen,
  onClose,
  onSubmit,
  department,
  title,
}: DepartmentModalProps) => {
  const [formData, setFormData] = useState<CreateDepartmentDto>({
    name: "",
    division_id: "",
    head: "",
  });
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      divisionService.getAll().then(setDivisions);
    }
  }, [isOpen]);

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name,
        division_id: department.division_id || department.division?.id || "",
        head: typeof department.head === "string"
          ? department.head
          : department.head?.name || "",
      });
    } else {
      setFormData({
        name: "",
        division_id: "",
        head: "",
      });
    }
  }, [department, isOpen]);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError("Nama departemen harus diisi");
      return false;
    }
    if (!formData.division_id) {
      setError("Divisi harus dipilih");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onSubmit({
        name: formData.name.trim(),
        division_id: formData.division_id,
        head: formData.head || undefined,
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
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
              {department
                ? "Edit informasi departemen yang sudah ada"
                : "Isi informasi untuk departemen baru"}
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
                Nama Departemen *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground"
                  placeholder="Contoh: Information Technology"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Kepala Departemen
              </label>
              <div className="relative">
                <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  name="head"
                  value={formData.head}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground"
                  placeholder="Masukkan nama kepala departemen"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Divisi (Parent) *
              </label>
              <div className="relative">
                <LayoutGrid className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <select
                  name="division_id"
                  value={formData.division_id}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground appearance-none"
                  required
                >
                  <option value="">Pilih Divisi</option>
                  {divisions.map((div) => (
                    <option key={div.id} value={div.id}>
                      {div.name}
                    </option>
                  ))}
                </select>
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

export default DepartmentModal;
