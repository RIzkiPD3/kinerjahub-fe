import { useState, useEffect } from "react";
import {
  CheckSquare,
  Plus,
  Search,
  MoreVertical,
  RefreshCw,
  Clock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { taskService, type Task } from "@/services/taskService";
import { toast } from "@/lib/toast";
import AddTaskModal from "@/components/tasks/AddTaskModal";

// Reuse the modal components or create new ones if they don't exist
// For now, I'll implement a simple list view to get started

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const data = await taskService.getAll();
      const taskList = Array.isArray(data) ? data : [];
      setTasks(taskList);
      setFilteredTasks(taskList);
    } catch (error) {
      toast.error("Gagal memuat data tugas");
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    let filtered = tasks;

    if (searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    setFilteredTasks(filtered);
  }, [searchTerm, statusFilter, tasks]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "todo":
        return <AlertCircle size={16} className="text-blue-500" />;
      case "in_progress":
        return <Clock size={16} className="text-orange-500" />;
      case "done":
        return <CheckCircle2 size={16} className="text-green-500" />;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      low: "bg-blue-100 text-blue-800 border-blue-200",
      medium: "bg-orange-100 text-orange-800 border-orange-200",
      high: "bg-red-100 text-red-800 border-red-200",
    };
    return (
      <span
        className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${colors[priority as keyof typeof colors] || "bg-gray-100"}`}
      >
        {priority.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <CheckSquare className="text-primary" size={28} />
            Manajemen Tugas
          </h2>
          <p className="text-muted-foreground">
            Kelola tugas tim, pantau progress, dan atur prioritas kerja.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchTasks}
            className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            Tambah Tugas
          </button>
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
              placeholder="Cari tugas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-secondary rounded-lg border-none focus:ring-2 focus:ring-primary/20 text-sm outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm bg-secondary border-none rounded-lg px-4 py-2 outline-none font-medium text-foreground cursor-pointer hover:bg-muted transition-colors"
            >
              <option value="all">Semua Status</option>
              <option value="todo">Belum Dimulai</option>
              <option value="in_progress">Dalam Pengerjaan</option>
              <option value="done">Selesai</option>
            </select>
          </div>
        </div>

        {/* List View */}
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="inline-block w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <p className="mt-4 text-muted-foreground">Memuat data...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="p-12 text-center">
            <CheckSquare className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              Tidak ada tugas
            </h3>
            <p className="text-muted-foreground">
              Belum ada tugas yang sesuai dengan kriteria Anda.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-secondary/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Tugas
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Prioritas
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTasks.map((task) => (
                  <tr
                    key={task.id}
                    className="hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">
                          {task.title}
                        </span>
                        <span className="text-xs text-muted-foreground line-clamp-1">
                          {task.description}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        {getStatusIcon(task.status)}
                        <span className="capitalize">
                          {task.status.replace("_", " ")}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getPriorityBadge(task.priority)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-muted-foreground hover:text-foreground p-2 rounded-lg">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchTasks}
      />
    </div>
  );
};

export default TasksPage;
