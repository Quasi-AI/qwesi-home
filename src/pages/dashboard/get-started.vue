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
                        <h1 class="text-xl sm:text-2xl font-bold text-gray-900">Get Started with Qwesi</h1>
                        <p class="text-sm text-gray-600">Choose your path and let us help you achieve your goals</p>
                    </div>
                </div>
            </header>

            <!-- Main Content Area -->
            <main class="flex-1 p-6 flex flex-col">
                <div class="max-w-7xl mx-auto w-full">

                    <!-- User Type Selector -->
                    <div class="mb-8">
                        <label class="block text-sm font-medium text-gray-700 mb-3">I am a:</label>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <button v-for="type in userTypes" :key="type.value"
                                @click="() => selectedUserType = type.value"
                                class="p-4 border-2 rounded-lg text-left transition-all duration-200 hover:shadow-md"
                                :class="selectedUserType === type.value
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 bg-white hover:border-gray-300'">
                                <div class="flex items-center">
                                    <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                        <UserIcon v-if="type.value === 'seeker'" class="w-6 h-6 text-blue-600" />
                                        <CurrencyDollarIcon v-else-if="type.value === 'investor'"
                                            class="w-6 h-6 text-blue-600" />
                                        <BuildingOfficeIcon v-else-if="type.value === 'employer'"
                                            class="w-6 h-6 text-blue-600" />
                                        <TrophyIcon v-else-if="type.value === 'pitch'" class="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 class="font-semibold text-gray-900">{{ type.label }}</h3>
                                        <p class="text-sm text-gray-600">{{ type.description }}</p>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>

                    <!-- Registration Forms -->
                    <div v-if="selectedUserType" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <!-- Job Seeker Form -->
                        <form v-if="selectedUserType === 'seeker'" @submit.prevent="submitSeekerForm" class="space-y-6">
                            <h2 class="text-xl font-semibold text-gray-900 mb-6">Job Seeker Details</h2>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                    <input v-model="seekerForm.name" type="text" placeholder="Full Name"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required />
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                    <div class="flex flex-col sm:flex-row gap-2">
                                        <div class="w-full sm:w-auto">
                                            <CountryCodeSelector v-model="seekerForm.countryCode" />
                                        </div>
                                        <input v-model="seekerForm.phone" type="tel" placeholder="Phone Number"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <input v-model="seekerForm.email" type="email" placeholder="Email Address"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required />
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                                    <input v-model="seekerForm.skills" type="text"
                                        placeholder="Skills (e.g., JavaScript, Python)"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required />
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                                    <input v-model="seekerForm.experience" type="text"
                                        placeholder="Experience (e.g., 3 years as Developer)"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required />
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-3">What help do you
                                    need?</label>
                                <div class="space-y-2">
                                    <label v-for="option in seekerOptions" :key="option.value"
                                        class="flex items-center">
                                        <input v-model="seekerForm.seekerDetails" :value="option.value" type="checkbox"
                                            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                        <span class="ml-2 text-sm text-gray-700">{{ option.label }}</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Tell us more about your
                                    goals (Optional)</label>
                                <textarea v-model="seekerForm.goals" rows="4"
                                    placeholder="Describe your career goals and aspirations..."
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"></textarea>
                            </div>

                            <div class="flex justify-end">
                                <button type="submit" :disabled="isSubmitting"
                                    class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                    {{ isSubmitting ? 'Submitting...' : 'Submit' }}
                                </button>
                            </div>
                        </form>

                        <!-- Investor Form -->
                        <form v-if="selectedUserType === 'investor'" @submit.prevent="submitInvestorForm"
                            class="space-y-6">
                            <h2 class="text-xl font-semibold text-gray-900 mb-6">Investor / Investment Opportunity</h2>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                    <input v-model="investorForm.name" type="text" placeholder="Full Name"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required />
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                    <div class="flex flex-col sm:flex-row gap-2">
                                        <div class="w-full sm:w-auto">
                                            <CountryCodeSelector v-model="investorForm.countryCode" />
                                        </div>
                                        <input v-model="investorForm.phone" type="tel" placeholder="Phone Number"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                                <input v-model="investorForm.email" type="email" placeholder="Contact Email"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-3">What describes you?</label>
                                <div class="space-y-2">
                                    <label v-for="option in investorOptions" :key="option.value"
                                        class="flex items-center">
                                        <input v-model="investorForm.investorDetails" :value="option.value"
                                            type="checkbox"
                                            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                        <span class="ml-2 text-sm text-gray-700">{{ option.label }}</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Briefly describe your
                                    investment offer or interest...</label>
                                <textarea v-model="investorForm.description" rows="4"
                                    placeholder="Describe your investment interests, opportunities, or what you're looking for..."
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                    required></textarea>
                            </div>

                            <div class="flex justify-end">
                                <button type="submit" :disabled="isSubmitting"
                                    class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                    {{ isSubmitting ? 'Submitting...' : 'Submit' }}
                                </button>
                            </div>
                        </form>

                        <!-- Employer Form -->
                        <form v-if="selectedUserType === 'employer'" @submit.prevent="submitEmployerForm"
                            class="space-y-6">
                            <h2 class="text-xl font-semibold text-gray-900 mb-6">Employer Details</h2>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                    <input v-model="employerForm.name" type="text" placeholder="Full Name"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required />
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                                    <input v-model="employerForm.companyName" type="text" placeholder="Company Name"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required />
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Business Email</label>
                                    <input v-model="employerForm.email" type="email" placeholder="Business Email"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required />
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                    <div class="flex flex-col sm:flex-row gap-2">
                                        <div class="w-full sm:w-auto">
                                            <CountryCodeSelector v-model="employerForm.countryCode" />
                                        </div>
                                        <input v-model="employerForm.phone" type="tel" placeholder="Phone Number"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-3">What are you looking
                                    for?</label>
                                <div class="space-y-2">
                                    <label v-for="option in employerOptions" :key="option.value"
                                        class="flex items-center">
                                        <input v-model="employerForm.employerDetails" :value="option.value"
                                            type="checkbox"
                                            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                        <span class="ml-2 text-sm text-gray-700">{{ option.label }}</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Describe your hiring or
                                    advertising needs...</label>
                                <textarea v-model="employerForm.description" rows="4"
                                    placeholder="Describe your hiring needs, company culture, or advertising requirements..."
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                    required></textarea>
                            </div>

                            <div class="flex justify-end">
                                <button type="submit" :disabled="isSubmitting"
                                    class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                    {{ isSubmitting ? 'Submitting...' : 'Submit' }}
                                </button>
                            </div>
                        </form>

                        <!-- Pitch Competition/Challenge Form -->
                        <form v-if="selectedUserType === 'pitch'" @submit.prevent="submitPitchForm" class="space-y-6">
                            <h2 class="text-xl font-semibold text-gray-900 mb-6">Pitch Competition / Challenge
                                Submission</h2>

                            <!-- Personal Information -->
                            <div class="bg-gray-50 p-4 rounded-lg">
                                <h3 class="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                        <input v-model="pitchForm.name" type="text" placeholder="Full Name"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required />
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Email
                                            Address</label>
                                        <input v-model="pitchForm.email" type="email" placeholder="Email Address"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required />
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                        <div class="flex flex-col sm:flex-row gap-2">
                                            <div class="w-full sm:w-auto">
                                                <CountryCodeSelector v-model="pitchForm.countryCode" />
                                            </div>
                                            <input v-model="pitchForm.phone" type="tel" placeholder="Phone Number"
                                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required />
                                        </div>
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Organization/Company
                                            (Optional)</label>
                                        <input v-model="pitchForm.organization" type="text"
                                            placeholder="Organization or Company Name"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                    </div>
                                </div>
                            </div>

                            <!-- Project/Pitch Information -->
                            <div class="bg-gray-50 p-4 rounded-lg">
                                <h3 class="text-lg font-medium text-gray-900 mb-4">Project Information</h3>

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Project/Idea
                                            Name</label>
                                        <input v-model="pitchForm.projectName" type="text"
                                            placeholder="Your Project or Idea Name"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required />
                                    </div>

                                    <div>
                                        <label
                                            class="block text-sm font-medium text-gray-700 mb-2">Industry/Category</label>
                                        <select v-model="pitchForm.industry"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required>
                                            <option value="">Select Industry</option>
                                            <option v-for="industry in industries" :key="industry" :value="industry">{{
                                                industry }}</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="mt-4">
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Project Summary</label>
                                    <textarea v-model="pitchForm.summary" rows="3"
                                        placeholder="Brief summary of your project or idea (2-3 sentences)"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                        required></textarea>
                                </div>
                            </div>

                            <!-- Competition Type -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-3">Type of Submission</label>
                                <div class="space-y-2">
                                    <label v-for="option in pitchTypes" :key="option.value" class="flex items-center">
                                        <input v-model="pitchForm.submissionType" :value="option.value" type="radio"
                                            name="submissionType"
                                            class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                                        <span class="ml-2 text-sm text-gray-700">{{ option.label }}</span>
                                    </label>
                                </div>
                            </div>

                            <!-- Detailed Description -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Detailed Description</label>
                                <textarea v-model="pitchForm.description" rows="6"
                                    placeholder="Provide a detailed description of your project, including the problem it solves, your solution, target market, and what makes it unique..."
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                    required></textarea>
                            </div>

                            <!-- Stage and Funding -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Current Stage</label>
                                    <select v-model="pitchForm.stage"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required>
                                        <option value="">Select Stage</option>
                                        <option v-for="stage in projectStages" :key="stage" :value="stage">{{ stage }}
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Funding Sought
                                        (Optional)</label>
                                    <input v-model="pitchForm.fundingAmount" type="text"
                                        placeholder="e.g., $50,000 or Not Applicable"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                            </div>

                            <!-- Additional Information -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Team Size</label>
                                    <select v-model="pitchForm.teamSize"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                        <option value="">Select Team Size</option>
                                        <option value="Just me">Just me</option>
                                        <option value="2-3 people">2-3 people</option>
                                        <option value="4-10 people">4-10 people</option>
                                        <option value="10+ people">10+ people</option>
                                    </select>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Website/Demo URL
                                        (Optional)</label>
                                    <input v-model="pitchForm.websiteUrl" type="url"
                                        placeholder="https://your-project.com"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                            </div>

                            <!-- What they're looking for -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-3">What are you looking for?
                                    (Check all that apply)</label>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <label v-for="option in seekingOptions" :key="option.value"
                                        class="flex items-center">
                                        <input v-model="pitchForm.seeking" :value="option.value" type="checkbox"
                                            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                        <span class="ml-2 text-sm text-gray-700">{{ option.label }}</span>
                                    </label>
                                </div>
                            </div>

                            <div class="flex justify-end">
                                <button type="submit" :disabled="isSubmitting"
                                    class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                    {{ isSubmitting ? 'Submit Pitch' : 'Submit Pitch' }}
                                </button>
                            </div>
                        </form>
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
import UserIcon from '~/shared/components/icons/user-icon.vue'
import CurrencyDollarIcon from '~/shared/components/icons/currency-dollar-icon.vue'
import BuildingOfficeIcon from '~/shared/components/icons/building-office-icon.vue'
import TrophyIcon from '~/shared/components/icons/trophy-icon.vue'
import CountryCodeSelector from '~/shared/components/ui/country-code-selector.vue'
import { onMounted, watch } from 'vue'

