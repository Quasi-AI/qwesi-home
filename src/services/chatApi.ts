// services/chatApi.ts
import { useAuthStore } from '~/features/auth/stores/auth.store'

// Type definitions
export interface ChatMessage {
  messageId: string
  sender: {
    _id: string
    name: string
    profileImage?: string
  }
  receiver: string
  message: string
  messageType: 'text' | 'meeting' | 'file' | 'image'
  timestamp: string
  isRead: boolean
  meetingDetails?: MeetingDetails
  fileDetails?: FileDetails
}

export interface MeetingDetails {
  title: string
  startTime: string
  endTime: string
  timeZone: string
  meetingLink?: string
  description?: string
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed'
}

export interface FileDetails {
  fileName: string
  fileSize: number
  fileType: string
  fileUrl: string
}

export interface ChatParticipant {
  _id: string
  name: string
  email: string
  profileImage?: string
}

export interface ChatHistory {
  chatId: string
  participants: ChatParticipant[]
  messages: ChatMessage[]
}

export interface ChatListItem {
  chatId: string
  participants: ChatParticipant[]
  lastMessage: ChatMessage | null
  lastActivity: string
  unreadCount: number
}

export interface SendMessageRequest {
  receiverId: string
  message: string
  messageType?: 'text' | 'meeting' | 'file' | 'image'
}

export interface ScheduleMeetingRequest {
  receiverId: string
  meetingDetails: {
    title: string
    startTime: string
    endTime: string
    timeZone?: string
    description?: string
  }
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ChatStats {
  totalMessages: number
  totalMeetings: number
  firstMessage: string
  lastActivity: string
  messagesByType: Record<string, number>
}

export interface SearchResult {
  messageId: string
  sender: ChatParticipant
  message: string
  timestamp: string
  messageType: string
}

export interface ReportRequest {
  messageId?: string
  userId?: string
  reason: string
  description?: string
}

/**
 * Chat API Service
 * Handles all HTTP requests for chat functionality with full TypeScript support
 */
export class ChatAPI {
  private static readonly baseUrl = "https://dark-caldron-448714-u5.uc.r.appspot.com"

  /**
   * Get authentication headers
   */
  private static getAuthHeaders(): Record<string, string> {
    const authStore = useAuthStore()
    const token = authStore.getToken

    if (!token) {
      throw new Error('Authentication token not found. Please log in.')
    }

    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }

  /**
   * Handle API errors consistently
   */
  private static handleError(error: any, defaultMessage: string): never {
    console.error('Chat API Error:', error)
    
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error)
    }
    
    if (error.data?.error) {
      throw new Error(error.data.error)
    }
    
    if (error.message) {
      throw new Error(error.message)
    }
    
