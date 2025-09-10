<template>
  <!-- Interview Scheduling Modal -->
  <div v-if="showScheduleModal" class="modal-overlay" @click="closeScheduleModal">
    <div class="modal-container schedule-modal" @click.stop>
      <div class="modal-backdrop"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">Schedule Interview</h3>
          <button @click="closeScheduleModal" class="modal-close">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <div v-if="selectedApplicant" class="applicant-summary">
            <div class="applicant-info">
              <div class="applicant-avatar">
                {{ getInitials(selectedApplicant.applicantDetails?.firstName, selectedApplicant.applicantDetails?.lastName) }}
              </div>
              <div>
                <h4 class="applicant-name">
                  {{ selectedApplicant.applicantDetails?.firstName }} {{ selectedApplicant.applicantDetails?.lastName }}
                </h4>
                <p class="applicant-email">{{ selectedApplicant.applicantDetails?.email }}</p>
                <p class="job-title">{{ selectedJob?.title }}</p>
              </div>
            </div>
          </div>

          <form @submit.prevent="scheduleInterview" class="schedule-form">
            <!-- Interview Type -->
            <div class="form-group">
              <label class="form-label">Interview Type</label>
              <div class="interview-type-grid">
                <button 
                  type="button"
                  v-for="type in interviewTypes" 
                  :key="type.value"
                  class="interview-type-btn"
                  :class="{ 'selected': scheduleForm.interviewType === type.value }"
                  @click="scheduleForm.interviewType = type.value"
                >
                  <!-- Use simple SVG icons instead of dynamic components -->
                  <svg v-if="type.value === 'video'" class="interview-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <svg v-else-if="type.value === 'phone'" class="interview-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <svg v-else class="interview-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 119.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>{{ type.label }}</span>
                </button>
              </div>
            </div>

            <!-- Date and Time -->
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Interview Date</label>
                <input 
                  v-model="scheduleForm.date" 
                  type="date" 
                  class="form-input"
                  :min="minDate"
                  required 
                />
              </div>
              <div class="form-group">
                <label class="form-label">Start Time</label>
                <input 
                  v-model="scheduleForm.startTime" 
                  type="time" 
                  class="form-input"
                  required 
                />
              </div>
            </div>

            <!-- Duration -->
            <div class="form-group">
              <label class="form-label">Duration</label>
              <select v-model="scheduleForm.duration" class="form-select" required>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </select>
            </div>

            <!-- Interview Details -->
            <div v-if="scheduleForm.interviewType === 'video'" class="form-group">
              <label class="form-label">Meeting Platform</label>
              <select v-model="scheduleForm.platform" class="form-select">
                <option value="google_meet">Google Meet</option>
                <option value="zoom">Zoom</option>
                <option value="microsoft_teams">Microsoft Teams</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div v-if="scheduleForm.interviewType === 'in_person'" class="form-group">
              <label class="form-label">Location</label>
              <input 
                v-model="scheduleForm.location" 
                type="text" 
                class="form-input"
                placeholder="Enter interview location"
                required 
              />
            </div>

            <div v-if="scheduleForm.interviewType === 'phone'" class="form-group">
              <label class="form-label">Phone Number</label>
              <input 
                v-model="scheduleForm.phoneNumber" 
                type="tel" 
                class="form-input"
                placeholder="Enter your phone number"
              />
            </div>

            <!-- Interview Stage -->
            <div class="form-group">
              <label class="form-label">Interview Stage</label>
              <select v-model="scheduleForm.stage" class="form-select" required>
                <option value="screening">Initial Screening</option>
                <option value="technical">Technical Interview</option>
                <option value="behavioral">Behavioral Interview</option>
                <option value="final">Final Interview</option>
                <option value="panel">Panel Interview</option>
              </select>
            </div>

            <!-- Interview Notes -->
            <div class="form-group">
              <label class="form-label">Interview Notes</label>
              <textarea 
                v-model="scheduleForm.notes" 
                class="form-textarea" 
                rows="3"
                placeholder="Add any notes or agenda items for the interview..."
              ></textarea>
            </div>

            <!-- Send Reminder -->
            <div class="form-group">
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  v-model="scheduleForm.sendReminder"
                  class="form-checkbox"
                />
                <span>Send email reminder to candidate</span>
              </label>
            </div>

            <!-- Reminder Time -->
            <div v-if="scheduleForm.sendReminder" class="form-group">
              <label class="form-label">Send reminder</label>
              <select v-model="scheduleForm.reminderTime" class="form-select">
                <option value="24">24 hours before</option>
                <option value="12">12 hours before</option>
                <option value="6">6 hours before</option>
                <option value="2">2 hours before</option>
                <option value="1">1 hour before</option>
              </select>
            </div>

            <!-- Form Actions -->
            <div class="form-actions">
              <button type="button" @click="closeScheduleModal" class="btn-secondary">
                Cancel
              </button>
              <button type="submit" :disabled="isScheduling" class="btn-primary">
                <span v-if="isScheduling" class="loading-content">
                  <div class="spinner"></div>
                  <span>Scheduling...</span>
                </span>
                <span v-else>Schedule Interview</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- Scheduled Interviews List -->
  <div v-if="showInterviewsList" class="interviews-section">
    <div class="section-header">
      <h4 class="section-title">Scheduled Interviews</h4>
      <div class="interview-filters">
        <select v-model="interviewStatusFilter" class="mini-filter">
          <option value="">All Interviews</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
    </div>

    <div v-if="filteredInterviews.length === 0" class="no-interviews">
      <svg class="no-interviews-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p>No interviews scheduled yet</p>
    </div>

    <div v-else class="interviews-list">
      <div 
        v-for="interview in filteredInterviews" 
        :key="interview.id"
        class="interview-card"
      >
        <div class="interview-header">
          <div class="interview-candidate">
            <div class="candidate-avatar small">
              {{ getInitials(interview.candidateName?.split(' ')[0], interview.candidateName?.split(' ')[1]) }}
            </div>
            <div class="candidate-info">
              <h5 class="candidate-name">{{ interview.candidateName }}</h5>
              <p class="candidate-email">{{ interview.candidateEmail }}</p>
            </div>
          </div>
          <div class="interview-status">
            <span :class="`status-badge ${interview.status}`">
              {{ formatInterviewStatus(interview.status) }}
            </span>
          </div>
        </div>

        <div class="interview-details">
          <div class="interview-time">
            <svg class="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{{ formatInterviewDateTime(interview.date, interview.startTime) }}</span>
          </div>
          
          <div class="interview-duration">
            <svg class="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ interview.duration }} minutes</span>
          </div>
          
          <div class="interview-type">
            <svg v-if="interview.type === 'video'" class="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <svg v-else-if="interview.type === 'phone'" class="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <svg v-else class="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 119.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{{ getInterviewTypeLabel(interview.type) }}</span>
          </div>

          <div class="interview-stage">
            <svg class="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ formatInterviewStage(interview.stage) }}</span>
          </div>
        </div>

        <div v-if="interview.notes" class="interview-notes">
          <p class="notes-label">Notes:</p>
          <p class="notes-text">{{ interview.notes }}</p>
        </div>

        <div class="interview-actions">
          <button 
            v-if="interview.type === 'video' && interview.meetingLink"
            @click="joinMeeting(interview.meetingLink)"
            class="action-btn primary"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Join Meeting
          </button>
          
          <button 
            @click="rescheduleInterview(interview)"
            class="action-btn secondary"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Reschedule
          </button>
          
          <button 
            @click="cancelInterview(interview.id)"
            class="action-btn danger"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

