// ~/stores/notification.store.ts
import { defineStore } from 'pinia'
import { API_ROUTES } from '~/shared/constants/api-routes'
import { useAuthStore } from '~/features/auth/stores/auth.store'

// Type definitions
export interface NotificationAction {
  label: string
  variant?: 'primary' | 'secondary' | 'danger'
  action: string
  url?: string
}

export interface Notification {
  id: string | number
  type: 'task' | 'team' | 'success' | 'warning' | 'error' | 'info' | 'system' | 'message'
  title: string
  message: string
  createdAt: Date | string
  read: boolean
  actionUrl?: string
  actions?: NotificationAction[]
  relatedUserId?: string
  metadata?: Record<string, any>
}

export interface NotificationResponse {
  notifications: Notification[]
  unreadCount: number
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface FetchNotificationsParams {
  page?: number
  limit?: number
  type?: string
  read?: boolean
}

export interface WebSocketMessage {
  type: 'new_notification' | 'notification_read' | 'notification_deleted' | 'bulk_update'
  notification?: Notification
  notificationId?: string | number
  data?: any
}

export interface NotificationStoreState {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  error: string | null
  isConnected: boolean
  wsConnection: WebSocket | null
}

// Store definition
export const useNotificationStore = defineStore('notification', {
  state: (): NotificationStoreState => ({
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
    isConnected: false,
    wsConnection: null
  }),

  getters: {
    unreadNotifications: (state): Notification[] => 
      state.notifications.filter(n => !n.read),
    
    notificationsByType: (state) => 
      (type: string): Notification[] => 
        state.notifications.filter(n => n.type === type),
    
    hasUnread: (state): boolean => state.unreadCount > 0,
    
    recentNotifications: (state) => 
      (limit: number = 5): Notification[] => 
        state.notifications.slice(0, limit),
    
    notificationById: (state) => 
      (id: string | number): Notification | undefined => 
        state.notifications.find(n => n.id === id)
  },

  actions: {
    // Fetch notifications from API
    async fetchNotifications(params: FetchNotificationsParams = {}): Promise<NotificationResponse> {
      this.loading = true
      this.error = null
      
      try {
        const authStore = useAuthStore()
        const token = authStore.getToken
        
        if (!token) {
          throw new Error('No authentication token available')
        }

        const queryParams = new URLSearchParams({
          page: String(params.page || 1),
          limit: String(params.limit || 20),
          type: params.type || '',
          read: params.read !== undefined ? String(params.read) : ''
        })

        const response = await $fetch<{
          success: boolean
          data: NotificationResponse
          message?: string
        }>(`${API_ROUTES.BASE_URL}api/notifications?${queryParams}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.success && response.data) {
          // Convert date strings to Date objects
          const notifications = response.data.notifications.map(notification => ({
            ...notification,
            createdAt: new Date(notification.createdAt)
          }))
          
          this.notifications = notifications
          this.unreadCount = response.data.unreadCount
          return response.data
        } else {
          throw new Error(response.message || 'Failed to fetch notifications')
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        this.error = errorMessage
        console.error('Error fetching notifications:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Mark notification as read
    async markAsRead(notificationId: string | number): Promise<void> {
      try {
        const authStore = useAuthStore()
        const token = authStore.getToken
        
        if (!token) {
          throw new Error('No authentication token available')
        }

        const response = await $fetch<{
          success: boolean
          data?: { notification: Notification }
          message?: string
        }>(`${API_ROUTES.BASE_URL}api/notifications/${notificationId}/read`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.success) {
          // Update local state
          const notification = this.notifications.find(n => n.id === notificationId)
          if (notification && !notification.read) {
            notification.read = true
            this.unreadCount = Math.max(0, this.unreadCount - 1)
          }
        } else {
          throw new Error(response.message || 'Failed to mark notification as read')
        }
      } catch (error) {
        console.error('Error marking notification as read:', error)
        throw error
      }
    },

    // Mark all notifications as read
    async markAllAsRead(): Promise<void> {
      try {
        const authStore = useAuthStore()
        const token = authStore.getToken
        
        if (!token) {
          throw new Error('No authentication token available')
        }

        const response = await $fetch<{
          success: boolean
          message?: string
        }>(`${API_ROUTES.BASE_URL}api/notifications/mark-all-read`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.success) {
          // Update local state
          this.notifications.forEach(n => n.read = true)
          this.unreadCount = 0
        } else {
          throw new Error(response.message || 'Failed to mark all notifications as read')
        }
      } catch (error) {
        console.error('Error marking all notifications as read:', error)
        throw error
      }
    },

    // Delete notification
    async deleteNotification(notificationId: string | number): Promise<void> {
      try {
        const authStore = useAuthStore()
        const token = authStore.getToken
        
        if (!token) {
          throw new Error('No authentication token available')
        }

        const response = await $fetch<{
          success: boolean
          message?: string
        }>(`${API_ROUTES.BASE_URL}api/notifications/${notificationId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.success) {
          // Remove from local state
          const index = this.notifications.findIndex(n => n.id === notificationId)
          if (index !== -1) {
            const notification = this.notifications[index]
            if (!notification.read) {
              this.unreadCount = Math.max(0, this.unreadCount - 1)
            }
            this.notifications.splice(index, 1)
          }
        } else {
          throw new Error(response.message || 'Failed to delete notification')
        }
      } catch (error) {
        console.error('Error deleting notification:', error)
        throw error
      }
    },

    // Create new notification (for testing/admin)
    async createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
      try {
        const authStore = useAuthStore()
        const token = authStore.getToken
        
        if (!token) {
          throw new Error('No authentication token available')
        }

        const response = await $fetch<{
          success: boolean
          data: { notification: Notification }
          message?: string
        }>(`${API_ROUTES.BASE_URL}api/notifications`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: notification
        })

        if (response.success && response.data.notification) {
          const newNotification = {
            ...response.data.notification,
            createdAt: new Date(response.data.notification.createdAt)
          }
          
          // Add to local state
          this.notifications.unshift(newNotification)
          if (!newNotification.read) {
            this.unreadCount++
          }
          
          return newNotification
        } else {
          throw new Error(response.message || 'Failed to create notification')
        }
      } catch (error) {
        console.error('Error creating notification:', error)
        throw error
      }
    },

    // WebSocket connection for real-time notifications
    connectWebSocket(): void {
      if (this.wsConnection) {
        return // Already connected
      }

      const authStore = useAuthStore()
      const token = authStore.getToken
      
      if (!token) {
        console.warn('Cannot connect to WebSocket: No authentication token')
        return
      }

      const wsUrl = `${API_ROUTES.WS_URL || 'ws://localhost:3001'}/notifications?token=${token}`
      
      try {
        this.wsConnection = new WebSocket(wsUrl)

        this.wsConnection.onopen = (): void => {
          console.log('Notification WebSocket connected')
          this.isConnected = true
        }

        this.wsConnection.onmessage = (event: MessageEvent): void => {
          try {
            const data: WebSocketMessage = JSON.parse(event.data)
            this.handleWebSocketMessage(data)
          } catch (error) {
            console.error('Error parsing WebSocket message:', error)
          }
        }

        this.wsConnection.onclose = (): void => {
          console.log('Notification WebSocket disconnected')
          this.isConnected = false
          this.wsConnection = null
          
          // Attempt to reconnect after 5 seconds
          setTimeout(() => {
            const authStore = useAuthStore()
            if (authStore.isAuthenticated) {
              this.connectWebSocket()
            }
          }, 5000)
        }

        this.wsConnection.onerror = (error: Event): void => {
          console.error('WebSocket error:', error)
          this.isConnected = false
        }
      } catch (error) {
        console.error('Error connecting to WebSocket:', error)
      }
    },

    // Handle WebSocket messages
    handleWebSocketMessage(data: WebSocketMessage): void {
      switch (data.type) {
        case 'new_notification':
          if (data.notification) {
            const notification = {
              ...data.notification,
              createdAt: new Date(data.notification.createdAt)
            }
            this.notifications.unshift(notification)
            if (!notification.read) {
              this.unreadCount++
            }
            
            // Trigger browser notification if permitted
            this.showBrowserNotification(notification)
          }
          break

        case 'notification_read':
          if (data.notificationId) {
            const readNotification = this.notifications.find(n => n.id === data.notificationId)
            if (readNotification && !readNotification.read) {
              readNotification.read = true
              this.unreadCount = Math.max(0, this.unreadCount - 1)
            }
          }
          break

        case 'notification_deleted':
          if (data.notificationId) {
            const deleteIndex = this.notifications.findIndex(n => n.id === data.notificationId)
            if (deleteIndex !== -1) {
              const notification = this.notifications[deleteIndex]
              if (!notification.read) {
                this.unreadCount = Math.max(0, this.unreadCount - 1)
              }
              this.notifications.splice(deleteIndex, 1)
            }
          }
          break

        case 'bulk_update':
          // Handle bulk updates (e.g., mark all as read from another device)
          if (data.data) {
            this.fetchNotifications()
          }
          break

        default:
          console.log('Unknown WebSocket message type:', data.type)
      }
    },

    // Show browser notification
    async showBrowserNotification(notification: Notification): Promise<void> {
      // Check if browser notifications are supported and permitted
      if (!("Notification" in window)) {
        return
      }

      try {
        if (Notification.permission === "granted") {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: String(notification.id),
            requireInteraction: false,
            silent: false
          })
        } else if (Notification.permission !== "denied") {
          // Request permission
          const permission = await Notification.requestPermission()
          if (permission === "granted") {
            new Notification(notification.title, {
              body: notification.message,
              icon: '/favicon.ico'
            })
          }
        }
      } catch (error) {
        console.error('Error showing browser notification:', error)
      }
    },

