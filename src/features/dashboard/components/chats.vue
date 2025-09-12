<template>
  <div v-if="isOpen" class="chat-overlay" @click="handleOverlayClick">
    <div class="chat-container" @click.stop>
      <!-- Chat Header -->
      <div class="chat-header">
        <div class="talent-info">
          <div class="talent-avatar">
            <img 
              v-if="talent?.profileImage" 
              :src="talent.profileImage" 
              :alt="talent.name"
              class="avatar-image"
            />
            <div v-else class="avatar-placeholder">
              {{ getInitials(talent?.name) }}
            </div>
            <div class="status-indicator" :class="{ online: isUserOnline }"></div>
          </div>
          <div class="talent-details">
            <h3 class="talent-name">{{ talent?.name || 'Unknown User' }}</h3>
            <p class="talent-status">
              {{ isUserOnline ? 'Online' : `Last seen ${formatLastSeen(lastSeen)}` }}
            </p>
            <p v-if="userTyping" class="typing-indicator">
              {{ userTyping }} is typing...
            </p>
          </div>
        </div>
        
        <div class="chat-actions">
          <button 
            @click="showMeetingModal = true" 
            class="action-btn meeting-btn"
            title="Schedule Meeting"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
          
          <button @click="$emit('close')" class="action-btn close-btn" title="Close Chat">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Connection Status -->
      <div v-if="!isSocketConnected" class="connection-warning">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <span>Connection issues - messages may be delayed</span>
      </div>

      <!-- Messages Area -->
      <div ref="messagesContainer" class="messages-container">
        <div v-if="loading" class="loading-indicator">
          <div class="loading-spinner"></div>
          <span>Loading messages...</span>
        </div>

        <div v-else-if="messages.length === 0" class="empty-chat">
          <svg class="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h3>Start the conversation</h3>
          <p>Send a message to {{ talent?.name }} to begin chatting</p>
        </div>

        <div v-else class="messages-list">
          <div 
            v-for="message in messages" 
            :key="message.messageId || message._id"
            class="message-item"
            :class="{ 
              'own-message': message.sender._id === currentUserId,
              'other-message': message.sender._id !== currentUserId
            }"
          >
            <!-- Regular Message -->
            <div v-if="message.messageType === 'text'" class="message-bubble">
              <div class="message-content">
                <p class="message-text">{{ message.message }}</p>
                <div class="message-meta">
                  <span class="message-time">{{ formatTime(message.timestamp) }}</span>
                  <svg 
                    v-if="message.sender._id === currentUserId && message.isRead" 
                    class="read-indicator" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Meeting Message -->
            <div v-else-if="message.messageType === 'meeting'" class="meeting-message">
              <div class="meeting-header">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span class="meeting-title">{{ message.meetingDetails?.title || 'Meeting Scheduled' }}</span>
              </div>
              
              <div class="meeting-details">
                <div class="meeting-time">
                  <strong>Date:</strong> {{ formatMeetingDate(message.meetingDetails?.startTime) }}
                </div>
                <div class="meeting-time">
                  <strong>Time:</strong> {{ formatMeetingTime(message.meetingDetails?.startTime, message.meetingDetails?.endTime) }}
                </div>
                <div v-if="message.meetingDetails?.description" class="meeting-description">
                  <strong>Description:</strong> {{ message.meetingDetails.description }}
                </div>
                
                <div v-if="message.meetingDetails?.meetingLink" class="meeting-actions">
                  <a 
                    :href="message.meetingDetails.meetingLink" 
                    target="_blank" 
                    class="meeting-link-btn"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Join Meeting
                  </a>
                </div>
              </div>
              
              <div class="message-meta">
                <span class="message-time">{{ formatTime(message.timestamp) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Message Input -->
      <div class="message-input-container">
        <div class="input-wrapper">
          <textarea
            ref="messageInput"
            v-model="newMessage"
            @keydown="handleKeyDown"
            @input="handleTyping"
            @blur="stopTyping"
            placeholder="Type your message..."
            class="message-input"
            rows="1"
            :disabled="!isSocketConnected"
          ></textarea>
          
          <button 
            @click="sendMessage"
            :disabled="!newMessage.trim() || !isSocketConnected || sending"
            class="send-button"
          >
            <div v-if="sending" class="loading-spinner small"></div>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Meeting Scheduling Modal -->
    <div v-if="showMeetingModal" class="meeting-modal-overlay" @click="closeMeetingModal">
      <div class="meeting-modal" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">Schedule Meeting with {{ talent?.name }}</h3>
          <button @click="closeMeetingModal" class="modal-close-btn">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="scheduleMeeting" class="meeting-form">
          <div class="form-group">
            <label class="form-label">Meeting Title *</label>
            <input 
              v-model="meetingForm.title" 
              type="text" 
              class="form-input"
              placeholder="e.g., Technical Interview, Project Discussion"
              required 
            />
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Date *</label>
              <input 
                v-model="meetingForm.date" 
                type="date" 
                class="form-input"
                :min="getTodayDate()"
                required 
              />
            </div>
            
            <div class="form-group">
              <label class="form-label">Start Time *</label>
              <input 
                v-model="meetingForm.startTime" 
                type="time" 
                class="form-input"
                required 
              />
            </div>
            
            <div class="form-group">
              <label class="form-label">Duration *</label>
              <select v-model="meetingForm.duration" class="form-input" required>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">Description (Optional)</label>
            <textarea 
              v-model="meetingForm.description" 
              class="form-input"
              rows="3"
              placeholder="Add meeting agenda, topics to discuss, or any other details..."
            ></textarea>
          </div>
          
          <div class="modal-actions">
            <button type="button" @click="closeMeetingModal" class="cancel-btn">
              Cancel
            </button>
            <button 
              type="submit" 
              class="schedule-btn"
              :disabled="schedulingMeeting"
            >
              <div v-if="schedulingMeeting" class="loading-spinner small"></div>
              <span v-else>Schedule Meeting</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useChatSocket } from '~/shared/composables/useChatSocket'
import { ChatAPI } from '~/services/chatApi'
import { useAuthStore } from '~/features/auth/stores/auth.store'

// Props and Emits
const props = defineProps({
  isOpen: Boolean,
  talent: Object,
  currentUserId: String
})

const emit = defineEmits(['close', 'meeting-scheduled'])

// Reactive data
const messages = ref([])
const newMessage = ref('')
const loading = ref(false)
const sending = ref(false)
const showMeetingModal = ref(false)
const schedulingMeeting = ref(false)
const messagesContainer = ref(null)
const messageInput = ref(null)
const currentChatId = ref(null)
const userTyping = ref('')
const isUserOnline = ref(false)
const lastSeen = ref(null)
const typingTimeout = ref(null)

// Socket connection
const { 
  isConnected: isSocketConnected, 
  connect, 
  disconnect, 
  joinChat, 
  leaveChat,
  sendMessage: socketSendMessage,
  scheduleMeeting: socketScheduleMeeting,
  markMessagesAsRead,
  startTyping,
  stopTyping,
  onNewMessage,
  onMeetingScheduled,
  onChatJoined,
  onUserTyping,
  onUserStoppedTyping,
  onError,
  removeAllListeners
} = useChatSocket()

// Meeting form
const meetingForm = ref({
  title: '',
  date: '',
  startTime: '',
  duration: '60',
  description: ''
})

// Computed
const authStore = useAuthStore()

// Methods
const getInitials = (name) => {
  if (!name) return 'U'
  return name.split(' ').map(n => n.charAt(0)).join('').slice(0, 2).toUpperCase()
}

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatLastSeen = (timestamp) => {
  if (!timestamp) return 'recently'
  const now = new Date()
  const lastSeenDate = new Date(timestamp)
  const diffInMinutes = Math.floor((now - lastSeenDate) / (1000 * 60))
  
  if (diffInMinutes < 5) return 'just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
  return lastSeenDate.toLocaleDateString()
}

const formatMeetingDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatMeetingTime = (startTime, endTime) => {
  if (!startTime) return ''
  const start = new Date(startTime).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
  const end = endTime ? new Date(endTime).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  }) : ''
  
  return end ? `${start} - ${end}` : start
}