// FIXED SCRIPT SECTION FOR InterviewScheduling.vue

<script setup>
import { ref, computed, onMounted } from 'vue'

// Props
const props = defineProps({
  selectedJob: Object,
  jobApplications: Array
})

// Reactive data
const showScheduleModal = ref(false)
const showInterviewsList = ref(false)
const selectedApplicant = ref(null)
const isScheduling = ref(false)
const interviewStatusFilter = ref('')

// API method reference - FIX: Properly declare this variable
let scheduleInterviewAPI = null

// Form data
const scheduleForm = ref({
  interviewType: 'video',
  date: '',
  startTime: '',
  duration: 60,
  platform: 'google_meet',
  location: '',
  phoneNumber: '',
  stage: 'screening',
  notes: '',
  sendReminder: true,
  reminderTime: 24
})


// Interview types - using simple objects instead of dynamic imports
const interviewTypes = [
  { value: 'video', label: 'Video Call' },
  { value: 'phone', label: 'Phone Call' },
  { value: 'in_person', label: 'In Person' }
]

// Computed properties
const minDate = computed(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
})

const filteredInterviews = computed(() => {
  if (!interviewStatusFilter.value) return scheduledInterviews.value
  return scheduledInterviews.value.filter(interview => interview.status === interviewStatusFilter.value)
})

// Methods
const openScheduleModal = (applicant) => {
  console.log('Opening schedule modal for:', applicant) // Debug log
  selectedApplicant.value = applicant
  showScheduleModal.value = true
  
  // Reset form
  scheduleForm.value = {
    interviewType: 'video',
    date: '',
    startTime: '',
    duration: 60,
    platform: 'google_meet',
    location: '',
    phoneNumber: '',
    stage: 'screening',
    notes: '',
    sendReminder: true,
    reminderTime: 24
  }
}

const closeScheduleModal = () => {
  showScheduleModal.value = false
  selectedApplicant.value = null
}

