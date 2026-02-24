import { useState, useEffect } from "react";
import axios from "axios";
import { Building, Save, X, Loader2 } from "lucide-react";
import {
    createDepartment,
    updateDepartment,
} from "@/services/departementService";
import type {
    Department,
    CreateDepartmentDTO,
    UpdateDepartmentDTO
} from "@/services/departementService";
import { getDivisions } from "@/services/divisonService";
import type { Division } from "@/services/divisonService";

interface DepartmentFormProps {
    initialData?: Department;
    onSuccess: () => void;
    onCancel: () => void;
}

const DepartmentForm = ({ initialData, onSuccess, onCancel }: DepartmentFormProps) => {
    const isUpdate = !!initialData;
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingDivisions, setIsFetchingDivisions] = useState(false);
    const [divisions, setDivisions] = useState<Division[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        division_id: initialData?.division_id || "",
    });

    useEffect(() => {
        const fetchDivisions = async () => {
            setIsFetchingDivisions(true);
            try {
                const data = await getDivisions();
                setDivisions(data);
            } catch (err) {
                console.error("Failed to fetch divisions:", err);
                setError("Gagal mengambil data divisi.");
            } finally {
                setIsFetchingDivisions(false);
            }
        };

        fetchDivisions();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Frontend Validation
        if (!formData.name.trim()) {
            setError("Nama departemen tidak boleh kosong.");
            return;
        }
        if (!formData.division_id) {
            setError("Silakan pilih divisi.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            if (isUpdate && initialData) {
                // Only send changed fields for Update
                const updatedFields: UpdateDepartmentDTO = {};
                if (formData.name !== initialData.name) updatedFields.name = formData.name;
                if (formData.division_id !== initialData.division_id) updatedFields.division_id = formData.division_id;

                if (Object.keys(updatedFields).length === 0) {
                    onSuccess(); // No changes made
                    return;
                }

                await updateDepartment(initialData.id, updatedFields);
            } else {
                const payload: CreateDepartmentDTO = {
                    name: formData.name,
                    division_id: formData.division_id,
                };
                await createDepartment(payload);
            }
            onSuccess();
        } catch (err) {
            console.error("Department submission error:", err);
            let errorMessage = "Terjadi kesalahan. Silakan coba lagi.";
            if (axios.isAxiosError(err)) {
                // Tangani error 400 dengan menampilkan pesan error dari backend
                errorMessage = err.response?.data?.message || errorMessage;
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-background rounded-xl border border-border overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between bg-primary/5">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Building className="text-primary" size={20} />
                    {isUpdate ? "Edit Departemen" : "Tambah Departemen Baru"}
                </h3>
                <button
                    onClick={onCancel}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {error && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-lg animate-in fade-in slide-in-from-top-1">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-1">
                        Nama Departemen <span className="text-destructive">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Masukkan nama departemen (e.g. IT, Finance)"
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-1">
                        Pilih Divisi <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                        <select
                            name="division_id"
                            value={formData.division_id}
                            onChange={handleChange}
                            disabled={isFetchingDivisions}
                            className="w-full px-4 py-2 bg-background border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm appearance-none disabled:opacity-50"
                            required
                        >
                            <option value="">-- Pilih Divisi --</option>
                            {divisions.map((div) => (
                                <option key={div.id} value={div.id}>
                                    {div.name}
                                </option>
                            ))}
                        </select>
                        {isFetchingDivisions ? (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <Loader2 className="animate-spin text-muted-foreground" size={16} />
                            </div>
                        ) : (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-2 flex flex-col-reverse sm:flex-row gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg text-sm font-medium hover:bg-secondary transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading || isFetchingDivisions}
                        className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" size={18} />
                        ) : (
                            <Save size={18} />
                        )}
                        {isUpdate ? "Simpan Perubahan" : "Simpan Departemen"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DepartmentForm;
