<template>
    <div class="min-h-screen bg-gray-50 flex">
        <!-- Sidebar -->
        <Sidebar :user="user" />

        <!-- Main Content -->
        <div class="flex-1 flex flex-col">
            <!-- Top Navigation -->
            <header class="bg-white border-b border-gray-200 px-6 py-4">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-900">Profile Settings</h1>
                        <p class="text-sm text-gray-600">Manage your account information and preferences</p>
                    </div>
                    <button @click="saveProfile" :disabled="loading || uploading"
                        class="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-medium">
                        <svg v-if="loading || uploading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        <span v-if="loading">Saving...</span>
                        <span v-else-if="uploading">Uploading...</span>
                        <span v-else>Save Changes</span>
                    </button>
                </div>
            </header>

            <!-- Main Content Area -->
            <main class="flex-1 p-6">
                <div class="max-w-4xl mx-auto space-y-6">
                    <!-- Profile Header Card -->
                    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
                            <div class="flex items-center gap-6">
                                <!-- Profile Picture -->
                                <div class="relative">
                                    <div class="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                                        <img v-if="profileImage" :src="profileImage" alt="Profile Picture" 
                                            class="w-full h-full object-cover" />
                                        <div v-else class="w-full h-full bg-blue-100 flex items-center justify-center">
                                            <span class="text-blue-600 font-bold text-2xl">{{ userInitials }}</span>
                                        </div>
                                    </div>
                                    <button @click="triggerFileInput" 
                                        class="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-lg">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        </svg>
                                    </button>
                                </div>
                                
                                <!-- User Info -->
                                <div class="text-white">
                                    <h2 class="text-2xl font-bold">{{ form.name || 'Your Name' }}</h2>
                                    <p class="text-blue-100 mb-2">{{ form.email }}</p>
                                    <div class="flex items-center gap-4">
                                        <div class="flex items-center gap-2">
                                            <div :class="isSubscribe ? 'bg-green-400' : 'bg-yellow-400'" 
                                                class="w-3 h-3 rounded-full"></div>
                                            <span class="text-sm font-medium">{{ isSubscribe ? 'Pro Member' : 'Free Member' }}</span>
                                        </div>
                                        <div class="flex items-center gap-2 text-sm text-blue-100">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a4 4 0 118 0v4m-6 16h8a2 2 0 002-2V11a2 2 0 00-2-2H10a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                            </svg>
                                            Member since {{ memberSince }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Upload Progress -->
                        <div v-if="uploading" class="px-6 py-4 bg-blue-50 border-b border-blue-100">
                            <div class="flex items-center gap-3">
                                <svg class="animate-spin w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                </svg>
                                <div class="flex-1">
                                    <p class="text-sm font-medium text-blue-800">Uploading profile picture...</p>
                                    <div class="mt-1 bg-blue-200 rounded-full h-2">
                                        <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                            :style="{ width: `${uploadProgress}%` }"></div>
                                    </div>
                                </div>
                                <span class="text-sm font-medium text-blue-600">{{ uploadProgress }}%</span>
                            </div>
                        </div>
                    </div>

                    <!-- Alert Messages -->
                    <div v-if="error" class="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                        <div class="flex">
                            <svg class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                            </svg>
                            <p class="ml-3 text-sm text-red-700">{{ error }}</p>
                        </div>
                    </div>

                    <div v-if="success" class="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
                        <div class="flex">
                            <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                            </svg>
                            <p class="ml-3 text-sm text-green-700">{{ success }}</p>
                        </div>
                    </div>

                    <div class="grid lg:grid-cols-3 gap-6">
                        <!-- Personal Information -->
                        <div class="lg:col-span-2">
                            <div class="bg-white rounded-xl shadow-sm border border-gray-200">
                                <div class="px-6 py-4 border-b border-gray-200">
                                    <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                        </svg>
                                        Personal Information
                                    </h3>
                                    <p class="text-sm text-gray-600">Update your personal details and preferences</p>
                                </div>
                                
                                <div class="p-6 space-y-6">
                                    <div class="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                                                Full Name <span class="text-red-500">*</span>
                                            </label>
                                            <div class="relative">
                                                <input id="name" v-model="form.name" type="text" required
                                                    class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
                                                    placeholder="Enter your full name" />
                                                <svg class="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                                </svg>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address
                                            </label>
                                            <div class="relative">
                                                <input id="email" v-model="form.email" type="email" readonly
                                                    class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" />
                                                <svg class="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                                                </svg>
                                                <div class="absolute right-3 top-3.5">
                                                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <p class="text-xs text-gray-500 mt-1">Email cannot be changed for security reasons</p>
                                        </div>
                                        
                                        <div>
                                            <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                                                Phone Number
                                            </label>
                                            <div class="relative">
                                                <input id="phone" v-model="form.phone" type="tel" readonly
                                                    class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                                                    placeholder="Enter your phone number" />
                                                <svg class="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                                </svg>
                                                <div class="absolute right-3 top-3.5">
                                                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <p class="text-xs text-gray-500 mt-1">Contact support to update phone number</p>
                                        </div>
                                        
                                        <div>
                                            <label for="dob" class="block text-sm font-medium text-gray-700 mb-2">
                                                Date of Birth
                                            </label>
                                            <div class="relative">
                                                <input id="dob" v-model="form.dob" type="date"
                                                    class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" />
                                                <svg class="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a4 4 0 118 0v4m-6 16h8a2 2 0 002-2V11a2 2 0 00-2-2H10a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Account Information Sidebar -->
                        <div class="space-y-6">
                            <!-- Account Status -->
                            <div class="bg-white rounded-xl shadow-sm border border-gray-200">
                                <div class="px-6 py-4 border-b border-gray-200">
                                    <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                        Account Status
                                    </h3>
                                </div>
                                <div class="p-6">
                                    <div class="text-center">
                                        <div :class="isSubscribe ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-gray-500 to-gray-600'" 
                                            class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg v-if="isSubscribe" class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                            </svg>
                                            <svg v-else class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                            </svg>
                                        </div>
                                        <h4 class="text-xl font-bold text-gray-900 mb-2">{{ isSubscribe ? 'Pro Member' : 'Free Member' }}</h4>
                                        <p class="text-gray-600 text-sm mb-4">{{ isSubscribe ? 'You have access to all premium features' : 'Upgrade to unlock premium features' }}</p>
                                        <NuxtLink to="/dashboard/subscription" 
                                            :class="isSubscribe ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'"
                                            class="inline-flex items-center gap-2 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                            </svg>
                                            {{ isSubscribe ? 'Manage Subscription' : 'Upgrade Now' }}
                                        </NuxtLink>
                                    </div>
                                </div>
                            </div>

                            <!-- Quick Stats -->
                            <div class="bg-white rounded-xl shadow-sm border border-gray-200">
                                <div class="px-6 py-4 border-b border-gray-200">
                                    <h3 class="text-lg font-semibold text-gray-900">Quick Stats</h3>
                                </div>
                                <div class="p-6 space-y-4">
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center gap-3">
                                            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a4 4 0 118 0v4m-6 16h8a2 2 0 002-2V11a2 2 0 00-2-2H10a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                                </svg>
                                            </div>
                                            <span class="text-sm text-gray-600">Account Age</span>
                                        </div>
                                        <span class="text-sm font-medium text-gray-900">{{ accountAge }}</span>
                                    </div>
                                    
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center gap-3">
                                            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                </svg>
                                            </div>
                                            <span class="text-sm text-gray-600">Profile Complete</span>
                                        </div>
                                        <span class="text-sm font-medium text-gray-900">{{ profileCompleteness }}%</span>
                                    </div>
                                    
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center gap-3">
                                            <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                                <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"/>
                                                </svg>
                                            </div>
                                            <span class="text-sm text-gray-600">Security Level</span>
                                        </div>
                                        <span class="text-sm font-medium text-green-600">High</span>
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
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

import { useAuthStore } from '~/features/auth/stores/auth.store'
import { useSubscriptionStore } from '~/features/subscription/stores/subscription.store'
import { useImageUpload } from '~/shared/composables/use-image-upload'
import Sidebar from '@/features/dashboard/components/dashboard-sidebar.vue'


const authStore = useAuthStore()
const subscriptionStore = useSubscriptionStore()
const { uploadImage, validateImage, compressImage, uploading, uploadProgress } = useImageUpload()

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

const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file
    if (!validateImage(file)) {
        error.value = 'Please select a valid image file (JPEG, PNG, WebP) under 5MB'
        setTimeout(() => error.value = '', 5000)
        return
    }

    try {
        // Show preview immediately
        const reader = new FileReader()
        reader.onload = (e) => {
            profileImage.value = e.target.result
        }
        reader.readAsDataURL(file)

        // Compress image and store for later upload
        const compressedFile = await compressImage(file)
        selectedFile.value = compressedFile

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

// Computed
const user = computed(() => authStore.getUser)

const userInitials = computed(() => {
    const name = form.value.name || user.value?.name || ''
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2) || 'UN'
})

const memberSince = computed(() => {
    if (!user.value || !user.value.date_joined) return 'N/A'
    const date = new Date(user.value.date_joined)
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short' })
})

const accountAge = computed(() => {
    if (!user.value || !user.value.date_joined) return 'N/A'
    const joinDate = new Date(user.value.date_joined)
    const now = new Date()
    const diffTime = Math.abs(now - joinDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 30) return `${diffDays} days`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`
    return `${Math.floor(diffDays / 365)} years`
})

const profileCompleteness = computed(() => {
    let completed = 0
    const total = 4
    
    if (form.value.name) completed++
    if (form.value.email) completed++
    if (form.value.dob) completed++
    if (profileImage.value) completed++
    
    return Math.round((completed / total) * 100)
})

const isSubscribe = computed(() => {
    return !!(user.value && user.value.isSubscribe)
})

// Format date for display (convert from DD/MM/YYYY to YYYY-MM-DD)
const formatDateForInput = (dateString) => {
    if (!dateString) return ''
    const parts = dateString.split('/')
    if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`
    }
    return dateString
}

// Format date for API (convert from YYYY-MM-DD to DD/MM/YYYY)
const formatDateForAPI = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
}

