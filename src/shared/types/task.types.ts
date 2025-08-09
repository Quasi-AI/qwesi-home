export interface Task {
  _id?: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  assignedTo?: string;
  tags?: string[];
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
}

export interface CreateTaskRequest {
  title: string;
  email: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  assignedTo?: string;
  tags?: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}