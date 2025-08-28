<template>
    <div class="dashboard-container">
        <!-- Sidebar -->
        <Sidebar :user="user" />

        <!-- Main Content -->
        <div class="main-content">
            <!-- Ultra-Modern Header -->
            <header class="modern-header">
                <div class="header-backdrop"></div>
                
                <!-- Floating Decorations -->
                <div class="header-decorations">
                    <div class="floating-orb orb-1"></div>
                    <div class="floating-orb orb-2"></div>
                    <div class="floating-orb orb-3"></div>
                </div>
                
                <div class="header-content">
                    <div class="header-info">
                        <div class="welcome-section">
                            <h1 class="dashboard-title">Job Seeker Registration</h1>
                            <p class="welcome-message">
                                Get personalized career guidance and 
                                <span class="user-highlight">job opportunities</span>
                            </p>
                        </div>
                    </div>

                    <!-- Header Actions -->
                    <div class="header-actions">
                        <!-- Tips Button -->
                        <button @click="showTipsModal = true" class="action-btn tips-btn">
                            <div class="btn-bg"></div>
                            <div class="btn-content">
                                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Tips</span>
                            </div>
                        </button>

                        <!-- Back Button -->
                        <NuxtLink to="/dashboard/get-started" class="action-btn referral-btn">
                            <div class="btn-bg"></div>
                            <div class="btn-content">
                                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                          d="M10 19l-7-7m0 0l7-7m-7 7h18" />
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
                                        {{ userInitials }}
                                    </div>
                                    <div class="avatar-ring"></div>
                                </div>
                                <span class="text-sm font-medium text-slate-700 hidden sm:block">{{ displayName }}</span>
                                <svg class="dropdown-arrow" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clip-rule="evenodd" />
                                </svg>
                            </button>

                            <!-- Profile Menu -->
                            <div v-if="profileMenuOpen" class="profile-menu">
                                <div class="menu-backdrop"></div>
                                <div class="menu-content">
                                    <button @click="editProfile" class="menu-item">
                                        <svg class="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span>Edit Profile</span>
                                    </button>
                                    <div class="menu-divider"></div>
                                    <button @click="handleLogout" class="menu-item logout-item">
                                        <svg class="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Message Popup -->
            <MessagePopup ref="alertRef" />

            <!-- Main Dashboard Content -->
            <main class="dashboard-main">
                <div class="max-w-5xl mx-auto w-full space-y-8">
                    <!-- Enhanced Welcome Banner -->
                    <div class="onboarding-banner">
                        <div class="banner-backdrop"></div>
                        <div class="banner-content">
                            <div class="banner-main">
                                <div class="flex items-center space-x-4">
                                    <div class="w-12 h-12 bg-yellow-400/20 rounded-2xl flex items-center justify-center">
                                        <svg class="banner-icon" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 class="banner-title">Welcome, Future Success Story!</h2>
                                        <p class="banner-description mt-2 leading-relaxed">
                                            Complete your profile to unlock AI-powered career coaching, personalized job matching, 
                                            and interview preparation tailored to your unique skills and aspirations.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Registration Form -->
                    <div class="form-container p-8">
                        <div class="mb-8">
                            <div class="section-header">
                                <h3 class="section-title">Complete Your Profile</h3>
                                <div class="section-decorator"></div>
                            </div>
                            <p class="text-slate-600 mt-2">Help us understand your career goals and skills to provide personalized recommendations</p>
                        </div>

                        <form @submit.prevent="submitSeekerForm" class="space-y-8">
                            <!-- Personal Information Section -->
                            <div class="space-y-6">
                                <h4 class="text-lg font-semibold text-slate-800 flex items-center space-x-2">
                                    <div class="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <span>Personal Information</span>
                                </h4>

                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div class="space-y-2">
                                        <label class="block text-sm font-semibold text-slate-700">Full Name *</label>
                                        <input 
                                            v-model="seekerForm.name" 
                                            type="text" 
                                            placeholder="Enter your full name"
                                            class="form-field w-full px-4 py-3 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 backdrop-blur-sm"
                                            required 
                                        />
                                    </div>

                                    <div class="space-y-2">
                                        <label class="block text-sm font-semibold text-slate-700">Email Address *</label>
                                        <input 
                                            v-model="seekerForm.email" 
                                            type="email" 
                                            placeholder="your.email@example.com"
                                            class="form-field w-full px-4 py-3 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 backdrop-blur-sm"
                                            required 
                                        />
                                    </div>
                                </div>

                                <div class="space-y-2">
                                    <label class="block text-sm font-semibold text-slate-700">Phone Number *</label>
                                    <div class="flex flex-col sm:flex-row gap-3">
                                        <div class="w-full sm:w-auto">
                                            <CountryCodeSelector v-model="seekerForm.countryCode" />
                                        </div>
                                        <input 
                                            v-model="seekerForm.phone" 
                                            type="tel" 
                                            placeholder="Your phone number"
                                            class="form-field flex-1 px-4 py-3 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 backdrop-blur-sm"
                                            required 
                                        />
                                    </div>
                                </div>
                            </div>

                            <!-- Professional Information Section -->
                            <div class="space-y-6">
                                <h4 class="text-lg font-semibold text-slate-800 flex items-center space-x-2">
                                    <div class="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center">
                                        <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                                        </svg>
                                    </div>
                                    <span>Professional Background</span>
                                </h4>

                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div class="space-y-2">
                                        <label class="block text-sm font-semibold text-slate-700">Skills *</label>
                                        <input 
                                            v-model="seekerForm.skills" 
                                            type="text"
                                            placeholder="e.g., JavaScript, Project Management, Marketing"
                                            class="form-field w-full px-4 py-3 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 backdrop-blur-sm"
                                            required 
                                        />
                                        <p class="text-xs text-slate-500">Separate multiple skills with commas</p>
                                    </div>

                                    <div class="space-y-2">
                                        <label class="block text-sm font-semibold text-slate-700">Experience *</label>
                                        <input 
                                            v-model="seekerForm.experience" 
                                            type="text"
                                            placeholder="e.g., 3 years as Software Developer"
                                            class="form-field w-full px-4 py-3 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 backdrop-blur-sm"
                                            required 
                                        />
                                    </div>
                                </div>
                            </div>

                            <!-- Help Needed Section -->
                            <div class="space-y-6">
                                <h4 class="text-lg font-semibold text-slate-800 flex items-center space-x-2">
                                    <div class="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <span>What help do you need? *</span>
                                </h4>

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div v-for="option in seekerOptions" :key="option.value"
                                        class="checkbox-card"
                                        :class="{ 'checked': seekerForm.seekerDetails.includes(option.value) }">
                                        <label class="flex items-start p-4 border-2 border-slate-200 rounded-2xl hover:bg-slate-50/70 cursor-pointer transition-all">
                                            <input 
                                                v-model="seekerForm.seekerDetails" 
                                                :value="option.value" 
                                                type="checkbox"
                                                class="w-5 h-5 text-blue-600 border-slate-300 rounded-lg focus:ring-blue-500 mt-0.5 mr-4 flex-shrink-0" 
                                            />
                                            <div>
                                                <span class="text-sm font-semibold text-slate-900">{{ option.label }}</span>
                                                <p class="text-xs text-slate-600 mt-1 leading-relaxed">{{ option.description }}</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <!-- Career Goals Section -->
                            <div class="space-y-6">
                                <h4 class="text-lg font-semibold text-slate-800 flex items-center space-x-2">
                                    <div class="w-6 h-6 bg-amber-100 rounded-lg flex items-center justify-center">
                                        <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                        </svg>
                                    </div>
                                    <span>Career Goals</span>
                                    <span class="text-sm text-slate-500 font-normal">(Optional)</span>
                                </h4>

                                <div class="space-y-2">
                                    <textarea 
                                        v-model="seekerForm.goals" 
                                        rows="5"
                                        placeholder="Tell us about your career aspirations, preferred industries, job types, or any specific goals you'd like to achieve. This helps us provide more personalized recommendations..."
                                        class="form-field w-full px-4 py-3 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-white/70 backdrop-blur-sm"
                                    ></textarea>
                                </div>
                            </div>

                            <!-- Submit Section -->
                            <div class="border-t border-slate-200 pt-8">
                                <div class="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                                    <p class="text-sm text-slate-500">
                                        <span class="text-red-500">*</span> Required fields. We'll use this information to provide personalized recommendations.
                                    </p>
                                    <div class="relative">
                                        <button 
                                            type="submit" 
                                            :disabled="isSubmitting"
                                            class="submit-btn px-8 py-3 text-white rounded-2xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2"
                                        >
                                            <div v-if="isSubmitting" class="loading-overlay rounded-2xl">
                                                <div class="flex items-center space-x-2">
                                                    <svg class="animate-spin w-5 h-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    <span class="text-blue-600 font-semibold">Submitting...</span>
                                                </div>
                                            </div>
                                            <span v-if="!isSubmitting">✨ Complete Registration</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    <!-- Additional Info Cards -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <div class="quick-action-card bg-gradient-to-br from-blue-50 to-blue-100/50">
                            <div class="card-bg bg-gradient-to-br from-blue-50/80 to-blue-100/60"></div>
                            <div class="card-glow bg-gradient-to-br from-blue-400 to-blue-600"></div>
                            <div class="card-content">
                                <div class="card-icon bg-gradient-to-br from-blue-500 to-blue-600">
                                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div class="text-center">
                                    <h3 class="card-label">AI-Powered Matching</h3>
                                    <p class="text-xs text-slate-600 mt-1">Get matched with jobs that fit your skills</p>
                                </div>
                            </div>
                        </div>

                        <div class="quick-action-card bg-gradient-to-br from-emerald-50 to-emerald-100/50">
                            <div class="card-bg bg-gradient-to-br from-emerald-50/80 to-emerald-100/60"></div>
                            <div class="card-glow bg-gradient-to-br from-emerald-400 to-emerald-600"></div>
                            <div class="card-content">
                                <div class="card-icon bg-gradient-to-br from-emerald-500 to-emerald-600">
                                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <div class="text-center">
                                    <h3 class="card-label">Interview Coaching</h3>
                                    <p class="text-xs text-slate-600 mt-1">Practice with AI interview preparation</p>
                                </div>
                            </div>
                        </div>

                        <div class="quick-action-card bg-gradient-to-br from-purple-50 to-purple-100/50">
                            <div class="card-bg bg-gradient-to-br from-purple-50/80 to-purple-100/60"></div>
                            <div class="card-glow bg-gradient-to-br from-purple-400 to-purple-600"></div>
                            <div class="card-content">
                                <div class="card-icon bg-gradient-to-br from-purple-500 to-purple-600">
                                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                </div>
                                <div class="text-center">
                                    <h3 class="card-label">Career Guidance</h3>
                                    <p class="text-xs text-slate-600 mt-1">Receive personalized career advice</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <!-- Tips Modal -->
    <div v-if="showTipsModal" class="modal-overlay" @click="showTipsModal = false">
        <div class="tips-modal" @click.stop>
            <div class="modal-header">
                <div class="modal-title-section">
                    <h3 class="modal-title">Registration Tips</h3>
                    <div class="title-decoration"></div>
                </div>
                <button @click="showTipsModal = false" class="modal-close">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div class="p-6 space-y-4">
                <div class="space-y-3">
                    <div class="flex items-start space-x-3">
                        <div class="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mt-0.5">
                            <span class="text-blue-600 font-bold text-xs">1</span>
                        </div>
                        <div>
                            <h4 class="font-semibold text-slate-900">Be Specific with Skills</h4>
                            <p class="text-sm text-slate-600">List both technical and soft skills. Include specific tools, technologies, or methodologies you're familiar with.</p>
                        </div>
                    </div>
                    <div class="flex items-start space-x-3">
                        <div class="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center mt-0.5">
                            <span class="text-emerald-600 font-bold text-xs">2</span>
                        </div>
                        <div>
                            <h4 class="font-semibold text-slate-900">Describe Your Experience</h4>
                            <p class="text-sm text-slate-600">Include your years of experience and specific roles or projects that showcase your expertise.</p>
                        </div>
                    </div>
                    <div class="flex items-start space-x-3">
                        <div class="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center mt-0.5">
                            <span class="text-purple-600 font-bold text-xs">3</span>
                        </div>
                        <div>
                            <h4 class="font-semibold text-slate-900">Set Clear Goals</h4>
                            <p class="text-sm text-slate-600">The more detailed your career goals, the better we can match you with relevant opportunities and guidance.</p>
                        </div>
                    </div>
                </div>
            </div>
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

