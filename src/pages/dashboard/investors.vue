<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <Sidebar :user="user" />

    <!-- Main Content -->
    <div class="main-content">
      <!-- Ultra-Modern Header -->
      <header class="modern-header">
        <div class="header-backdrop"></div>
        <div class="header-content">
          <div class="header-info">
            <div class="welcome-section">
              <BackButton class="back-btn-modern" />
              <h1 class="dashboard-title">Investors</h1>
              <p class="welcome-message">Manage and view all <span class="user-highlight">registered investors</span></p>
            </div>
            <div class="header-decorations">
              <div class="floating-orb orb-1"></div>
              <div class="floating-orb orb-2"></div>
              <div class="floating-orb orb-3"></div>
            </div>
          </div>

          <!-- Enhanced Header Actions -->
          <div class="header-actions">
            <div class="stats-badge">
              <span class="stats-label">Total:</span>
              <span class="stats-value">{{ investors.length }}</span>
              <span class="stats-text">investors</span>
            </div>
            <button
              @click="refreshInvestors"
              :disabled="loading"
              class="refresh-btn"
              :class="{ 'loading': loading }">
              <div class="btn-bg"></div>
              <div class="btn-content">
                <svg v-if="loading" class="btn-spinner" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                <span class="btn-text">Refresh</span>
              </div>
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content Area -->
      <main class="dashboard-main">
        <div class="max-w-7xl mx-auto w-full">
          <!-- Loading State -->
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <span class="loading-text">Loading investors...</span>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="error-state">
            <div class="error-backdrop"></div>
            <div class="error-content">
              <svg class="error-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
              </svg>
              <span class="error-text">{{ error }}</span>
            </div>
          </div>

          <template v-else>
            <!-- Search and Filter Section -->
            <div class="search-filter-section">
              <div class="search-backdrop"></div>
              <div class="search-content">
                <div class="search-grid">
                  <div class="search-input-wrapper">
                    <label for="search" class="sr-only">Search investors</label>
                    <div class="search-input-container">
                      <div class="search-icon">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                      </div>
                      <input
                        id="search"
                        v-model="searchQuery"
                        type="text"
                        placeholder="Search by name, email, or company..."
                        class="search-input"
                      />
                    </div>
                  </div>
                  <div class="filter-wrapper">
                    <select v-model="countryFilter" class="filter-select">
                      <option value="">All Countries</option>
                      <option v-for="country in uniqueCountries" :key="country" :value="country">
                        {{ country }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-if="filteredInvestors.length === 0" class="empty-state">
              <div class="empty-backdrop"></div>
              <div class="empty-content">
                <div class="empty-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <h3 class="empty-title">No investors found</h3>
                <p class="empty-description">
                  {{ searchQuery || countryFilter ? 'Try adjusting your search criteria.' : 'No investors have been registered yet.' }}
                </p>
              </div>
            </div>

            <!-- Investors Grid -->
            <div v-else class="investors-grid">
              <div
                v-for="investor in filteredInvestors"
                :key="investor._id"
                class="investor-card">
                <div class="card-backdrop"></div>
                <div class="card-content">
                  <!-- Header -->
                  <div class="card-header">
                    <div class="investor-info">
                      <h3 class="investor-name">{{ investor.name || 'Unnamed Investor' }}</h3>
                      <p class="investor-email">{{ investor.email }}</p>
                    </div>
                    <div class="investor-badge">
                      <span>Investor</span>
                    </div>
                  </div>

                  <!-- Company Info -->
                  <div v-if="investor.companyName" class="company-info">
                    <div class="info-item">
                      <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10"></path>
                      </svg>
                      <span class="info-text">{{ investor.companyName }}</span>
                    </div>
                  </div>

                  <!-- Contact Info -->
                  <div class="contact-info">
                    <div v-if="investor.country" class="info-item">
                      <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      <span class="info-text">{{ investor.country }}</span>
                    </div>
                    
                    <div v-if="investor.phone" class="info-item">
                      <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                      <span class="info-text">{{ investor.phone }}</span>
                    </div>

                    <div v-if="investor.website" class="info-item">
                      <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                      </svg>
                      <a :href="formatWebsiteUrl(investor.website)" target="_blank" class="website-link">
                        {{ investor.website }}
                      </a>
                    </div>
                  </div>

                  <!-- Investor Details -->
                  <div v-if="investor.investorDetails" class="investor-details">
                    <div v-if="investor.investorDetails.role && investor.investorDetails.role.length > 0" class="roles-section">
                      <div class="roles-grid">
                        <span
                          v-for="role in investor.investorDetails.role"
                          :key="role"
                          class="role-badge">
                          {{ role }}
                        </span>
                      </div>
                    </div>
                    
                    <div v-if="investor.investorDetails.pitch" class="pitch-section">
                      <p class="pitch-text">{{ investor.investorDetails.pitch }}</p>
                    </div>
                  </div>

                  <!-- Investment Description -->
                  <div v-if="investor.investmentDescription" class="investment-section">
                    <h4 class="investment-title">Investment Focus</h4>
                    <p class="investment-text">{{ investor.investmentDescription }}</p>
                  </div>

                  <!-- Footer -->
                  <div class="card-footer">
                    <div class="join-date">
                      Joined {{ formatDate(investor.createdAt) }}
                    </div>
                    <div class="action-buttons">
                      <button @click="viewInvestor(investor)" class="view-btn">
                        <span>View Details</span>
                      </button>
                      <a :href="`mailto:${investor.email}`" class="contact-btn">
                        <span>Contact</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </main>
    </div>

    <!-- Investor Detail Modal -->
    <div v-if="selectedInvestor" class="modal-overlay" @click="closeModal">
      <div class="modal-backdrop"></div>
      <div class="investor-modal" @click.stop>
        <div class="modal-header">
          <div class="modal-title-section">
            <h3 class="modal-title">Investor Details</h3>
            <div class="title-decoration"></div>
          </div>
          <button @click="closeModal" class="modal-close">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="modal-content">
          <div class="modal-grid">
            <div class="modal-field">
              <label class="field-label">Name</label>
              <p class="field-value">{{ selectedInvestor.name || 'Not provided' }}</p>
            </div>
            <div class="modal-field">
              <label class="field-label">Email</label>
              <p class="field-value">{{ selectedInvestor.email }}</p>
            </div>
            <div class="modal-field">
              <label class="field-label">Company</label>
              <p class="field-value">{{ selectedInvestor.companyName || 'Not provided' }}</p>
            </div>
            <div class="modal-field">
              <label class="field-label">Country</label>
              <p class="field-value">{{ selectedInvestor.country || 'Not provided' }}</p>
            </div>
            <div class="modal-field">
              <label class="field-label">Phone</label>
              <p class="field-value">{{ selectedInvestor.phone || 'Not provided' }}</p>
            </div>
            <div class="modal-field">
              <label class="field-label">Website</label>
              <p class="field-value">
                <a v-if="selectedInvestor.website" :href="formatWebsiteUrl(selectedInvestor.website)" target="_blank" class="modal-link">
                  {{ selectedInvestor.website }}
                </a>
                <span v-else>Not provided</span>
              </p>
            </div>
          </div>

          <div v-if="selectedInvestor.investorDetails" class="modal-section">
            <label class="field-label">Roles</label>
            <div class="roles-display">
              <span
                v-for="role in selectedInvestor.investorDetails.role"
                :key="role"
                class="modal-role-badge">
                {{ role }}
              </span>
            </div>
          </div>

          <div v-if="selectedInvestor.investorDetails && selectedInvestor.investorDetails.pitch" class="modal-section">
            <label class="field-label">Pitch</label>
            <p class="field-description">{{ selectedInvestor.investorDetails.pitch }}</p>
          </div>

          <div v-if="selectedInvestor.investmentDescription" class="modal-section">
            <label class="field-label">Investment Description</label>
            <p class="field-description">{{ selectedInvestor.investmentDescription }}</p>
          </div>

          <div v-if="selectedInvestor.investmentDescription2" class="modal-section">
            <label class="field-label">Additional Investment Info</label>
            <p class="field-description">{{ selectedInvestor.investmentDescription2 }}</p>
          </div>

          <div class="modal-section">
            <label class="field-label">Joined Date</label>
            <p class="field-value">{{ formatDate(selectedInvestor.createdAt) }}</p>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="closeModal" class="modal-cancel-btn">
            <span>Close</span>
          </button>
          <a :href="`mailto:${selectedInvestor.email}`" class="modal-email-btn">
            <span>Send Email</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { API_ROUTES } from '~/shared/constants/api-routes'
import { useAuthStore } from '~/features/auth/stores/auth.store'
import Sidebar from '@/features/dashboard/components/dashboard-sidebar.vue'
import BackButton from '@/shared/components/ui/back-button.vue'

const authStore = useAuthStore()

// Reactive data
const investors = ref([])
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const countryFilter = ref('')
const selectedInvestor = ref(null)

// Computed properties
const user = computed(() => authStore.getUser || {})

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
    const response = await fetch(`${API_ROUTES.BASE_URL}getallinvestor`)
    
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
  if (!authStore.isAuthenticated) {
    navigateTo('/auth/login')
    return
  }
  fetchInvestors()
})

