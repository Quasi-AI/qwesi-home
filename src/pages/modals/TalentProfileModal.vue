<template>
  <!-- Talent Profile Modal -->
  <div v-if="isOpen" class="talent-modal-overlay" @click="closeModal">
    <div class="talent-modal-container" @click.stop>
      <!-- Modal Header -->
      <div class="modal-header">
        <div class="header-content">
          <h2 class="modal-title">Talent Profile</h2>
          <p class="modal-subtitle">Detailed professional profile</p>
        </div>
        <button @click="closeModal" class="close-btn">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="modal-body">
        <!-- Loading State -->
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p class="loading-text">Loading talent profile...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-container">
          <div class="error-icon">
            <svg class="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 class="error-title">Profile Not Found</h3>
          <p class="error-description">{{ error }}</p>
        </div>

        <!-- Profile Content -->
        <div v-else-if="talent" class="profile-content">
          <!-- Profile Hero Section -->
          <div class="profile-hero-compact">
            <div class="hero-backdrop"></div>
            <div class="hero-content">
              <div class="profile-main-compact">
                <div class="profile-avatar-section">
                  <div class="profile-avatar-compact">
                    <div v-if="talent.profileImage" class="avatar-image-compact">
                      <img :src="talent.profileImage" :alt="talent.name" />
                    </div>
                    <div v-else class="avatar-initials-compact">
                      {{ getInitials(talent.name) }}
                    </div>
                    <div class="avatar-status">
                      <div class="status-dot" :class="getActivityStatusClass(talent.activityLevel)"></div>
                    </div>
                  </div>
                </div>

                <div class="profile-info-compact">
                  <h1 class="talent-name-compact">{{ talent.name }}</h1>
                  <p class="talent-experience-compact">{{ talent.experience }}</p>
                  
                  <div class="profile-stats-compact">
                    <div class="stat-item-compact">
                      <span class="stat-number">{{ talent.skillsCount }}</span>
                      <span class="stat-label">Skills</span>
                    </div>
                    <div class="stat-item-compact">
                      <span class="stat-number">{{ talent.totalConversations }}</span>
                      <span class="stat-label">Conversations</span>
                    </div>
                    <div class="stat-item-compact">
                      <span class="stat-number">{{ formatTimeAgo(talent.joinedDate) }}</span>
                      <span class="stat-label">Member Since</span>
                    </div>
                  </div>

                  <div class="activity-badges">
                    <div class="activity-badge-compact" :class="getActivityBadgeClass(talent.activityLevel)">
                      <div class="activity-dot"></div>
                      <span>{{ talent.activityLevel }} Activity</span>
                    </div>
                    <div class="engagement-score-compact">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span>{{ talent.engagementScore }}%</span>
                    </div>
                  </div>
                </div>

                <div class="profile-actions-compact">
                  <button 
                    @click="contactTalent"
                    class="contact-btn-compact"
                    :disabled="!talent.contactInfo.emailAvailable && !talent.contactInfo.phoneAvailable"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Contact
                  </button>
                  
                  <button @click="shareProfile" class="share-btn-compact">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Profile Details Grid -->
          <div class="profile-details-compact">
            <!-- Skills Section -->
            <div class="detail-card-compact skills-card">
              <div class="card-header-compact">
                <div class="card-icon-compact bg-blue-500">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 class="card-title-compact">Skills & Expertise</h3>
              </div>
              <div class="card-content-compact">
                <div class="skills-grid-compact">
                  <div 
                    v-for="(skill, index) in talent.skills"
                    :key="skill"
                    class="skill-badge-compact"
                    :style="{ animationDelay: `${index * 50}ms` }"
                  >
                    {{ skill }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Experience Section -->
            <div class="detail-card-compact experience-card">
              <div class="card-header-compact">
                <div class="card-icon-compact bg-emerald-500">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                </div>
                <h3 class="card-title-compact">Experience</h3>
              </div>
              <div class="card-content-compact">
                <p class="experience-text-compact">{{ talent.experience }}</p>
                <div class="experience-meta-compact">
                  <div class="meta-item-compact">
                    <svg class="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Last active {{ formatTimeAgo(talent.lastActive) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Goals Section -->
            <div v-if="talent.goals" class="detail-card-compact goals-card">
              <div class="card-header-compact">
                <div class="card-icon-compact bg-purple-500">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 class="card-title-compact">Career Goals</h3>
              </div>
              <div class="card-content-compact">
                <p class="goals-text-compact">{{ talent.goals }}</p>
              </div>
            </div>

            <!-- Help Options Section -->
            <div v-if="talent.helpOptions.length" class="detail-card-compact help-card">
              <div class="card-header-compact">
                <div class="card-icon-compact bg-amber-500">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 class="card-title-compact">Looking For</h3>
              </div>
              <div class="card-content-compact">
                <div class="help-options-compact">
                  <div 
                    v-for="option in talent.helpOptions"
                    :key="option"
                    class="help-option-compact"
                  >
                    <svg class="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <span>{{ formatHelpOption(option) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Contact Information Section -->
            <div class="detail-card-compact contact-card">
              <div class="card-header-compact">
                <div class="card-icon-compact bg-rose-500">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 class="card-title-compact">Contact</h3>
              </div>
              <div class="card-content-compact">
                <div class="contact-options-compact">
                  <div class="contact-item-compact" v-if="talent.contactInfo.emailAvailable">
                    <svg class="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{{ talent.contactInfo.email }}</span>
                  </div>
                  
                  <div v-if="!talent.contactInfo.emailAvailable && !talent.contactInfo.phoneAvailable" class="no-contact-compact">
                    <svg class="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Contact info is private</span>
                  </div>
                </div>
                
                <div class="contact-cta-compact">
                  <button @click="contactTalent" class="contact-cta-btn-compact">
                    Send Message to {{ talent.name.split(' ')[0] }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Form Modal -->
    <div v-if="showContactModal" class="contact-modal-overlay" @click="closeContactModal">
      <div class="contact-modal-compact" @click.stop>
        <div class="contact-modal-header">
          <h3 class="contact-modal-title">Contact {{ talent?.name }}</h3>
          <button @click="closeContactModal" class="contact-modal-close">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="contact-modal-body">
          <form @submit.prevent="submitContactRequest" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1">Your Name *</label>
                <input 
                  v-model="contactForm.requesterName" 
                  type="text" 
                  placeholder="Enter your full name"
                  class="contact-input-compact"
                  required 
                />
              </div>
              
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1">Your Email *</label>
                <input 
                  v-model="contactForm.requesterEmail" 
                  type="email" 
                  placeholder="your.email@example.com"
                  class="contact-input-compact"
                  required 
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1">Job Title/Position</label>
              <input 
                v-model="contactForm.jobTitle" 
                type="text" 
                placeholder="e.g., Software Developer, Marketing Manager"
                class="contact-input-compact"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1">Message *</label>
              <textarea 
                v-model="contactForm.message" 
                rows="3"
                placeholder="Tell {{ talent?.name }} about the opportunity..."
                class="contact-input-compact resize-none"
                required
              ></textarea>
            </div>

            <div class="contact-modal-footer">
              <button 
                type="button" 
                @click="closeContactModal"
                class="cancel-btn-compact"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                :disabled="isSubmittingContact"
                class="submit-contact-btn-compact"
              >
                <span v-if="isSubmittingContact">Sending...</span>
                <span v-else>Send Message</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  talentId: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['close', 'contact-sent'])

// State
const loading = ref(false)
const error = ref(null)
const talent = ref(null)
const showContactModal = ref(false)
const isSubmittingContact = ref(false)

// Contact Form
const contactForm = ref({
  requesterName: '',
  requesterEmail: '',
  requesterPhone: '',
  jobTitle: '',
  message: ''
})

// API Base URL
const API_BASE = 'https://dark-caldron-448714-u5.uc.r.appspot.com'

// Watch for modal open/close and talent ID changes
watch(() => props.isOpen, (newValue) => {
  if (newValue && props.talentId) {
    fetchTalentProfile()
  }
})

watch(() => props.talentId, (newValue) => {
  if (newValue && props.isOpen) {
    fetchTalentProfile()
  }
})

// Fetch talent profile
const fetchTalentProfile = async () => {
  if (!props.talentId) return
  
  try {
    loading.value = true
    error.value = null
    
    const response = await $fetch(`${API_BASE}/api/talent/profile/${props.talentId}`)
    
    if (response.success) {
      talent.value = response.data
    } else {
      error.value = response.error || 'Failed to load talent profile'
    }
  } catch (err) {
    console.error("Error fetching talent profile:", err)
    error.value = err.statusCode === 404 ? 'Talent profile not found' : 'Failed to load talent profile'
  } finally {
    loading.value = false
  }
}

// Utility functions
const getInitials = (name) => {
  if (!name) return 'U'
  return name.split(' ').map(n => n.charAt(0)).join('').slice(0, 2).toUpperCase()
}

const formatTimeAgo = (dateString) => {
  if (!dateString) return 'Unknown'
  const date = new Date(dateString)
  const now = new Date()
  const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return 'Today'
  if (diffInDays === 1) return 'Yesterday'
  if (diffInDays < 7) return `${diffInDays}d ago`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)}mo ago`
  return `${Math.floor(diffInDays / 365)}y ago`
}

const formatHelpOption = (option) => {
  const mapping = {
    'AI Coach (Interview Prep)': 'Interview Prep',
    'Resume Builder': 'Resume Building',
    'Career Navigator': 'Career Guidance',
    'Confidence Booster': 'Confidence Building'
  }
  return mapping[option] || option
}

const getActivityStatusClass = (level) => {
  return {
    'status-high': level === 'High',
    'status-medium': level === 'Medium',
    'status-low': level === 'Low'
  }
}

const getActivityBadgeClass = (level) => {
  return {
    'activity-high': level === 'High',
    'activity-medium': level === 'Medium',
    'activity-low': level === 'Low'
  }
}

// Actions
const closeModal = () => {
  showContactModal.value = false
  emit('close')
}

const contactTalent = () => {
  showContactModal.value = true
  // You can auto-fill with user data if available
  contactForm.value.requesterName = user.value?.name || ''
  contactForm.value.requesterEmail = user.value?.email || ''
}

const closeContactModal = () => {
  showContactModal.value = false
  resetContactForm()
}

const resetContactForm = () => {
  contactForm.value = {
    requesterName: '',
    requesterEmail: '',
    requesterPhone: '',
    jobTitle: '',
    message: ''
  }
}

const submitContactRequest = async () => {
  try {
    isSubmittingContact.value = true
    
    const response = await $fetch(`${API_BASE}/api/talent/${talent.value.id}/contact`, {
      method: 'POST',
      body: contactForm.value
    })
    
    if (response.success) {
      emit('contact-sent', talent.value.name)
      closeContactModal()
    }
  } catch (error) {
    console.error('Contact request error:', error)
  } finally {
    isSubmittingContact.value = false
  }
}

const shareProfile = async () => {
  try {
    const url = `${window.location.origin}/talent/${talent.value.id}`
    if (navigator.share) {
      await navigator.share({
        title: `${talent.value.name} - Professional Profile`,
        text: `Check out ${talent.value.name}'s professional profile`,
        url: url
      })
    } else {
      await navigator.clipboard.writeText(url)
      // You can emit a success message here
    }
  } catch (error) {
    console.error('Share failed:', error)
  }
}
</script>

