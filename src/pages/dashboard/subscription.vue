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
                                <button @click="showUpgradeModal = true"
                                    class="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                                    Upgrade to Pro
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
                        <button v-else @click="showUpgradeModal = true"
                            class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                            Get Started
                        </button>
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
                            <p class="text-3xl font-bold text-gray-900 mb-1">$29</p>
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
                        <button v-if="isPro" @click="cancelSubscription"
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
        <div v-if="showUpgradeModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                <h3 class="text-xl font-bold text-gray-900 mb-4">Upgrade to Pro</h3>
                <p class="text-gray-600 mb-6">
                    Enter your payment information to start your 30-day free trial. You can cancel anytime.
                </p>

                <form @submit.prevent="handleUpgrade" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                        <input v-model="upgradeForm.cardNumber" type="text" placeholder="1234 5678 9012 3456"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required />
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                            <input v-model="upgradeForm.expiryDate" type="text" placeholder="MM/YY"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                            <input v-model="upgradeForm.cvv" type="text" placeholder="123"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required />
                        </div>
                    </div>

                    <div class="flex space-x-3 pt-4">
                        <button type="button" @click="showUpgradeModal = false"
                            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" :disabled="upgrading"
                            class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
                            <span v-if="upgrading">Processing...</span>
                            <span v-else>Start Trial</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Update Payment Modal -->
        <div v-if="showUpdatePaymentModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                <h3 class="text-xl font-bold text-gray-900 mb-4">Update Payment Method</h3>
                <p class="text-gray-600 mb-6">
                    Update your payment information to continue your Pro subscription.
                </p>

                <form @submit.prevent="handleUpdatePayment" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                        <input v-model="updatePaymentForm.cardNumber" type="text" placeholder="1234 5678 9012 3456"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required />
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                            <input v-model="updatePaymentForm.expiryDate" type="text" placeholder="MM/YY"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                            <input v-model="updatePaymentForm.cvv" type="text" placeholder="123"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required />
                        </div>
                    </div>

                    <div class="flex space-x-3 pt-4">
                        <button type="button" @click="showUpdatePaymentModal = false"
                            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" :disabled="updating"
                            class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
                            <span v-if="updating">Updating...</span>
                            <span v-else>Update Payment</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '@/components/dashboard/Sidebar.vue'

const router = useRouter()

// User state
const user = ref({})
const showUpgradeModal = ref(false)
const showUpdatePaymentModal = ref(false)
const upgrading = ref(false)
const updating = ref(false)

// Forms
const upgradeForm = ref({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
})

const updatePaymentForm = ref({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
})

// Subscription data
const isPro = ref(true)
const subscriptionEndDate = ref('')
const paymentInfo = ref({})

// Computed
const maskedCardNumber = computed(() => {
    if (paymentInfo.value.cardNumber) {
        return paymentInfo.value.cardNumber.slice(-4)
    }
    return ''
})

// Methods
const handleUpgrade = async () => {
    upgrading.value = true

    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Store payment info
        localStorage.setItem('paymentInfo', JSON.stringify(upgradeForm.value))
        localStorage.setItem('proSubscription', 'true')
        localStorage.setItem('subscriptionEndDate', '2024-02-15')

        isPro.value = true
        paymentInfo.value = upgradeForm.value
        subscriptionEndDate.value = '2024-02-15'
        showUpgradeModal.value = false

        alert('Pro subscription activated! Welcome to Qwesi AI Pro.')
    } catch (error) {
        console.error('Upgrade error:', error)
    } finally {
        upgrading.value = false
    }
}

const handleUpdatePayment = async () => {
    updating.value = true

    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        // Update payment info
        localStorage.setItem('paymentInfo', JSON.stringify(updatePaymentForm.value))
        paymentInfo.value = updatePaymentForm.value

        showUpdatePaymentModal.value = false
        alert('Payment method updated successfully!')
    } catch (error) {
        console.error('Update payment error:', error)
    } finally {
        updating.value = false
    }
}

const cancelSubscription = () => {
    if (confirm('Are you sure you want to cancel your Pro subscription?')) {
        localStorage.removeItem('proSubscription')
        localStorage.removeItem('paymentInfo')
        localStorage.removeItem('subscriptionEndDate')

        isPro.value = false
        paymentInfo.value = {}
        subscriptionEndDate.value = ''

        alert('Subscription cancelled. You can upgrade again anytime.')
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
onMounted(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
        user.value = JSON.parse(storedUser)
    } else {
        router.push('/dashboard')
    }

    // Load subscription data
    const proSubscription = localStorage.getItem('proSubscription')
    const storedPaymentInfo = localStorage.getItem('paymentInfo')
    const storedEndDate = localStorage.getItem('subscriptionEndDate')

    if (proSubscription === 'true') {
        isPro.value = true
        if (storedPaymentInfo) {
            paymentInfo.value = JSON.parse(storedPaymentInfo)
        }
        if (storedEndDate) {
            subscriptionEndDate.value = storedEndDate
        }
    }
})

// Set page title
useHead({
    title: 'Subscription - QWESI AI'
})
</script>