const getTodayDate = () => {
  return new Date().toISOString().split('T')[0]
}

const loadChatHistory = async () => {
  if (!props.talent?.id) return
  
  try {
    loading.value = true
    const response = await ChatAPI.getChatHistory(props.talent.id)
    
    if (response.success) {
      messages.value = response.data.messages || []
      currentChatId.value = response.data.chatId
      
      // Join the chat room via socket
      if (currentChatId.value) {
        joinChat(currentChatId.value)
      }
      
      await nextTick()
      scrollToBottom()
    }
  } catch (error) {
    console.error('Failed to load chat history:', error)
  } finally {
    loading.value = false
  }
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || sending.value || !props.talent?.id) return
  
  try {
    sending.value = true
    
    // Send via socket for real-time delivery
    const socketSent = socketSendMessage(
      currentChatId.value, 
      newMessage.value.trim(), 
      props.talent.id
    )
    
    if (socketSent) {
      newMessage.value = ''
      await nextTick()
      scrollToBottom()
    } else {
      // Fallback to API if socket fails
      await ChatAPI.sendMessage(props.talent.id, newMessage.value.trim())
      newMessage.value = ''
    }
  } catch (error) {
    console.error('Failed to send message:', error)
  } finally {
    sending.value = false
  }
}

const scheduleMeeting = async () => {
  if (!meetingForm.value.title || !meetingForm.value.date || !meetingForm.value.startTime) {
    return
  }
  
  try {
    schedulingMeeting.value = true
    
    // Calculate end time
    const startDateTime = new Date(`${meetingForm.value.date}T${meetingForm.value.startTime}`)
    const endDateTime = new Date(startDateTime.getTime() + (parseInt(meetingForm.value.duration) * 60000))
    
    const meetingDetails = {
      title: meetingForm.value.title,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      description: meetingForm.value.description,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
    
    // Send via socket for real-time delivery
    const socketSent = socketScheduleMeeting(
      currentChatId.value,
      props.talent.id,
      meetingDetails
    )
    
    if (!socketSent) {
      // Fallback to API
      await ChatAPI.scheduleMeeting(props.talent.id, meetingDetails)
    }
    
    emit('meeting-scheduled', {
      talent: props.talent,
      date: meetingForm.value.date,
      time: meetingForm.value.startTime,
      details: meetingDetails
    })
    
    closeMeetingModal()
  } catch (error) {
    console.error('Failed to schedule meeting:', error)
  } finally {
    schedulingMeeting.value = false
  }
}

const handleKeyDown = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

const handleTyping = () => {
  if (currentChatId.value) {
    startTyping(currentChatId.value)
    
    // Clear existing timeout
    if (typingTimeout.value) {
      clearTimeout(typingTimeout.value)
    }
    
    // Capture the chatId at this moment to avoid null reference in timeout
    const chatId = currentChatId.value
    
    // Stop typing after 3 seconds of inactivity
    typingTimeout.value = setTimeout(() => {
      if (chatId) {  // Additional safety check
        stopTyping(chatId)
      }
    }, 3000)
  }
}

const handleOverlayClick = () => {
  emit('close')
}

const closeMeetingModal = () => {
  showMeetingModal.value = false
  meetingForm.value = {
    title: '',
    date: '',
    startTime: '',
    duration: '60',
    description: ''
  }
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// Socket event handlers
const setupSocketListeners = () => {
  onNewMessage((data) => {
    messages.value.push({
      messageId: data.messageId,
      sender: data.sender,
      receiver: data.receiver,
      message: data.message,
      messageType: data.messageType,
      timestamp: data.timestamp,
      isRead: data.isRead
    })
    
    nextTick(() => {
      scrollToBottom()
    })
  })

  onMeetingScheduled((data) => {
    messages.value.push({
      messageId: data.messageId,
      sender: data.sender,
      message: `Meeting scheduled: ${data.meetingDetails.title}`,
      messageType: 'meeting',
      meetingDetails: data.meetingDetails,
      timestamp: data.timestamp,
      isRead: false
    })
    
    nextTick(() => {
      scrollToBottom()
    })
  })

  onChatJoined((data) => {
    console.log('Chat joined:', data.chatId)
    currentChatId.value = data.chatId
  })

  onUserTyping((data) => {
    if (data.userId !== props.currentUserId) {
      userTyping.value = data.userName
      
      // Clear typing indicator after 5 seconds
      setTimeout(() => {
        userTyping.value = ''
      }, 5000)
    }
  })

  onUserStoppedTyping((data) => {
    if (data.userId !== props.currentUserId) {
      userTyping.value = ''
    }
  })

  onError((error) => {
    console.error('Socket error:', error)
  })
}

// Lifecycle
onMounted(async () => {
  if (props.isOpen && props.talent?.id) {
    connect()
    setupSocketListeners()
    await loadChatHistory()
  }
})

onUnmounted(() => {
  if (currentChatId.value) {
    leaveChat(currentChatId.value)
  }
  removeAllListeners()
  disconnect()
  
  if (typingTimeout.value) {
    clearTimeout(typingTimeout.value)
  }
})

// Watch for prop changes
watch(() => props.isOpen, (newValue) => {
  if (newValue && props.talent?.id) {
    connect()
    setupSocketListeners()
    loadChatHistory()
  } else {
    if (currentChatId.value) {
      leaveChat(currentChatId.value)
    }
    removeAllListeners()
    disconnect()
  }
})

watch(() => props.talent?.id, (newTalentId) => {
  if (newTalentId && props.isOpen) {
    messages.value = []
    loadChatHistory()
  }
})

// Mark messages as read when chat is opened
watch(() => [props.isOpen, currentChatId.value], ([isOpen, chatId]) => {
  if (isOpen && chatId) {
    markMessagesAsRead(chatId)
  }
})
</script>

<style scoped>
.chat-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  backdrop-filter: blur(8px);
  padding: 1rem;
}

.chat-container {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 1.5rem;
  width: 100%;
  max-width: 42rem;
  height: 90vh;
  max-height: 48rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Chat Header */
.chat-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%);
}

