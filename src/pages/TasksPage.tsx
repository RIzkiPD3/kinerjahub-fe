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
  Pencil,
  FolderKanban,
} from "lucide-react";
import { taskService, type Task } from "@/services/taskService";
import { projectService } from "@/services/projectService";
import type { Project } from "@/types/project";
import { departmentsService } from "@/services/departmentService";
import { divisionService, type Division } from "@/services/divisionService";
import { TaskStatus, TaskStatusLabels } from "@/types/task";
import { toast } from "@/lib/toast";
import { formatDate } from "@/lib/utils";
import AddTaskModal from "@/components/tasks/AddTaskModal";
import EditTaskModal from "@/components/tasks/EditTaskModal";
import RoleGuard from "@/components/auth/RoleGuard";
import type { Department } from "@/types/department";

// Reuse the modal components or create new ones if they don't exist
// For now, I'll implement a simple list view to get started

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [divisionFilter, setDivisionFilter] = useState<string>("all");
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

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

  const fetchFilterData = async () => {
    try {
      const [depts, divs, projs] = await Promise.all([
        departmentsService.getAll(),
        divisionService.getAll(),
        projectService.getAll()
      ]);
      setDepartments(depts);
      setDivisions(divs);
      setProjects(projs);
    } catch (error) {
      console.error("Error fetching filters:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchFilterData();
  }, []);

  useEffect(() => {
    let filtered = tasks;

    if (searchTerm) {
      filtered = filtered.filter(
        (task) =>
          (task.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
          (task.description?.toLowerCase() || "").includes(searchTerm.toLowerCase()),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    if (departmentFilter !== "all") {
      filtered = filtered.filter((task) => task.department?.id === departmentFilter);
    }

    if (divisionFilter !== "all") {
      filtered = filtered.filter((task) => task.division?.name === divisionFilter);
    }

    if (projectFilter !== "all") {
      filtered = filtered.filter((task) => task.projectName === projectFilter);
    }

    setFilteredTasks(filtered);
  }, [searchTerm, statusFilter, departmentFilter, divisionFilter, projectFilter, tasks]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case TaskStatus.TO_DO:
        return <AlertCircle size={16} className="text-blue-500" />;
      case TaskStatus.IN_PROGRESS:
        return <Clock size={16} className="text-orange-500" />;
      case TaskStatus.DONE:
        return <CheckCircle2 size={16} className="text-green-500" />;
      case TaskStatus.DELIVERED:
        return <CheckSquare size={16} className="text-purple-500" />;
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
        {priority ? priority.toUpperCase() : "NORMAL"}
      </span>
    );
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
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
          <RoleGuard allowedRoles="admin">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all flex items-center gap-2"
            >
              <Plus size={18} />
              Tambah Tugas
            </button>
          </RoleGuard>
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
              {Object.values(TaskStatus).map((s) => (
                <option key={s} value={s}>
                  {TaskStatusLabels[s]}
                </option>
              ))}
            </select>

            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="text-sm bg-secondary border-none rounded-lg px-4 py-2 outline-none font-medium text-foreground cursor-pointer hover:bg-muted transition-colors"
            >
              <option value="all">Semua Departemen</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            <select
              value={divisionFilter}
              onChange={(e) => setDivisionFilter(e.target.value)}
              className="text-sm bg-secondary border-none rounded-lg px-4 py-2 outline-none font-medium text-foreground cursor-pointer hover:bg-muted transition-colors"
            >
              <option value="all">Semua Divisi</option>
              {divisions.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>

            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="text-sm bg-secondary border-none rounded-lg px-4 py-2 outline-none font-medium text-foreground cursor-pointer hover:bg-muted transition-colors"
            >
              <option value="all">Semua Proyek</option>
              {projects.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
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
                  <th className="px-4 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider w-1/3">
                    Tugas & Detail
                  </th>
                  <th className="px-4 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Penerima
                  </th>
                  <th className="px-4 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Deadline
                  </th>
                  <th className="px-4 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Prioritas
                  </th>
                  <th className="px-4 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">
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
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-foreground line-clamp-1">
                          {task.title}
                        </span>
                        <span className="text-xs text-muted-foreground line-clamp-1 mb-1">
                          {task.description}
                        </span>
                        <div className="flex flex-wrap gap-1.5 items-center mt-1">
                          {task.department?.name && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                              {task.department.name}
                            </span>
                          )}
                          {task.division?.name && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-50 text-slate-700 border border-slate-100">
                              {task.division.name}
                            </span>
                          )}
                          {task.projectName && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
                              <FolderKanban size={10} className="mr-1" />
                              {task.projectName}
                            </span>
                          )}
                          {task.story_point && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-orange-50 text-orange-700 border border-orange-100">
                              {task.story_point} pts
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        {getStatusIcon(task.status)}
                        <span>
                          {TaskStatusLabels[task.status as TaskStatus] || task.status || "Unknown"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 bg-primary/10 text-primary rounded-full flex items-center justify-center text-[10px] font-bold">
                          {(task.assignee?.name || "U")[0]}
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {task.assignee?.name || "(Kosong)"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium text-foreground">
                        {formatDate(task.deadline)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {getPriorityBadge(task.priority)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <RoleGuard allowedRoles="admin" fallback="-">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditTask(task)}
                            className="text-primary hover:text-blue-700 p-2 rounded-lg hover:bg-primary/10 transition-colors"
                            title="Edit Tugas"
                          >
                            <Pencil size={18} />
                          </button>
                        </div>
                      </RoleGuard>
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

      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTask(null);
        }}
        onSuccess={fetchTasks}
        task={selectedTask}
      />
    </div>
  );
};

export default TasksPage;
