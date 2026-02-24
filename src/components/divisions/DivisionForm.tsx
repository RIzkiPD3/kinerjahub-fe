import { useState } from "react";
import axios from "axios";
import { Briefcase, Save, X, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
    createDivision,
    updateDivision,
} from "@/services/divisonService";
import type {
    Division,
    CreateDivisionDTO,
    UpdateDivisionDTO
} from "@/services/divisonService";

interface DivisionFormProps {
    initialData?: Division;
    onSuccess: () => void;
    onCancel: () => void;
}

const DivisionForm = ({ initialData, onSuccess, onCancel }: DivisionFormProps) => {
    const isUpdate = !!initialData;
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: initialData?.name || "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Frontend Validation
        if (!formData.name.trim()) {
            setError("Nama divisi tidak boleh kosong.");
            return;
        }

        // organization_id must be valid (taken from user context)
        const organizationId = user?.organization_id;
        if (!organizationId && !isUpdate) {
            setError("Organization ID tidak ditemukan. Silakan login kembali.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            if (isUpdate && initialData) {
                // Only send changed fields for Update
                const updatedFields: UpdateDivisionDTO = {};
                if (formData.name !== initialData.name) {
                    updatedFields.name = formData.name;
                }

                if (Object.keys(updatedFields).length === 0) {
                    onSuccess(); // No changes made
                    return;
                }

                await updateDivision(initialData.id, updatedFields);
            } else {
                const payload: CreateDivisionDTO = {
                    name: formData.name,
                    organization_id: organizationId!,
                };
                await createDivision(payload);
            }
            onSuccess();
        } catch (err) {
            console.error("Division submission error:", err);
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
                    <Briefcase className="text-primary" size={20} />
                    {isUpdate ? "Edit Divisi" : "Tambah Divisi Baru"}
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
                        Nama Divisi <span className="text-destructive">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Masukkan nama divisi (e.g. Frontend, Backend, Sales)"
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                        required
                    />
                </div>

                {/* Info Box for transparency */}
                {!isUpdate && user?.organization_id && (
                    <div className="p-3 bg-secondary/50 rounded-lg">
                        <p className="text-[10px] text-muted-foreground font-medium">
                            ID Organisasi: <span className="font-mono">{user.organization_id}</span>
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1">
                            * Akan disertakan secara otomatis dalam request.
                        </p>
                    </div>
                )}

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
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" size={18} />
                        ) : (
                            <Save size={18} />
                        )}
                        {isUpdate ? "Simpan Perubahan" : "Simpan Divisi"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DivisionForm;