.talent-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.talent-avatar {
  position: relative;
  width: 3rem;
  height: 3rem;
  flex-shrink: 0;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 1rem;
  border: 2px solid rgba(59, 130, 246, 0.2);
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 0.875rem;
}

.status-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 0.75rem;
  height: 0.75rem;
  background: #9ca3af;
  border: 2px solid white;
  border-radius: 50%;
}

.status-indicator.online {
  background: #10b981;
}

.talent-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.talent-status {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.typing-indicator {
  font-size: 0.75rem;
  color: #3b82f6;
  font-style: italic;
  margin: 0;
}

.chat-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.5rem;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.meeting-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
}

.meeting-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.close-btn {
  background: rgba(148, 163, 184, 0.1);
  color: #64748b;
}

.close-btn:hover {
  background: rgba(148, 163, 184, 0.2);
  color: #475569;
}

/* Connection Warning */
.connection-warning {
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.3);
  color: #92400e;
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

/* Messages Area */
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2rem;
  color: #64748b;
}

.loading-spinner {
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid #e2e8f0;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-spinner.small {
  width: 1rem;
  height: 1rem;
  border-width: 1.5px;
}

.empty-chat {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem 2rem;
  color: #64748b;
}

.empty-chat h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin: 1rem 0 0.5rem;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message-item {
  display: flex;
  flex-direction: column;
}

