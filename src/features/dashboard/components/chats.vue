<template>
  <div v-if="isOpen" class="chat-overlay" @click="closeChatIfClickedOutside">
    <div class="chat-container" @click.stop>
      <!-- Chat Header -->
      <div class="chat-header">
        <div class="chat-header-backdrop"></div>
        <div class="chat-header-content">
          <button @click="$emit('close')" class="back-btn">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div class="chat-user-info">
            <div class="chat-avatar">
              <div v-if="talent.profileImage" class="avatar-img">
                <img :src="talent.profileImage" :alt="talent.name" />
              </div>
              <div v-else class="avatar-initials">
                {{ getInitials(talent.name) }}
              </div>
              <div class="online-indicator" :class="{ 'online': isOnline }"></div>
            </div>
            <div class="user-details">
              <h3 class="user-name">{{ talent.name }}</h3>
              <p class="user-status">{{ isOnline ? 'Online' : `Last seen ${lastSeen}` }}</p>
            </div>
          </div>

          <div class="chat-actions">
            <button @click="openScheduler" class="action-btn schedule-btn" title="Schedule Meeting">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            <button @click="startVideoCall" class="action-btn video-btn" title="Start Video Call">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Chat Messages -->
      <div class="chat-messages" ref="messagesContainer">
        <div v-if="messages.length === 0" class="empty-messages">
          <div class="empty-icon">
            <svg class="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h4 class="empty-title">Start your conversation</h4>
          <p class="empty-subtitle">Send a message to {{ talent.name }} to get started</p>
        </div>

        <div v-else class="messages-list">
          <div v-for="message in messages" :key="message.id" 
               class="message-wrapper" 
               :class="{ 'own-message': message.senderId === currentUserId }">
            <div class="message-bubble" :class="{ 'sent': message.senderId === currentUserId, 'received': message.senderId !== currentUserId }">
              <div class="message-content">
                <p class="message-text">{{ message.content }}</p>
                <div v-if="message.attachment" class="message-attachment">
                  <div class="attachment-preview">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <span>{{ message.attachment.name }}</span>
                  </div>
                </div>
              </div>
              <div class="message-meta">
                <span class="message-time">{{ formatTime(message.timestamp) }}</span>
                <div v-if="message.senderId === currentUserId" class="message-status">
                  <svg v-if="message.status === 'sent'" class="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <svg v-else-if="message.status === 'delivered'" class="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <div v-else-if="message.status === 'read'" class="read-indicator">
                    <svg class="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    <svg class="w-4 h-4 text-blue-500 -ml-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Typing Indicator -->
        <div v-if="isTyping" class="typing-indicator">
          <div class="typing-bubble">
            <div class="typing-dots">
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
            </div>
          </div>
          <span class="typing-text">{{ talent.name }} is typing...</span>
        </div>
      </div>

      <!-- Chat Input -->
      <div class="chat-input-container">
        <div class="chat-input-backdrop"></div>
        <div class="chat-input-wrapper">
          <div class="input-actions">
            <input 
              ref="fileInput"
              type="file" 
              @change="handleFileSelect"
              accept="image/*,.pdf,.doc,.docx"
              class="hidden"
            />
            <button @click="$refs.fileInput.click()" class="input-action-btn" title="Attach file">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
          </div>

          <div class="message-input-wrapper">
            <textarea
              v-model="newMessage"
              @keydown="handleKeyDown"
              @input="handleTyping"
              placeholder="Type a message..."
              class="message-input"
              rows="1"
              ref="messageInput"
            ></textarea>
            <button @click="toggleEmojiPicker" class="emoji-btn" title="Add emoji">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>

          <button 
            @click="sendMessage" 
            :disabled="!newMessage.trim() && !selectedFile"
            class="send-btn"
            :class="{ 'has-content': newMessage.trim() || selectedFile }"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>

        <!-- File Preview -->
        <div v-if="selectedFile" class="file-preview">
          <div class="file-info">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            <span>{{ selectedFile.name }}</span>
          </div>
          <button @click="removeFile" class="remove-file-btn">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Meeting Scheduler Modal -->
    <MeetingScheduler 
      v-if="showScheduler"
      :talent="talent"
      @close="closeScheduler"
      @meeting-scheduled="handleMeetingScheduled"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import MeetingScheduler from './meetings.vue'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  talent: {
    type: Object,
    required: true
  },
  currentUserId: {
    type: String,
    required: true
  }
})

// Emits
const emit = defineEmits(['close', 'meeting-scheduled'])

// Refs
const messagesContainer = ref(null)
const messageInput = ref(null)
const fileInput = ref(null)

