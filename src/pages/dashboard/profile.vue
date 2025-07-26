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
                            <div v-if="profileImage" class="w-24 h-24 rounded-full border-4 border-gray-200 overflow-hidden">
                                <img :src="profileImage" alt="Profile Picture"
                                    class="w-full h-full object-cover" />
                            </div>
                            <div v-else class="w-24 h-24 rounded-full border-4 border-gray-200 bg-blue-100 flex items-center justify-center">
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
                    <h2 class="text-lg font-semibold text-gray-900 mb-6">Personal Information</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
                                First Name
                            </label>
                            <input id="firstName" v-model="form.firstName" type="text"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter your first name" />
                        </div>
                        <div>
                            <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
                                Last Name
                            </label>
                            <input id="lastName" v-model="form.lastName" type="text"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter your last name" />
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
                            <input id="phone" v-model="form.phone" type="tel"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter your phone number" />
                        </div>
                        <div>
                            <label for="dateOfBirth" class="block text-sm font-medium text-gray-700 mb-2">
                                Date of Birth
                            </label>
                            <input id="dateOfBirth" v-model="form.dateOfBirth" type="date"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        </div>
                        <div>
                            <label for="gender" class="block text-sm font-medium text-gray-700 mb-2">
                                Gender
                            </label>
                            <select id="gender" v-model="form.gender"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                                <option value="prefer-not-to-say">Prefer not to say</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Professional Information Section -->
                <div class="p-8 border-b border-gray-200">
                    <h2 class="text-lg font-semibold text-gray-900 mb-6">Professional Information</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label for="jobTitle" class="block text-sm font-medium text-gray-700 mb-2">
                                Job Title
                            </label>
                            <input id="jobTitle" v-model="form.jobTitle" type="text"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., Software Engineer" />
                        </div>
                        <div>
                            <label for="company" class="block text-sm font-medium text-gray-700 mb-2">
                                Company
                            </label>
                            <input id="company" v-model="form.company" type="text"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter your company name" />
                        </div>
                        <div>
                            <label for="industry" class="block text-sm font-medium text-gray-700 mb-2">
                                Industry
                            </label>
                            <select id="industry" v-model="form.industry"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="">Select industry</option>
                                <option value="technology">Technology</option>
                                <option value="healthcare">Healthcare</option>
                                <option value="finance">Finance</option>
                                <option value="education">Education</option>
                                <option value="marketing">Marketing</option>
                                <option value="sales">Sales</option>
                                <option value="consulting">Consulting</option>
                                <option value="retail">Retail</option>
                                <option value="manufacturing">Manufacturing</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label for="experience" class="block text-sm font-medium text-gray-700 mb-2">
                                Years of Experience
                            </label>
                            <select id="experience" v-model="form.experience"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="">Select experience level</option>
                                <option value="0-1">0-1 years</option>
                                <option value="2-5">2-5 years</option>
                                <option value="6-10">6-10 years</option>
                                <option value="11-15">11-15 years</option>
                                <option value="16-20">16-20 years</option>
                                <option value="20+">20+ years</option>
                            </select>
                        </div>
                    </div>
                    <div class="mt-6">
                        <label for="bio" class="block text-sm font-medium text-gray-700 mb-2">
                            Bio
                        </label>
                        <textarea id="bio" v-model="form.bio" rows="4"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Tell us about yourself, your skills, and what you're looking for..."></textarea>
                    </div>
                </div>

                <!-- Location Section -->
                <div class="p-8 border-b border-gray-200">
                    <h2 class="text-lg font-semibold text-gray-900 mb-6">Location</h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label for="country" class="block text-sm font-medium text-gray-700 mb-2">
                                Country
                            </label>
                            <select id="country" v-model="form.country"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="">Select country</option>
                                <option value="ghana">Ghana</option>
                                <option value="nigeria">Nigeria</option>
                                <option value="kenya">Kenya</option>
                                <option value="south-africa">South Africa</option>
                                <option value="ethiopia">Ethiopia</option>
                                <option value="uganda">Uganda</option>
                                <option value="tanzania">Tanzania</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label for="city" class="block text-sm font-medium text-gray-700 mb-2">
                                City
                            </label>
                            <input id="city" v-model="form.city" type="text"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter your city" />
                        </div>
                        <div>
                            <label for="timezone" class="block text-sm font-medium text-gray-700 mb-2">
                                Timezone
                            </label>
                            <select id="timezone" v-model="form.timezone"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="">Select timezone</option>
                                <option value="GMT">GMT (UTC+0)</option>
                                <option value="GMT+1">GMT+1 (UTC+1)</option>
                                <option value="GMT+2">GMT+2 (UTC+2)</option>
                                <option value="GMT+3">GMT+3 (UTC+3)</option>
                                <option value="GMT-5">GMT-5 (UTC-5)</option>
                                <option value="GMT-6">GMT-6 (UTC-6)</option>
                                <option value="GMT-7">GMT-7 (UTC-7)</option>
                                <option value="GMT-8">GMT-8 (UTC-8)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Preferences Section -->
                <div class="p-8">
                    <h2 class="text-lg font-semibold text-gray-900 mb-6">Preferences</h2>
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <div>
                                <h3 class="text-sm font-medium text-gray-900">Email Notifications</h3>
                                <p class="text-sm text-gray-600">Receive job alerts and updates via email</p>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" v-model="form.emailNotifications" class="sr-only peer">
                                <div
                                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
                                </div>
                            </label>
                        </div>
                        <div class="flex items-center justify-between">
                            <div>
                                <h3 class="text-sm font-medium text-gray-900">SMS Notifications</h3>
                                <p class="text-sm text-gray-600">Receive urgent updates via SMS</p>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" v-model="form.smsNotifications" class="sr-only peer">
                                <div
                                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
                                </div>
                            </label>
                        </div>
                        <div class="flex items-center justify-between">
                            <div>
                                <h3 class="text-sm font-medium text-gray-900">Profile Visibility</h3>
                                <p class="text-sm text-gray-600">Allow other users to see your profile</p>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" v-model="form.profileVisible" class="sr-only peer">
                                <div
                                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
                                </div>
                            </label>
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

const router = useRouter()
const loading = ref(false)
const fileInput = ref(null)
const profileImage = ref('')

const form = ref({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    jobTitle: '',
    company: '',
    industry: '',
    experience: '',
    bio: '',
    country: '',
    city: '',
    timezone: '',
    emailNotifications: true,
    smsNotifications: false,
    profileVisible: true
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
const userInitials = computed(() => {
    const firstName = form.value.firstName || ''
    const lastName = form.value.lastName || ''
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase()
})

const saveProfile = async () => {
    loading.value = true

    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Update localStorage with new profile data
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        const updatedUser = {
            ...user,
            ...form.value,
            profileImage: profileImage.value
        }
        localStorage.setItem('user', JSON.stringify(updatedUser))

        // Show success message (you can implement a toast notification here)
        console.log('Profile updated successfully!')
        
        // Redirect back to dashboard
        await router.push('/dashboard')
    } catch (error) {
        console.error('Error updating profile:', error)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    // Load existing user data
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user) {
        form.value = {
            ...form.value,
            ...user
        }
        profileImage.value = user.profileImage || ''
    }
})

// Set page title
useHead({
    title: 'Edit Profile - QWESI AI'
})
</script>