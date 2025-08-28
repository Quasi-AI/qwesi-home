<template>
    <div class="dashboard-container">
        <!-- Sidebar -->
        <Sidebar :user="user" />

        <!-- Main Content -->
        <div class="main-content">
            <!-- Ultra-Modern Header -->
            <header class="modern-header">
                <div class="header-backdrop"></div>
                <div class="header-content">
                    <div class="header-info">
                        <div class="welcome-section">
                            <h1 class="dashboard-title">Profile Settings</h1>
                            <p class="welcome-message">Manage your <span class="user-highlight">account information and preferences</span></p>
                        </div>
                        <div class="header-decorations">
                            <div class="floating-orb orb-1"></div>
                            <div class="floating-orb orb-2"></div>
                            <div class="floating-orb orb-3"></div>
                        </div>
                    </div>

                    <!-- Enhanced Save Button -->
                    <div class="header-actions">
                        <button 
                            @click="saveProfile" 
                            :disabled="loading || uploading" 
                            class="save-btn"
                            :class="{ 'loading': loading || uploading }">
                            <div class="btn-bg"></div>
                            <div class="btn-content">
                                <!-- Loading/Uploading Spinner -->
                                <svg 
                                    v-if="loading || uploading" 
                                    class="btn-spinner" 
                                    fill="none" 
                                    viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                
                                <!-- Button Text -->
                                <span v-if="!loading && !uploading" class="btn-text">Save Changes</span>
                                <span v-else-if="loading" class="btn-text">Saving...</span>
                                <span v-else-if="uploading" class="btn-text">Uploading...</span>
                            </div>
                        </button>
                    </div>
                </div>
            </header>

            <!-- Main Content Area -->
            <main class="dashboard-main">
                <div class="max-w-7xl mx-auto w-full">
                    <!-- Profile Hero Card -->
                    <div class="profile-hero-card">
                        <div class="hero-backdrop"></div>
                        <div class="hero-content">
                            <div class="hero-main">
                                <!-- Profile Picture Section -->
                                <div class="profile-picture-section">
                                    <div class="profile-picture-wrapper">
                                        <div class="profile-picture">
                                            <img v-if="profileImage" :src="profileImage" alt="Profile Picture" 
                                                class="profile-img" />
                                            <div v-else class="profile-initials">
                                                <span>{{ userInitials }}</span>
                                            </div>
                                        </div>
                                        <button @click="triggerFileInput" class="picture-edit-btn">
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                                            </svg>
                                        </button>
                                    </div>
                                    
                                    <!-- Upload Progress -->
                                    <div v-if="uploading" class="upload-progress">
                                        <div class="progress-content">
                                            <div class="progress-info">
                                                <svg class="progress-spinner" fill="none" viewBox="0 0 24 24">
                                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                                </svg>
                                                <span class="progress-text">Uploading...</span>
                                            </div>
                                            <div class="progress-bar">
                                                <div class="progress-fill" :style="{ width: `${uploadProgress}%` }"></div>
                                            </div>
                                            <span class="progress-percentage">{{ uploadProgress }}%</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- User Info -->
                                <div class="user-info-section">
                                    <div class="user-name">{{ form.name || 'Your Name' }}</div>
                                    <div class="user-email">{{ form.email }}</div>
                                    <div class="user-meta">
                                        <div class="status-badge">
                                            <div :class="isSubscribe ? 'status-dot pro' : 'status-dot free'"></div>
                                            <span class="status-text">{{ isSubscribe ? 'Pro Member' : 'Free Member' }}</span>
                                        </div>
                                        <div class="member-since">
                                            <svg class="member-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a4 4 0 118 0v4m-6 16h8a2 2 0 002-2V11a2 2 0 00-2-2H10a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                            </svg>
                                            <span>Member since {{ memberSince }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Hero Decorations -->
                            <div class="hero-decorations">
                                <div class="hero-orb hero-orb-1"></div>
                                <div class="hero-orb hero-orb-2"></div>
                                <div class="hero-orb hero-orb-3"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Alert Messages -->
                    <div v-if="error" class="alert-message error-alert">
                        <div class="alert-backdrop"></div>
                        <div class="alert-content">
                            <svg class="alert-icon" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                            </svg>
                            <p class="alert-text">{{ error }}</p>
                        </div>
                    </div>

                    <div v-if="success" class="alert-message success-alert">
                        <div class="alert-backdrop"></div>
                        <div class="alert-content">
                            <svg class="alert-icon" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                            </svg>
                            <p class="alert-text">{{ success }}</p>
                        </div>
                    </div>

                    <div class="profile-content-grid">
                        <!-- Personal Information Section -->
                        <div class="main-section">
                            <div class="modern-card">
                                <div class="card-backdrop"></div>
                                <div class="card-header">
                                    <div class="card-title-section">
                                        <svg class="card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                        </svg>
                                        <div class="title-text">
                                            <h3 class="card-title">Personal Information</h3>
                                            <p class="card-subtitle">Update your personal details and preferences</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="card-content">
                                    <div class="form-grid">
                                        <!-- Full Name -->
                                        <div class="form-group">
                                            <label for="name" class="form-label">
                                                Full Name <span class="required">*</span>
                                            </label>
                                            <div class="input-wrapper">
                                                <input 
                                                    id="name" 
                                                    v-model="form.name" 
                                                    type="text" 
                                                    required
                                                    class="modern-input" 
                                                    placeholder="Enter your full name" />
                                                <div class="input-icon">
                                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <!-- Email -->
                                        <div class="form-group">
                                            <label for="email" class="form-label">Email Address</label>
                                            <div class="input-wrapper">
                                                <input 
                                                    id="email" 
                                                    v-model="form.email" 
                                                    type="email" 
                                                    readonly
                                                    class="modern-input readonly" />
                                                <div class="input-icon">
                                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                                                    </svg>
                                                </div>
                                                <div class="readonly-icon">
                                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <p class="input-hint">Email cannot be changed for security reasons</p>
                                        </div>
                                        
                                        <!-- Phone -->
                                        <div class="form-group">
                                            <label for="phone" class="form-label">Phone Number</label>
                                            <div class="input-wrapper">
                                                <input 
                                                    id="phone" 
                                                    v-model="form.phone" 
                                                    type="tel" 
                                                    readonly
                                                    class="modern-input readonly"
                                                    placeholder="Enter your phone number" />
                                                <div class="input-icon">
                                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                                    </svg>
                                                </div>
                                                <div class="readonly-icon">
                                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <p class="input-hint">Contact support to update phone number</p>
                                        </div>
                                        
                                        <!-- Date of Birth -->
                                        <div class="form-group">
                                            <label for="dob" class="form-label">Date of Birth</label>
                                            <div class="input-wrapper">
                                                <input 
                                                    id="dob" 
                                                    v-model="form.dob" 
                                                    type="date"
                                                    class="modern-input" />
                                                <div class="input-icon">
                                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a4 4 0 118 0v4m-6 16h8a2 2 0 002-2V11a2 2 0 00-2-2H10a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Account Information Sidebar -->
                        <div class="sidebar-section">
                            <!-- Account Status Card -->
                            <div class="modern-card status-card">
                                <div class="card-backdrop"></div>
                                <div class="card-header">
                                    <div class="card-title-section">
                                        <svg class="card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                        <div class="title-text">
                                            <h3 class="card-title">Account Status</h3>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-content status-content">
                                    <div class="status-display">
                                        <div class="status-icon-wrapper">
                                            <div :class="isSubscribe ? 'status-icon pro' : 'status-icon free'">
                                                <svg v-if="isSubscribe" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                                </svg>
                                                <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                                </svg>
                                            </div>
                                        </div>
                                        <div class="status-text">
                                            <h4 class="status-title">{{ isSubscribe ? 'Pro Member' : 'Free Member' }}</h4>
                                            <p class="status-description">{{ isSubscribe ? 'You have access to all premium features' : 'Upgrade to unlock premium features' }}</p>
                                        </div>
                                        <NuxtLink 
                                            to="/dashboard/subscription" 
                                            :class="isSubscribe ? 'status-btn pro-btn' : 'status-btn upgrade-btn'">
                                            <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                            </svg>
                                            <span>{{ isSubscribe ? 'Manage Subscription' : 'Upgrade Now' }}</span>
                                        </NuxtLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>

        <!-- Hidden File Input -->
        <input ref="fileInput" type="file" accept="image/*" @change="handleImageUpload" class="hidden" />

        <!-- Message Popup -->
        <MessagePopup ref="alertRef" />
    </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { useAuthStore } from '~/features/auth/stores/auth.store'
import { useSubscriptionStore } from '~/features/subscription/stores/subscription.store'
import { useImageUpload } from '~/shared/composables/use-image-upload'
import Sidebar from '@/features/dashboard/components/dashboard-sidebar.vue'
import MessagePopup from '~/shared/components/message/MessagePopup.vue'

const alertRef = ref(null)
const authStore = useAuthStore()
const subscriptionStore = useSubscriptionStore()

// Initialize image upload composable only on client side
let imageUploadComposable = null
const uploading = ref(false)
const uploadProgress = ref(0)

const loading = ref(false)
const error = ref('')
const success = ref('')
const fileInput = ref(null)
const profileImage = ref('')
const selectedFile = ref(null)

const form = ref({
    name: '',
    email: '',
    phone: '',
    dob: ''
})

// Computed properties
const user = computed(() => authStore.getUser)

const userInitials = computed(() => {
    const name = form.value.name || user.value?.name || ''
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2) || 'UN'
})