const authStore = useAuthStore()

// User state
const user = computed(() => authStore.getUser || {})

// User type options
const userTypes = [
    {
        value: 'seeker',
        label: 'Job Seeker',
        description: 'Looking for career opportunities and guidance'
    },
    {
        value: 'investor',
        label: 'Investor',
        description: 'Looking for investment opportunities or seeking investors'
    },
    {
        value: 'employer',
        label: 'Employer',
        description: 'Looking to hire talent or advertise your business'
    },
    {
        value: 'pitch',
        label: 'Pitch/Challenge',
        description: 'Submit a pitch, idea, or challenge for competitions'
    }
]

// Form options
const seekerOptions = [
    { value: 'AI Coach (Interview Prep)', label: 'AI Coach (Interview Prep)' },
    { value: 'Resume Builder', label: 'Resume Builder' },
    { value: 'Career Navigator', label: 'Career Navigator' },
    { value: 'Confidence Booster', label: 'Confidence Booster' }
]

const investorOptions = [
    { value: 'I am an investor', label: 'I am an investor' },
    { value: 'I\'m looking for investors', label: 'I\'m looking for investors' }
]

const employerOptions = [
    { value: 'AI Screener', label: 'AI Screener' },
    { value: 'Candidate Matcher', label: 'Candidate Matcher' },
    { value: 'Always-On Recruiter', label: 'Always-On Recruiter' },
    { value: 'Advertise My Business', label: 'Advertise My Business' }
]

