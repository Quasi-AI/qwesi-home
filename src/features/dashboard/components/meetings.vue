<template>
  <div class="scheduler-overlay" @click="closeMeetingScheduler">
    <div class="scheduler-container" @click.stop>
      <!-- Header -->
      <div class="scheduler-header">
        <div class="header-backdrop"></div>
        <div class="header-content">
          <div class="header-info">
            <h3 class="scheduler-title">Schedule Meeting</h3>
            <p class="scheduler-subtitle">Book a meeting with {{ talent.name }}</p>
          </div>
          <button @click="$emit('close')" class="close-btn">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="scheduler-content">
        <!-- Step Indicator -->
        <div class="step-indicator">
          <div class="step" :class="{ 'active': currentStep >= 1, 'completed': currentStep > 1 }">
            <div class="step-circle">
              <svg v-if="currentStep > 1" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span v-else>1</span>
            </div>
            <span class="step-label">Meeting Type</span>
          </div>
          <div class="step-connector" :class="{ 'completed': currentStep > 1 }"></div>
          <div class="step" :class="{ 'active': currentStep >= 2, 'completed': currentStep > 2 }">
            <div class="step-circle">
              <svg v-if="currentStep > 2" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span v-else>2</span>
            </div>
            <span class="step-label">Date & Time</span>
          </div>
          <div class="step-connector" :class="{ 'completed': currentStep > 2 }"></div>
          <div class="step" :class="{ 'active': currentStep >= 3 }">
            <div class="step-circle">
              <span>3</span>
            </div>
            <span class="step-label">Details</span>
          </div>
        </div>

        <!-- Step 1: Meeting Type -->
        <div v-if="currentStep === 1" class="step-content">
          <h4 class="step-title">What type of meeting would you like to schedule?</h4>
          <div class="meeting-types">
            <div 
              v-for="type in meetingTypes" 
              :key="type.id"
              @click="selectMeetingType(type)"
              class="meeting-type-card"
              :class="{ 'selected': selectedMeetingType?.id === type.id }"
            >
              <div class="type-icon" :class="type.colorClass">
                <component :is="type.icon" class="w-6 h-6" />
              </div>
              <div class="type-info">
                <h5 class="type-name">{{ type.name }}</h5>
                <p class="type-description">{{ type.description }}</p>
                <div class="type-meta">
                  <span class="type-duration">{{ type.duration }}</span>
                  <span class="type-rate" v-if="type.rate">{{ type.rate }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Date & Time -->
        <div v-if="currentStep === 2" class="step-content">
          <h4 class="step-title">When would you like to meet?</h4>
          
          <!-- Calendar -->
          <div class="calendar-section">
            <div class="calendar-header">
              <button @click="previousMonth" class="nav-btn">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h5 class="month-year">{{ formatMonthYear(currentDate) }}</h5>
              <button @click="nextMonth" class="nav-btn">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div class="calendar-grid">
              <div class="calendar-header-days">
                <div v-for="day in dayHeaders" :key="day" class="day-header">{{ day }}</div>
              </div>
              <div class="calendar-days">
                <button
                  v-for="day in calendarDays"
                  :key="day.date"
                  @click="selectDate(day)"
                  :disabled="!day.available"
                  class="calendar-day"
                  :class="{
                    'today': day.isToday,
                    'selected': selectedDate && isSameDay(selectedDate, day.date),
                    'other-month': !day.inCurrentMonth,
                    'available': day.available,
                    'unavailable': !day.available
                  }"
                >
                  {{ day.day }}
                </button>
              </div>
            </div>
          </div>

          <!-- Time Slots -->
          <div v-if="selectedDate" class="time-slots-section">
            <h5 class="time-slots-title">Available times for {{ formatDate(selectedDate) }}</h5>
            <div class="time-slots-grid">
              <button
                v-for="slot in availableTimeSlots"
                :key="slot.time"
                @click="selectTimeSlot(slot)"
                :disabled="!slot.available"
                class="time-slot"
                :class="{
                  'selected': selectedTimeSlot?.time === slot.time,
                  'available': slot.available,
                  'unavailable': !slot.available
                }"
              >
                {{ slot.time }}
              </button>
            </div>
          </div>

          <!-- Timezone Info -->
          <div class="timezone-info">
            <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Times shown in {{ talent.timezone || 'EST (UTC-5)' }}</span>
          </div>
        </div>

        <!-- Step 3: Meeting Details -->
        <div v-if="currentStep === 3" class="step-content">
          <h4 class="step-title">Meeting Details</h4>
          
          <form @submit.prevent="scheduleMeeting" class="meeting-form">
            <div class="form-group">
              <label class="form-label">Meeting Title *</label>
              <input
                v-model="meetingForm.title"
                type="text"
                placeholder="e.g., Project Discussion, Interview, Consultation"
                class="form-input"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Agenda/Description</label>
              <textarea
                v-model="meetingForm.description"
                rows="4"
                placeholder="Describe what you'd like to discuss in the meeting..."
                class="form-input"
              ></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Your Name *</label>
                <input
                  v-model="meetingForm.requesterName"
                  type="text"
                  placeholder="Your full name"
                  class="form-input"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">Your Email *</label>
                <input
                  v-model="meetingForm.requesterEmail"
                  type="email"
                  placeholder="your.email@example.com"
                  class="form-input"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Phone Number</label>
              <input
                v-model="meetingForm.phone"
                type="tel"
                placeholder="Your phone number"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Additional Notes</label>
              <textarea
                v-model="meetingForm.notes"
                rows="3"
                placeholder="Any additional information or special requirements..."
                class="form-input"
              ></textarea>
            </div>

            <!-- Meeting Summary -->
            <div class="meeting-summary">
              <h5 class="summary-title">Meeting Summary</h5>
              <div class="summary-content">
                <div class="summary-item">
                  <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>{{ selectedMeetingType?.name }}</span>
                </div>
                <div class="summary-item">
                  <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{{ formatDateTime(selectedDate, selectedTimeSlot?.time) }}</span>
                </div>
                <div class="summary-item">
                  <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{{ selectedMeetingType?.duration }}</span>
                </div>
                <div v-if="selectedMeetingType?.rate" class="summary-item">
                  <svg class="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <span>{{ selectedMeetingType.rate }}</span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Footer -->
      <div class="scheduler-footer">
        <div class="footer-backdrop"></div>
        <div class="footer-content">
          <button 
            v-if="currentStep > 1"
            @click="previousStep" 
            class="footer-btn secondary"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          
          <div class="footer-spacer"></div>
          
          <button 
            v-if="currentStep < 3"
            @click="nextStep" 
            :disabled="!canProceed"
            class="footer-btn primary"
          >
            Continue
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <button 
            v-if="currentStep === 3"
            @click="scheduleMeeting"
            :disabled="isSubmitting || !canSchedule"
            class="footer-btn primary schedule-btn"
          >
            <svg v-if="isSubmitting" class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span v-if="isSubmitting">Scheduling...</span>
            <span v-else>Schedule Meeting</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
