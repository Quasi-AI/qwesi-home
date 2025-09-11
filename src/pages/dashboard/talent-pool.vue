<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <Sidebar :user="user" />

    <!-- Main Content -->
    <div class="main-content">
      <!-- Modern Header -->
      <header class="modern-header">
        <div class="header-backdrop"></div>
        <div class="header-decorations">
          <div class="floating-orb orb-1"></div>
          <div class="floating-orb orb-2"></div>
          <div class="floating-orb orb-3"></div>
        </div>
        
        <div class="header-content">
          <div class="header-info">
            <div class="welcome-section">
              <h1 class="dashboard-title">Talent Pool</h1>
              <p class="welcome-message">
                Discover skilled professionals and 
                <span class="user-highlight">connect with top talent</span>
              </p>
            </div>
          </div>

          <!-- Header Actions -->
          <div class="header-actions">
            <NuxtLink to="/dashboard" class="action-btn referral-btn">
              <div class="btn-bg"></div>
              <div class="btn-content">
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Dashboard</span>
              </div>
            </NuxtLink>

            <!-- Profile Dropdown -->
            <div class="profile-dropdown">
              <button @click="profileMenuOpen = !profileMenuOpen" class="profile-btn">
                <div class="profile-avatar">
                  <div v-if="user.profileImage" class="avatar-image">
                    <img :src="user.profileImage" alt="Profile Picture" />
                  </div>
                  <div v-else class="avatar-initials">
                    {{ userInitials }}
                  </div>
                  <div class="avatar-ring"></div>
                </div>
                <span class="text-sm font-medium text-slate-700 hidden sm:block">{{ displayName }}</span>
                <svg class="dropdown-arrow" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clip-rule="evenodd" />
                </svg>
              </button>

              <!-- Profile Menu -->
              <div v-if="profileMenuOpen" class="profile-menu">
                <div class="menu-backdrop"></div>
                <div class="menu-content">
                  <button @click="editProfile" class="menu-item">
                    <svg class="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Edit Profile</span>
                  </button>
                  <div class="menu-divider"></div>
                  <button @click="handleLogout" class="menu-item logout-item">
                    <svg class="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Message Popup -->
      <MessagePopup ref="alertRef" />

      <!-- Main Content -->
      <main class="dashboard-main">
        <div class="max-w-7xl mx-auto w-full space-y-8">
          <!-- Stats Overview -->
          <div class="stats-container">
            <div class="stats-card">
              <div class="stat-icon bg-blue-500">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div class="stat-content">
                <h3 class="stat-number">{{ totalTalents }}</h3>
                <p class="stat-label">Total Talents</p>
              </div>
            </div>

            <div class="stats-card">
              <div class="stat-icon bg-emerald-500">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div class="stat-content">
                <h3 class="stat-number">{{ popularSkills.length }}</h3>
                <p class="stat-label">Popular Skills</p>
              </div>
            </div>

            <div class="stats-card">
              <div class="stat-icon bg-purple-500">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div class="stat-content">
                <h3 class="stat-number">{{ talents.length }}</h3>
                <p class="stat-label">Showing Results</p>
              </div>
            </div>
          </div>

          <!-- Search and Filters -->
          <div class="filter-container">
            <div class="filter-backdrop"></div>
            <div class="filter-content">
              <div class="filter-header">
                <h2 class="filter-title">Find Your Perfect Match</h2>
                <p class="filter-subtitle">Use our advanced filters to discover the right talent for your needs</p>
              </div>

              <div class="filter-controls">
                <!-- Search Bar -->
                <div class="search-container">
                  <div class="search-input-wrapper">
                    <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input 
                      v-model="filters.search"
                      type="text"
                      placeholder="Search by name, skills, or experience..."
                      class="search-input"
                      @input="debouncedSearch"
                    />
                    <button 
                      v-if="filters.search"
                      @click="clearSearch"
                      class="clear-search-btn"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Filter Chips -->
                <div class="filter-chips">
                  <div class="filter-group">
                    <label class="filter-label">Skills:</label>
                    <input 
                      v-model="filters.skills"
                      type="text"
                      placeholder="e.g., JavaScript, Python, Design"
                      class="filter-input"
                      @input="debouncedFilter"
                    />
                  </div>

                  <div class="filter-group">
                    <label class="filter-label">Experience:</label>
                    <select 
                      v-model="filters.experience"
                      class="filter-select"
                      @change="applyFilters"
                    >
                      <option value="">All Levels</option>
                      <option value="entry">Entry Level</option>
                      <option value="mid">Mid Level</option>
                      <option value="senior">Senior Level</option>
                    </select>
                  </div>

                  <div class="filter-group">
                    <label class="filter-label">Sort By:</label>
                    <select 
                      v-model="filters.sortBy"
                      class="filter-select"
                      @change="applyFilters"
                    >
                      <option value="createdAt">Newest First</option>
                      <option value="name">Name A-Z</option>
                      <option value="experience">Experience</option>
                    </select>
                  </div>

                  <button 
                    @click="clearAllFilters"
                    class="clear-filters-btn"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Popular Skills Tags -->
          <div v-if="popularSkills.length" class="popular-skills">
            <h3 class="skills-title">Popular Skills</h3>
            <div class="skills-tags">
              <button 
                v-for="skill in popularSkills.slice(0, 10)"
                :key="skill.skill"
                @click="filterBySkill(skill.skill)"
                class="skill-tag"
                :class="{ 'active': filters.skills.includes(skill.skill) }"
              >
                {{ skill.skill }}
                <span class="skill-count">({{ skill.count }})</span>
              </button>
            </div>
          </div>

          <!-- Talent Grid -->
          <div class="talent-grid-container">
            <div v-if="loading" class="loading-container">
              <div class="loading-spinner"></div>
              <p class="loading-text">Finding amazing talent...</p>
            </div>

            <div v-else-if="talents.length === 0" class="empty-state">
              <div class="empty-icon">
                <svg class="w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0118 12a8 8 0 10-8 8 7.962 7.962 0 014.291-1.007M21 21l-3.35-3.35" />
                </svg>
              </div>
              <h3 class="empty-title">No talents found</h3>
              <p class="empty-description">Try adjusting your search criteria or browse all available talent</p>
              <button @click="clearAllFilters" class="empty-action-btn">
                Browse All Talent
              </button>
            </div>

            <div v-else class="talent-grid">
              <div 
                v-for="talent in talents"
                :key="talent.id"
                class="talent-card"
                @click="viewTalentProfile(talent.id)"
              >
                <div class="card-backdrop"></div>
                <div class="card-content">
                  <!-- Profile Header -->
                  <div class="profile-header">
                    <div class="profile-avatar-large">
                      <div v-if="talent.profileImage" class="avatar-image-large">
                        <img :src="talent.profileImage" :alt="talent.name" />
                      </div>
                      <div v-else class="avatar-initials-large">
                        {{ getInitials(talent.name) }}
                      </div>
                    </div>
                    <div class="profile-info">
                      <h3 class="talent-name">{{ talent.name }}</h3>
                      <p class="talent-experience">{{ talent.experience }}</p>
                    </div>
                    <div class="contact-status">
                      <div class="status-indicator" :class="{ 'available': talent.contactAvailable }">
                        <svg v-if="talent.contactAvailable" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                        <span class="status-text">{{ talent.contactAvailable ? 'Available' : 'Private' }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Skills -->
                  <div class="skills-section">
                    <h4 class="skills-label">Skills</h4>
                    <div class="skills-list">
                      <span 
                        v-for="skill in talent.skills.slice(0, 4)"
                        :key="skill"
                        class="skill-badge"
                      >
                        {{ skill }}
                      </span>
                      <span 
                        v-if="talent.skills.length > 4"
                        class="skill-badge more-skills"
                      >
                        +{{ talent.skills.length - 4 }} more
                      </span>
                    </div>
                  </div>

                  <!-- Goals/Interests -->
                  <div v-if="talent.goals" class="goals-section">
                    <h4 class="goals-label">Career Goals</h4>
                    <p class="goals-text">{{ truncateText(talent.goals, 100) }}</p>
                  </div>

                  <!-- Help Options -->
                  <div v-if="talent.helpOptions.length" class="help-section">
                    <h4 class="help-label">Looking For</h4>
                    <div class="help-tags">
                      <span 
                        v-for="option in talent.helpOptions.slice(0, 2)"
                        :key="option"
                        class="help-tag"
                      >
                        {{ option.replace('AI Coach (Interview Prep)', 'Interview Prep') }}
                      </span>
                    </div>
                  </div>

                  <!-- Card Footer -->
                  <div class="card-footer">
                    <div class="joined-date">
                      <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Joined {{ formatDate(talent.joinedDate) }}</span>
                    </div>
                    
                    <div class="card-actions">
                      <button 
                        @click.stop="startChat(talent)"
                        class="action-btn chat-btn"
                        :disabled="!talent.contactAvailable"
                        title="Start Chat"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </button>
                      
                      <button 
                        @click.stop="contactTalent(talent)"
                        class="action-btn contact-btn"
                        :disabled="!talent.contactAvailable"
                        title="Send Email"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="pagination">
            <button 
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="pagination-btn"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            <div class="pagination-info">
              <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
              <span class="results-info">{{ totalTalents }} total talents</span>
            </div>

            <button 
              @click="changePage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="pagination-btn"
            >
              Next
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>

    <!-- Contact Modal -->
    <div v-if="showContactModal" class="modal-overlay" @click="closeContactModal">
      <div class="contact-modal" @click.stop>
        <div class="modal-header">
          <div class="modal-title-section">
            <h3 class="modal-title">Contact {{ selectedTalent?.name }}</h3>
            <div class="title-decoration"></div>
          </div>
          <button @click="closeContactModal" class="modal-close">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="submitContactRequest" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-700">Your Name *</label>
                <input 
                  v-model="contactForm.requesterName" 
                  type="text" 
                  placeholder="Enter your full name"
                  class="contact-input"
                  required 
                />
              </div>
              
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-700">Your Email *</label>
                <input 
                  v-model="contactForm.requesterEmail" 
                  type="email" 
                  placeholder="your.email@example.com"
                  class="contact-input"
                  required 
                />
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-700">Your Phone</label>
              <input 
                v-model="contactForm.requesterPhone" 
                type="tel" 
                placeholder="Your phone number"
                class="contact-input"
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-700">Job Title/Position</label>
              <input 
                v-model="contactForm.jobTitle" 
                type="text" 
                placeholder="e.g., Software Developer, Marketing Manager"
                class="contact-input"
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-700">Message *</label>
              <textarea 
                v-model="contactForm.message" 
                rows="4"
                placeholder="Tell {{ selectedTalent?.name }} about the opportunity, your company, or why you'd like to connect..."
                class="contact-input resize-none"
                required
              ></textarea>
            </div>

            <div class="modal-footer">
              <button 
                type="button" 
                @click="closeContactModal"
                class="cancel-btn"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                :disabled="isSubmittingContact"
                class="submit-contact-btn"
              >
                <div v-if="isSubmittingContact" class="flex items-center space-x-2">
                  <svg class="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Sending...</span>
                </div>
                <span v-else>Send Contact Request</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <TalentProfileModal 
    :is-open="showTalentModal"
    :talent-id="selectedTalentId"
    @close="closeTalentModal"
    @contact-sent="handleContactSent"
  />
  <!-- Chat Component -->
  <ChatComponent 
    v-if="showChatModal && selectedTalentForChat"
    :is-open="showChatModal"
    :talent="selectedTalentForChat"
    :current-user-id="user?.id || 'anonymous'"
    @close="closeChatModal"
    @meeting-scheduled="handleMeetingScheduled"
  />
</template>

<script setup>
import { useAuthStore } from '~/features/auth/stores/auth.store'
import Sidebar from '@/features/dashboard/components/dashboard-sidebar.vue'
import ChatComponent from '@/features/dashboard/components/chats.vue'
import MessagePopup from '~/shared/components/message/MessagePopup.vue'
import TalentProfileModal from '@/pages/modals/TalentProfileModal.vue'
import { debounce } from 'lodash'
import { API_ROUTES } from '~/shared/constants/api-routes'

const alertRef = ref(null)
const authStore = useAuthStore()
const showChatModal = ref(false)
const selectedTalentForChat = ref(null)

// User state
const user = computed(() => authStore.getUser || {})
const userInitials = computed(() => {
    const name = user.value?.name || 'User'
    return name.charAt(0).toUpperCase()
})
const displayName = computed(() => user.value?.name || 'User')

// UI State
const profileMenuOpen = ref(false)
const showContactModal = ref(false)
const selectedTalent = ref(null)
const loading = ref(true)
const isSubmittingContact = ref(false)

// Data
const talents = ref([])
const popularSkills = ref([])
const totalTalents = ref(0)
const currentPage = ref(1)
const totalPages = ref(1)


// Add these reactive variables
const showTalentModal = ref(false)
const selectedTalentId = ref(null)
// Filters
const filters = ref({
  search: '',
  skills: '',
  experience: '',
  sortBy: 'createdAt'
})

// Contact Form
const contactForm = ref({
  requesterName: '',
  requesterEmail: '',
  requesterPhone: '',
  jobTitle: '',
  message: ''
})

// Fetch talents data
const fetchTalents = async () => {
  try {
    loading.value = true
    const params = new URLSearchParams()
    
    if (filters.value.search) params.append('search', filters.value.search)
    if (filters.value.skills) params.append('skills', filters.value.skills)
    if (filters.value.experience) params.append('experience', filters.value.experience)
    if (filters.value.sortBy) params.append('sortBy', filters.value.sortBy)
    params.append('page', currentPage.value.toString())
    params.append('limit', '12')
    
    const response = await $fetch(`${API_ROUTES.BASE_URL}api/talent/pool?${params}`)
    
    if (response.success) {
      talents.value = response.data.talents
      totalTalents.value = response.data.stats.totalTalents
      popularSkills.value = response.data.stats.popularSkills
      totalPages.value = response.data.pagination.totalPages
    }
  } catch (error) {
    console.error("Error fetching talents:", error)
    alertRef.value?.error('Failed to load talent pool. Please try again.')
  } finally {
    loading.value = false
  }
}

// Debounced search and filter functions
const debouncedSearch = debounce(() => {
  currentPage.value = 1
  fetchTalents()
}, 500)

const debouncedFilter = debounce(() => {
  currentPage.value = 1
  fetchTalents()
}, 300)

// Filter functions
const applyFilters = () => {
  currentPage.value = 1
  fetchTalents()
}

const clearSearch = () => {
  filters.value.search = ''
  applyFilters()
}

const clearAllFilters = () => {
  filters.value = {
    search: '',
    skills: '',
    experience: '',
    sortBy: 'createdAt'
  }
  applyFilters()
}

const filterBySkill = (skill) => {
  if (filters.value.skills.includes(skill)) {
    filters.value.skills = filters.value.skills.replace(skill, '').replace(/,\s*,/g, ',').replace(/^,|,$/g, '')
  } else {
    filters.value.skills = filters.value.skills ? `${filters.value.skills}, ${skill}` : skill
  }
  applyFilters()
}

// Pagination
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchTalents()
  }
}

