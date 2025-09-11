// composables/useChatSocket.ts
import { io, type Socket } from 'socket.io-client'
import { ref, type Ref } from 'vue'
import { useAuthStore } from '~/features/auth/stores/auth.store'
import type { MeetingDetails, ChatMessage } from '~/services/chatApi'

// Socket event types
interface SocketMessage {
  messageId: string
  chatId: string
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
}

interface SocketMeetingEvent {
  messageId: string
  chatId: string
  sender: {
    _id: string
    name: string
    profileImage?: string
  }
  meetingDetails: MeetingDetails
  timestamp: string
}

interface SocketChatJoinedEvent {
  chatId: string
  message: string
}

interface SocketTypingEvent {
  userId: string
  userName: string
  chatId: string
}

interface SocketUserStatusEvent {
  userId: string
  status: 'online' | 'offline'
  lastSeen: string
}

interface SocketErrorEvent {
  message: string
  code?: string
}

interface SocketNotificationEvent {
  type: 'new_message' | 'meeting_scheduled' | 'meeting_reminder'
  chatId: string
  sender: {
    _id: string
    name: string
    profileImage?: string
  }
  message?: string
  meetingDetails?: MeetingDetails
  timestamp: string
}

interface JoinChatData {
  chatId?: string
  talentId?: string
}

interface SendMessageData {
  chatId: string
  message: string
  receiverId: string
  messageType?: 'text' | 'meeting' | 'file' | 'image'
}

interface ScheduleMeetingData {
  chatId: string
  receiverId: string
  meetingDetails: MeetingDetails
}

interface MarkReadData {
  chatId: string
}

interface TypingData {
  chatId: string
}