const memberSince = computed(() => {
    if (!user.value?.date_joined) return 'N/A'
    try {
        const date = new Date(user.value.date_joined)
        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short' })
    } catch {
        return 'N/A'
    }
})

const isSubscribe = computed(() => {
    return !!(user.value?.isSubscribe)
})

// Methods
const triggerFileInput = () => {
    fileInput.value?.click()
}

const clearSelectedImage = () => {
    selectedFile.value = null
    profileImage.value = user.value?.profileImage || ''
    if (fileInput.value) {
        fileInput.value.value = ''
    }
}

// Format date for display (convert from DD/MM/YYYY to YYYY-MM-DD)
const formatDateForInput = (dateString) => {
    if (!dateString) return ''
    try {
        const parts = dateString.split('/')
        if (parts.length === 3) {
            const day = parts[0]
            const month = parts[1]
            const year = parts[2]
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        }
        return dateString
    } catch {
        return ''
    }
}

// Format date for API (convert from YYYY-MM-DD to DD/MM/YYYY)
const formatDateForAPI = (dateString) => {
    if (!dateString) return ''
    try {
        const date = new Date(dateString)
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        return `${day}/${month}/${year}`
    } catch {
        return ''
    }
}

const handleImageUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  console.log('File selected:', file.name, file.type, file.size)

  // Clear previous errors
  error.value = ''
  success.value = ''

  // Check if we're on client side
  if (!process.client) {
    error.value = 'Image upload is only available on the client side.'
    return
  }

  // Try to initialize image upload composable if not already done
  if (!imageUploadComposable) {
    try {
      console.log('Trying to initialize image upload composable...')
      
      // Wait a moment for Firebase to be ready
      await new Promise(resolve => setTimeout(resolve, 100))
      
      imageUploadComposable = useImageUpload()
      console.log('Image upload composable initialized successfully')
    } catch (initError) {
      console.error('Failed to initialize image upload:', initError)
      error.value = 'Image upload service is not available. Please refresh the page and try again.'
      setTimeout(() => error.value = '', 10000)
      return
    }
  }

  // Validate file
  if (!imageUploadComposable.validateImage(file)) {
    error.value = 'Please select a valid image file (JPEG, PNG, WebP) under 5MB'
    setTimeout(() => error.value = '', 5000)
    return
  }

  try {
    // Show preview immediately
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target && e.target.result) {
        profileImage.value = e.target.result
      }
    }
    reader.readAsDataURL(file)

    // Compress image and store for later upload
    console.log('Compressing image...')
    const compressedFile = await imageUploadComposable.compressImage(file, {
      maxWidth: 1200,
      maxHeight: 1200,
      quality: 0.8
    })
    selectedFile.value = compressedFile

    console.log('Image compressed successfully')
    success.value = 'Profile picture updated! Click "Save Changes" to save your profile.'
    setTimeout(() => success.value = '', 5000)

  } catch (err) {
    console.error('Image processing error:', err)
    error.value = 'Failed to process image. Please try again.'
    setTimeout(() => error.value = '', 5000)
    // Reset preview
    profileImage.value = user.value?.profileImage || ''
  }
}