// Utility functions
const getInitials = (name) => {
  if (!name) return 'U'
  return name.split(' ').map(n => n.charAt(0)).join('').slice(0, 2).toUpperCase()
}

const truncateText = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric'
  })
}

// Contact functions
const contactTalent = (talent) => {
  if (!talent?.contactAvailable) {
    alertRef.value?.warning('Contact information is not available for this talent.')
    return
  }
  
  selectedTalent.value = talent
  showContactModal.value = true
  
  // Pre-fill user info if available
  contactForm.value.requesterName = user.value?.name || ''
  contactForm.value.requesterEmail = user.value?.email || ''
}

// Add new method for starting chat
const startChat = (talent) => {
  if (!talent) {
    alertRef.value?.error('Talent information is not available.')
    return
  }
  
  selectedTalentForChat.value = talent
  showChatModal.value = true
}

// Add new method for closing chat
const closeChatModal = () => {
  showChatModal.value = false
  selectedTalentForChat.value = null
}

// Update the existing handleMeetingScheduled method
const handleMeetingScheduled = (meeting) => {
  const talentName = meeting?.talent?.name || 'the talent'
  const meetingDate = meeting?.date || 'the scheduled date'
  const meetingTime = meeting?.time || 'the scheduled time'
  
  alertRef.value?.success(`Meeting scheduled with ${talentName} for ${meetingDate} at ${meetingTime}!`)
  
  showChatModal.value = false
  showContactModal.value = false
}