// FIX: Properly declare setScheduleMethod to accept the API function
const setScheduleMethod = (apiMethod) => {
  scheduleInterviewAPI = apiMethod
}

// FIX: Updated scheduleInterview method with proper error handling
const scheduleInterview = async () => {
  if (!selectedApplicant.value) {
    console.error('No applicant selected')
    return
  }
  
  isScheduling.value = true
  
  try {
    const interviewData = {
      applicationId: selectedApplicant.value._id,
      jobId: props.selectedJob?._id,
      candidateName: `${selectedApplicant.value.applicantDetails?.firstName} ${selectedApplicant.value.applicantDetails?.lastName}`,
      candidateEmail: selectedApplicant.value.applicantDetails?.email,
      interviewType: scheduleForm.value.interviewType,
      date: scheduleForm.value.date,
      startTime: scheduleForm.value.startTime,
      duration: scheduleForm.value.duration,
      platform: scheduleForm.value.platform,
      location: scheduleForm.value.location,
      phoneNumber: scheduleForm.value.phoneNumber,
      stage: scheduleForm.value.stage,
      notes: scheduleForm.value.notes,
      sendReminder: scheduleForm.value.sendReminder,
      reminderTime: scheduleForm.value.reminderTime
    }
    
    // Use the API method passed from parent
    if (scheduleInterviewAPI && typeof scheduleInterviewAPI === 'function') {
      await scheduleInterviewAPI(interviewData)
      closeScheduleModal()
    } 
    
  } catch (error) {
    console.error('Schedule interview error:', error)
  } finally {
    isScheduling.value = false
  }
}

const generateMeetingLink = () => {
  const platforms = {
    google_meet: 'https://meet.google.com/',
    zoom: 'https://zoom.us/j/',
    microsoft_teams: 'https://teams.microsoft.com/l/meetup-join/'
  }
  const randomId = Math.random().toString(36).substr(2, 9)
  return platforms[scheduleForm.value.platform] + randomId
}

const rescheduleInterview = (interview) => {
  selectedApplicant.value = {
    applicantDetails: {
      firstName: interview.candidateName.split(' ')[0],
      lastName: interview.candidateName.split(' ')[1] || '',
      email: interview.candidateEmail
    },
    _id: interview.applicationId
  }
  
  scheduleForm.value = {
    interviewType: interview.type,
    date: interview.date,
    startTime: interview.startTime,
    duration: interview.duration,
    platform: interview.platform || 'google_meet',
    location: interview.location || '',
    phoneNumber: interview.phoneNumber || '',
    stage: interview.stage,
    notes: interview.notes || '',
    sendReminder: true,
    reminderTime: 24
  }
  
  showScheduleModal.value = true
}

const cancelInterview = (interviewId) => {
  if (confirm('Are you sure you want to cancel this interview?')) {
    const index = scheduledInterviews.value.findIndex(i => i.id === interviewId)
    if (index !== -1) {
      scheduledInterviews.value[index].status = 'cancelled'
    }
  }
}

const joinMeeting = (meetingLink) => {
  window.open(meetingLink, '_blank')
}

// Utility functions
const getInitials = (firstName, lastName) => {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
}

const formatInterviewDateTime = (date, time) => {
  if (!date || !time) return 'TBD'
  const interviewDate = new Date(`${date}T${time}`)
  return interviewDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

const formatInterviewStatus = (status) => {
  const statusMap = {
    scheduled: 'Scheduled',
    completed: 'Completed',
    cancelled: 'Cancelled',
    rescheduled: 'Rescheduled'
  }
  return statusMap[status] || status
}

const formatInterviewStage = (stage) => {
  const stageMap = {
    screening: 'Initial Screening',
    technical: 'Technical Interview',
    behavioral: 'Behavioral Interview',
    final: 'Final Interview',
    panel: 'Panel Interview'
  }
  return stageMap[stage] || stage
}

const getInterviewTypeLabel = (type) => {
  const typeMap = {
    video: 'Video Call',
    phone: 'Phone Call',
    in_person: 'In Person'
  }
  return typeMap[type] || type
}

const generateCalendarEvent = (interview) => {
  const startDate = new Date(`${interview.date}T${interview.startTime}`)
  const endDate = new Date(startDate.getTime() + interview.duration * 60000)
  
  const formatDate = (date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }
  
  const calendarUrl = new URL('https://calendar.google.com/calendar/render')
  calendarUrl.searchParams.set('action', 'TEMPLATE')
  calendarUrl.searchParams.set('text', `Interview: ${interview.stage} - ${props.selectedJob?.title}`)
  calendarUrl.searchParams.set('dates', `${formatDate(startDate)}/${formatDate(endDate)}`)
  calendarUrl.searchParams.set('details', `
    Interview Details:
    Position: ${props.selectedJob?.title}
    Company: ${props.selectedJob?.employer}
    Type: ${interview.interviewType}
    ${interview.meetingLink ? `Meeting Link: ${interview.meetingLink}` : ''}
    ${interview.location ? `Location: ${interview.location}` : ''}
    ${interview.notes ? `Notes: ${interview.notes}` : ''}
  `.trim())
  
  return calendarUrl.toString()
}

// Expose methods to parent component
defineExpose({
  openScheduleModal,
  setScheduleMethod,
  showInterviewsList
})
</script>

<style scoped>
/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(8px);
}