// Reactive data
const messages = ref([
  {
    id: 1,
    content: "Hi! I saw your profile and I'm interested in discussing a potential project opportunity.",
    senderId: props.currentUserId,
    timestamp: new Date(Date.now() - 300000),
    status: 'read'
  },
  {
    id: 2,
    content: "Hello! Thank you for reaching out. I'd be happy to discuss the opportunity. What kind of project are you working on?",
    senderId: props.talent.id,
    timestamp: new Date(Date.now() - 240000),
    status: 'delivered'
  }
])

const newMessage = ref('')
const selectedFile = ref(null)
const isTyping = ref(false)
const isOnline = ref(true)
const lastSeen = ref('2 minutes ago')
const showScheduler = ref(false)
const showEmojiPicker = ref(false)
const typingTimeout = ref(null)

// Computed
const getInitials = (name) => {
  if (!name) return 'U'
  return name.split(' ').map(n => n.charAt(0)).join('').slice(0, 2).toUpperCase()
}

// Methods
const closeChatIfClickedOutside = (e) => {
  if (e.target.classList.contains('chat-overlay')) {
    emit('close')
  }
}

const sendMessage = async () => {
  if (!newMessage.value.trim() && !selectedFile.value) return

  const message = {
    id: Date.now(),
    content: newMessage.value.trim(),
    senderId: props.currentUserId,
    timestamp: new Date(),
    status: 'sent',
    attachment: selectedFile.value ? {
      name: selectedFile.value.name,
      type: selectedFile.value.type,
      size: selectedFile.value.size
    } : null
  }

  messages.value.push(message)
  newMessage.value = ''
  selectedFile.value = null

  await nextTick()
  scrollToBottom()

  // Simulate message delivery
  setTimeout(() => {
    message.status = 'delivered'
  }, 1000)

  // Simulate response (for demo)
  setTimeout(() => {
    simulateResponse()
  }, 2000)
}

const simulateResponse = () => {
  const responses = [
    "That sounds interesting! Could you tell me more about the timeline?",
    "I'd be happy to help with that. When would be a good time to discuss this further?",
    "Great! I have experience with similar projects. Would you like to schedule a call?",
    "Thank you for sharing those details. I think I can definitely help with this project."
  ]

  isTyping.value = true
  
  setTimeout(() => {
    isTyping.value = false
    messages.value.push({
      id: Date.now(),
      content: responses[Math.floor(Math.random() * responses.length)],
      senderId: props.talent?.id || 'talent-default',
      timestamp: new Date(),
      status: 'delivered'
    })
    scrollToBottom()
  }, 2000)
}

const handleKeyDown = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}

const handleTyping = () => {
  // Clear existing timeout
  if (typingTimeout.value) {
    clearTimeout(typingTimeout.value)
  }

  // Set new timeout
  typingTimeout.value = setTimeout(() => {
    // Send typing stopped event
  }, 1000)
}

const handleFileSelect = (e) => {
  const file = e.target.files[0]
  if (file) {
    selectedFile.value = file
  }
}

const removeFile = () => {
  selectedFile.value = null
  fileInput.value.value = ''
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

const openScheduler = () => {
  showScheduler.value = true
}

const closeScheduler = () => {
  showScheduler.value = false
}

const handleMeetingScheduled = (meeting) => {
  showScheduler.value = false
  
  // Add system message about scheduled meeting
  messages.value.push({
    id: Date.now(),
    content: `Meeting scheduled for ${meeting.date} at ${meeting.time}`,
    senderId: 'system',
    timestamp: new Date(),
    status: 'delivered',
    type: 'meeting'
  })
  
  emit('meeting-scheduled', meeting)
  scrollToBottom()
}

const startVideoCall = () => {
  // Implement video call functionality
  alert('Starting video call with ' + props.talent.name)
}

const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value
}

// Lifecycle
onMounted(() => {
  scrollToBottom()
  if (messageInput.value) {
    messageInput.value.focus()
  }
})

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    nextTick(() => {
      scrollToBottom()
      if (messageInput.value) {
        messageInput.value.focus()
      }
    })
  }
})
</script>

<style scoped>
.chat-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.chat-container {
  width: 100%;
  max-width: 28rem;
  height: 85vh;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1.5rem;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Chat Header */
.chat-header {
  position: relative;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
}

.chat-header-backdrop {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.95) 0%, rgba(219, 234, 254, 0.8) 100%);
}

.chat-header-content {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
}

.back-btn {
  padding: 0.5rem;
  color: #64748b;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: rgba(148, 163, 184, 0.1);
  color: #475569;
}