const closeContactModal = () => {
  showContactModal.value = false
  selectedTalent.value = null
  resetContactForm()
}

const resetContactForm = () => {
  contactForm.value = {
    requesterName: user.value?.name || '',
    requesterEmail: user.value?.email || '',
    requesterPhone: '',
    jobTitle: '',
    message: ''
  }
}

const submitContactRequest = async () => {
  try {
    isSubmittingContact.value = true
    
    const response = await $fetch(`${API_ROUTES.BASE_URL}api/talent/${selectedTalent.value.id}/contact`, {
      method: 'POST',
      body: contactForm.value
    })
    
    if (response.success) {
      alertRef.value?.success(`Contact request sent to ${selectedTalent.value.name}!`)
      closeContactModal()
    } else {
      alertRef.value?.error(response.error || 'Failed to send contact request')
    }
  } catch (error) {
    console.error('Contact request error:', error)
    alertRef.value?.error('Failed to send contact request. Please try again.')
  } finally {
    isSubmittingContact.value = false
  }
}

// Update the viewTalentProfile function
const viewTalentProfile = (talentId) => {
  selectedTalentId.value = talentId
  showTalentModal.value = true
}

// Add modal handlers
const closeTalentModal = () => {
  showTalentModal.value = false
  selectedTalentId.value = null
}

