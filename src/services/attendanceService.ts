import api from "@/lib/api";
import type {
    Attendance,
    CreateAttendanceDto,
    UpdateAttendanceDto,
} from "@/types/attendance";

export const attendanceService = {
    // Get all my attendances
    async getMyAttendances(date?: string): Promise<Attendance[]> {
        const url = date ? `/attendances?date=${date}` : "/attendances";
        const response = await api.get(url);
        return Array.isArray(response.data)
            ? response.data
            : response.data.data || [];
    },

    // Get attendance by ID
    async getById(id: string): Promise<Attendance> {
        const response = await api.get(`/attendances/${id}`);
        return response.data.data || response.data;
    },

    // Create attendance
    async create(data: CreateAttendanceDto): Promise<Attendance> {
        const response = await api.post("/attendances", data);
        return response.data.data || response.data;
    },

    // Update attendance
    async update(id: string, data: UpdateAttendanceDto): Promise<Attendance> {
        const response = await api.put(`/attendances/${id}`, data);
        return response.data.data || response.data;
    },

    // Delete attendance
    async delete(id: string): Promise<void> {
        await api.delete(`/attendances/${id}`);
    },
};
