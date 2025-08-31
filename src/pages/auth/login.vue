<template>
    <div class="min-h-screen flex relative overflow-hidden">
        <!-- Animated Background -->
        <div class="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
            <!-- Floating Orbs -->
            <div class="absolute top-20 left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-float"></div>
            <div class="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-float-delayed"></div>
            <div class="absolute top-1/2 left-1/3 w-48 h-48 bg-indigo-500/15 rounded-full blur-2xl animate-pulse"></div>
            
            <!-- Grid Pattern -->
            <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0); background-size: 50px 50px;"></div>
        </div>

        <!-- Back Button -->
        <BackButton class="absolute top-6 left-6 z-20 text-white hover:text-blue-300 transition-colors" />

        <!-- Left Side - Login Form -->
        <div class="relative w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 z-10">
            <div class="max-w-md w-full">
                <!-- Glassmorphism Card -->
                <div class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                    <!-- Logo and Header -->
                    <div class="text-center mb-8">
                        <div class="relative inline-block mb-6">
                            <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-50 animate-pulse"></div>
                            <img src="~/assets/images/qwesi-head.png" alt="QWESI AI Logo"
                                class="relative w-24 h-24 object-cover mx-auto rounded-full border-2 border-white/30 shadow-xl" />
                        </div>
                        <h2 class="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Welcome Back
                        </h2>
                        <p class="text-slate-300 text-lg">Sign in to unlock AI possibilities</p>
                    </div>

                    <!-- Login Form -->
                    <form class="space-y-6" @submit.prevent="handleLogin">
                        <!-- Error Message -->
                        <div v-if="error" class="bg-red-500/20 border border-red-400/30 rounded-xl p-4 backdrop-blur-sm">
                            <div class="flex items-center space-x-2">
                                <svg class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                </svg>
                                <p class="text-sm text-red-300">{{ error }}</p>
                            </div>
                        </div>

                        <!-- Phone Number Input -->
                        <div class="space-y-2">
                            <label for="phone" class="block text-sm font-semibold text-white">
                                Phone Number
                            </label>
                            <div class="flex space-x-3">
                                <div class="w-1/3">
                                    <CountryCodeSelector v-model="form.countryCode" 
                                        class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 hover:bg-white/15" />
                                </div>
                                <div class="flex-1 relative group">
                                    <input id="phone" v-model="form.phoneNumber" type="tel" required
                                        class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 hover:bg-white/15"
                                        placeholder="Enter phone number" />
                                    <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                                </div>
                            </div>
                        </div>

                        <!-- Password Input -->
                        <div class="space-y-2">
                            <label for="password" class="block text-sm font-semibold text-white">
                                Password
                            </label>
                            <div class="relative group">
                                <input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'"
                                    required
                                    class="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 hover:bg-white/15"
                                    placeholder="Enter your password" />
                                <button type="button" @click="showPassword = !showPassword"
                                    class="absolute inset-y-0 right-0 pr-4 flex items-center hover:scale-110 transition-transform duration-200">
                                    <svg v-if="showPassword" class="h-5 w-5 text-slate-400 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21">
                                        </path>
                                    </svg>
                                    <svg v-else class="h-5 w-5 text-slate-400 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                                        </path>
                                    </svg>
                                </button>
                                <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                            </div>
                        </div>

                        <!-- Remember Me & Forgot Password -->
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <div class="relative">
                                    <input id="remember-me" v-model="form.rememberMe" type="checkbox"
                                        class="sr-only" />
                                    <label for="remember-me" class="flex items-center cursor-pointer group">
                                        <div class="w-5 h-5 bg-white/10 border border-white/30 rounded-md flex items-center justify-center group-hover:bg-white/20 transition-all duration-200"
                                             :class="{ 'bg-gradient-to-r from-blue-500 to-purple-600 border-transparent': form.rememberMe }">
                                            <svg v-if="form.rememberMe" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                            </svg>
                                        </div>
                                        <span class="ml-3 text-sm text-slate-300 group-hover:text-white transition-colors">
                                            Remember me
                                        </span>
                                    </label>
                                </div>
                            </div>
                            <NuxtLink to="/auth/forgot-password" 
                                class="text-sm text-blue-400 hover:text-blue-300 transition-colors relative group">
                                <span>Forgot password?</span>
                                <div class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
                            </NuxtLink>
                        </div>

                        <!-- Submit Button -->
                        <button type="submit" :disabled="loading || !isFormValid"
                            class="group relative w-full overflow-hidden rounded-xl transition-all duration-300 transform hover:scale-[1.02] focus:scale-[1.02] disabled:scale-100">
                            <div class="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-size-200 bg-pos-0 group-hover:bg-pos-100 transition-all duration-500"></div>
                            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div class="relative px-6 py-4 flex items-center justify-center space-x-2">
                                <svg v-if="loading" class="w-5 h-5 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                                </svg>
                                <span class="font-semibold text-white">
                                    {{ loading ? 'Signing in...' : 'Sign In to QWESI' }}
                                </span>
                                <svg v-if="!loading" class="w-5 h-5 text-white group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                                </svg>
                            </div>
                        </button>

                        <!-- Divider -->
                        <div class="relative my-8">
                            <div class="absolute inset-0 flex items-center">
                                <div class="w-full border-t border-white/20"></div>
                            </div>
                            <div class="relative flex justify-center">
                                <span class="bg-gradient-to-r from-slate-900 to-blue-900 px-4 text-sm text-slate-400">or</span>
                            </div>
                        </div>

                        <!-- Sign Up Link -->
                        <div class="text-center">
                            <p class="text-slate-300 text-sm mb-3">
                                New to QWESI AI?
                            </p>
                            <NuxtLink to="/auth/signup" 
                                class="group inline-flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-xl text-white font-medium transition-all duration-300 transform hover:scale-105">
                                <svg class="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                                </svg>
                                <span>Create Account</span>
                                <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                </svg>
                            </NuxtLink>
                        </div>
                    </form>
                </div>

                <!-- Trust Indicators -->
                <div class="mt-8 flex justify-center space-x-8 text-slate-400">
                    <div class="flex items-center space-x-2 group">
                        <div class="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                            <svg class="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 1L3 5v6c0 5.55 3.84 9.95 9 11 5.16-1.05 9-5.45 9-11V5l-9-4z"/>
                            </svg>
                        </div>
                        <span class="text-xs group-hover:text-slate-300 transition-colors">Secure</span>
                    </div>
                    <div class="flex items-center space-x-2 group">
                        <div class="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                            <svg class="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                        </div>
                        <span class="text-xs group-hover:text-slate-300 transition-colors">Trusted</span>
                    </div>
                    <div class="flex items-center space-x-2 group">
                        <div class="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                            <svg class="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0013 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/>
                            </svg>
                        </div>
                        <span class="text-xs group-hover:text-slate-300 transition-colors">24/7</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Right Side - Enhanced Auth Sidebar -->
        <div class="hidden lg:flex lg:w-1/2 relative">
            <!-- Enhanced AuthSidebar with overlay -->

            <!-- Floating Feature Cards -->
            <div class="absolute inset-0 z-20 flex items-center justify-center p-12">
                <div class="space-y-6 max-w-sm">
                    <div class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 transform hover:scale-105 transition-all duration-300 hover:bg-white/15">
                        <div class="flex items-center space-x-4 mb-3">
                            <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                </svg>
                            </div>
                            <h3 class="text-white font-bold">Lightning Fast</h3>
                        </div>
                        <p class="text-slate-300 text-sm">Experience AI responses at the speed of thought with our optimized infrastructure.</p>
                    </div>
                    
                    <div class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 transform hover:scale-105 transition-all duration-300 hover:bg-white/15" style="animation-delay: 0.2s;">
                        <div class="flex items-center space-x-4 mb-3">
                            <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <h3 class="text-white font-bold">Always Secure</h3>
                        </div>
                        <p class="text-slate-300 text-sm">Your data is protected with enterprise-grade encryption and privacy controls.</p>
                    </div>
                    
                    <div class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 transform hover:scale-105 transition-all duration-300 hover:bg-white/15" style="animation-delay: 0.4s;">
                        <div class="flex items-center space-x-4 mb-3">
                            <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                                </svg>
                            </div>
                            <h3 class="text-white font-bold">Made for You</h3>
                        </div>
                        <p class="text-slate-300 text-sm">Personalized AI experiences that adapt and learn from your unique needs.</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Particle Effects -->
        <div class="absolute inset-0 pointer-events-none">
            <div class="particle absolute top-1/4 left-1/4 w-1 h-1 bg-blue-400 rounded-full animate-ping" style="animation-delay: 0s;"></div>
            <div class="particle absolute top-3/4 left-1/3 w-1 h-1 bg-purple-400 rounded-full animate-ping" style="animation-delay: 1s;"></div>
            <div class="particle absolute top-1/2 right-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-ping" style="animation-delay: 2s;"></div>
            <div class="particle absolute bottom-1/4 right-1/3 w-1 h-1 bg-pink-400 rounded-full animate-ping" style="animation-delay: 3s;"></div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/features/auth/stores/auth.store'
