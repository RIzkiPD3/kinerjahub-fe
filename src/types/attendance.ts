export enum AttendanceStatus {
    PRESENT = "PRESENT",
    SICK = "SICK",
    PERMISSION = "PERMISSION",
    ABSENT = "ABSENT",
}

export const AttendanceStatusLabels: Record<AttendanceStatus, string> = {
    [AttendanceStatus.PRESENT]: "Hadir",
    [AttendanceStatus.SICK]: "Sakit",
    [AttendanceStatus.PERMISSION]: "Izin",
    [AttendanceStatus.ABSENT]: "Alpa",
};

export interface Attendance {
    id: string;
    organization_id: string;
    user_id: string;
    date: string;
    status: AttendanceStatus;
    notes?: string;
    created_at: string;
}

export interface CreateAttendanceDto {
    date: string;
    status: AttendanceStatus;
    notes?: string;
}

export interface UpdateAttendanceDto {
    status?: AttendanceStatus;
    notes?: string;
}