// SEO and meta
useHead({
  title: 'Investors - QWESI AI'
})
</script>

<style scoped>
/* Base Layout */
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
  @apply relative z-10 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0;
}

.header-info {
  @apply relative;
}

.welcome-section {
  @apply text-center sm:text-left space-y-2;
}

.back-btn-modern {
  @apply mb-2;
}

.dashboard-title {
  @apply text-2xl font-black bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent;
  font-variant: small-caps;
  letter-spacing: -0.025em;
}

.welcome-message {
  @apply text-sm font-medium text-slate-600;
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

/* Header Actions */
.header-actions {
  @apply flex items-center space-x-4;
}

.stats-badge {
  @apply flex items-center space-x-2 px-4 py-2 rounded-2xl;
  @apply bg-gradient-to-r from-emerald-100/80 to-emerald-200/60;
  backdrop-filter: blur(12px);
}

.stats-label {
  @apply text-sm font-medium text-emerald-700;
}

.stats-value {
  @apply text-lg font-bold text-emerald-800;
}

.stats-text {
  @apply text-sm font-medium text-emerald-600;
}

.refresh-btn {
  @apply relative px-4 py-2 rounded-2xl font-medium text-sm transition-all duration-300;
  @apply hover:scale-105 hover:shadow-lg disabled:opacity-50;
  backdrop-filter: blur(12px);
}

.refresh-btn .btn-bg {
  @apply absolute inset-0 rounded-2xl transition-all duration-300;
  @apply bg-gradient-to-r from-blue-100/80 to-blue-200/60;
}

.refresh-btn:hover .btn-bg {
  @apply from-blue-200/80 to-blue-300/60;
}

.btn-content {
  @apply relative z-10 flex items-center space-x-2 text-blue-700;
}

.btn-spinner, .btn-icon {
  @apply w-4 h-4;
}

.btn-spinner {
  animation: spin 1s linear infinite;
}

.btn-text {
  @apply font-medium;
}

/* Main Dashboard Content */
.dashboard-main {
  @apply flex-1 p-6 flex flex-col space-y-8;
  min-height: 0;
  overflow-y: auto;
  padding-bottom: 2rem;
}

/* Loading State */
.loading-state {
  @apply flex flex-col items-center justify-center py-16 space-y-4;
}

.loading-spinner {
  @apply w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full;
  animation: spin 1s linear infinite;
}

.loading-text {
  @apply text-slate-600 font-medium;
}

/* Error State */
.error-state {
  @apply relative rounded-2xl overflow-hidden mb-8;
  backdrop-filter: blur(20px);
}

.error-backdrop {
  @apply absolute inset-0 bg-red-50/90 border border-red-200/60;
}

.error-content {
  @apply relative z-10 flex items-center p-6;
}

.error-icon {
  @apply w-6 h-6 text-red-500 flex-shrink-0 mr-3;
}

.error-text {
  @apply text-red-800 font-medium;
}

/* Search and Filter Section */
.search-filter-section {
  @apply relative rounded-3xl overflow-hidden mb-8;
  backdrop-filter: blur(20px);
}

.search-backdrop {
  @apply absolute inset-0 bg-white/70 border border-slate-200/60;
}

.search-content {
  @apply relative z-10 p-6;
}

.search-grid {
  @apply flex flex-col sm:flex-row gap-4;
}

.search-input-wrapper {
  @apply flex-1;
}

.search-input-container {
  @apply relative;
}

.search-icon {
  @apply absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none;
}

.search-input {
  @apply w-full pl-12 pr-4 py-3 rounded-2xl transition-all duration-300;
  @apply bg-slate-50/70 border border-slate-200/60;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50;
  @apply focus:bg-white/80 placeholder-slate-500;
  backdrop-filter: blur(12px);
}

.filter-wrapper {
  @apply sm:w-48;
}

.filter-select {
  @apply w-full px-4 py-3 rounded-2xl transition-all duration-300;
  @apply bg-slate-50/70 border border-slate-200/60;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50;
  @apply focus:bg-white/80 text-slate-700;
  backdrop-filter: blur(12px);
}

/* Empty State */
.empty-state {
  @apply relative rounded-3xl overflow-hidden py-16;
  backdrop-filter: blur(20px);
}

.empty-backdrop {
  @apply absolute inset-0 bg-white/70 border border-slate-200/60;
}

.empty-content {
  @apply relative z-10 text-center space-y-4;
}

.empty-icon {
  @apply w-16 h-16 mx-auto text-slate-400;
}

.empty-title {
  @apply text-xl font-bold text-slate-900;
}

.empty-description {
  @apply text-slate-600 max-w-md mx-auto;
}

/* Investors Grid */
.investors-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6;
}

