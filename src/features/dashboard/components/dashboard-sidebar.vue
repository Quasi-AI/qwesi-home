<template>
    <div>
        <!-- Mobile Overlay -->
        <div v-if="isMobileMenuOpen" 
             class="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity md:hidden"
             @click="closeMobileMenu"></div>

        <!-- Sidebar -->
        <div class="fixed inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out"
             :class="[
                 // Mobile styles
                 'md:relative md:translate-x-0',
                 isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
                 // Desktop styles
                 'bg-white border-r border-gray-200 min-h-screen flex flex-col',
                 isCollapsed && !isMobile ? 'w-16' : 'w-80'
             ]">
            
            <!-- Logo Section -->
            <div class="p-6 border-b border-gray-200 flex items-center justify-between">
                <NuxtLink to="/" class="hover:opacity-80 transition-opacity">
                    <img v-if="!isCollapsed || isMobile" 
                         src="~/assets/images/logo.png" 
                         alt="QWESI AI Logo" 
                         class="w-32 h-auto" />
                    <img v-else 
                         src="~/assets/images/logo.png" 
                         alt="QWESI AI Logo" 
                         class="w-8 h-auto" />
                </NuxtLink>
                
                <!-- Desktop collapse button -->
                <button v-if="!isMobile"
                        @click="toggleCollapse" 
                        class="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                        :class="isCollapsed ? 'ml-0' : 'ml-2'">
                    <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20"
                         :class="isCollapsed ? 'rotate-180' : ''">
                        <path fill-rule="evenodd"
                              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                              clip-rule="evenodd" />
                    </svg>
                </button>

                <!-- Mobile close button -->
                <button v-if="isMobile"
                        @click="closeMobileMenu"
                        class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Navigation -->
            <nav class="flex-1 overflow-y-auto" :class="(isCollapsed && !isMobile) ? 'p-2' : 'p-6'">
                <ul class="space-y-2">
                    <li v-for="item in navigationItems" :key="item.path">
                        <NuxtLink :to="item.path" 
                                  class="flex items-center text-sm font-medium rounded-lg transition-colors group"
                                  :class="[
                                      $route.path === item.path
                                          ? 'bg-blue-50 text-blue-700'
                                          : 'text-gray-700 hover:bg-gray-50',
                                      (isCollapsed && !isMobile) ? 'justify-center p-3' : 'px-3 py-2'
                                  ]" 
                                  :title="(isCollapsed && !isMobile) ? item.title : ''"
                                  @click="handleNavigation(item.path)">
                            <!-- Inline SVG icons -->
                            <svg v-if="item.key === 'dashboard'"
                                 class="w-6 h-6 flex-shrink-0"
                                 :class="$route.path === item.path ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-600'"
                                 fill="currentColor" viewBox="0 0 20 20">
                                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                            </svg>
                            
                            <svg v-else-if="item.key === 'get-started'"
                                 class="w-6 h-6 flex-shrink-0"
                                 :class="$route.path === item.path ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-600'"
                                 fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clip-rule="evenodd" />
                            </svg>
                            
                            <svg v-else-if="item.key === 'profile'"
                                 class="w-6 h-6 flex-shrink-0"
                                 :class="$route.path === item.path ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-600'"
                                 fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                            </svg>
                            
                            <svg v-else-if="item.key === 'subscription'"
                                 class="w-6 h-6 flex-shrink-0"
                                 :class="$route.path === item.path ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-600'"
                                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            
                            <svg v-else-if="item.key === 'investors'"
                                 class="w-6 h-6 flex-shrink-0"
                                 :class="$route.path === item.path ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-600'"
                                 fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
                            </svg>
                            
                            <svg v-else-if="item.key === 'jobs'"
                                 class="w-6 h-6 flex-shrink-0"
                                 :class="$route.path === item.path ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-600'"
                                 fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd" />
                                <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                            </svg>
                            
                            <span v-if="!isCollapsed || isMobile" class="ml-3 truncate">{{ item.title }}</span>
                        </NuxtLink>
                    </li>
                </ul>

                <!-- AI Qwesi Capabilities Section -->
                <div v-if="!isCollapsed || isMobile" class="mt-8">
                    <div class="mb-4">
                        <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wide">AI Qwesi Capabilities</h3>
                        <p class="text-xs text-gray-500 mt-1">Your 24/7 Career Assistant</p>
                    </div>
                    
                    <div class="space-y-3">
                        <!-- Smart Job Matching -->
                        <div class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 cursor-pointer group">
                            <div class="flex items-center mb-2">
                                <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                                <h4 class="font-semibold text-blue-900 text-sm">Smart Job Matching</h4>
                            </div>
                            <p class="text-xs text-blue-700 leading-relaxed">
                                Finds and emails job opportunities based on your skills—no more endless searching.
                            </p>
                        </div>

                        <!-- 24/7 Assistant -->
                        <div class="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3 border border-green-200 hover:from-green-100 hover:to-green-200 transition-all duration-300 cursor-pointer group">
                            <div class="flex items-center mb-2">
                                <div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                                <h4 class="font-semibold text-green-900 text-sm">24/7 Support</h4>
                            </div>
                            <p class="text-xs text-green-700 leading-relaxed">
                                Always ready to assist with questions or help preparing for work, day or night.
                            </p>
                        </div>

                        <!-- Investor Matching -->
                        <div class="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-3 border border-yellow-200 hover:from-yellow-100 hover:to-yellow-200 transition-all duration-300 cursor-pointer group">
                            <div class="flex items-center mb-2">
                                <div class="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                                    </svg>
                                </div>
                                <h4 class="font-semibold text-yellow-900 text-sm">Investor Connections</h4>
                            </div>
                            <p class="text-xs text-yellow-700 leading-relaxed">
                                Helps you meet the right investors who align with your project and vision.
                            </p>
                        </div>

                        <!-- Professional Networking -->
                        <div class="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200 hover:from-purple-100 hover:to-purple-200 transition-all duration-300 cursor-pointer group">
                            <div class="flex items-center mb-2">
                                <div class="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                                    </svg>
                                </div>
                                <h4 class="font-semibold text-purple-900 text-sm">Network Growth</h4>
                            </div>
                            <p class="text-xs text-purple-700 leading-relaxed">
                                Grow your network with professionals from industry-leading organizations.
                            </p>
                        </div>

                        <!-- Voice & WhatsApp Support -->
                        <div class="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-3 border border-red-200 hover:from-red-100 hover:to-red-200 transition-all duration-300 cursor-pointer group">
                            <div class="flex items-center mb-2">
                                <div class="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                                <h4 class="font-semibold text-red-900 text-sm">Voice & WhatsApp</h4>
                            </div>
                            <p class="text-xs text-red-700 leading-relaxed">
                                Smart conversations through voice commands and WhatsApp integration.
                            </p>
                        </div>

                        <!-- Academic & Business Support -->
                        <div class="bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-lg p-3 border border-cyan-200 hover:from-cyan-100 hover:to-cyan-200 transition-all duration-300 cursor-pointer group">
                            <div class="flex items-center mb-2">
                                <div class="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                    </svg>
                                </div>
                                <h4 class="font-semibold text-cyan-900 text-sm">Academic & Business</h4>
                            </div>
                            <p class="text-xs text-cyan-700 leading-relaxed">
                                Helps with homework, research, customer emails, proposals, and marketing plans.
                            </p>
                        </div>
                    </div>
                </div>
            </nav>

            <!-- User Section (Mobile) -->
            <div v-if="isMobile" class="p-6 border-t border-gray-200">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span class="text-sm font-medium text-blue-600">
                                {{ user?.name?.charAt(0)?.toUpperCase() || 'U' }}
                            </span>
                        </div>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm font-medium text-gray-900 truncate">{{ user?.name || 'User' }}</p>
                        <p class="text-xs text-gray-500 truncate">{{ user?.email || 'user@example.com' }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Mobile Menu Button -->
        <button v-if="isMobile"
                @click="openMobileMenu"
                class="fixed top-4 left-4 z-30 p-2 rounded-lg bg-white shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors md:hidden">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </button>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const props = defineProps({
    user: {
        type: Object,
        default: () => ({})
    }
})

// Navigation items with unique keys for icon identification
const navigationItems = [
    { path: '/dashboard', title: 'Dashboard', key: 'dashboard' },
    { path: '/dashboard/get-started', title: 'Get Started', key: 'get-started' },
    { path: '/dashboard/profile', title: 'Profile', key: 'profile' },
    { path: '/dashboard/subscription', title: 'Subscription', key: 'subscription' },
    { path: '/dashboard/investors', title: 'Investors', key: 'investors' },
    { path: '/dashboard/jobs', title: 'Jobs', key: 'jobs' }
]

// Reactive state
const isCollapsed = ref(true)
const isMobileMenuOpen = ref(false)
const windowWidth = ref(1024)

// Computed properties
const isMobile = computed(() => windowWidth.value < 768)

// Handle window resize
const updateWindowWidth = () => {
    windowWidth.value = window.innerWidth
}

// Initialize from localStorage and set up resize listener
onMounted(() => {
    if (process.client) {
        // Initialize window width
        windowWidth.value = window.innerWidth
        
        // Add resize listener
        window.addEventListener('resize', updateWindowWidth)
        
        // Initialize collapsed state from localStorage (desktop only)
        const saved = localStorage.getItem('sidebar-collapsed')
        if (saved !== null) {
            isCollapsed.value = JSON.parse(saved)
        }
    }
})

// Cleanup
onUnmounted(() => {
    if (process.client) {
        window.removeEventListener('resize', updateWindowWidth)
    }
})

// Methods
const toggleCollapse = () => {
    if (!isMobile.value) {
        isCollapsed.value = !isCollapsed.value
        if (process.client) {
            localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed.value))
        }
    }
}

