<template>
    <div class="dashboard-container">
        <!-- Sidebar -->
        <Sidebar :user="user" />

        <!-- Main Content -->
        <div class="main-content">
            <!-- Enhanced Top Navigation -->
            <header class="modern-header">
                <div class="header-backdrop"></div>
                <div class="header-content">
                    <div class="header-info">
                        <div class="welcome-section">
                            <h1 class="dashboard-title">Pitch Competition</h1>
                            <p class="welcome-message">Submit your innovative ideas and compete for funding opportunities</p>
                        </div>
                    </div>

                    <!-- Header Actions -->
                    <div class="header-actions">
                        <!-- Help/Tips Button -->
                        <button @click="showTipsModal = true" class="action-btn tips-btn">
                            <div class="btn-bg"></div>
                            <div class="btn-content">
                                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Tips</span>
                            </div>
                        </button>

                        <!-- Back to Main -->
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
                                        <div class="avatar-ring"></div>
                                    </div>
                                    <div v-else class="avatar-initials">
                                        <span>{{ userInitials }}</span>
                                    </div>
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
                    <!-- Hero Section - Enhanced -->
                    <div class="onboarding-banner">
                        <div class="banner-backdrop"></div>
                        <div class="banner-content">
                            <div class="banner-main">
                                <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                    <svg class="banner-icon" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 class="banner-title">Showcase Your Innovation!</h2>
                                    <p class="banner-description">
                                        Submit your groundbreaking ideas, business plans, or innovative solutions to compete for funding, 
                                        mentorship, and the chance to turn your vision into reality.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Registration Form - Enhanced -->
                    <div class="relative rounded-3xl overflow-hidden">
                        <div class="absolute inset-0 bg-white/95 border border-slate-200/60 backdrop-blur-xl"></div>
                        <div class="relative z-10 p-8">
                            <form @submit.prevent="submitPitchForm" class="space-y-8">
                                <h3 class="text-xl font-bold text-slate-900 mb-6">Competition Submission</h3>

                                <!-- Personal Information -->
                                <div class="bg-slate-50/70 p-6 rounded-2xl backdrop-blur-sm">
                                    <h4 class="text-md font-semibold text-slate-900 mb-4">Personal Information</h4>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label class="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                                            <input v-model="pitchForm.name" type="text" placeholder="Enter your full name"
                                                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/80 backdrop-blur-sm"
                                                required />
                                        </div>

                                        <div>
                                            <label class="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
                                            <input v-model="pitchForm.email" type="email" placeholder="your.email@example.com"
                                                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/80 backdrop-blur-sm"
                                                required />
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                        <div>
                                            <label class="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
                                            <div class="flex flex-col sm:flex-row gap-2">
                                                <div class="w-full sm:w-auto">
                                                    <CountryCodeSelector v-model="pitchForm.countryCode" />
                                                </div>
                                                <input v-model="pitchForm.phone" type="tel" placeholder="Your phone number"
                                                    class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/80 backdrop-blur-sm"
                                                    required />
                                            </div>
                                        </div>

                                        <div>
                                            <label class="block text-sm font-medium text-slate-700 mb-2">Organization/Company (Optional)</label>
                                            <input v-model="pitchForm.organization" type="text"
                                                placeholder="Your organization or company"
                                                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/80 backdrop-blur-sm" />
                                        </div>
                                    </div>
                                </div>

                                <!-- Project Information -->
                                <div class="bg-slate-50/70 p-6 rounded-2xl backdrop-blur-sm">
                                    <h4 class="text-md font-semibold text-slate-900 mb-4">Project Information</h4>

                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label class="block text-sm font-medium text-slate-700 mb-2">Project/Idea Name *</label>
                                            <input v-model="pitchForm.projectName" type="text"
                                                placeholder="Your innovative project name"
                                                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/80 backdrop-blur-sm"
                                                required />
                                        </div>

                                        <div>
                                            <label class="block text-sm font-medium text-slate-700 mb-2">Industry/Category *</label>
                                            <select v-model="pitchForm.industry"
                                                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/80 backdrop-blur-sm"
                                                required>
                                                <option value="">Select Industry</option>
                                                <option v-for="industry in industries" :key="industry" :value="industry">{{ industry }}</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div class="mt-4">
                                        <label class="block text-sm font-medium text-slate-700 mb-2">Project Summary *</label>
                                        <textarea v-model="pitchForm.summary" rows="3"
                                            placeholder="Provide a compelling summary of your project in 2-3 sentences"
                                            class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/80 backdrop-blur-sm resize-none"
                                            required></textarea>
                                    </div>
                                </div>

                                <!-- Competition Type -->
                                <div>
                                    <label class="block text-sm font-medium text-slate-700 mb-3">Competition Type *</label>
                                    <div class="space-y-2">
                                        <label v-for="option in pitchTypes" :key="option.value" 
                                               class="flex items-center p-4 border border-slate-200 rounded-xl hover:bg-slate-50/70 cursor-pointer backdrop-blur-sm">
                                            <input v-model="pitchForm.submissionType" :value="option.value" type="radio"
                                                name="submissionType"
                                                class="w-4 h-4 text-purple-600 border-slate-300 focus:ring-purple-500 mr-3" />
                                            <span class="text-sm font-medium text-slate-700">{{ option.label }}</span>
                                        </label>
                                    </div>
                                </div>

                                <!-- Detailed Description -->
                                <div>
                                    <label class="block text-sm font-medium text-slate-700 mb-2">Detailed Project Description *</label>
                                    <textarea v-model="pitchForm.description" rows="8"
                                        placeholder="Provide a comprehensive description of your project including:&#10;• The problem you're solving&#10;• Your innovative solution&#10;• Target market and audience&#10;• What makes your idea unique&#10;• Potential impact and benefits&#10;• Your competitive advantage"
                                        class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/80 backdrop-blur-sm resize-none"
                                        required></textarea>
                                    <p class="text-xs text-slate-500 mt-2">Be detailed and specific - this is your chance to showcase your innovation</p>
                                </div>

                                <!-- Stage and Funding -->
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label class="block text-sm font-medium text-slate-700 mb-2">Current Development Stage *</label>
                                        <select v-model="pitchForm.stage"
                                            class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/80 backdrop-blur-sm"
                                            required>
                                            <option value="">Select Stage</option>
                                            <option v-for="stage in projectStages" :key="stage" :value="stage">{{ stage }}</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-slate-700 mb-2">Funding Sought (Optional)</label>
                                        <input v-model="pitchForm.fundingAmount" type="text"
                                            placeholder="e.g., $50,000 or Not Seeking Funding"
                                            class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/80 backdrop-blur-sm" />
                                    </div>
                                </div>

                                <!-- Additional Information -->
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label class="block text-sm font-medium text-slate-700 mb-2">Team Size</label>
                                        <select v-model="pitchForm.teamSize"
                                            class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/80 backdrop-blur-sm">
                                            <option value="">Select Team Size</option>
                                            <option value="Just me">Just me (Solo founder)</option>
                                            <option value="2-3 people">2-3 people</option>
                                            <option value="4-10 people">4-10 people</option>
                                            <option value="10+ people">10+ people</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-slate-700 mb-2">Website/Demo URL (Optional)</label>
                                        <input v-model="pitchForm.websiteUrl" type="url"
                                            placeholder="https://your-project.com"
                                            class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/80 backdrop-blur-sm" />
                                    </div>
                                </div>

                                <!-- What they're seeking -->
                                <div>
                                    <label class="block text-sm font-medium text-slate-700 mb-3">What are you looking for? (Check all that apply)</label>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <label v-for="option in seekingOptions" :key="option.value"
                                            class="flex items-center p-4 border border-slate-200 rounded-xl hover:bg-slate-50/70 cursor-pointer backdrop-blur-sm">
                                            <input v-model="pitchForm.seeking" :value="option.value" type="checkbox"
                                                class="w-4 h-4 text-purple-600 border-slate-300 rounded focus:ring-purple-500 mr-3" />
                                            <span class="text-sm text-slate-700">{{ option.label }}</span>
                                        </label>
                                    </div>
                                </div>

                                <div class="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-slate-200">
                                    <p class="text-xs text-slate-500 mb-4 sm:mb-0">
                                        * Required fields. All submissions will be reviewed by our expert panel.
                                    </p>
                                    <button type="submit" :disabled="isSubmitting"
                                        class="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40">
                                        <span v-if="isSubmitting" class="flex items-center justify-center">
                                            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Submitting...
                                        </span>
                                        <span v-else>Submit Pitch</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <!-- Benefits Section - Enhanced -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="quick-action-card">
                            <div class="card-bg bg-gradient-to-br from-purple-50 to-purple-100/70"></div>
                            <div class="card-glow bg-gradient-to-br from-purple-200 to-purple-300"></div>
                            <div class="card-content">
                                <div class="card-icon bg-gradient-to-br from-purple-500 to-purple-600">
                                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                                    </svg>
                                </div>
                                <h3 class="card-label">Funding Opportunities</h3>
                                <p class="text-xs text-slate-600 text-center">Win cash prizes, grants, and investment opportunities from our network of investors and partners.</p>
                            </div>
                        </div>

                        <div class="quick-action-card">
                            <div class="card-bg bg-gradient-to-br from-blue-50 to-blue-100/70"></div>
                            <div class="card-glow bg-gradient-to-br from-blue-200 to-blue-300"></div>
                            <div class="card-content">
                                <div class="card-icon bg-gradient-to-br from-blue-500 to-blue-600">
                                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                                    </svg>
                                </div>
                                <h3 class="card-label">Expert Mentorship</h3>
                                <p class="text-xs text-slate-600 text-center">Get guidance from industry experts, successful entrepreneurs, and seasoned investors.</p>
                            </div>
                        </div>

                        <div class="quick-action-card">
                            <div class="card-bg bg-gradient-to-br from-green-50 to-green-100/70"></div>
                            <div class="card-glow bg-gradient-to-br from-green-200 to-green-300"></div>
                            <div class="card-content">
                                <div class="card-icon bg-gradient-to-br from-green-500 to-green-600">
                                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                                <h3 class="card-label">Network Access</h3>
                                <p class="text-xs text-slate-600 text-center">Connect with like-minded entrepreneurs, potential co-founders, and industry professionals.</p>
                            </div>
                        </div>
                    </div>

                    <!-- Competition Timeline - Enhanced -->
                    <div class="relative rounded-3xl overflow-hidden">
                        <div class="absolute inset-0 bg-white/95 border border-slate-200/60 backdrop-blur-xl"></div>
                        <div class="relative z-10 p-8">
                            <h3 class="text-lg font-semibold text-slate-900 mb-6">Competition Timeline</h3>
                            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div class="text-center">
                                    <div class="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <span class="text-blue-600 font-semibold">1</span>
                                    </div>
                                    <h4 class="font-medium text-slate-900 mb-1">Submit</h4>
                                    <p class="text-xs text-slate-600">Complete and submit your pitch application</p>
                                </div>
                                <div class="text-center">
                                    <div class="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <span class="text-yellow-600 font-semibold">2</span>
                                    </div>
                                    <h4 class="font-medium text-slate-900 mb-1">Review</h4>
                                    <p class="text-xs text-slate-600">Expert panel reviews all submissions</p>
                                </div>
                                <div class="text-center">
                                    <div class="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <span class="text-green-600 font-semibold">3</span>
                                    </div>
                                    <h4 class="font-medium text-slate-900 mb-1">Shortlist</h4>
                                    <p class="text-xs text-slate-600">Selected finalists are notified</p>
                                </div>
                                <div class="text-center">
                                    <div class="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <span class="text-purple-600 font-semibold">4</span>
                                    </div>
                                    <h4 class="font-medium text-slate-900 mb-1">Present</h4>
                                    <p class="text-xs text-slate-600">Final presentations and winner announcement</p>
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