/* Investor Cards */
.investor-card {
  @apply relative rounded-3xl overflow-hidden transition-all duration-300;
  @apply hover:-translate-y-2 hover:scale-105 hover:shadow-2xl;
  backdrop-filter: blur(20px);
}

.card-backdrop {
  @apply absolute inset-0 bg-white/70 border border-slate-200/60;
}

.card-content {
  @apply relative z-10 p-6 space-y-4;
}

.card-header {
  @apply flex items-start justify-between;
}

.investor-info {
  @apply flex-1 min-w-0;
}

.investor-name {
  @apply text-lg font-bold text-slate-900 truncate;
}

.investor-email {
  @apply text-sm text-slate-600 truncate;
}

.investor-badge {
  @apply ml-4 flex-shrink-0;
}

.investor-badge span {
  @apply inline-flex items-center px-3 py-1 rounded-full text-xs font-bold;
  @apply bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800;
}

.company-info, .contact-info, .investor-details, .investment-section {
  @apply space-y-2;
}

.info-item {
  @apply flex items-center space-x-2 text-sm text-slate-600;
}

.info-icon {
  @apply w-4 h-4 text-slate-400 flex-shrink-0;
}

.info-text {
  @apply truncate;
}

.website-link {
  @apply text-blue-600 hover:text-blue-800 truncate transition-colors;
}

