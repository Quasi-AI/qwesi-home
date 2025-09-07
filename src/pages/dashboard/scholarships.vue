<template>
  <div class="dashboard-container">
    <MessagePopup ref="alertRef" />

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
              <h1 class="dashboard-title">Scholarship Opportunities</h1>
              <p class="welcome-message">
                Fund your <span class="user-highlight">educational journey</span>
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
                placeholder="Search scholarships..."
                class="relative z-10 w-72 pl-12 pr-4 py-3 bg-transparent border-0 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:outline-none placeholder-slate-500 font-medium text-slate-700"
                @input="handleSearch"
                :disabled="loading"
              />
              <Search class="absolute left-4 top-3.5 h-5 w-5 text-slate-400 z-10" />
            </div>

            <!-- Filters Button -->
            <button
              @click="showFilters = !showFilters"
              class="action-btn tips-btn"
              :disabled="loading"
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
          <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
            
            <!-- Country Filter -->
            <div class="filter-group">
              <label class="filter-label">Country</label>
              <div class="filter-select-wrapper">
                <select v-model="filters.country" @change="applyFilters" class="filter-select" :disabled="loading">
                  <option value="">All Countries</option>
                  <option v-for="country in uniqueCountries" :key="country" :value="country">
                    {{ country }}
                  </option>
                </select>
                <Globe class="filter-icon" />
              </div>
            </div>

            <!-- Study Level Filter -->
            <div class="filter-group">
              <label class="filter-label">Study Level</label>
              <div class="filter-select-wrapper">
                <select v-model="filters.studyLevel" @change="applyFilters" class="filter-select" :disabled="loading">
                  <option value="">All Levels</option>
                  <option v-for="level in uniqueStudyLevels" :key="level" :value="level">
                    {{ level }}
                  </option>
                </select>
                <GraduationCap class="filter-icon" />
              </div>
            </div>

            <!-- Field of Study Filter -->
            <div class="filter-group">
              <label class="filter-label">Field of Study</label>
              <div class="filter-select-wrapper">
                <select v-model="filters.fieldOfStudy" @change="applyFilters" class="filter-select" :disabled="loading">
                  <option value="">All Fields</option>
                  <option v-for="field in uniqueFields" :key="field" :value="field">
                    {{ field }}
                  </option>
                </select>
                <BookOpen class="filter-icon" />
              </div>
            </div>

            <!-- Application Status Filter -->
            <div class="filter-group">
              <label class="filter-label">Application Status</label>
              <div class="filter-select-wrapper">
                <select v-model="filters.status" @change="applyFilters" class="filter-select" :disabled="loading">
                  <option value="">All Scholarships</option>
                  <option value="open">Open for Applications</option>
                  <option value="closing-soon">Closing Soon</option>
                  <option value="closed">Closed</option>
                </select>
                <Clock class="filter-icon" />
              </div>
            </div>

            <!-- Clear Filters -->
            <div class="flex items-end">
              <button
                @click="clearFilters"
                class="w-full px-6 py-3 text-sm font-medium text-slate-600 bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl hover:bg-slate-50/70 transition-all duration-300 hover:scale-105"
                :disabled="loading"
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
                {{ paginatedScholarships.length }} scholarship{{ paginatedScholarships.length !== 1 ? 's' : '' }} found
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
                  :disabled="loading"
                  class="appearance-none bg-white/60 backdrop-blur-xl border border-white/40 rounded-xl px-4 py-2 text-sm font-medium text-slate-700 focus:ring-4 focus:ring-blue-500/20 focus:outline-none cursor-pointer disabled:opacity-50"
                >
                  <option value="deadline">Deadline (Soon First)</option>
                  <option value="amount">Award Amount (High to Low)</option>
                  <option value="newest">Newest First</option>
                  <option value="title">Title A-Z</option>
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
          <p class="loading-text">Loading scholarships...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <div class="error-icon">
            <X class="w-8 h-8" />
          </div>
          <h3 class="text-lg font-bold text-red-700 mb-2">Error Loading Scholarships</h3>
          <p class="error-message mb-4">{{ error }}</p>
          <button
            @click="fetchScholarships"
            class="px-6 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all duration-300 font-medium"
          >
            Try Again
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredScholarships.length === 0" class="text-center py-12">
          <div class="relative mx-auto w-24 h-24 mb-6">
            <div class="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl"></div>
            <div class="relative z-10 w-full h-full flex items-center justify-center">
              <GraduationCap class="w-12 h-12 text-slate-400" />
            </div>
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-2">No Scholarships Found</h3>
          <p class="text-slate-500 mb-6 max-w-md mx-auto">
            {{ searchQuery || Object.values(filters).some(f => f) ? 'Try adjusting your search criteria or filters to find more opportunities.' : 'No scholarship listings available at the moment. Check back soon for new opportunities!' }}
          </p>
          <button
            v-if="searchQuery || Object.values(filters).some(f => f)"
            @click="clearAllFilters"
            class="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all duration-300 font-medium hover:scale-105"
          >
            Clear All Filters
          </button>
        </div>

        <!-- Scholarships Grid -->
        <div v-else class="space-y-6">
          <div class="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            <div
              v-for="scholarship in paginatedScholarships"
              :key="scholarship.id || `scholarship-${Math.random()}`"
              class="scholarship-card group"
            >
              <!-- Card Background -->
              <div class="card-bg"></div>
              <div class="card-glow bg-gradient-to-r from-emerald-500/20 to-teal-500/20"></div>
              
              <!-- Scholarship Card Content -->
              <div class="card-content">
                <!-- Scholarship Header -->
                <div class="scholarship-header">
                  <div class="scholarship-main-info">
                    <h3 class="scholarship-title">
                      {{ scholarship.title || 'Untitled Scholarship' }}
                    </h3>
                    <p class="provider-name">{{ scholarship.provider || 'Provider' }}</p>
                  </div>
                  <div v-if="scholarship.amount" class="amount-badge">
                    {{ formatAmount(scholarship.amount, scholarship.currency || 'USD') }}
                  </div>
                </div>

                <!-- Scholarship Details -->
                <div class="scholarship-details">
                  <div v-if="scholarship.country" class="detail-item">
                    <Globe class="detail-icon" />
                    <span>{{ scholarship.country }}</span>
                  </div>
                  
                  <div v-if="scholarship.studyLevel" class="detail-item">
                    <GraduationCap class="detail-icon" />
                    <span>{{ scholarship.studyLevel }}</span>
                  </div>

                  <div v-if="scholarship.fieldOfStudy" class="detail-item">
                    <BookOpen class="detail-icon" />
                    <span>{{ scholarship.fieldOfStudy }}</span>
                  </div>

                  <div v-if="scholarship.deadline" class="detail-item" :class="getDeadlineClass(scholarship.deadline)">
                    <Clock class="detail-icon" />
                    <span>Deadline: {{ formatDeadline(scholarship.deadline) }}</span>
                  </div>
                </div>

                <!-- Scholarship Description Preview -->
                <div v-if="scholarship.description" class="scholarship-description">
                  <p class="line-clamp-3">{{ scholarship.description }}</p>
                </div>

                <!-- Tags -->
                <div class="scholarship-tags">
                  <span v-if="scholarship.type" class="tag tag-primary">
                    {{ scholarship.type }}
                  </span>
                  <span v-if="scholarship.duration" class="tag tag-secondary">
                    {{ scholarship.duration }}
                  </span>
                  <span class="tag" :class="getStatusTagClass(scholarship.deadline)">
                    {{ getApplicationStatus(scholarship.deadline) }}
                  </span>
                  <!-- Display additional tags from backend -->
                  <span 
                    v-for="tag in (scholarship.tags || []).slice(0, 2)" 
                    :key="tag" 
                    class="tag tag-outline"
                  >
                    {{ tag }}
                  </span>
                </div>

                <!-- Card Footer -->
                <div class="scholarship-footer">
                  <button
                    @click="openScholarshipModal(scholarship)"
                    class="view-details-btn"
                    :disabled="loading"
                  >
                    <span>View Details</span>
                    <ArrowRight class="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                  
                  <div class="scholarship-actions">
                    <button
                      @click="saveScholarship(scholarship)"
                      :class="[
                        'save-btn',
                        savedScholarships.includes( scholarship.id) ? 'saved' : ''
                      ]"
                      :title="savedScholarships.includes(scholarship.id) ? 'Remove from saved' : 'Save scholarship'"
                      :disabled="loading"
                    >
                      <Heart :fill="savedScholarships.includes(scholarship.id) ? 'currentColor' : 'none'" class="w-4 h-4" />
                    </button>
                    
                    <button
                      @click="applyToScholarship(scholarship)"
                      class="apply-btn"
                      :disabled="isDeadlinePassed(scholarship.deadline) || loading"
                    >
                      {{ isDeadlinePassed(scholarship.deadline) ? 'Expired' : 'Apply Now' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="filteredScholarships.length > scholarshipsPerPage" class="pagination-container">
            <div class="pagination-info">
              Showing {{ ((currentPage - 1) * scholarshipsPerPage) + 1 }} to {{ Math.min(currentPage * scholarshipsPerPage, filteredScholarships.length) }} of {{ filteredScholarships.length }} scholarships
            </div>
            
            <div class="pagination-controls">
              <button
                @click="prevPage"
                :disabled="currentPage === 1 || loading"
                class="pagination-btn"
              >
                <ChevronLeft class="w-4 h-4" />
                <span>Previous</span>
              </button>
              
              <div class="pagination-numbers">
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="goToPage(page)"
                  :disabled="loading"
                  :class="[
                    'page-btn',
                    page === currentPage ? 'active' : ''
                  ]"
                >
                  {{ page }}
                </button>
              </div>
              
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages || loading"
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

    <!-- Scholarship Details Modal -->
    <div v-if="viewingScholarship" class="scholarship-modal-overlay" @click="closeScholarshipModal">
      <div class="scholarship-modal" @click.stop>
        <div class="modal-backdrop"></div>
        
        <!-- Modal Header -->
        <div class="modal-header">
          <div class="modal-title-section">
            <h3 class="modal-title">{{ viewingScholarship.title || 'Scholarship Details' }}</h3>
            <p class="modal-provider">{{ viewingScholarship.provider || 'Provider' }}</p>
            <div class="title-decoration"></div>
          </div>
          <button @click="closeScholarshipModal" class="modal-close">
            <X class="w-6 h-6" />
          </button>
        </div>

        <!-- Modal Content -->
        <div class="modal-content">
          <div class="modal-scroll-area">
            <!-- Scholarship Information -->
            <div class="scholarship-details-content space-y-6">
              
              <!-- Basic Info -->
              <div class="details-section">
                <h4 class="section-title">Scholarship Information</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-if="viewingScholarship.amount" class="info-item">
                    <DollarSign class="info-icon" />
                    <span class="info-label">Award Amount:</span>
                    <span class="info-value">{{ formatAmount(viewingScholarship.amount, viewingScholarship.currency || 'USD') }}</span>
                  </div>
                  <div v-if="viewingScholarship.country" class="info-item">
                    <Globe class="info-icon" />
                    <span class="info-label">Country:</span>
                    <span class="info-value">{{ viewingScholarship.country }}</span>
                  </div>
                  <div v-if="viewingScholarship.studyLevel" class="info-item">
                    <GraduationCap class="info-icon" />
                    <span class="info-label">Study Level:</span>
                    <span class="info-value">{{ viewingScholarship.studyLevel }}</span>
                  </div>
                  <div v-if="viewingScholarship.fieldOfStudy" class="info-item">
                    <BookOpen class="info-icon" />
                    <span class="info-label">Field of Study:</span>
                    <span class="info-value">{{ viewingScholarship.fieldOfStudy }}</span>
                  </div>
                  <div v-if="viewingScholarship.deadline" class="info-item">
                    <Clock class="info-icon" />
                    <span class="info-label">Application Deadline:</span>
                    <span class="info-value" :class="getDeadlineClass(viewingScholarship.deadline)">
                      {{ formatDeadline(viewingScholarship.deadline) }}
                    </span>
                  </div>
                  <div v-if="viewingScholarship.duration" class="info-item">
                    <Calendar class="info-icon" />
                    <span class="info-label">Duration:</span>
                    <span class="info-value">{{ viewingScholarship.duration }}</span>
                  </div>
                  <div v-if="viewingScholarship.website" class="info-item">
                    <ArrowRight class="info-icon" />
                    <span class="info-label">Website:</span>
                    <a :href="viewingScholarship.website" target="_blank" class="info-value text-emerald-600 hover:text-emerald-700 underline">
                      Visit Application Portal
                    </a>
                  </div>
                  <div v-if="viewingScholarship.contactEmail" class="info-item">
                    <ArrowRight class="info-icon" />
                    <span class="info-label">Contact:</span>
                    <a :href="`mailto:${viewingScholarship.contactEmail}`" class="info-value text-emerald-600 hover:text-emerald-700 underline">
                      {{ viewingScholarship.contactEmail }}
                    </a>
                  </div>
                </div>
              </div>

              <!-- Description -->
              <div v-if="viewingScholarship.description" class="details-section">
                <h4 class="section-title">Description</h4>
                <div class="description-content">
                  <p class="whitespace-pre-line">{{ viewingScholarship.description }}</p>
                </div>
              </div>

              <!-- Requirements -->
              <div v-if="viewingScholarship.requirements && viewingScholarship.requirements.length > 0" class="details-section">
                <h4 class="section-title">Requirements</h4>
                <div class="description-content">
                  <ul class="list-disc pl-5 space-y-1">
                    <li v-for="requirement in viewingScholarship.requirements" :key="requirement">
                      {{ requirement }}
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Benefits -->
              <div v-if="viewingScholarship.benefits && viewingScholarship.benefits.length > 0" class="details-section">
                <h4 class="section-title">Benefits</h4>
                <div class="description-content">
                  <ul class="list-disc pl-5 space-y-1">
                    <li v-for="benefit in viewingScholarship.benefits" :key="benefit">
                      {{ benefit }}
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Eligibility -->
              <div v-if="viewingScholarship.eligibility" class="details-section">
                <h4 class="section-title">Eligibility Criteria</h4>
                <div class="description-content">
                  <p class="whitespace-pre-line">{{ viewingScholarship.eligibility }}</p>
                </div>
              </div>

              <!-- How to Apply -->
              <div v-if="viewingScholarship.howToApply" class="details-section">
                <h4 class="section-title">How to Apply</h4>
                <div class="description-content">
                  <p class="whitespace-pre-line">{{ viewingScholarship.howToApply }}</p>
                </div>
              </div>

              <!-- Actions -->
              <div class="details-actions">
                <button
                  @click="closeScholarshipModal"
                  class="btn-secondary"
                >
                  Close
                </button>
                <button
                  @click="applyToScholarship(viewingScholarship)"
                  class="btn-primary"
                  :disabled="isDeadlinePassed(viewingScholarship.deadline)"
                >
                  {{ isDeadlinePassed(viewingScholarship.deadline) ? 'Application Closed' : 'Apply Now' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import MessagePopup from '~/shared/components/message/MessagePopup.vue'
import Sidebar from '@/features/dashboard/components/dashboard-sidebar.vue'

// Import icons
import {
  Search,
  Filter,
  Globe,
  GraduationCap,
  BookOpen,
  Clock,
  ChevronRight,
  ChevronLeft,
  X,
  ArrowRight,
  Heart,
  DollarSign,
  Calendar
} from 'lucide-vue-next'

// Page metadata
definePageMeta({
  layout: 'dashboard'
})

// API Configuration
const API_BASE_URL = 'https://dark-caldron-448714-u5.uc.r.appspot.com'

// Type definitions
interface Scholarship {
  id?: string;
  title?: string;
  provider?: string;
  country?: string;
  studyLevel?: string;
  fieldOfStudy?: string;
  amount?: number;
  currency?: string;
  deadline?: string;
  description?: string;
  eligibility?: string;
  howToApply?: string;
  type?: string;
  duration?: string;
  requirements?: string[];
  benefits?: string[];
  tags?: string[];
  website?: string;
  contactEmail?: string;
  created_at?: string;
  createdAt?: string;
}

// Composables and stores
const authStore = useAuthStore()

// Refs
const alertRef = ref<InstanceType<typeof MessagePopup> | null>(null)

// User data
const user = computed(() => authStore.getUser)

// State management
const loading = ref<boolean>(false)
const error = ref<string | null>(null)
const allScholarships = ref<Scholarship[]>([])
const viewingScholarship = ref<Scholarship | null>(null)
const searchQuery = ref<string>('')
const showFilters = ref<boolean>(false)
const currentPage = ref<number>(1)
const scholarshipsPerPage = ref<number>(12)
const sortBy = ref<string>('deadline')
const savedScholarships = ref<string[]>([])

// Filters
const filters = ref({
  country: '',
  studyLevel: '',
  fieldOfStudy: '',
  status: ''
})

// Computed properties for filtering and pagination
const filteredScholarships = computed(() => {
  let result = [...allScholarships.value]

  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    result = result.filter(scholarship => 
      scholarship.title?.toLowerCase().includes(query) ||
      scholarship.provider?.toLowerCase().includes(query) ||
      scholarship.description?.toLowerCase().includes(query) ||
      scholarship.country?.toLowerCase().includes(query) ||
      scholarship.fieldOfStudy?.toLowerCase().includes(query)
    )
  }

  // Apply other filters
  if (filters.value.country) {
    result = result.filter(s => s.country === filters.value.country)
  }
  if (filters.value.studyLevel) {
    result = result.filter(s => s.studyLevel === filters.value.studyLevel)
  }
  if (filters.value.fieldOfStudy) {
    result = result.filter(s => s.fieldOfStudy === filters.value.fieldOfStudy)
  }
  if (filters.value.status) {
    result = result.filter(s => {
      const status = getApplicationStatus(s.deadline || '')
      switch (filters.value.status) {
        case 'open': return status === 'Open'
        case 'closing-soon': return status === 'Closing Soon'
        case 'closed': return status === 'Closed'
        default: return true
      }
    })
  }

  // Apply sorting
  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'deadline':
        const dateA = new Date(a.deadline || '9999-12-31').getTime()
        const dateB = new Date(b.deadline || '9999-12-31').getTime()
        return dateA - dateB
      case 'amount':
        return (b.amount || 0) - (a.amount || 0)
      case 'newest':
        const createdA = new Date(a.created_at || a.createdAt || '1970-01-01').getTime()
        const createdB = new Date(b.created_at || b.createdAt || '1970-01-01').getTime()
        return createdB - createdA
      case 'title':
        return (a.title || '').localeCompare(b.title || '')
      default:
        return 0
    }
  })

  return result
})