const saveProfile = async () => {
    loading.value = true
    error.value = ''
    success.value = ''
    
    try {
        // 1. Validate form data
        if (!form.value.name?.trim()) {
            throw new Error('Full name is required')
        }

        // 2. Handle image upload if a new file was selected
        let finalProfileImage = profileImage.value
        if (selectedFile.value && imageUploadComposable) {
            try {
                // Set uploading state
                uploading.value = true
                
                // Upload the image
                const downloadURL = await imageUploadComposable.uploadImage(selectedFile.value, 'profile-images')
                finalProfileImage = downloadURL
                
                // Clear the selected file after successful upload
                selectedFile.value = null
                
                // Show success feedback via MessagePopup
                if (alertRef.value?.success) {
                    alertRef.value.success('Profile picture uploaded successfully!', {
                        title: 'Upload Complete',
                        duration: 3000
                    })
                }
            } catch (uploadErr) {
                console.error('Image upload error:', uploadErr)
                
                let uploadErrorMsg = 'Failed to upload image. Please try again.'
                if (uploadErr instanceof Error) {
                    uploadErrorMsg = uploadErr.message
                }
                
                if (alertRef.value?.error) {
                    alertRef.value.error(uploadErrorMsg, {
                        title: 'Upload Failed',
                        duration: 5000
                    })
                }
                return // Stop execution if upload fails
            } finally {
                uploading.value = false
            }
        }

        // 3. Prepare profile data
        const profileData = {
            name: form.value.name.trim(),
            email: form.value.email, // Assuming email is read-only
            dob: form.value.dob ? formatDateForAPI(form.value.dob) : null,
            profileImage: finalProfileImage
        }

        // 4. Update profile in the backend
        const result = await authStore.updateProfile(profileData)

        if (!result?.success) {
            throw new Error(result?.error || 'Profile update failed')
        }

        // 5. Show success message
        if (alertRef.value?.success) {
            alertRef.value.success('Profile updated successfully!', {
                title: 'Success',
                duration: 4000
            })
        } else {
            success.value = 'Profile updated successfully!'
            setTimeout(() => success.value = '', 4000)
        }

        // 6. Optionally refresh user data
        await authStore.fetchUser()

    } catch (err) {
        console.error('Error in saveProfile:', err)
        
        // Handle different error types
        let errorMessage = 'Failed to save profile. Please try again.'
        let errorTitle = 'Error'
        let duration = 5000

        if (err instanceof Error) {
            errorMessage = err.message
            
            // Specific error cases
            if (err.message.includes('email already exists')) {
                errorTitle = 'Email Conflict'
                duration = 0 // Persistent error
            } else if (err.message.includes('validation')) {
                errorTitle = 'Invalid Data'
            } else if (err.message.includes('unauthorized') || err.message.includes('auth')) {
                errorTitle = 'Session Expired'
                errorMessage = 'Your session has expired. Please log in again.'
                duration = 0
                
                // Optionally redirect to login
                setTimeout(() => navigateTo('/login'), 3000)
            }
        } else if (err?.response?.status) {
            // Handle HTTP error codes
            switch (err.response.status) {
                case 400:
                    errorTitle = 'Bad Request'
                    errorMessage = 'Please check your information and try again.'
                    break
                case 401:
                    errorTitle = 'Unauthorized'
                    errorMessage = 'Your session has expired. Please log in again.'
                    duration = 0
                    break
                case 409:
                    errorTitle = 'Conflict'
                    errorMessage = 'This email is already registered.'
                    duration = 0
                    break
                case 500:
                    errorTitle = 'Server Error'
                    errorMessage = 'Our servers are experiencing issues. Please try again later.'
                    break
            }
        }

        if (alertRef.value?.error) {
            alertRef.value.error(errorMessage, {
                title: errorTitle,
                duration
            })
        } else {
            error.value = errorMessage
            setTimeout(() => error.value = '', duration || 5000)
        }

    } finally {
        loading.value = false
    }
}