    // Disconnect WebSocket
    disconnectWebSocket(): void {
      if (this.wsConnection) {
        this.wsConnection.close()
        this.wsConnection = null
        this.isConnected = false
      }
    },

    // Clear all notifications
    clearNotifications(): void {
      this.notifications = []
      this.unreadCount = 0
    },

    // Add notification locally (for real-time updates)
    addNotification(notification: Notification): void {
      const formattedNotification = {
        ...notification,
        createdAt: new Date(notification.createdAt)
      }
      
      this.notifications.unshift(formattedNotification)
      if (!formattedNotification.read) {
        this.unreadCount++
      }
    },

    // Update notification status locally
    updateNotificationStatus(notificationId: string | number, updates: Partial<Notification>): void {
      const notification = this.notifications.find(n => n.id === notificationId)
      if (notification) {
        // Handle read status change
        if (updates.read !== undefined && updates.read !== notification.read) {
          if (updates.read && !notification.read) {
            this.unreadCount = Math.max(0, this.unreadCount - 1)
          } else if (!updates.read && notification.read) {
            this.unreadCount++
          }
        }
        
        Object.assign(notification, updates)
      }
    },

    // Get notifications by criteria
    getNotifications(criteria: {
      type?: string
      read?: boolean
      limit?: number
      sortBy?: 'createdAt' | 'title'
      sortOrder?: 'asc' | 'desc'
    } = {}): Notification[] {
      let filtered = [...this.notifications]
      
      // Apply filters
      if (criteria.type) {
        filtered = filtered.filter(n => n.type === criteria.type)
      }
      
      if (criteria.read !== undefined) {
        filtered = filtered.filter(n => n.read === criteria.read)
      }
      
      // Apply sorting
      if (criteria.sortBy) {
        filtered.sort((a, b) => {
          const aValue = a[criteria.sortBy!]
          const bValue = b[criteria.sortBy!]
          
          if (criteria.sortOrder === 'asc') {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
          } else {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
          }
        })
      }
      
      // Apply limit
      if (criteria.limit) {
        filtered = filtered.slice(0, criteria.limit)
      }
      
      return filtered
    }
  }
})