import BackButton from '@/shared/components/ui/back-button.vue'
import AuthSidebar from '~/features/auth/components/auth-sidebar.vue'
import CountryCodeSelector from '~/shared/components/ui/country-code-selector.vue'

const router = useRouter()
const goBack = () => router.back()

const authStore = useAuthStore()
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)

const form = ref({
    countryCode: '',
    phoneNumber: '',
    password: '',
    rememberMe: false
})

// Form validation
const isFormValid = computed(() => {
    return form.value.countryCode &&
        form.value.phoneNumber &&
        form.value.password
})

const handleLogin = async () => {
    loading.value = true
    error.value = ''

    try {
        // Format the phone number with country code (CountryCodeSelector provides + prefix)
        let fullPhone = `${form.value.countryCode}${form.value.phoneNumber.replace(/\D/g, '')}`

        // Ensure exactly one plus sign at the beginning
        fullPhone = fullPhone.replace(/^\+*/, '+')

        const result = await authStore.login({
            phone: fullPhone,
            password: form.value.password
        })

        if (result.success) {
            // Check if there's a redirect URL stored
            const redirectUrl = localStorage.getItem('redirect_after_login')
            if (redirectUrl) {
                localStorage.removeItem('redirect_after_login')
                await navigateTo(redirectUrl)
            } else {
                await navigateTo('/dashboard')
            }
        } else {
            error.value = result.error || 'Login failed'
        }
    } catch (err) {
        console.error('Login error:', err)
        error.value = 'An unexpected error occurred'
    } finally {
        loading.value = false
    }
}

