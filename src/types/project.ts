export enum ProjectStatus {
    ACTIVE = "ACTIVE",
    COMPLETED = "COMPLETED",
    ARCHIVED = "ARCHIVED",
}

export const ProjectStatusLabels: Record<ProjectStatus, string> = {
    [ProjectStatus.ACTIVE]: "Aktif",
    [ProjectStatus.COMPLETED]: "Selesai",
    [ProjectStatus.ARCHIVED]: "Arsip",
};

export interface Project {
    id: string;
    name: string;
    description: string | null;
    status: ProjectStatus;
    start_date: string | null;
    end_date: string | null;
    organization_id: string;
    division_id: string;
    department_id: string;
    created_at: string;
    updated_at: string;
    division: { id: string; name: string };
    department: { id: string; name: string };
    organization: { id: string; name: string };
    totalTasks: number;
    completedTasks: number;
    progressPercentage: number;
}

export interface ProjectDetail extends Project {
    tasks: any[]; // We can refine this if needed
}

export interface CreateProjectDto {
    name: string;
    description?: string;
    division_id: string;
    department_id: string;
    start_date?: string;
    end_date?: string;
}

export interface UpdateProjectDto {
    name?: string;
    description?: string | null;
    status?: ProjectStatus;
    start_date?: string | null;
    end_date?: string | null;
}
