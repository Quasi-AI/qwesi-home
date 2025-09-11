<template>
  <div class="notification-container">
    <!-- Notification Bell Button -->
    <button 
      @click="toggleNotifications" 
      class="notification-btn"
      :class="{ 'has-unread': unreadCount > 0 }"
    >
      <div class="btn-bg"></div>
      <div class="btn-content">
        <div class="notification-icon-wrapper">
          <!-- Fixed Bell Icon -->
          <svg class="notification-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M15 17h5l-3.5-3.5a8.38 8.38 0 01-1.5-6.5c0-5-4-9-9-9s-9 4-9 9a8.38 8.38 0 01-1.5 6.5L3.5 17H9m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          
          <!-- Unread Count Badge -->
          <div v-if="unreadCount > 0" class="unread-badge">
            {{ unreadCount > 99 ? '99+' : unreadCount }}
          </div>
          
          <!-- Pulse Animation for New Notifications -->
          <div v-if="hasNewNotification" class="pulse-ring"></div>
        </div>
      </div>
    </button>

    <!-- Notifications Dropdown -->
    <div v-if="showNotifications" class="notifications-dropdown">
      <div class="dropdown-backdrop"></div>
      <div class="dropdown-content">
        <!-- Header -->
        <div class="dropdown-header">
          <div class="header-left">
            <h3 class="dropdown-title">Notifications</h3>
            <span v-if="unreadCount > 0" class="unread-counter">({{ unreadCount }} unread)</span>
          </div>
          <div class="header-actions">
            <button 
              v-if="unreadCount > 0" 
              @click="markAllAsRead" 
              class="mark-read-btn"
              title="Mark all as read"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M5 13l4 4L19 7" />
              </svg>
            </button>
            <button @click="closeNotifications" class="close-btn" title="Close">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Filter Tabs -->
        <div class="filter-tabs">
          <button 
            v-for="filter in filters" 
            :key="filter.key"
            @click="activeFilter = filter.key"
            class="filter-tab"
            :class="{ 'active': activeFilter === filter.key }"
          >
            <!-- Fixed filter icons -->
            <svg v-if="filter.key === 'all'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-3.5-3.5a8.38 8.38 0 01-1.5-6.5c0-5-4-9-9-9s-9 4-9 9a8.38 8.38 0 01-1.5 6.5L3.5 17H9m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <svg v-else-if="filter.key === 'unread'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else-if="filter.key === 'task'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002 2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <svg v-else-if="filter.key === 'team'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            
            <span>{{ filter.label }}</span>
            <span v-if="filter.count > 0" class="filter-count">{{ filter.count }}</span>
          </button>
        </div>

        <!-- Notifications List -->
        <div class="notifications-list">
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <span class="loading-text">Loading notifications...</span>
          </div>

          <div v-else-if="filteredNotifications.length === 0" class="empty-state">
            <div class="empty-icon">
              <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                      d="M15 17h5l-3.5-3.5a8.38 8.38 0 01-1.5-6.5c0-5-4-9-9-9s-9 4-9 9a8.38 8.38 0 01-1.5 6.5L3.5 17H9m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h4 class="empty-title">No notifications</h4>
            <p class="empty-description">You're all caught up! New notifications will appear here.</p>
          </div>

          <div v-else class="notifications-scroll">
            <div 
              v-for="notification in filteredNotifications" 
              :key="notification.id"
              @click="handleNotificationClick(notification)"
              class="notification-item"
              :class="{ 
                'unread': !notification.read,
                'clickable': notification.actionUrl || notification.onClick
              }"
            >
              <div class="notification-icon-container">
                <div class="notification-type-icon" :class="getIconClass(notification.type)">
                  <!-- Fixed notification type icons -->
                  <svg v-if="notification.type === 'task'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002 2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <svg v-else-if="notification.type === 'team'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <svg v-else-if="notification.type === 'success'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <svg v-else-if="notification.type === 'warning'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <svg v-else-if="notification.type === 'error'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <svg v-else-if="notification.type === 'info'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <svg v-else-if="notification.type === 'system'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div v-if="!notification.read" class="unread-dot"></div>
              </div>

              <div class="notification-content">
                <div class="notification-header">
                  <h4 class="notification-title">{{ notification.title }}</h4>
                  <span class="notification-time">{{ formatTime(notification.createdAt) }}</span>
                </div>
                <p class="notification-message">{{ notification.message }}</p>
                
                <!-- Action Buttons -->
                <div v-if="notification.actions && notification.actions.length > 0" class="notification-actions">
                  <button 
                    v-for="action in notification.actions" 
                    :key="action.label"
                    @click.stop="handleAction(action, notification)"
                    class="action-btn"
                    :class="action.variant || 'secondary'"
                  >
                    {{ action.label }}
                  </button>
                </div>
              </div>

              <div class="notification-menu">
                <button 
                  @click.stop="toggleNotificationMenu(notification.id)"
                  class="menu-toggle"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
                
                <div v-if="openMenuId === notification.id" class="menu-dropdown">
                  <button 
                    v-if="!notification.read"
                    @click.stop="markAsRead(notification.id)"
                    class="menu-item"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Mark as read
                  </button>
                  <button 
                    @click.stop="deleteNotification(notification.id)"
                    class="menu-item delete"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div v-if="notifications.length > 0" class="dropdown-footer">
          <button @click="viewAllNotifications" class="footer-btn">
            View All Notifications
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useAuthStore } from '~/features/auth/stores/auth.store'

