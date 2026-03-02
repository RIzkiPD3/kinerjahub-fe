import { useState, useEffect } from "react";
import {
    Plus,
    Search,
    Edit,
    Trash2,
    FolderKanban,
    Zap,
    CheckCircle2,
    Archive,
    Eye,
} from "lucide-react";
import { projectService } from "@/services/projectService";
import type { Project, ProjectStatus } from "@/types/project";
import { ProjectStatusLabels } from "@/types/project";
import ProjectModal from "@/components/projects/ProjectModal";
import RoleGuard from "@/components/auth/RoleGuard";
import { toast } from "@/lib/toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProjectsPage = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const data = await projectService.getAll();
            setProjects(data);
            setFilteredProjects(data);
        } catch (error) {
            console.error("Error fetching projects:", error);
            toast.error("Gagal memuat data proyek");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        let filtered = projects.filter((p) => {
            const matchSearch =
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (p.description || "").toLowerCase().includes(searchTerm.toLowerCase());
            const matchStatus = statusFilter === "all" || p.status === statusFilter;
            return matchSearch && matchStatus;
        });
        setFilteredProjects(filtered);
    }, [searchTerm, statusFilter, projects]);

    const handleCreate = async (data: any) => {
        try {
            await projectService.create(data);
            toast.success("Proyek berhasil ditambahkan");
            fetchData();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Gagal menambahkan proyek");
            } else {
                toast.error("Gagal menambahkan proyek");
            }
            throw error;
        }
    };

    const handleUpdate = async (data: any) => {
        if (!selectedProject) return;
        try {
            await projectService.update(selectedProject.id, data);
            toast.success("Proyek berhasil diperbarui");
            fetchData();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Gagal memperbarui proyek");
            } else {
                toast.error("Gagal memperbarui proyek");
            }
            throw error;
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Apakah Anda yakin ingin menghapus proyek ini?")) return;
        try {
            await projectService.delete(id);
            toast.success("Proyek berhasil dihapus");
            fetchData();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Gagal menghapus proyek");
            } else {
                toast.error("Gagal menghapus proyek");
            }
        }
    };

    const openCreateModal = () => {
        setSelectedProject(null);
        setIsModalOpen(true);
    };

    const openEditModal = (project: Project, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    const getStatusConfig = (status: ProjectStatus) => {
        switch (status) {
            case "ACTIVE":
                return {
                    badge: "bg-green-100 text-green-700 border border-green-200",
                    dot: "bg-green-500",
                    label: "AKTIF",
                };
            case "COMPLETED":
                return {
                    badge: "bg-blue-100 text-blue-700 border border-blue-200",
                    dot: "bg-blue-500",
                    label: "SELESAI",
                };
            case "ARCHIVED":
                return {
                    badge: "bg-gray-100 text-gray-600 border border-gray-200",
                    dot: "bg-gray-400",
                    label: "ARSIP",
                };
            default:
                return {
                    badge: "bg-gray-100 text-gray-600 border border-gray-200",
                    dot: "bg-gray-400",
                    label: status,
                };
        }
    };

    // Stats
    const stats = {
        total: projects.length,
        active: projects.filter((p) => p.status === "ACTIVE").length,
        completed: projects.filter((p) => p.status === "COMPLETED").length,
        archived: projects.filter((p) => p.status === "ARCHIVED").length,
    };

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <FolderKanban size={28} className="text-primary" />
                    <h1 className="text-2xl font-bold text-foreground">Proyek</h1>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            size={16}
                        />
                        <input
                            type="text"
                            placeholder="Cari proyek..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-white border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20 w-56"
                        />
                    </div>
                    <RoleGuard allowedRoles={["admin", "koordinator"]}>
                        <button
                            onClick={openCreateModal}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm"
                        >
                            <Plus size={17} />
                            Proyek Baru
                        </button>
                    </RoleGuard>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Total */}
                <div
                    onClick={() => setStatusFilter("all")}
                    className={`bg-white rounded-xl border-2 p-5 flex items-center gap-4 cursor-pointer transition-all hover:shadow-md ${statusFilter === "all" ? "border-primary shadow-sm" : "border-transparent hover:border-primary/30"}`}
                >
                    <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <FolderKanban size={24} className="text-primary" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                            Total Proyek
                        </p>
                        <p className="text-3xl font-bold text-foreground">{stats.total}</p>
                    </div>
                </div>

                {/* Aktif */}
                <div
                    onClick={() => setStatusFilter("ACTIVE")}
                    className={`bg-white rounded-xl border-2 p-5 flex items-center gap-4 cursor-pointer transition-all hover:shadow-md ${statusFilter === "ACTIVE" ? "border-yellow-400 shadow-sm" : "border-transparent hover:border-yellow-200"}`}
                >
                    <div className="h-12 w-12 bg-yellow-50 rounded-xl flex items-center justify-center">
                        <Zap size={24} className="text-yellow-500" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                            Proyek Aktif
                        </p>
                        <p className="text-3xl font-bold text-foreground">{stats.active}</p>
                    </div>
                </div>

                {/* Selesai */}
                <div
                    onClick={() => setStatusFilter("COMPLETED")}
                    className={`bg-white rounded-xl border-2 p-5 flex items-center gap-4 cursor-pointer transition-all hover:shadow-md ${statusFilter === "COMPLETED" ? "border-green-400 shadow-sm" : "border-transparent hover:border-green-200"}`}
                >
                    <div className="h-12 w-12 bg-green-50 rounded-xl flex items-center justify-center">
                        <CheckCircle2 size={24} className="text-green-500" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                            Proyek Selesai
                        </p>
                        <p className="text-3xl font-bold text-foreground">{stats.completed}</p>
                    </div>
                </div>

                {/* Arsip */}
                <div
                    onClick={() => setStatusFilter("ARCHIVED")}
                    className={`bg-white rounded-xl border-2 p-5 flex items-center gap-4 cursor-pointer transition-all hover:shadow-md ${statusFilter === "ARCHIVED" ? "border-gray-400 shadow-sm" : "border-transparent hover:border-gray-200"}`}
                >
                    <div className="h-12 w-12 bg-gray-100 rounded-xl flex items-center justify-center">
                        <Archive size={24} className="text-gray-500" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                            Proyek Diarsipkan
                        </p>
                        <p className="text-3xl font-bold text-foreground">{stats.archived}</p>
                    </div>
                </div>
            </div>

            {/* Project Cards */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="inline-block w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                    <p className="ml-4 text-muted-foreground">Memuat data proyek...</p>
                </div>
            ) : filteredProjects.length === 0 ? (
                <div className="bg-white rounded-xl border border-border p-16 text-center">
                    <FolderKanban className="mx-auto h-14 w-14 text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-semibold text-foreground">Tidak ada proyek</h3>
                    <p className="text-muted-foreground mt-1 text-sm">
                        {searchTerm || statusFilter !== "all"
                            ? "Tidak ada proyek yang sesuai filter."
                            : "Belum ada proyek. Klik \"Proyek Baru\" untuk membuat."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredProjects.map((project) => {
                        const statusConfig = getStatusConfig(project.status);
                        return (
                            <div
                                key={project.id}
                                className="bg-white rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group flex flex-col"
                                onClick={() => navigate(`/dashboard/projects/${project.id}`)}
                            >
                                {/* Card Header */}
                                <div className="p-4 border-b border-border/60 flex items-center justify-between">
                                    <div className="h-9 w-9 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <FolderKanban size={18} className="text-primary" />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span
                                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${statusConfig.badge}`}
                                        >
                                            {statusConfig.label}
                                        </span>
                                        <RoleGuard allowedRoles={["admin", "koordinator"]}>
                                            <button
                                                onClick={(e) => openEditModal(project, e)}
                                                className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={14} />
                                            </button>
                                        </RoleGuard>
                                        <RoleGuard allowedRoles="admin">
                                            <button
                                                onClick={(e) => handleDelete(project.id, e)}
                                                className="p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Hapus"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </RoleGuard>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-4 flex-1">
                                    <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2 mb-1">
                                        {project.name}
                                    </h3>
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                        {project.description || "Tidak ada deskripsi."}
                                    </p>

                                    {/* Progress bar */}
                                    {project.totalTasks > 0 && (
                                        <div className="mt-3">
                                            <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                                                <span>{project.completedTasks}/{project.totalTasks} Task</span>
                                                <span className="font-semibold text-primary">
                                                    {project.progressPercentage}%
                                                </span>
                                            </div>
                                            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary rounded-full transition-all duration-500"
                                                    style={{ width: `${project.progressPercentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Card Footer */}
                                <div className="px-4 py-3 border-t border-border/60 flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <FolderKanban size={12} />
                                            {project.totalTasks} Tugas
                                        </span>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/dashboard/projects/${project.id}`);
                                        }}
                                        className="flex items-center gap-1 text-xs text-primary font-semibold hover:text-blue-700 transition-colors"
                                    >
                                        Lihat
                                        <Eye size={13} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <ProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={selectedProject ? handleUpdate : handleCreate}
                project={selectedProject}
                title={selectedProject ? "Edit Proyek" : "Tambah Proyek"}
            />
        </div>
    );
};

export default ProjectsPage;