export const useChatSocket = () => {
  const socket: Ref<Socket | null> = ref(null)
  const isConnected = ref(false)
  const connectionError: Ref<string | null> = ref(null)
  const authStore = useAuthStore()

  const connect = (): void => {
    if (socket.value?.connected) return

    const token = authStore.getToken
    if (!token) {
      connectionError.value = 'No authentication token found'
      return
    }

    const socketUrl = process.env.NODE_ENV === 'production' 
      ? 'https://dark-caldron-448714-u5.uc.r.appspot.com' 
      : 'http://localhost:5000'

    socket.value = io(socketUrl, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'],
      timeout: 10000,
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000
    })

    // Connection events
    socket.value.on('connect', () => {
      console.log('✅ Socket connected:', socket.value?.id)
      isConnected.value = true
      connectionError.value = null
    })

    socket.value.on('disconnect', (reason: string) => {
      console.log('❌ Socket disconnected:', reason)
      isConnected.value = false
      
      // Auto-reconnect unless it was intentional
      if (reason === 'io server disconnect') {
        setTimeout(() => {
          socket.value?.connect()
        }, 1000)
      }
    })

    socket.value.on('connect_error', (error: Error) => {
      console.error('Socket connection error:', error)
      connectionError.value = error.message
      isConnected.value = false
    })

    socket.value.on('reconnect', (attemptNumber: number) => {
      console.log('🔄 Socket reconnected after', attemptNumber, 'attempts')
      isConnected.value = true
      connectionError.value = null
    })

    socket.value.on('reconnect_error', (error: Error) => {
      console.error('Socket reconnection error:', error)
      connectionError.value = `Reconnection failed: ${error.message}`
    })

    socket.value.on('reconnect_failed', () => {
      console.error('Socket reconnection failed after maximum attempts')
      connectionError.value = 'Unable to reconnect to chat server'
      isConnected.value = false
    })
  }

  const disconnect = (): void => {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
      isConnected.value = false
      connectionError.value = null
    }
  }

  // Chat-specific methods
  const joinChat = (chatId?: string, talentId?: string): boolean => {
    if (!socket.value?.connected) {
      console.error('Socket not connected')
      return false
    }

    if (!chatId && !talentId) {
      console.error('Either chatId or talentId is required')
      return false
    }

    const data: JoinChatData = {}
    if (chatId) data.chatId = chatId
    if (talentId) data.talentId = talentId

    socket.value.emit('join_chat', data)
    return true
  }

  const leaveChat = (chatId: string): boolean => {
    if (!socket.value?.connected) return false
    if (!chatId?.trim()) return false
    
    socket.value.emit('leave_chat', { chatId })
    return true
  }

  const sendMessage = (
    chatId: string, 
    message: string, 
    receiverId: string, 
    messageType: 'text' | 'meeting' | 'file' | 'image' = 'text'
  ): boolean => {
    if (!socket.value?.connected) {
      console.error('Socket not connected')
      return false
    }

    if (!chatId?.trim() || !message?.trim() || !receiverId?.trim()) {
      console.error('Missing required parameters for sending message')
      return false
    }

    const data: SendMessageData = {
      chatId: chatId.trim(),
      message: message.trim(),
      receiverId: receiverId.trim(),
      messageType
    }

    socket.value.emit('send_message', data)
    return true
  }

  const scheduleMeeting = (
    chatId: string, 
    receiverId: string, 
    meetingDetails: MeetingDetails
  ): boolean => {
    if (!socket.value?.connected) {
      console.error('Socket not connected')
      return false
    }

    if (!chatId?.trim() || !receiverId?.trim() || !meetingDetails) {
      console.error('Missing required parameters for scheduling meeting')
      return false
    }

    const data: ScheduleMeetingData = {
      chatId: chatId.trim(),
      receiverId: receiverId.trim(),
      meetingDetails
    }

    socket.value.emit('schedule_meeting', data)
    return true
  }

  const markMessagesAsRead = (chatId: string): boolean => {
    if (!socket.value?.connected) return false
    if (!chatId?.trim()) return false
    
    socket.value.emit('mark_messages_read', { chatId: chatId.trim() })
    return true
  }

  const startTyping = (chatId: string): boolean => {
    if (!socket.value?.connected) return false
    if (!chatId?.trim()) return false
    
    socket.value.emit('typing_start', { chatId: chatId.trim() })
    return true
  }

  const stopTyping = (chatId: string): boolean => {
    if (!socket.value?.connected) return false
    if (!chatId?.trim()) return false
    
    socket.value.emit('typing_stop', { chatId: chatId.trim() })
    return true
  }

  const updateStatus = (status: 'online' | 'offline' | 'away'): boolean => {
    if (!socket.value?.connected) return false
    
    socket.value.emit('update_status', { status })
    return true
  }

  // Event listeners with proper typing
  const onNewMessage = (callback: (data: SocketMessage) => void): void => {
    if (!socket.value) return
    socket.value.on('new_message', callback)
  }

  const onMeetingScheduled = (callback: (data: SocketMeetingEvent) => void): void => {
    if (!socket.value) return
    socket.value.on('meeting_scheduled', callback)
  }

  const onMeetingScheduledSuccess = (callback: (data: { 
    messageId: string
    meetingLink?: string
    meetingDetails: MeetingDetails 
  }) => void): void => {
    if (!socket.value) return
    socket.value.on('meeting_scheduled_success', callback)
  }

  const onChatJoined = (callback: (data: SocketChatJoinedEvent) => void): void => {
    if (!socket.value) return
    socket.value.on('chat_joined', callback)
  }

  const onUserTyping = (callback: (data: SocketTypingEvent) => void): void => {
    if (!socket.value) return
    socket.value.on('user_typing', callback)
  }

  const onUserStoppedTyping = (callback: (data: { userId: string; chatId: string }) => void): void => {
    if (!socket.value) return
    socket.value.on('user_stopped_typing', callback)
  }

  const onUserStatusChanged = (callback: (data: SocketUserStatusEvent) => void): void => {
    if (!socket.value) return
    socket.value.on('user_status_changed', callback)
  }

  const onMessagesRead = (callback: (data: { userId: string; chatId: string }) => void): void => {
    if (!socket.value) return
    socket.value.on('messages_read', callback)
  }

  const onChatNotification = (callback: (data: SocketNotificationEvent) => void): void => {
    if (!socket.value) return
    socket.value.on('chat_notification', callback)
  }

  const onError = (callback: (error: SocketErrorEvent) => void): void => {
    if (!socket.value) return
    socket.value.on('error', callback)
  }

  // Cleanup methods
  const removeAllListeners = (): void => {
    if (!socket.value) return
    socket.value.removeAllListeners()
  }

  const removeListener = (event: string, callback?: Function): void => {
    if (!socket.value) return
    if (callback) {
      socket.value.off(event, callback)
    } else {
      socket.value.off(event)
    }
  }

  // Connection status helpers
  const getConnectionState = (): string => {
    if (!socket.value) return 'disconnected'
    return socket.value.connected ? 'connected' : 'disconnected'
  }

  const ping = (): Promise<number> => {
    return new Promise((resolve, reject) => {
      if (!socket.value?.connected) {
        reject(new Error('Socket not connected'))
        return
      }

      const start = Date.now()
      socket.value.emit('ping', (response: any) => {
        const latency = Date.now() - start
        resolve(latency)
      })

      // Timeout after 5 seconds
      setTimeout(() => {
        reject(new Error('Ping timeout'))
      }, 5000)
    })
  }

  return {
    // State
    socket,
    isConnected,
    connectionError,
    
    // Connection methods
    connect,
    disconnect,
    
    // Chat methods
    joinChat,
    leaveChat,
    sendMessage,
    scheduleMeeting,
    markMessagesAsRead,
    startTyping,
    stopTyping,
    updateStatus,
    
    // Event listeners
    onNewMessage,
    onMeetingScheduled,
    onMeetingScheduledSuccess,
    onChatJoined,
    onUserTyping,
    onUserStoppedTyping,
    onUserStatusChanged,
    onMessagesRead,
    onChatNotification,
    onError,
    
    // Cleanup
    removeAllListeners,
    removeListener,
    
    // Utilities
    getConnectionState,
    ping
  }
}