const openMobileMenu = () => {
    isMobileMenuOpen.value = true
    // Prevent body scroll when menu is open
    if (process.client) {
        document.body.style.overflow = 'hidden'
    }
}

const closeMobileMenu = () => {
    isMobileMenuOpen.value = false
    // Restore body scroll
    if (process.client) {
        document.body.style.overflow = ''
    }
}

// Handle navigation
const router = useRouter()
const handleNavigation = async (path) => {
    // Close mobile menu when navigating
    if (isMobile.value) {
        closeMobileMenu()
    }
    
    try {
        await router.push(path)
    } catch (error) {
        console.error('Navigation error:', error)
        if (process.client) {
            window.location.href = path
        }
    }
}

// Close mobile menu when route changes
const route = useRoute()
watch(() => route.path, () => {
    if (isMobile.value && isMobileMenuOpen.value) {
        closeMobileMenu()
    }
}, { immediate: true })

// Close mobile menu on escape key
onMounted(() => {
    if (process.client) {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isMobileMenuOpen.value) {
                closeMobileMenu()
            }
        }
        document.addEventListener('keydown', handleEscape)
        
        onUnmounted(() => {
            document.removeEventListener('keydown', handleEscape)
        })
    }
})
</script>

<style scoped>
/* Ensure smooth transitions */
.transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Custom scrollbar for navigation */
nav::-webkit-scrollbar {
    width: 4px;
}

nav::-webkit-scrollbar-track {
    background: transparent;
}

nav::-webkit-scrollbar-thumb {
    background: rgba(156, 163, 175, 0.5);
    border-radius: 2px;
}

nav::-webkit-scrollbar-thumb:hover {
    background: rgba(156, 163, 175, 0.7);
}
</style>