const paginatedScholarships = computed(() => {
  const start = (currentPage.value - 1) * scholarshipsPerPage.value
  const end = start + scholarshipsPerPage.value
  return filteredScholarships.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredScholarships.value.length / scholarshipsPerPage.value))
})

const visiblePages = computed(() => {
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

const uniqueCountries = computed(() => {
  return [...new Set(allScholarships.value.map(s => s.country).filter(Boolean))].sort()
})

const uniqueStudyLevels = computed(() => {
  return [...new Set(allScholarships.value.map(s => s.studyLevel).filter(Boolean))].sort()
})

const uniqueFields = computed(() => {
  return [...new Set(allScholarships.value.map(s => s.fieldOfStudy).filter(Boolean))].sort()
})

// API Helper Functions
const apiCall = async (endpoint: string, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  const token = localStorage.getItem('token') || ''
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  }
  
  const response = await fetch(url, { ...defaultOptions, ...options })
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
  }
  
  return response.json()
}

// Utility Functions
const formatAmount = (amount: number, currency = 'USD'): string => {
  if (!amount || amount === 0) return 'Amount not specified'
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(amount)
  } catch (error) {
    // Fallback if currency is invalid
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount)
  }
}

const formatDeadline = (deadline: string): string => {
  if (!deadline) return 'No deadline specified'
  
  try {
    const date = new Date(deadline)
    if (isNaN(date.getTime())) return 'Invalid date'
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    return 'Invalid date'
  }
}

