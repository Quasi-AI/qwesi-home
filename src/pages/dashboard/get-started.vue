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
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button v-for="type in userTypes" :key="type.value" @click="selectedUserType = type.value"
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
                                    goals
                                    (Optional)</label>
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
                                    investment
                                    offer or interest...</label>
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
                                    advertising
                                    needs...</label>
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
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup>
import { API_ROUTES } from '~/constants/api'
import { useAuthStore } from '~/stores/auth'
import Sidebar from '@/components/dashboard/Sidebar.vue'
import UserIcon from '~/components/icons/UserIcon.vue'
import CurrencyDollarIcon from '~/components/icons/CurrencyDollarIcon.vue'
import BuildingOfficeIcon from '~/components/icons/BuildingOfficeIcon.vue'
import CountryCodeSelector from '~/components/CountryCodeSelector.vue'

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

// Reactive data
const selectedUserType = ref('seeker')
const isSubmitting = ref(false)

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