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
                            <h1 class="dashboard-title">Investor Registration</h1>
                            <p class="welcome-message">Connect with investment opportunities or showcase your offerings</p>
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
                                <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mr-4 flex-shrink-0">
                                    <svg class="banner-icon" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 class="banner-title">Investment Opportunities Await!</h2>
                                    <p class="banner-description">
                                        Whether you're an investor seeking opportunities or an entrepreneur looking for funding, 
                                        complete your profile to connect with the right partners and grow your network.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Registration Form -->
                    <div class="relative rounded-3xl overflow-hidden">
                        <div class="absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-green-50/80 border border-white/60 backdrop-blur-xl"></div>
                        <div class="relative z-10 p-8">
                            <h3 class="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent mb-6">Investment Profile</h3>

                            <form @submit.prevent="submitInvestorForm" class="space-y-6">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label class="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                                        <input v-model="investorForm.name" type="text" placeholder="Enter your full name"
                                            class="w-full px-4 py-3 bg-white/80 border border-slate-200/60 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-slate-400 transition-all duration-300"
                                            required />
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-slate-700 mb-2">Contact Email *</label>
                                        <input v-model="investorForm.email" type="email" placeholder="your.email@example.com"
                                            class="w-full px-4 py-3 bg-white/80 border border-slate-200/60 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-slate-400 transition-all duration-300"
                                            required />
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
                                    <div class="flex flex-col sm:flex-row gap-3">
                                        <div class="w-full sm:w-auto">
                                            <CountryCodeSelector v-model="investorForm.countryCode" />
                                        </div>
                                        <input v-model="investorForm.phone" type="tel" placeholder="Your phone number"
                                            class="w-full px-4 py-3 bg-white/80 border border-slate-200/60 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-slate-400 transition-all duration-300"
                                            required />
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-slate-700 mb-3">What describes you? *</label>
                                    <div class="grid grid-cols-1 gap-3">
                                        <label v-for="option in investorOptions" :key="option.value"
                                            class="flex items-start p-4 bg-white/70 border border-slate-200/60 rounded-2xl hover:bg-white transition-all duration-300 cursor-pointer">
                                            <input v-model="investorForm.investorDetails" :value="option.value" type="checkbox"
                                                class="w-4 h-4 text-green-600 border-slate-300 rounded focus:ring-green-500 mr-3 mt-1" />
                                            <div>
                                                <span class="text-sm font-medium text-slate-900">{{ option.label }}</span>
                                                <p class="text-xs text-slate-500 mt-1">{{ option.description }}</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-slate-700 mb-2">Investment Details *</label>
                                    <textarea v-model="investorForm.description" rows="6"
                                        placeholder="Describe your investment interests, opportunities, or what you're looking for. Include details such as:&#10;- Investment sectors or industries of interest&#10;- Investment range or funding amount&#10;- Stage preferences (seed, series A, etc.)&#10;- Geographic focus&#10;- Any specific requirements or criteria"
                                        class="w-full px-4 py-3 bg-white/80 border border-slate-200/60 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-slate-400 resize-none transition-all duration-300"
                                        required></textarea>
                                    <p class="text-xs text-slate-500 mt-2">Be specific to help us match you with the right opportunities or partners</p>
                                </div>

                                <div class="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-slate-200/60">
                                    <p class="text-xs text-slate-500 mb-4 sm:mb-0">
                                        * Required fields. Your information will be kept confidential and used only for matching purposes.
                                    </p>
                                    <button type="submit" :disabled="isSubmitting"
                                        class="relative px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-medium hover:shadow-lg hover:scale-105 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300">
                                        <div class="absolute inset-0 bg-gradient-to-r from-green-700 to-emerald-700 opacity-0 hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
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
const investorOptions = [
    { 
        value: 'I am an investor', 
        label: 'I am an investor', 
        description: 'Looking for investment opportunities and startups to fund'
    },
    { 
        value: 'I\'m looking for investors', 
        label: 'I\'m seeking investors', 
        description: 'Entrepreneur or startup founder looking for funding and investment partners'
    }
]

// Form data
const investorForm = ref({
    name: '',
    phone: '',
    countryCode: '+233',
    email: '',
    investorDetails: [],
    description: ''
})

const isSubmitting = ref(false)

// Submit function
const submitInvestorForm = async () => {
    isSubmitting.value = true
    
    try {
        const payload = {
            userType: 'investor',
            name: investorForm.value.name,
            phone: investorForm.value.countryCode + investorForm.value.phone,
            email: investorForm.value.email,
            investorDetails: investorForm.value.investorDetails,
            description: investorForm.value.description
        }

        const response = await $fetch(API_ROUTES.REGISTER_ON_PAGE, {
            method: 'POST',
            body: payload,
            throw: false
        })

        if (response.success) {
            alertRef.value.success('Investment profile completed successfully! We will connect you with relevant opportunities.', {
                title: 'Welcome!',
                duration: 4000
            })
            resetInvestorForm()
            
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
        console.error('Investor registration error:', error)
        
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
const resetInvestorForm = () => {
    investorForm.value = {
        name: '',
        phone: '',
        countryCode: '+233',
        email: '',
        investorDetails: [],
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
    title: 'Investor Registration - QWESI AI'
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
    @apply bg-emerald-400 top-6 right-12;
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
    @apply relative z-50;
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
    @apply absolute inset-0 bg-gradient-to-r from-indigo-600/95 via-purple-600/90 to-blue-600/95;
}

.banner-content {
    @apply relative z-10 p-8 text-white;
}

.banner-main {
    @apply flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6;
}

.banner-icon {
    @apply w-12 h-12 text-yellow-300;
    animation: pulse 2s ease-in-out infinite;
}

.banner-title {
    @apply text-xl font-bold;
}

.banner-description {
    @apply text-indigo-100;
}

.banner-actions {
    @apply flex flex-wrap gap-3;
}

.banner-btn {
    @apply px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300;
    @apply hover:scale-105 hover:shadow-lg;
}

.banner-btn.primary {
    @apply bg-white text-indigo-600 hover:bg-indigo-50;
}

.banner-btn.secondary {
    @apply bg-indigo-500/70 text-white hover:bg-indigo-400/70;
}

.banner-close {
    @apply absolute top-4 right-4 p-2 text-indigo-200 hover:text-white transition-colors;
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