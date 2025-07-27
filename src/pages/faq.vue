<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Header -->
        <div class="bg-white shadow-sm border-b">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <NuxtLink to="/" class="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Back to Home
                </NuxtLink>
                <h1 class="text-3xl font-bold text-gray-900">Frequently Asked Questions</h1>
                <p class="text-gray-600 mt-2">Find answers to common questions about Qwesi AI</p>
            </div>
        </div>

        <!-- Content -->
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="bg-white rounded-lg shadow-sm border">
                <!-- FAQ Items -->
                <div class="divide-y divide-gray-200">
                    <!-- What is Qwesi AI? -->
                    <div class="p-6">
                        <button @click="toggleFAQ(0)"
                            class="flex justify-between items-center w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg">
                            <h3 class="text-lg font-semibold text-gray-900">What is Qwesi AI?</h3>
                            <svg :class="[
                                'w-5 h-5 text-gray-500 transition-transform duration-200',
                                openFAQs[0] ? 'rotate-180' : ''
                            ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>
                        <div v-show="openFAQs[0]" class="mt-4 text-gray-700 leading-relaxed">
                            Qwesi AI is a smart assistant that helps you find jobs, connect with employers or investors,
                            solve homework, and more—via voice or WhatsApp.
                        </div>
                    </div>

                    <!-- How do I use Qwesi AI? -->
                    <div class="p-6">
                        <button @click="toggleFAQ(1)"
                            class="flex justify-between items-center w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg">
                            <h3 class="text-lg font-semibold text-gray-900">How do I use Qwesi AI?</h3>
                            <svg :class="[
                                'w-5 h-5 text-gray-500 transition-transform duration-200',
                                openFAQs[1] ? 'rotate-180' : ''
                            ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>
                        <div v-show="openFAQs[1]" class="mt-4 text-gray-700 leading-relaxed">
                            You can use Qwesi AI by calling, chatting on WhatsApp, or subscribing on the website. Ask
                            questions, make requests, or even search for opportunities.
                        </div>
                    </div>

                    <!-- Can Qwesi help with my school work? -->
                    <div class="p-6">
                        <button @click="toggleFAQ(2)"
                            class="flex justify-between items-center w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg">
                            <h3 class="text-lg font-semibold text-gray-900">Can Qwesi help with my school work?</h3>
                            <svg :class="[
                                'w-5 h-5 text-gray-500 transition-transform duration-200',
                                openFAQs[2] ? 'rotate-180' : ''
                            ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>
                        <div v-show="openFAQs[2]" class="mt-4 text-gray-700 leading-relaxed">
                            Yes! Qwesi AI assists with homework, assignments, explanations, writing help, and
                            educational support for students at any level.
                        </div>
                    </div>

                    <!-- How much does it cost to use? -->
                    <div class="p-6">
                        <button @click="toggleFAQ(3)"
                            class="flex justify-between items-center w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg">
                            <h3 class="text-lg font-semibold text-gray-900">How much does it cost to use?</h3>
                            <svg :class="[
                                'w-5 h-5 text-gray-500 transition-transform duration-200',
                                openFAQs[3] ? 'rotate-180' : ''
                            ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>
                        <div v-show="openFAQs[3]" class="mt-4 text-gray-700 leading-relaxed">
                            You get free access to some features, but full unlimited access is $10/month via Stripe or
                            Paystack.
                        </div>
                    </div>

                    <!-- Can I cancel my subscription? -->
                    <div class="p-6">
                        <button @click="toggleFAQ(4)"
                            class="flex justify-between items-center w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg">
                            <h3 class="text-lg font-semibold text-gray-900">Can I cancel my subscription?</h3>
                            <svg :class="[
                                'w-5 h-5 text-gray-500 transition-transform duration-200',
                                openFAQs[4] ? 'rotate-180' : ''
                            ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>
                        <div v-show="openFAQs[4]" class="mt-4 text-gray-700 leading-relaxed">
                            Yes, Stripe users can cancel from their customer portal. For Paystack, contact support via
                            email to cancel anytime.
                        </div>
                    </div>

                    <!-- Can Qwesi connect me to real people? -->
                    <div class="p-6">
                        <button @click="toggleFAQ(5)"
                            class="flex justify-between items-center w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg">
                            <h3 class="text-lg font-semibold text-gray-900">Can Qwesi connect me to real people?</h3>
                            <svg :class="[
                                'w-5 h-5 text-gray-500 transition-transform duration-200',
                                openFAQs[5] ? 'rotate-180' : ''
                            ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>
                        <div v-show="openFAQs[5]" class="mt-4 text-gray-700 leading-relaxed">
                            Yes. Qwesi can connect you with employers, investors, or collaborators depending on what
                            you're seeking.
                        </div>
                    </div>
                </div>

                <!-- Contact Section -->
                <div class="bg-gray-50 p-6 rounded-b-lg">
                    <h3 class="text-lg font-semibold text-gray-900 mb-3">Still have questions?</h3>
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
import { ref } from 'vue'

// Set page title
useHead({
    title: 'FAQ - Qwesi AI',
    meta: [
        { name: 'description', content: 'Frequently Asked Questions about Qwesi AI - Find answers to common questions about our services.' }
    ]
})

// FAQ state management
const openFAQs = ref(Array(6).fill(false))

const toggleFAQ = (index) => {
    openFAQs.value[index] = !openFAQs.value[index]
}
</script>