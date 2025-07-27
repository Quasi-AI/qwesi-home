export interface DashboardSummary {
  jobs: number;
  activeTasks: number;
  people: number;
  productivity: number;
  changes?: {
    jobs: { value: number; period: string };
    activeTasks: { value: number; period: string };
    people: { value: number; period: string };
    productivity: { value: number; period: string };
  };
  recentTasks?: Array<{
    name: string;
    assignee: string;
    status: string;
    dueDate: string;
  }>;
  teamMembers?: Array<{
    name: string;
    role: string;
    status: string;
    lastActive: string;
    initials: string;
  }>;
}

export interface DashboardStats {
  jobs: number;
  activeTasks: number;
  people: number;
  productivity: number;
  changes: {
    jobs: { value: number; period: string };
    activeTasks: { value: number; period: string };
    people: { value: number; period: string };
    productivity: { value: number; period: string };
  };
}

export interface DashboardApiResponse {
  success: boolean;
  data: DashboardSummary;
  message: string;
}
