<!-- pages/dashboard/jobs.vue -->
<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <Sidebar :user="user" />

    <!-- Main Content Area -->
    <div class="main-content">
      <!-- Ultra-Modern Header -->
      <div class="modern-header">
        <div class="header-backdrop"></div>
        <div class="header-content">
          <div class="header-info">
            <div class="welcome-section">
              <h1 class="dashboard-title">Job Opportunities</h1>
              <p class="welcome-message">
                Discover your next <span class="user-highlight">career opportunity</span>
              </p>
            </div>
            <!-- Floating decorative elements -->
            <div class="header-decorations">
              <div class="floating-orb orb-1"></div>
              <div class="floating-orb orb-2"></div>
              <div class="floating-orb orb-3"></div>
            </div>
          </div>
          
          <div class="header-actions">
            <!-- Search Input -->
            <div class="relative">
              <div class="absolute inset-0 bg-white/60 rounded-2xl backdrop-blur-xl border border-white/40"></div>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search jobs..."
                class="relative z-10 w-72 pl-12 pr-4 py-3 bg-transparent border-0 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:outline-none placeholder-slate-500 font-medium text-slate-700"
                @input="handleSearch"
              />
              <Search class="absolute left-4 top-3.5 h-5 w-5 text-slate-400 z-10" />
            </div>

            <!-- Filters Button -->
            <button
              @click="showFilters = !showFilters"
              class="action-btn tips-btn"
            >
              <div class="btn-bg"></div>
              <div class="btn-content">
                <Filter class="btn-icon" />
                <span>Filters</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Filters Panel -->
      <div v-if="showFilters" class="relative">
        <div class="absolute inset-0 bg-white/70 backdrop-blur-xl border-b border-slate-200/60"></div>
        <div class="relative z-10 px-6 py-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <!-- Location Filter -->
            <div class="filter-group">
              <label class="filter-label">Location</label>
              <div class="filter-select-wrapper">
                <select v-model="filters.location" @change="applyFilters" class="filter-select">
                  <option value="">All Locations</option>
                  <option v-for="location in uniqueLocations" :key="location" :value="location">
                    {{ location }}
                  </option>
                </select>
                <MapPin class="filter-icon" />
              </div>
            </div>

            <!-- Sector Filter -->
            <div class="filter-group">
              <label class="filter-label">Sector</label>
              <div class="filter-select-wrapper">
                <select v-model="filters.sector" @change="applyFilters" class="filter-select">
                  <option value="">All Sectors</option>
                  <option v-for="sector in uniqueSectors" :key="sector" :value="sector">
                    {{ sector }}
                  </option>
                </select>
                <Building class="filter-icon" />
              </div>
            </div>

            <!-- Experience Level Filter -->
            <div class="filter-group">
              <label class="filter-label">Experience Level</label>
              <div class="filter-select-wrapper">
                <select v-model="filters.experience_level" @change="applyFilters" class="filter-select">
                  <option value="">All Levels</option>
                  <option v-for="level in uniqueExperienceLevels" :key="level" :value="level">
                    {{ level }}
                  </option>
                </select>
                <Zap class="filter-icon" />
              </div>
            </div>

            <!-- Clear Filters -->
            <div class="flex items-end">
              <button
                @click="clearFilters"
                class="w-full px-6 py-3 text-sm font-medium text-slate-600 bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl hover:bg-slate-50/70 transition-all duration-300 hover:scale-105"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Bar -->
      <div class="relative">
        <div class="absolute inset-0 bg-white/50 backdrop-blur-xl border-b border-slate-200/40"></div>
        <div class="relative z-10 px-6 py-4">
          <div class="flex items-center justify-between text-sm">
            <div class="flex items-center space-x-6">
              <span class="font-bold text-slate-900">
                {{ filteredJobs.length }} job{{ filteredJobs.length !== 1 ? 's' : '' }} found
              </span>
              <div class="h-4 w-px bg-slate-300"></div>
              <div class="flex items-center space-x-2 text-slate-600">
                <Clock class="w-4 h-4" />
                <span>Updated {{ new Date().toLocaleDateString() }}</span>
              </div>
            </div>
            
            <div class="flex items-center space-x-4">
              <span class="font-medium text-slate-600">Sort by:</span>
              <div class="relative">
                <select 
                  v-model="sortBy" 
                  @change="applySorting" 
                  class="appearance-none bg-white/60 backdrop-blur-xl border border-white/40 rounded-xl px-4 py-2 text-sm font-medium text-slate-700 focus:ring-4 focus:ring-blue-500/20 focus:outline-none cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">Job Title A-Z</option>
                  <option value="company">Company A-Z</option>
                </select>
                <ChevronRight class="absolute right-2 top-2.5 w-4 h-4 text-slate-400 rotate-90 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Dashboard Content -->
      <div class="dashboard-main">
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
          <button
            @click="fetchJobs"
            class="px-6 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all duration-300 font-medium"
          >
            Try Again
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredJobs.length === 0" class="text-center py-12">
          <div class="relative mx-auto w-24 h-24 mb-6">
            <div class="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl"></div>
            <div class="relative z-10 w-full h-full flex items-center justify-center">
              <Briefcase class="w-12 h-12 text-slate-400" />
            </div>
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-2">No Jobs Found</h3>
          <p class="text-slate-500 mb-6 max-w-md mx-auto">
            {{ searchQuery || Object.values(filters).some(f => f) ? 'Try adjusting your search criteria or filters to find more opportunities.' : 'No job listings available at the moment. Check back soon for new opportunities!' }}
          </p>
          <button
            v-if="searchQuery || Object.values(filters).some(f => f)"
            @click="clearAllFilters"
            class="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all duration-300 font-medium hover:scale-105"
          >
            Clear All Filters
          </button>
        </div>

        <!-- Jobs Grid -->
        <div v-else class="space-y-6">
          <div class="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            <div
              v-for="job in paginatedJobs"
              :key="job._id"
              class="job-card group"
            >
              <!-- Card Background -->
              <div class="card-bg"></div>
              <div class="card-glow bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
              
              <!-- Job Card Content -->
              <div class="card-content">
                <!-- Job Header -->
                <div class="job-header">
                  <div class="job-main-info">
                    <h3 class="job-title">
                      {{ job.title || 'Untitled Position' }}
                    </h3>
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
                  </div>
                  
                  <div v-if="job.sector" class="detail-item">
                    <Building class="detail-icon" />
                    <span>{{ job.sector }}</span>
                  </div>

                  <div v-if="job.experience_level" class="detail-item">
                    <Zap class="detail-icon" />
                    <span>{{ job.experience_level }}</span>
                  </div>

                  <div v-if="job.posted" class="detail-item text-slate-500">
                    <Clock class="detail-icon" />
                    <span>Posted {{ formatDate(job.posted) }}</span>
                  </div>
                </div>

                <!-- Job Description Preview -->
                <div v-if="job.job_description" class="job-description">
                  <p class="line-clamp-3">{{ job.job_description }}</p>
                </div>

                <!-- Tags -->
                <div class="job-tags">
                  <span v-if="job.field" class="tag tag-primary">
                    {{ job.field }}
                  </span>
                  <span v-if="job.experience_length" class="tag tag-secondary">
                    {{ job.experience_length }}
                  </span>
                </div>

                <!-- Card Footer -->
                <div class="job-footer">
                  <button
                    @click="selectedJob = job"
                    class="view-details-btn"
                  >
                    <span>View Details</span>
                    <ArrowRight class="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                  
                  <div class="job-actions">
                    <button
                      @click="saveJob(job)"
                      :class="[
                        'save-btn',
                        savedJobs.includes(job._id) ? 'saved' : ''
                      ]"
                      :title="savedJobs.includes(job._id) ? 'Remove from saved' : 'Save job'"
                    >
                      <Heart :fill="savedJobs.includes(job._id) ? 'currentColor' : 'none'" class="w-4 h-4" />
                    </button>
                    
                    <button
                      @click="applyToJob(job)"
                      class="apply-btn"
                    >
                      Apply Now
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
                  :class="[
                    'page-btn',
                    page === currentPage ? 'active' : ''
                  ]"
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
      </div>
    </div>

    <!-- Job Details Modal -->
    <div v-if="selectedJob" class="modal-overlay" @click="selectedJob = null">
      <div class="job-modal" @click.stop>
        <div class="modal-backdrop"></div>
        
        <!-- Modal Header -->
        <div class="modal-header">
          <div class="modal-title-section">
            <h3 class="modal-title">{{ selectedJob.title }}</h3>
            <p class="modal-company">{{ selectedJob.employer }}</p>
            <div class="title-decoration"></div>
          </div>
          <button @click="selectedJob = null" class="modal-close">
            <X class="w-6 h-6" />
          </button>
        </div>

        <!-- Modal Content -->
        <div class="modal-content">
          <div class="modal-scroll-area">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Job Details -->
              <div class="modal-section">
                <h4 class="section-title">Job Details</h4>
                <div class="details-grid">
                  <div v-if="selectedJob.location" class="detail-row">
                    <MapPin class="detail-row-icon" />
                    <div>
                      <span class="detail-label">Location</span>
                      <span class="detail-value">{{ selectedJob.location }}</span>
                    </div>
                  </div>
                  
                  <div v-if="selectedJob.sector" class="detail-row">
                    <Building class="detail-row-icon" />
                    <div>
                      <span class="detail-label">Sector</span>
                      <span class="detail-value">{{ selectedJob.sector }}</span>
                    </div>
                  </div>
                  
                  <div v-if="selectedJob.salary" class="detail-row">
                    <TrendingUp class="detail-row-icon" />
                    <div>
                      <span class="detail-label">Salary</span>
                      <span class="detail-value">{{ selectedJob.salary }}</span>
                    </div>
                  </div>
                  
                  <div v-if="selectedJob.experience_level" class="detail-row">
                    <Zap class="detail-row-icon" />
                    <div>
                      <span class="detail-label">Experience Level</span>
                      <span class="detail-value">{{ selectedJob.experience_level }}</span>
                    </div>
                  </div>
                  
                  <div v-if="selectedJob.posted" class="detail-row">
                    <Clock class="detail-row-icon" />
                    <div>
                      <span class="detail-label">Posted</span>
                      <span class="detail-value">{{ formatDate(selectedJob.posted) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Requirements -->
              <div class="modal-section">
                <h4 class="section-title">Requirements</h4>
                <div class="requirements-content">
                  <div v-if="selectedJob.qualifications" class="requirement-item">
                    <span class="requirement-label">Qualifications</span>
                    <p class="requirement-text">{{ selectedJob.qualifications }}</p>
                  </div>
                  <div v-if="selectedJob.experience_length" class="requirement-item">
                    <span class="requirement-label">Experience Required</span>
                    <p class="requirement-text">{{ selectedJob.experience_length }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Job Description -->
            <div v-if="selectedJob.job_description" class="modal-section full-width">
              <h4 class="section-title">Job Description</h4>
              <div class="description-content">
                <p class="whitespace-pre-wrap">{{ selectedJob.job_description }}</p>
              </div>
            </div>

            <!-- Contact Information -->
            <div v-if="selectedJob.email" class="modal-section full-width">
              <h4 class="section-title">Contact Information</h4>
              <div class="contact-card">
                <div class="contact-info">
                  <div class="contact-icon-wrapper">
                    <div class="contact-icon-bg"></div>
                    <svg class="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span class="contact-email">{{ selectedJob.email }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
          <button
            @click="saveJob(selectedJob)"
            :class="[
              'footer-btn secondary',
              savedJobs.includes(selectedJob._id) ? 'saved' : ''
            ]"
          >
            <Heart :fill="savedJobs.includes(selectedJob._id) ? 'currentColor' : 'none'" class="w-4 h-4" />
            <span>{{ savedJobs.includes(selectedJob._id) ? 'Remove from Saved' : 'Save Job' }}</span>
          </button>
          
          <button
            v-if="selectedJob.url"
            @click="openExternalLink(selectedJob.url)"
            class="footer-btn tertiary"
          >
            <ExternalLink class="w-4 h-4" />
            <span>Visit Job Page</span>
          </button>
          
          <button
            @click="applyToJob(selectedJob)"
            class="footer-btn primary"
          >
            <CheckCircle class="w-4 h-4" />
            <span>Apply Now</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Sidebar from '@/features/dashboard/components/dashboard-sidebar.vue'

const { $message } = useNuxtApp()

// Page metadata
definePageMeta({
  layout: 'dashboard'
})

// User data (you'll need to get this from your auth system)
const user = ref({
  name: 'John Doe',
  email: 'john@example.com',
  avatar: null,
  points: 150
})

// Reactive data
const loading = ref(true)
const error = ref(null)
const jobs = ref([])
const selectedJob = ref(null)
const searchQuery = ref('')
const showFilters = ref(false)
const currentPage = ref(1)
const jobsPerPage = ref(12)
const sortBy = ref('newest')
const savedJobs = ref([])

// Filters
const filters = ref({
  location: '',
  sector: '',
  experience_level: ''
})

// Mock data
const mockJobs = [
  {
    _id: '1',
    title: 'Senior Software Engineer',
    employer: 'TechFlow Inc',
    location: 'Accra, Ghana',
    sector: 'Technology',
    experience_level: 'Senior',
    salary: 'GHS 15,000 - 20,000',
    field: 'Software Development',
    experience_length: '5+ years',
    job_description: 'We are seeking a talented Senior Software Engineer to join our growing team. You will be responsible for designing and developing scalable web applications using modern technologies like React, Node.js, and cloud platforms.',
    qualifications: 'Bachelor\'s degree in Computer Science or related field, 5+ years of experience with React/Node.js, experience with cloud platforms (AWS/GCP)',
    email: 'careers@techflow.com',
    posted: '2024-08-25',
    url: 'https://techflow.com/careers',
    created_at: '2024-08-25'
  },
  {
    _id: '2',
    title: 'Marketing Manager',
    employer: 'Creative Minds Agency',
    location: 'Kumasi, Ghana',
    sector: 'Marketing',
    experience_level: 'Mid-Level',
    salary: 'GHS 8,000 - 12,000',
    field: 'Digital Marketing',
    experience_length: '3-5 years',
    job_description: 'Lead our marketing initiatives and drive brand growth through innovative digital strategies. Manage campaigns, analyze performance metrics, and collaborate with cross-functional teams.',
    qualifications: 'Marketing degree, 3+ years experience in digital marketing, proficiency in Google Analytics and social media platforms',
    email: 'hr@creativeminds.com',
    posted: '2024-08-24',
    created_at: '2024-08-24'
  },
  {
    _id: '3',
    title: 'Data Analyst',
    employer: 'DataCorp Solutions',
    location: 'Remote',
    sector: 'Data Science',
    experience_level: 'Junior',
    salary: 'GHS 6,000 - 9,000',
    field: 'Analytics',
    experience_length: '1-3 years',
    job_description: 'Analyze complex datasets to drive business decisions and create insightful reports. Work with SQL, Python, and visualization tools to extract meaningful insights.',
    qualifications: 'Statistics/Mathematics degree, Python/R experience, SQL proficiency',
    email: 'jobs@datacorp.com',
    posted: '2024-08-23',
    created_at: '2024-08-23'
  },
  {
    _id: '4',
    title: 'UX Designer',
    employer: 'Design Studio Pro',
    location: 'Takoradi, Ghana',
    sector: 'Design',
    experience_level: 'Mid-Level',
    salary: 'GHS 10,000 - 14,000',
    field: 'User Experience',
    experience_length: '2-4 years',
    job_description: 'Create intuitive and beautiful user experiences for web and mobile applications. Collaborate with developers and product managers to deliver exceptional user interfaces.',
    qualifications: 'Design degree, Figma/Sketch proficiency, portfolio required, understanding of user research methods',
    email: 'design@studiopro.com',
    posted: '2024-08-22',
    created_at: '2024-08-22'
  },
  {
    _id: '5',
    title: 'Financial Analyst',
    employer: 'Ghana Banking Corp',
    location: 'Accra, Ghana',
    sector: 'Finance',
    experience_level: 'Junior',
    salary: 'GHS 7,000 - 10,000',
    field: 'Financial Analysis',
    experience_length: '1-2 years',
    job_description: 'Support financial planning and analysis activities, prepare financial reports, and assist in budgeting and forecasting processes.',
    qualifications: 'Finance or Accounting degree, Excel proficiency, analytical mindset',
    email: 'recruitment@ghanabankingcorp.com',
    posted: '2024-08-21',
    created_at: '2024-08-21'
  },
  {
    _id: '6',
    title: 'Project Manager',
    employer: 'BuildRight Construction',
    location: 'Tema, Ghana',
    sector: 'Construction',
    experience_level: 'Senior',
    salary: 'GHS 12,000 - 18,000',
    field: 'Project Management',
    experience_length: '4+ years',
    job_description: 'Oversee construction projects from inception to completion, manage teams, ensure quality standards, and maintain project timelines and budgets.',
    qualifications: 'Engineering degree, PMP certification preferred, construction industry experience',
    email: 'pm@buildright.gh',
    posted: '2024-08-20',
    created_at: '2024-08-20'
  }
]

// Computed properties
const uniqueLocations = computed(() => {
  const locations = jobs.value.map(job => job.location).filter(Boolean)
  return [...new Set(locations)].sort()
})

const uniqueSectors = computed(() => {
  const sectors = jobs.value.map(job => job.sector).filter(Boolean)
  return [...new Set(sectors)].sort()
})

const uniqueExperienceLevels = computed(() => {
  const levels = jobs.value.map(job => job.experience_level).filter(Boolean)
  return [...new Set(levels)].sort()
})

const filteredJobs = computed(() => {
  let filtered = jobs.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(job =>
      job.title?.toLowerCase().includes(query) ||
      job.employer?.toLowerCase().includes(query) ||
      job.job_description?.toLowerCase().includes(query) ||
      job.location?.toLowerCase().includes(query) ||
      job.sector?.toLowerCase().includes(query)
    )
  }

  // Apply filters
  if (filters.value.location) {
    filtered = filtered.filter(job => job.location === filters.value.location)
  }
  if (filters.value.sector) {
    filtered = filtered.filter(job => job.sector === filters.value.sector)
  }
  if (filters.value.experience_level) {
    filtered = filtered.filter(job => job.experience_level === filters.value.experience_level)
  }

  // Sorting
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'newest':
        return new Date(b.created_at) - new Date(a.created_at)
      case 'oldest':
        return new Date(a.created_at) - new Date(b.created_at)
      case 'title':
        return (a.title || '').localeCompare(b.title || '')
      case 'company':
        return (a.employer || '').localeCompare(b.employer || '')
      default:
        return 0
    }
  })

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredJobs.value.length / jobsPerPage.value))