const handleContactSent = (talentName) => {
  alertRef.value?.success(`Contact request sent to ${talentName}!`)
}
// Profile actions
const editProfile = () => {
  profileMenuOpen.value = false
  navigateTo('/dashboard/profile')
}

const handleLogout = () => {
  profileMenuOpen.value = false
  authStore.logout()
  navigateTo('/auth/login')
}

// Click outside handler
const handleClickOutside = (event) => {
  if (!event.target.closest('.profile-dropdown')) {
    profileMenuOpen.value = false
  }
}

// Lifecycle
onMounted(async () => {
  if (!authStore.isAuthenticated) {
    navigateTo('/auth/login')
    return
  }
  
  await fetchTalents()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Page metadata
useHead({
  title: 'Talent Pool - QWESI AI',
  meta: [
    {
      name: 'description',
      content: 'Discover and connect with skilled professionals in our talent pool. Find the perfect candidate for your team with advanced search and filtering options.'
    }
  ]
})
</script>

<style scoped>
/* Base styles similar to the registration page */
.dashboard-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #dbeafe 100%);
  display: flex;
  position: relative;
  overflow-x: hidden;
  height: 100vh;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
}

/* Modern Header (reuse styles from registration page) */
.modern-header {
  position: relative;
  border-bottom: 1px solid rgba(148, 163, 184, 0.3);
  backdrop-filter: blur(20px);
}

.header-backdrop {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 50%, rgba(219, 234, 254, 0.8) 100%);
}

