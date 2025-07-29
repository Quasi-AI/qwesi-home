<template>
    <div class="cancel-subscription">
        <div class="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
            <div class="flex">
                <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                        fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clip-rule="evenodd" />
                    </svg>
                </div>
                <div class="ml-3">
                    <h3 class="text-sm font-medium text-yellow-800">
                        Cancel Subscription
                    </h3>
                    <div class="mt-2 text-sm text-yellow-700">
                        <p>
                            Are you sure you want to cancel your subscription? You'll lose access to Pro features at the
                            end of your current billing period.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <form @submit.prevent="handleCancel" class="space-y-4">
            <div>
                <label for="cancelEmail" class="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Email Address
                </label>
                <input id="cancelEmail" v-model="email" type="email" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter your email address to confirm" />
            </div>

            <button type="submit" :disabled="loading"
                class="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <span v-if="loading" class="flex items-center justify-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>
                    Canceling...
                </span>
                <span v-else>Cancel Subscription</span>
            </button>
        </form>

        <div v-if="error" class="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {{ error }}
        </div>

        <div v-if="success" class="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
            {{ success }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '~/features/auth/stores/auth.store'
import { useSubscriptionStore } from '~/features/subscription/stores/subscription.store'

const authStore = useAuthStore()
const subscriptionStore = useSubscriptionStore()

const email = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

// Pre-fill email with user's email if available
const userEmail = computed(() => authStore.getUser?.email || '')
if (userEmail.value) {
    email.value = userEmail.value
}

const handleCancel = async () => {
    if (!email.value) {
        error.value = 'Please enter your email address'
        return
    }

    loading.value = true
    error.value = ''
    success.value = ''

    try {
        const result = await subscriptionStore.cancelSubscription({ email: email.value })

        if (result.success) {
            success.value = result.message || 'Subscription cancelled successfully'
            // Clear any previous errors
            error.value = ''
        } else {
            error.value = result.error || 'Failed to cancel subscription'
        }
    } catch (err) {
        console.error('Cancel subscription error:', err)
        error.value = 'An error occurred while canceling the subscription'
    } finally {
        loading.value = false
    }
}
</script>