// Initialize on mount
onMounted(async () => {
    console.log('Profile page mounted')
    
    // Initialize image upload composable only after mount and if Firebase is available
    if (process.client) {
        console.log('Client-side initialization')
        
        // Wait a bit for plugins to be fully loaded
        await nextTick()
        
        try {
            const nuxtApp = useNuxtApp()
            console.log('Nuxt app available keys:', Object.keys(nuxtApp))
            console.log('$firebase available:', !!nuxtApp.$firebase)
            
            if (nuxtApp.$firebase) {
                console.log('Firebase is available, initializing image upload...')
                imageUploadComposable = useImageUpload()
                console.log('Image upload composable initialized')
            } else {
                console.warn('Firebase not available yet, will try during image upload')
            }
        } catch (error) {
            console.error('Failed to initialize image upload on mount:', error)
        }
    }

    try {
        // Load existing user data from auth store
        const currentUser = authStore.getUser
        if (currentUser) {
            form.value = {
                name: currentUser.name || '',
                email: currentUser.email || '',
                phone: currentUser.phone || '',
                dob: formatDateForInput(currentUser.dob || '')
            }
            profileImage.value = currentUser.profileImage || ''
        } else {
            // If no user data, try to fetch it
            await authStore.fetchUser()
            const fetchedUser = authStore.getUser
            if (fetchedUser) {
                form.value = {
                    name: fetchedUser.name || '',
                    email: fetchedUser.email || '',
                    phone: fetchedUser.phone || '',
                    dob: formatDateForInput(fetchedUser.dob || '')
                }
                profileImage.value = fetchedUser.profileImage || ''
            }
        }

        // Fetch subscription data to ensure we have the latest status
        await subscriptionStore.fetchSubscription()
    } catch (err) {
        console.error('Error loading user data:', err)
        error.value = 'Failed to load user data'
    }
})

