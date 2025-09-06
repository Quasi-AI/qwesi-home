// types/applications.ts

export type ApplicationStatus = 
  | 'submitted' 
  | 'under_review' 
  | 'interview_scheduled' 
  | 'interviewed' 
  | 'offered' 
  | 'rejected' 
  | 'withdrawn'

export type InterviewType = 'phone' | 'video' | 'in_person' | 'assessment'

export interface ApplicantDetails {
  firstName: string
  lastName: string
  email: string
  phone: string
  address?: string
  linkedin?: string
  portfolio?: string
}

export interface Experience {
  years: number
  description: string
}

export interface Resume {
  filename?: string
  originalName?: string
  url?: string
  firebaseFileName?: string
  uploadedAt?: Date | string
  path?: string // Legacy field
}

export interface InterviewDetails {
  scheduledDate?: Date | string
  interviewType?: InterviewType
  notes?: string
}

export interface ApplicationFormData {
  jobId: string
  applicantDetails: ApplicantDetails
  coverLetter?: string
  skills: string[]
  experience: Experience
}

export interface Application {
  _id: string
  jobId: string | Job
  userId: string | User
  applicantDetails: ApplicantDetails
  resume?: Resume
  coverLetter?: string
  skills: string[]
  experience: Experience
  status: ApplicationStatus
  submittedAt: Date | string
  lastUpdated: Date | string
  employerNotes?: string
  interviewDetails?: InterviewDetails
  applicationSource?: string
  emailSent?: boolean
  emailSentAt?: Date | string
  createdAt?: Date | string
  updatedAt?: Date | string
}

export interface Job {
  _id: string
  title: string
  employer: string
  location?: string
  sector?: string
  experience_level?: string
  salary?: string
  field?: string
  experience_length?: string
  job_description: string
  qualifications?: string
  email: string
  url?: string
  posted?: Date | string
  created_at?: Date | string
  isActive?: boolean
  employerId?: string
}

export interface User {
  _id: string
  name: string
  email: string
  role?: 'user' | 'employer' | 'admin'
  profile?: {
    phone?: string
    address?: string
    linkedin?: string
    portfolio?: string
    bio?: string
  }
  isVerified?: boolean
  createdAt?: Date | string
  lastLogin?: Date | string
}

export interface ApplicationStats {
  total: number
  byStatus: Record<ApplicationStatus, number>
  responseRate: number
}

export interface Pagination {
  currentPage: number
  totalPages: number
  totalItems: number
  hasNext: boolean
  hasPrev: boolean
}

export interface ApplicationResponse {
  success: boolean
  message?: string
  data?: Application
  error?: string
}

export interface PaginationResponse<T> {
  success: boolean
  data: T[]
  pagination: Pagination
  message?: string
  error?: string
}

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Form validation interfaces
export interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  address?: string
  linkedin?: string
  portfolio?: string
  coverLetter?: string
  skills?: string
  experience?: string
  resume?: string
  [key: string]: string | undefined
}

// Component prop interfaces
export interface JobCardProps {
  job: Job
  applied?: boolean
  onApply?: (job: Job) => void
  onSave?: (job: Job) => void
  onViewDetails?: (job: Job) => void
}

export interface ApplicationModalProps {
  show: boolean
  job?: Job
  onClose: () => void
  onSubmit: (data: ApplicationFormData, file?: File) => void
  loading?: boolean
  errors?: FormErrors
}

export interface ApplicationListProps {
  applications: Application[]
  loading?: boolean
  onWithdraw?: (applicationId: string) => void
  onViewDetails?: (application: Application) => void
}

// Filter and search interfaces
export interface JobFilters {
  location?: string
  sector?: string
  experience_level?: string
  salary_min?: number
  salary_max?: number
  posted_within?: 'day' | 'week' | 'month' | 'quarter'
}

export interface ApplicationFilters {
  status?: ApplicationStatus
  jobTitle?: string
  employer?: string
  dateFrom?: Date | string
  dateTo?: Date | string
}

export interface SearchParams {
  query?: string
  filters?: JobFilters
  sortBy?: 'newest' | 'oldest' | 'title' | 'company' | 'salary'
  page?: number
  limit?: number
}

// Status color mapping
export type StatusColorMap = Record<ApplicationStatus, string>

// Email template data
export interface EmailTemplateData {
  applicantName: string
  jobTitle: string
  companyName: string
  jobLocation: string
  applicationStatus: string
  statusColor: string
  statusTextColor: string
  statusMessage: string
  nextSteps: string
  dashboardUrl: string
  updateDate: string
  year: string
  unsubscribeUrl: string
  employerNotes?: string
  interviewDate?: string
  interviewType?: string
  interviewNotes?: string
}

// File upload interfaces
export interface UploadResult {
  success: boolean
  url?: string
  filename?: string
  error?: string
}

export interface FileValidation {
  maxSize: number
  allowedTypes: string[]
  required?: boolean
}

// Dashboard statistics
export interface DashboardStats {
  totalApplications: number
  pendingReviews: number
  scheduledInterviews: number
  receivedOffers: number
  successRate: number
  averageResponseTime: string
}

// Notification interfaces
export interface ApplicationNotification {
  id: string
  type: 'status_update' | 'interview_scheduled' | 'offer_received'
  applicationId: string
  message: string
  read: boolean
  createdAt: Date | string
}

// Export default type for common usage
export type { Application as DefaultApplication }