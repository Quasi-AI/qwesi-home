<template>
    <div class="dashboard-container">
        <!-- Sidebar -->
        <Sidebar :user="user" />

        <!-- Main Content -->
        <div class="main-content">
            <!-- Modern Header -->
            <header class="modern-header">
                <div class="header-backdrop"></div>
                <div class="header-content">
                    <div class="header-info">
                        <div class="welcome-section">
                            <h1 class="dashboard-title">Employer Registration</h1>
                            <p class="welcome-message">Find the best talent and grow your business with AI-powered solutions</p>
                        </div>
                    </div>

                    <!-- Header Actions -->
                    <div class="header-actions">
                        <!-- Tips Button -->
                        <button @click="showTipsModal = true" class="action-btn tips-btn">
                            <div class="btn-bg"></div>
                            <div class="btn-content">
                                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Tips</span>
                            </div>
                        </button>

                        <!-- Back Button -->
                        <NuxtLink to="/dashboard/get-started" class="action-btn referral-btn">
                            <div class="btn-bg"></div>
                            <div class="btn-content">
                                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                <span>Back to Options</span>
                            </div>
                        </NuxtLink>

                        <!-- Profile Dropdown -->
                        <div class="profile-dropdown">
                            <button @click="profileMenuOpen = !profileMenuOpen" class="profile-btn">
                                <div class="profile-avatar">
                                    <div v-if="user.profileImage" class="avatar-image">
                                        <img :src="user.profileImage" alt="Profile Picture" />
                                    </div>
                                    <div v-else class="avatar-initials">
                                        <span>{{ userInitials }}</span>
                                    </div>
                                    <div class="avatar-ring"></div>
                                </div>
                                <span class="hidden sm:block">{{ displayName }}</span>
                                <svg class="dropdown-arrow" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                                </svg>
                            </button>

                            <!-- Profile Menu -->
                            <div v-if="profileMenuOpen" class="profile-menu">
                                <div class="menu-backdrop"></div>
                                <div class="menu-content">
                                    <button @click="editProfile" class="menu-item">
                                        <svg class="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span>Edit Profile</span>
                                    </button>
                                    <div class="menu-divider"></div>
                                    <button @click="handleLogout" class="menu-item logout-item">
                                        <svg class="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Header Decorations -->
                <div class="header-decorations">
                    <div class="floating-orb orb-1"></div>
                    <div class="floating-orb orb-2"></div>
                    <div class="floating-orb orb-3"></div>
                </div>
            </header>

            <MessagePopup ref="alertRef" />

            <!-- Main Content Area -->
            <main class="dashboard-main">
                <div class="max-w-4xl mx-auto w-full space-y-8">
                    <!-- Hero Banner -->
                    <div class="onboarding-banner">
                        <div class="banner-backdrop"></div>
                        <div class="banner-content">
                            <div class="banner-main">
                                <div class="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mr-4 flex-shrink-0">
                                    <svg class="banner-icon" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 class="banner-title">Find Top Talent with AI!</h2>
                                    <p class="banner-description">
                                        Access our AI-powered recruiting tools to find the perfect candidates, streamline your hiring process, 
                                        and grow your business with targeted advertising solutions.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Registration Form -->
                    <div class="relative rounded-3xl overflow-hidden">
                        <div class="absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-orange-50/80 border border-white/60 backdrop-blur-xl"></div>
                        <div class="relative z-10 p-8">
                            <h3 class="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent mb-6">Company Profile</h3>

                            <form @submit.prevent="submitEmployerForm" class="space-y-6">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label class="block text-sm font-medium text-slate-700 mb-2">Contact Person *</label>
                                        <input v-model="employerForm.name" type="text" placeholder="Your full name"
                                            class="w-full px-4 py-3 bg-white/80 border border-slate-200/60 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-slate-400 transition-all duration-300"
                                            required />
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-slate-700 mb-2">Company Name *</label>
                                        <input v-model="employerForm.companyName" type="text" placeholder="Your company name"
                                            class="w-full px-4 py-3 bg-white/80 border border-slate-200/60 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-slate-400 transition-all duration-300"
                                            required />
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label class="block text-sm font-medium text-slate-700 mb-2">Business Email *</label>
                                        <input v-model="employerForm.email" type="email" placeholder="company@example.com"
                                            class="w-full px-4 py-3 bg-white/80 border border-slate-200/60 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-slate-400 transition-all duration-300"
                                            required />
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-slate-700 mb-2">Website</label>
                                        <input v-model="employerForm.url" type="url" placeholder="https://yourcompany.com"
                                            class="w-full px-4 py-3 bg-white/80 border border-slate-200/60 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-slate-400 transition-all duration-300" />
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
                                    <div class="flex flex-col sm:flex-row gap-3">
                                        <div class="w-full sm:w-auto">
                                            <CountryCodeSelector v-model="employerForm.countryCode" />
                                        </div>
                                        <input v-model="employerForm.phone" type="tel" placeholder="Business phone number"
                                            class="w-full px-4 py-3 bg-white/80 border border-slate-200/60 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-slate-400 transition-all duration-300"
                                            required />
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-slate-700 mb-3">What are you looking for? *</label>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <label v-for="option in employerOptions" :key="option.value"
                                            class="flex items-start p-4 bg-white/70 border border-slate-200/60 rounded-2xl hover:bg-white transition-all duration-300 cursor-pointer">
                                            <input v-model="employerForm.employerDetails" :value="option.value" type="checkbox"
                                                class="w-4 h-4 text-orange-600 border-slate-300 rounded focus:ring-orange-500 mr-3 mt-1" />
                                            <div>
                                                <span class="text-sm font-medium text-slate-900">{{ option.label }}</span>
                                                <p class="text-xs text-slate-500 mt-1">{{ option.description }}</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-slate-700 mb-2">Business Needs Description *</label>
                                    <textarea v-model="employerForm.description" rows="6"
                                        placeholder="Describe your hiring needs, company culture, or advertising requirements. Include details such as:&#10;- Roles you're looking to fill&#10;- Required skills and experience&#10;- Company size and industry&#10;- Hiring timeline&#10;- Budget considerations&#10;- Any specific requirements"
                                        class="w-full px-4 py-3 bg-white/80 border border-slate-200/60 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-slate-400 resize-none transition-all duration-300"
                                        required></textarea>
                                    <p class="text-xs text-slate-500 mt-2">The more details you provide, the better we can match you with qualified candidates</p>
                                </div>

                                <div class="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-slate-200/60">
                                    <p class="text-xs text-slate-500 mb-4 sm:mb-0">
                                        * Required fields. We'll use this information to connect you with the right talent.
                                    </p>
                                    <button type="submit" :disabled="isSubmitting"
                                        class="relative px-8 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-2xl font-medium hover:shadow-lg hover:scale-105 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300">
                                        <div class="absolute inset-0 bg-gradient-to-r from-orange-700 to-amber-700 opacity-0 hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
                                        <span class="relative z-10 flex items-center justify-center">
                                            <span v-if="isSubmitting" class="flex items-center justify-center">
                                                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Submitting...
                                            </span>
                                            <span v-else>Complete Registration</span>
                                        </span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup>
