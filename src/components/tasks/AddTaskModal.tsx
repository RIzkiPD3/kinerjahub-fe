import { useEffect, useState } from "react";
import { X, Calendar, User, Briefcase, Building, Flag } from "lucide-react";
import { taskService, type CreateTaskDto } from "@/services/taskService";
import { departmentsService } from "@/services/departments";
import { divisionService, type Division } from "@/services/divisonService";
import { userService, type User as UserType } from "@/services/userService";
import { toast } from "@/lib/toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Department {
  id: string;
  name: string;
}

export default function AddTaskModal({ isOpen, onClose, onSuccess }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [departmentId, setDepartmentId] = useState("");
  const [divisionId, setDivisionId] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [departments, setDepartments] = useState<Department[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      departmentsService.getAll().then(setDepartments);
      userService.getAll().then(setUsers);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!departmentId) {
      setDivisions([]);
      setDivisionId("");
      return;
    }

    divisionService.getByDepartment(departmentId).then(setDivisions);
  }, [departmentId]);

  useEffect(() => {
    let result = users;

    if (departmentId) {
      result = result.filter((u) => u.department?.id === departmentId);
    }

    if (divisionId) {
      result = result.filter((u) => u.division?.id === divisionId);
    }

    setFilteredUsers(result);
    // If current assignee is not in filtered list, reset it
    if (assigneeId && !result.find((u) => u.id === assigneeId)) {
      setAssigneeId("");
    }
  }, [departmentId, divisionId, users, assigneeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      toast.error("Judul dan deskripsi wajib diisi!");
      return;
    }

    try {
      setLoading(true);
      const payload: CreateTaskDto = {
        title,
        description,
        priority,
        assignee_id: assigneeId || undefined,
        due_date: dueDate || undefined,
      };

      await taskService.create(payload);
      toast.success("Tugas berhasil dibuat!");
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Gagal membuat tugas");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setDepartmentId("");
    setDivisionId("");
    setAssigneeId("");
    setDueDate("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-8 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          title="Close"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-foreground mb-1">
          Tambah Tugas Baru
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Kelola dan delegasikan tugas kepada anggota tim.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-foreground mb-2">
              Judul Tugas *
            </label>
            <input
              type="text"
              placeholder="Contoh: Laporan Keuangan Bulanan"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-foreground mb-2">
              Deskripsi *
            </label>
            <textarea
              placeholder="Jelaskan rincian tugas di sini..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition min-h-[100px]"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Priority */}
            <div>
              <label className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                <Flag size={16} className="text-primary" />
                Prioritas
              </label>
              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as "low" | "medium" | "high")
                }
                className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition appearance-none cursor-pointer"
              >
                <option value="low">Rendah</option>
                <option value="medium">Sedang</option>
                <option value="high">Tinggi</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                <Calendar size={16} className="text-primary" />
                Deadline
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            {/* Department */}
            <div>
              <label className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                <Building size={16} className="text-primary" />
                Departemen
              </label>
              <select
                value={departmentId}
                onChange={(e) => {
                  setDepartmentId(e.target.value);
                  setDivisionId("");
                }}
                className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition appearance-none cursor-pointer"
              >
                <option value="">Semua Departemen</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Division */}
            <div>
              <label className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                <Briefcase size={16} className="text-primary" />
                Divisi
              </label>
              <select
                value={divisionId}
                onChange={(e) => setDivisionId(e.target.value)}
                disabled={!departmentId}
                className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition appearance-none cursor-pointer disabled:opacity-50"
              >
                <option value="">Semua Divisi</option>
                {divisions.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Assignee */}
          <div>
            <label className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
              <User size={16} className="text-primary" />
              Penerima Tugas (Opsional)
            </label>
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition appearance-none cursor-pointer"
            >
              <option value="">Pilih Anggota Tim</option>
              {filteredUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role?.name || "User"})
                </option>
              ))}
            </select>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6 border-t border-border mt-8">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 border border-border rounded-xl text-foreground hover:bg-secondary transition font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-primary text-white rounded-xl hover:bg-blue-700 transition font-bold shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Memproses..." : "Buat Tugas"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