.roles-section {
  @apply space-y-2;
}

.roles-grid {
  @apply flex flex-wrap gap-2;
}

.role-badge {
  @apply inline-flex items-center px-2 py-1 rounded-xl text-xs font-bold;
  @apply bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800;
}

.pitch-section {
  @apply mt-2;
}

.pitch-text {
  @apply text-sm text-slate-600 line-clamp-2;
}

.investment-title {
  @apply text-sm font-bold text-slate-900 mb-1;
}

.investment-text {
  @apply text-sm text-slate-600 line-clamp-2;
}

.card-footer {
  @apply flex items-center justify-between pt-4 border-t border-slate-200/40;
}

.join-date {
  @apply text-xs text-slate-500 font-medium;
}

.action-buttons {
  @apply flex space-x-2;
}

.view-btn, .contact-btn {
  @apply px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-300;
  @apply hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2;
}

.view-btn {
  @apply bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700;
  @apply hover:from-slate-200 hover:to-slate-300 focus:ring-slate-500/20;
}

.contact-btn {
  @apply bg-gradient-to-r from-blue-500 to-blue-600 text-white;
  @apply hover:from-blue-600 hover:to-blue-700 focus:ring-blue-500/20;
  @apply shadow-blue-500/25;
}

/* Modal Styles */
.modal-overlay {
  @apply fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50;
  backdrop-filter: blur(8px);
}

