<template>
    <div>
        <!-- Mobile Overlay -->
        <div v-if="isMobileMenuOpen" 
             class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-all duration-300 md:hidden"
             @click="closeMobileMenu"></div>

        <!-- Sidebar -->
        <div class="fixed inset-y-0 left-0 z-50 transition-all duration-300 ease-out flex flex-col"
             :class="[
                 // Mobile styles
                 'md:relative md:translate-x-0',
                 isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
                 // Desktop styles
                 'bg-gradient-to-b from-slate-50 to-white border-r border-slate-200/60 min-h-screen shadow-xl',
                 isCollapsed && !isMobile ? 'w-20' : 'w-80'
             ]">
            
            <!-- Logo Section -->
            <div class="flex-shrink-0 p-6 border-b border-slate-200/60 flex items-center justify-between bg-white/50 backdrop-blur-sm">
                <NuxtLink to="/" class="hover:opacity-80 transition-all duration-200 transform hover:scale-105">
                    <img v-if="!isCollapsed || isMobile" 
                         src="~/assets/images/logo.png" 
                         alt="QWESI AI Logo" 
                         class="w-36 h-auto drop-shadow-sm" />
                    <img v-else 
                         src="~/assets/images/logo.png" 
                         alt="QWESI AI Logo" 
                         class="w-10 h-auto drop-shadow-sm" />
                </NuxtLink>
                
                <!-- Desktop collapse button -->
                <button v-if="!isMobile"
                        @click="toggleCollapse" 
                        class="p-2.5 rounded-xl hover:bg-slate-100/70 transition-all duration-200 flex-shrink-0 group"
                        :class="isCollapsed ? 'ml-0' : 'ml-2'">
                    <svg class="w-4 h-4 text-slate-600 transition-all duration-300 group-hover:text-slate-800" 
                         fill="currentColor" 
                         viewBox="0 0 20 20"
                         :class="isCollapsed ? 'rotate-180' : ''">
                        <path fill-rule="evenodd"
                              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                              clip-rule="evenodd" />
                    </svg>
                </button>

                <!-- Mobile close button -->
                <button v-if="isMobile"
                        @click="closeMobileMenu"
                        class="p-2.5 rounded-xl hover:bg-slate-100/70 transition-all duration-200 flex-shrink-0">
                    <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Navigation - Scrollable Container -->
            <div class="flex-1 flex flex-col min-h-0">
                <nav class="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar" 
                     :class="(isCollapsed && !isMobile) ? 'p-3' : 'p-6'">
                    
                    <!-- Main Navigation -->
                    <div class="space-y-6">
                        <!-- Dashboard Section -->
                        <div>
                            <h3 v-if="!isCollapsed || isMobile" class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 pl-4">Main</h3>
                            <ul class="space-y-2">
                                <li v-for="item in mainNavigation" :key="item.path">
                                    <NuxtLink :to="item.path" 
                                              class="flex items-center text-sm font-medium rounded-2xl transition-all duration-200 group w-full relative overflow-hidden"
                                              :class="[
                                                  $route.path === item.path
                                                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                                                      : 'text-slate-700 hover:bg-slate-100/70 hover:shadow-md',
                                                  (isCollapsed && !isMobile) ? 'justify-center p-4' : 'px-4 py-3'
                                              ]" 
                                              :title="(isCollapsed && !isMobile) ? item.title : ''"
                                              @click="handleNavigation(item.path)">
                                        
                                        <!-- Active indicator -->
                                        <div v-if="$route.path === item.path" 
                                             class="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-600/20 animate-pulse"></div>
                                        
                                        <!-- Dashboard Icon -->
                                        <svg v-if="item.key === 'dashboard'"
                                             class="w-5 h-5 flex-shrink-0 transition-all duration-200 relative z-10"
                                             :class="$route.path === item.path ? 'text-white drop-shadow-sm' : 'text-slate-500 group-hover:text-slate-700'"
                                             fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                                        </svg>
                                        
                                        <!-- Get Started Icon -->
                                        <svg v-else-if="item.key === 'get-started'"
                                             class="w-5 h-5 flex-shrink-0 transition-all duration-200 relative z-10"
                                             :class="$route.path === item.path ? 'text-white drop-shadow-sm' : 'text-slate-500 group-hover:text-slate-700'"
                                             fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                        </svg>
                                        
                                        <!-- Profile Icon -->
                                        <svg v-else-if="item.key === 'profile'"
                                             class="w-5 h-5 flex-shrink-0 transition-all duration-200 relative z-10"
                                             :class="$route.path === item.path ? 'text-white drop-shadow-sm' : 'text-slate-500 group-hover:text-slate-700'"
                                             fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                        </svg>
                                        
                                        <!-- Subscription Icon -->
                                        <svg v-else-if="item.key === 'subscription'"
                                             class="w-5 h-5 flex-shrink-0 transition-all duration-200 relative z-10"
                                             :class="$route.path === item.path ? 'text-white drop-shadow-sm' : 'text-slate-500 group-hover:text-slate-700'"
                                             fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-4h2v2h-2zm1.61-9.96c-2.06-.3-3.88.97-4.43 2.79-.18.58.26 1.17.87 1.17h.2c.41 0 .74-.29.88-.67.32-.89 1.27-1.5 2.3-1.28.95.2 1.65 1.13 1.57 2.1-.1 1.34-1.62 1.63-2.45 2.88 0 .01-.01.01-.01.02-.01.02-.02.03-.02.05C11.38 15.33 11.24 16 11.99 16h.26c.83 0 1.26-.58 1.72-1.24.12-.18.25-.34.41-.49.49-.46.98-1.05 1.12-1.79.15-.86-.28-1.76-.99-2.30-.49-.38-1.1-.58-1.73-.65-.27-.03-.55-.04-.83-.01z"/>
                                        </svg>
                                        
                                        <span v-if="!isCollapsed || isMobile" 
                                              class="ml-3 truncate transition-all duration-200 relative z-10 font-medium">
                                            {{ item.title }}
                                        </span>

                                        <!-- Hover effect -->
                                        <div class="absolute inset-0 bg-gradient-to-r from-slate-100/50 to-slate-200/50 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-2xl"></div>
                                    </NuxtLink>
                                </li>
                            </ul>
                        </div>

                        <!-- Discover Section -->
                        <div>
                            <h3 v-if="!isCollapsed || isMobile" class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 pl-4">Discover</h3>
                            <ul class="space-y-2">
                                <li v-for="item in discoverNavigation" :key="item.path">
                                    <NuxtLink :to="item.path" 
                                              class="flex items-center text-sm font-medium rounded-2xl transition-all duration-200 group w-full relative overflow-hidden"
                                              :class="[
                                                  $route.path === item.path
                                                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                                                      : 'text-slate-700 hover:bg-slate-100/70 hover:shadow-md',
                                                  (isCollapsed && !isMobile) ? 'justify-center p-4' : 'px-4 py-3'
                                              ]" 
                                              :title="(isCollapsed && !isMobile) ? item.title : ''"
                                              @click="handleNavigation(item.path)">
                                        
                                        <!-- Active indicator -->
                                        <div v-if="$route.path === item.path" 
                                             class="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-600/20 animate-pulse"></div>
                                        
                                        <!-- Investors Icon -->
                                        <svg v-if="item.key === 'investors'"
                                             class="w-5 h-5 flex-shrink-0 transition-all duration-200 relative z-10"
                                             :class="$route.path === item.path ? 'text-white drop-shadow-sm' : 'text-slate-500 group-hover:text-slate-700'"
                                             fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                                        </svg>
                                        
                                        <!-- Jobs Icon -->
                                        <svg v-else-if="item.key === 'jobs'"
                                             class="w-5 h-5 flex-shrink-0 transition-all duration-200 relative z-10"
                                             :class="$route.path === item.path ? 'text-white drop-shadow-sm' : 'text-slate-500 group-hover:text-slate-700'"
                                             fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/>
                                        </svg>
                                        
                                        <span v-if="!isCollapsed || isMobile" 
                                              class="ml-3 truncate transition-all duration-200 relative z-10 font-medium">
                                            {{ item.title }}
                                        </span>

                                        <!-- Hover effect -->
                                        <div class="absolute inset-0 bg-gradient-to-r from-slate-100/50 to-slate-200/50 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-2xl"></div>
                                    </NuxtLink>
                                </li>
                            </ul>
                        </div>

                        <!-- Registration Section -->
                        <div>
                            <h3 v-if="!isCollapsed || isMobile" class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 pl-4">Registration</h3>
                            <ul class="space-y-2">
                                <li v-for="item in registrationNavigation" :key="item.path">
                                    <NuxtLink :to="item.path" 
                                              class="flex items-center text-sm font-medium rounded-2xl transition-all duration-200 group w-full relative overflow-hidden"
                                              :class="[
                                                  $route.path === item.path
                                                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                                                      : 'text-slate-700 hover:bg-slate-100/70 hover:shadow-md',
                                                  (isCollapsed && !isMobile) ? 'justify-center p-4' : 'px-4 py-3'
                                              ]" 
                                              :title="(isCollapsed && !isMobile) ? item.title : ''"
                                              @click="handleNavigation(item.path)">
                                        
                                        <!-- Active indicator -->
                                        <div v-if="$route.path === item.path" 
                                             class="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-600/20 animate-pulse"></div>
                                        
                                        <!-- Job Seeker Icon -->
                                        <svg v-if="item.key === 'job'"
                                             class="w-5 h-5 flex-shrink-0 transition-all duration-200 relative z-10"
                                             :class="$route.path === item.path ? 'text-white drop-shadow-sm' : 'text-slate-500 group-hover:text-slate-700'"
                                             fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.998 1.998 0 0 0 18.06 7c-.8 0-1.54.5-1.85 1.26l-1.92 5.75c-.34 1.05.28 2.17 1.33 2.51.18.06.38.09.58.08.26 0 .51-.05.75-.15L18 17v5h2zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zm1.5 1h-4c-.83 0-1.5.67-1.5 1.5v6h2v7h3v-7h2v-6c0-.83-.67-1.5-1.5-1.5z"/>
                                        </svg>

                                        <!-- Investor Registration Icon -->
                                        <svg v-else-if="item.key === 'investor-reg'"
                                             class="w-5 h-5 flex-shrink-0 transition-all duration-200 relative z-10"
                                             :class="$route.path === item.path ? 'text-white drop-shadow-sm' : 'text-slate-500 group-hover:text-slate-700'"
                                             fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM7.07 18.28c.43-.9 3.05-1.78 4.93-1.78s4.51.88 4.93 1.78C15.57 19.36 13.86 20 12 20s-3.57-.64-4.93-1.72zm11.29-1.45c-1.43-1.74-4.9-2.33-6.36-2.33s-4.93.59-6.36 2.33C4.62 15.49 4 13.82 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 1.82-.62 3.49-1.64 4.83zM12 6c-1.94 0-3.5 1.56-3.5 3.5S10.06 13 12 13s3.5-1.56 3.5-3.5S13.94 6 12 6zm0 5c-.83 0-1.5-.67-1.5-1.5S11.17 8 12 8s1.5.67 1.5 1.5S12.83 11 12 11z"/>
                                        </svg>

                                        <!-- Employer Registration Icon -->
                                        <svg v-else-if="item.key === 'employer-reg'"
                                             class="w-5 h-5 flex-shrink-0 transition-all duration-200 relative z-10"
                                             :class="$route.path === item.path ? 'text-white drop-shadow-sm' : 'text-slate-500 group-hover:text-slate-700'"
                                             fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
                                        </svg>

                                        <!-- Pitch Competition Icon -->
                                        <svg v-else-if="item.key === 'pitch-reg'"
                                             class="w-5 h-5 flex-shrink-0 transition-all duration-200 relative z-10"
                                             :class="$route.path === item.path ? 'text-white drop-shadow-sm' : 'text-slate-500 group-hover:text-slate-700'"
                                             fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                        </svg>
                                        
                                        <span v-if="!isCollapsed || isMobile" 
                                              class="ml-3 truncate transition-all duration-200 relative z-10 font-medium">
                                            {{ item.title }}
                                        </span>

                                        <!-- Hover effect -->
                                        <div class="absolute inset-0 bg-gradient-to-r from-slate-100/50 to-slate-200/50 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-2xl"></div>
                                    </NuxtLink>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <!-- AI Qwesi Capabilities Section -->
                    <!-- <div v-if="!isCollapsed || isMobile" class="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100/60">
                        <div class="flex items-start space-x-3">
                            <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 16.5v-9l7 4.5-7 4.5z"/>
                                </svg>
                            </div>
                            <div>
                                <h4 class="text-sm font-semibold text-slate-800">AI-Powered Features</h4>
                                <p class="text-xs text-slate-600 mt-1">Smart matching, screening, and recruitment tools</p>
                            </div>
                        </div>
                    </div> -->
                </nav>
            </div>

            <!-- User Section (Mobile) -->
            <div v-if="isMobile" class="flex-shrink-0 p-6 border-t border-slate-200/60 bg-white/70 backdrop-blur-sm">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                            <span class="text-sm font-bold text-white drop-shadow-sm">
                                {{ user?.name?.charAt(0)?.toUpperCase() || 'U' }}
                            </span>
                        </div>
                    </div>
                    <div class="ml-4 min-w-0 flex-1">
                        <p class="text-sm font-bold text-slate-900 truncate">{{ user?.name || 'User' }}</p>
                        <p class="text-xs text-slate-500 truncate">{{ user?.email || 'user@example.com' }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Mobile Menu Button -->
        <button v-if="isMobile"
                @click="openMobileMenu"
                class="fixed top-6 left-6 z-30 p-3 rounded-2xl bg-white/90 backdrop-blur-sm shadow-2xl border border-slate-200/60 hover:bg-white transition-all duration-200 md:hidden group">
            <svg class="w-6 h-6 text-slate-700 group-hover:text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 12h16M4 18h16" />
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

// Categorized navigation items
const mainNavigation = [
    { path: '/dashboard', title: 'Dashboard', key: 'dashboard' },
    { path: '/dashboard/get-started', title: 'Get Started', key: 'get-started' },
    { path: '/dashboard/profile', title: 'Profile', key: 'profile' },
    { path: '/dashboard/subscription', title: 'Subscription Plan', key: 'subscription' }
]

const discoverNavigation = [
    { path: '/dashboard/investors', title: 'Find Investors', key: 'investors' },
    { path: '/dashboard/jobs', title: 'All Jobs', key: 'jobs' }
]

const registrationNavigation = [
    { path: '/dashboard/job-seeker', title: 'Job Seeker Registration', key: 'job' },
    { path: '/dashboard/investor-registration', title: 'Investor Registration', key: 'investor-reg' },
    { path: '/dashboard/employer-registration', title: 'Employer Registration', key: 'employer-reg' },
    { path: '/dashboard/pitch', title: 'Pitch Competition', key: 'pitch-reg' }
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
        windowWidth.value = window.innerWidth
        window.addEventListener('resize', updateWindowWidth)
        
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
    if (process.client) {
        document.body.style.overflow = 'hidden'
    }
}

const closeMobileMenu = () => {
    isMobileMenuOpen.value = false
    if (process.client) {
        document.body.style.overflow = ''
    }
}

// Handle navigation
const router = useRouter()
const handleNavigation = async (path) => {
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
/* Custom scrollbar styling */
.custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(148, 163, 184, 0.3) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, rgba(148, 163, 184, 0.3), rgba(148, 163, 184, 0.5));
    border-radius: 3px;
    transition: all 0.3s ease;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, rgba(148, 163, 184, 0.5), rgba(148, 163, 184, 0.7));
}

/* Smooth transitions */
.transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Advanced hover effects */
@keyframes subtle-bounce {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

.group:hover .animate-bounce-subtle {
    animation: subtle-bounce 0.6s ease-in-out;
}

/* Backdrop blur support */
@supports (backdrop-filter: blur(12px)) {
    .backdrop-blur-sm {
        backdrop-filter: blur(12px);
    }
}

/* Focus states for accessibility */
.focus-visible:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
    border-radius: 0.75rem;
}

/* Mobile optimizations */
@media (max-width: 767px) {
    .sidebar-mobile {
        transform: translateX(0) !important;
    }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
    .border-slate-200\/60 {
        border-color: #64748b;
    }
    
    .bg-gradient-to-b {
        background: #f8fafc;
    }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
    .transition-all,
    .transition-transform,
    .transition-colors {
        transition: none;
    }
    
    .animate-pulse {
        animation: none;
    }
}

/* Loading skeleton */
.skeleton {
    background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
}

@keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

/* Ensure consistent height for scrollable container */
.min-h-0 {
    min-height: 0;
}
</style>