const isDeadlinePassed = (deadline: string): boolean => {
  if (!deadline) return false
  
  try {
    const deadlineDate = new Date(deadline)
    const now = new Date()
    return deadlineDate < now
  } catch (error) {
    return false
  }
}

const getDeadlineClass = (deadline: string): string => {
  if (!deadline) return ''
  
  try {
    const deadlineDate = new Date(deadline)
    const now = new Date()
    const daysUntil = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysUntil < 0) return 'text-red-600'
    if (daysUntil <= 30) return 'text-orange-600'
    return 'text-slate-600'
  } catch (error) {
    return ''
  }
}

const getApplicationStatus = (deadline: string): string => {
  if (!deadline) return 'Open'
  
  try {
    const deadlineDate = new Date(deadline)
    const now = new Date()
    const daysUntil = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysUntil < 0) return 'Closed'
    if (daysUntil <= 30) return 'Closing Soon'
    return 'Open'
  } catch (error) {
    return 'Unknown'
  }
}

const getStatusTagClass = (deadline: string): string => {
  const status = getApplicationStatus(deadline)
  switch (status) {
    case 'Closed': return 'tag-danger'
    case 'Closing Soon': return 'tag-warning'
    default: return 'tag-success'
  }
}

// Debounce function
function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// API Methods
const fetchScholarships = async (): Promise<void> => {
  loading.value = true
  error.value = null
  
  try {
    console.log('Fetching scholarships from API...')
    
    const response = await apiCall('/scholarship/all')
    console.log('API Response:', response)
    
    if (response && response.success) {
      // Handle different possible response structures
      let scholarshipData = []
      
      if (Array.isArray(response.data)) {
        scholarshipData = response.data
      } else if (Array.isArray(response.scholarships)) {
        scholarshipData = response.scholarships
      } else if (Array.isArray(response.results)) {
        scholarshipData = response.results
      } else if (Array.isArray(response)) {
        scholarshipData = response
      } else {
        console.warn('Unexpected API response structure:', response)
        scholarshipData = []
      }
      
      // Force reactive update
      allScholarships.value = [...scholarshipData]
      await nextTick()
      
      console.log('Scholarships loaded:', allScholarships.value.length)
    } else {
      throw new Error(response?.message)
    }
  } catch (err: any) {
    console.error('Error fetching scholarships:', err)
    error.value = handleApiError(err)
    
    alertRef.value?.error('Failed to load scholarship opportunities', {
      title: 'Loading Error',
      duration: 4000
    })
  } finally {
    loading.value = false
  }
}