// Set page title
useHead({
    title: 'Profile Settings - QWESI AI'
})
</script>

<style scoped>
/* Base Layout */
.dashboard-container {
    @apply min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex;
    position: relative;
    overflow-x: hidden;
    height: 100vh;
}

.main-content {
    @apply flex-1 flex flex-col;
    min-width: 0;
    height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
}

/* Ultra-Modern Header */
.modern-header {
    @apply relative border-b border-slate-200/60;
    backdrop-filter: blur(20px);
}

.header-backdrop {
    @apply absolute inset-0 bg-gradient-to-r from-white/95 via-white/90 to-blue-50/80;
}

.header-content {
    @apply relative z-10 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0;
}

.header-info {
    @apply relative;
}

.welcome-section {
    @apply text-center sm:text-left;
}

.dashboard-title {
    @apply text-2xl font-black bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent;
    font-variant: small-caps;
    letter-spacing: -0.025em;
}

.welcome-message {
    @apply text-sm font-medium text-slate-600 mt-1;
}

.user-highlight {
    @apply font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent;
}

.header-decorations {
    @apply absolute -inset-4 pointer-events-none;
}

.floating-orb {
    @apply absolute w-1 h-1 rounded-full opacity-20;
    animation: float 6s ease-in-out infinite;
}

.orb-1 {
    @apply bg-blue-400 top-2 right-8;
    animation-delay: 0s;
}

.orb-2 {
    @apply bg-purple-400 top-8 right-4;
    animation-delay: 2s;
}

.orb-3 {
    @apply bg-emerald-400 top-6 right-12;
    animation-delay: 4s;
}

/* Header Actions */
.header-actions {
    @apply flex items-center space-x-3;
}

.save-btn {
    @apply relative px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300;
    @apply hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed;
    backdrop-filter: blur(12px);
    min-width: 140px;
}

.save-btn .btn-bg {
    @apply absolute inset-0 rounded-2xl transition-all duration-300;
    @apply bg-gradient-to-r from-blue-500 to-blue-600;
}

.save-btn:hover .btn-bg {
    @apply from-blue-600 to-blue-700;
}

.save-btn.loading .btn-bg {
    @apply from-blue-400 to-blue-500;
}

.btn-content {
    @apply relative z-10 flex items-center justify-center space-x-2 text-white;
}

.btn-spinner {
    @apply w-5 h-5;
    animation: spin 1s linear infinite;
}

.btn-text {
    @apply font-medium;
}

/* Main Dashboard Content */
.dashboard-main {
    @apply flex-1 p-6 flex flex-col space-y-8;
    min-height: 0;
    overflow-y: auto;
    padding-bottom: 2rem;
}

/* Profile Hero Card */
.profile-hero-card {
    @apply relative rounded-3xl overflow-hidden mb-8;
    backdrop-filter: blur(20px);
}

.hero-backdrop {
    @apply absolute inset-0 bg-gradient-to-br from-indigo-600/95 via-purple-600/90 to-blue-600/95;
}

.hero-content {
    @apply relative z-10 p-8 text-white;
}

.hero-main {
    @apply flex flex-col sm:flex-row sm:items-center space-y-6 sm:space-y-0 sm:space-x-8;
}

/* Profile Picture Section */
.profile-picture-section {
    @apply flex-shrink-0 space-y-4;
}