// UI State
const profileMenuOpen = ref(false)
const showTipsModal = ref(false)

// Form options with enhanced descriptions
const seekerOptions = [
    { 
        value: 'AI Coach (Interview Prep)', 
        label: 'AI Interview Coach', 
        description: 'Practice mock interviews with personalized AI feedback and improvement tips'
    },
    { 
        value: 'Resume Builder', 
        label: 'Resume Builder', 
        description: 'Create and optimize your resume with AI-powered suggestions and templates'
    },
    { 
        value: 'Career Navigator', 
        label: 'Career Navigator', 
        description: 'Get personalized career path guidance and industry insights'
    },
    { 
        value: 'Confidence Booster', 
        label: 'Confidence Booster', 
        description: 'Build confidence through targeted coaching and skill development'
    }
]

// Form data
const seekerForm = ref({
    name: '',
    phone: '',
    countryCode: '+233',
    email: '',
    skills: '',
    experience: '',
    seekerDetails: [],
    goals: ''
})

const isSubmitting = ref(false)

// Form validation
const isFormValid = computed(() => {
    return seekerForm.value.name.trim() !== '' &&
           seekerForm.value.email.trim() !== '' &&
           seekerForm.value.phone.trim() !== '' &&
           seekerForm.value.skills.trim() !== '' &&
           seekerForm.value.experience.trim() !== '' &&
           seekerForm.value.seekerDetails.length > 0
})

