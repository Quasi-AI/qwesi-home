<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Header -->
        <div class="bg-white border-b border-gray-200">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center space-x-4">
                        <NuxtLink to="/dashboard" class="text-gray-600 hover:text-gray-900">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                            </svg>
                        </NuxtLink>
                        <h1 class="text-2xl font-bold text-gray-900">Edit Profile</h1>
                    </div>
                    <div class="flex items-center space-x-3">
                        <button @click="saveProfile" :disabled="loading"
                            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            <span v-if="loading">Saving...</span>
                            <span v-else>Save Changes</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <!-- Profile Picture Section -->
                <div class="p-8 border-b border-gray-200">
                    <h2 class="text-lg font-semibold text-gray-900 mb-6">Profile Picture</h2>
                    <div class="flex items-center space-x-6">
                        <div class="relative">
                            <div v-if="profileImage"
                                class="w-24 h-24 rounded-full border-4 border-gray-200 overflow-hidden">
                                <img :src="profileImage" alt="Profile Picture" class="w-full h-full object-cover" />
                            </div>
                            <div v-else
                                class="w-24 h-24 rounded-full border-4 border-gray-200 bg-blue-100 flex items-center justify-center">
                                <span class="text-blue-600 font-bold text-2xl">{{ userInitials }}</span>
                            </div>
                            <button @click="triggerFileInput"
                                class="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z">
                                    </path>
                                </svg>
                            </button>
                        </div>
                        <div class="flex-1">
                            <h3 class="text-sm font-medium text-gray-900 mb-2">Update your profile picture</h3>
                            <p class="text-sm text-gray-600 mb-4">Upload a new image to personalize your profile</p>
                            <input ref="fileInput" type="file" accept="image/*" @change="handleImageUpload"
                                class="hidden" />
                            <button @click="triggerFileInput"
                                class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                                Choose Image
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Personal Information Section -->
                <div class="p-8 border-b border-gray-200">
                    <!-- Error Message -->
                    <div v-if="error" class="mb-6 bg-red-50 border border-red-200 rounded-lg p-3">
                        <p class="text-sm text-red-600">{{ error }}</p>
                    </div>

                    <!-- Success Message -->
                    <div v-if="success" class="mb-6 bg-green-50 border border-green-200 rounded-lg p-3">
                        <p class="text-sm text-green-600">{{ success }}</p>
                    </div>

                    <h2 class="text-lg font-semibold text-gray-900 mb-6">Personal Information</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <input id="name" v-model="form.name" type="text"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter your full name" />
                        </div>
                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input id="email" v-model="form.email" type="email"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter your email" />
                        </div>
                        <div>
                            <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number
                            </label>
                            <input id="phone" v-model="form.phone" type="tel" readonly
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                                placeholder="Phone number cannot be changed" />
                            <p class="text-xs text-gray-500 mt-1">Phone number cannot be modified for security reasons
                            </p>
                        </div>
                        <div>
                            <label for="dob" class="block text-sm font-medium text-gray-700 mb-2">
                                Date of Birth
                            </label>
                            <input id="dob" v-model="form.dob" type="date"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        </div>
                    </div>
                </div>

                <!-- Account Information Section -->
                <div class="p-8">
                    <h2 class="text-lg font-semibold text-gray-900 mb-6">Account Information</h2>
                    <div class="space-y-4">
                        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <h3 class="text-sm font-medium text-gray-900">Account Status</h3>
                                <p class="text-sm text-gray-600">{{ user?.isPro ? 'Pro Account' : 'Free Account' }}</p>
                            </div>
                            <span :class="user?.isPro ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                                class="px-2 py-1 text-xs font-medium rounded-full">
                                {{ user?.isPro ? 'Pro' : 'Free' }}
                            </span>
                        </div>
                        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <h3 class="text-sm font-medium text-gray-900">Member Since</h3>
                                <p class="text-sm text-gray-600">{{ memberSince }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const error = ref('')
const success = ref('')
const fileInput = ref(null)
const profileImage = ref('')

const form = ref({
    name: '',
    email: '',
    phone: '',
    dob: ''
})

const triggerFileInput = () => {
    fileInput.value?.click()
}

const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
            profileImage.value = e.target.result
        }
        reader.readAsDataURL(file)
    }
}

// Computed
const user = computed(() => authStore.getUser)

const userInitials = computed(() => {
    const name = form.value.name || ''
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2)
})

const memberSince = computed(() => {
    if (!user.value?.id) return 'N/A'
    // This would typically come from the user data, but for now we'll show a placeholder
    return 'Recently joined'
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
        const result = await authStore.updateProfile({
            name: form.value.name,
            email: form.value.email,
            dob: formatDateForAPI(form.value.dob),
            profileImage: profileImage.value
        })

        if (result.success) {
            success.value = 'Profile updated successfully!'
            setTimeout(() => {
                success.value = ''
            }, 3000)
        } else {
            error.value = result.error || 'Profile update failed'
        }
    } catch (err) {
        console.error('Error updating profile:', err)
        error.value = 'An unexpected error occurred'
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
})

// Set page title
useHead({
    title: 'Edit Profile - QWESI AI'
})
</script>