const getScholarshipDetails = async (scholarshipId: string) => {
  try {
    const response = await apiCall(`/scholarship/single/${scholarshipId}`)
    
    if (response.success) {
      return response.data
    } else {
      throw new Error(response.message)
    }
  } catch (err: any) {
    console.error('Error fetching scholarship details:', err)
    alertRef.value?.error('Failed to load scholarship details', {
      title: 'Loading Error',
      duration: 3000
    })
    throw err
  }
}

// Error handling
const handleApiError = (error: any): string => {
  console.error('API error:', error)
  
  if (error.message.includes('Failed to fetch')) {
    return 'Network connection failed. Please check your internet connection.'
  } else if (error.message.includes('401')) {
    return 'Session expired. Please log in again.'
  } else if (error.message.includes('403')) {
    return 'You do not have permission to access this resource.'
  } else if (error.message.includes('404')) {
    return 'The requested resource was not found.'
  } else if (error.message.includes('500')) {
    return 'Server error. Please try again later.'
  }
  
  return error.message || 'An unexpected error occurred.'
}

// Search with debouncing
const handleSearch = debounce(() => {
  currentPage.value = 1
}, 300)

// Filter and sorting methods
const applyFilters = (): void => {
  currentPage.value = 1
}

const applySorting = (): void => {
  currentPage.value = 1
}