// Pitch competition options
const pitchTypes = [
    { value: 'business_plan', label: 'Business Plan Competition' },
]

const industries = [
    'Technology',
    'Healthcare',
    'Education',
    'Finance',
    'E-commerce',
    'Agriculture',
    'Manufacturing',
    'Energy',
    'Transportation',
    'Entertainment',
    'Food & Beverage',
    'Real Estate',
    'Environmental',
    'Social Impact',
    'Other'
]

const projectStages = [
    'Idea Stage',
    'Concept Development',
    'Prototype/MVP',
    'Testing Phase',
    'Market Ready',
    'Early Revenue',
    'Scaling'
]

const seekingOptions = [
    { value: 'funding', label: 'Funding/Investment' },

]

// Reactive data
// Defensive: Only use route and router on client
const route = process.client ? useRoute() : null
const router = process.client ? useRouter() : null

const validTabs = userTypes.map(t => t.value)

const selectedUserType = ref('seeker')
const isSubmitting = ref(false)

// Sync tab from URL on mount
onMounted(() => {
    if (!process.client || !route) return
    const tab = route.query.tab
    if (typeof tab === 'string' && validTabs.includes(tab)) {
        selectedUserType.value = tab
    } else {
        selectedUserType.value = 'seeker'
    }
})

// Watch for tab changes in URL
watch(
    () => (route ? route.query.tab : undefined),
    (tab) => {
        if (typeof tab === 'string' && validTabs.includes(tab)) {
            selectedUserType.value = tab
        }
    }
)