<style scoped>
/* Modal Overlay */
.talent-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 50;
  backdrop-filter: blur(8px);
}

.talent-modal-container {
  background: white;
  border-radius: 1.5rem;
  width: 100%;
  max-width: 64rem;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
}

/* Modal Header */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(90deg, #f8fafc 0%, #f1f5f9 100%);
}

.header-content h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.modal-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.close-btn {
  padding: 0.5rem;
  color: #64748b;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
}

.close-btn:hover {
  color: #374151;
  background: rgba(148, 163, 184, 0.1);
}

/* Modal Body */
.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

/* Loading States */
.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
}

.loading-spinner {
  width: 2.5rem;
  height: 2.5rem;
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

.error-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 0.5rem;
}

.error-description {
  color: #6b7280;
}

/* Profile Hero Compact */
.profile-hero-compact {
  position: relative;
  border-radius: 1.5rem;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.hero-backdrop {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(139, 92, 246, 0.85) 100%);
}

.hero-content {
  position: relative;
  z-index: 10;
  padding: 2rem;
  color: white;
}

.profile-main-compact {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1.5rem;
  align-items: center;
}

@media (max-width: 768px) {
  .profile-main-compact {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 1rem;
  }
}

.profile-avatar-compact {
  position: relative;
  width: 4rem;
  height: 4rem;
}

