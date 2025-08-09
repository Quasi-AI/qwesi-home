export interface TeamMember {
  _id: string;
  name: string;
  email: string;
  role: string;
  sender: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeamMemberRequest {
  name: string;
  email: string;
  role: string;
  sender: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}