// Props
const props = defineProps({
  autoRefresh: {
    type: Boolean,
    default: true
  },
  refreshInterval: {
    type: Number,
    default: 30000 // 30 seconds
  }
})

// Emits
const emit = defineEmits(['notification-click', 'notification-action'])

// Store
const authStore = useAuthStore()

// Reactive data
const showNotifications = ref(false)
const loading = ref(false)
const notifications = ref([])
const activeFilter = ref('all')
const openMenuId = ref(null)
const hasNewNotification = ref(false)
const refreshTimer = ref(null)

// Demo notifications data
const demoNotifications = [
  {
    id: 1,
    type: 'task',
    title: 'New Task Assigned',
    message: 'You have been assigned to "Update user interface components"',
    createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    read: false,
    actionUrl: '/dashboard/tasks/123',
    actions: [
      { label: 'View Task', variant: 'primary', action: 'view', url: '/dashboard/tasks/123' }
    ]
  },
  {
    id: 2,
    type: 'team',
    title: 'New Team Member',
    message: 'Sarah Chen has joined your team',
    createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    read: false,
    actions: [
      { label: 'View Profile', variant: 'secondary', action: 'view-profile' }
    ]
  },
  {
    id: 3,
    type: 'success',
    title: 'Task Completed',
    message: 'Your task "Fix login validation" has been marked as completed',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: true
  },
  {
    id: 4,
    type: 'warning',
    title: 'Deadline Approaching',
    message: 'Project "Mobile App Redesign" is due in 2 days',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    read: false,
    actionUrl: '/dashboard/projects/456'
  },
  {
    id: 5,
    type: 'info',
    title: 'System Update',
    message: 'New features have been added to your dashboard',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    read: true
  }
]

// Computed properties
const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

const filters = computed(() => [
  { 
    key: 'all', 
    label: 'All', 
    count: notifications.value.length 
  },
  { 
    key: 'unread', 
    label: 'Unread', 
    count: unreadCount.value 
  },
  { 
    key: 'task', 
    label: 'Tasks', 
    count: notifications.value.filter(n => n.type === 'task').length 
  },
  { 
    key: 'team', 
    label: 'Team', 
    count: notifications.value.filter(n => n.type === 'team').length 
  }
])

