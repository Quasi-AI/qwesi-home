<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Header -->
        <div class="bg-white shadow-sm border-b">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <BackButton class="mb-4" />
                <h1 class="text-3xl font-bold text-gray-900">Frequently Asked Questions</h1>
                <p class="text-gray-600 mt-2">Find answers to common questions about Qwesi AI</p>
            </div>
        </div>

        <!-- Content -->
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="bg-white rounded-lg shadow-sm border">
                <!-- Search Bar -->
                <div class="p-6 border-b border-gray-100">
                    <input v-model="searchQuery" type="text" placeholder="Search for a question..."
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <!-- FAQ Items -->
                <div class="divide-y divide-gray-200">
                    <div v-for="(faq, idx) in filteredFAQs" :key="idx" class="p-6 transition-colors duration-150"
                        :class="openFAQs[idx] ? 'bg-blue-50' : ''">
                        <button @click="toggleFAQ(idx)"
                            class="flex justify-between items-center w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg">
                            <div class="flex items-center">
                                <svg v-if="openFAQs[idx]" class="w-5 h-5 text-blue-600 mr-2" fill="none"
                                    stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M5 15l7-7 7 7" />
                                </svg>
                                <svg v-else class="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7" />
                                </svg>
                                <h3 class="text-lg font-semibold text-gray-900">{{ faq.question }}</h3>
                            </div>
                        </button>
                        <transition name="fade">
                            <div v-show="openFAQs[idx]" class="mt-4 text-gray-700 leading-relaxed">
                                {{ faq.answer }}
                            </div>
                        </transition>
                    </div>
                    <div v-if="filteredFAQs.length === 0" class="p-6 text-center text-gray-500">
                        No questions found.
                    </div>
                </div>

                <!-- Contact Section -->
                <div class="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-b-lg mt-2 border-t border-gray-100">
                    <h3 class="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8 10h.01M12 10h.01M16 10h.01M9 16h6" />
                        </svg>
                        Still have questions?
                    </h3>
                    <p class="text-gray-700 mb-4">
                        If you couldn't find the answer you're looking for, feel free to reach out to us directly.
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4">
                        <a href="mailto:info@qwesi.org"
                            class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z">
                                </path>
                            </svg>
                            Email Us
                        </a>
                        <a href="tel:+12082796057"
                            class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z">
                                </path>
                            </svg>
                            Call Us
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BackButton from '@/shared/components/ui/back-button.vue'

// Set page title
useHead({
    title: 'FAQ - Qwesi AI',
    meta: [
        { name: 'description', content: 'Frequently Asked Questions about Qwesi AI - Find answers to common questions about our services.' }
    ]
})

// FAQ data
const faqs = [
    {
        question: 'What is Qwesi AI?',
        answer: 'Qwesi AI is a smart assistant that helps you find jobs, connect with employers or investors, solve homework, and more—via voice or WhatsApp.'
    },
    {
        question: 'How do I use Qwesi AI?',
        answer: 'You can use Qwesi AI by calling, chatting on WhatsApp, or subscribing on the website. Ask questions, make requests, or even search for opportunities.'
    },
    {
        question: 'Can Qwesi help with my school work?',
        answer: 'Yes! Qwesi AI assists with homework, assignments, explanations, writing help, and educational support for students at any level.'
    },
    {
        question: 'How much does it cost to use?',
        answer: 'You get free access to some features, but full unlimited access is $10/month via Stripe or Paystack.'
    },
    {
        question: 'Can I cancel my subscription?',
        answer: 'Yes, Stripe users can cancel from their customer portal. For Paystack, contact support via email to cancel anytime.'
    },
    {
        question: 'Can Qwesi connect me to real people?',
        answer: 'Yes. Qwesi can connect you with employers, investors, or collaborators depending on what you\'re seeking.'
    }
]

const searchQuery = ref('')
const openFAQs = ref(Array(faqs.length).fill(false))

const filteredFAQs = computed(() => {
    if (!searchQuery.value) return faqs
    return faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
})

const toggleFAQ = (index) => {
    openFAQs.value[index] = !openFAQs.value[index]
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>