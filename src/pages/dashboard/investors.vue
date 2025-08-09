<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <div class="flex items-center justify-between">
            <BackButton class="mb-4" />
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Investors</h1>
              <p class="mt-1 text-sm text-gray-500">
                Manage and view all registered investors
              </p>
            </div>
            <div class="flex items-center space-x-4">
              <button
                @click="refreshInvestors"
                :disabled="loading"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Refresh
              </button>
              <div class="text-sm text-gray-500">
                Total: {{ investors.length }} investors
              </div>
            </div>
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
      <div v-else-if="error" class="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
          </svg>
          <span>{{ error }}</span>
        </div>
      </div>

      <!-- Search and Filter Bar -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <label for="search" class="sr-only">Search investors</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                id="search"
                v-model="searchQuery"
                type="text"
                placeholder="Search by name, email, or company..."
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div class="sm:w-48">
            <select
              v-model="countryFilter"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Countries</option>
              <option v-for="country in uniqueCountries" :key="country" :value="country">
                {{ country }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && filteredInvestors.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">No investors found</h3>
        <p class="mt-2 text-sm text-gray-500">
          {{ searchQuery || countryFilter ? 'Try adjusting your search criteria.' : 'No investors have been registered yet.' }}
        </p>
      </div>

      <!-- Investors Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="investor in filteredInvestors"
          :key="investor._id"
          class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
        >
          <div class="p-6">
            <!-- Header -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 truncate">
                  {{ investor.name || 'Unnamed Investor' }}
                </h3>
                <p class="text-sm text-gray-500 truncate">{{ investor.email }}</p>
              </div>
              <div class="ml-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Investor
                </span>
              </div>
            </div>

            <!-- Company Info -->
            <div v-if="investor.companyName" class="mb-4">
              <div class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10"></path>
                </svg>
                <span class="truncate">{{ investor.companyName }}</span>
              </div>
            </div>

            <!-- Location & Contact -->
            <div class="space-y-2 mb-4">
              <div v-if="investor.country" class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span>{{ investor.country }}</span>
              </div>
              
              <div v-if="investor.phone" class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <span>{{ investor.phone }}</span>
              </div>

              <div v-if="investor.website" class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                </svg>
                <a :href="formatWebsiteUrl(investor.website)" target="_blank" class="text-blue-600 hover:text-blue-800 truncate">
                  {{ investor.website }}
                </a>
              </div>
            </div>

            <!-- Investor Details -->
            <div v-if="investor.investorDetails" class="mb-4">
              <div v-if="investor.investorDetails.role && investor.investorDetails.role.length > 0" class="mb-2">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="role in investor.investorDetails.role"
                    :key="role"
                    class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800"
                  >
                    {{ role }}
                  </span>
                </div>
              </div>
              
              <div v-if="investor.investorDetails.pitch" class="text-sm text-gray-600">
                <p class="line-clamp-2">{{ investor.investorDetails.pitch }}</p>
              </div>
            </div>

            <!-- Investment Description -->
            <div v-if="investor.investmentDescription" class="mb-4">
              <h4 class="text-sm font-medium text-gray-900 mb-1">Investment Focus</h4>
              <p class="text-sm text-gray-600 line-clamp-2">{{ investor.investmentDescription }}</p>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-between pt-4 border-t border-gray-200">
              <div class="text-xs text-gray-500">
                Joined {{ formatDate(investor.createdAt) }}
              </div>
              <div class="flex space-x-2">
                <button
                  @click="viewInvestor(investor)"
                  class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  View Details
                </button>
                <a
                  :href="`mailto:${investor.email}`"
                  class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Contact
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Investor Detail Modal -->
    <div v-if="selectedInvestor" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeModal">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white" @click.stop>
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-900">Investor Details</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Name</label>
              <p class="mt-1 text-sm text-gray-900">{{ selectedInvestor.name || 'Not provided' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <p class="mt-1 text-sm text-gray-900">{{ selectedInvestor.email }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Company</label>
              <p class="mt-1 text-sm text-gray-900">{{ selectedInvestor.companyName || 'Not provided' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Country</label>
              <p class="mt-1 text-sm text-gray-900">{{ selectedInvestor.country || 'Not provided' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Phone</label>
              <p class="mt-1 text-sm text-gray-900">{{ selectedInvestor.phone || 'Not provided' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Website</label>
              <p class="mt-1 text-sm text-gray-900">
                <a v-if="selectedInvestor.website" :href="formatWebsiteUrl(selectedInvestor.website)" target="_blank" class="text-blue-600 hover:text-blue-800">
                  {{ selectedInvestor.website }}
                </a>
                <span v-else>Not provided</span>
              </p>
            </div>
          </div>

          <div v-if="selectedInvestor.investorDetails">
            <label class="block text-sm font-medium text-gray-700">Roles</label>
            <div class="mt-1 flex flex-wrap gap-2">
              <span
                v-for="role in selectedInvestor.investorDetails.role"
                :key="role"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
              >
                {{ role }}
              </span>
            </div>
          </div>

          <div v-if="selectedInvestor.investorDetails && selectedInvestor.investorDetails.pitch">
            <label class="block text-sm font-medium text-gray-700">Pitch</label>
            <p class="mt-1 text-sm text-gray-900">{{ selectedInvestor.investorDetails.pitch }}</p>
          </div>

          <div v-if="selectedInvestor.investmentDescription">
            <label class="block text-sm font-medium text-gray-700">Investment Description</label>
            <p class="mt-1 text-sm text-gray-900">{{ selectedInvestor.investmentDescription }}</p>
          </div>

          <div v-if="selectedInvestor.investmentDescription2">
            <label class="block text-sm font-medium text-gray-700">Additional Investment Info</label>
            <p class="mt-1 text-sm text-gray-900">{{ selectedInvestor.investmentDescription2 }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Joined Date</label>
            <p class="mt-1 text-sm text-gray-900">{{ formatDate(selectedInvestor.createdAt) }}</p>
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-3">
          <button
            @click="closeModal"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Close
          </button>
          <a
            :href="`mailto:${selectedInvestor.email}`"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Send Email
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import BackButton from '@/shared/components/ui/back-button.vue'

// Reactive data
const investors = ref([])
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const countryFilter = ref('')
const selectedInvestor = ref(null)

// Computed properties
const filteredInvestors = computed(() => {
  let filtered = investors.value

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(investor => 
      (investor.name && investor.name.toLowerCase().includes(query)) ||
      (investor.email && investor.email.toLowerCase().includes(query)) ||
      (investor.companyName && investor.companyName.toLowerCase().includes(query))
    )
  }

  // Apply country filter
  if (countryFilter.value) {
    filtered = filtered.filter(investor => investor.country === countryFilter.value)
  }

  return filtered
})

const uniqueCountries = computed(() => {
  const countries = investors.value
    .map(investor => investor.country)
    .filter(country => country && country.trim() !== '')
  return [...new Set(countries)].sort()
})

// Methods
const fetchInvestors = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await fetch('https://dark-caldron-448714-u5.uc.r.appspot.com/getallinvestor')
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    investors.value = data.investors || []
  } catch (err) {
    error.value = 'Failed to fetch investors. Please try again later.'
    console.error('Error fetching investors:', err)
  } finally {
    loading.value = false
  }
}

const refreshInvestors = () => {
  fetchInvestors()
}

const viewInvestor = (investor) => {
  selectedInvestor.value = investor
}

const closeModal = () => {
  selectedInvestor.value = null
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatWebsiteUrl = (website) => {
  if (!website) return '#'
  if (website.startsWith('http://') || website.startsWith('https://')) {
    return website
  }
  return `https://${website}`
}

// Lifecycle hooks
onMounted(() => {
  fetchInvestors()
})

// SEO and meta
definePageMeta({
  title: 'Investors - QWESI AI',
  description: 'View and manage registered investors'
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>