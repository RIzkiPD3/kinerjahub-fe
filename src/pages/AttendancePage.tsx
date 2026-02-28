import { useState, useEffect } from "react";
import {
    CalendarDays,
    Plus,
    Search,
    RefreshCw,
    Clock,
    CheckCircle2,
    XCircle,
    HelpCircle,
    Pencil,
    Trash2,
} from "lucide-react";
import { attendanceService } from "@/services/attendanceService";
import { AttendanceStatus, AttendanceStatusLabels } from "@/types/attendance";
import type { Attendance } from "@/types/attendance";
import { toast } from "@/lib/toast";
import { formatDate } from "@/lib/utils";
import AddAttendanceModal from "@/components/attendance/AddAttendanceModal";
import EditAttendanceModal from "@/components/attendance/EditAttendanceModal";

const AttendancePage = () => {
    const [attendances, setAttendances] = useState<Attendance[]>([]);
    const [filteredAttendances, setFilteredAttendances] = useState<Attendance[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [dateFilter, setDateFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);

    const fetchAttendances = async () => {
        setIsLoading(true);
        try {
            const data = await attendanceService.getMyAttendances();
            setAttendances(data);
            setFilteredAttendances(data);
        } catch (error) {
            toast.error("Gagal memuat data absensi");
            console.error("Error fetching attendances:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendances();
    }, []);

    useEffect(() => {
        let filtered = attendances;

        if (dateFilter) {
            filtered = filtered.filter((a) => a.date.startsWith(dateFilter));
        }

        if (statusFilter !== "all") {
            filtered = filtered.filter((a) => a.status === statusFilter);
        }

        setFilteredAttendances(filtered);
    }, [dateFilter, statusFilter, attendances]);

    const getStatusIcon = (status: AttendanceStatus) => {
        switch (status) {
            case AttendanceStatus.PRESENT:
                return <CheckCircle2 size={16} className="text-green-500" />;
            case AttendanceStatus.SICK:
                return <Clock size={16} className="text-orange-500" />;
            case AttendanceStatus.PERMISSION:
                return <HelpCircle size={16} className="text-blue-500" />;
            case AttendanceStatus.ABSENT:
                return <XCircle size={16} className="text-red-500" />;
            default:
                return null;
        }
    };

    const getStatusBadge = (status: AttendanceStatus) => {
        const colors = {
            [AttendanceStatus.PRESENT]: "bg-green-100 text-green-800 border-green-200",
            [AttendanceStatus.SICK]: "bg-orange-100 text-orange-800 border-orange-200",
            [AttendanceStatus.PERMISSION]: "bg-blue-100 text-blue-800 border-blue-200",
            [AttendanceStatus.ABSENT]: "bg-red-100 text-red-800 border-red-200",
        };
        return (
            <span
                className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${colors[status] || "bg-gray-100"}`}
            >
                {AttendanceStatusLabels[status] || status}
            </span>
        );
    };

    const handleEdit = (attendance: Attendance) => {
        setSelectedAttendance(attendance);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus data absensi ini?")) return;
        try {
            await attendanceService.delete(id);
            toast.success("Data absensi berhasil dihapus");
            fetchAttendances();
        } catch (error) {
            toast.error("Gagal menghapus data absensi");
        }
    };

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex items-end justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <CalendarDays className="text-primary" size={28} />
                        Daftar Kehadiran
                    </h2>
                    <p className="text-muted-foreground">
                        Pantau dan catat kehadiran harian Anda.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchAttendances}
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
                        Catat Kehadiran
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
                <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                        <div className="relative">
                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="pl-4 pr-10 py-2 bg-secondary rounded-lg border-none focus:ring-2 focus:ring-primary/20 text-sm outline-none w-full"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="text-sm bg-secondary border-none rounded-lg px-4 py-2 outline-none font-medium text-foreground cursor-pointer hover:bg-muted transition-colors w-full md:w-48"
                        >
                            <option value="all">Semua Status</option>
                            {Object.values(AttendanceStatus).map((s) => (
                                <option key={s} value={s}>
                                    {AttendanceStatusLabels[s]}
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
                ) : filteredAttendances.length === 0 ? (
                    <div className="p-12 text-center">
                        <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground/50" />
                        <h3 className="mt-4 text-lg font-semibold text-foreground">
                            Tidak ada data kehadiran
                        </h3>
                        <p className="text-muted-foreground">
                            Belum ada riwayat kehadiran sesuai filter Anda.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-secondary/50 border-b border-border">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                        Tanggal
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                        Keterangan
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredAttendances.map((attendance) => (
                                    <tr
                                        key={attendance.id}
                                        className="hover:bg-secondary/30 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <span className="font-semibold text-foreground">
                                                {formatDate(attendance.date)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(attendance.status)}
                                                {getStatusBadge(attendance.status)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-muted-foreground">
                                                {attendance.notes || "-"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(attendance)}
                                                    className="text-primary hover:text-blue-700 p-2 rounded-lg hover:bg-primary/10 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(attendance.id)}
                                                    className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                                                    title="Hapus"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <AddAttendanceModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={fetchAttendances}
            />

            <EditAttendanceModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedAttendance(null);
                }}
                onSuccess={fetchAttendances}
                attendance={selectedAttendance}
            />
        </div>
    );
};

export default AttendancePage;