.modal-backdrop {
  @apply absolute inset-0 bg-black/40;
}

.investor-modal {
  @apply relative bg-white/95 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.modal-header {
  @apply flex items-center justify-between p-8 border-b border-slate-200/60;
}

.modal-title-section {
  @apply space-y-2;
}

.modal-title {
  @apply text-xl font-bold text-slate-900;
}

.title-decoration {
  @apply w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full;
}

.modal-close {
  @apply p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100/70;
  @apply transition-colors duration-200;
}

.modal-content {
  @apply p-8 overflow-y-auto max-h-[60vh] space-y-6;
}

.modal-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-6;
}

.modal-field {
  @apply space-y-2;
}

.field-label {
  @apply block text-sm font-bold text-slate-700;
}

.field-value {
  @apply text-sm text-slate-900;
}

.field-description {
  @apply text-sm text-slate-600 leading-relaxed;
}

.modal-link {
  @apply text-blue-600 hover:text-blue-800 transition-colors;
}

.modal-section {
  @apply space-y-2;
}

.roles-display {
  @apply flex flex-wrap gap-2;
}

.modal-role-badge {
  @apply inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold;
  @apply bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800;
}

.modal-footer {
  @apply flex justify-end space-x-3 p-8 border-t border-slate-200/60;
}

.modal-cancel-btn, .modal-email-btn {
  @apply px-6 py-3 rounded-2xl font-bold transition-all duration-300;
  @apply hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4;
}

.modal-cancel-btn {
  @apply bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700;
  @apply hover:from-slate-200 hover:to-slate-300 focus:ring-slate-500/20;
}

.modal-email-btn {
  @apply bg-gradient-to-r from-blue-500 to-blue-600 text-white;
  @apply hover:from-blue-600 hover:to-blue-700 focus:ring-blue-500/20;
  @apply shadow-blue-500/25;
}

/* Utility Classes */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom Scrollbar Styling */
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
@media (max-width: 768px) {
  .dashboard-title {
    @apply text-xl;
  }
  
  .investors-grid {
    @apply grid-cols-1 gap-4;
  }
  
  .search-grid {
    @apply flex-col space-y-4;
  }
  
  .card-footer {
    @apply flex-col items-start space-y-3;
  }
  
  .action-buttons {
    @apply w-full flex justify-end;
  }
  
  .modal-content {
    @apply p-6;
  }
  
  .modal-grid {
    @apply grid-cols-1;
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .floating-orb,
  .investor-card,
  .btn-spinner {
    animation: none;
  }
  
  .investor-card:hover,
  .view-btn:hover,
  .contact-btn:hover,
  .refresh-btn:hover {
    transform: none;
  }
}

/* High Contrast Mode Support */
@media (prefers-contrast: high) {
  .card-backdrop, .search-backdrop, .empty-backdrop {
    @apply bg-white border-slate-400;
  }
  
  .header-backdrop {
    @apply from-white via-white to-white;
  }
}

/* Focus States for Accessibility */
.search-input:focus-visible,
.filter-select:focus-visible,
.view-btn:focus-visible,
.contact-btn:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
</style>