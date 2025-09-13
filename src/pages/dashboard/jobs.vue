<!-- pages/dashboard/jobs.vue -->
<template>
  <div class="dashboard-container">
    <MessagePopup ref="alertRef" />
    <Sidebar :user="user" />

    <!-- Main Content Area -->
    <div class="main-content">
      <!-- Header Section -->
      <header class="modern-header">
        <div class="header-backdrop"></div>
        <div class="header-content">
          <div class="header-info">
            <div class="welcome-section">
              <h1 class="dashboard-title">Job Opportunities</h1>
              <p class="welcome-message">
                Discover your next <span class="user-highlight">career opportunity</span>
              </p>
            </div>
          </div>
          
          <div class="header-actions">
            <div class="search-container">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search jobs..."
                class="search-input"
                @input="handleSearch"
              />
              <Search class="search-icon" />
            </div>

            <button @click="showFilters = !showFilters" class="filter-toggle">
              <Filter class="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </header>

      <!-- Filters Panel -->
      <div v-if="showFilters" class="filters-panel">
        <div class="filters-content">
          <div class="filters-grid">
            <!-- Country Filter -->
            <div class="filter-group">
              <label class="filter-label">Country</label>
              <select v-model="filters.country" @change="applyFilters" class="filter-select">
                <option value="">All Countries</option>
                <option v-for="country in uniqueCountries" :key="country" :value="country">
                  {{ country }}
                </option>
              </select>
            </div>

            <!-- Location Filter -->
            <div class="filter-group">
              <label class="filter-label">Location</label>
              <select v-model="filters.location" @change="applyFilters" class="filter-select">
                <option value="">All Locations</option>
                <option v-for="location in uniqueLocations" :key="location" :value="location">
                  {{ location }}
                </option>
              </select>
            </div>

            <!-- Sector Filter -->
            <div class="filter-group">
              <label class="filter-label">Sector</label>
              <select v-model="filters.sector" @change="applyFilters" class="filter-select">
                <option value="">All Sectors</option>
                <option v-for="sector in uniqueSectors" :key="sector" :value="sector">
                  {{ sector }}
                </option>
              </select>
            </div>

            <!-- Experience Filter -->
            <div class="filter-group">
              <label class="filter-label">Experience Level</label>
              <select v-model="filters.experience_level" @change="applyFilters" class="filter-select">
                <option value="">All Levels</option>
                <option v-for="level in uniqueExperienceLevels" :key="level" :value="level">
                  {{ level }}
                </option>
              </select>
            </div>

            <!-- Clear Filters -->
            <div class="filter-actions">
              <button @click="clearFilters" class="clear-filters-btn">
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats and Sort Bar -->
      <div class="stats-bar">
        <div class="stats-info">
          <span class="job-count">
            {{ filteredJobs.length }} job{{ filteredJobs.length !== 1 ? 's' : '' }} found
          </span>
          <div class="divider"></div>
          <div class="update-info">
            <Clock class="w-4 h-4" />
            <span>Updated {{ new Date().toLocaleDateString() }}</span>
          </div>
        </div>
        
        <div class="sort-controls">
          <span class="sort-label">Sort by:</span>
          <select v-model="sortBy" @change="applySorting" class="sort-select">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Job Title A-Z</option>
            <option value="company">Company A-Z</option>
            <option value="country">Country A-Z</option>
          </select>
        </div>
      </div>

      <!-- Main Content -->
      <main class="dashboard-main">
        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p class="loading-text">Discovering opportunities...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <div class="error-icon">
            <X class="w-8 h-8" />
          </div>
          <h3 class="text-lg font-bold text-red-700 mb-2">Error Loading Jobs</h3>
          <p class="error-message mb-4">{{ error }}</p>
          <button @click="fetchJobs" class="retry-btn">
            Try Again
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredJobs.length === 0" class="empty-state">
          <div class="empty-icon">
            <Briefcase class="w-12 h-12 text-slate-400" />
          </div>
          <h3 class="empty-title">No Jobs Found</h3>
          <p class="empty-description">
            {{ hasActiveFilters ? 'Try adjusting your search criteria or filters to find more opportunities.' : 'No job listings available at the moment. Check back soon for new opportunities!' }}
          </p>
          <button v-if="hasActiveFilters" @click="clearAllFilters" class="empty-action-btn">
            Clear All Filters
          </button>
        </div>

        <!-- Jobs Content -->
        <div v-else class="jobs-content">
          <!-- User Applications Summary -->
          <div v-if="userApplications.length > 0" class="applications-summary">
            <div class="summary-card">
              <div class="summary-header">
                <Briefcase class="w-5 h-5 text-blue-600" />
                <span class="summary-title">Your Applications</span>
              </div>
              <div class="summary-stats">
                <div class="stat-item">
                  <span class="stat-number">{{ userApplications.length }}</span>
                  <span class="stat-label">Total Applied</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">{{ userApplications.filter(app => app.status === 'under_review').length }}</span>
                  <span class="stat-label">Under Review</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">{{ userApplications.filter(app => app.status === 'interview_scheduled').length }}</span>
                  <span class="stat-label">Interviews</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Jobs Grid -->
          <div class="jobs-grid">
            <div
              v-for="job in paginatedJobs"
              :key="job._id"
              class="job-card group"
              @click="openJobDetailsModal(job)"
            >
              <div class="card-bg"></div>
              <div class="card-glow"></div>
              
              <div class="card-content">
                <!-- Job Header -->
                <div class="job-header">
                  <div class="job-main-info">
                    <h3 class="job-title">{{ job.title || 'Untitled Position' }}</h3>
                    <p class="company-name">{{ job.employer || 'Company Name' }}</p>
                  </div>
                  <div v-if="job.salary" class="salary-badge">
                    {{ job.salary }}
                  </div>
                </div>

                <!-- Job Details -->
                <div class="job-details">
                  <div v-if="job.location" class="detail-item">
                    <MapPin class="detail-icon" />
                    <span>{{ job.location }}</span>
                    <span 
                      v-if="extractCountryFromLocation(job.location)" 
                      :class="['country-badge', getCountryBadgeClass(extractCountryFromLocation(job.location))]"
                    >
                      {{ extractCountryFromLocation(job.location) }}
                    </span>
                  </div>

                  <div v-if="job.sector" class="detail-item">
                    <Building class="detail-icon" />
                    <span>{{ job.sector }}</span>
                  </div>

                  <div v-if="job.experience_level" class="detail-item">
                    <Zap class="detail-icon" />
                    <span>{{ job.experience_level }}</span>
                  </div>

                  <div v-if="job.posted" class="detail-item">
                    <Clock class="detail-icon" />
                    <span>Posted {{ formatDate(job.posted) }}</span>
                  </div>
                </div>

                <!-- Job Description -->
                <div v-if="job.job_description" class="job-description">
                  <p class="line-clamp-3">{{ job.job_description }}</p>
                </div>

                <!-- Job Footer -->
                <div class="job-footer" @click.stop>
                  <button @click="openJobDetailsModal(job)" class="view-details-btn">
                    <span>View Details</span>
                    <ArrowRight class="w-4 h-4" />
                  </button>
                  
                  <div class="job-actions">
                    <button @click="saveJob(job)" :class="['save-btn', { saved: savedJobs.includes(job._id) }]">
                      <Heart :fill="savedJobs.includes(job._id) ? 'currentColor' : 'none'" class="w-4 h-4" />
                    </button>
                    
                    <button 
                      @click="applyToJob(job)" 
                      :class="hasAppliedToJob(job._id) ? 'applied-btn' : 'apply-btn'"
                      :disabled="hasAppliedToJob(job._id)"
                    >
                      {{ getApplyButtonText(job) }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="filteredJobs.length > jobsPerPage" class="pagination-container">
            <div class="pagination-info">
              Showing {{ ((currentPage - 1) * jobsPerPage) + 1 }} to {{ Math.min(currentPage * jobsPerPage, filteredJobs.length) }} of {{ filteredJobs.length }} jobs
            </div>
            
            <div class="pagination-controls">
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="pagination-btn"
              >
                <ChevronLeft class="w-4 h-4" />
                <span>Previous</span>
              </button>
              
              <div class="pagination-numbers">
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="currentPage = page"
                  :class="['page-btn', { active: page === currentPage }]"
                >
                  {{ page }}
                </button>
              </div>
              
              <button
                @click="currentPage++"
                :disabled="currentPage === totalPages"
                class="pagination-btn"
              >
                <span>Next</span>
                <ChevronRight class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Job Details Modal -->
    <div v-if="viewingJob" class="job-details-modal-overlay" @click="closeJobDetailsModal">
      <div class="job-details-modal" @click.stop>
        <div class="modal-backdrop"></div>
        
        <div class="modal-header">
          <div class="modal-title-section">
            <h3 class="modal-title">{{ viewingJob.title || 'Job Details' }}</h3>
            <p class="modal-company">{{ viewingJob.employer || 'Company' }}</p>
            <div class="title-decoration"></div>
          </div>
          <button @click="closeJobDetailsModal" class="modal-close">
            <X class="w-6 h-6" />
          </button>
        </div>

        <div class="modal-content">
          <div class="modal-scroll-area">
            <div class="job-details-content space-y-6">
              
              <!-- Basic Info -->
              <div class="details-section">
                <h4 class="section-title">Job Information</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-if="viewingJob.location" class="info-item">
                    <MapPin class="info-icon" />
                    <span class="info-label">Location:</span>
                    <div class="flex items-center space-x-2">
                      <span class="info-value">{{ viewingJob.location }}</span>
                      <span 
                        v-if="extractCountryFromLocation(viewingJob.location)" 
                        :class="['country-badge', getCountryBadgeClass(extractCountryFromLocation(viewingJob.location))]"
                      >
                        {{ extractCountryFromLocation(viewingJob.location) }}
                      </span>
                    </div>
                  </div>
                  <div v-if="viewingJob.sector" class="info-item">
                    <Building class="info-icon" />
                    <span class="info-label">Sector:</span>
                    <span class="info-value">{{ viewingJob.sector }}</span>
                  </div>
                  <div v-if="viewingJob.experience_level" class="info-item">
                    <Zap class="info-icon" />
                    <span class="info-label">Experience Level:</span>
                    <span class="info-value">{{ viewingJob.experience_level }}</span>
                  </div>
                  <div v-if="viewingJob.salary" class="info-item">
                    <span class="info-icon">💰</span>
                    <span class="info-label">Salary:</span>
                    <span class="info-value">{{ viewingJob.salary }}</span>
                  </div>
                </div>
              </div>

              <!-- Job Description -->
              <div v-if="viewingJob.job_description" class="details-section">
                <h4 class="section-title">Job Description</h4>
                <div class="description-content">
                  <p class="whitespace-pre-line">{{ viewingJob.job_description }}</p>
                </div>
              </div>

              <!-- Additional Details -->
              <div class="details-section">
                <h4 class="section-title">Additional Information</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-if="viewingJob.field" class="info-item">
                    <span class="info-label">Field:</span>
                    <span class="info-value">{{ viewingJob.field }}</span>
                  </div>
                  <div v-if="viewingJob.experience_length" class="info-item">
                    <span class="info-label">Experience Required:</span>
                    <span class="info-value">{{ viewingJob.experience_length }}</span>
                  </div>
                  <div v-if="viewingJob.posted" class="info-item">
                    <Clock class="info-icon" />
                    <span class="info-label">Posted:</span>
                    <span class="info-value">{{ formatDate(viewingJob.posted) }}</span>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="details-actions">
                <button @click="closeJobDetailsModal" class="btn-secondary">
                  Close
                </button>
                <button
                  @click="applyToJob(viewingJob)"
                  :class="hasAppliedToJob(viewingJob._id) ? 'applied-btn' : 'btn-primary'"
                  :disabled="hasAppliedToJob(viewingJob._id)"
                >
                  {{ getApplyButtonText(viewingJob) }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Application Modal -->
    <div v-if="showApplicationModal" class="application-modal-overlay" @click="closeApplicationModal">
      <div class="application-modal" @click.stop>
        <div class="modal-backdrop"></div>
        
        <div class="modal-header">
          <div class="modal-title-section">
            <h3 class="modal-title">Apply for Position</h3>
            <p class="modal-company">{{ selectedJob?.title || 'Position' }} at {{ selectedJob?.employer || 'Company' }}</p>
            <div class="title-decoration"></div>
          </div>
          <button @click="closeApplicationModal" class="modal-close">
            <X class="w-6 h-6" />
          </button>
        </div>

        <div class="modal-content">
          <div class="modal-scroll-area">
            <form @submit.prevent="submitApplication" class="space-y-6">
              
              <!-- Personal Information Section -->
              <div class="form-section">
                <h4 class="section-title">
                  <User class="w-5 h-5 text-blue-600" />
                  Personal Information
                </h4>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="form-group">
                    <label class="form-label">First Name *</label>
                    <input
                      v-model="applicationForm.applicantDetails.firstName"
                      type="text"
                      class="form-input"
                      :class="{ 'error': applicationErrors.firstName }"
                      placeholder="Enter your first name"
                    />
                    <span v-if="applicationErrors.firstName" class="error-message">
                      {{ applicationErrors.firstName }}
                    </span>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Last Name *</label>
                    <input
                      v-model="applicationForm.applicantDetails.lastName"
                      type="text"
                      class="form-input"
                      :class="{ 'error': applicationErrors.lastName }"
                      placeholder="Enter your last name"
                    />
                    <span v-if="applicationErrors.lastName" class="error-message">
                      {{ applicationErrors.lastName }}
                    </span>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Email Address *</label>
                    <input
                      v-model="applicationForm.applicantDetails.email"
                      type="email"
                      class="form-input"
                      :class="{ 'error': applicationErrors.email }"
                      placeholder="Enter your email"
                    />
                    <span v-if="applicationErrors.email" class="error-message">
                      {{ applicationErrors.email }}
                    </span>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Phone Number *</label>
                    <input
                      v-model="applicationForm.applicantDetails.phone"
                      type="tel"
                      class="form-input"
                      :class="{ 'error': applicationErrors.phone }"
                      placeholder="Enter your phone number"
                    />
                    <span v-if="applicationErrors.phone" class="error-message">
                      {{ applicationErrors.phone }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Resume Upload Section -->
              <div class="form-section">
                <h4 class="section-title">
                  <FileText class="w-5 h-5 text-blue-600" />
                  Resume/CV
                </h4>
                
                <div class="form-group">
                  <label class="form-label">Upload Resume *</label>
                  <div class="file-upload-area">
                    <input
                      type="file"
                      id="resume-upload"
                      accept=".pdf,.doc,.docx"
                      @change="handleFileUpload"
                      class="hidden"
                    />
                    <label for="resume-upload" class="file-upload-label">
                      <Upload class="w-8 h-8 text-slate-400 mb-2" />
                      <span class="block text-sm font-medium text-slate-700 mb-1">
                        {{ resumeFile?.name || 'Click to upload resume' }}
                      </span>
                      <span class="text-xs text-slate-500">
                        PDF, DOC, or DOCX (Max 5MB)
                      </span>
                    </label>
                  </div>
                  <span v-if="applicationErrors.resume" class="error-message">
                    {{ applicationErrors.resume }}
                  </span>
                </div>
              </div>

              <!-- Skills Section -->
              <div class="form-section">
                <h4 class="section-title">
                  <Zap class="w-5 h-5 text-blue-600" />
                  Skills
                </h4>
                
                <div class="form-group">
                  <label class="form-label">Add Skills</label>
                  <div class="flex space-x-2">
                    <input
                      v-model="newSkill"
                      type="text"
                      class="form-input flex-1"
                      placeholder="Enter a skill"
                      @keypress.enter.prevent="addSkill"
                    />
                    <button
                      type="button"
                      @click="addSkill"
                      class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus class="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div v-if="applicationForm.skills.length > 0" class="flex flex-wrap gap-2 mt-3">
                    <span
                      v-for="(skill, index) in applicationForm.skills"
                      :key="index"
                      class="skill-tag"
                    >
                      {{ skill }}
                      <button
                        type="button"
                        @click="removeSkill(index)"
                        class="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X class="w-3 h-3" />
                      </button>
                    </span>
                  </div>
                </div>
              </div>

              <!-- Cover Letter Section -->
              <div class="form-section">
                <h4 class="section-title">
                  <MessageSquare class="w-5 h-5 text-blue-600" />
                  Cover Letter
                </h4>
                
                <div class="form-group">
                  <label class="form-label">Cover Letter (Optional)</label>
                  <textarea
                    v-model="applicationForm.coverLetter"
                    rows="6"
                    class="form-input"
                    placeholder="Write a personalized cover letter for this position..."
                    maxlength="5000"
                  ></textarea>
                  <div class="text-xs text-slate-500 mt-1 text-right">
                    {{ applicationForm.coverLetter.length }}/5000 characters
                  </div>
                </div>
              </div>

              <!-- Form Actions -->
              <div class="form-actions">
                <button type="button" @click="closeApplicationModal" class="btn-secondary" :disabled="applicationLoading">
                  Cancel
                </button>
                
                <button type="submit" class="btn-primary" :disabled="applicationLoading">
                  <div v-if="applicationLoading" class="flex items-center space-x-2">
                    <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </div>
                  <div v-else class="flex items-center space-x-2">
                    <Send class="w-4 h-4" />
                    <span>Submit Application</span>
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Import statements
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import { useApplications } from '@/shared/composables/useApplications'
import MessagePopup from '~/shared/components/message/MessagePopup.vue'
import Sidebar from '@/features/dashboard/components/dashboard-sidebar.vue'
import { API_ROUTES } from '@/shared/constants/api-routes'

import {
  Search, Filter, Clock, X, Briefcase, MapPin, Building, Zap, 
  ArrowRight, Heart, User, FileText, Upload, Plus, MessageSquare, 
  Send, ChevronLeft, ChevronRight
} from 'lucide-vue-next'

// Types
interface Job {
  _id: string;
  title?: string;
  employer?: string;
  location?: string;
  country?: string;
  sector?: string;
  experience_level?: string;
  salary?: string;
  job_description?: string;
  field?: string;
  experience_length?: string;
  posted?: string;
  created_at?: string;
}

interface Application {
  _id: string;
  jobId: string;
  status: string;
}

interface ApplicationFormData {
  jobId: string;
  applicantDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    linkedin: string;
    portfolio: string;
  };
  coverLetter: string;
  skills: string[];
  experience: {
    years: number;
    description: string;
  };
}

// Composables
const authStore = useAuthStore()
const applicationsComposable = useApplications()
const alertRef = ref<InstanceType<typeof MessagePopup> | null>(null)
const user = computed(() => authStore.getUser)

// State
const loading = ref<boolean>(true)
const error = ref<string | null>(null)
const jobs = ref<Job[]>([])
const selectedJob = ref<Job | null>(null)
const viewingJob = ref<Job | null>(null)
const showFilters = ref<boolean>(false)
const savedJobs = ref<string[]>([])
const searchQuery = ref<string>('')
const sortBy = ref<string>('newest')
const currentPage = ref<number>(1)
const jobsPerPage = ref<number>(12)

// Filters
const filters = ref({
  location: '',
  country: '',
  sector: '',
  experience_level: ''
})

// Application form
const showApplicationModal = ref<boolean>(false)
const applicationLoading = ref<boolean>(false)
const applicationForm = ref<ApplicationFormData>({
  jobId: '',
  applicantDetails: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    portfolio: ''
  },
  coverLetter: '',
  skills: [],
  experience: {
    years: 0,
    description: ''
  }
})
const resumeFile = ref<File | null>(null)
const newSkill = ref<string>('')
const applicationErrors = ref<Record<string, string>>({})
const userApplications = ref<Application[]>([])

// Helper functions
const extractCountryFromLocation = (location: string): string => {
  if (!location) return ''
  
  const normalizedLocation = location.toLowerCase().trim()
  const countryMap: Record<string, string> = {
    'ghana': 'Ghana', 'nigeria': 'Nigeria', 'kenya': 'Kenya', 'south africa': 'South Africa',
    'united kingdom': 'United Kingdom', 'uk': 'United Kingdom', 'england': 'United Kingdom',
    'united states': 'United States', 'usa': 'United States', 'us': 'United States',
    'canada': 'Canada', 'germany': 'Germany', 'france': 'France', 'australia': 'Australia',
    'singapore': 'Singapore', 'uae': 'United Arab Emirates', 'dubai': 'United Arab Emirates',
    'remote': 'Remote', 'worldwide': 'Worldwide', 'global': 'Global'
  }
  
  for (const [key, value] of Object.entries(countryMap)) {
    if (normalizedLocation.includes(key)) {
      return value
    }
  }
  
  const parts = location.split(',').map(part => part.trim())
  if (parts.length >= 2) {
    const lastPart = parts[parts.length - 1]
    return lastPart.charAt(0).toUpperCase() + lastPart.slice(1).toLowerCase()
  }
  
  return ''
}

const getCountryBadgeClass = (country: string): string => {
  const specialCountries = ['Remote', 'Worldwide', 'Global', 'International']
  return specialCountries.includes(country) ? 'badge-special' : 'badge-country'
}

const formatDate = (dateString: string): string => {
  if (!dateString) return ''
  
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`
    
    return date.toLocaleDateString()
  } catch {
    return dateString
  }
}

// Computed properties
const uniqueCountries = computed((): string[] => {
  const countries = jobs.value
    .map(job => extractCountryFromLocation(job.location || ''))
    .filter(Boolean) as string[]
  
  return [...new Set(countries)].sort((a, b) => {
    const specialOrder = ['Remote', 'Worldwide', 'Global']
    const aSpecial = specialOrder.indexOf(a)
    const bSpecial = specialOrder.indexOf(b)
    
    if (aSpecial !== -1 && bSpecial !== -1) return aSpecial - bSpecial
    if (aSpecial !== -1) return -1
    if (bSpecial !== -1) return 1
    
    return a.localeCompare(b)
  })
})

const uniqueLocations = computed((): string[] => {
  const locations = jobs.value.map(job => job.location).filter(Boolean) as string[]
  return [...new Set(locations)].sort()
})

const uniqueSectors = computed((): string[] => {
  const sectors = jobs.value.map(job => job.sector).filter(Boolean) as string[]
  return [...new Set(sectors)].sort()
})

const uniqueExperienceLevels = computed((): string[] => {
  const levels = jobs.value.map(job => job.experience_level).filter(Boolean) as string[]
  return [...new Set(levels)].sort()
})

const hasActiveFilters = computed((): boolean => {
  return !!(searchQuery.value || Object.values(filters.value).some(f => f))
})

const filteredJobs = computed((): Job[] => {
  let filtered = jobs.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(job =>
      (job.title?.toLowerCase() || '').includes(query) ||
      (job.employer?.toLowerCase() || '').includes(query) ||
      (job.job_description?.toLowerCase() || '').includes(query) ||
      (job.location?.toLowerCase() || '').includes(query) ||
      (job.sector?.toLowerCase() || '').includes(query)
    )
  }

  if (filters.value.country) {
    filtered = filtered.filter(job => {
      const jobCountry = extractCountryFromLocation(job.location || '')
      return jobCountry === filters.value.country
    })
  }

  if (filters.value.location) {
    filtered = filtered.filter(job => job.location === filters.value.location)
  }

  if (filters.value.sector) {
    filtered = filtered.filter(job => job.sector === filters.value.sector)
  }

  if (filters.value.experience_level) {
    filtered = filtered.filter(job => job.experience_level === filters.value.experience_level)
  }

  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'newest':
        return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
      case 'oldest':
        return new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime()
      case 'title':
        return (a.title || '').localeCompare(b.title || '')
      case 'company':
        return (a.employer || '').localeCompare(b.employer || '')
      case 'country':
        const aCountry = extractCountryFromLocation(a.location || '')
        const bCountry = extractCountryFromLocation(b.location || '')
        return aCountry.localeCompare(bCountry)
      default:
        return 0
    }
  })

  return filtered
})

const totalPages = computed((): number => {
  return Math.max(1, Math.ceil(filteredJobs.value.length / jobsPerPage.value))
})

const paginatedJobs = computed((): Job[] => {
  const start = (currentPage.value - 1) * jobsPerPage.value
  const end = start + jobsPerPage.value
  return filteredJobs.value.slice(start, end)
})

const visiblePages = computed((): number[] => {
  const pages: number[] = []
  const maxVisible = 5
  let startPage = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let endPage = Math.min(totalPages.value, startPage + maxVisible - 1)

  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return pages
})

// API methods
const fetchJobs = async (): Promise<void> => {
  loading.value = true
  error.value = null
  
  try {
    const queryParams = new URLSearchParams()
    
    if (searchQuery.value) queryParams.append('search', searchQuery.value)
    if (filters.value.country) queryParams.append('country', filters.value.country)
    if (filters.value.location) queryParams.append('location', filters.value.location)
    if (filters.value.sector) queryParams.append('sector', filters.value.sector)
    if (filters.value.experience_level) queryParams.append('experience_level', filters.value.experience_level)

    const url = `${API_ROUTES.BASE_URL}getjobs${queryParams.toString() ? '?' + queryParams.toString() : ''}`
    const response = await $fetch<any>(url)
    
    if (response.success) {
      jobs.value = response.data || []
    } else {
      throw new Error('Failed to fetch jobs')
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to fetch jobs'
    alertRef.value?.error('Failed to load job opportunities')
  } finally {
    loading.value = false
  }
}

const fetchUserApplications = async (): Promise<void> => {
  if (!user.value?.id) return

  try {
    const response = await applicationsComposable.getUserApplications(user.value.id, {
      page: 1,
      limit: 100,
      sortBy: 'submittedAt',
      sortOrder: 'desc'
    })

    if (response.success) {
      userApplications.value = response.data || []
    }
  } catch (error: any) {
    console.error('Error fetching applications:', error)
  }
}

// Event handlers
const handleSearch = (): void => {
  currentPage.value = 1
  fetchJobs()
}

const applyFilters = (): void => {
  currentPage.value = 1
  fetchJobs()
}

const applySorting = (): void => {
  currentPage.value = 1
}

const clearFilters = (): void => {
  filters.value = {
    location: '',
    country: '',
    sector: '',
    experience_level: ''
  }
  currentPage.value = 1
  fetchJobs()
}

const clearAllFilters = (): void => {
  searchQuery.value = ''
  clearFilters()
}

// Modal methods
const openJobDetailsModal = (job: Job): void => {
  showApplicationModal.value = false
  selectedJob.value = null
  viewingJob.value = job
}

const closeJobDetailsModal = (): void => {
  viewingJob.value = null
}

const openApplicationModal = (job: Job): void => {
  viewingJob.value = null
  selectedJob.value = job
  applicationForm.value.jobId = job._id
  
  if (user.value) {
    const nameParts = (user.value.name || '').split(' ')
    applicationForm.value.applicantDetails.firstName = nameParts[0] || ''
    applicationForm.value.applicantDetails.lastName = nameParts.slice(1).join(' ') || ''
    applicationForm.value.applicantDetails.email = user.value.email || ''
  }
  
  nextTick(() => {
    showApplicationModal.value = true
  })
}

const closeApplicationModal = (): void => {
  showApplicationModal.value = false
  selectedJob.value = null
  resetApplicationForm()
}

// Application methods
const applyToJob = (job: Job): void => {
  const existingApplication = userApplications.value.find(
    (app: Application) => app.jobId === job._id && app.status !== 'withdrawn'
  )
  
  if (existingApplication) {
    alertRef.value?.error('You have already applied for this position')
    return
  }

  openApplicationModal(job)
}

const submitApplication = async (): Promise<void> => {
  const validation = applicationsComposable.validateApplicationForm(applicationForm.value, resumeFile.value || undefined)
  
  if (!validation.isValid) {
    applicationErrors.value = validation.errors
    alertRef.value?.error('Please correct the errors in the form')
    return
  }

  applicationLoading.value = true
  applicationErrors.value = {}

  try {
    const formData = applicationsComposable.formatApplicationData(
      applicationForm.value, 
      resumeFile.value || undefined
    )

    const response = await applicationsComposable.submitApplication(formData)

    if (response.success) {
      alertRef.value?.success('Application submitted successfully!')
      closeApplicationModal()
      await fetchUserApplications()
    }
  } catch (error: any) {
    console.error('Error submitting application:', error)
    alertRef.value?.error('Failed to submit application. Please try again.')
  } finally {
    applicationLoading.value = false
  }
}

const handleFileUpload = (event: Event): void => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    resumeFile.value = file
    applicationErrors.value.resume = ''
  }
}

const addSkill = (): void => {
  if (newSkill.value.trim() && !applicationForm.value.skills.includes(newSkill.value.trim())) {
    applicationForm.value.skills.push(newSkill.value.trim())
    newSkill.value = ''
  }
}

const removeSkill = (index: number): void => {
  applicationForm.value.skills.splice(index, 1)
}

const resetApplicationForm = (): void => {
  applicationForm.value = {
    jobId: '',
    applicantDetails: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      linkedin: '',
      portfolio: ''
    },
    coverLetter: '',
    skills: [],
    experience: {
      years: 0,
      description: ''
    }
  }
  resumeFile.value = null
  newSkill.value = ''
  applicationErrors.value = {}
}

// Utility methods
const hasAppliedToJob = (jobId: string): boolean => {
  return userApplications.value.some(
    (app: Application) => app.jobId === jobId && app.status !== 'withdrawn'
  )
}

const getApplyButtonText = (job: Job): string => {
  if (hasAppliedToJob(job._id)) {
    const application = userApplications.value.find((app: Application) => app.jobId === job._id)
    return `Applied (${applicationsComposable.getStatusText(application?.status || 'submitted')})`
  }
  return 'Apply Now'
}

const saveJob = (job: Job): void => {
  const index = savedJobs.value.indexOf(job._id)
  if (index > -1) {
    savedJobs.value.splice(index, 1)
    alertRef.value?.success('Job removed from saved')
  } else {
    savedJobs.value.push(job._id)
    alertRef.value?.success('Job saved successfully')
  }
}

// Lifecycle
onMounted(async (): Promise<void> => {
  if (!authStore.isAuthenticated || !user.value?.id) {
    alertRef.value?.error('Please log in to access this page')
    await navigateTo('/auth/login')
    return
  }

  await Promise.all([
    fetchJobs(),
    fetchUserApplications()
  ])
})

// Watchers
watch(() => filteredJobs.value.length, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = Math.max(1, totalPages.value)
  }
})
</script>

<style scoped>
/* Base Layout */
.dashboard-container {
  @apply min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex;
  height: 100vh;
}

.main-content {
  @apply flex-1 flex flex-col;
  height: 100vh;
  overflow-y: auto;
}

/* Header */
.modern-header {
  @apply relative border-b border-slate-200/60;
  backdrop-filter: blur(20px);
}

.header-backdrop {
  @apply absolute inset-0 bg-gradient-to-r from-white/95 via-white/90 to-blue-50/80;
}

.header-content {
  @apply relative z-10 px-6 py-6 flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0;
}

.dashboard-title {
  @apply text-3xl font-black bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent;
  font-variant: small-caps;
  letter-spacing: -0.025em;
}

.welcome-message {
  @apply text-sm font-medium text-slate-600 mt-1;
}

.user-highlight {
  @apply font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent;
}

.header-actions {
  @apply flex items-center space-x-4;
}

.search-container {
  @apply relative;
}

.search-input {
  @apply w-72 pl-12 pr-4 py-3 bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl;
  @apply focus:ring-4 focus:ring-blue-500/20 focus:outline-none placeholder-slate-500 font-medium text-slate-700;
}

.search-icon {
  @apply absolute left-4 top-3.5 h-5 w-5 text-slate-400;
}

.filter-toggle {
  @apply px-4 py-2 bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl;
  @apply text-slate-700 font-medium hover:bg-slate-50/70 transition-all duration-300;
  @apply flex items-center space-x-2;
}

/* Filters */
.filters-panel {
  @apply relative bg-white/70 backdrop-blur-xl border-b border-slate-200/60;
}

.filters-content {
  @apply px-6 py-6;
}

.filters-grid {
  @apply grid grid-cols-1 md:grid-cols-5 gap-6;
}

.filter-group {
  @apply space-y-2;
}

.filter-label {
  @apply block text-sm font-bold text-slate-700;
}

.filter-select {
  @apply w-full bg-white/80 border border-slate-300/60 rounded-xl px-4 py-3;
  @apply text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
}

.clear-filters-btn {
  @apply w-full px-6 py-3 text-sm font-medium text-slate-600 bg-white/60 border border-white/40;
  @apply rounded-2xl hover:bg-slate-50/70 transition-all duration-300;
}

/* Stats Bar */
.stats-bar {
  @apply relative bg-white/50 backdrop-blur-xl border-b border-slate-200/40 px-6 py-4;
  @apply flex items-center justify-between text-sm;
}

.stats-info {
  @apply flex items-center space-x-6;
}

.job-count {
  @apply font-bold text-slate-900;
}

.divider {
  @apply h-4 w-px bg-slate-300;
}

.update-info {
  @apply flex items-center space-x-2 text-slate-600;
}

.sort-controls {
  @apply flex items-center space-x-4;
}

.sort-label {
  @apply font-medium text-slate-600;
}

.sort-select {
  @apply bg-white/60 backdrop-blur-xl border border-white/40 rounded-xl px-4 py-2;
  @apply text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-500;
}

/* Main Content */
.dashboard-main {
  @apply flex-1 p-6 space-y-8;
  overflow-y: auto;
}

/* States */
.loading-state {
  @apply flex flex-col items-center justify-center py-16 space-y-4;
}

.loading-spinner {
  @apply w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full;
  animation: spin 1s linear infinite;
}

.loading-text {
  @apply text-slate-600 font-semibold text-lg;
}

.error-state {
  @apply flex flex-col items-center justify-center py-16 space-y-4;
  @apply bg-red-50/70 rounded-3xl mx-6 border border-red-200/60;
}

.retry-btn {
  @apply px-6 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700;
  @apply transition-all duration-300 font-medium;
}

.empty-state {
  @apply text-center py-12;
}

.empty-icon {
  @apply mx-auto w-24 h-24 mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl;
  @apply flex items-center justify-center;
}

.empty-title {
  @apply text-xl font-bold text-slate-900 mb-2;
}

.empty-description {
  @apply text-slate-500 mb-6 max-w-md mx-auto;
}

.empty-action-btn {
  @apply px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700;
  @apply transition-all duration-300 font-medium hover:scale-105;
}

/* Jobs Content */
.jobs-content {
  @apply space-y-6;
}

.applications-summary {
  @apply mb-6;
}

.summary-card {
  @apply bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/40;
}

.summary-header {
  @apply flex items-center space-x-3 mb-4;
}

.summary-title {
  @apply text-lg font-bold text-slate-900;
}

.summary-stats {
  @apply grid grid-cols-3 gap-4;
}

.stat-item {
  @apply text-center;
}

.stat-number {
  @apply block text-2xl font-black text-blue-600;
}

.stat-label {
  @apply block text-xs font-medium text-slate-600 mt-1;
}

/* Job Cards */
.jobs-grid {
  @apply grid gap-6 lg:grid-cols-2 xl:grid-cols-3;
}

.job-card {
  @apply relative rounded-3xl cursor-pointer transition-all duration-500;
  @apply hover:-translate-y-2 hover:scale-[1.02];
}

.card-bg {
  @apply absolute inset-0 rounded-3xl bg-white/70 border border-white/60;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
}

.card-glow {
  @apply absolute -inset-px rounded-3xl opacity-0 transition-all duration-500;
  @apply bg-gradient-to-r from-blue-500/20 to-purple-500/20;
  filter: blur(12px);
}

.job-card:hover .card-glow {
  @apply opacity-100;
}

.card-content {
  @apply relative z-10 p-6 space-y-6;
}

.job-header {
  @apply flex items-start justify-between;
}

.job-title {
  @apply text-lg font-bold text-slate-900 mb-1;
}

.company-name {
  @apply text-blue-600 font-semibold;
}

.salary-badge {
  @apply px-3 py-1 rounded-full text-xs font-bold;
  @apply bg-gradient-to-r from-emerald-500 to-emerald-600 text-white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
}

.job-details {
  @apply space-y-2;
}

.detail-item {
  @apply flex items-center text-sm text-slate-600;
}

.detail-icon {
  @apply w-4 h-4 mr-3 flex-shrink-0;
}

.country-badge {
  @apply ml-2 px-2 py-1 text-xs rounded-full font-medium;
}

.badge-country {
  @apply bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200/50;
}

.badge-special {
  @apply bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200/50;
}

.job-description {
  @apply text-sm text-slate-600 leading-relaxed;
}

.job-footer {
  @apply flex items-center justify-between;
}

.view-details-btn {
  @apply flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700;
  @apply transition-all duration-200 space-x-2;
}

.job-actions {
  @apply flex items-center space-x-3;
}

.save-btn {
  @apply p-2 rounded-full transition-all duration-300 text-slate-400 hover:text-red-500;
}

.save-btn.saved {
  @apply text-red-500;
}

.apply-btn {
  @apply px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white;
  @apply text-sm font-bold rounded-xl hover:from-blue-700 hover:to-blue-800;
  @apply transition-all duration-300 shadow-lg shadow-blue-500/25 hover:scale-105;
}

.applied-btn {
  @apply px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white;
  @apply text-sm font-bold rounded-xl cursor-default shadow-lg shadow-green-500/25;
}

/* Pagination */
.pagination-container {
  @apply flex items-center justify-between mt-8 p-6;
  @apply bg-white/60 backdrop-blur-xl rounded-3xl border border-white/40;
}

.pagination-info {
  @apply text-sm font-medium text-slate-600;
}

.pagination-controls {
  @apply flex items-center space-x-2;
}

.pagination-btn {
  @apply flex items-center space-x-2 px-4 py-2 text-sm font-medium;
  @apply text-slate-600 bg-white/60 border border-white/40 rounded-xl;
  @apply hover:bg-slate-50/70 disabled:opacity-50 disabled:cursor-not-allowed;
  @apply transition-all duration-300;
}

.pagination-numbers {
  @apply flex items-center space-x-1;
}

.page-btn {
  @apply px-3 py-2 text-sm font-bold rounded-xl transition-all duration-300;
}

.page-btn:not(.active) {
  @apply text-slate-600 bg-white/60 border border-white/40 hover:bg-slate-50/70;
}

.page-btn.active {
  @apply bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25;
}

/* Modals */
.job-details-modal-overlay,
.application-modal-overlay {
  @apply fixed inset-0 bg-black/60 flex items-center justify-center p-4;
  backdrop-filter: blur(8px);
  z-index: 1000;
}

.application-modal-overlay {
  z-index: 1010;
}

.job-details-modal,
.application-modal {
  @apply relative bg-white/95 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.application-modal {
  @apply max-w-5xl max-h-[95vh];
}

.modal-backdrop {
  @apply absolute inset-0 bg-white/80 backdrop-blur-xl;
}

.modal-header {
  @apply relative z-10 flex items-center justify-between p-8 border-b border-slate-200/60;
}

.modal-title {
  @apply text-2xl font-black text-slate-900;
}

.modal-company {
  @apply text-lg font-semibold text-blue-600;
}

.title-decoration {
  @apply w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full;
}

.modal-close {
  @apply p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100/70 transition-all duration-200;
}

.modal-content {
  @apply relative z-10 flex-1 overflow-hidden;
}

.modal-scroll-area {
  @apply h-96 overflow-y-auto p-8 space-y-8;
  scrollbar-width: thin;
  scrollbar-color: rgba(148, 163, 184, 0.3) transparent;
}

.modal-scroll-area::-webkit-scrollbar {
  width: 6px;
}

.modal-scroll-area::-webkit-scrollbar-track {
  background: transparent;
}

.modal-scroll-area::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, rgba(148, 163, 184, 0.3), rgba(148, 163, 184, 0.5));
  border-radius: 3px;
}

/* Job Details */
.job-details-content {
  @apply space-y-6;
}

.details-section {
  @apply p-6 bg-slate-50/50 rounded-2xl border border-slate-200/60;
  backdrop-filter: blur(10px);
}

.section-title {
  @apply text-lg font-bold text-slate-900 pb-4 border-b border-slate-200/60 mb-4;
}

.info-item {
  @apply flex items-center space-x-3 text-sm;
}

.info-icon {
  @apply w-4 h-4 text-slate-500 flex-shrink-0;
}

.info-label {
  @apply font-semibold text-slate-700 min-w-0;
}

.info-value {
  @apply text-slate-600 flex-1;
}

.description-content {
  @apply text-slate-700 leading-relaxed text-sm;
}

.details-actions {
  @apply flex items-center justify-end space-x-4 pt-6 border-t border-slate-200/60;
}

/* Forms */
.form-section {
  @apply p-6 bg-slate-50/50 rounded-2xl border border-slate-200/60 space-y-4;
  backdrop-filter: blur(10px);
}

.form-group {
  @apply space-y-2;
}

.form-label {
  @apply block text-sm font-semibold text-slate-700;
}

.form-input {
  @apply w-full px-4 py-3 bg-white/70 border border-slate-300/60 rounded-xl text-slate-900 placeholder-slate-500 backdrop-blur-xl transition-all duration-200;
  @apply focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500;
}

.form-input.error {
  @apply border-red-500 focus:ring-red-500/20 focus:border-red-500;
}

.error-message {
  @apply text-xs font-medium text-red-600;
}

.file-upload-area {
  @apply border-2 border-dashed border-slate-300 rounded-xl p-6 text-center transition-colors;
  @apply hover:border-blue-400 hover:bg-blue-50/50;
}

.file-upload-label {
  @apply cursor-pointer flex flex-col items-center justify-center;
}

.skill-tag {
  @apply inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full;
  @apply border border-blue-200;
}

.form-actions {
  @apply flex items-center justify-end space-x-4 pt-6 border-t border-slate-200/60;
}

.btn-primary {
  @apply flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-2xl;
  @apply hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500/20;
  @apply disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105;
}

.btn-secondary {
  @apply px-8 py-3 bg-white/70 text-slate-700 font-bold rounded-2xl border border-slate-300/60 backdrop-blur-xl;
  @apply hover:bg-slate-50/70 focus:outline-none focus:ring-4 focus:ring-slate-500/20;
  @apply disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300;
}

/* Utilities */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Animations */
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 640px) {
  .dashboard-title {
    @apply text-2xl;
  }
  
  .header-content {
    @apply flex-col space-y-4;
  }
  
  .header-actions {
    @apply flex-col w-full space-y-3 space-x-0;
  }
  
  .search-input {
    @apply w-full;
  }
  
  .filters-grid {
    @apply grid-cols-1;
  }
  
  .stats-bar {
    @apply flex-col space-y-4;
  }
  
  .sort-controls {
    @apply w-full justify-center;
  }
  
  .job-footer {
    @apply flex-col items-stretch space-y-3;
  }
  
  .job-actions {
    @apply justify-center;
  }
  
  .pagination-container {
    @apply flex-col space-y-4;
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .filter-toggle,
  .clear-filters-btn,
  .job-card,
  .apply-btn {
    transition: none;
    transform: none;
  }
  
  .job-card:hover {
    transform: none;
  }
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  .card-bg,
  .modal-backdrop,
  .summary-card {
    @apply bg-white border-2 border-slate-900;
  }
}

/* Print Styles */
@media print {
  .header-actions,
  .filters-panel,
  .pagination-container,
  .job-actions {
    display: none !important;
  }
  
  .job-card {
    @apply border border-slate-300 shadow-none;
    break-inside: avoid;
  }
}
</style>