// If using lucide-vue-next:
import { Calendar, Clock, MessageCircle, Video, Phone, User } from 'lucide-vue-next'

// Or use Heroicons (alternative):
// import { CalendarIcon, ClockIcon, ChatBubbleLeftIcon, VideoCameraIcon, PhoneIcon, UserIcon } from '@heroicons/vue/24/outline'

// For now, we'll use inline SVG icons (no additional dependencies needed)

// Props
const props = defineProps({
  talent: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits(['close', 'meeting-scheduled'])

// Reactive data
const currentStep = ref(1)
const isSubmitting = ref(false)

// Meeting types
const meetingTypes = ref([
  {
    id: 'consultation',
    name: 'Free Consultation',
    description: 'Initial discussion about your project needs',
    duration: '30 minutes',
    rate: 'Free',
    icon: MessageCircle,
    colorClass: 'bg-blue-100 text-blue-600'
  },
  {
    id: 'interview',
    name: 'Technical Interview',
    description: 'Assess technical skills and project fit',
    duration: '45 minutes',
    rate: '$50',
    icon: User,
    colorClass: 'bg-green-100 text-green-600'
  },
  {
    id: 'project-discussion',
    name: 'Project Discussion',
    description: 'Detailed discussion about project requirements',
    duration: '60 minutes',
    rate: '$85',
    icon: Video,
    colorClass: 'bg-purple-100 text-purple-600'
  },
  {
    id: 'phone-call',
    name: 'Phone Call',
    description: 'Quick call to discuss opportunities',
    duration: '15 minutes',
    rate: 'Free',
    icon: Phone,
    colorClass: 'bg-orange-100 text-orange-600'
  }
])

const selectedMeetingType = ref(null)

// Calendar data
const currentDate = ref(new Date())
const selectedDate = ref(null)
const selectedTimeSlot = ref(null)
const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Form data
const meetingForm = ref({
  title: '',
  description: '',
  requesterName: '',
  requesterEmail: '',
  phone: '',
  notes: ''
})

// Available time slots (demo data)
const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM', '5:00 PM'
]

// Computed properties
const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  
  const days = []
  const today = new Date()
  
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    
    const isInCurrentMonth = date.getMonth() === month
    const isPast = date < today.setHours(0, 0, 0, 0)
    const isWeekend = date.getDay() === 0 || date.getDay() === 6
    
    days.push({
      date: new Date(date),
      day: date.getDate(),
      inCurrentMonth: isInCurrentMonth,
      isToday: isSameDay(date, today),
      available: isInCurrentMonth && !isPast && !isWeekend
    })
  }
  
  return days
})

