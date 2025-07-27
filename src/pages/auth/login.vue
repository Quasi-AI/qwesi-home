<template>
    <div class="min-h-screen flex">
        <!-- Back Button -->
        <div class="absolute top-6 left-6 z-10">
            <NuxtLink to="/"
                class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Back to Home
            </NuxtLink>
        </div>

        <!-- Left Side - Login Form -->
        <div class="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
            <div class="max-w-md w-full space-y-8">
                <!-- Logo and Header -->
                <div class="text-center">
                    <img src="@/assets/images/qwesi-head.png" alt="QWESI AI Logo"
                        class="w-32 h-32 object-cover mx-auto rounded-full border mb-8" />
                    <h2 class="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
                    <p class="text-gray-600">Sign in to your Qwesi AI account</p>
                </div>

                <!-- Login Form -->
                <form class="space-y-6" @submit.prevent="handleLogin">
                    <!-- Error Message -->
                    <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p class="text-sm text-red-600">{{ error }}</p>
                    </div>

                    <div>
                        <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                        </label>
                        <div class="flex space-x-2">
                            <div class="w-1/3">
                                <CountryCodeSelector v-model="form.countryCode" />
                            </div>
                            <div class="flex-1">
                                <input id="phone" v-model="form.phoneNumber" type="tel" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter phone number" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div class="relative">
                            <input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'"
                                required
                                class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter your password" />
                            <button type="button" @click="showPassword = !showPassword"
                                class="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <svg v-if="showPassword" class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21">
                                    </path>
                                </svg>
                                <svg v-else class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                                    </path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <input id="remember-me" v-model="form.rememberMe" type="checkbox"
                                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                            <label for="remember-me" class="ml-2 block text-sm text-gray-700">
                                Remember me
                            </label>
                        </div>
                        <NuxtLink to="/auth/forgot-password" class="text-sm text-blue-600 hover:text-blue-500">
                            Forgot password?
                        </NuxtLink>
                    </div>

                    <button type="submit" :disabled="loading || !isFormValid"
                        class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        <span v-if="loading">Signing in...</span>
                        <span v-else>Sign in</span>
                    </button>

                    <div class="text-center">
                        <p class="text-sm text-gray-600">
                            Don't have an account?
                            <NuxtLink to="/auth/signup" class="text-blue-600 hover:text-blue-500 font-medium">
                                Sign up
                            </NuxtLink>
                        </p>
                    </div>
                </form>
            </div>
        </div>

        <!-- Right Side - Cover Image -->
        <div class="hidden lg:block lg:w-1/2 bg-gray-50 border-l">
            <div class="h-full flex items-center justify-center p-8">
                <img src="@/assets/images/qwesi-image.png" alt="QWESI AI Assistant"
                    class="w-64 h-auto object-contain rounded-2xl animate-breathing" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const router = useRouter()
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
                await router.push(redirectUrl)
            } else {
                await router.push('/dashboard')
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
            router.push(redirectUrl)
        } else {
            router.push('/dashboard')
        }
    }
})

// Set page title
useHead({
    title: 'Login - QWESI AI'
})
</script>