// Form options
const pitchTypes = [
    { value: 'business_plan', label: 'Business Plan Competition - Submit your comprehensive business plan for review and funding' }
]

const industries = [
    'Technology', 'Healthcare', 'Education', 'Finance', 'E-commerce', 'Agriculture', 
    'Manufacturing', 'Energy', 'Transportation', 'Entertainment', 'Food & Beverage', 
    'Real Estate', 'Environmental', 'Social Impact', 'Other'
]

const projectStages = [
    'Idea Stage', 'Concept Development', 'Prototype/MVP', 'Testing Phase', 
    'Market Ready', 'Early Revenue', 'Scaling'
]

const seekingOptions = [
    { value: 'funding', label: 'Funding/Investment' },
    { value: 'mentorship', label: 'Mentorship & Guidance' },
    { value: 'partnerships', label: 'Strategic Partnerships' },
    { value: 'team_members', label: 'Team Members/Co-founders' },
    { value: 'market_access', label: 'Market Access & Customers' },
    { value: 'technical_support', label: 'Technical Support' }
]

// Form data
const pitchForm = ref({
    name: '',
    email: '',
    phone: '',
    countryCode: '+233',
    organization: '',
    projectName: '',
    industry: '',
    summary: '',
    submissionType: '',
    description: '',
    stage: '',
    fundingAmount: '',
    teamSize: '',
    websiteUrl: '',
    seeking: []
})