.header-content {
  position: relative;
  z-index: 10;
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (min-width: 640px) {
  .header-content {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 0;
  }
}

.dashboard-title {
  font-size: 1.5rem;
  font-weight: 900;
  background: linear-gradient(90deg, #1e293b 0%, #1e40af 50%, #7c3aed 100%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  font-variant: small-caps;
  letter-spacing: -0.025em;
}

@media (min-width: 640px) {
  .dashboard-title {
    font-size: 2rem;
  }
}

.welcome-message {
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  margin-top: 0.25rem;
}

.user-highlight {
  font-weight: 700;
  background: linear-gradient(90deg, #2563eb 0%, #7c3aed 100%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.header-decorations {
  position: absolute;
  inset: -1rem;
  pointer-events: none;
}

.floating-orb {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  opacity: 0.2;
  animation: float 6s ease-in-out infinite;
}

.orb-1 {
  background: #60a5fa;
  top: 0.5rem;
  right: 2rem;
  animation-delay: 0s;
}

.orb-2 {
  background: #a78bfa;
  top: 2rem;
  right: 1rem;
  animation-delay: 2s;
}

.orb-3 {
  background: #34d399;
  top: 1.5rem;
  right: 3rem;
  animation-delay: 4s;
}

/* Header Actions (reuse from registration page) */
.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.action-btn {
  position: relative;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(12px);
  text-decoration: none;
}

.action-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

.btn-bg {
  position: absolute;
  inset: 0;
  border-radius: 1rem;
  transition: all 0.3s ease;
}

.referral-btn .btn-bg {
  background: linear-gradient(90deg, rgba(219, 234, 254, 0.8) 0%, rgba(196, 181, 253, 0.6) 100%);
}

.btn-content {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-icon {
  width: 1rem;
  height: 1rem;
}

.referral-btn {
  color: #1d4ed8;
}

.referral-btn:hover {
  color: #1e40af;
}

/* Profile Dropdown (reuse from registration page) */
.profile-dropdown {
  position: relative;
  z-index: 50;
}

.profile-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 1rem;
  transition: all 0.3s ease;
}

.profile-btn:hover {
  background: rgba(148, 163, 184, 0.1);
}

.profile-avatar {
  position: relative;
  width: 2.5rem;
  height: 2.5rem;
}

.avatar-image {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 1rem;
  overflow: hidden;
  border: 2px solid #e2e8f0;
}

.avatar-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials {
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 0.875rem;
  box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.25);
}

.avatar-ring {
  position: absolute;
  inset: -4px;
  border-radius: 1rem;
  border: 2px solid rgba(96, 165, 250, 0.3);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.profile-btn:hover .avatar-ring {
  opacity: 1;
}

.dropdown-arrow {
  width: 1rem;
  height: 1rem;
  color: #9ca3af;
  transition: transform 0.3s ease;
}

.profile-btn:hover .dropdown-arrow {
  transform: rotate(180deg);
}

.profile-menu {
  position: absolute;
  right: 0;
  margin-top: 0.5rem;
  width: 12rem;
  border-radius: 1rem;
  overflow: hidden;
  z-index: 10;
}

.menu-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(148, 163, 184, 0.3);
  backdrop-filter: blur(20px);
  border-radius: inherit;
}

.menu-content {
  position: relative;
  z-index: 10;
  padding: 0.5rem 0;
}

.menu-item {
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.menu-item:hover {
  background: rgba(148, 163, 184, 0.1);
}

.menu-icon {
  width: 1rem;
  height: 1rem;
}

.logout-item {
  color: #dc2626;
}

.logout-item:hover {
  color: #b91c1c;
  background: rgba(220, 38, 38, 0.05);
}

.menu-divider {
  border-top: 1px solid rgba(148, 163, 184, 0.3);
  margin: 0.25rem 0;
}

/* Main Dashboard Content */
.dashboard-main {
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  min-height: 0;
  overflow-y: auto;
  padding-bottom: 2rem;
}

/* Stats Container */
.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stats-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1.5rem;
  padding: 1.5rem;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 1.75rem;
  font-weight: 800;
  color: #1e293b;
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 0.25rem;
}

/* Filter Container */
.filter-container {
  position: relative;
  border-radius: 1.5rem;
  overflow: hidden;
  backdrop-filter: blur(20px);
}

.filter-backdrop {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 249, 255, 0.9) 100%);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: inherit;
}

