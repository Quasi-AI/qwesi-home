<template>
    <div class="min-h-screen bg-gray-50 flex">
        <!-- Sidebar -->
        <Sidebar :user="user" />

        <!-- Main Content -->
        <div class="flex-1 flex flex-col">
            <!-- Top Navigation -->
            <header class="bg-white border-b border-gray-200 px-6 py-4">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-900">Subscription</h1>
                        <p class="text-sm text-gray-600">Manage your subscription and billing</p>
                    </div>
                </div>
            </header>

            <!-- Main Content Area -->
            <main class="flex-1 p-6">
                <!-- Error Message -->
                <div v-if="subscriptionStore.getError" class="mb-6 bg-red-50 border border-red-200 rounded-lg p-3">
                    <p class="text-sm text-red-600">{{ subscriptionStore.getError }}</p>
                </div>

                <!-- Current Plan -->
                <div class="mb-8">
                    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <h3 class="text-lg font-semibold text-gray-900 mb-2">Current Plan</h3>
                                <div class="flex items-center space-x-4">
                                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                                        :class="isPro ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'">
                                        {{ isPro ? 'Pro Plan' : 'Free Plan' }}
                                    </span>
                                    <span class="text-sm text-gray-600">
                                        {{ isPro ? 'Active until ' + subscriptionEndDate : 'Basic features only' }}
                                    </span>
                                </div>
                            </div>
                            <div v-if="!isPro">
                                <button @click="showUpgradeModal = true" :disabled="subscriptionStore.isLoading"
                                    class="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                    <span v-if="subscriptionStore.isLoading">Loading...</span>
                                    <span v-else>Upgrade to Pro</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Payment Information -->
                <div v-if="isPro" class="mb-8">
                    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                                <div class="flex items-center space-x-2">
                                    <span class="text-gray-900">•••• •••• •••• {{ maskedCardNumber }}</span>
                                    <span
                                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Active
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                                <span class="text-gray-900">{{ paymentInfo.expiryDate }}</span>
                            </div>
                        </div>
                        <div class="mt-6 pt-6 border-t border-gray-200">
                            <button @click="showUpdatePaymentModal = true"
                                class="text-blue-600 hover:text-blue-700 font-medium">
                                Update Payment Method
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Saved Card Section -->
                <div v-if="isPro" class="mb-8">
                    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Saved Card</h3>
                        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-4">
                                    <!-- Card Icon -->
                                    <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                                        </svg>
                                    </div>

                                    <!-- Card Details -->
                                    <div>
                                        <div class="flex items-center space-x-2 mb-1">
                                            <span class="font-medium text-gray-900">Visa ending in {{ maskedCardNumber
                                                }}</span>
                                            <span
                                                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Default
                                            </span>
                                        </div>
                                        <p class="text-sm text-gray-600">Expires {{ paymentInfo.expiryDate }}</p>
                                    </div>
                                </div>

                                <!-- Actions -->
                                <div class="flex items-center space-x-2">
                                    <button @click="showUpdatePaymentModal = true"
                                        class="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                        Edit
                                    </button>
                                    <button @click="removeCard"
                                        class="text-red-600 hover:text-red-700 text-sm font-medium">
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Plan Comparison -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <!-- Free Plan -->
                    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div class="text-center">
                            <h3 class="text-xl font-semibold text-gray-900 mb-2">Free Plan</h3>
                            <p class="text-3xl font-bold text-gray-900 mb-1">$0</p>
                            <p class="text-gray-600 mb-6">Forever</p>
                        </div>
                        <ul class="space-y-3 mb-6">
                            <li class="flex items-center">
                                <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd" />
                                </svg>
                                Basic AI assistance
                            </li>
                            <li class="flex items-center">
                                <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd" />
                                </svg>
                                5 tasks per day
                            </li>
                            <li class="flex items-center">
                                <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd" />
                                </svg>
                                Email support
                            </li>
                        </ul>
                        <button v-if="isPro" disabled
                            class="w-full bg-gray-100 text-gray-400 py-2 px-4 rounded-lg cursor-not-allowed">
                            Current Plan
                        </button>
                        <div v-else class="w-full bg-gray-50 text-gray-500 py-2 px-4 rounded-lg text-center">
                            Current Plan
                        </div>
                    </div>

                    <!-- Pro Plan -->
                    <div class="bg-white rounded-lg shadow-sm border-2 border-blue-200 p-6 relative">
                        <div class="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <span class="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                Recommended
                            </span>
                        </div>
                        <div class="text-center">
                            <h3 class="text-xl font-semibold text-gray-900 mb-2">Pro Plan</h3>
                            <p class="text-3xl font-bold text-gray-900 mb-1">$10</p>
                            <p class="text-gray-600 mb-6">per month</p>
                        </div>
                        <ul class="space-y-3 mb-6">
                            <li class="flex items-center">
                                <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd" />
                                </svg>
                                Advanced AI features
                            </li>
                            <li class="flex items-center">
                                <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd" />
                                </svg>
                                Unlimited tasks
                            </li>
                            <li class="flex items-center">
                                <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd" />
                                </svg>
                                Priority support
                            </li>
                            <li class="flex items-center">
                                <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd" />
                                </svg>
                                30-day free trial
                            </li>
                        </ul>
                        <button v-if="isPro" @click="showCancelModal = true"
                            class="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                            Cancel Subscription
                        </button>
                        <button v-else @click="showUpgradeModal = true"
                            class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                            Start Free Trial
                        </button>
                    </div>
                </div>
            </main>
        </div>

        <!-- Upgrade Modal -->
        <ProModal v-model="showUpgradeModal" mode="upgrade" :loading="subscriptionStore.isLoading" />

        <!-- Cancel Subscription Modal -->
        <ProModal v-model="showCancelModal" mode="cancel" :loading="subscriptionStore.isLoading" />

        <!-- Update Payment Modal -->
        <ProModal v-model="showUpdatePaymentModal" mode="update" :loading="subscriptionStore.isLoading"
            @submit="handleUpdatePayment" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useSubscriptionStore } from '~/stores/subscription'