import { API_ROUTES } from '~/shared/constants/api-routes'
import { useAuthStore } from '~/features/auth/stores/auth.store'
import Sidebar from '@/features/dashboard/components/dashboard-sidebar.vue'
import CountryCodeSelector from '~/shared/components/ui/country-code-selector.vue'
import MessagePopup from '~/shared/components/message/MessagePopup.vue'

const alertRef = ref(null)
const authStore = useAuthStore()

// User state
const user = computed(() => authStore.getUser || {})
const userInitials = computed(() => {
    const name = user.value?.name || 'User'
    return name.charAt(0).toUpperCase()
})
const displayName = computed(() => user.value?.name || 'User')

// Profile menu state
const profileMenuOpen = ref(false)
const showTipsModal = ref(false)

// Form options with descriptions
const employerOptions = [
    { 
        value: 'AI Screener', 
        label: 'AI Candidate Screener', 
        description: 'Automatically screen and rank job applicants'
    },
    { 
        value: 'Candidate Matcher', 
        label: 'Smart Candidate Matching', 
        description: 'Find candidates that fit your specific requirements'
    },
    { 
        value: 'Always-On Recruiter', 
        label: 'Always-On Recruiter', 
        description: '24/7 AI-powered recruitment assistance'
    },
    { 
        value: 'Advertise My Business', 
        label: 'Business Advertising', 
        description: 'Promote your company and attract talent'
    }
]

