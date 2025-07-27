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
                        <h1 class="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
                        <p class="text-sm text-gray-600">Welcome back, {{ displayName }}</p>
                    </div>

                    <!-- Profile Dropdown -->
                    <div class="relative flex justify-center sm:justify-end">
                        <button @click="profileMenuOpen = !profileMenuOpen"
                            class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <div v-if="user.profileImage"
                                class="w-8 h-8 object-cover rounded-full overflow-hidden border-2 border-gray-200">
                                <img :src="user.profileImage" alt="Profile Picture" class="w-8 h-8 object-cover" />
                            </div>
                            <div v-else class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span class="text-blue-600 font-medium text-sm">{{ userInitials }}</span>
                            </div>
                            <span class="text-sm font-medium text-gray-700">{{ displayName }}</span>
                            <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clip-rule="evenodd" />
                            </svg>
                        </button>

                        <!-- Profile Menu -->
                        <div v-if="profileMenuOpen"
                            class="absolute right-0 sm:right-0 left-0 sm:left-auto mt-2 w-full sm:w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                            <button @click="editProfile"
                                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                Edit Profile
                            </button>
                            <button @click="handleLogout"
                                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Main Content Area -->
            <main class="flex-1 p-6 flex flex-col">
                <!-- Try Pro Banner - Only show if user is not subscribed -->
                <div v-if="!isSubscribed" class="mb-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4 sm:p-6 text-white">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                        <div class="flex-1">
                            <h3 class="text-lg font-semibold mb-2">Unlock Premium Features</h3>
                            <p class="text-blue-100 text-sm sm:text-base">Get access to advanced AI features, priority
                                support, and more.</p>
                        </div>
                        <button @click="showProModal = true"
                            class="bg-white text-blue-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm sm:text-base w-full sm:w-auto">
                            Try Pro for 30 Days
                        </button>
                    </div>
                </div>

                <!-- Stats Grid -->
                <div class="mb-8">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-xl font-semibold text-gray-900">Dashboard Overview</h2>
                        <button @click="() => fetchDashboardSummary()" :disabled="dashboardLoading"
                            class="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            <svg v-if="dashboardLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600"
                                fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                            </svg>
                            <svg v-else class="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Refresh
                        </button>
                    </div>
                    <div v-if="dashboardLoading" class="flex justify-center items-center py-8">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span class="ml-2 text-gray-600">Loading dashboard data...</span>
                    </div>
                    <div v-else-if="dashboardError" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p class="text-red-600 text-sm">{{ dashboardError }}</p>
                    </div>
                    <Stats v-else :stats="stats" />
                </div>

                <!-- Tables Grid -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <!-- Tasks Table -->
                    <div v-if="dashboardLoading" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div class="flex justify-center items-center py-8">
                            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            <span class="ml-2 text-gray-600">Loading tasks...</span>
                        </div>
                    </div>
                    <Table v-else title="Recent Tasks" description="Your latest tasks and their status" :columns="taskColumns"
                        :data="tasks" />

                    <!-- People Table -->
                    <div v-if="dashboardLoading" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div class="flex justify-center items-center py-8">
                            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            <span class="ml-2 text-gray-600">Loading team members...</span>
                        </div>
                    </div>
                    <Table v-else title="Team Members" description="People working on your projects" :columns="peopleColumns"
                        :data="people" />
                </div>

                <!-- Footer -->
                <div class="mt-auto">
                    <Footer />
                </div>
            </main>
        </div>

        <!-- Pro Modal -->
        <ProModal v-model="showProModal" mode="upgrade" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

import { useAuthStore } from '~/stores/auth'
import { useSubscriptionStore } from '~/stores/subscription'
import { useDashboard } from '~/composables/useDashboard'
import Sidebar from '@/components/dashboard/Sidebar.vue'
import Stats from '@/components/dashboard/Stats.vue'
import Table from '@/components/dashboard/Table.vue'
import ProModal from '@/components/dashboard/ProModal.vue'
import Footer from '@/components/Footer.vue'


const authStore = useAuthStore()
const subscriptionStore = useSubscriptionStore()
const { loading: dashboardLoading, error: dashboardError, summary, fetchDashboardSummary } = useDashboard()

// User state
const user = computed(() => authStore.getUser || {})
const profileMenuOpen = ref(false)
const showProModal = ref(false)

// Stats data - now computed from API response
const stats = computed(() => {
    if (!summary.value) {
        return {
            jobs: 0,
            activeTasks: 0,
            people: 0,
            productivity: 0,
            changes: {
                jobs: { value: 0, period: "last month" },
                activeTasks: { value: 0, period: "last week" },
                people: { value: 0, period: "last month" },
                productivity: { value: 0, period: "last week" }
            }
        }
    }
    return {
        jobs: summary.value.jobs,
        activeTasks: summary.value.activeTasks,
        people: summary.value.people,
        productivity: summary.value.productivity,
        changes: summary.value.changes || {
            jobs: { value: 0, period: "last month" },
            activeTasks: { value: 0, period: "last week" },
            people: { value: 0, period: "last month" },
            productivity: { value: 0, period: "last week" }
        }
    }
})

// Table data - now computed from API response
const taskColumns = [
    { key: 'taskName', label: 'Task Name' },
    { key: 'assignee', label: 'Assignee', type: 'avatar' },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'dueDate', label: 'Due Date' }
]

const tasks = computed(() => {
    return summary.value?.recentTasks || []
})

const peopleColumns = [
    { key: 'name', label: 'Name', type: 'avatar' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'lastActive', label: 'Last Active' }
]

const people = computed(() => {
    return summary.value?.teamMembers || []
})

// Computed
const userInitials = computed(() => {
    const name = user.value.name || ''
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2)
})

const displayName = computed(() => {
    return user.value.name || 'User'
})

// Check if user is subscribed
const isSubscribed = computed(() => {
    // Check both user's isSubscribe property and subscription store
    return !!(user.value && user.value.isSubscribe) || subscriptionStore.isSubscribed
})

// Methods
const editProfile = () => {
    profileMenuOpen.value = false
    navigateTo('/dashboard/profile')
}

const handleLogout = async () => {
    await authStore.logout()
    navigateTo('/')
}

// Lifecycle
onMounted(async () => {
    // Check if user is authenticated
    if (!authStore.isAuthenticated) {
        navigateTo('/auth/login')
        return
    }

    // Fetch dashboard summary data
    await fetchDashboardSummary()
    
    // Fetch subscription data to ensure we have the latest status
    await subscriptionStore.fetchSubscription()
})

// Set page title
useHead({
    title: 'Dashboard - QWESI AI'
})
</script>