    throw new Error(defaultMessage)
  }

  /**
   * Get chat history with a specific talent
   */
  static async getChatHistory(talentId: string): Promise<ApiResponse<ChatHistory>> {
    if (!talentId?.trim()) {
      throw new Error('Talent ID is required')
    }

    try {
      const response = await $fetch<ApiResponse<ChatHistory>>(
        `${this.baseUrl}/api/chat/history/${talentId}`,
        {
          method: 'GET',
          headers: this.getAuthHeaders()
        }
      )

      return {
        success: true,
        data: {
          chatId: response.data!.chatId,
          participants: response.data!.participants,
          messages: response.data!.messages.map(msg => ({
            messageId: msg.messageId,
            sender: msg.sender,
            receiver: msg.receiver,
            message: msg.message,
            messageType: msg.messageType,
            timestamp: msg.timestamp,
            isRead: msg.isRead,
            meetingDetails: msg.meetingDetails,
            fileDetails: msg.fileDetails
          }))
        }
      }
    } catch (error) {
      this.handleError(error, 'Failed to load chat history')
    }
  }

  /**
   * Send a message to another user
   */
  static async sendMessage(
    receiverId: string, 
    message: string, 
    messageType: 'text' | 'meeting' | 'file' | 'image' = 'text'
  ): Promise<ApiResponse<{ messageId: string; chatId: string; timestamp: string }>> {
    if (!receiverId?.trim() || !message?.trim()) {
      throw new Error('Receiver ID and message content are required')
    }

    try {
      const response = await $fetch<ApiResponse<any>>(
        `${this.baseUrl}/api/chat/send`,
        {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: {
            receiverId: receiverId.trim(),
            message: message.trim(),
            messageType
          }
        }
      )

      return {
        success: true,
        data: {
          messageId: response.data!.messageId,
          chatId: response.data!.chatId,
          timestamp: response.data!.timestamp
        }
      }
    } catch (error) {
      this.handleError(error, 'Failed to send message')
    }
  }

  /**
   * Schedule a meeting with another user
   */
  static async scheduleMeeting(
    receiverId: string, 
    meetingDetails: ScheduleMeetingRequest['meetingDetails']
  ): Promise<ApiResponse<{ messageId: string; meetingLink?: string; meetingDetails: MeetingDetails; note?: string }>> {
    if (!receiverId?.trim() || !meetingDetails) {
      throw new Error('Receiver ID and meeting details are required')
    }

    // Validate meeting details
    const requiredFields: (keyof ScheduleMeetingRequest['meetingDetails'])[] = ['title', 'startTime', 'endTime']
    for (const field of requiredFields) {
      if (!meetingDetails[field]) {
        throw new Error(`Meeting ${field} is required`)
      }
    }

    try {
      const response = await $fetch<ApiResponse<any>>(
        `${this.baseUrl}/api/chat/schedule-meeting`,
        {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: {
            receiverId: receiverId.trim(),
            meetingDetails: {
              title: meetingDetails.title,
              startTime: meetingDetails.startTime,
              endTime: meetingDetails.endTime,
              timeZone: meetingDetails.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
              description: meetingDetails.description || ''
            }
          }
        }
      )

      return {
        success: true,
        data: {
          messageId: response.data!.messageId,
          meetingLink: response.data!.meetingLink,
          meetingDetails: response.data!.meetingDetails,
          note: response.data!.note
        }
      }
    } catch (error) {
      this.handleError(error, 'Failed to schedule meeting')
    }
  }

  /**
   * Mark messages in a chat as read
   */
  static async markMessagesAsRead(chatId: string): Promise<ApiResponse<{ message: string }>> {
    if (!chatId?.trim()) {
      throw new Error('Chat ID is required')
    }

    try {
      const response = await $fetch<ApiResponse<{ message: string }>>(
        `${this.baseUrl}/api/chat/mark-read/${chatId}`,
        {
          method: 'POST',
          headers: this.getAuthHeaders()
        }
      )

      return {
        success: true,
        data: { message: response.message! }
      }
    } catch (error) {
      this.handleError(error, 'Failed to mark messages as read')
    }
  }

  /**
   * Get list of user's chats
   */
  static async getChatList(): Promise<ApiResponse<ChatListItem[]>> {
    try {
      const response = await $fetch<ApiResponse<ChatListItem[]>>(
        `${this.baseUrl}/api/chat/list`,
        {
          method: 'GET',
          headers: this.getAuthHeaders()
        }
      )

      return {
        success: true,
        data: response.data!.map(chat => ({
          chatId: chat.chatId,
          participants: chat.participants,
          lastMessage: chat.lastMessage,
          lastActivity: chat.lastActivity,
          unreadCount: chat.unreadCount
        }))
      }
    } catch (error) {
      this.handleError(error, 'Failed to load chat list')
    }
  }

  /**
   * Upload a file for chat
   */
  static async uploadFile(
    file: File, 
    receiverId: string
  ): Promise<ApiResponse<{ messageId: string; fileUrl: string; fileName: string; fileSize: number; fileType: string }>> {
    if (!file || !receiverId?.trim()) {
      throw new Error('File and receiver ID are required')
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      throw new Error('File size must be less than 5MB')
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'text/plain', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('File type not supported')
    }

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('receiverId', receiverId.trim())

      const response = await $fetch<ApiResponse<any>>(
        `${this.baseUrl}/api/chat/upload-file`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${useAuthStore().getToken}`
            // Don't set Content-Type for FormData, let browser set it
          },
          body: formData
        }
      )

      return {
        success: true,
        data: {
          messageId: response.data!.messageId,
          fileUrl: response.data!.fileUrl,
          fileName: response.data!.fileName,
          fileSize: response.data!.fileSize,
          fileType: response.data!.fileType
        }
      }
    } catch (error) {
      this.handleError(error, 'Failed to upload file')
    }
  }

  /**
   * Delete a message
   */
  static async deleteMessage(messageId: string): Promise<ApiResponse<{ message: string }>> {
    if (!messageId?.trim()) {
      throw new Error('Message ID is required')
    }

    try {
      const response = await $fetch<ApiResponse<{ message: string }>>(
        `${this.baseUrl}/api/chat/message/${messageId}`,
        {
          method: 'DELETE',
          headers: this.getAuthHeaders()
        }
      )

      return {
        success: true,
        data: { message: response.message! }
      }
    } catch (error) {
      this.handleError(error, 'Failed to delete message')
    }
  }

  /**
   * Edit a message
   */
  static async editMessage(
    messageId: string, 
    newMessage: string
  ): Promise<ApiResponse<{ messageId: string; message: string; editedAt: string }>> {
    if (!messageId?.trim() || !newMessage?.trim()) {
      throw new Error('Message ID and new message content are required')
    }

    try {
      const response = await $fetch<ApiResponse<any>>(
        `${this.baseUrl}/api/chat/message/${messageId}`,
        {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: {
            message: newMessage.trim()
          }
        }
      )

      return {
        success: true,
        data: {
          messageId: response.data!.messageId,
          message: response.data!.message,
          editedAt: response.data!.editedAt
        }
      }
    } catch (error) {
      this.handleError(error, 'Failed to edit message')
    }
  }

  /**
   * Search messages in a chat
   */
  static async searchMessages(
    chatId: string, 
    query: string, 
    limit: number = 20
  ): Promise<ApiResponse<SearchResult[]>> {
    if (!chatId?.trim() || !query?.trim()) {
      throw new Error('Chat ID and search query are required')
    }

    if (limit < 1 || limit > 100) {
      throw new Error('Limit must be between 1 and 100')
    }

    try {
      const params = new URLSearchParams({
        q: query.trim(),
        limit: limit.toString()
      })

      const response = await $fetch<ApiResponse<SearchResult[]>>(
        `${this.baseUrl}/api/chat/${chatId}/search?${params}`,
        {
          method: 'GET',
          headers: this.getAuthHeaders()
        }
      )

      return {
        success: true,
        data: response.data!.map(msg => ({
          messageId: msg.messageId,
          sender: msg.sender,
          message: msg.message,
          timestamp: msg.timestamp,
          messageType: msg.messageType
        }))
      }
    } catch (error) {
      this.handleError(error, 'Failed to search messages')
    }
  }

  /**
   * Get chat statistics
   */
  static async getChatStats(chatId: string): Promise<ApiResponse<ChatStats>> {
    if (!chatId?.trim()) {
      throw new Error('Chat ID is required')
    }

    try {
      const response = await $fetch<ApiResponse<ChatStats>>(
        `${this.baseUrl}/api/chat/${chatId}/stats`,
        {
          method: 'GET',
          headers: this.getAuthHeaders()
        }
      )

      return {
        success: true,
        data: {
          totalMessages: response.data!.totalMessages,
          totalMeetings: response.data!.totalMeetings,
          firstMessage: response.data!.firstMessage,
          lastActivity: response.data!.lastActivity,
          messagesByType: response.data!.messagesByType
        }
      }
    } catch (error) {
      this.handleError(error, 'Failed to get chat statistics')
    }
  }

  /**
   * Block or unblock a user
   */
  static async toggleUserBlock(
    userId: string, 
    block: boolean = true
  ): Promise<ApiResponse<{ message: string; isBlocked: boolean }>> {
    if (!userId?.trim()) {
      throw new Error('User ID is required')
    }

    try {
      const response = await $fetch<ApiResponse<{ message: string; isBlocked: boolean }>>(
        `${this.baseUrl}/api/chat/user/${userId}/block`,
        {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: { block }
        }
      )

      return {
        success: true,
        data: {
          message: response.message!,
          isBlocked: response.data!.isBlocked
        }
      }
    } catch (error) {
      this.handleError(error, `Failed to ${block ? 'block' : 'unblock'} user`)
    }
  }

  /**
   * Report a message or user
   */
  static async reportContent(
    reportData: ReportRequest
  ): Promise<ApiResponse<{ message: string; reportId: string }>> {
    const { messageId, userId, reason, description = '' } = reportData

    if (!messageId && !userId) {
      throw new Error('Either message ID or user ID is required')
    }

    if (!reason?.trim()) {
      throw new Error('Reason for reporting is required')
    }

    try {
      const response = await $fetch<ApiResponse<{ message: string; reportId: string }>>(
        `${this.baseUrl}/api/chat/report`,
        {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: {
            messageId: messageId?.trim(),
            userId: userId?.trim(),
            reason: reason.trim(),
            description: description.trim()
          }
        }
      )

      return {
        success: true,
        data: {
          message: response.message!,
          reportId: response.data!.reportId
        }
      }
    } catch (error) {
      this.handleError(error, 'Failed to submit report')
    }
  }

  /**
   * Get chat connection status
   */
  static async getConnectionStatus(): Promise<ApiResponse<{ status: string; timestamp: string; socketConnections: number }>> {
    try {
      const response = await $fetch<ApiResponse<any>>(
        `${this.baseUrl}/api/health`,
        {
          method: 'GET',
          headers: this.getAuthHeaders()
        }
      )

      return {
        success: true,
        data: {
          status: response.status,
          timestamp: response.timestamp,
          socketConnections: response.socketConnections || 0
        }
      }
    } catch (error) {
      this.handleError(error, 'Failed to get connection status')
    }
  }
}