.filter-content {
  position: relative;
  z-index: 10;
  padding: 2rem;
}

.filter-header {
  text-align: center;
  margin-bottom: 2rem;
}

.filter-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.filter-subtitle {
  color: #64748b;
  font-size: 0.875rem;
}

.filter-controls {
  space-y: 1.5rem;
}

/* Search Container */
.search-container {
  margin-bottom: 1.5rem;
}

.search-input-wrapper {
  position: relative;
  max-width: 28rem;
  margin: 0 auto;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: #9ca3af;
}

.search-input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border: 2px solid #e2e8f0;
  border-radius: 1rem;
  font-size: 0.875rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  transform: scale(1.01);
}

.clear-search-btn {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  padding: 0.25rem;
  color: #9ca3af;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.clear-search-btn:hover {
  color: #6b7280;
  background: rgba(148, 163, 184, 0.1);
}

/* Filter Chips */
.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: end;
  justify-content: center;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 8rem;
}

.filter-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.filter-input, .filter-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.2s ease;
}

.filter-input:focus, .filter-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.clear-filters-btn {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
  align-self: end;
}

.clear-filters-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

/* Popular Skills */
.popular-skills {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1.5rem;
  padding: 1.5rem;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6);
}

.skills-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
}

.skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.skill-tag {
  padding: 0.5rem 1rem;
  background: rgba(59, 130, 246, 0.1);
  color: #1e40af;
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
}