// Submit function with enhanced error handling
const submitSeekerForm = async () => {
    if (!isFormValid.value) {
        alertRef.value?.error('Please fill in all required fields', {
            title: 'Incomplete Form',
            duration: 4000
        })
        return
    }

    isSubmitting.value = true
    
    try {
        const payload = {
            userType: 'seeker',
            name: seekerForm.value.name.trim(),
            phone: seekerForm.value.countryCode + seekerForm.value.phone.trim(),
            email: seekerForm.value.email.trim().toLowerCase(),
            skills: seekerForm.value.skills.trim(),
            experience: seekerForm.value.experience.trim(),
            seekerDetails: seekerForm.value.seekerDetails,
            goals: seekerForm.value.goals.trim()
        }

        const response = await $fetch(API_ROUTES.REGISTER_ON_PAGE, {
            method: 'POST',
            body: payload,
            throw: false
        })

        if (response.success) {
            alertRef.value?.success('🎉 Registration completed successfully! Welcome to QWESI AI.', {
                title: 'Welcome Aboard!',
                duration: 5000
            })
            resetSeekerForm()
            
            // Redirect to dashboard after success
            setTimeout(() => {
                navigateTo('/dashboard')
            }, 2500)
        } else {
            alertRef.value?.error(response.message || 'Registration failed. Please try again.', {
                title: 'Registration Error',
                duration: 6000
            })
        }

    } catch (error) {
        console.error('Registration error:', error)
        
        let errorMessage = 'Registration failed. Please check your information and try again.'
        let errorTitle = 'Registration Error'
        
        if (error.response?.status === 409 || error.statusCode === 409) {
            errorMessage = 'An account with this email already exists. Please use a different email address or try logging in.'
            errorTitle = 'Account Already Exists'
        } else if (error.response?.status === 400 || error.statusCode === 400) {
            errorMessage = 'Invalid information provided. Please check your entries and try again.'
            errorTitle = 'Invalid Information'
        }
        
        const serverMessage = error.data?.message || error.response?.data?.message
        if (serverMessage) {
            errorMessage = serverMessage
        }
        
        alertRef.value?.error(errorMessage, {
            title: errorTitle,
            duration: 8000
        })
    } finally {
        isSubmitting.value = false
    }
}