const filteredNotifications = computed(() => {
  let filtered = notifications.value

  switch (activeFilter.value) {
    case 'unread':
      filtered = filtered.filter(n => !n.read)
      break
    case 'task':
      filtered = filtered.filter(n => n.type === 'task')
      break
    case 'team':
      filtered = filtered.filter(n => n.type === 'team')
      break
    default:
      // 'all' - no filtering needed
      break
  }

  // Sort by creation date (newest first)
  return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

// Methods
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  if (showNotifications.value) {
    fetchNotifications()
    openMenuId.value = null
  }
}

const closeNotifications = () => {
  showNotifications.value = false
  openMenuId.value = null
}

const fetchNotifications = async () => {
  loading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // For demo purposes, use demo data
    notifications.value = demoNotifications
    
    // In a real app, you would fetch from your API:
    // const response = await $fetch('/api/notifications')
    // notifications.value = response.data
    
  } catch (error) {
    console.error('Error fetching notifications:', error)
  } finally {
    loading.value = false
  }
}

const markAsRead = async (notificationId) => {
  try {
    // Update locally
    const notification = notifications.value.find(n => n.id === notificationId)
    if (notification) {
      notification.read = true
    }
    
    // In a real app, make API call:
    // await $fetch(`/api/notifications/${notificationId}/read`, { method: 'PUT' })
    
    openMenuId.value = null
  } catch (error) {
    console.error('Error marking notification as read:', error)
  }
}

const markAllAsRead = async () => {
  try {
    // Update locally
    notifications.value.forEach(n => n.read = true)
    
    // In a real app, make API call:
    // await $fetch('/api/notifications/mark-all-read', { method: 'PUT' })
    
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
  }
}

const deleteNotification = async (notificationId) => {
  try {
    // Update locally
    notifications.value = notifications.value.filter(n => n.id !== notificationId)
    
    // In a real app, make API call:
    // await $fetch(`/api/notifications/${notificationId}`, { method: 'DELETE' })
    
    openMenuId.value = null
  } catch (error) {
    console.error('Error deleting notification:', error)
  }
}

const handleNotificationClick = (notification) => {
  if (!notification.read) {
    markAsRead(notification.id)
  }
  
  if (notification.actionUrl) {
    navigateTo(notification.actionUrl)
    closeNotifications()
  } else if (notification.onClick) {
    notification.onClick()
    closeNotifications()
  }
  
  emit('notification-click', notification)
}

const handleAction = (action, notification) => {
  if (action.url) {
    navigateTo(action.url)
    closeNotifications()
  }
  
  emit('notification-action', { action, notification })
}

const toggleNotificationMenu = (notificationId) => {
  openMenuId.value = openMenuId.value === notificationId ? null : notificationId
}

const viewAllNotifications = () => {
  navigateTo('/dashboard/notifications')
  closeNotifications()
}

const getIconClass = (type) => {
  const classMap = {
    task: 'bg-blue-100 text-blue-600',
    team: 'bg-green-100 text-green-600',
    success: 'bg-emerald-100 text-emerald-600',
    warning: 'bg-yellow-100 text-yellow-600',
    error: 'bg-red-100 text-red-600',
    info: 'bg-gray-100 text-gray-600',
    system: 'bg-purple-100 text-purple-600',
    message: 'bg-indigo-100 text-indigo-600'
  }
  return classMap[type] || 'bg-gray-100 text-gray-600'
}

const formatTime = (date) => {
  const now = new Date()
  const diff = now - new Date(date)
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  
  return new Date(date).toLocaleDateString()
}

const setupAutoRefresh = () => {
  if (props.autoRefresh && props.refreshInterval > 0) {
    refreshTimer.value = setInterval(() => {
      if (!showNotifications.value) {
        fetchNotifications()
      }
    }, props.refreshInterval)
  }
}

const showNewNotificationPulse = () => {
  hasNewNotification.value = true
  setTimeout(() => {
    hasNewNotification.value = false
  }, 3000)
}

// Click outside to close
const handleClickOutside = (event) => {
  if (!event.target.closest('.notification-container')) {
    showNotifications.value = false
    openMenuId.value = null
  }
}

