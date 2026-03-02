import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    FolderKanban,
    Plus,
    Search,
    RotateCcw,
    Pencil,
    LayoutGrid,
    List,
    BarChart2,
    CheckCircle2,
    Clock,
    AlertCircle,
    CheckSquare,
    Trash2,
} from "lucide-react";
import { projectService } from "@/services/projectService";
import { taskService, type Task } from "@/services/taskService";
import type { ProjectDetail } from "@/types/project";
import { ProjectStatusLabels } from "@/types/project";
import { TaskStatus, TaskStatusLabels } from "@/types/task";
import AddTaskModal from "@/components/tasks/AddTaskModal";
import EditTaskModal from "@/components/tasks/EditTaskModal";
import RoleGuard from "@/components/auth/RoleGuard";
import { toast } from "@/lib/toast";
import { formatDate } from "@/lib/utils";

type TabType = "kanban" | "list" | "dashboard";

const ProjectDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<ProjectDetail | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>("list");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const fetchProject = async () => {
        if (!id) return;
        try {
            const data = await projectService.getById(id);
            setProject(data);
        } catch (error) {
            console.error("Error fetching project:", error);
            toast.error("Gagal memuat data proyek");
        }
    };

    const fetchTasks = async () => {
        if (!id) return;
        try {
            const projectTasks = await taskService.getByProject(id);
            // Ensure compatibility with both 'assignee' and 'assignedUser' fields
            const sanitizedTasks = projectTasks.map(task => ({
                ...task,
                assignee: task.assignee || task.assignedUser
            }));
            setTasks(sanitizedTasks);
            setFilteredTasks(sanitizedTasks);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            toast.error("Gagal memuat data tugas");
        }
    };

    const fetchAll = async () => {
        setIsLoading(true);
        await Promise.all([fetchProject(), fetchTasks()]);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchAll();
    }, [id]);

    useEffect(() => {
        let filtered = tasks;
        if (searchTerm) {
            filtered = filtered.filter(
                (t) =>
                    t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    t.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (statusFilter !== "all") {
            filtered = filtered.filter((t) => t.status === statusFilter);
        }
        setFilteredTasks(filtered);
    }, [searchTerm, statusFilter, tasks]);

    const handleReset = () => {
        setSearchTerm("");
        setStatusFilter("all");
    };

    const handleEditTask = (task: Task) => {
        setSelectedTask(task);
        setIsEditModalOpen(true);
    };

    const handleDeleteTask = async (taskId: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus tugas ini?")) return;
        try {
            await taskService.delete(taskId);
            toast.success("Tugas berhasil dihapus");
            fetchTasks();
        } catch {
            toast.error("Gagal menghapus tugas");
        }
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case TaskStatus.TO_DO:
                return { bg: "bg-blue-100 text-blue-700", icon: <AlertCircle size={14} /> };
            case TaskStatus.IN_PROGRESS:
                return { bg: "bg-orange-100 text-orange-700", icon: <Clock size={14} /> };
            case TaskStatus.DONE:
                return { bg: "bg-green-100 text-green-700", icon: <CheckCircle2 size={14} /> };
            case TaskStatus.DELIVERED:
                return { bg: "bg-purple-100 text-purple-700", icon: <CheckSquare size={14} /> };
            default:
                return { bg: "bg-gray-100 text-gray-600", icon: null };
        }
    };


    const getProjectStatusConfig = (status: string) => {
        switch (status) {
            case "ACTIVE":
                return "bg-green-100 text-green-700 border border-green-200";
            case "COMPLETED":
                return "bg-blue-100 text-blue-700 border border-blue-200";
            case "ARCHIVED":
                return "bg-gray-100 text-gray-600 border border-gray-200";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full py-24">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                <p className="ml-4 text-muted-foreground">Memuat proyek...</p>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="p-8 text-center">
                <FolderKanban className="mx-auto h-14 w-14 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-semibold text-foreground">Proyek tidak ditemukan</h3>
                <button
                    onClick={() => navigate("/dashboard/projects")}
                    className="mt-4 text-primary text-sm font-semibold hover:underline"
                >
                    ← Kembali ke daftar proyek
                </button>
            </div>
        );
    }

    // Kanban board
    const kanbanColumns = [
        { status: TaskStatus.TO_DO, label: "To Do", color: "border-blue-400 bg-blue-50" },
        { status: TaskStatus.IN_PROGRESS, label: "In Progress", color: "border-orange-400 bg-orange-50" },
        { status: TaskStatus.DONE, label: "Done", color: "border-green-400 bg-green-50" },
        { status: TaskStatus.DELIVERED, label: "Delivered", color: "border-purple-400 bg-purple-50" },
    ];

    // Dashboard stats
    const taskStats = {
        total: tasks.length,
        todo: tasks.filter((t) => t.status === TaskStatus.TO_DO).length,
        inProgress: tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS).length,
        done: tasks.filter((t) => t.status === TaskStatus.DONE).length,
        delivered: tasks.filter((t) => t.status === TaskStatus.DELIVERED).length,
    };

    return (
        <div className="p-6 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate("/dashboard/projects")}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
                    >
                        <ArrowLeft size={16} />
                        Kembali
                    </button>
                    <div className="h-4 w-px bg-border" />
                    <FolderKanban size={22} className="text-primary" />
                    <h1 className="text-xl font-bold text-foreground">{project.name}</h1>
                    <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${getProjectStatusConfig(project.status)}`}
                    >
                        {ProjectStatusLabels[project.status as keyof typeof ProjectStatusLabels] || project.status}
                    </span>
                </div>
            </div>

            {/* Tabs + Action */}
            <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="flex items-center justify-between border-b border-border px-4">
                    {/* Tabs */}
                    <div className="flex">
                        {(
                            [
                                { key: "kanban", label: "Kanban", icon: <LayoutGrid size={16} /> },
                                { key: "list", label: "List", icon: <List size={16} /> },
                                { key: "dashboard", label: "Dashboard", icon: <BarChart2 size={16} /> },
                            ] as const
                        ).map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 transition-all ${activeTab === tab.key
                                    ? "border-primary text-primary"
                                    : "border-transparent text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                {tab.icon}
                                {tab.label.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    <RoleGuard allowedRoles={["admin", "koordinator"]}>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-all my-2"
                        >
                            <Plus size={16} />
                            Add New Task
                        </button>
                    </RoleGuard>
                </div>

                {/* ───── LIST TAB ───── */}
                {activeTab === "list" && (
                    <div>
                        {/* Filters Bar */}
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-secondary/30">
                            <div className="relative">
                                <Search
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                    size={14}
                                />
                                <input
                                    type="text"
                                    placeholder="Cari tugas..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8 pr-3 py-1.5 bg-white border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20 w-44"
                                />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="text-sm bg-white border border-border rounded-lg px-3 py-1.5 outline-none cursor-pointer"
                            >
                                <option value="all">Semua Status</option>
                                {Object.values(TaskStatus).map((s) => (
                                    <option key={s} value={s}>
                                        {TaskStatusLabels[s]}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={handleReset}
                                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg border border-border bg-white"
                            >
                                <RotateCcw size={13} />
                                Reset
                            </button>
                        </div>

                        {/* Table */}
                        {filteredTasks.length === 0 ? (
                            <div className="p-12 text-center">
                                <CheckSquare className="mx-auto h-10 w-10 text-muted-foreground/30 mb-3" />
                                <p className="text-muted-foreground font-medium">Belum ada tugas dalam proyek ini.</p>
                                <RoleGuard allowedRoles={["admin", "koordinator"]}>
                                    <button
                                        onClick={() => setIsAddModalOpen(true)}
                                        className="mt-3 text-primary text-sm font-semibold hover:underline"
                                    >
                                        + Tambah tugas pertama
                                    </button>
                                </RoleGuard>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-secondary/40 border-b border-border">
                                        <tr>
                                            <th className="px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider w-1/3">
                                                Deskripsi Tugas
                                            </th>
                                            <th className="px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                                Story Point
                                            </th>
                                            <th className="px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                                Ditugaskan Ke
                                            </th>
                                            <th className="px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                                Due Date
                                            </th>
                                            <th className="px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {filteredTasks.map((task) => {
                                            const sc = getStatusConfig(task.status);
                                            return (
                                                <tr
                                                    key={task.id}
                                                    className="hover:bg-secondary/20 transition-colors"
                                                >
                                                    {/* Title */}
                                                    <td className="px-5 py-3.5">
                                                        <div className="flex items-start gap-2.5">
                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    task.status === TaskStatus.DONE ||
                                                                    task.status === TaskStatus.DELIVERED
                                                                }
                                                                readOnly
                                                                className="mt-0.5 accent-primary cursor-default"
                                                            />
                                                            <div>
                                                                <p className="text-sm font-medium text-foreground line-clamp-1">
                                                                    {task.title}
                                                                </p>
                                                                {task.description && (
                                                                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                                                        {task.description}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>


                                                    {/* Story Point */}
                                                    <td className="px-4 py-3.5">
                                                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-orange-100 text-orange-700 text-xs font-bold">
                                                            {task.story_point ?? "-"}
                                                        </span>
                                                    </td>

                                                    {/* Status */}
                                                    <td className="px-4 py-3.5">
                                                        <span
                                                            className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full w-fit ${sc.bg}`}
                                                        >
                                                            {sc.icon}
                                                            {TaskStatusLabels[task.status as TaskStatus] || task.status}
                                                        </span>
                                                    </td>

                                                    {/* Assignee */}
                                                    <td className="px-4 py-3.5">
                                                        <div className="flex items-center gap-2">
                                                            {task.assignee ? (
                                                                <>
                                                                    <div className="h-6 w-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-[10px] font-bold">
                                                                        {task.assignee.name[0]}
                                                                    </div>
                                                                    <span className="text-sm text-foreground">
                                                                        {task.assignee.name}
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <span className="text-sm text-muted-foreground italic">
                                                                    Unassigned
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* Due Date */}
                                                    <td className="px-4 py-3.5">
                                                        <span className="text-sm text-foreground">
                                                            {task.deadline ? formatDate(task.deadline) : "-"}
                                                        </span>
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="px-4 py-3.5 text-right">
                                                        <div className="flex items-center justify-end gap-1">
                                                            <RoleGuard allowedRoles={["admin", "koordinator"]}>
                                                                <button
                                                                    onClick={() => handleEditTask(task)}
                                                                    className="flex items-center gap-1 text-xs font-medium text-primary hover:bg-primary/10 px-2 py-1.5 rounded-lg transition-colors"
                                                                >
                                                                    <Pencil size={13} />
                                                                    Ubah
                                                                </button>
                                                            </RoleGuard>
                                                            <RoleGuard allowedRoles="admin">
                                                                <button
                                                                    onClick={() => handleDeleteTask(task.id)}
                                                                    className="p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                >
                                                                    <Trash2 size={13} />
                                                                </button>
                                                            </RoleGuard>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* ───── KANBAN TAB ───── */}
                {activeTab === "kanban" && (
                    <div className="p-4 overflow-x-auto">
                        <div className="flex gap-4 min-w-max">
                            {kanbanColumns.map((col) => {
                                const colTasks = tasks.filter((t) => t.status === col.status);
                                return (
                                    <div key={col.status} className="w-64 flex flex-col gap-2">
                                        {/* Column Header */}
                                        <div
                                            className={`flex items-center justify-between px-3 py-2 rounded-lg border-l-4 ${col.color}`}
                                        >
                                            <span className="text-xs font-bold text-foreground uppercase tracking-wide">
                                                {col.label}
                                            </span>
                                            <span className="text-xs font-bold text-muted-foreground bg-white px-1.5 py-0.5 rounded-full">
                                                {colTasks.length}
                                            </span>
                                        </div>

                                        {/* Task Cards */}
                                        <div className="flex flex-col gap-2 min-h-[100px]">
                                            {colTasks.length === 0 ? (
                                                <div className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                                                    Tidak ada tugas
                                                </div>
                                            ) : (
                                                colTasks.map((task) => (
                                                    <div
                                                        key={task.id}
                                                        className="bg-white rounded-lg border border-border p-3 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                                                    >
                                                        <div className="flex items-start justify-between gap-2 mb-2">
                                                            <p className="text-sm font-medium text-foreground line-clamp-2 leading-snug flex-1">
                                                                {task.title}
                                                            </p>
                                                            <RoleGuard allowedRoles={["admin", "koordinator"]}>
                                                                <button
                                                                    onClick={() => handleEditTask(task)}
                                                                    className="invisible group-hover:visible p-1 text-muted-foreground hover:text-primary rounded"
                                                                >
                                                                    <Pencil size={12} />
                                                                </button>
                                                            </RoleGuard>
                                                        </div>
                                                        <div className="flex items-center justify-between mt-2">
                                                            {task.story_point && (
                                                                <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
                                                                    {task.story_point} pts
                                                                </span>
                                                            )}
                                                        </div>
                                                        {task.assignee && (
                                                            <div className="flex items-center gap-1.5 mt-2">
                                                                <div className="h-5 w-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-[9px] font-bold">
                                                                    {task.assignee.name[0]}
                                                                </div>
                                                                <span className="text-[11px] text-muted-foreground">
                                                                    {task.assignee.name}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {task.deadline && (
                                                            <p className="text-[11px] text-muted-foreground mt-1.5 font-medium">
                                                                📅 {formatDate(task.deadline)}
                                                            </p>
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ───── DASHBOARD TAB ───── */}
                {activeTab === "dashboard" && (
                    <div className="p-6 space-y-6">
                        {/* Project Info */}
                        {project.description && (
                            <div className="bg-secondary/40 rounded-xl p-4 border border-border">
                                <p className="text-sm text-muted-foreground">{project.description}</p>
                            </div>
                        )}

                        {/* Task Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                {
                                    label: "Total Task",
                                    val: taskStats.total,
                                    color: "bg-primary/10 text-primary",
                                    icon: <FolderKanban size={20} />,
                                },
                                {
                                    label: "To Do",
                                    val: taskStats.todo,
                                    color: "bg-blue-100 text-blue-600",
                                    icon: <AlertCircle size={20} />,
                                },
                                {
                                    label: "In Progress",
                                    val: taskStats.inProgress,
                                    color: "bg-orange-100 text-orange-600",
                                    icon: <Clock size={20} />,
                                },
                                {
                                    label: "Selesai",
                                    val: taskStats.done + taskStats.delivered,
                                    color: "bg-green-100 text-green-600",
                                    icon: <CheckCircle2 size={20} />,
                                },
                            ].map((s) => (
                                <div
                                    key={s.label}
                                    className="bg-white rounded-xl border border-border p-4 flex items-center gap-4"
                                >
                                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${s.color}`}>
                                        {s.icon}
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                                        <p className="text-2xl font-bold text-foreground">{s.val}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Progress */}
                        <div className="bg-white rounded-xl border border-border p-5">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-bold text-foreground">Progress Proyek</h3>
                                <span className="text-2xl font-bold text-primary">
                                    {project.progressPercentage}%
                                </span>
                            </div>
                            <div className="h-3 bg-secondary rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary rounded-full transition-all duration-700"
                                    style={{ width: `${project.progressPercentage}%` }}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                {project.completedTasks} dari {project.totalTasks} tugas selesai
                            </p>
                        </div>

                        {/* Meta */}
                        <div className="bg-white rounded-xl border border-border p-5 grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-xs text-muted-foreground font-medium mb-1">Divisi</p>
                                <p className="font-semibold text-foreground">{project.division?.name || "-"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground font-medium mb-1">Departemen</p>
                                <p className="font-semibold text-foreground">{project.department?.name || "-"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground font-medium mb-1">Tanggal Mulai</p>
                                <p className="font-semibold text-foreground">
                                    {project.start_date ? formatDate(project.start_date) : "-"}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground font-medium mb-1">Deadline</p>
                                <p className="font-semibold text-foreground">
                                    {project.end_date ? formatDate(project.end_date) : "-"}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <AddTaskModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={() => {
                    fetchTasks();
                    fetchProject();
                }}
                defaultProjectId={id}
            />
            <EditTaskModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedTask(null);
                }}
                onSuccess={() => {
                    fetchTasks();
                    fetchProject();
                }}
                task={selectedTask}
            />
        </div>
    );
};

export default ProjectDetailPage;
