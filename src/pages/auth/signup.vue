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

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
                                First name
                            </label>
                            <input id="firstName" v-model="form.firstName" type="text" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="First name" />
                        </div>
                        <div>
                            <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
                                Last name
                            </label>
                            <input id="lastName" v-model="form.lastName" type="text" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Last name" />
                        </div>
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
                        <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input id="password" v-model="form.password" type="password" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Create a password" />
                    </div>

                    <div>
                        <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
                            Confirm password
                        </label>
                        <input id="confirmPassword" v-model="form.confirmPassword" type="password" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Confirm your password" />
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
                        :disabled="loading || !form.acceptTerms || form.password !== form.confirmPassword"
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
        <div class="hidden lg:block lg:w-1/2 bg-gray-50 border-l">
            <div class="h-full flex items-center justify-center p-8">
                <img src="@/assets/images/qwesi-image.png" alt="QWESI AI Assistant"
                    class="max-w-md w-full h-auto object-contain rounded-2xl animate-breathing" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const error = ref('')

const form = ref({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
})

const handleSignup = async () => {
    loading.value = true
    error.value = ''

    try {
        if (form.value.password !== form.value.confirmPassword) {
            error.value = 'Passwords do not match'
            return
        }

        const result = await authStore.signup({
            email: form.value.email,
            password: form.value.password,
            firstName: form.value.firstName,
            lastName: form.value.lastName
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
            router.push(redirectUrl)
        } else {
            router.push('/dashboard')
        }
    }
})

// Set page title
useHead({
    title: 'Sign Up - QWESI AI'
})
</script>