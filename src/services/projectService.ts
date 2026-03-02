import api from "@/lib/api";
import type { Project, CreateProjectDto, UpdateProjectDto, ProjectDetail } from "@/types/project";

export const projectService = {
    getAll: async (status?: string): Promise<Project[]> => {
        const response = await api.get("/projects", {
            params: { status },
        });
        return response.data.data;
    },

    getById: async (id: string): Promise<ProjectDetail> => {
        const response = await api.get(`/projects/${id}`);
        return response.data.data;
    },

    create: async (data: CreateProjectDto): Promise<Project> => {
        const response = await api.post("/projects", data);
        return response.data.data;
    },

    update: async (id: string, data: UpdateProjectDto): Promise<Project> => {
        const response = await api.patch(`/projects/${id}`, data);
        return response.data.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/projects/${id}`);
    },
};
