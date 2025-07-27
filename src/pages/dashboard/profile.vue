<template>
    <div class="min-h-screen bg-gray-50 flex">
        <!-- Sidebar -->
        <Sidebar :user="user" />

        <!-- Main Content -->
        <div class="flex-1 flex flex-col">
            <!-- Top Navigation -->
            <header class="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                    <div class="text-center sm:text-left">
                        <h1 class="text-xl sm:text-2xl font-bold text-gray-900">Edit Profile</h1>
                        <p class="text-sm text-gray-600">Update your personal information</p>
                    </div>

                    <!-- Save Button -->
                    <div class="flex justify-center sm:justify-end">
                        <button @click="saveProfile" :disabled="loading || uploading"
                            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto">
                            <span v-if="loading">Saving...</span>
                            <span v-else-if="uploading">Uploading...</span>
                            <span v-else>Save Changes</span>
                        </button>
                    </div>
                </div>
            </header>

            <!-- Main Content Area -->
            <main class="flex-1 p-4 sm:p-6">
                <div class="max-w-4xl mx-auto">
                    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                        <!-- Profile Picture Section -->
                        <div class="p-4 sm:p-8 border-b border-gray-200">
                            <h2 class="text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Profile Picture</h2>
                            <div class="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                                <div class="relative flex justify-center sm:justify-start">
                                    <div v-if="profileImage"
                                        class="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-gray-200 overflow-hidden relative">
                                        <img :src="profileImage" alt="Profile Picture"
                                            class="w-full h-full object-cover" />
                                        <button @click="triggerFileInput" :disabled="uploading"
                                            class="absolute bottom-1 right-1 w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-lg">
                                            <svg v-if="uploading" class="animate-spin w-3 h-3 sm:w-4 sm:h-4 text-white"
                                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                    stroke-width="4"></circle>
                                                <path class="opacity-75" fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                                </path>
                                            </svg>
                                            <svg v-else class="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none"
                                                stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z">
                                                </path>
                                            </svg>
                                        </button>
                                    </div>
                                    <div v-else
                                        class="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-gray-200 bg-blue-100 flex items-center justify-center relative">
                                        <span class="text-blue-600 font-bold text-xl sm:text-2xl">{{ userInitials
                                            }}</span>
                                        <button @click="triggerFileInput" :disabled="uploading"
                                            class="absolute bottom-0.5 right-1 w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-lg">
                                            <svg v-if="uploading" class="animate-spin w-3 h-3 sm:w-4 sm:h-4 text-white"
                                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                    stroke-width="4"></circle>
                                                <path class="opacity-75" fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                                </path>
                                            </svg>
                                            <svg v-else class="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none"
                                                stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z">
                                                </path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div class="flex-1 text-center sm:text-left">
                                    <h3 class="text-sm font-medium text-gray-900 mb-2">Update your profile picture</h3>
                                    <p class="text-sm text-gray-600 mb-4">Upload a new image to personalize your profile
                                    </p>

                                    <!-- Upload Progress -->
                                    <div v-if="uploading" class="mb-4">
                                        <div class="flex items-center space-x-2">
                                            <div class="flex-1 bg-gray-200 rounded-full h-2">
                                                <div class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                    :style="{ width: `${uploadProgress}%` }"></div>
                                            </div>
                                            <span class="text-sm text-gray-600">{{ uploadProgress }}%</span>
                                        </div>
                                    </div>

                                    <input ref="fileInput" type="file" accept="image/*" @change="handleImageUpload"
                                        class="hidden" />
                                    <button @click="triggerFileInput" :disabled="uploading"
                                        class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto">
                                        {{ uploading ? 'Uploading...' : 'Choose Image' }}
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
                                    <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Full
                                        Name</label>
                                    <input id="name" v-model="form.name" type="text" required
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                </div>
                                <div>
                                    <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email
                                        Address</label>
                                    <input id="email" v-model="form.email" type="email" readonly required
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-500 cursor-not-allowed" />
                                </div>
                                <div>
                                    <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">Phone
                                        Number</label>
                                    <input id="phone" v-model="form.phone" type="tel" readonly required
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-500 cursor-not-allowed" />
                                </div>
                                <div>
                                    <label for="dob" class="block text-sm font-medium text-gray-700 mb-2">Date of
                                        Birth</label>
                                    <input id="dob" v-model="form.dob" type="date" required
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
                                        <p class="text-sm text-gray-600">{{ user?.isPro ? 'Pro Account' : 'Free Account'
                                            }}</p>
                                    </div>
                                    <span
                                        :class="user?.isPro ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
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
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useImageUpload } from '~/composables/useImageUpload'
import Sidebar from '@/components/dashboard/Sidebar.vue'

const router = useRouter()
const authStore = useAuthStore()
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

const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file
    if (!validateImage(file)) {
        error.value = 'Please select a valid image file (JPEG, PNG, WebP) under 5MB'
        return
    }

    try {
        // Show preview immediately
        const reader = new FileReader()
        reader.onload = (e) => {
            profileImage.value = e.target.result
        }
        reader.readAsDataURL(file)

        // Compress and upload image
        const compressedFile = await compressImage(file)
        selectedFile.value = compressedFile

        // Upload to Firebase
        const downloadURL = await uploadImage(compressedFile, 'profile-images')
        profileImage.value = downloadURL

        success.value = 'Profile picture uploaded successfully!'
        setTimeout(() => {
            success.value = ''
        }, 3000)

    } catch (err) {
        console.error('Image upload error:', err)
        error.value = 'Failed to upload image. Please try again.'
        // Reset preview
        profileImage.value = user.value?.profileImage || ''
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
        const profileData = {
            name: form.value.name,
            email: form.value.email, // Include email since API requires it
            dob: formatDateForAPI(form.value.dob),
            profileImage: profileImage.value
        };

        const result = await authStore.updateProfile(profileData)

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