<template>
    <footer class="bg-white border-t border-gray-200 mt-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="grid md:grid-cols-4 gap-8">
                <!-- Contact Info -->
                <div class="space-y-4">
                    <div class="flex items-center space-x-2">
                        <img src="~/assets/images/logo.png" alt="QWESI AI Logo" class="w-32 h-auto" />
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
                        <a href="https://www.linkedin.com/company/108025422/" target="_blank" rel="noopener noreferrer"
                            class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                            <span class="text-white font-bold text-sm">in</span>
                        </a>
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
    </footer>
</template>