.profile-picture-wrapper {
    @apply relative;
}

.profile-picture {
    @apply w-32 h-32 rounded-3xl border-4 border-white shadow-2xl overflow-hidden;
    @apply bg-gradient-to-br from-white/20 to-white/10;
}

.profile-img {
    @apply w-full h-full object-cover;
}

.profile-initials {
    @apply w-full h-full flex items-center justify-center;
    @apply text-white font-black text-3xl;
}

.picture-edit-btn {
    @apply absolute -bottom-2 -right-2 bg-white text-blue-600 p-3 rounded-2xl;
    @apply hover:bg-blue-50 transition-all duration-300 hover:scale-110 shadow-xl;
}

/* Upload Progress */
.upload-progress {
    @apply bg-white/20 rounded-2xl p-4 border border-white/30;
    backdrop-filter: blur(12px);
}

.progress-content {
    @apply space-y-3;
}

.progress-info {
    @apply flex items-center space-x-2;
}

.progress-spinner {
    @apply w-5 h-5;
    animation: spin 1s linear infinite;
}

.progress-text {
    @apply text-sm font-medium;
}

.progress-bar {
    @apply bg-white/20 rounded-full h-2 overflow-hidden;
}

.progress-fill {
    @apply bg-white h-full rounded-full transition-all duration-300;
}

.progress-percentage {
    @apply text-xs font-bold text-center;
}

/* User Info Section */
.user-info-section {
    @apply flex-1 space-y-4;
}

.user-name {
    @apply text-3xl font-black;
    background: linear-gradient(to right, rgba(255,255,255,0.95), rgba(255,255,255,0.8));
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
}

.user-email {
    @apply text-blue-100 text-lg;
}

.user-meta {
    @apply flex flex-wrap items-center gap-6;
}

.status-badge {
    @apply flex items-center space-x-2;
}

.status-dot {
    @apply w-3 h-3 rounded-full;
}

.status-dot.pro {
    @apply bg-emerald-400;
}

.status-dot.free {
    @apply bg-yellow-400;
}

.status-text {
    @apply font-medium;
}

.member-since {
    @apply flex items-center space-x-2 text-sm text-blue-100;
}

.member-icon {
    @apply w-4 h-4;
}

/* Hero Decorations */
.hero-decorations {
    @apply absolute inset-0 pointer-events-none;
}

.hero-orb {
    @apply absolute rounded-full opacity-10;
    animation: heroFloat 8s ease-in-out infinite;
}

.hero-orb-1 {
    @apply w-24 h-24 bg-white top-8 right-16;
    animation-delay: 0s;
}

.hero-orb-2 {
    @apply w-16 h-16 bg-yellow-300 bottom-12 left-20;
    animation-delay: 3s;
}

.hero-orb-3 {
    @apply w-20 h-20 bg-pink-300 top-20 right-1/3;
    animation-delay: 6s;
}

/* Alert Messages */
.alert-message {
    @apply relative rounded-2xl overflow-hidden mb-6;
    backdrop-filter: blur(20px);
}

.alert-backdrop {
    @apply absolute inset-0;
}

.error-alert .alert-backdrop {
    @apply bg-red-50/90 border border-red-200/60;
}

.success-alert .alert-backdrop {
    @apply bg-emerald-50/90 border border-emerald-200/60;
}

.alert-content {
    @apply relative z-10 flex items-center p-4;
}

.alert-icon {
    @apply w-5 h-5 flex-shrink-0 mr-3;
}

.error-alert .alert-icon {
    @apply text-red-500;
}

.success-alert .alert-icon {
    @apply text-emerald-500;
}

.alert-text {
    @apply text-sm font-medium;
}

.error-alert .alert-text {
    @apply text-red-800;
}

.success-alert .alert-text {
    @apply text-emerald-800;
}

/* Profile Content Grid */
.profile-content-grid {
    @apply grid lg:grid-cols-3 gap-8;
}

.main-section {
    @apply lg:col-span-2;
}

.sidebar-section {
    @apply space-y-8;
}

/* Modern Cards */
.modern-card {
    @apply relative rounded-3xl overflow-hidden;
    backdrop-filter: blur(20px);
}

.card-backdrop {
    @apply absolute inset-0 bg-white/70 border border-slate-200/60;
}

.card-header {
    @apply relative z-10 p-6 border-b border-slate-200/40;
}

.card-title-section {
    @apply flex items-start space-x-4;
}

