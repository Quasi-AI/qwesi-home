<template>
    <div v-if="modelValue" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-bold text-gray-900">{{ title }}</h3>
                <button @click="handleCancel" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
                        </path>
                    </svg>
                </button>
            </div>

            <!-- Stripe Checkout for Upgrade -->
            <div v-if="mode === 'upgrade'">
                <StripeCheckout />
            </div>

            <!-- Stripe Cancel for Cancel -->
            <div v-else-if="mode === 'cancel'">
                <CancelSubscription />
            </div>

            <!-- Original Payment Form for Update -->
            <div v-else-if="mode === 'update'">
                <p class="text-gray-600 mb-6">
                    {{ description }}
                </p>

                <form @submit.prevent="handleSubmit" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                        <input v-model="form.cardNumber" type="text" placeholder="1234 5678 9012 3456"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required />
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                            <input v-model="form.expiryDate" type="text" placeholder="MM/YY"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                            <input v-model="form.cvv" type="text" placeholder="123"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required />
                        </div>
                    </div>

                    <div class="flex space-x-3 pt-4">
                        <button type="button" @click="handleCancel"
                            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" :disabled="loading"
                            class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
                            <span v-if="loading">{{ loadingText }}</span>
                            <span v-else>{{ submitText }}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import StripeCheckout from './subscription-checkout.vue'
import CancelSubscription from './cancel-subscription.vue'

// Props
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    mode: {
        type: String,
        default: 'upgrade', // 'upgrade', 'update', or 'cancel'
        validator: (value) => ['upgrade', 'update', 'cancel'].includes(value)
    },
    loading: {
        type: Boolean,
        default: false
    },
    initialForm: {
        type: Object,
        default: () => ({
            cardNumber: '',
            expiryDate: '',
            cvv: ''
        })
    }
})

// Emits
const emit = defineEmits(['update:modelValue', 'submit', 'cancel'])

// Form data
const form = ref({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
})

// Computed properties
const title = computed(() => {
    switch (props.mode) {
        case 'upgrade':
            return 'Upgrade to Pro'
        case 'cancel':
            return 'Cancel Subscription'
        case 'update':
            return 'Update Payment Method'
        default:
            return 'Pro Modal'
    }
})

const description = computed(() => {
    return props.mode === 'update'
        ? 'Update your payment information to continue your Pro subscription.'
        : ''
})

const submitText = computed(() => {
    return props.mode === 'update' ? 'Update Payment' : 'Submit'
})

const loadingText = computed(() => {
    return props.mode === 'update' ? 'Updating...' : 'Processing...'
})

// Methods
const handleSubmit = () => {
    emit('submit', { ...form.value })
}

const handleCancel = () => {
    emit('cancel')
    emit('update:modelValue', false)
}

// Watch for initial form changes
watch(() => props.initialForm, (newForm) => {
    if (newForm) {
        form.value = { ...newForm }
    }
}, { immediate: true })

// Reset form when modal opens/closes
watch(() => props.modelValue, (isOpen) => {
    if (isOpen) {
        form.value = { ...props.initialForm }
    } else {
        form.value = {
            cardNumber: '',
            expiryDate: '',
            cvv: ''
        }
    }
})
</script>