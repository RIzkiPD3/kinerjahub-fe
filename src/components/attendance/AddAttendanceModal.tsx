import { useState } from "react";
import { X, Calendar, ClipboardList, Send } from "lucide-react";
import { attendanceService } from "@/services/attendanceService";
import { AttendanceStatus, AttendanceStatusLabels } from "@/types/attendance";
import { toast } from "@/lib/toast";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddAttendanceModal({ isOpen, onClose, onSuccess }: Props) {
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [status, setStatus] = useState<AttendanceStatus>(AttendanceStatus.PRESENT);
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!date || !status) {
            toast.error("Tanggal dan Status wajib diisi!");
            return;
        }

        try {
            setLoading(true);
            await attendanceService.create({ date, status, notes });
            toast.success("Kehadiran berhasil dicatat!");
            onSuccess();
            onClose();
            // Reset form
            setNotes("");
            setStatus(AttendanceStatus.PRESENT);
        } catch (error: any) {
            console.error("Error creating attendance:", error);
            const message = error.response?.data?.message || "Gagal mencatat kehadiran";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 relative">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold text-foreground mb-1">Catat Kehadiran</h2>
                <p className="text-sm text-muted-foreground mb-6">Pilih status kehadiran Anda hari ini.</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Date */}
                    <div>
                        <label className="block text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                            <Calendar size={16} className="text-primary" />
                            Tanggal
                        </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                            required
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                            <ClipboardList size={16} className="text-primary" />
                            Status Kehadiran
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {Object.values(AttendanceStatus).map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setStatus(s)}
                                    className={`px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${status === s
                                            ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                            : "bg-secondary/50 border-border text-foreground hover:bg-secondary"
                                        }`}
                                >
                                    {AttendanceStatusLabels[s]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-bold text-foreground mb-2">Keterangan (Opsional)</label>
                        <textarea
                            placeholder="Contoh: Sakit flu, Izin urusan keluarga, dll."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition min-h-[100px]"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-4 bg-primary text-white rounded-xl hover:bg-blue-700 transition font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? "Memproses..." : (
                            <>
                                <Send size={18} />
                                Simpan Kehadiran
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