.skill-tag:hover {
  background: rgba(59, 130, 246, 0.15);
  transform: translateY(-1px);
}

.skill-tag.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.skill-count {
  font-size: 0.75rem;
  opacity: 0.8;
  margin-left: 0.25rem;
}

/* Talent Grid */
.talent-grid-container {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 1.5rem;
  padding: 2rem;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  min-height: 20rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  margin-top: 1rem;
  color: #64748b;
  font-weight: 500;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.empty-icon {
  margin-bottom: 1rem;
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.empty-description {
  color: #6b7280;
  margin-bottom: 2rem;
}

.empty-action-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  border-radius: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.empty-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.talent-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

/* Talent Cards */
.talent-card {
  position: relative;
  border-radius: 1.5rem;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  backdrop-filter: blur(20px);
}

.talent-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.card-backdrop {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: inherit;
}

.card-content {
  position: relative;
  z-index: 10;
  padding: 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Profile Header */
.profile-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.profile-avatar-large {
  flex-shrink: 0;
}

.avatar-image-large {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 1.25rem;
  overflow: hidden;
  border: 3px solid rgba(59, 130, 246, 0.2);
}

.avatar-image-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials-large {
  width: 3.5rem;
  height: 3.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}

.profile-info {
  flex: 1;
  min-width: 0;
}

.talent-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.25rem;
  line-height: 1.3;
}

.talent-experience {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.contact-status {
  flex-shrink: 0;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  background: rgba(148, 163, 184, 0.1);
  color: #64748b;
}

.status-indicator.available {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}

.status-text {
  font-size: 0.75rem;
}

/* Skills Section */
.skills-section {
  margin-bottom: 0.5rem;
}

.skills-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-badge {
  padding: 0.25rem 0.75rem;
  background: rgba(59, 130, 246, 0.1);
  color: #1e40af;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.skill-badge.more-skills {
  background: rgba(148, 163, 184, 0.1);
  color: #64748b;
  border-color: rgba(148, 163, 184, 0.2);
}

/* Goals Section */
.goals-section {
  margin-bottom: 0.5rem;
}

.goals-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.goals-text {
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.5;
}

/* Help Section */
.help-section {
  margin-bottom: 0.5rem;
}

.help-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.help-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.help-tag {
  padding: 0.25rem 0.75rem;
  background: rgba(139, 92, 246, 0.1);
  color: #7c3aed;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid rgba(139, 92, 246, 0.2);
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
  min-width: 2.5rem;
  height: 2.5rem;
}

.chat-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.chat-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.contact-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
}

.contact-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #9ca3af;
}

/* Update card footer layout */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid rgba(148, 163, 184, 0.2);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .card-actions {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .action-btn {
    min-width: 2rem;
    height: 2rem;
    padding: 0.375rem;
  }
  
  .card-footer {
    flex-direction: column;
    gap: 0.75rem;
    text-align: center;
  }
}

.joined-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #64748b;
}