// Reset function
const resetSeekerForm = () => {
    seekerForm.value = {
        name: '',
        phone: '',
        countryCode: '+233',
        email: '',
        skills: '',
        experience: '',
        seekerDetails: [],
        goals: ''
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

// Click outside handler for modals
const handleClickOutside = (event) => {
    if (!event.target.closest('.profile-dropdown')) {
        profileMenuOpen.value = false
    }
}

// Lifecycle hooks
onMounted(async () => {
    if (!authStore.isAuthenticated) {
        navigateTo('/auth/login')
        return
    }
    
    // Add click outside listener
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})

// Set page metadata
useHead({
    title: 'Job Seeker Registration - QWESI AI',
    meta: [
        {
            name: 'description',
            content: 'Complete your job seeker profile to receive personalized career guidance, AI-powered interview coaching, and tailored job opportunities with QWESI AI.'
        }
    ]
})
</script>

<style scoped>
/* Import all the modern dashboard styles from your CSS file */

/* Base Layout */
.dashboard-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #dbeafe 100%);
    display: flex;
    position: relative;
    overflow-x: hidden;
    height: 100vh;
}

.main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
}

/* Ultra-Modern Header */
.modern-header {
    position: relative;
    border-bottom: 1px solid rgba(148, 163, 184, 0.3);
    backdrop-filter: blur(20px);
}

