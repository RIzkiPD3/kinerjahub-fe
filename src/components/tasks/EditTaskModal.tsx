import { useEffect, useState } from "react";
import { X, Calendar, User, Briefcase, Building, Flag } from "lucide-react";
import { taskService, type UpdateTaskDto, type Task } from "@/services/taskService";
import { TaskStatus, TaskStatusLabels } from "@/types/task";
import { departmentsService } from "@/services/departmentService";
import { divisionService, type Division } from "@/services/divisionService";
import { userService, type User as UserType } from "@/services/userService";
import { toast } from "@/lib/toast";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    task: Task | null;
}

interface Department {
    id: string;
    name: string;
}

export default function EditTaskModal({ isOpen, onClose, onSuccess, task }: Props) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
    const [departmentId, setDepartmentId] = useState("");
    const [divisionId, setDivisionId] = useState("");
    const [assigneeId, setAssigneeId] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [storyPoints, setStoryPoints] = useState(1);
    const [status, setStatus] = useState<TaskStatus>(TaskStatus.TO_DO);

    const [departments, setDepartments] = useState<Department[]>([]);
    const [divisions, setDivisions] = useState<Division[]>([]);
    const [users, setUsers] = useState<UserType[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            divisionService.getAll()
                .then(setDivisions)
                .catch(err => {
                    console.error("Error loading divisions:", err);
                    toast.error("Gagal memuat data divisi");
                });
            userService.getAll()
                .then(setUsers)
                .catch(err => {
                    console.error("Error loading users:", err);
                });
        }
    }, [isOpen]);

    useEffect(() => {
        if (task && isOpen) {
            setTitle(task.title || "");
            setDescription(task.description || "");
            setPriority(task.priority || "medium");
            setDivisionId(task.division?.id || "");
            setDepartmentId(task.department?.id || "");
            setAssigneeId(task.assigned_to || "");
            setStoryPoints(task.story_point || 1);
            setStatus(task.status as TaskStatus || TaskStatus.TO_DO);

            if (task.deadline) {
                // Format ISO date to YYYY-MM-DD for input type="date"
                const date = new Date(task.deadline);
                const formattedDate = date.toISOString().split("T")[0];
                setDueDate(formattedDate);
            } else {
                setDueDate("");
            }
        }
    }, [task, isOpen]);

    useEffect(() => {
        if (!divisionId) {
            setDepartments([]);
            return;
        }

        departmentsService.getByDivision(divisionId)
            .then(setDepartments)
            .catch(err => {
                console.error("Error loading departments:", err);
                toast.error("Gagal memuat data departemen");
            });
    }, [divisionId]);

    useEffect(() => {
        let result = users;

        if (departmentId) {
            result = result.filter((u) => u.department?.id === departmentId);
        }

        if (divisionId) {
            result = result.filter((u) => u.division?.id === divisionId);
        }

        setFilteredUsers(result);
    }, [departmentId, divisionId, users]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!task) return;

        if (!title || !description || !divisionId || !departmentId || !storyPoints || !dueDate) {
            toast.error("Judul, deskripsi, divisi, departemen, points, dan deadline wajib diisi!");
            return;
        }

        try {
            setLoading(true);

            // Construct payload with only changed fields
            const payload: UpdateTaskDto = {};

            if (title !== (task.title || "")) payload.title = title;
            if (description !== (task.description || "")) payload.description = description;
            if (priority !== (task.priority || "medium")) payload.priority = priority;
            // Kirim null jika assignee dikosongkan (bukan string kosong)
            if (assigneeId !== (task.assigned_to || "")) payload.assigned_to = assigneeId || null;
            if (storyPoints !== (task.story_point || 1)) payload.story_point = storyPoints;
            if (status !== (task.status as TaskStatus)) payload.status = status;

            // Date comparison & konversi ke ISO string agar backend menerimanya
            let currentOriginalDueDate = "";
            if (task.deadline) {
                const date = new Date(task.deadline);
                currentOriginalDueDate = date.toISOString().split("T")[0];
            }
            if (dueDate !== currentOriginalDueDate) {
                // Konversi YYYY-MM-DD → ISO string (contoh: 2026-03-04T00:00:00.000Z)
                payload.deadline = dueDate ? new Date(dueDate).toISOString() : undefined;
            }

            // If nothing changed, just close the modal
            if (Object.keys(payload).length === 0) {
                onClose();
                return;
            }

            console.log("[EditTaskModal] Mengirim payload:", JSON.stringify(payload, null, 2));
            await taskService.update(task.id, payload);
            toast.success("Tugas berhasil diperbarui!");
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error("Error updating task:", error);
            const message = error.response?.data?.message || "Gagal memperbarui tugas";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !task) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-8 relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Close"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold text-foreground mb-1">
                    Edit Tugas
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                    Perbarui rincian tugas.
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

                        {/* Story Points */}
                        <div>
                            <label className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                                <Flag size={16} className="text-primary" />
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

                        {/* Status */}
                        <div>
                            <label className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                                <Flag size={16} className="text-primary" />
                                Status
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                                className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition appearance-none cursor-pointer"
                            >
                                {Object.values(TaskStatus).map((s) => (
                                    <option key={s} value={s}>
                                        {TaskStatusLabels[s]}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                        {/* Division */}
                        <div>
                            <label className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                                <Briefcase size={16} className="text-primary" />
                                Divisi
                            </label>
                            <select
                                value={divisionId}
                                onChange={(e) => {
                                    setDivisionId(e.target.value);
                                    setDepartmentId("");
                                }}
                                className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition cursor-pointer"
                            >
                                <option value="">Pilih Divisi</option>
                                {divisions.map((d) => (
                                    <option key={d.id} value={d.id}>
                                        {d.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Department */}
                        <div>
                            <label className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                                <Building size={16} className="text-primary" />
                                Departemen
                            </label>
                            <select
                                value={departmentId}
                                onChange={(e) => setDepartmentId(e.target.value)}
                                disabled={!divisionId}
                                className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition cursor-pointer disabled:opacity-50"
                            >
                                <option value="">Pilih Departemen</option>
                                {departments.map((d) => (
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
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-border rounded-xl text-foreground hover:bg-secondary transition font-bold"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-3 bg-primary text-white rounded-xl hover:bg-blue-700 transition font-bold shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Memproses..." : "Simpan Perubahan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
