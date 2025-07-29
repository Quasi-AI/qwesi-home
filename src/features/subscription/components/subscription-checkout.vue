<template>
    <div class="stripe-checkout">
        <form @submit.prevent="handleCheckout" class="space-y-4">
            <div>
                <label for="userEmail" class="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                </label>
                <input id="userEmail" v-model="email" type="email" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your email address" />
            </div>

            <button type="submit" :disabled="loading"
                class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <span v-if="loading" class="flex items-center justify-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>
                    Processing...
                </span>
                <span v-else>Upgrade to Pro</span>
            </button>
        </form>

        <div v-if="error" class="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {{ error }}
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

// Pre-fill email with user's email if available
const userEmail = computed(() => authStore.getUser?.email || '')
if (userEmail.value) {
    email.value = userEmail.value
}

const handleCheckout = async () => {
    if (!email.value) {
        error.value = 'Please enter your email address'
        return
    }

    loading.value = true
    error.value = ''

    try {
        const result = await subscriptionStore.createCheckoutSession({ email: email.value })

        if (result.success && result.checkoutUrl) {
            // Redirect to Stripe checkout
            window.location.href = result.checkoutUrl
        } else {
            error.value = result.error || 'Failed to create checkout session'
        }
    } catch (err) {
        console.error('Checkout error:', err)
        error.value = 'An error occurred while creating the checkout session'
    } finally {
        loading.value = false
    }
}
</script>