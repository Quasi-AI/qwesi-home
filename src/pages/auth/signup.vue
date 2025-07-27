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

        <!-- Left Side - Signup Form -->
        <div class="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
            <div class="max-w-md w-full space-y-8">
                <!-- Logo and Header -->
                <div class="text-center">
                    <img src="@/assets/images/qwesi-head.png" alt="QWESI AI Logo"
                        class="w-32 h-32 object-cover mx-auto rounded-full border mb-8" />
                    <h2 class="text-3xl font-bold text-gray-900 mb-2">Create your account</h2>
                    <p class="text-gray-600">Join Qwesi AI and start your journey</p>
                </div>

                <!-- Signup Form -->
                <form class="space-y-6" @submit.prevent="handleSignup">
                    <!-- Error Message -->
                    <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p class="text-sm text-red-600">{{ error }}</p>
                    </div>

                    <!-- Success Message -->
                    <div v-if="success" class="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p class="text-sm text-green-600">{{ success }}</p>
                    </div>

                    <div>
                        <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                        </label>
                        <input id="name" v-model="form.name" type="text" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter your full name" />
                    </div>

                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                            Email address
                        </label>
                        <input id="email" v-model="form.email" type="email" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter your email" />
                    </div>

                    <div>
                        <label for="dob" class="block text-sm font-medium text-gray-700 mb-2">
                            Date of Birth
                        </label>
                        <input id="dob" v-model="form.dob" type="date" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>

                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div class="relative">
                            <input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'"
                                required
                                class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Create a password" />
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

                    <div>
                        <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password
                        </label>
                        <div class="relative">
                            <input id="confirmPassword" v-model="form.confirmPassword"
                                :type="showConfirmPassword ? 'text' : 'password'" required
                                class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Confirm your password" />
                            <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                                class="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <svg v-if="showConfirmPassword" class="h-5 w-5 text-gray-400" fill="none"
                                    stroke="currentColor" viewBox="0 0 24 24">
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

                    <div class="flex items-center">
                        <input id="terms" v-model="form.acceptTerms" type="checkbox" required
                            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                        <label for="terms" class="ml-2 block text-sm text-gray-700">
                            I agree to the
                            <a href="#" class="text-blue-600 hover:text-blue-500">Terms of Service</a>
                            and
                            <a href="#" class="text-blue-600 hover:text-blue-500">Privacy Policy</a>
                        </label>
                    </div>

                    <button type="submit"
                        :disabled="loading || !form.acceptTerms || !isFormValid || form.password !== form.confirmPassword"
                        class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        <span v-if="loading">Creating account...</span>
                        <span v-else>Create account</span>
                    </button>

                    <div class="text-center">
                        <p class="text-sm text-gray-600">
                            Already have an account?
                            <NuxtLink to="/auth/login" class="text-blue-600 hover:text-blue-500 font-medium">
                                Sign in
                            </NuxtLink>
                        </p>
                    </div>
                </form>
            </div>
        </div>

        <!-- Right Side - Cover Image -->
        <AuthSidebar />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

import { useAuthStore } from '~/stores/auth'


const authStore = useAuthStore()
const loading = ref(false)
const error = ref('')
const success = ref('')

const form = ref({
    name: '',
    email: '',
    dob: '',
    password: '',
    confirmPassword: '',
    countryCode: '',
    phoneNumber: '',
    acceptTerms: false
})

// Form validation
const isFormValid = computed(() => {
    return form.value.name &&
        form.value.email &&
        form.value.dob &&
        form.value.password &&
        form.value.confirmPassword &&
        form.value.countryCode &&
        form.value.phoneNumber &&
        form.value.password === form.value.confirmPassword
})

// Password visibility toggles
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Format date for API (DD/MM/YYYY)
const formatDate = (dateString) => {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
}

const handleSignup = async () => {
    loading.value = true
    error.value = ''
    success.value = ''

    try {
        // Validate passwords match
        if (form.value.password !== form.value.confirmPassword) {
            error.value = 'Passwords do not match'
            return
        }

        // Format the phone number with country code (CountryCodeSelector provides + prefix)
        let fullPhone = `${form.value.countryCode}${form.value.phoneNumber.replace(/\D/g, '')}`

        // Ensure exactly one plus sign at the beginning
        fullPhone = fullPhone.replace(/^\+*/, '+')

        // Format the date
        const formattedDob = formatDate(form.value.dob)

        const signupData = {
            phone: fullPhone,
            name: form.value.name,
            dob: formattedDob,
            email: form.value.email,
            password: form.value.password
        }

        const result = await authStore.signup(signupData)

        if (result.success) {
            success.value = result.message || 'Account created successfully! Please check your phone for login credentials.'
            // Clear form
            form.value = {
                name: '',
                email: '',
                dob: '',
                password: '',
                confirmPassword: '',
                countryCode: '',
                phoneNumber: '',
                acceptTerms: false
            }

            // Redirect to login after a short delay
            setTimeout(() => {
                navigateTo('/auth/login')
            }, 3000)
        } else {
            error.value = result.error || 'Signup failed'
        }
    } catch (err) {
        console.error('Signup error:', err)
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
    title: 'Sign Up - QWESI AI'
})
</script>