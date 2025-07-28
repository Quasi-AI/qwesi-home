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
            <main class="flex-1 p-6 flex flex-col">
                <div class="max-w-4xl mx-auto flex-1 flex flex-col">
                    <!-- Subscription Status -->
                    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center gap-2">
                                <svg v-if="isSubscribe" class="w-6 h-6 text-green-500" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M5 13l4 4L19 7" />
                                </svg>
                                <svg v-else class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h8" />
                                </svg>
                                <h2 class="text-xl font-semibold text-gray-900">Subscription Status</h2>
                            </div>
                            <span :class="isSubscribe ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                                class="px-3 py-1 text-sm font-medium rounded-full border border-gray-200">
                                {{ isSubscribe ? 'Pro' : 'Free' }}
                            </span>
                        </div>
                        <p class="text-gray-600 mb-4">
                            {{ subscriptionMessage }}
                        </p>
                        <div v-if="isSubscribe && (subscriptionStartDate || subscriptionEndDate)"
                            class="flex flex-col sm:flex-row gap-4 text-sm">
                            <div v-if="subscriptionStartDate" class="flex items-center bg-blue-50 rounded px-3 py-2">
                                <svg class="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <rect x="3" y="4" width="18" height="18" rx="2" stroke-width="2"
                                        stroke="currentColor" fill="none" />
                                    <path d="M16 2v4M8 2v4M3 10h18" stroke-width="2" stroke="currentColor"
                                        fill="none" />
                                </svg>
                                <span>Start date: <span class="font-medium">{{ formattedSubscriptionStartDate
                                        }}</span></span>
                            </div>
                            <div v-if="subscriptionEndDate" class="flex items-center bg-yellow-50 rounded px-3 py-2">
                                <svg class="w-4 h-4 text-yellow-500 mr-2" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <rect x="3" y="4" width="18" height="18" rx="2" stroke-width="2"
                                        stroke="currentColor" fill="none" />
                                    <path d="M16 2v4M8 2v4M3 10h18" stroke-width="2" stroke="currentColor"
                                        fill="none" />
                                </svg>
                                <span>Next billing: <span class="font-medium">{{ formattedSubscriptionEndDate
                                        }}</span></span>
                            </div>
                        </div>
                    </div>

                    <!-- Pro Features -->
                    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Pro Features</h3>
                        <ul class="space-y-3">
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
                                Priority support
                            </li>
                            <li class="flex items-center">
                                <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd" />
                                </svg>
                                7-day free trial
                            </li>
                        </ul>
                        <button v-if="isSubscribe" @click="showCancelModal = true"
                            class="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors mt-6">
                            Cancel Subscription
                        </button>
                        <button v-else @click="showUpgradeModal = true"
                            class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors mt-6">
                            Start Free Trial
                        </button>
                    </div>
                </div>

                <!-- Footer -->
                <div class="mt-auto">
                    <!-- Footer -->
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

import { useAuthStore } from '~/stores/auth'
import { useSubscriptionStore } from '~/stores/subscription'
import Sidebar from '@/components/dashboard/Sidebar.vue'
import ProModal from '@/components/dashboard/ProModal.vue'


const authStore = useAuthStore()
const subscriptionStore = useSubscriptionStore()

// User state
const user = computed(() => authStore.getUser || {})
const showUpgradeModal = ref(false)
const showCancelModal = ref(false)
const showUpdatePaymentModal = ref(false)

// Computed subscription data
const isSubscribe = computed(() => {
    return !!(user.value && user.value.isSubscribe)
})

// Use currentPeriodEnd and subscriptionStartDate from user object
const subscriptionStartDate = computed(() => user.value?.subscriptionStartDate || '')
const subscriptionEndDate = computed(() => user.value?.currentPeriodEnd || '')

// Add a computed property for human-readable date
const formattedSubscriptionEndDate = computed(() => {
    if (!subscriptionEndDate.value) return ''
    const date = new Date(subscriptionEndDate.value)
    if (isNaN(date.getTime())) return subscriptionEndDate.value // fallback if not a valid date
    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
})

// Add a computed property for human-readable start date
const formattedSubscriptionStartDate = computed(() => {
    if (!subscriptionStartDate.value) return ''
    const date = new Date(subscriptionStartDate.value)
    if (isNaN(date.getTime())) return subscriptionStartDate.value // fallback if not a valid date
    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
})

const paymentInfo = computed(() => subscription.value?.paymentMethod || {})

// Computed
const maskedCardNumber = computed(() => {
    if (paymentInfo.value.last4) {
        return paymentInfo.value.last4
    }
    return ''
})

const subscriptionMessage = computed(() => {
    return isSubscribe.value
        ? 'You are currently on a Pro subscription.'
        : 'Upgrade to Pro for advanced features.'
})

const cardDisplayText = computed(() => {
    return maskedCardNumber.value
        ? `Card ending in ${maskedCardNumber.value}`
        : 'No card on file'
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
        navigateTo('/auth/login')
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