// Lifecycle
onMounted(() => {
  fetchNotifications()
  setupAutoRefresh()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  if (refreshTimer.value) {
    clearInterval(refreshTimer.value)
  }
  document.removeEventListener('click', handleClickOutside)
})

// Expose methods for parent component
defineExpose({
  fetchNotifications,
  showNewNotificationPulse,
  markAsRead,
  addNotification: (notification) => {
    notifications.value.unshift(notification)
    showNewNotificationPulse()
  }
})
</script>

<style scoped>
.notification-container {
  @apply relative;
}

/* Notification Button */
.notification-btn {
  @apply relative px-4 py-2 rounded-2xl font-medium text-sm transition-all duration-300;
  @apply hover:scale-105 hover:shadow-lg;
  backdrop-filter: blur(12px);
}

.notification-btn.has-unread {
  animation: subtlePulse 2s ease-in-out infinite;
}

.btn-bg {
  @apply absolute inset-0 rounded-2xl transition-all duration-300;
  @apply bg-gradient-to-r from-slate-100/80 to-slate-200/60;
}

.notification-btn:hover .btn-bg {
  @apply from-blue-100/80 to-purple-100/60;
}

.btn-content {
  @apply relative z-10 flex items-center space-x-2 text-slate-700;
}

.notification-btn:hover .btn-content {
  @apply text-blue-700;
}

.notification-icon-wrapper {
  @apply relative;
}

.notification-icon {
  @apply w-5 h-5;
}

.unread-badge {
  @apply absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold;
  @apply min-w-[1.25rem] h-5 rounded-full flex items-center justify-center px-1;
  @apply shadow-lg shadow-red-500/25;
}

.pulse-ring {
  @apply absolute -inset-1 rounded-full border-2 border-blue-400;
  animation: pulse-ring 2s ease-out infinite;
}

/* Dropdown with Fixed Z-Index */
.notifications-dropdown {
  @apply absolute right-0 mt-2 w-96 rounded-2xl overflow-hidden;
  @apply shadow-2xl shadow-black/10;
  z-index: 99999 !important;
}

.dropdown-backdrop {
  @apply absolute inset-0 bg-white/95 border border-slate-200/60;
  backdrop-filter: blur(20px);
  border-radius: inherit;
}

.dropdown-content {
  @apply relative z-10 flex flex-col max-h-[32rem];
}

/* Header */
.dropdown-header {
  @apply flex items-center justify-between p-4 border-b border-slate-200/60;
  @apply bg-gradient-to-r from-slate-50/50 to-blue-50/50;
}

.header-left {
  @apply flex items-center space-x-2;
}

.dropdown-title {
  @apply text-lg font-bold text-slate-900;
}

.unread-counter {
  @apply text-sm text-slate-600;
}

.header-actions {
  @apply flex items-center space-x-2;
}

.mark-read-btn, .close-btn {
  @apply p-2 text-slate-400 hover:text-slate-600 rounded-lg;
  @apply hover:bg-slate-100/70 transition-colors duration-200;
}

/* Filter Tabs */
.filter-tabs {
  @apply flex border-b border-slate-200/60 bg-slate-50/30;
}

.filter-tab {
  @apply flex-1 flex items-center justify-center space-x-2 py-3 px-4;
  @apply text-sm font-medium text-slate-600 hover:text-slate-900;
  @apply hover:bg-white/50 transition-all duration-200;
  @apply border-b-2 border-transparent;
}

.filter-tab.active {
  @apply text-blue-600 border-blue-500 bg-white/70;
}

.filter-count {
  @apply bg-slate-200 text-slate-700 text-xs px-2 py-1 rounded-full;
}

.filter-tab.active .filter-count {
  @apply bg-blue-100 text-blue-700;
}

/* Notifications List */
.notifications-list {
  @apply flex-1 min-h-0;
}

.loading-state, .empty-state {
  @apply flex flex-col items-center justify-center py-8 space-y-3;
}

