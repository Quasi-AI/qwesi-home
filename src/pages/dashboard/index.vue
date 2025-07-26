<template>
    <div class="min-h-screen bg-gray-50 flex">
        <!-- Sidebar -->
        <Sidebar :user="user" />

        <!-- Main Content -->
        <div class="flex-1 flex flex-col">
            <!-- Top Navigation -->
            <header class="bg-white border-b border-gray-200 px-6 py-4">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
                        <p class="text-sm text-gray-600">Welcome back, {{ displayName }}</p>
                    </div>

                    <!-- Profile Dropdown -->
                    <div class="relative">
                        <button @click="profileMenuOpen = !profileMenuOpen"
                            class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <div v-if="user.profileImage"
                                class="w-8 h-8 object-cover rounded-full overflow-hidden border-2 border-gray-200">
                                <img :src="user.profileImage" alt="Profile Picture"
                                    class="w-8 h-8 object-cover" />
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
                            class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
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
            <main class="flex-1 p-6">
                <!-- Try Pro Banner -->
                <div class="mb-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4 sm:p-6 text-white">
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
                    <Stats :stats="stats" />
                </div>

                <!-- Tables Grid -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <!-- Tasks Table -->
                    <Table title="Recent Tasks" description="Your latest tasks and their status" :columns="taskColumns"
                        :data="tasks" />

                    <!-- People Table -->
                    <Table title="Team Members" description="People working on your projects" :columns="peopleColumns"
                        :data="people" />
                </div>
            </main>
        </div>

        <!-- Pro Modal -->
        <div v-if="showProModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                <h3 class="text-xl font-bold text-gray-900 mb-4">Upgrade to Pro</h3>
                <p class="text-gray-600 mb-6">
                    Enter your payment information to start your 30-day free trial. You can cancel anytime.
                </p>

                <form @submit.prevent="handleProUpgrade" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                        <input v-model="paymentForm.cardNumber" type="text" placeholder="1234 5678 9012 3456"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required />
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                            <input v-model="paymentForm.expiryDate" type="text" placeholder="MM/YY"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                            <input v-model="paymentForm.cvv" type="text" placeholder="123"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required />
                        </div>
                    </div>

                    <div class="flex space-x-3 pt-4">
                        <button type="button" @click="showProModal = false"
                            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" :disabled="upgrading"
                            class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
                            <span v-if="upgrading">Processing...</span>
                            <span v-else>Start Trial</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '@/components/dashboard/Sidebar.vue'
import Stats from '@/components/dashboard/Stats.vue'
import Table from '@/components/dashboard/Table.vue'

const router = useRouter()

// User state
const user = ref({})
const profileMenuOpen = ref(false)
const showProModal = ref(false)
const upgrading = ref(false)

// Payment form
const paymentForm = ref({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
})

// Stats data
const stats = ref({
    jobs: 24,
    activeTasks: 8,
    people: 12,
    productivity: 87
})

// Table data
const taskColumns = [
    { key: 'name', label: 'Task Name' },
    { key: 'assignee', label: 'Assignee', type: 'avatar' },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'dueDate', label: 'Due Date' }
]

const tasks = ref([
    { name: 'Review AI Models', assignee: 'John Doe', status: 'Active', dueDate: '2024-01-15' },
    { name: 'Update Documentation', assignee: 'Jane Smith', status: 'Completed', dueDate: '2024-01-10' },
    { name: 'Bug Fixes', assignee: 'Mike Johnson', status: 'In Progress', dueDate: '2024-01-20' },
    { name: 'Performance Testing', assignee: 'Sarah Wilson', status: 'Pending', dueDate: '2024-01-25' }
])

const peopleColumns = [
    { key: 'name', label: 'Name', type: 'avatar' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'lastActive', label: 'Last Active' }
]

const people = ref([
    { name: 'John Doe', role: 'Developer', status: 'Active', lastActive: '2 hours ago' },
    { name: 'Jane Smith', role: 'Designer', status: 'Active', lastActive: '1 hour ago' },
    { name: 'Mike Johnson', role: 'Manager', status: 'Active', lastActive: '30 min ago' },
    { name: 'Sarah Wilson', role: 'Analyst', status: 'Active', lastActive: '5 min ago' }
])

// Computed
const userInitials = computed(() => {
    const firstName = user.value.firstName || ''
    const lastName = user.value.lastName || ''
    if (firstName || lastName) {
        return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase()
    }
    // Fallback to the old name format if firstName/lastName not available
    const name = user.value.name || ''
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
})

const displayName = computed(() => {
    const firstName = user.value.firstName || ''
    const lastName = user.value.lastName || ''
    if (firstName || lastName) {
        return `${firstName} ${lastName}`.trim()
    }
    // Fallback to the old name format if firstName/lastName not available
    return user.value.name || 'User'
})

// Methods
const editProfile = () => {
    profileMenuOpen.value = false
    router.push('/dashboard/profile')
}

const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/')
}

const handleProUpgrade = async () => {
    upgrading.value = true

    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Store payment info (in real app, this would be sent to payment processor)
        localStorage.setItem('paymentInfo', JSON.stringify(paymentForm.value))
        localStorage.setItem('proSubscription', 'true')

        showProModal.value = false
        alert('Pro subscription activated! Welcome to Qwesi AI Pro.')
    } catch (error) {
        console.error('Upgrade error:', error)
    } finally {
        upgrading.value = false
    }
}

// Lifecycle
onMounted(() => {
    loadUserData()
})

// Watch for changes in localStorage to update user data when returning from profile page
watch(() => localStorage.getItem('user'), () => {
    loadUserData()
}, { immediate: false })

const loadUserData = () => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
        user.value = JSON.parse(storedUser)
    } else {
        router.push('/')
    }
}

// Set page title
useHead({
    title: 'Dashboard - QWESI AI'
})
</script>