const clearFilters = (): void => {
  filters.value = {
    country: '',
    studyLevel: '',
    fieldOfStudy: '',
    status: ''
  }
  currentPage.value = 1
}

const clearAllFilters = (): void => {
  searchQuery.value = ''
  filters.value = {
    country: '',
    studyLevel: '',
    fieldOfStudy: '',
    status: ''
  }
  currentPage.value = 1
}

// Pagination methods
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// Modal and interaction methods
const openScholarshipModal = async (scholarship: Scholarship): Promise<void> => {
  try {
    // Fetch fresh scholarship details if we have an ID
    const scholarshipId = scholarship.id
    if (scholarshipId) {
      const freshData = await getScholarshipDetails(scholarshipId)
      viewingScholarship.value = freshData
    } else {
      // Fallback to existing data
      viewingScholarship.value = scholarship
    }
  } catch (err) {
    // Fallback to existing data if API call fails
    viewingScholarship.value = scholarship
  }
}

const closeScholarshipModal = (): void => {
  viewingScholarship.value = null
}

const saveScholarship = (scholarship: Scholarship): void => {
  const scholarshipId = scholarship.id
  if (!scholarshipId) return

  const index = savedScholarships.value.indexOf(scholarshipId)
  if (index > -1) {
    savedScholarships.value.splice(index, 1)
    alertRef.value?.success('Scholarship removed from saved', {
      title: 'Removed',
      duration: 2000
    })
  } else {
    savedScholarships.value.push(scholarshipId)
    alertRef.value?.success('Scholarship saved successfully', {
      title: 'Saved',
      duration: 2000
    })
  }
  
  // Store in localStorage
  localStorage.setItem('savedScholarships', JSON.stringify(savedScholarships.value))
}

