import type { 
  ApplicationFormData, 
  Application, 
  ApplicationResponse, 
  ApplicationStats, 
  PaginationResponse,
  ApplicationStatus,
  ValidationResult 
} from '@/shared/types/application.types'
import { API_ROUTES } from '@/shared/constants/api-routes'
import { useAuthStore } from '@/features/auth/stores/auth.store'
const authStore = useAuthStore()


export interface ApplicationFilters {
  status?: ApplicationStatus
  jobTitle?: string
  employer?: string
}

export interface FetchApplicationsOptions {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  filters?: ApplicationFilters
}

export const useApplications = () => {
  const config = useRuntimeConfig()
  
  // Get base URL from your API routes constant

  const submitApplication = async (formData: FormData): Promise<ApplicationResponse> => {
    try {
      const response = await $fetch<ApplicationResponse>(`${API_ROUTES.BASE_URL}/applications/submit`, {
        method: 'POST',
        body: formData,
        headers: {
        'Authorization': `Bearer ${authStore.getToken}`
        }
      })

      if (response.success) {
        return { success: true, data: response.data }
      } else {
        throw new Error(response.message || 'Failed to submit application')
      }
    } catch (error) {
      console.error('Error submitting application:', error)
      throw error
    }
  }

  const getUserApplications = async (
    userId: string, 
    options: FetchApplicationsOptions = {}
  ): Promise<PaginationResponse<Application>> => {
    try {
      const queryParams = {
        page: options.page || 1,
        limit: options.limit || 50,
        sortBy: options.sortBy || 'submittedAt',
        sortOrder: options.sortOrder || 'desc' as const,
        ...options.filters
      }

      const response = await $fetch<PaginationResponse<Application>>(`${API_ROUTES.BASE_URL}/applications/user/${userId}`, {
        query: queryParams
      })

      if (response.success) {
        return { 
          success: true, 
          data: response.data, 
          pagination: response.pagination 
        }
      } else {
        throw new Error(response.message || 'Failed to fetch applications')
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
      throw error
    }
  }

  const getApplicationDetails = async (applicationId: string): Promise<ApplicationResponse> => {
    try {
      const response = await $fetch<ApplicationResponse>(`${API_ROUTES.BASE_URL}/applications/${applicationId}`)

      if (response.success) {
        return { success: true, data: response.data }
      } else {
        throw new Error(response.message || 'Failed to fetch application details')
      }
    } catch (error) {
      console.error('Error fetching application details:', error)
      throw error
    }
  }

  const withdrawApplication = async (applicationId: string): Promise<{ success: boolean }> => {
    try {
      const response = await $fetch<{ success: boolean; message: string }>(`${API_ROUTES.BASE_URL}/applications/${applicationId}/withdraw`, {
        method: 'PUT'
      })

      if (response.success) {
        return { success: true }
      } else {
        throw new Error(response.message || 'Failed to withdraw application')
      }
    } catch (error: any) {
      console.error('Error withdrawing application:', error)
      throw error
    }
  }

  const getApplicationStats = async (userId: string): Promise<{ success: boolean; data: ApplicationStats }> => {
    try {
      const response = await $fetch<{ success: boolean; data: ApplicationStats; message?: string }>(`${API_ROUTES.BASE_URL}/applications/stats/${userId}`)

      if (response.success) {
        return { success: true, data: response.data }
      } else {
        throw new Error(response.message || 'Failed to fetch application statistics')
      }
    } catch (error) {
      console.error('Error fetching application stats:', error)
      throw error
    }
  }

  // Utility functions
const formatApplicationData = (formData: ApplicationFormData, resumeFile?: File): FormData => {
  const form = new FormData()
  
  // Add job ID
  form.append('jobId', formData.jobId)
  
  // Send applicantDetails as a JSON string
  form.append('applicantDetails', JSON.stringify(formData.applicantDetails))
  
  // Add other fields
  if (formData.coverLetter) {
    form.append('coverLetter', formData.coverLetter)
  }
  
  // Add skills as JSON string
  if (formData.skills.length > 0) {
    form.append('skills', JSON.stringify(formData.skills))
  }
  
  // Add experience as JSON string
  if (formData.experience.years || formData.experience.description) {
    form.append('experience', JSON.stringify(formData.experience))
  }
  
  // Add resume file
  if (resumeFile) {
    form.append('resume', resumeFile)
  }

  return form
}

  const getStatusColor = (status: ApplicationStatus): string => {
    const colors: Record<ApplicationStatus, string> = {
      'submitted': 'bg-blue-100 text-blue-800',
      'under_review': 'bg-yellow-100 text-yellow-800',
      'interview_scheduled': 'bg-purple-100 text-purple-800',
      'interviewed': 'bg-indigo-100 text-indigo-800',
      'offered': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'withdrawn': 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (status: ApplicationStatus): string => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const validateApplicationForm = (formData: ApplicationFormData, resumeFile?: File): ValidationResult => {
    const errors: Record<string, string> = {}
    
    // Validate required fields
    if (!formData.applicantDetails.firstName?.trim()) {
      errors.firstName = 'First name is required'
    }

    if (!formData.applicantDetails.lastName?.trim()) {
      errors.lastName = 'Last name is required'
    }

    if (!formData.applicantDetails.email?.trim()) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.applicantDetails.email)) {
      errors.email = 'Please enter a valid email'
    }

    if (!formData.applicantDetails.phone?.trim()) {
      errors.phone = 'Phone number is required'
    }

    // Validate file if uploaded
    if (resumeFile) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(resumeFile.type)) {
        errors.resume = 'Please upload a PDF, DOC, or DOCX file'
      }

      if (resumeFile.size > 5 * 1024 * 1024) { // 5MB
        errors.resume = 'File size must be less than 5MB'
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  return {
    submitApplication,
    getUserApplications,
    getApplicationDetails,
    withdrawApplication,
    getApplicationStats,
    formatApplicationData,
    getStatusColor,
    getStatusText,
    validateApplicationForm
  }
}