.avatar-image-compact {
  width: 4rem;
  height: 4rem;
  border-radius: 1.25rem;
  overflow: hidden;
  border: 3px solid rgba(255, 255, 255, 0.3);
}

.avatar-image-compact img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials-compact {
  width: 4rem;
  height: 4rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
  color: #1e40af;
  border-radius: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.25rem;
}

.avatar-status {
  position: absolute;
  bottom: 0.125rem;
  right: 0.125rem;
}

.status-dot {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  border: 2px solid white;
}

.status-dot.status-high {
  background: #22c55e;
}

.status-dot.status-medium {
  background: #eab308;
}

.status-dot.status-low {
  background: #ef4444;
}

.talent-name-compact {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 0.25rem;
  line-height: 1.2;
}

.talent-experience-compact {
  font-size: 1rem;
  opacity: 0.9;
  margin-bottom: 1rem;
}

.profile-stats-compact {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

@media (max-width: 640px) {
  .profile-stats-compact {
    justify-content: center;
  }
}

.stat-item-compact {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.125rem;
}

.stat-number {
  font-size: 1rem;
  font-weight: 700;
}

.stat-label {
  font-size: 0.75rem;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.activity-badges {
  display: flex;
  align-items: center;
  gap: 1rem;
}

@media (max-width: 640px) {
  .activity-badges {
    justify-content: center;
    flex-wrap: wrap;
  }
}

.activity-badge-compact {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 1.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.activity-badge-compact.activity-high {
  background: rgba(34, 197, 94, 0.2);
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.activity-badge-compact.activity-medium {
  background: rgba(234, 179, 8, 0.2);
  border: 1px solid rgba(234, 179, 8, 0.3);
}

.activity-badge-compact.activity-low {
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.activity-dot {
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 50%;
  background: currentColor;
  animation: pulse 2s ease-in-out infinite;
}

.engagement-score-compact {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  opacity: 0.9;
}

.profile-actions-compact {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.contact-btn-compact, .share-btn-compact {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.625rem 1rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  white-space: nowrap;
}

.contact-btn-compact {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
}

.contact-btn-compact:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.contact-btn-compact:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.share-btn-compact {
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
}

.share-btn-compact:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

/* Profile Details Compact */
.profile-details-compact {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.detail-card-compact {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1rem;
  padding: 1rem;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}

.detail-card-compact:hover {
  transform: translateY(-2px);
}

.card-header-compact {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.card-icon-compact {
  width: 2rem;
  height: 2rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-title-compact {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
}

.card-content-compact {
  color: #64748b;
}

/* Skills Grid Compact */
.skills-grid-compact {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-badge-compact {
  padding: 0.375rem 0.75rem;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%);
  color: #1e40af;
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.2s ease;
  animation: fadeInUp 0.4s ease forwards;
  opacity: 0;
  transform: translateY(10px);
}

.skill-badge-compact:hover {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(99, 102, 241, 0.1) 100%);
  transform: translateY(-1px);
}

/* Experience Compact */
.experience-text-compact {
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 0.75rem;
  color: #374151;
}

.experience-meta-compact {
  display: flex;
  gap: 0.75rem;
}

.meta-item-compact {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: #64748b;
}

/* Goals Compact */
.goals-text-compact {
  font-size: 0.875rem;
  line-height: 1.5;
  color: #374151;
}

/* Help Options Compact */
.help-options-compact {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.help-option-compact {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: rgba(245, 158, 11, 0.05);
  border-radius: 0.75rem;
  border: 1px solid rgba(245, 158, 11, 0.1);
  font-size: 0.75rem;
}

.help-option-compact:hover {
  background: rgba(245, 158, 11, 0.1);
}

/* Contact Options Compact */
.contact-options-compact {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.contact-item-compact {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: rgba(248, 250, 252, 0.8);
  border-radius: 0.75rem;
  font-family: monospace;
  font-size: 0.75rem;
}

.no-contact-compact {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(148, 163, 184, 0.05);
  border-radius: 0.75rem;
  color: #64748b;
  font-style: italic;
  font-size: 0.75rem;
}

.contact-cta-compact {
  text-align: center;
}

.contact-cta-btn-compact {
  width: 100%;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  border-radius: 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.contact-cta-btn-compact:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

/* Contact Modal */
.contact-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 60;
  backdrop-filter: blur(4px);
}

.contact-modal-compact {
  background: white;
  border-radius: 1rem;
  max-width: 28rem;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
}

.contact-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.contact-modal-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.contact-modal-close {
  padding: 0.375rem;
  color: #64748b;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.contact-modal-close:hover {
  color: #374151;
  background: rgba(148, 163, 184, 0.1);
}

.contact-modal-body {
  padding: 1.5rem;
  max-height: 60vh;
  overflow-y: auto;
}

.contact-input-compact {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.contact-input-compact:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.contact-modal-footer {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.cancel-btn-compact {
  padding: 0.625rem 1.25rem;
  border: 1px solid #d1d5db;
  color: #64748b;
  border-radius: 0.75rem;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.cancel-btn-compact:hover {
  border-color: #9ca3af;
  color: #374151;
}

.submit-contact-btn-compact {
  padding: 0.625rem 1.25rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  border-radius: 0.75rem;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  flex: 1;
}

.submit-contact-btn-compact:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.submit-contact-btn-compact:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Animations */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Custom Scrollbar for Modal */
.modal-body::-webkit-scrollbar,
.contact-modal-body::-webkit-scrollbar {
  width: 4px;
}

.modal-body::-webkit-scrollbar-track,
.contact-modal-body::-webkit-scrollbar-track {
  background: transparent;
}

.modal-body::-webkit-scrollbar-thumb,
.contact-modal-body::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.3);
  border-radius: 2px;
}

/* Responsive Design */
@media (max-width: 640px) {
  .talent-modal-container {
    max-width: 100%;
    margin: 0.5rem;
  }
  
  .modal-header {
    padding: 1rem 1.5rem;
  }
  
  .modal-body {
    padding: 1rem;
  }
  
  .profile-details-compact {
    grid-template-columns: 1fr;
  }
  
  .contact-modal-footer {
    flex-direction: column;
  }
}
</style>