// Check if user is already logged in
onMounted(() => {
    if (authStore.isAuthenticated) {
        const redirectUrl = localStorage.getItem('redirect_after_login')
        if (redirectUrl) {
            localStorage.removeItem('redirect_after_login')
            navigateTo(redirectUrl)
        } else {
            navigateTo('/dashboard')
        }
    }
})

// Set page title
useHead({
    title: 'Login - QWESI AI'
})
</script>

<style scoped>
@keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
}

@keyframes float-delayed {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-15px) rotate(-3deg); }
}

.animate-float {
    animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
    animation: float-delayed 8s ease-in-out infinite;
}

.bg-size-200 {
    background-size: 200% 100%;
}

.bg-pos-0 {
    background-position: 0% 50%;
}

.bg-pos-100 {
    background-position: 100% 50%;
}

/* Custom scrollbar for better aesthetics */
::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
}

::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
    border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #2563eb, #7c3aed);
}

/* Form focus glow effect */
input:focus {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1), 0 0 20px rgba(59, 130, 246, 0.2);
}

/* Particle animation */
@keyframes ping-custom {
    0% {
        transform: scale(1);
        opacity: 1;
    }
    75%, 100% {
        transform: scale(2);
        opacity: 0;
    }
}

.particle {
    animation: ping-custom 4s cubic-bezier(0, 0, 0.2, 1) infinite;
}
</style>