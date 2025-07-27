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

        <!-- Left Side - Forgot Password Form -->
        <div class="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
            <div class="max-w-md w-full space-y-8">
                <!-- Logo and Header -->
                <div class="text-center">
                    <img src="@/assets/images/qwesi-head.png" alt="QWESI AI Logo"
                        class="w-32 h-32 object-cover mx-auto rounded-full border mb-8" />
                    <h2 class="text-3xl font-bold text-gray-900 mb-2">Reset your password</h2>
                    <p class="text-gray-600">Enter your email to receive reset instructions</p>
                </div>

                <!-- Success Message -->
                <div v-if="emailSent" class="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div class="flex">
                        <div class="flex-shrink-0">
                            <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm text-green-800">
                                Reset instructions have been sent to <strong>{{ form.email }}</strong>
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Forgot Password Form -->
                <form v-if="!emailSent" class="space-y-6" @submit.prevent="handleForgotPassword">
                    <!-- Error Message -->
                    <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p class="text-sm text-red-600">{{ error }}</p>
                    </div>

                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                            Email address
                        </label>
                        <input id="email" v-model="form.email" type="email" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter your email" />
                    </div>

                    <button type="submit" :disabled="loading"
                        class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        <span v-if="loading">Sending...</span>
                        <span v-else>Send reset instructions</span>
                    </button>

                    <div class="text-center">
                        <p class="text-sm text-gray-600">
                            Remember your password?
                            <NuxtLink to="/auth/login" class="text-blue-600 hover:text-blue-500 font-medium">
                                Sign in
                            </NuxtLink>
                        </p>
                    </div>
                </form>

                <!-- Back to Login Button -->
                <div v-if="emailSent" class="text-center">
                    <NuxtLink to="/auth/login"
                        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                        Back to sign in
                    </NuxtLink>
                </div>
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
const emailSent = ref(false)
const error = ref('')

const form = ref({
    email: ''
})

const handleForgotPassword = async () => {
    loading.value = true
    error.value = ''

    try {
        const result = await authStore.forgotPassword(form.value.email)

        if (result.success) {
            emailSent.value = true
        } else {
            error.value = result.error || 'Failed to send reset email'
        }
    } catch (err) {
        console.error('Forgot password error:', err)
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
    title: 'Forgot Password - QWESI AI'
})
</script>