import Sidebar from '@/components/dashboard/Sidebar.vue'
import ProModal from '@/components/dashboard/ProModal.vue'

const router = useRouter()
const authStore = useAuthStore()
const subscriptionStore = useSubscriptionStore()

// User state
const user = computed(() => authStore.getUser || {})
const showUpgradeModal = ref(false)
const showCancelModal = ref(false)
const showUpdatePaymentModal = ref(false)

// Computed subscription data
const isPro = computed(() => subscriptionStore.isPro)
const subscription = computed(() => subscriptionStore.getCurrentSubscription)
const subscriptionEndDate = computed(() => subscription.value?.currentPeriodEnd || '')
const paymentInfo = computed(() => subscription.value?.paymentMethod || {})

// Computed
const maskedCardNumber = computed(() => {
    if (paymentInfo.value.last4) {
        return paymentInfo.value.last4
    }
    return ''
})

// Methods
const handleUpdatePayment = async (formData) => {
    try {
        const result = await subscriptionStore.updatePaymentMethod({
            paymentMethodId: 'pm_' + Date.now() // Mock payment method ID
        })

        if (result.success) {
            showUpdatePaymentModal.value = false
            alert('Payment method updated successfully!')
        } else {
            alert(result.error || 'Failed to update payment method')
        }
    } catch (error) {
        console.error('Update payment error:', error)
        alert('An unexpected error occurred')
    }
}

const removeCard = () => {
    if (confirm('Are you sure you want to remove this card? You will need to add a new payment method to continue your Pro subscription.')) {
        localStorage.removeItem('paymentInfo')
        paymentInfo.value = {}

        alert('Card removed successfully. Please add a new payment method to continue your Pro subscription.')
    }
}

// Lifecycle
onMounted(async () => {
    // Check if user is authenticated
    if (!authStore.isAuthenticated) {
        router.push('/auth/login')
        return
    }

    // Load subscription data
    await subscriptionStore.fetchSubscription()
})

// Set page title
useHead({
    title: 'Subscription - QWESI AI'
})
</script>