import api from "@/lib/api";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  assignee_id?: string;
  creator_id: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  assignee_id?: string;
  due_date?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: "todo" | "in_progress" | "done";
  priority?: "low" | "medium" | "high";
  assignee_id?: string;
  due_date?: string;
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
      assignee_id: userId,
    });
    return response.data.data || response.data;
  },
};
