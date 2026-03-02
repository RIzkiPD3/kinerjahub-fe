import { useEffect, useState } from "react";
import { X, Calendar, User } from "lucide-react";
import { taskService, type CreateTaskDto } from "@/services/taskService";
import { userService, type User as UserType } from "@/services/userService";
import { toast } from "@/lib/toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultProjectId?: string;
}

interface Department {
  id: string;
  name: string;
}

export default function AddTaskModal({ isOpen, onClose, onSuccess, defaultProjectId }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [storyPoints, setStoryPoints] = useState(1);
  const [projectId, setProjectId] = useState(defaultProjectId || "");

  const [users, setUsers] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      userService.getAll()
        .then(setUsers)
        .catch(err => {
          console.error("Error loading users:", err);
        });

      if (defaultProjectId) {
        setProjectId(defaultProjectId);
      }
    }
  }, [isOpen, defaultProjectId]);


  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !storyPoints || !dueDate || !projectId) {
      toast.error("Judul, deskripsi, proyek, points, dan deadline wajib diisi!");
      return;
    }

    try {
      setLoading(true);
      const payload: CreateTaskDto = {
        title,
        description,
        assigned_to: assigneeId || null,
        deadline: dueDate,
        story_point: storyPoints,
      };

      await taskService.create(projectId, payload);
      toast.success("Tugas berhasil dibuat!");
      onSuccess();
      handleClose();
    } catch (error: any) {
      console.error("Error creating task:", error);
      const message = error.response?.data?.message || error.response?.data?.errors?.[0]?.message || "Gagal membuat tugas";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setAssigneeId("");
    setDueDate("");
    setStoryPoints(1);
    setProjectId(defaultProjectId || "");
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

            {/* Story Points */}
            <div>
              <label className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                Story Points (1-10)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={storyPoints}
                onChange={(e) => setStoryPoints(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                required
              />
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
              className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition cursor-pointer"
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