// Form data
const employerForm = ref({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    url: '',
    countryCode: '+233',
    employerDetails: [],
    description: ''
})

const isSubmitting = ref(false)

// Submit function
const submitEmployerForm = async () => {
    isSubmitting.value = true
    
    try {
        const payload = {
            userType: 'employer',
            name: employerForm.value.name,
            companyName: employerForm.value.companyName,
            email: employerForm.value.email,
            phone: employerForm.value.countryCode + employerForm.value.phone,
            url: employerForm.value.url,
            employerDetails: employerForm.value.employerDetails,
            description: employerForm.value.description
        }

        const response = await $fetch(API_ROUTES.REGISTER_ON_PAGE, {
            method: 'POST',
            body: payload,
            throw: false
        })

        if (response.success) {
            alertRef.value.success('Company profile completed successfully! We will connect you with qualified candidates.', {
                title: 'Welcome!',
                duration: 4000
            })
            resetEmployerForm()
            
            // Redirect to dashboard after success
            setTimeout(() => {
                navigateTo('/dashboard')
            }, 2000)
        } else {
            alertRef.value.error(response.message || 'Registration failed', {
                title: 'Error',
                duration: 0
            })
        }

    } catch (error) {
        console.error('Employer registration error:', error)
        
        let errorMessage = 'Registration failed. Please try again.'
        let errorTitle = 'Error'
        
        if (error.response?.status === 409 || error.statusCode === 409) {
            errorMessage = 'An account with this email already exists. Please use a different email.'
            errorTitle = 'Account Already Exists'
        }
        
        const serverMessage = error.data?.message || error.response?.data?.message
        if (serverMessage) {
            errorMessage = serverMessage
        }
        
        alertRef.value.error(errorMessage, {
            title: errorTitle,
            duration: 0
        })
    } finally {
        isSubmitting.value = false
    }
}

// Reset function
const resetEmployerForm = () => {
    employerForm.value = {
        name: '',
        companyName: '',
        email: '',
        phone: '',
        url: '',
        countryCode: '+233',
        employerDetails: [],
        description: ''
    }
}

// Profile actions
const editProfile = () => {
    profileMenuOpen.value = false
    navigateTo('/dashboard/profile')
}

const handleLogout = () => {
    profileMenuOpen.value = false
    authStore.logout()
    navigateTo('/auth/login')
}

// Lifecycle
onMounted(async () => {
    if (!authStore.isAuthenticated) {
        navigateTo('/auth/login')
        return
    }
})

// Set page title
useHead({
    title: 'Employer Registration - QWESI AI'
})
</script>

<style scoped>
/* Base Layout */
.dashboard-container {
    @apply min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex;
    position: relative;
    overflow-x: hidden;
    height: 100vh; /* Ensure full viewport height */
}

.main-content {
    @apply flex-1 flex flex-col;
    min-width: 0;
    height: 100vh; /* Full height */
    overflow-y: auto; /* Enable vertical scrolling */
    overflow-x: hidden; /* Prevent horizontal scroll */
}

.main-content-adjusted {
    margin-left: 320px;
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
    @apply bg-amber-400 top-6 right-12;
    animation-delay: 4s;
}

/* Header Actions */
.header-actions {
    @apply flex items-center space-x-3;
}

.action-btn {
    @apply relative px-4 py-2 rounded-2xl font-medium text-sm transition-all duration-300;
    @apply hover:scale-105 hover:shadow-lg;
    backdrop-filter: blur(12px);
}

.btn-bg {
    @apply absolute inset-0 rounded-2xl transition-all duration-300;
}

.tips-btn .btn-bg {
    @apply bg-gradient-to-r from-slate-100/80 to-slate-200/60;
}

.referral-btn .btn-bg {
    @apply bg-gradient-to-r from-blue-100/80 to-purple-100/60;
}