.card-icon {
    @apply w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5;
}

.title-text {
    @apply flex-1;
}

.card-title {
    @apply text-xl font-bold text-slate-900 mb-1;
}

.card-subtitle {
    @apply text-sm text-slate-600;
}

.card-content {
    @apply relative z-10 p-6;
}

/* Form Elements */
.form-grid {
    @apply grid md:grid-cols-2 gap-6;
}

.form-group {
    @apply space-y-2;
}

.form-label {
    @apply block text-sm font-bold text-slate-700;
}

.required {
    @apply text-red-500;
}

.input-wrapper {
    @apply relative;
}

.modern-input {
    @apply w-full pl-12 pr-12 py-4 rounded-2xl transition-all duration-300;
    @apply bg-slate-50/70 border border-slate-200/60;
    @apply focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50;
    @apply focus:bg-white/80;
    backdrop-filter: blur(12px);
}

.modern-input.readonly {
    @apply bg-slate-100/50 text-slate-500 cursor-not-allowed;
}

.input-icon {
    @apply absolute left-4 top-4 w-5 h-5 text-slate-400;
}

.readonly-icon {
    @apply absolute right-4 top-4 w-5 h-5 text-slate-400;
}

.input-hint {
    @apply text-xs text-slate-500 mt-1;
}

/* Status Card Specific */
.status-card {
    @apply transition-all duration-300 hover:shadow-xl;
}

.status-content {
    @apply text-center;
}

.status-display {
    @apply space-y-6;
}

.status-icon-wrapper {
    @apply mx-auto;
}

.status-icon {
    @apply w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-xl;
}

.status-icon.pro {
    @apply bg-gradient-to-br from-emerald-500 to-emerald-600 text-white;
}

.status-icon.free {
    @apply bg-gradient-to-br from-slate-400 to-slate-500 text-white;
}

.status-title {
    @apply text-2xl font-bold text-slate-900 mb-2;
}

.status-description {
    @apply text-slate-600 text-sm mb-4;
}

.status-btn {
    @apply inline-flex items-center space-x-2 px-6 py-3 rounded-2xl;
    @apply font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg;
}

.pro-btn {
    @apply bg-gradient-to-r from-emerald-500 to-emerald-600 text-white;
    @apply hover:from-emerald-600 hover:to-emerald-700;
}

.upgrade-btn {
    @apply bg-gradient-to-r from-blue-500 to-blue-600 text-white;
    @apply hover:from-blue-600 hover:to-blue-700;
}

.btn-icon {
    @apply w-4 h-4;
}

/* Custom Scrollbar Styling */
.main-content {
    scrollbar-width: thin;
    scrollbar-color: rgba(148, 163, 184, 0.3) transparent;
}

.main-content::-webkit-scrollbar {
    width: 6px;
}

.main-content::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 3px;
}

.main-content::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, rgba(148, 163, 184, 0.3), rgba(148, 163, 184, 0.5));
    border-radius: 3px;
    transition: all 0.3s ease;
}

.main-content::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, rgba(148, 163, 184, 0.5), rgba(148, 163, 184, 0.7));
}

.dashboard-main {
    scrollbar-width: thin;
    scrollbar-color: rgba(148, 163, 184, 0.3) transparent;
}

.dashboard-main::-webkit-scrollbar {
    width: 6px;
}

.dashboard-main::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 3px;
}

.dashboard-main::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, rgba(148, 163, 184, 0.3), rgba(148, 163, 184, 0.5));
    border-radius: 3px;
    transition: all 0.3s ease;
}

.dashboard-main::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, rgba(148, 163, 184, 0.5), rgba(148, 163, 184, 0.7));
}

/* Animations */
@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-6px); }
}

@keyframes heroFloat {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-12px) rotate(180deg); }
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 768px) {
    .dashboard-title {
        @apply text-xl;
    }
    
    .profile-picture {
        @apply w-24 h-24;
    }
    
    .user-name {
        @apply text-2xl;
    }
    
    .form-grid {
        @apply grid-cols-1;
    }
    
    .profile-content-grid {
        @apply grid-cols-1 gap-6;
    }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
    .floating-orb,
    .hero-orb,
    .btn-spinner,
    .progress-spinner {
        animation: none;
    }
    
    .save-btn:hover,
    .modern-card:hover,
    .status-btn:hover {
        transform: none;
    }
}
</style>