.chat-user-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.chat-avatar {
  position: relative;
  width: 2.5rem;
  height: 2.5rem;
}

.avatar-img {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 1rem;
  overflow: hidden;
  border: 2px solid #e2e8f0;
}

.avatar-img img {
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
}

.online-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 0.75rem;
  height: 0.75rem;
  background: #6b7280;
  border: 2px solid white;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.online-indicator.online {
  background: #10b981;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.2;
}

.user-status {
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.125rem;
}

.chat-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.5rem;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
  color: #64748b;
}

.action-btn:hover {
  background: rgba(148, 163, 184, 0.1);
  color: #475569;
}

.schedule-btn:hover {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.video-btn:hover {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

/* Chat Messages */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.empty-messages {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 2rem;
}

.empty-icon {
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.empty-subtitle {
  color: #6b7280;
  font-size: 0.875rem;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.message-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
}

.message-wrapper.own-message {
  justify-content: flex-end;
}

.message-bubble {
  max-width: 75%;
  border-radius: 1.25rem;
  padding: 0.75rem 1rem;
  position: relative;
}

.message-bubble.sent {
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  border-bottom-right-radius: 0.5rem;
}

.message-bubble.received {
  background: rgba(241, 245, 249, 0.8);
  color: #1e293b;
  border-bottom-left-radius: 0.5rem;
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.message-content {
  margin-bottom: 0.25rem;
}

.message-text {
  line-height: 1.4;
  font-size: 0.875rem;
}

.message-attachment {
  margin-top: 0.5rem;
}

.attachment-preview {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  font-size: 0.75rem;
}

.message-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: flex-end;
}

.message-time {
  font-size: 0.625rem;
  opacity: 0.8;
}

.message-status {
  display: flex;
  align-items: center;
}

.read-indicator {
  display: flex;
  align-items: center;
}

/* Typing Indicator */
.typing-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 0.5rem;
}

.typing-bubble {
  background: rgba(241, 245, 249, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 1.25rem;
  border-bottom-left-radius: 0.5rem;
  padding: 0.75rem 1rem;
}

.typing-dots {
  display: flex;
  gap: 0.25rem;
}

.dot {
  width: 0.375rem;
  height: 0.375rem;
  background: #94a3b8;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

.typing-text {
  font-size: 0.75rem;
  color: #64748b;
  font-style: italic;
}

/* Chat Input */
.chat-input-container {
  position: relative;
  border-top: 1px solid rgba(148, 163, 184, 0.2);
}

.chat-input-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
}

.chat-input-wrapper {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
  padding: 1rem;
}

.input-actions {
  display: flex;
  gap: 0.5rem;
}

.input-action-btn {
  padding: 0.5rem;
  color: #64748b;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
}

.input-action-btn:hover {
  background: rgba(148, 163, 184, 0.1);
  color: #475569;
}

.message-input-wrapper {
  flex: 1;
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  background: rgba(241, 245, 249, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.3);
  border-radius: 1.25rem;
  padding: 0.5rem 0.75rem;
}

.message-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  resize: none;
  font-size: 0.875rem;
  line-height: 1.4;
  max-height: 6rem;
  min-height: 1.5rem;
}

.emoji-btn {
  padding: 0.25rem;
  color: #64748b;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.emoji-btn:hover {
  background: rgba(148, 163, 184, 0.1);
  color: #475569;
}

.send-btn {
  padding: 0.5rem;
  background: #e2e8f0;
  color: #94a3b8;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
}

.send-btn.has-content {
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  transform: scale(1.05);
}

.send-btn:disabled {
  cursor: not-allowed;
}

.file-preview {
  position: absolute;
  bottom: 100%;
  left: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(148, 163, 184, 0.3);
  border-radius: 0.75rem;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  backdrop-filter: blur(10px);
}

.file-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
}

.file-info span {
  font-size: 0.875rem;
  color: #374151;
  truncate: true;
}

.remove-file-btn {
  padding: 0.25rem;
  color: #ef4444;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.remove-file-btn:hover {
  background: rgba(239, 68, 68, 0.1);
}

/* Animations */
@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-0.5rem);
  }
}

/* Custom Scrollbar */
.chat-messages::-webkit-scrollbar {
  width: 4px;
}

.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.3);
  border-radius: 2px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.5);
}

/* Responsive Design */
@media (max-width: 640px) {
  .chat-container {
    height: 100vh;
    border-radius: 0;
    max-width: 100%;
  }
  
  .chat-overlay {
    padding: 0;
  }
  
  .message-bubble {
    max-width: 85%;
  }
}
</style>