import { useEffect, useState } from "react";
import { X, Calendar, Briefcase, Building, ListChecks } from "lucide-react";
import { projectService } from "@/services/projectService";
import { divisionService, type Division } from "@/services/divisionService";
import { departmentsService } from "@/services/departmentService";
import { toast } from "@/lib/toast";
import type { Project, ProjectStatus } from "@/types/project";
import { ProjectStatusLabels } from "@/types/project";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    project?: Project | null;
    title: string;
}

interface Department {
    id: string;
    name: string;
}

export default function ProjectModal({ isOpen, onClose, onSubmit, project, title }: Props) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [divisionId, setDivisionId] = useState("");
    const [departmentId, setDepartmentId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [status, setStatus] = useState<ProjectStatus>("ACTIVE" as ProjectStatus);

    const [divisions, setDivisions] = useState<Division[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            divisionService.getAll()
                .then(setDivisions)
                .catch(err => {
                    console.error("Error loading divisions:", err);
                    toast.error("Gagal memuat data divisi");
                });
        }
    }, [isOpen]);

    useEffect(() => {
        if (project && isOpen) {
            setName(project.name);
            setDescription(project.description || "");
            setDivisionId(project.division_id);
            setDepartmentId(project.department_id);
            setStatus(project.status);
            setStartDate(project.start_date ? new Date(project.start_date).toISOString().split("T")[0] : "");
            setEndDate(project.end_date ? new Date(project.end_date).toISOString().split("T")[0] : "");
        } else if (isOpen) {
            setName("");
            setDescription("");
            setDivisionId("");
            setDepartmentId("");
            setStartDate("");
            setEndDate("");
            setStatus("ACTIVE" as ProjectStatus);
        }
    }, [project, isOpen]);

    useEffect(() => {
        if (!divisionId) {
            setDepartments([]);
            return;
        }

        departmentsService.getByDivision(divisionId)
            .then(setDepartments)
            .catch(err => {
                console.error("Error loading departments:", err);
            });
    }, [divisionId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !divisionId || !departmentId) {
            toast.error("Nama, divisi, dan departemen wajib diisi!");
            return;
        }

        try {
            setLoading(true);
            const data: any = {
                name,
                description,
                division_id: divisionId,
                department_id: departmentId,
                start_date: startDate || null,
                end_date: endDate || null,
            };

            if (project) {
                data.status = status;
            }

            await onSubmit(data);
            onClose();
        } catch (error) {
            // Error handled in parent
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-8 relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold text-foreground mb-1">{title}</h2>
                <p className="text-sm text-muted-foreground mb-6">
                    Kelola rincian proyek organisasi Anda.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-foreground mb-2">Nama Proyek *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                            placeholder="Contoh: Digital Transformation 2026"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-foreground mb-2">Deskripsi</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition min-h-[100px]"
                            placeholder="Jelaskan tujuan proyek..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                                <Briefcase size={16} className="text-primary" />
                                Divisi *
                            </label>
                            <select
                                value={divisionId}
                                onChange={(e) => {
                                    setDivisionId(e.target.value);
                                    setDepartmentId("");
                                }}
                                className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                required
                            >
                                <option value="">Pilih Divisi</option>
                                {divisions.map((d) => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                                <Building size={16} className="text-primary" />
                                Departemen *
                            </label>
                            <select
                                value={departmentId}
                                onChange={(e) => setDepartmentId(e.target.value)}
                                disabled={!divisionId}
                                className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none disabled:opacity-50"
                                required
                            >
                                <option value="">Pilih Departemen</option>
                                {departments.map((d) => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                                <Calendar size={16} className="text-primary" />
                                Tanggal Mulai
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                                <Calendar size={16} className="text-primary" />
                                Target Selesai
                            </label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            />
                        </div>
                    </div>

                    {project && (
                        <div>
                            <label className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                                <ListChecks size={16} className="text-primary" />
                                Status
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                                className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            >
                                {Object.entries(ProjectStatusLabels).map(([val, label]) => (
                                    <option key={val} value={val}>{label}</option>
                                ))}
                            </select>
                        </div>
                    )}

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
                            className="flex-1 px-4 py-3 bg-primary text-white rounded-xl hover:bg-blue-700 transition font-bold shadow-lg shadow-primary/20 disabled:opacity-50"
                        >
                            {loading ? "Memproses..." : project ? "Simpan Perubahan" : "Buat Proyek"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