const paginatedJobs = computed(() => {
  const start = (currentPage.value - 1) * jobsPerPage.value
  const end = start + jobsPerPage.value
  return filteredJobs.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
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

// Methods
const fetchJobs = async () => {
  loading.value = true
  error.value = null
  
  try {
    // Build query parameters
    const queryParams = new URLSearchParams()
    
    if (searchQuery.value) queryParams.append('search', searchQuery.value)
    if (filters.value.location) queryParams.append('location', filters.value.location)
    if (filters.value.sector) queryParams.append('sector', filters.value.sector)
    if (filters.value.experience_level) queryParams.append('experience_level', filters.value.experience_level)
    if (sortBy.value) queryParams.append('sort', sortBy.value)
    if (currentPage.value) queryParams.append('page', currentPage.value)
    queryParams.append('limit', jobsPerPage.value)

    const queryString = queryParams.toString()
    const url = `https://dark-caldron-448714-u5.uc.r.appspot.com/getalljobsHome${queryString ? '?' + queryString : ''}`
    
    const response = await $fetch(url)
    
    // Handle both response formats
    if (response.success) {
      jobs.value = response.data || []
      
      // Update filter options if available
      if (response.filters) {
        // You can use these to populate filter dropdowns dynamically
        console.log('Available filters:', response.filters)
      }
    } else {
      throw new Error(response.message || 'Failed to fetch jobs')
    }
  } catch (err) {
    error.value = err.message || 'Failed to fetch jobs'
    console.error('Error fetching jobs:', err)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  setCurrentPage(1)
}

const applyFilters = () => {
  currentPage.value = 1
}

const applySorting = () => {
  currentPage.value = 1
}

const clearFilters = () => {
  filters.value = {
    location: '',
    sector: '',
    experience_level: ''
  }
  currentPage.value = 1
}

const clearAllFilters = () => {
  searchQuery.value = ''
  clearFilters()
}

const saveJob = (job) => {
  const index = savedJobs.value.indexOf(job._id)
  if (index > -1) {
    savedJobs.value.splice(index, 1)
  } else {
    savedJobs.value.push(job._id)
  }
}

const applyToJob = (job) => {
  if (job.url) {
    window.open(job.url, '_blank')
  } else if (job.email) {
    const subject = encodeURIComponent(`Application for ${job.title} Position`)
    const body = encodeURIComponent(`Dear ${job.employer || 'Hiring Manager'},\n\nI am writing to apply for the ${job.title} position.\n\nBest regards,\n[Your Name]`)
    window.location.href = `mailto:${job.email}?subject=${subject}&body=${body}`
  }
}

const openExternalLink = (url) => {
  window.open(url, '_blank')
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
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

// Lifecycle
onMounted(() => {
  fetchJobs()
})

// Watchers
watch(() => filteredJobs.value.length, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = Math.max(1, totalPages.value)
  }
})
</script>

<style scoped>
/* Base Layout - Inherit from dashboard */
.dashboard-container {
    @apply min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex;
    position: relative;
    overflow-x: hidden;
    height: 100vh;
}

.main-content {
    @apply flex-1 flex flex-col;
    min-width: 0;
    height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
}

.main-content-adjusted {
    margin-left: 320px;
}

/* Ultra-Modern Header */
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

.header-info {
    @apply relative;
}

.welcome-section {
    @apply text-center lg:text-left;
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

.header-decorations {
    @apply absolute -inset-4 pointer-events-none;
}

.floating-orb {
    @apply absolute w-1 h-1 rounded-full opacity-20;
    animation: float 6s ease-in-out infinite;
}

.orb-1 {
    @apply bg-blue-400 top-2 right-8;
    animation-delay: 0s;
}

.orb-2 {
    @apply bg-purple-400 top-8 right-4;
    animation-delay: 2s;
}

.orb-3 {
    @apply bg-emerald-400 top-6 right-12;
    animation-delay: 4s;
}

.header-actions {
    @apply flex items-center space-x-4;
}

.action-btn {
    @apply relative px-4 py-2 rounded-2xl font-medium text-sm transition-all duration-300;
    @apply hover:scale-105 hover:shadow-lg;
    backdrop-filter: blur(12px);
}

.btn-bg {
    @apply absolute inset-0 rounded-2xl transition-all duration-300;
}

.tips-btn .btn-bg {
    @apply bg-gradient-to-r from-slate-100/80 to-slate-200/60;
}

.btn-content {
    @apply relative z-10 flex items-center space-x-2;
}

.btn-icon {
    @apply w-4 h-4;
}

.tips-btn {
    @apply text-slate-700 hover:text-slate-900;
}

/* Filter Styles */
.filter-group {
    @apply space-y-2;
}

.filter-label {
    @apply block text-sm font-bold text-slate-700;
}

.filter-select-wrapper {
    @apply relative;
}

.filter-select {
    @apply w-full appearance-none bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl px-4 py-3 pl-12 text-sm font-medium text-slate-700 focus:ring-4 focus:ring-blue-500/20 focus:outline-none cursor-pointer transition-all duration-300;
}

.filter-icon {
    @apply absolute left-4 top-3.5 w-4 h-4 text-slate-400 pointer-events-none;
}

/* Main Dashboard Content */
.dashboard-main {
    @apply flex-1 p-6 flex flex-col space-y-8;
    min-height: 0;
    overflow-y: auto;
    padding-bottom: 2rem;
}

/* Job Cards */
.job-card {
    @apply relative rounded-3xl transition-all duration-500 cursor-pointer;
    @apply hover:-translate-y-2 hover:scale-[1.02];
    backdrop-filter: blur(20px);
}

.card-bg {
    @apply absolute inset-0 rounded-3xl bg-white/70 border border-white/60;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
}

.card-glow {
    @apply absolute -inset-px rounded-3xl opacity-0 transition-all duration-500;
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

.job-main-info {
    @apply flex-1 min-w-0;
}

.job-title {
    @apply text-lg font-bold text-slate-900 mb-1 line-clamp-2;
}

.company-name {
    @apply text-blue-600 font-semibold;
}

.salary-badge {
    @apply inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25;
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

.job-description {
    @apply text-sm text-slate-600 leading-relaxed;
}

.job-tags {
    @apply flex flex-wrap gap-2;
}

.tag {
    @apply inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium;
}

.tag-primary {
    @apply bg-blue-100 text-blue-700;
}

.tag-secondary {
    @apply bg-slate-100 text-slate-700;
}

.job-footer {
    @apply flex items-center justify-between;
}

.view-details-btn {
    @apply flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-all duration-200 space-x-2;
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
    @apply px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:scale-105;
}

/* Modal Styles */
.modal-overlay {
    @apply fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50;
    backdrop-filter: blur(8px);
}

.job-modal {
    @apply relative bg-white/95 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden;
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.modal-backdrop {
    @apply absolute inset-0 bg-white/80 backdrop-blur-xl;
}

.modal-header {
    @apply relative z-10 flex items-center justify-between p-8 border-b border-slate-200/60;
}

.modal-title-section {
    @apply space-y-2;
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

.modal-section {
    @apply space-y-4;
}

.modal-section.full-width {
    @apply col-span-full;
}

.section-title {
    @apply text-lg font-bold text-slate-900 flex items-center space-x-2;
}

.details-grid {
    @apply space-y-4;
}

.detail-row {
    @apply flex items-start space-x-3 p-4 bg-slate-50/70 rounded-2xl backdrop-blur-xl;
}

.detail-row-icon {
    @apply w-5 h-5 text-slate-500 mt-0.5;
}

.detail-label {
    @apply block text-xs font-bold text-slate-500 uppercase tracking-wide;
}

.detail-value {
    @apply block text-sm font-semibold text-slate-900;
}

.requirements-content {
    @apply space-y-4;
}

.requirement-item {
    @apply p-4 bg-slate-50/70 rounded-2xl backdrop-blur-xl;
}

.requirement-label {
    @apply block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2;
}

.requirement-text {
    @apply text-sm text-slate-700 leading-relaxed;
}

.description-content {
    @apply p-6 bg-slate-50/70 rounded-2xl backdrop-blur-xl;
}

.contact-card {
    @apply p-6 bg-gradient-to-r from-slate-50/70 to-blue-50/70 rounded-2xl backdrop-blur-xl border border-white/40;
}

.contact-info {
    @apply flex items-center space-x-4;
}

.contact-icon-wrapper {
    @apply relative w-12 h-12;
}

.contact-icon-bg {
    @apply absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl;
}

.contact-icon {
    @apply relative z-10 w-6 h-6 text-white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.contact-email {
    @apply text-slate-700 font-semibold;
}

.modal-footer {
    @apply relative z-10 flex items-center justify-end pt-6 px-8 pb-8 border-t border-slate-200/60 space-x-4;
}

.footer-btn {
    @apply flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 hover:scale-105;
}

.footer-btn.primary {
    @apply bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-blue-800;
}

.footer-btn.secondary {
    @apply bg-white/60 text-slate-700 border border-white/40 backdrop-blur-xl hover:bg-slate-50/70;
}

.footer-btn.secondary.saved {
    @apply text-red-600 hover:text-red-700 border-red-200;
}

.footer-btn.tertiary {
    @apply bg-slate-100/70 text-slate-600 hover:bg-slate-200/70;
}

/* Pagination */
.pagination-container {
    @apply flex items-center justify-between mt-8 p-6 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/40;
}

.pagination-info {
    @apply text-sm font-medium text-slate-600;
}

.pagination-controls {
    @apply flex items-center space-x-2;
}

.pagination-btn {
    @apply flex items-center space-x-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white/60 border border-white/40 rounded-xl hover:bg-slate-50/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 backdrop-blur-xl;
}

.pagination-numbers {
    @apply flex items-center space-x-1;
}

.page-btn {
    @apply px-3 py-2 text-sm font-bold rounded-xl transition-all duration-300 backdrop-blur-xl;
}

.page-btn:not(.active) {
    @apply text-slate-600 bg-white/60 border border-white/40 hover:bg-slate-50/70;
}

.page-btn.active {
    @apply bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25;
}

/* Loading States */
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
    @apply flex flex-col items-center justify-center py-16 space-y-4 bg-red-50/70 rounded-3xl mx-6 border border-red-200/60 backdrop-blur-xl;
}

/* Utilities */
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Custom Scrollbar */
.main-content {
    scrollbar-width: thin;
    scrollbar-color: rgba(148, 163, 184, 0.3) transparent;
}

.main-content::-webkit-scrollbar {
    width: 6px;
}

.main-content::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 3px;
}

.main-content::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, rgba(148, 163, 184, 0.3), rgba(148, 163, 184, 0.5));
    border-radius: 3px;
    transition: all 0.3s ease;
}

.main-content::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, rgba(148, 163, 184, 0.5), rgba(148, 163, 184, 0.7));
}

.dashboard-main {
    scrollbar-width: thin;
    scrollbar-color: rgba(148, 163, 184, 0.3) transparent;
}

.dashboard-main::-webkit-scrollbar {
    width: 6px;
}

.dashboard-main::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 3px;
}

.dashboard-main::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, rgba(148, 163, 184, 0.3), rgba(148, 163, 184, 0.5));
    border-radius: 3px;
    transition: all 0.3s ease;
}

.dashboard-main::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, rgba(148, 163, 184, 0.5), rgba(148, 163, 184, 0.7));
}

/* Animations */
@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-6px); }
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 1024px) {
    .main-content-adjusted {
        margin-left: 0;
    }
}

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
    
    .header-actions > * {
        @apply w-full;
    }
    
    .pagination-container {
        @apply flex-col space-y-4;
    }
    
    .pagination-controls {
        @apply w-full justify-center;
    }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
    .floating-orb,
    .job-card,
    .footer-btn,
    .apply-btn {
        animation: none;
    }
    
    .job-card:hover {
        transform: none;
    }
}
</style>