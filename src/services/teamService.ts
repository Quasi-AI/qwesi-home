import type { ApiResponse, TeamMember,  CreateTeamMemberRequest } from '~/shared/types/team.types'

class TeamService {
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

  // Team Member methods
  async createTeamMember(memberData: CreateTeamMemberRequest): Promise<ApiResponse<TeamMember>> {
    return this.makeRequest<TeamMember>('/team-members', {
      method: 'POST',
      body: JSON.stringify(memberData),
    });
  }

  async getTeamMembers(sender?: string): Promise<ApiResponse<TeamMember[]>> {
    const queryParam = sender ? `?sender=${encodeURIComponent(sender)}` : '';
    return this.makeRequest<TeamMember[]>(`/team-members${queryParam}`);
  }

  async getTeamMemberById(id: string): Promise<ApiResponse<TeamMember>> {
    return this.makeRequest<TeamMember>(`/team-members/${id}`);
  }

  async updateTeamMember(id: string, memberData: Partial<TeamMember>): Promise<ApiResponse<TeamMember>> {
    return this.makeRequest<TeamMember>(`/team-members/${id}`, {
      method: 'PUT',
      body: JSON.stringify(memberData),
    });
  }

  async deleteTeamMember(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.makeRequest<{ message: string }>(`/team-members/${id}`, {
      method: 'DELETE',
    });
  }

  async updateTeamMemberStatus(
    id: string, 
    isActive: boolean
  ): Promise<ApiResponse<TeamMember>> {
    return this.makeRequest<TeamMember>(`/team-members/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    });
  }
}

export const teamService = new TeamService();