.header-backdrop {
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 50%, rgba(219, 234, 254, 0.8) 100%);
}

.header-content {
    position: relative;
    z-index: 10;
    padding: 1rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

@media (min-width: 640px) {
    .header-content {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 0;
    }
}

.dashboard-title {
    font-size: 1.5rem;
    font-weight: 900;
    background: linear-gradient(90deg, #1e293b 0%, #1e40af 50%, #7c3aed 100%);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    font-variant: small-caps;
    letter-spacing: -0.025em;
}

@media (min-width: 640px) {
    .dashboard-title {
        font-size: 2rem;
    }
}

.welcome-message {
    font-size: 0.875rem;
    font-weight: 500;
    color: #64748b;
    margin-top: 0.25rem;
}

.user-highlight {
    font-weight: 700;
    background: linear-gradient(90deg, #2563eb 0%, #7c3aed 100%);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
}

.header-decorations {
    position: absolute;
    inset: -1rem;
    pointer-events: none;
}

.floating-orb {
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    opacity: 0.2;
    animation: float 6s ease-in-out infinite;
}

.orb-1 {
    background: #60a5fa;
    top: 0.5rem;
    right: 2rem;
    animation-delay: 0s;
}

.orb-2 {
    background: #a78bfa;
    top: 2rem;
    right: 1rem;
    animation-delay: 2s;
}

.orb-3 {
    background: #34d399;
    top: 1.5rem;
    right: 3rem;
    animation-delay: 4s;
}

/* Header Actions */
.header-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.action-btn {
    position: relative;
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    font-weight: 500;
    font-size: 0.875rem;
    transition: all 0.3s ease;
    backdrop-filter: blur(12px);
}

.action-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

.btn-bg {
    position: absolute;
    inset: 0;
    border-radius: 1rem;
    transition: all 0.3s ease;
}

.tips-btn .btn-bg {
    background: linear-gradient(90deg, rgba(148, 163, 184, 0.1) 0%, rgba(203, 213, 225, 0.6) 100%);
}

.referral-btn .btn-bg {
    background: linear-gradient(90deg, rgba(219, 234, 254, 0.8) 0%, rgba(196, 181, 253, 0.6) 100%);
}

.btn-content {
    position: relative;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.btn-icon {
    width: 1rem;
    height: 1rem;
}

.tips-btn {
    color: #374151;
}

.tips-btn:hover {
    color: #1f2937;
}

.referral-btn {
    color: #1d4ed8;
}

.referral-btn:hover {
    color: #1e40af;
}

/* Profile Dropdown */
.profile-dropdown {
    position: relative;
}

.profile-btn {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem;
    border-radius: 1rem;
    transition: all 0.3s ease;
}

.profile-btn:hover {
    background: rgba(148, 163, 184, 0.1);
}

.profile-avatar {
    position: relative;
    width: 2.5rem;
    height: 2.5rem;
}

.avatar-image {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 1rem;
    overflow: hidden;
    border: 2px solid #e2e8f0;
}

.avatar-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.avatar-initials {
    width: 2.5rem;
    height: 2.5rem;
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 0.875rem;
    box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.25);
}

.avatar-ring {
    position: absolute;
    inset: -4px;
    border-radius: 1rem;
    border: 2px solid rgba(96, 165, 250, 0.3);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.profile-btn:hover .avatar-ring {
    opacity: 1;
}

.dropdown-arrow {
    width: 1rem;
    height: 1rem;
    color: #9ca3af;
    transition: transform 0.3s ease;
}

.profile-btn:hover .dropdown-arrow {
    transform: rotate(180deg);
}

.profile-menu {
    position: absolute;
    right: 0;
    margin-top: 0.5rem;
    width: 12rem;
    border-radius: 1rem;
    overflow: hidden;
    z-index: 10;
}

.menu-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid rgba(148, 163, 184, 0.3);
    backdrop-filter: blur(20px);
    border-radius: inherit;
}

.menu-content {
    position: relative;
    z-index: 10;
    padding: 0.5rem 0;
}

.menu-item {
    width: 100%;
    text-align: left;
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.menu-item:hover {
    background: rgba(148, 163, 184, 0.1);
}

.menu-icon {
    width: 1rem;
    height: 1rem;
}

.logout-item {
    color: #dc2626;
}

.logout-item:hover {
    color: #b91c1c;
    background: rgba(220, 38, 38, 0.05);
}

.menu-divider {
    border-top: 1px solid rgba(148, 163, 184, 0.3);
    margin: 0.25rem 0;
}

/* Main Dashboard Content */
.dashboard-main {
    flex: 1;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    min-height: 0;
    overflow-y: auto;
    padding-bottom: 2rem;
}

/* Enhanced Banners */
.onboarding-banner {
    position: relative;
    border-radius: 1.5rem;
    overflow: hidden;
    backdrop-filter: blur(20px);
}

.banner-backdrop {
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, rgba(79, 70, 229, 0.95) 0%, rgba(139, 92, 246, 0.9) 50%, rgba(59, 130, 246, 0.95) 100%);
}

.banner-content {
    position: relative;
    z-index: 10;
    padding: 2rem;
    color: white;
}

.banner-main {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

@media (min-width: 640px) {
    .banner-main {
        flex-direction: row;
        align-items: center;
        gap: 1rem;
    }
}

.banner-icon {
    width: 3rem;
    height: 3rem;
    color: #fbbf24;
    animation: pulse 2s ease-in-out infinite;
}

.banner-title {
    font-size: 1.25rem;
    font-weight: 700;
}

.banner-description {
    color: #c7d2fe;
    line-height: 1.6;
}

/* Form Container */
.form-container {
    position: relative;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 1.5rem;
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.6);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
}

.section-header {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.section-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1e293b;
}

.section-decorator {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, #cbd5e1 0%, #60a5fa 50%, transparent 100%);
}

/* Form Fields */
.form-field {
    transition: all 0.3s ease;
    backdrop-filter: blur(8px);
}

.form-field:focus {
    transform: scale(1.01);
    box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1);
}

/* Checkbox Cards */
.checkbox-card {
    position: relative;
    transition: all 0.3s ease;
    border-radius: 1rem;
}

.checkbox-card:hover {
    background: rgba(249, 250, 251, 0.8);
    transform: translateY(-2px);
}

.checkbox-card.checked {
    background: rgba(59, 130, 246, 0.05);
    border-color: #3b82f6 !important;
}

/* Quick Action Cards */
.quick-action-card {
    position: relative;
    padding: 1.5rem;
    border-radius: 1.5rem;
    transition: all 0.3s ease;
    backdrop-filter: blur(20px);
}

.quick-action-card:hover {
    transform: translateY(-8px) scale(1.02);
}

.card-bg {
    position: absolute;
    inset: 0;
    border-radius: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.6);
}

.card-glow {
    position: absolute;
    inset: -1px;
    border-radius: 1.5rem;
    opacity: 0;
    transition: all 0.5s ease;
    filter: blur(8px);
}

.quick-action-card:hover .card-glow {
    opacity: 1;
}

.card-content {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
}

.card-icon {
    width: 3rem;
    height: 3rem;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
}

.quick-action-card:hover .card-icon {
    transform: scale(1.1) rotate(3deg);
}

.card-icon svg {
    width: 1.5rem;
    height: 1.5rem;
    color: white;
}

.card-label {
    font-size: 0.875rem;
    font-weight: 700;
    color: #374151;
}

/* Submit Button */
.submit-btn {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    transition: all 0.3s ease;
}

.submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 25px -5px rgba(59, 130, 246, 0.25), 0 8px 10px -6px rgba(59, 130, 246, 0.1);
}