.loading-spinner {
  @apply w-6 h-6 border-2 border-slate-200 border-t-blue-600 rounded-full;
  animation: spin 1s linear infinite;
}

.loading-text {
  @apply text-sm text-slate-600;
}

.empty-icon {
  @apply text-slate-300;
}

.empty-title {
  @apply font-semibold text-slate-900;
}

.empty-description {
  @apply text-sm text-slate-600;
}

.notifications-scroll {
  @apply max-h-80 overflow-y-auto;
}

/* Notification Item */
.notification-item {
  @apply flex items-start space-x-3 p-4 border-b border-slate-100;
  @apply hover:bg-slate-50/50 transition-colors duration-200;
}

.notification-item.unread {
  @apply bg-blue-50/30;
}

.notification-item.clickable {
  @apply cursor-pointer;
}

.notification-icon-container {
  @apply relative flex-shrink-0;
}

.notification-type-icon {
  @apply w-10 h-10 rounded-xl flex items-center justify-center;
}

.unread-dot {
  @apply absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full;
  @apply border-2 border-white;
}

.notification-content {
  @apply flex-1 min-w-0;
}

.notification-header {
  @apply flex items-start justify-between mb-1;
}

.notification-title {
  @apply font-semibold text-slate-900 text-sm;
}

.notification-time {
  @apply text-xs text-slate-500 flex-shrink-0 ml-2;
}

.notification-message {
  @apply text-sm text-slate-600 line-clamp-2;
}

.notification-actions {
  @apply flex space-x-2 mt-3;
}

.action-btn {
  @apply px-3 py-1 rounded-lg text-xs font-medium transition-colors duration-200;
}

.action-btn.primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}

.action-btn.secondary {
  @apply bg-slate-100 text-slate-700 hover:bg-slate-200;
}

/* Notification Menu */
.notification-menu {
  @apply relative flex-shrink-0;
}

.menu-toggle {
  @apply p-1 text-slate-400 hover:text-slate-600 rounded;
  @apply hover:bg-slate-100/70 transition-colors duration-200;
}

.menu-dropdown {
  @apply absolute right-0 top-full mt-1 w-40 bg-white rounded-lg;
  @apply shadow-lg shadow-black/10 border border-slate-200/60 py-1;
  z-index: 99999 !important;
}

.menu-item {
  @apply w-full text-left px-3 py-2 text-sm text-slate-700;
  @apply hover:bg-slate-50 transition-colors duration-200;
  @apply flex items-center space-x-2;
}

.menu-item.delete {
  @apply text-red-600 hover:bg-red-50;
}

/* Footer */
.dropdown-footer {
  @apply p-4 border-t border-slate-200/60 bg-slate-50/30;
}

.footer-btn {
  @apply w-full flex items-center justify-center space-x-2 py-2 px-4;
  @apply text-sm font-medium text-blue-600 hover:text-blue-700;
  @apply hover:bg-blue-50 rounded-lg transition-colors duration-200;
}

/* Custom Scrollbar */
.notifications-scroll::-webkit-scrollbar {
  @apply w-2;
}

.notifications-scroll::-webkit-scrollbar-track {
  @apply bg-transparent;
}

.notifications-scroll::-webkit-scrollbar-thumb {
  @apply bg-slate-300 rounded-full;
}

.notifications-scroll::-webkit-scrollbar-thumb:hover {
  @apply bg-slate-400;
}

/* Animations */
@keyframes pulse-ring {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

@keyframes subtlePulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive Design */
@media (max-width: 640px) {
  .notifications-dropdown {
    @apply w-80 right-0;
  }
  
  .filter-tabs {
    @apply text-xs;
  }
  
  .filter-tab {
    @apply py-2 px-2 space-x-1;
  }
  
  .notification-item {
    @apply p-3;
  }
}

@media (max-width: 480px) {
  .notifications-dropdown {
    @apply w-72;
  }
}

/* Line clamp utility */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>