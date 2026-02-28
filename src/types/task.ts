export enum TaskStatus {
    TO_DO = "TO_DO",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE",
    DELIVERED = "DELIVERED",
}

export const TaskStatusLabels: Record<TaskStatus, string> = {
    [TaskStatus.TO_DO]: "Belum Dimulai",
    [TaskStatus.IN_PROGRESS]: "Dalam Pengerjaan",
    [TaskStatus.DONE]: "Selesai",
    [TaskStatus.DELIVERED]: "Terkirim",
};
