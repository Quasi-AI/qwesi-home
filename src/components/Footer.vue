<template>
    <footer class="bg-white border-t border-gray-200 mt-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="grid md:grid-cols-4 gap-8">
                <!-- Contact Info -->
                <div class="space-y-4">
                    <div class="flex items-center space-x-2">
                        <img src="@/assets/images/logo.png" alt="QWESI AI Logo" class="w-32 h-auto" />
                    </div>
                    <p class="text-gray-600">DeReimer Street</p>
                    <p class="text-gray-600">New York, NY 10745</p>
                    <p class="text-gray-600">+1(201) 979-0148</p>
                    <p class="text-gray-600">info@qwesi.org</p>
                </div>

                <!-- Quick Links -->
                <div class="space-y-4">
                    <h3 class="font-bold text-gray-900">Quick Links</h3>
                    <div class="space-y-2">
                        <NuxtLink to="/#home" class="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                            <span class="text-blue-600">></span>
                            <span>Home</span>
                        </NuxtLink>
                        <NuxtLink to="/#features" class="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                            <span class="text-blue-600">></span>
                            <span>How I Work</span>
                        </NuxtLink>
                        <NuxtLink to="/privacy-policy"
                            class="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                            <span class="text-blue-600">></span>
                            <span>Privacy Policy</span>
                        </NuxtLink>
                        <NuxtLink to="/faq" class="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                            <span class="text-blue-600">></span>
                            <span>Frequently Asked Questions</span>
                        </NuxtLink>
                    </div>
                </div>

                <!-- AI Services -->
                <div class="space-y-4">
                    <h3 class="font-bold text-gray-900">Our AI Services</h3>
                    <div class="space-y-2">
                        <a href="#" class="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                            <span class="text-blue-600">></span>
                            <span>24/7 Service</span>
                        </a>
                        <a href="#" class="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                            <span class="text-blue-600">></span>
                            <span>Job alert</span>
                        </a>
                    </div>
                </div>

                <!-- Connect With Us -->
                <div class="space-y-4">
                    <h3 class="font-bold text-gray-900">Connect With Us</h3>
                    <p class="text-gray-600">
                        Follow us for AI insights, news, and updates.
                    </p>
                    <div class="flex space-x-3">
                        <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <span class="text-white font-bold text-sm">in</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Bottom Section -->
            <div class="border-t border-gray-200 mt-8 pt-8">
                <div class="flex flex-col items-center space-y-2">
                    <p class="text-gray-600">
                        © 2025 Copyright Qwesi All Rights Reserved
                    </p>
                    <p class="text-gray-600">Designed by Rex</p>
                </div>
            </div>
        </div>

        <!-- Scroll to Top Button (only show on landing page) -->
        <button v-if="showScrollTop" @click="scrollToTop" :class="[
            'fixed bottom-8 right-8 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-all duration-300 ease-in-out',
            showScrollTopButton
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4 pointer-events-none',
        ]">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd"
                    d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                    clipRule="evenodd" />
            </svg>
        </button>
    </footer>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Props
const props = defineProps({
    showScrollTop: {
        type: Boolean,
        default: false
    }
})

// Reactive variables
const showScrollTopButton = ref(false)

// Methods
const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    })
}

const handleScroll = () => {
    showScrollTopButton.value = window.scrollY > 300
}

// Lifecycle
onMounted(() => {
    if (props.showScrollTop) {
        window.addEventListener("scroll", handleScroll)
    }
})

onUnmounted(() => {
    if (props.showScrollTop) {
        window.removeEventListener("scroll", handleScroll)
    }
})
</script>