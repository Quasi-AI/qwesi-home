<template>
    <div class="bg-white border-r border-gray-200 min-h-screen flex flex-col transition-all duration-300 ease-in-out"
        :class="isCollapsed ? 'w-16' : 'w-64'">
        <!-- Logo -->
        <div class="p-6 border-b border-gray-200 flex items-center justify-between">
            <NuxtLink to="/" class="hover:opacity-80 transition-opacity">
                <img v-if="!isCollapsed" src="~/assets/images/logo.png" alt="QWESI AI Logo" class="w-32 h-auto" />
                <img v-else src="~/assets/images/logo.png" alt="QWESI AI Logo" class="w-8 h-auto" />
            </NuxtLink>
            <button @click="toggleCollapse" class="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                :class="isCollapsed ? 'ml-0' : 'ml-2'">
                <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20"
                    :class="isCollapsed ? 'rotate-180' : ''">
                    <path fill-rule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clip-rule="evenodd" />
                </svg>
            </button>
        </div>

        <!-- Navigation -->
        <nav class="flex-1" :class="isCollapsed ? 'p-2' : 'p-6'">
            <ul class="space-y-2">
                <li>
                    <NuxtLink to="/dashboard" class="flex items-center text-sm font-medium rounded-lg transition-colors"
                        :class="[
                            $route.path === '/dashboard'
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-700 hover:bg-gray-50',
                            isCollapsed ? 'justify-center p-2' : 'px-3 py-2'
                        ]" 
                        :title="isCollapsed ? 'Dashboard' : ''"
                        @click.prevent="handleNavigation('/dashboard')">
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                        </svg>
                        <span v-if="!isCollapsed" class="ml-3">Dashboard</span>
                    </NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/dashboard/get-started"
                        class="flex items-center text-sm font-medium rounded-lg transition-colors" 
                        :class="[
                            $route.path === '/dashboard/get-started'
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-700 hover:bg-gray-50',
                            isCollapsed ? 'justify-center p-2' : 'px-3 py-2'
                        ]" 
                        :title="isCollapsed ? 'Get Started' : ''"
                        @click.prevent="handleNavigation('/dashboard/get-started')">
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                                clip-rule="evenodd" />
                        </svg>
                        <span v-if="!isCollapsed" class="ml-3">Get Started</span>
                    </NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/dashboard/profile"
                        class="flex items-center text-sm font-medium rounded-lg transition-colors" 
                        :class="[
                            $route.path === '/dashboard/profile'
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-700 hover:bg-gray-50',
                            isCollapsed ? 'justify-center p-2' : 'px-3 py-2'
                        ]" 
                        :title="isCollapsed ? 'Profile' : ''"
                        @click.prevent="handleNavigation('/dashboard/profile')">
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                clip-rule="evenodd" />
                        </svg>
                        <span v-if="!isCollapsed" class="ml-3">Profile</span>
                    </NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/dashboard/subscription"
                        class="flex items-center text-sm font-medium rounded-lg transition-colors" 
                        :class="[
                            $route.path === '/dashboard/subscription'
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-700 hover:bg-gray-50',
                            isCollapsed ? 'justify-center p-2' : 'px-3 py-2'
                        ]" 
                        :title="isCollapsed ? 'Subscription' : ''"
                        @click.prevent="handleNavigation('/dashboard/subscription')">
                        <CurrencyDollarIcon />
                        <span v-if="!isCollapsed" class="ml-3">Subscription</span>
                    </NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/dashboard/investors"
                        class="flex items-center text-sm font-medium rounded-lg transition-colors" 
                        :class="[
                            $route.path === '/dashboard/investors'
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-700 hover:bg-gray-50',
                            isCollapsed ? 'justify-center p-2' : 'px-3 py-2'
                        ]" 
                        :title="isCollapsed ? 'Investors' : ''"
                        @click.prevent="handleNavigation('/dashboard/investors')">
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
                        </svg>
                        <span v-if="!isCollapsed" class="ml-3">Investors</span>
                    </NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/dashboard/jobs"
                        class="flex items-center text-sm font-medium rounded-lg transition-colors" 
                        :class="[
                            $route.path === '/dashboard/jobs'
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-700 hover:bg-gray-50',
                            isCollapsed ? 'justify-center p-2' : 'px-3 py-2'
                        ]" 
                        :title="isCollapsed ? 'Jobs' : ''"
                        @click.prevent="handleNavigation('/dashboard/jobs')">
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd" />
                            <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                        </svg>
                        <span v-if="!isCollapsed" class="ml-3">Jobs</span>
                    </NuxtLink>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script setup>
import CurrencyDollarIcon from '@/shared/components/icons/currency-dollar-icon.vue'

const props = defineProps({
    user: {
        type: Object,
        default: () => ({})
    }
})

// Use localStorage to persist the collapsed state
const isCollapsed = ref(true)

// Initialize from localStorage on client side
onMounted(() => {
    if (process.client) {
        const saved = localStorage.getItem('sidebar-collapsed')
        if (saved !== null) {
            isCollapsed.value = JSON.parse(saved)
        }
    }
})

const toggleCollapse = () => {
    isCollapsed.value = !isCollapsed.value
    // Save state to localStorage
    if (process.client) {
        localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed.value))
    }
}

// Handle navigation with proper routing
const router = useRouter()
const handleNavigation = async (path) => {
    try {
        await router.push(path)
    } catch (error) {
        console.error('Navigation error:', error)
        // Fallback to window.location if router fails
        if (process.client) {
            window.location.href = path
        }
    }
}

// Watch for route changes to ensure sidebar stays visible
watch(() => useRoute().path, (newPath) => {
    // You can add any logic here if needed when route changes
    console.log('Route changed to:', newPath)
}, { immediate: true })
</script>