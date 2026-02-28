import { useState, useEffect } from "react";
import { X, Calendar, ClipboardList, Send } from "lucide-react";
import { attendanceService } from "@/services/attendanceService";
import { AttendanceStatus, AttendanceStatusLabels } from "@/types/attendance";
import type { Attendance } from "@/types/attendance";
import { toast } from "@/lib/toast";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    attendance: Attendance | null;
}

export default function EditAttendanceModal({ isOpen, onClose, onSuccess, attendance }: Props) {
    const [status, setStatus] = useState<AttendanceStatus>(AttendanceStatus.PRESENT);
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (attendance && isOpen) {
            setStatus(attendance.status);
            setNotes(attendance.notes || "");
        }
    }, [attendance, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!attendance) return;

        try {
            setLoading(true);
            await attendanceService.update(attendance.id, { status, notes });
            toast.success("Absensi berhasil diperbarui!");
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error("Error updating attendance:", error);
            const message = error.response?.data?.message || "Gagal memperbarui absensi";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !attendance) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 relative">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold text-foreground mb-1">Edit Kehadiran</h2>
                <p className="text-sm text-muted-foreground mb-6">Ubah data absensi untuk tanggal {new Date(attendance.date).toLocaleDateString("id-ID")}.</p>

                <form onSubmit={handleSubmit} className="space-y-5">
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
                        <label className="block text-sm font-bold text-foreground mb-2">Keterangan</label>
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
                                Update Kehadiran
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