.contact-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.contact-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.contact-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #9ca3af;
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1.5rem;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6);
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  border-radius: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #9ca3af;
}

.pagination-info {
  text-align: center;
}

.page-info {
  font-weight: 600;
  color: #1e293b;
  display: block;
}

.results-info {
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 0.25rem;
  display: block;
}

/* Contact Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 50;
  backdrop-filter: blur(8px);
}

.contact-modal {
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1.5rem;
  max-width: 36rem;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.3);
}

.modal-title-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
}

.title-decoration {
  width: 3rem;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 2px;
}

.modal-close {
  padding: 0.5rem;
  color: #9ca3af;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
}

.modal-close:hover {
  color: #6b7280;
  background: rgba(148, 163, 184, 0.1);
}

.modal-body {
  padding: 2rem;
  max-height: 60vh;
  overflow-y: auto;
}

.contact-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 1rem;
  font-size: 0.875rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

.contact-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  transform: scale(1.01);
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
}

.cancel-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid #e2e8f0;
  color: #64748b;
  border-radius: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  border-color: #cbd5e1;
  color: #475569;
}

.submit-contact-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  border-radius: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  flex: 1;
}

.submit-contact-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.submit-contact-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Animations */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Custom Scrollbar */
.main-content::-webkit-scrollbar,
.modal-body::-webkit-scrollbar {
  width: 6px;
}

.main-content::-webkit-scrollbar-track,
.modal-body::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 3px;
}

.main-content::-webkit-scrollbar-thumb,
.modal-body::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, rgba(148, 163, 184, 0.3), rgba(148, 163, 184, 0.5));
  border-radius: 3px;
  transition: all 0.3s ease;
}

.main-content::-webkit-scrollbar-thumb:hover,
.modal-body::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, rgba(148, 163, 184, 0.5), rgba(148, 163, 184, 0.7));
}

/* Responsive Design */
@media (max-width: 640px) {
  .dashboard-title {
    font-size: 1.25rem;
  }
  
  .header-actions {
    gap: 0.5rem;
  }
  
  .action-btn {
    padding: 0.5rem 0.75rem;
  }
  
  .dashboard-main {
    padding: 1rem;
    gap: 1.5rem;
  }
  
  .filter-chips {
    flex-direction: column;
    align-items: stretch;
  }
  
  .talent-grid {
    grid-template-columns: 1fr;
  }
  
  .pagination {
    flex-direction: column;
    gap: 1rem;
  }
  
  .modal-header,
  .modal-body {
    padding: 1.5rem;
  }
  
  .modal-footer {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .stats-container {
    grid-template-columns: 1fr;
  }
  
  .profile-header {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }
  
  .contact-status {
    align-self: center;
  }
}
</style>