.btn-content {
    @apply relative z-10 flex items-center space-x-2;
}

.btn-icon {
    @apply w-4 h-4;
}

.tips-btn {
    @apply text-slate-700 hover:text-slate-900;
}

.referral-btn {
    @apply text-blue-700 hover:text-blue-900;
}

.points-badge {
    @apply bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs px-2 py-1 rounded-full font-bold;
    @apply shadow-lg shadow-emerald-500/25;
}

/* Profile Dropdown */
.profile-dropdown {
    @apply relative;
}

.profile-btn {
    @apply flex items-center space-x-3 p-2 rounded-2xl hover:bg-slate-100/70 transition-all duration-300;
}

.profile-avatar {
    @apply relative w-10 h-10;
}

.avatar-image {
    @apply w-10 h-10 rounded-2xl overflow-hidden border-2 border-slate-200;
}

.avatar-image img {
    @apply w-full h-full object-cover;
}

.avatar-initials {
    @apply w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl;
    @apply flex items-center justify-center text-white font-bold text-sm;
    @apply shadow-lg shadow-blue-500/25;
}

.avatar-ring {
    @apply absolute -inset-1 rounded-2xl border-2 border-blue-400/30 opacity-0;
    @apply transition-opacity duration-300;
}

.profile-btn:hover .avatar-ring {
    @apply opacity-100;
}

.dropdown-arrow {
    @apply w-4 h-4 text-slate-400 transition-transform duration-300;
}

.profile-btn:hover .dropdown-arrow {
    @apply rotate-180;
}

.profile-menu {
    @apply absolute right-0 mt-2 w-48 rounded-2xl overflow-hidden z-10;
}

.menu-backdrop {
    @apply absolute inset-0 bg-white/95 border border-slate-200/60;
    backdrop-filter: blur(20px);
    border-radius: inherit;
}

.menu-content {
    @apply relative z-10 py-2;
}

.menu-item {
    @apply w-full text-left px-4 py-3 text-sm font-medium text-slate-700;
    @apply hover:bg-slate-100/70 transition-colors duration-200 flex items-center space-x-3;
}

.menu-icon {
    @apply w-4 h-4;
}

.logout-item {
    @apply text-red-600 hover:text-red-700 hover:bg-red-50/70;
}

.menu-divider {
    @apply border-t border-slate-200/60 my-1;
}

/* Main Dashboard Content */
.dashboard-main {
    @apply flex-1 p-6 flex flex-col space-y-8;
    min-height: 0; /* Allow shrinking */
    overflow-y: auto; /* Enable scrolling within main content */
    padding-bottom: 2rem; /* Add bottom padding for scroll end */
}

/* Enhanced Banners */
.onboarding-banner {
    @apply relative rounded-3xl overflow-hidden;
    backdrop-filter: blur(20px);
}

.banner-backdrop {
    @apply absolute inset-0 bg-gradient-to-r from-orange-600/95 via-amber-600/90 to-yellow-600/95;
}

.banner-content {
    @apply relative z-10 p-8 text-white;
}

.banner-main {
    @apply flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6;
}

.banner-icon {
    @apply w-12 h-12 text-blue-100;
    animation: pulse 2s ease-in-out infinite;
}

.banner-title {
    @apply text-xl font-bold;
}

.banner-description {
    @apply text-orange-100;
}

.banner-actions {
    @apply flex flex-wrap gap-3;
}

.banner-btn {
    @apply px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300;
    @apply hover:scale-105 hover:shadow-lg;
}

.banner-btn.primary {
    @apply bg-white text-orange-600 hover:bg-orange-50;
}

.banner-btn.secondary {
    @apply bg-orange-500/70 text-white hover:bg-orange-400/70;
}

.banner-close {
    @apply absolute top-4 right-4 p-2 text-orange-200 hover:text-white transition-colors;
    @apply rounded-xl hover:bg-white/10;
}

/* Animations */
@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-6px); }
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
}

@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
}

/* Responsive Design */
@media (max-width: 640px) {
    .dashboard-title {
        @apply text-xl;
    }
    
    .main-content-adjusted {
        margin-left: 0;
    }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
    .floating-orb {
        animation: none;
    }
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
</style>