const isSubmitting = ref(false)

// Submit function
const submitPitchForm = async () => {
    isSubmitting.value = true
    
    try {
        const payload = {
            userType: 'pitch',
            name: pitchForm.value.name,
            email: pitchForm.value.email,
            phone: pitchForm.value.countryCode + pitchForm.value.phone,
            organization: pitchForm.value.organization,
            projectName: pitchForm.value.projectName,
            industry: pitchForm.value.industry,
            summary: pitchForm.value.summary,
            submissionType: pitchForm.value.submissionType,
            description: pitchForm.value.description,
            stage: pitchForm.value.stage,
            fundingAmount: pitchForm.value.fundingAmount,
            teamSize: pitchForm.value.teamSize,
            websiteUrl: pitchForm.value.websiteUrl,
            seeking: pitchForm.value.seeking
        }

        const response = await $fetch(API_ROUTES.REGISTER_ON_PAGE, {
            method: 'POST',
            body: payload,
            throw: false
        })

        if (response.success) {
            alertRef.value.success('Pitch submitted successfully! Our expert panel will review your submission and contact you within 5-7 business days.', {
                title: 'Submission Received!',
                duration: 4000
            })
            resetPitchForm()
            
            // Redirect to dashboard after success
            setTimeout(() => {
                navigateTo('/dashboard')
            }, 3000)
        } else {
            alertRef.value.error(response.message || 'Submission failed', {
                title: 'Error',
                duration: 0
            })
        }

    } catch (error) {
        console.error('Pitch submission error:', error)
        
        let errorMessage = 'Pitch submission failed. Please try again.'
        let errorTitle = 'Error'
        
        if (error.response?.status === 409 || error.statusCode === 409) {
            errorMessage = 'A pitch with this project name or email already exists. Please use different details.'
            errorTitle = 'Duplicate Submission'
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
const resetPitchForm = () => {
    pitchForm.value = {
        name: '',
        email: '',
        phone: '',
        countryCode: '+233',
        organization: '',
        projectName: '',
        industry: '',
        summary: '',
        submissionType: '',
        description: '',
        stage: '',
        fundingAmount: '',
        teamSize: '',
        websiteUrl: '',
        seeking: []
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
    title: 'Pitch Competition - QWESI AI'
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

.pro-banner {
    @apply relative rounded-3xl overflow-hidden;
}

.pro-banner-bg {
    @apply absolute inset-0 bg-gradient-to-r from-blue-600/95 to-blue-700/90;
}

.pro-content {
    @apply relative z-10 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0;
}

.pro-text {
    @apply flex-1 text-white;
}

.pro-title {
    @apply text-lg font-bold mb-2;
}

.pro-description {
    @apply text-blue-100;
}

.pro-btn {
    @apply bg-white text-blue-600 px-6 py-3 rounded-2xl font-bold;
    @apply hover:bg-blue-50 transition-all duration-300;
    @apply flex items-center space-x-2 hover:scale-105 hover:shadow-lg;
}

.pro-arrow {
    @apply w-4 h-4;
}

/* Quick Actions */
.quick-actions-container {
    @apply space-y-6;
}

.section-header {
    @apply flex items-center space-x-4;
}

.section-title {
    @apply text-xl font-bold text-slate-900;
}

.section-decorator {
    @apply flex-1 h-px bg-gradient-to-r from-slate-300 via-blue-300 to-transparent;
}

.quick-actions-grid {
    @apply grid grid-cols-2 sm:grid-cols-4 gap-4;
}

.quick-action-card {
    @apply relative p-6 rounded-3xl transition-all duration-300;
    @apply hover:-translate-y-2 hover:scale-105;
    @apply focus:outline-none focus:ring-4 focus:ring-blue-500/20;
    backdrop-filter: blur(20px);
}

.card-bg {
    @apply absolute inset-0 rounded-3xl border border-white/60;
}

.card-glow {
    @apply absolute -inset-px rounded-3xl opacity-0 transition-all duration-500;
    @apply hover:opacity-100;
    filter: blur(8px);
}

.card-content {
    @apply relative z-10 flex flex-col items-center space-y-3;
}

.card-icon {
    @apply w-12 h-12 rounded-2xl flex items-center justify-center;
    @apply shadow-lg transition-transform duration-300;
}

.card-icon svg {
    @apply w-6 h-6 text-white;
}

.quick-action-card:hover .card-icon {
    @apply scale-110 rotate-3;
}

.card-label {
    @apply text-sm font-bold text-slate-700;
}

/* Stats Section */
.stats-section {
    @apply space-y-6;
}

.refresh-btn {
    @apply relative px-4 py-2 rounded-2xl font-medium text-sm text-blue-700;
    @apply flex items-center space-x-2 transition-all duration-300;
    @apply hover:scale-105 disabled:opacity-50;
}

.refresh-bg {
    @apply absolute inset-0 bg-gradient-to-r from-blue-100/80 to-blue-200/60 rounded-2xl;
    backdrop-filter: blur(12px);
}

.refresh-icon {
    @apply w-4 h-4 relative z-10;
}

.spinning {
    animation: spin 1s linear infinite;
}

/* Loading States */
.loading-state, .error-state {
    @apply flex flex-col items-center justify-center py-12 space-y-4;
}

.loading-spinner {
    @apply w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full;
    animation: spin 1s linear infinite;
}

.loading-spinner.small {
    @apply w-6 h-6 border-2;
}

.loading-text {
    @apply text-slate-600 font-medium;
}

.error-state {
    @apply bg-red-50/70 rounded-2xl p-6 border border-red-200/60;
}

.error-icon {
    @apply w-8 h-8 text-red-500;
}

.error-message {
    @apply text-red-600 text-sm;
}

/* Tables Section */
.tables-section {
    @apply space-y-6;
}

.tables-grid {
    @apply grid grid-cols-1 lg:grid-cols-2 gap-8;
}

.table-container {
    @apply relative;
}

.table-loading {
    @apply bg-white/70 rounded-3xl p-8 border border-slate-200/60;
    backdrop-filter: blur(20px);
}

.table-loading-content {
    @apply flex items-center justify-center space-x-3 text-slate-600;
}

/* Pitch Banner */
.pitch-banner {
    @apply relative rounded-3xl overflow-hidden;
}

.pitch-banner-bg {
    @apply absolute inset-0 bg-gradient-to-r from-amber-400/95 via-yellow-400/90 to-orange-400/95;
}

.pitch-content {
    @apply relative z-10 p-6 flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6;
}

.pitch-icon {
    @apply w-12 h-12 text-blue-900 flex-shrink-0;
}

.pitch-text {
    @apply flex-1 text-blue-900;
}

.pitch-title {
    @apply font-bold text-lg mb-1;
}

.pitch-description {
    @apply text-blue-800;
}

.pitch-btn {
    @apply bg-blue-900 text-white px-6 py-3 rounded-2xl font-bold;
    @apply hover:bg-blue-800 transition-all duration-300;
    @apply flex items-center space-x-2 hover:scale-105;
    @apply shadow-lg shadow-blue-900/25;
}

.pitch-sparkle {
    animation: bounce 2s ease-in-out infinite;
}

.pitch-close {
    @apply absolute top-4 right-4 p-2 text-blue-800 hover:text-blue-900;
    @apply rounded-xl hover:bg-white/20 transition-colors;
}

/* Modal Styles */
.modal-overlay {
    @apply fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50;
    backdrop-filter: blur(8px);
}

.modal-backdrop {
    @apply absolute inset-0 bg-black/40;
}

.referral-modal, .tips-modal {
    @apply relative bg-white/95 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden;
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.modal-header {
    @apply flex items-center justify-between p-8 border-b border-slate-200/60;
}

.modal-title-section {
    @apply space-y-2;
}

.modal-title {
    @apply text-xl font-bold text-slate-900;
}

.title-decoration {
    @apply w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full;
}

.modal-close {
    @apply p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100/70;
    @apply transition-colors duration-200;
}

/* Onboarding Overlay */
.onboarding-overlay {
    @apply fixed inset-0 bg-black/60 z-50;
    backdrop-filter: blur(4px);
}

.z-60 {
    z-index: 60;
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
    
    .quick-actions-grid {
        @apply grid-cols-2 gap-3;
    }
    
    .quick-action-card {
        @apply p-4;
    }
    
    .tables-grid {
        @apply grid-cols-1 gap-6;
    }

    .tooltip-responsive {
        left: 1rem !important;
        right: 1rem !important;
        max-width: calc(100vw - 2rem) !important;
    }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
    .floating-orb,
    .quick-action-card,
    .card-icon,
    .pitch-sparkle {
        animation: none;
    }
    
    .quick-action-card:hover {
        transform: none;
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

/* Prevent sidebar distortion */
.sidebar-fixed {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: 320px;
    z-index: 40;
    overflow-y: auto;
    overflow-x: hidden;
}

.sidebar-collapsed {
    width: 80px;
}

/* Main content margin adjustment */
.main-content-adjusted {
    margin-left: 320px;
}

.main-content-collapsed {
    margin-left: 80px;
}

/* Smooth height transitions */
.smooth-height {
    transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Fix mobile menu overflow */
@media (max-width: 767px) {
    .main-content-adjusted,
    .main-content-collapsed {
        margin-left: 0;
    }
    
    /* Prevent body scroll when mobile menu is open */
    body.mobile-menu-open {
        overflow: hidden;
        height: 100vh;
    }
    
    .dashboard-container {
        height: 100vh;
        overflow: hidden;
    }
    
    .main-content {
        height: 100vh;
        overflow-y: auto;
    }
}
</style>