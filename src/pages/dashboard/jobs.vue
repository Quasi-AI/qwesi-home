<!-- pages/dashboard/jobs.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <div class="flex items-center justify-between">
            <BackButton class="mb-4" />
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Job Opportunities</h1>
              <p class="mt-1 text-sm text-gray-500">
                Discover your next career opportunity
              </p>
            </div>
            <div class="flex items-center space-x-4">
              <div class="relative">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search jobs..."
                  class="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  @input="handleSearch"
                />
                <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button
                @click="showFilters = !showFilters"
                class="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters Panel -->
    <div v-if="showFilters" class="bg-white border-b border-gray-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Location Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <select v-model="filters.location" @change="applyFilters" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">All Locations</option>
              <option v-for="location in uniqueLocations" :key="location" :value="location">
                {{ location }}
              </option>
            </select>
          </div>

          <!-- Sector Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Sector</label>
            <select v-model="filters.sector" @change="applyFilters" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">All Sectors</option>
              <option v-for="sector in uniqueSectors" :key="sector" :value="sector">
                {{ sector }}
              </option>
            </select>
          </div>

          <!-- Experience Level Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
            <select v-model="filters.experience_level" @change="applyFilters" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">All Levels</option>
              <option v-for="level in uniqueExperienceLevels" :key="level" :value="level">
                {{ level }}
              </option>
            </select>
          </div>

          <!-- Clear Filters -->
          <div class="flex items-end">
            <button
              @click="clearFilters"
              class="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Bar -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between text-sm text-gray-600">
          <span>{{ filteredJobs.length }} job{{ filteredJobs.length !== 1 ? 's' : '' }} found</span>
          <div class="flex items-center space-x-4">
            <span>Sort by:</span>
            <select v-model="sortBy" @change="applySorting" class="border border-gray-300 rounded px-2 py-1 text-sm">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Job Title A-Z</option>
              <option value="company">Company A-Z</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="text-red-600 mb-4">
          <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Error Loading Jobs</h3>
        <p class="text-gray-500 mb-4">{{ error }}</p>
        <button
          @click="fetchJobs"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredJobs.length === 0" class="text-center py-12">
        <div class="text-gray-400 mb-4">
          <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6.5" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No Jobs Found</h3>
        <p class="text-gray-500 mb-4">
          {{ searchQuery || Object.values(filters).some(f => f) ? 'Try adjusting your search or filters' : 'No job listings available at the moment' }}
        </p>
        <button
          v-if="searchQuery || Object.values(filters).some(f => f)"
          @click="clearAllFilters"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Clear All Filters
        </button>
      </div>

      <!-- Jobs Grid -->
      <div v-else class="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <div
          v-for="job in paginatedJobs"
          :key="job._id"
          class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-blue-200"
        >
          <!-- Job Card Header -->
          <div class="p-6 pb-4">
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                  {{ job.title || 'Untitled Position' }}
                </h3>
                <p class="text-blue-600 font-medium">{{ job.employer || 'Company Name' }}</p>
              </div>
              <div class="ml-4 flex-shrink-0">
                <span v-if="job.salary" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {{ job.salary }}
                </span>
              </div>
            </div>

            <!-- Job Details -->
            <div class="space-y-2 mb-4">
              <div v-if="job.location" class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {{ job.location }}
              </div>
              
              <div v-if="job.sector" class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {{ job.sector }}
              </div>

              <div v-if="job.experience_level" class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {{ job.experience_level }}
              </div>

              <div v-if="job.posted" class="flex items-center text-sm text-gray-500">
                <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Posted {{ formatDate(job.posted) }}
              </div>
            </div>

            <!-- Job Description Preview -->
            <div v-if="job.job_description" class="mb-4">
              <p class="text-sm text-gray-600 line-clamp-3">
                {{ job.job_description }}
              </p>
            </div>

            <!-- Tags -->
            <div class="flex flex-wrap gap-2 mb-4">
              <span v-if="job.field" class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700">
                {{ job.field }}
              </span>
              <span v-if="job.experience_length" class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                {{ job.experience_length }}
              </span>
            </div>
          </div>

          <!-- Job Card Footer -->
          <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-lg">
            <div class="flex items-center justify-between">
              <button
                @click="viewJob(job)"
                class="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                View Details
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <div class="flex items-center space-x-2">
                <button
                  @click="saveJob(job)"
                  :class="[
                    'p-2 rounded-full transition-colors',
                    savedJobs.includes(job._id)
                      ? 'text-red-600 hover:text-red-700'
                      : 'text-gray-400 hover:text-red-600'
                  ]"
                  :title="savedJobs.includes(job._id) ? 'Remove from saved' : 'Save job'"
                >
                  <svg class="w-4 h-4" :fill="savedJobs.includes(job._id) ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
                
                <button
                  @click="applyToJob(job)"
                  class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="filteredJobs.length > jobsPerPage" class="mt-8 flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Showing {{ ((currentPage - 1) * jobsPerPage) + 1 }} to {{ Math.min(currentPage * jobsPerPage, filteredJobs.length) }} of {{ filteredJobs.length }} jobs
        </div>
        
        <div class="flex items-center space-x-2">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div class="flex items-center space-x-1">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="currentPage = page"
              :class="[
                'px-3 py-2 text-sm font-medium rounded-lg',
                page === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
              ]"
            >
              {{ page }}
            </button>
          </div>
          
          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Job Details Modal -->
    <div v-if="selectedJob" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeModal">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-lg bg-white" @click.stop>
        <!-- Modal Header -->
        <div class="flex items-center justify-between pb-4 border-b border-gray-200">
          <div>
            <h3 class="text-2xl font-bold text-gray-900">{{ selectedJob.title }}</h3>
            <p class="text-lg text-blue-600 font-medium">{{ selectedJob.employer }}</p>
          </div>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Modal Content -->
        <div class="py-6 max-h-96 overflow-y-auto">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Job Details -->
            <div>
              <h4 class="text-lg font-semibold text-gray-900 mb-4">Job Details</h4>
              <div class="space-y-3">
                <div v-if="selectedJob.location">
                  <span class="font-medium text-gray-700">Location:</span>
                  <span class="ml-2 text-gray-600">{{ selectedJob.location }}</span>
                </div>
                <div v-if="selectedJob.sector">
                  <span class="font-medium text-gray-700">Sector:</span>
                  <span class="ml-2 text-gray-600">{{ selectedJob.sector }}</span>
                </div>
                <div v-if="selectedJob.salary">
                  <span class="font-medium text-gray-700">Salary:</span>
                  <span class="ml-2 text-gray-600">{{ selectedJob.salary }}</span>
                </div>
                <div v-if="selectedJob.experience_level">
                  <span class="font-medium text-gray-700">Experience Level:</span>
                  <span class="ml-2 text-gray-600">{{ selectedJob.experience_level }}</span>
                </div>
                <div v-if="selectedJob.experience_length">
                  <span class="font-medium text-gray-700">Experience Required:</span>
                  <span class="ml-2 text-gray-600">{{ selectedJob.experience_length }}</span>
                </div>
                <div v-if="selectedJob.field">
                  <span class="font-medium text-gray-700">Field:</span>
                  <span class="ml-2 text-gray-600">{{ selectedJob.field }}</span>
                </div>
                <div v-if="selectedJob.posted">
                  <span class="font-medium text-gray-700">Posted:</span>
                  <span class="ml-2 text-gray-600">{{ formatDate(selectedJob.posted) }}</span>
                </div>
              </div>
            </div>

            <!-- Requirements -->
            <div>
              <h4 class="text-lg font-semibold text-gray-900 mb-4">Requirements</h4>
              <div class="space-y-3">
                <div v-if="selectedJob.qualifications">
                  <span class="font-medium text-gray-700">Qualifications:</span>
                  <p class="mt-1 text-gray-600">{{ selectedJob.qualifications }}</p>
                </div>
                <div v-if="selectedJob.minimum">
                  <span class="font-medium text-gray-700">Minimum Requirements:</span>
                  <p class="mt-1 text-gray-600">{{ selectedJob.minimum }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Job Description -->
          <div v-if="selectedJob.job_description" class="mt-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-4">Job Description</h4>
            <div class="prose prose-sm max-w-none text-gray-600">
              <p class="whitespace-pre-wrap">{{ selectedJob.job_description }}</p>
            </div>
          </div>

          <!-- Contact Information -->
          <div v-if="selectedJob.email" class="mt-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-4">Contact Information</h4>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span class="text-gray-700">{{ selectedJob.email }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex items-center justify-end pt-4 border-t border-gray-200 space-x-4">
          <button
            @click="saveJob(selectedJob)"
            :class="[
              'flex items-center px-4 py-2 border rounded-lg font-medium transition-colors',
              savedJobs.includes(selectedJob._id)
                ? 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100'
                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
            ]"
          >
            <svg class="w-4 h-4 mr-2" :fill="savedJobs.includes(selectedJob._id) ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {{ savedJobs.includes(selectedJob._id) ? 'Remove from Saved' : 'Save Job' }}
          </button>
          
          <button
            v-if="selectedJob.url"
            @click="openExternalLink(selectedJob.url)"
            class="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Visit Job Page
          </button>
          
          <button
            @click="applyToJob(selectedJob)"
            class="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Apply Now
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import BackButton from '@/shared/components/ui/back-button.vue'
const { $message } = useNuxtApp()
// Page metadata
definePageMeta({
  layout: 'dashboard'
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

  // Location filter
  if (filters.value.location) {
    filtered = filtered.filter(job => job.location === filters.value.location)
  }

  // Sector filter
  if (filters.value.sector) {
    filtered = filtered.filter(job => job.sector === filters.value.sector)
  }

  // Experience level filter
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
  currentPage.value = 1
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

const viewJob = (job) => {
  selectedJob.value = job
}

const closeModal = () => {
  selectedJob.value = null
}

const saveJob = (job) => {
  const index = savedJobs.value.indexOf(job._id)
  if (index > -1) {
    savedJobs.value.splice(index, 1)
  } else {
    savedJobs.value.push(job._id)
  }
  
  // Save to localStorage
  localStorage.setItem('savedJobs', JSON.stringify(savedJobs.value))
}


// Enhanced version with better email template based on job details
const applyToJob = async (job) => {
  try {
    // Priority 1: External application URL
    if (job.url && job.url.trim()) {
      // Track application attempt (optional)
      trackJobApplication(job.id, 'external_url')
      
      window.open(job.url, '_blank')
      
      // Show success message
      showNotification('Application opened in new tab!', 'success')
      return
    }
    
    // Priority 2: Email application with enhanced template
    if (job.email && job.email.trim()) {
      // Track application attempt (optional)
      trackJobApplication(job.id, 'email')
      
      const emailData = createEmailApplication(job)
      
      // Create mailto link
      const mailtoLink = `mailto:${job.email}?subject=${emailData.subject}&body=${emailData.body}`
      
      // Check if mailto link is too long (some email clients have limits)
      if (mailtoLink.length > 2000) {
        // Use shorter template
        const shortMailto = `mailto:${job.email}?subject=${encodeURIComponent(`Application for ${job.title}`)}`
        window.location.href = shortMailto
      } else {
        window.location.href = mailtoLink
      }
      
      // Show instructions modal
      showEmailInstructions(job)
      return
    }
    
    // Priority 3: Phone application
    if (job.phone && job.phone.trim()) {
      const confirmCall = confirm(`Would you like to call ${job.employer || 'the employer'} at ${job.phone}?`)
      if (confirmCall) {
        window.location.href = `tel:${job.phone}`
      }
      return
    }
    
    // Priority 4: Internal application system
    if (job.id) {
      showApplicationModal(job)
      return
    }
    
    // Priority 5: No application method available
    showErrorModal('No application method available', 'Please contact support for assistance with this job application.')
    
  } catch (err) {
    console.error('Error applying to job:', err)
    showErrorModal('Application Error', 'Error submitting application. Please try again.')
  }
}

// Helper function to create email application content
const createEmailApplication = (job) => {
  const subject = encodeURIComponent(`Application for ${job.title} Position`)
  
  const bodyTemplate = `Dear ${job.employer || 'Hiring Manager'},

I am writing to apply for the ${job.title} position at ${job.company || 'your company'}.

${job.location ? `I am particularly interested in this ${job.location} based opportunity.` : ''}

Key qualifications I bring:
• Strong background in relevant skills
• Enthusiasm for ${job.industry || 'the industry'}
• Commitment to excellence and team collaboration

${job.salary ? `I understand the position offers ${job.salary} compensation.` : ''}

I have attached my resume and would welcome the opportunity to discuss how my experience aligns with your needs. I am available for an interview at your convenience.

Thank you for considering my application.

Best regards,
[Your Name]
[Your Phone Number]
[Your Email Address]

---
Applied via Qwesi Job Portal
Job Reference: ${job.id || 'N/A'}`

  return {
    subject,
    body: encodeURIComponent(bodyTemplate)
  }
}

// Helper function to show email instructions
const showEmailInstructions = (job) => {
  const modal = document.createElement('div')
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
  modal.innerHTML = `
    <div class="bg-white rounded-lg p-6 max-w-md mx-4">
      <h3 class="text-lg font-semibold mb-4">Email Application Opened!</h3>
      <p class="text-gray-600 mb-4">
        Your email client should have opened with a pre-filled application email to <strong>${job.email}</strong>.
      </p>
      <p class="text-sm text-gray-500 mb-4">
        If your email client didn't open automatically, please send an email to:<br>
        <a href="mailto:${job.email}" class="text-blue-600 underline">${job.email}</a>
      </p>
      <div class="flex space-x-3">
        <button onclick="this.closest('.fixed').remove()" 
                class="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
          Close
        </button>
        <button onclick="window.location.href='mailto:${job.email}'; this.closest('.fixed').remove()" 
                class="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Open Email Again
        </button>
      </div>
    </div>
  `
  document.body.appendChild(modal)
  
  // Auto remove after 10 seconds
  setTimeout(() => {
    if (document.body.contains(modal)) {
      modal.remove()
    }
  }, 10000)
}

// Helper function to show application modal for internal applications
const showApplicationModal = (job) => {
  const modal = document.createElement('div')
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
  modal.innerHTML = `
    <div class="bg-white rounded-lg p-6 max-w-lg mx-4">
      <h3 class="text-lg font-semibold mb-4">Apply for ${job.title}</h3>
      <form id="applicationForm" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2">Full Name</label>
          <input type="text" name="name" required class="w-full border rounded px-3 py-2">
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Email</label>
          <input type="email" name="email" required class="w-full border rounded px-3 py-2">
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Phone</label>
          <input type="tel" name="phone" class="w-full border rounded px-3 py-2">
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Cover Message</label>
          <textarea name="message" rows="4" class="w-full border rounded px-3 py-2" 
                    placeholder="Tell us why you're interested in this position..."></textarea>
        </div>
        <div class="flex space-x-3">
          <button type="button" onclick="this.closest('.fixed').remove()" 
                  class="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
            Cancel
          </button>
          <button type="submit" 
                  class="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Submit Application
          </button>
        </div>
      </form>
    </div>
  `
  document.body.appendChild(modal)
  
  // Handle form submission
  document.getElementById('applicationForm').addEventListener('submit', async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    
    try {
      // Submit application to your backend
      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: job.id,
          applicantName: formData.get('name'),
          applicantEmail: formData.get('email'),
          applicantPhone: formData.get('phone'),
          message: formData.get('message')
        })
      })
      
      if (response.ok) {
        modal.remove()
        showNotification('Application submitted successfully!', 'success')
      } else {
        throw new Error('Failed to submit application')
      }
    } catch (error) {
      showNotification('Error submitting application. Please try again.', 'error')
    }
  })
}

