
import type { ApiResponse, TeamMember, Task, CreateTaskRequest } from '~/shared/types/task.types'
class TaskService {
  private baseUrl = 'https://dark-caldron-448714-u5.appspot.com';

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || `HTTP error! status: ${response.status}`,
          error: data.error,
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Network error occurred',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Create a new task
  async createTask(taskData: CreateTaskRequest): Promise<ApiResponse<Task>> {
    return this.makeRequest<Task>('/create-task', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  // Get all tasks
  async getTasks(): Promise<ApiResponse<Task[]>> {
    return this.makeRequest<Task[]>('/tasks');
  }

  // Get task by ID
  async getTaskById(id: string): Promise<ApiResponse<Task>> {
    return this.makeRequest<Task>(`/tasks/${id}`);
  }

  // Update task
  async updateTask(id: string, taskData: Partial<Task>): Promise<ApiResponse<Task>> {
    return this.makeRequest<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  }

  // Delete task
  async deleteTask(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.makeRequest<{ message: string }>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  // Get team members
  async getTeamMembers(): Promise<ApiResponse<TeamMember[]>> {
    return this.makeRequest<TeamMember[]>('/team-members');
  }

  // Update task status
  async updateTaskStatus(
    id: string, 
    status: Task['status']
  ): Promise<ApiResponse<Task>> {
    return this.makeRequest<Task>(`/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Get tasks by status
  async getTasksByStatus(status: Task['status']): Promise<ApiResponse<Task[]>> {
    return this.makeRequest<Task[]>(`/tasks?status=${status}`);
  }

  // Get tasks by assignee
  async getTasksByAssignee(assigneeId: string): Promise<ApiResponse<Task[]>> {
    return this.makeRequest<Task[]>(`/tasks?assignedTo=${assigneeId}`);
  }

  // Search tasks
  async searchTasks(query: string): Promise<ApiResponse<Task[]>> {
    return this.makeRequest<Task[]>(`/tasks/search?q=${encodeURIComponent(query)}`);
  }
}

export const taskService = new TaskService();