const availableTimeSlots = computed(() => {
  if (!selectedDate.value) return []
  
  return timeSlots.map(time => ({
    time,
    available: Math.random() > 0.3 // Demo: randomly make some slots unavailable
  }))
})

const canProceed = computed(() => {
  switch (currentStep.value) {
    case 1:
      return selectedMeetingType.value !== null
    case 2:
      return selectedDate.value && selectedTimeSlot.value
    case 3:
      return meetingForm.value.title && meetingForm.value.requesterName && meetingForm.value.requesterEmail
    default:
      return false
  }
})

const canSchedule = computed(() => {
  return meetingForm.value.title && 
         meetingForm.value.requesterName && 
         meetingForm.value.requesterEmail &&
         selectedMeetingType.value &&
         selectedDate.value &&
         selectedTimeSlot.value
})

// Methods
const closeMeetingScheduler = (e) => {
  if (e.target.classList.contains('scheduler-overlay')) {
    emit('close')
  }
}

const selectMeetingType = (type) => {
  selectedMeetingType.value = type
  if (!meetingForm.value.title) {
    meetingForm.value.title = type.name
  }
}

const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

const selectDate = (day) => {
  if (day.available) {
    selectedDate.value = day.date
    selectedTimeSlot.value = null // Reset time slot when date changes
  }
}