.message-item.own-message {
  align-items: flex-end;
}

.message-item.other-message {
  align-items: flex-start;
}

.message-bubble {
  max-width: 75%;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 1.25rem;
  padding: 0.75rem 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.own-message .message-bubble {
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  border-color: rgba(59, 130, 246, 0.3);
}

.message-text {
  margin: 0;
  line-height: 1.5;
  word-wrap: break-word;
}

.message-meta {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.25rem;
  margin-top: 0.25rem;
}

.message-time {
  font-size: 0.75rem;
  opacity: 0.7;
}

.read-indicator {
  width: 0.875rem;
  height: 0.875rem;
  opacity: 0.7;
}

/* Meeting Messages */
.meeting-message {
  max-width: 85%;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 1.25rem;
  padding: 1rem;
  backdrop-filter: blur(10px);
}

.meeting-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.meeting-title {
  font-weight: 600;
  color: #1e293b;
}

.meeting-details {
  background: rgba(59, 130, 246, 0.05);
  border-radius: 0.75rem;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
}

.meeting-time, .meeting-description {
  margin-bottom: 0.5rem;
  color: #374151;
}

.meeting-actions {
  margin-top: 0.75rem;
}

.meeting-link-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border-radius: 0.75rem;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.meeting-link-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

/* Message Input */
.message-input-container {
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(148, 163, 184, 0.3);
  background: rgba(248, 250, 252, 0.8);
}

.input-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid #e2e8f0;
  border-radius: 1.25rem;
  padding: 0.75rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.input-wrapper:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.message-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  resize: none;
  min-height: 1.25rem;
  max-height: 6rem;
  font-size: 0.875rem;
  line-height: 1.5;
}

.message-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.send-button {
  padding: 0.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2.5rem;
  height: 2.5rem;
}

.send-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #9ca3af;
}

/* Meeting Modal */
.meeting-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;
  backdrop-filter: blur(8px);
  padding: 1rem;
}

.meeting-modal {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 1.5rem;
  width: 100%;
  max-width: 32rem;
  max-height: 90vh;
  overflow: hidden;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.3);
}

.modal-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.modal-close-btn {
  padding: 0.5rem;
  color: #9ca3af;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
}

.modal-close-btn:hover {
  color: #6b7280;
  background: rgba(148, 163, 184, 0.1);
}

.meeting-form {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.form-input {
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;
}

.cancel-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid #e2e8f0;
  color: #64748b;
  border-radius: 0.75rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  border-color: #cbd5e1;
  color: #475569;
}

.schedule-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  border-radius: 0.75rem;
  font-weight: 500;
  transition: all 0.3s ease;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.schedule-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.schedule-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Animations */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Custom Scrollbar */
.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track {
  background: transparent;
}

.messages-container::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, rgba(148, 163, 184, 0.3), rgba(148, 163, 184, 0.5));
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, rgba(148, 163, 184, 0.5), rgba(148, 163, 184, 0.7));
}

/* Responsive Design */
@media (max-width: 640px) {
  .chat-container {
    height: 100vh;
    border-radius: 0;
    max-height: none;
  }
  
  .chat-overlay {
    padding: 0;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .meeting-modal {
    max-height: 100vh;
    border-radius: 0;
  }
}
</style>