// Update URL when tab changes
watch(selectedUserType, (val) => {
    if (!process.client || !route || !router) return
    if (route.query.tab !== val) {
        router.replace({ query: { ...route.query, tab: val } })
    }
})

// Watch for selectedUserType to set localStorage
watch(selectedUserType, (val) => {
    if (process.client && val === 'pitch' && authStore.isAuthenticated) {
        localStorage.setItem('hide_pitch_banner', 'true')
    }
})

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

const investorForm = ref({
    name: '',
    phone: '',
    countryCode: '+233',
    email: '',
    investorDetails: [],
    description: ''
})

const employerForm = ref({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    countryCode: '+233',
    employerDetails: [],
    description: ''
})

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

// Submit functions
const submitSeekerForm = async () => {
    isSubmitting.value = true
    try {
        const payload = {
            userType: 'seeker',
            name: seekerForm.value.name,
            phone: seekerForm.value.countryCode + seekerForm.value.phone,
            email: seekerForm.value.email,
            skills: seekerForm.value.skills,
            experience: seekerForm.value.experience,
            seekerDetails: seekerForm.value.seekerDetails,
            goals: seekerForm.value.goals
        }

        const response = await $fetch(API_ROUTES.REGISTER_ON_PAGE, {
            method: 'POST',
            body: payload
        })

        // Handle success
        alert('Registration submitted successfully!')
        resetSeekerForm()
    } catch (error) {
        console.error('Error submitting form:', error)
        alert('Error submitting form. Please try again.')
    } finally {
        isSubmitting.value = false
    }
}

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
            body: payload
        })

        // Handle success
        alert('Registration submitted successfully!')
        resetInvestorForm()
    } catch (error) {
        console.error('Error submitting form:', error)
        alert('Error submitting form. Please try again.')
    } finally {
        isSubmitting.value = false
    }
}

const submitEmployerForm = async () => {
    isSubmitting.value = true
    try {
        const payload = {
            userType: 'employer',
            name: employerForm.value.name,
            companyName: employerForm.value.companyName,
            email: employerForm.value.email,
            phone: employerForm.value.countryCode + employerForm.value.phone,
            employerDetails: employerForm.value.employerDetails,
            description: employerForm.value.description
        }

        const response = await $fetch(API_ROUTES.REGISTER_ON_PAGE, {
            method: 'POST',
            body: payload
        })

        // Handle success
        alert('Registration submitted successfully!')
        resetEmployerForm()
    } catch (error) {
        console.error('Error submitting form:', error)
        alert('Error submitting form. Please try again.')
    } finally {
        isSubmitting.value = false
    }
}

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
            body: payload
        })

        // Handle success
        alert('Pitch submitted successfully! We will review your submission and get back to you soon.')
        resetPitchForm()
    } catch (error) {
        console.error('Error submitting pitch:', error)
        alert('Error submitting pitch. Please try again.')
    } finally {
        isSubmitting.value = false
    }
}

// Reset functions
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

const resetEmployerForm = () => {
    employerForm.value = {
        name: '',
        companyName: '',
        email: '',
        phone: '',
        countryCode: '+233',
        employerDetails: [],
        description: ''
    }
}

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

// Lifecycle
onMounted(async () => {
    // Check if user is authenticated
    if (!authStore.isAuthenticated) {
        navigateTo('/auth/login')
        return
    }

})

// Set page title
useHead({
    title: 'Get Started - QWESI AI'
})
</script>