.submit-btn:disabled {
    transform: none;
    box-shadow: none;
    opacity: 0.6;
}

/* Loading Overlay */
.loading-overlay {
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(4px);
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
}

/* Modal Styles */
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    z-index: 50;
    backdrop-filter: blur(8px);
}

.tips-modal {
    position: relative;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 1.5rem;
    max-width: 32rem;
    width: 100%;
    max-height: 90vh;
    overflow: hidden;
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2rem;
    border-bottom: 1px solid rgba(148, 163, 184, 0.3);
}

.modal-title-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.modal-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1e293b;
}

.title-decoration {
    width: 3rem;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);
    border-radius: 2px;
}

.modal-close {
    padding: 0.5rem;
    color: #9ca3af;
    border-radius: 0.75rem;
    transition: all 0.2s ease;
}

.modal-close:hover {
    color: #6b7280;
    background: rgba(148, 163, 184, 0.1);
}

/* Animations */
@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-6px); }
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
}

/* Custom Scrollbar */
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

/* Responsive Design */
@media (max-width: 640px) {
    .dashboard-title {
        font-size: 1.25rem;
    }
    
    .header-actions {
        gap: 0.5rem;
    }
    
    .action-btn {
        padding: 0.5rem 0.75rem;
    }
    
    .dashboard-main {
        padding: 1rem;
        gap: 1.5rem;
    }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
    .floating-orb,
    .quick-action-card,
    .card-icon {
        animation: none;
    }
    
    .quick-action-card:hover {
        transform: none;
    }
}
</style>