const saveProfile = async () => {
    loading.value = true
    error.value = ''
    success.value = ''

    try {
        let finalProfileImage = profileImage.value

        // If there's a selected file, upload it first
        if (selectedFile.value) {
            try {
                const downloadURL = await uploadImage(selectedFile.value, 'profile-images')
                finalProfileImage = downloadURL
                selectedFile.value = null // Clear the selected file after upload
            } catch (uploadErr) {
                console.error('Image upload error:', uploadErr)
                error.value = 'Failed to upload image. Please try again.'
                setTimeout(() => error.value = '', 5000)
                return
            }
        }

        const profileData = {
            name: form.value.name,
            email: form.value.email,
            dob: formatDateForAPI(form.value.dob),
            profileImage: finalProfileImage
        };

        const result = await authStore.updateProfile(profileData)

        if (result.success) {
            success.value = 'Profile updated successfully! Your changes have been saved.'
            setTimeout(() => success.value = '', 5000)
        } else {
            error.value = result.error || 'Profile update failed. Please try again.'
            setTimeout(() => error.value = '', 5000)
        }
    } catch (err) {
        console.error('Error updating profile:', err)
        error.value = 'An unexpected error occurred. Please try again.'
        setTimeout(() => error.value = '', 5000)
    } finally {
        loading.value = false
    }
}

onMounted(async () => {
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
})

// Set page title
useHead({
    title: 'Profile Settings - QWESI AI'
})
</script>