// Helper functions for notifications and error handling
const showNotification = (message, type = 'info') => {
  $message.success(
    'Information',
    `${message}`,
    {
      duration: 6000,
      actions: [
        {
          label: 'View Details',
          callback: () => console.log('Viewing details...'),
        }
      ]
    }
  )
}



const showErrorModal = (title, message) => {
    $message.error(
    `${title}`,
    `${message}`,
    {
      persistent: false,
      duration: 8000,
      actions: [
        {
          label: 'Retry',
          callback: () => console.log('Retrying...'),
        },
        {
          label: 'Cancel',
          callback: () => console.log('Cancelled'),
        }
      ]
    }
  )
}

const trackJobApplication = (jobId, method) => {
  // Optional: Track application attempts for analytics
  console.log(`Job application: ${jobId} via ${method}`)
  
  // You can send this to your analytics service
  // analytics.track('job_application_started', { jobId, method })
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

// Watchers
watch(() => filteredJobs.value.length, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = Math.max(1, totalPages.value)
  }
})

// Lifecycle
onMounted(() => {
  fetchJobs()
  
  // Load saved jobs from localStorage
  const saved = localStorage.getItem('savedJobs')
  if (saved) {
    try {
      savedJobs.value = JSON.parse(saved)
    } catch {
      savedJobs.value = []
    }
  }
})
</script>

<style scoped>
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

.prose {
  max-width: none;
}
</style>