const applyToScholarship = (scholarship: Scholarship): void => {
  if (isDeadlinePassed(scholarship.deadline || '')) {
    alertRef.value?.error('Application deadline has passed', {
      title: 'Application Closed',
      duration: 3000
    })
    return
  }

  // Redirect to application portal if available
  if (scholarship.website) {
    window.open(scholarship.website, '_blank')
  } else if (scholarship.howToApply) {
    alertRef.value?.info(scholarship.howToApply, {
      title: 'How to Apply',
      duration: 5000
    })
  } else if (scholarship.contactEmail) {
    window.open(`mailto:${scholarship.contactEmail}?subject=Scholarship Application Inquiry - ${scholarship.title}`, '_blank')
  } else {
    alertRef.value?.info('Contact the provider for application details', {
      title: 'Apply for Scholarship',
      duration: 3000
    })
  }
}

// Lifecycle
onMounted(async (): Promise<void> => {
  if (!authStore.isAuthenticated || !user.value?.id) {
    alertRef.value?.error('Please log in to access this page', {
      title: 'Authentication Required',
      duration: 0
    })
    await navigateTo('/auth/login')
    return
  }

  // Load saved scholarships from localStorage
  const saved = localStorage.getItem('savedScholarships')
  if (saved) {
    try {
      savedScholarships.value = JSON.parse(saved)
    } catch (err) {
      console.error('Failed to parse saved scholarships:', err)
    }
  }

  // Fetch initial data
  await fetchScholarships()
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
    @apply text-3xl font-black bg-gradient-to-r from-slate-900 via-emerald-800 to-teal-800 bg-clip-text text-transparent;
    font-variant: small-caps;
    letter-spacing: -0.025em;
}

.welcome-message {
    @apply text-sm font-medium text-slate-600 mt-1;
}

.user-highlight {
    @apply font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent;
}

.header-decorations {
    @apply absolute -inset-4 pointer-events-none;
}

.floating-orb {
    @apply absolute w-1 h-1 rounded-full opacity-20;
    animation: float 6s ease-in-out infinite;
}

.orb-1 {
    @apply bg-emerald-400 top-2 right-8;
    animation-delay: 0s;
}

.orb-2 {
    @apply bg-teal-400 top-8 right-4;
    animation-delay: 2s;
}

.orb-3 {
    @apply bg-green-400 top-6 right-12;
    animation-delay: 4s;
}

.header-actions {
    @apply flex items-center space-x-4;
}

.action-btn {
    @apply relative px-4 py-2 rounded-2xl font-medium text-sm transition-all duration-300;
    @apply hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed;
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
    @apply w-full appearance-none bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl px-4 py-3 pl-12 text-sm font-medium text-slate-700 focus:ring-4 focus:ring-emerald-500/20 focus:outline-none cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed;
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

/* Scholarship Cards */
.scholarship-card {
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

.scholarship-card:hover .card-glow {
    @apply opacity-100;
}

.card-content {
    @apply relative z-10 p-6 space-y-6;
}

.scholarship-header {
    @apply flex items-start justify-between;
}

.scholarship-main-info {
    @apply flex-1 min-w-0;
}

.scholarship-title {
    @apply text-lg font-bold text-slate-900 mb-1 line-clamp-2;
}

.provider-name {
    @apply text-emerald-600 font-semibold;
}

.amount-badge {
    @apply inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25;
}

.scholarship-details {
    @apply space-y-2;
}

.detail-item {
    @apply flex items-center text-sm text-slate-600;
}

.detail-icon {
    @apply w-4 h-4 mr-3 flex-shrink-0;
}

.scholarship-description {
    @apply text-sm text-slate-600 leading-relaxed;
}

.scholarship-tags {
    @apply flex flex-wrap gap-2;
}

.tag {
    @apply inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium;
}

.tag-primary {
    @apply bg-emerald-100 text-emerald-700;
}

.tag-secondary {
    @apply bg-slate-100 text-slate-700;
}

.tag-outline {
    @apply bg-transparent border border-slate-300 text-slate-600;
}

.tag-success {
    @apply bg-green-100 text-green-700;
}

.tag-warning {
    @apply bg-orange-100 text-orange-700;
}

.tag-danger {
    @apply bg-red-100 text-red-700;
}

.scholarship-footer {
    @apply flex items-center justify-between;
}

.view-details-btn {
    @apply flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-all duration-200 space-x-2 disabled:opacity-50 disabled:cursor-not-allowed;
}

.scholarship-actions {
    @apply flex items-center space-x-3;
}

.save-btn {
    @apply p-2 rounded-full transition-all duration-300 text-slate-400 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed;
}

.save-btn.saved {
    @apply text-red-500;
}

.apply-btn {
    @apply px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-sm font-bold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:scale-105;
    @apply disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100;
}

/* Modal Styles */
.scholarship-modal-overlay {
    @apply fixed inset-0 bg-black/60 flex items-center justify-center p-4;
    backdrop-filter: blur(8px);
    z-index: 1000;
    animation: modalFadeIn 0.2s ease-out;
}

.scholarship-modal {
    @apply relative bg-white/95 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden;
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    animation: modalSlideIn 0.3s ease-out;
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

.modal-provider {
    @apply text-lg font-semibold text-emerald-600;
}

.title-decoration {
    @apply w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full;
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

.scholarship-details-content {
    @apply space-y-6;
}

.details-section {
    @apply p-6 bg-slate-50/50 rounded-2xl border border-slate-200/60;
    backdrop-filter: blur(10px);
}

.section-title {
    @apply flex items-center space-x-3 text-lg font-bold text-slate-900 pb-4 border-b border-slate-200/60;
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
    @apply text-slate-700 leading-relaxed text-sm space-y-3;
}

.details-actions {
    @apply flex items-center justify-end space-x-4 pt-6 border-t border-slate-200/60;
}

.btn-primary {
    @apply flex items-center justify-center px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold rounded-2xl;
    @apply hover:from-emerald-700 hover:to-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/20;
    @apply disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105;
}

.btn-secondary {
    @apply px-8 py-3 bg-white/70 text-slate-700 font-bold rounded-2xl border border-slate-300/60 backdrop-blur-xl;
    @apply hover:bg-slate-50/70 focus:outline-none focus:ring-4 focus:ring-slate-500/20;
    @apply disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300;
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
    @apply px-3 py-2 text-sm font-bold rounded-xl transition-all duration-300 backdrop-blur-xl disabled:opacity-50 disabled:cursor-not-allowed;
}

.page-btn:not(.active) {
    @apply text-slate-600 bg-white/60 border border-white/40 hover:bg-slate-50/70;
}

.page-btn.active {
    @apply bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-500/25;
}

/* Loading States */
.loading-state {
    @apply flex flex-col items-center justify-center py-16 space-y-4;
}

.loading-spinner {
    @apply w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full;
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

/* Animations */
@keyframes modalFadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes modalSlideIn {
    from {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-6px); }
}

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
    .scholarship-card,
    .apply-btn {
        animation: none;
    }
    .scholarship-card:hover {
        transform: none;
    }
}
</style>