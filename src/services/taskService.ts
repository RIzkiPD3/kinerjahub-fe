import api from "@/lib/api";
import { TaskStatus } from "@/types/task";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: "low" | "medium" | "high";
  assigned_to?: string;
  creator_id: string;
  deadline?: string;
  story_point?: number;
  assignee?: {
    id: string;
    name: string;
    email: string;
  };
  department?: {
    id: string;
    name: string;
  };
  division?: {
    id: string;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  department_id: string;
  assigned_to?: string | null;
  deadline: string;
  story_point: number;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: "low" | "medium" | "high";
  assigned_to?: string | null;
  deadline?: string;
  story_point?: number;
}

export const taskService = {
  // Get all tasks (with role-based filtering)
  async getAll(): Promise<Task[]> {
    const response = await api.get("/tasks");
    // Handle both { data: [...] } and raw [...] formats
    return Array.isArray(response.data)
      ? response.data
      : response.data.data || [];
  },

  // Get single task
  async getById(id: string): Promise<Task> {
    const response = await api.get(`/tasks/${id}`);
    return response.data.data || response.data;
  },

  // Create task
  async create(data: CreateTaskDto): Promise<Task> {
    const response = await api.post("/tasks", data);
    return response.data.data || response.data;
  },

  // Update task - Per API.md uses PATCH
  async update(id: string, data: UpdateTaskDto): Promise<Task> {
    console.log("[taskService.update] id:", id);
    console.log("[taskService.update] payload:", JSON.stringify(data, null, 2));
    const response = await api.patch(`/tasks/${id}`, data);
    return response.data.data || response.data;
  },

  // Delete task
  async delete(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },

  // Assign task to user
  async assign(id: string, userId: string): Promise<Task> {
    const response = await api.patch(`/tasks/${id}/assign`, {
      assigned_to: userId,
    });
    return response.data.data || response.data;
  },
};