.modal-container {
  position: relative;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  border-radius: 1.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.schedule-modal {
  max-width: 600px;
}

.modal-backdrop {
  position: absolute;
  inset: 0;
  background: white;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6);
}

.modal-content {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
}

.modal-close {
  padding: 0.5rem;
  color: #a0aec0;
  background: none;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-close:hover {
  color: #4a5568;
  background: #f7fafc;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.applicant-summary {
  background: #f8fafc;
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.applicant-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.applicant-avatar {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
}

.applicant-name {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.applicant-email {
  font-size: 0.875rem;
  color: #718096;
  margin: 0.25rem 0 0;
}

.job-title {
  font-size: 0.875rem;
  color: #4a5568;
  font-style: italic;
  margin: 0.25rem 0 0;
}

/* Form Styles */
.schedule-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-label {
  font-weight: 500;
  color: #2d3748;
  font-size: 0.875rem;
}

.form-input,
.form-select,
.form-textarea {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: border-color 0.2s ease;
  background: white;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

/* Interview Type Grid */
.interview-type-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.interview-type-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.interview-type-btn:hover {
  border-color: #cbd5e0;
  background: #f7fafc;
}

.interview-type-btn.selected {
  border-color: #667eea;
  background: #f7fafc;
  color: #667eea;
}

.interview-icon {
  width: 24px;
  height: 24px;
}

/* Checkbox */
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.form-checkbox {
  width: 16px;
  height: 16px;
  accent-color: #667eea;
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #5a67d8;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f7fafc;
  color: #4a5568;
  border: 1px solid #e2e8f0;
}

.btn-secondary:hover {
  background: #edf2f7;
}

.loading-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Interviews Section */
.interviews-section {
  margin-top: 2rem;
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2d3748;
}

.interview-filters {
  display: flex;
  gap: 0.5rem;
}

.mini-filter {
  padding: 0.375rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  background: white;
  font-size: 0.75rem;
  color: #4a5568;
}

.no-interviews {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #718096;
  text-align: center;
}

.no-interviews-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.interviews-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 400px;
  overflow-y: auto;
}

.interview-card {
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.5rem;
  background: #fafafa;
  transition: all 0.2s ease;
}

.interview-card:hover {
  border-color: #cbd5e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.interview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.interview-candidate {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.candidate-avatar.small {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.75rem;
}

.candidate-info {
  flex: 1;
}

.candidate-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.candidate-email {
  font-size: 0.75rem;
  color: #718096;
  margin: 0.125rem 0 0;
}

.interview-status {
  flex-shrink: 0;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.status-badge.scheduled {
  background: #dbeafe;
  color: #1e40af;
}

.status-badge.completed {
  background: #dcfce7;
  color: #166534;
}

.status-badge.cancelled {
  background: #fef2f2;
  color: #dc2626;
}

.interview-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.interview-time,
.interview-duration,
.interview-type,
.interview-stage {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #4a5568;
}

.detail-icon {
  width: 16px;
  height: 16px;
  color: #718096;
  flex-shrink: 0;
}

.interview-notes {
  background: #f7fafc;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  border-left: 3px solid #667eea;
}

.notes-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 0.25rem;
}

.notes-text {
  font-size: 0.875rem;
  color: #2d3748;
  margin: 0;
  line-height: 1.4;
}

.interview-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  text-decoration: none;
}

.action-btn.primary {
  background: #667eea;
  color: white;
}

.action-btn.primary:hover {
  background: #5a67d8;
}

.action-btn.secondary {
  background: #f7fafc;
  color: #4a5568;
  border: 1px solid #e2e8f0;
}

.action-btn.secondary:hover {
  background: #edf2f7;
  border-color: #cbd5e0;
}

.action-btn.danger {
  background: #fed7d7;
  color: #c53030;
}

.action-btn.danger:hover {
  background: #feb2b2;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .interview-type-grid {
    grid-template-columns: 1fr;
  }
  
  .interview-details {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .interview-actions {
    flex-direction: column;
  }
  
  .action-btn {
    justify-content: center;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .interview-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .modal-container {
    margin: 0.5rem;
    max-width: calc(100vw - 1rem);
  }
  
  .modal-body {
    padding: 1rem;
  }
  
  .interview-card {
    padding: 1rem;
  }
}
</style>