const selectTimeSlot = (slot) => {
  if (slot.available) {
    selectedTimeSlot.value = slot
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const nextStep = () => {
  if (currentStep.value < 3 && canProceed.value) {
    currentStep.value++
  }
}

const scheduleMeeting = async () => {
  if (!canSchedule.value || isSubmitting.value) return
  
  isSubmitting.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const meeting = {
      id: Date.now(),
      type: selectedMeetingType.value,
      date: selectedDate.value,
      time: selectedTimeSlot.value.time,
      details: meetingForm.value,
      talent: props.talent
    }
    
    emit('meeting-scheduled', meeting)
  } catch (error) {
    console.error('Error scheduling meeting:', error)
  } finally {
    isSubmitting.value = false
  }
}

// Utility functions
const isSameDay = (date1, date2) => {
  return date1.toDateString() === date2.toDateString()
}

const formatMonthYear = (date) => {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

const formatDate = (date) => {
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

const formatDateTime = (date, time) => {
  if (!date || !time) return ''
  return `${formatDate(date)} at ${time}`
}
</script>

<style scoped>
.scheduler-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.scheduler-container {
  width: 100%;
  max-width: 48rem;
  max-height: 90vh;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1.5rem;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Header */
.scheduler-header {
  position: relative;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
}

.header-backdrop {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.95) 0%, rgba(219, 234, 254, 0.8) 100%);
}

.header-content {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
}

.header-info {
  flex: 1;
}

.scheduler-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.scheduler-subtitle {
  color: #64748b;
  font-size: 0.875rem;
}

.close-btn {
  padding: 0.5rem;
  color: #9ca3af;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
}

.close-btn:hover {
  color: #6b7280;
  background: rgba(148, 163, 184, 0.1);
}

/* Content */
.scheduler-content {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

/* Step Indicator */
.step-indicator {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  padding: 0 1rem;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.step-circle {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: #e2e8f0;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.step.active .step-circle {
  background: #3b82f6;
  color: white;
}

.step.completed .step-circle {
  background: #10b981;
  color: white;
}

.step-label {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
  text-align: center;
}

.step.active .step-label {
  color: #3b82f6;
}

.step.completed .step-label {
  color: #10b981;
}

.step-connector {
  height: 2px;
  background: #e2e8f0;
  margin: 0 1rem;
  flex: 1;
  transition: all 0.3s ease;
}

.step-connector.completed {
  background: #10b981;
}

/* Step Content */
.step-content {
  animation: fadeIn 0.3s ease-in-out;
}

.step-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1.5rem;
  text-align: center;
}

/* Meeting Types */
.meeting-types {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.meeting-type-card {
  padding: 1.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
}

.meeting-type-card:hover {
  border-color: #3b82f6;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
}

.meeting-type-card.selected {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.05);
}

.type-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.type-info {
  flex: 1;
}

.type-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.type-description {
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.4;
  margin-bottom: 0.75rem;
}

.type-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 500;
}

.type-duration {
  color: #6b7280;
}

.type-rate {
  color: #059669;
  background: rgba(5, 150, 105, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
}

/* Calendar */
.calendar-section {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.nav-btn {
  padding: 0.5rem;
  color: #64748b;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.nav-btn:hover {
  background: rgba(148, 163, 184, 0.1);
  color: #475569;
}

.month-year {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
}

.calendar-grid {
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.calendar-header-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: #f8fafc;
}

.day-header {
  padding: 0.75rem 0.5rem;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: white;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid rgba(148, 163, 184, 0.1);
  transition: all 0.2s ease;
  cursor: pointer;
}

.calendar-day.other-month {
  color: #d1d5db;
}

.calendar-day.unavailable {
  color: #d1d5db;
  cursor: not-allowed;
  background: #f9fafb;
}

.calendar-day.available:hover {
  background: #dbeafe;
  color: #1e40af;
}

.calendar-day.today {
  background: #fee2e2;
  color: #dc2626;
  font-weight: 700;
}

.calendar-day.selected {
  background: #3b82f6;
  color: white;
}

/* Time Slots */
.time-slots-section {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.time-slots-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
}

.time-slots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.75rem;
}

.time-slot {
  padding: 0.75rem 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  text-align: center;
  background: white;
}

.time-slot.available:hover {
  border-color: #3b82f6;
  background: #dbeafe;
  color: #1e40af;
}

.time-slot.selected {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.time-slot.unavailable {
  color: #d1d5db;
  cursor: not-allowed;
  background: #f9fafb;
}

.timezone-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(59, 130, 246, 0.05);
  border-radius: 0.75rem;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

/* Meeting Form */
.meeting-form {
  space-y: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  transform: scale(1.01);
}

/* Meeting Summary */
.meeting-summary {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-top: 2rem;
}

.summary-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
}

.summary-content {
  display: grid;
  gap: 0.75rem;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: #374151;
}

/* Footer */
.scheduler-footer {
  position: relative;
  border-top: 1px solid rgba(148, 163, 184, 0.2);
}

.footer-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
}

.footer-content {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 2rem;
}

.footer-spacer {
  flex: 1;
}

.footer-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.footer-btn.secondary {
  border: 2px solid #e2e8f0;
  color: #64748b;
  background: rgba(255, 255, 255, 0.8);
}

.footer-btn.secondary:hover {
  border-color: #cbd5e1;
  color: #475569;
}

.footer-btn.primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
}

.footer-btn.primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.footer-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.schedule-btn {
  min-width: 10rem;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .scheduler-container {
    max-width: 100%;
    border-radius: 0;
    max-height: 100vh;
  }
  
  .scheduler-overlay {
    padding: 0;
  }
  
  .header-content,
  .footer-content {
    padding: 1rem;
  }
  
  .scheduler-content {
    padding: 1rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .meeting-types {
    grid-template-columns: 1fr;
  }
  
  .time-slots-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  }
  
  .step-indicator {
    padding: 0;
  }
  
  .step-label {
    font-size: 0.6rem;
  }
}

@media (max-width: 640px) {
  .calendar-days {
    font-size: 0.75rem;
  }
  
  .calendar-day {
    padding: 0.5rem 0.25rem;
  }
  
  .day-header {
    padding: 0.5rem 0.25rem;
    font-size: 0.625rem;
  }
}
</style>