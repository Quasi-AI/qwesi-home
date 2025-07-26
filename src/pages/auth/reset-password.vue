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

        <!-- Left Side - Reset Password Form -->
        <div class="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
            <div class="max-w-md w-full space-y-8">
                <!-- Logo and Header -->
                <div class="text-center">
                    <img src="@/assets/images/qwesi-head.png" alt="QWESI AI Logo"
                        class="w-32 h-32 object-cover mx-auto rounded-full border mb-8" />
                    <h2 class="text-3xl font-bold text-gray-900 mb-2">Set new password</h2>
                    <p class="text-gray-600">Enter your new password below</p>
                </div>

                <!-- Success Message -->
                <div v-if="passwordReset" class="bg-green-50 border border-green-200 rounded-lg p-4">
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
                                Your password has been successfully reset!
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Reset Password Form -->
                <form v-if="!passwordReset" class="space-y-6" @submit.prevent="handleResetPassword">
                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                            New password
                        </label>
                        <input id="password" v-model="form.password" type="password" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter new password" />
                    </div>

                    <div>
                        <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
                            Confirm new password
                        </label>
                        <input id="confirmPassword" v-model="form.confirmPassword" type="password" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Confirm new password" />
                    </div>

                    <button type="submit" :disabled="loading || form.password !== form.confirmPassword"
                        class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        <span v-if="loading">Resetting...</span>
                        <span v-else>Reset password</span>
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
                <div v-if="passwordReset" class="text-center">
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const passwordReset = ref(false)

const form = ref({
    password: '',
    confirmPassword: ''
})

const handleResetPassword = async () => {
    loading.value = true

    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        // For demo purposes, always succeed
        passwordReset.value = true

        // Redirect to login after 2 seconds
        setTimeout(() => {
            router.push('/auth/login')
        }, 2000)
    } catch (error) {
        console.error('Reset password error:', error)
    } finally {
        loading.value = false
    }
}

// Set page title
useHead({
    title: 'Reset Password - QWESI AI'
})
</script>