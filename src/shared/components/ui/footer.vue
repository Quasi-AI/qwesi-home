<template>
    <footer class="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-10">
            <div class="absolute inset-0" style="background-image: radial-gradient(circle at 25% 25%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%);"></div>
        </div>
        
        <!-- Animated Background Elements -->
        <div class="absolute inset-0 overflow-hidden">
            <div class="absolute -top-10 -right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div class="absolute -bottom-10 -left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
        </div>
        
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <!-- Main Footer Content -->
            <div class="grid md:grid-cols-4 gap-12 mb-12">
                <!-- Company Info -->
                <div class="space-y-6">
                    <div class="flex items-center space-x-3">
                        
                        <img src="~/assets/images/logo.png" alt="QWESI AI Logo" class="w-28 h-auto" />
                    </div>
                    <p class="text-slate-300 text-sm leading-relaxed">
                        Empowering the future with intelligent AI solutions that transform how businesses operate and grow.
                    </p>
                    
                    <!-- Contact Details with Icons -->
                    <div class="space-y-3">
                        <div class="flex items-center space-x-3 text-slate-300 hover:text-white transition-colors group">
                            <div class="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                </svg>
                            </div>
                            <div>
                                <p class="text-sm">DeReimer Street</p>
                                <p class="text-sm">New York, NY 10745</p>
                            </div>
                        </div>
                        
                        <div class="flex items-center space-x-3 text-slate-300 hover:text-white transition-colors group">
                            <div class="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                                </svg>
                            </div>
                            <p class="text-sm">+1(201) 979-0148</p>
                        </div>
                        
                        <div class="flex items-center space-x-3 text-slate-300 hover:text-white transition-colors group">
                            <div class="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                </svg>
                            </div>
                            <p class="text-sm">info@qwesi.org</p>
                        </div>
                    </div>
                </div>

                <!-- Quick Links -->
                <div class="space-y-6">
                    <h3 class="font-bold text-white text-lg flex items-center space-x-2">
                        <div class="w-1 h-6 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full"></div>
                        <span>Quick Links</span>
                    </h3>
                    <div class="space-y-3">
                        <NuxtLink to="/#home" class="group flex items-center space-x-3 text-slate-300 hover:text-white transition-all duration-200">
                            <div class="w-6 h-6 bg-blue-500/20 rounded-md flex items-center justify-center group-hover:bg-blue-500 group-hover:scale-110 transition-all duration-200">
                                <span class="text-blue-400 group-hover:text-white text-sm">→</span>
                            </div>
                            <span class="group-hover:translate-x-1 transition-transform duration-200">Home</span>
                        </NuxtLink>
                        <NuxtLink to="/#features" class="group flex items-center space-x-3 text-slate-300 hover:text-white transition-all duration-200">
                            <div class="w-6 h-6 bg-blue-500/20 rounded-md flex items-center justify-center group-hover:bg-blue-500 group-hover:scale-110 transition-all duration-200">
                                <span class="text-blue-400 group-hover:text-white text-sm">→</span>
                            </div>
                            <span class="group-hover:translate-x-1 transition-transform duration-200">How I Work</span>
                        </NuxtLink>
                        <NuxtLink to="/privacy-policy" class="group flex items-center space-x-3 text-slate-300 hover:text-white transition-all duration-200">
                            <div class="w-6 h-6 bg-blue-500/20 rounded-md flex items-center justify-center group-hover:bg-blue-500 group-hover:scale-110 transition-all duration-200">
                                <span class="text-blue-400 group-hover:text-white text-sm">→</span>
                            </div>
                            <span class="group-hover:translate-x-1 transition-transform duration-200">Privacy Policy</span>
                        </NuxtLink>
                        <NuxtLink to="/faq" class="group flex items-center space-x-3 text-slate-300 hover:text-white transition-all duration-200">
                            <div class="w-6 h-6 bg-blue-500/20 rounded-md flex items-center justify-center group-hover:bg-blue-500 group-hover:scale-110 transition-all duration-200">
                                <span class="text-blue-400 group-hover:text-white text-sm">→</span>
                            </div>
                            <span class="group-hover:translate-x-1 transition-transform duration-200">FAQ</span>
                        </NuxtLink>
                    </div>
                </div>

                <!-- AI Services -->
                <div class="space-y-6">
                    <h3 class="font-bold text-white text-lg flex items-center space-x-2">
                        <div class="w-1 h-6 bg-gradient-to-b from-green-400 to-blue-500 rounded-full"></div>
                        <span>AI Services</span>
                    </h3>
                    <div class="space-y-3">
                        <a href="#" class="group flex items-center space-x-3 text-slate-300 hover:text-white transition-all duration-200">
                            <div class="w-6 h-6 bg-green-500/20 rounded-md flex items-center justify-center group-hover:bg-green-500 group-hover:scale-110 transition-all duration-200">
                                <svg class="w-3 h-3 text-green-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="3"/>
                                </svg>
                            </div>
                            <span class="group-hover:translate-x-1 transition-transform duration-200">24/7 Service</span>
                        </a>
                        <a href="#" class="group flex items-center space-x-3 text-slate-300 hover:text-white transition-all duration-200">
                            <div class="w-6 h-6 bg-green-500/20 rounded-md flex items-center justify-center group-hover:bg-green-500 group-hover:scale-110 transition-all duration-200">
                                <svg class="w-3 h-3 text-green-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="3"/>
                                </svg>
                            </div>
                            <span class="group-hover:translate-x-1 transition-transform duration-200">Job Alert</span>
                        </a>
                        <a href="#" class="group flex items-center space-x-3 text-slate-300 hover:text-white transition-all duration-200">
                            <div class="w-6 h-6 bg-green-500/20 rounded-md flex items-center justify-center group-hover:bg-green-500 group-hover:scale-110 transition-all duration-200">
                                <svg class="w-3 h-3 text-green-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="3"/>
                                </svg>
                            </div>
                            <span class="group-hover:translate-x-1 transition-transform duration-200">AI Consultation</span>
                        </a>
                        <a href="#" class="group flex items-center space-x-3 text-slate-300 hover:text-white transition-all duration-200">
                            <div class="w-6 h-6 bg-green-500/20 rounded-md flex items-center justify-center group-hover:bg-green-500 group-hover:scale-110 transition-all duration-200">
                                <svg class="w-3 h-3 text-green-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="3"/>
                                </svg>
                            </div>
                            <span class="group-hover:translate-x-1 transition-transform duration-200">Custom Solutions</span>
                        </a>
                    </div>
                </div>

                <!-- Connect With Us -->
                <div class="space-y-6">
                    <h3 class="font-bold text-white text-lg flex items-center space-x-2">
                        <div class="w-1 h-6 bg-gradient-to-b from-purple-400 to-pink-500 rounded-full"></div>
                        <span>Connect With Us</span>
                    </h3>
                    <p class="text-slate-300 text-sm leading-relaxed">
                        Stay updated with the latest AI insights, breakthrough innovations, and industry news.
                    </p>
                    
                    <!-- Newsletter Signup -->
                    <div class="space-y-3">
                        <div class="flex space-x-2">
                            <input 
                                type="email" 
                                placeholder="Enter your email"
                                class="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                            />
                            <button class="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Social Links -->
                    <div class="flex space-x-4">
                        <a href="https://www.linkedin.com/company/108025422/" target="_blank" rel="noopener noreferrer"
                            class="group w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center hover:from-blue-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-110 hover:rotate-3 shadow-lg hover:shadow-xl">
                            <svg class="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                        </a>
                        
                        <a href="#" class="group w-12 h-12 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl flex items-center justify-center hover:from-slate-500 hover:to-slate-600 transition-all duration-300 transform hover:scale-110 hover:rotate-3 shadow-lg hover:shadow-xl">
                            <svg class="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                            </svg>
                        </a>
                        
                        <a href="#" class="group w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center hover:from-purple-500 hover:to-pink-500 transition-all duration-300 transform hover:scale-110 hover:rotate-3 shadow-lg hover:shadow-xl">
                            <svg class="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            <!-- Divider with Gradient -->
            <div class="relative mb-8">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </div>
                <div class="relative flex justify-center">
                    <div class="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-0.5 rounded-full"></div>
                </div>
            </div>

            <!-- Bottom Section -->
            <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div class="flex items-center space-x-6 text-slate-400 text-sm">
                    <div class="flex items-center space-x-2">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        <span>© 2025 Qwesi AI - All Rights Reserved</span>
                    </div>
                </div>
                
                <div class="flex items-center space-x-4">
                    <div class="flex items-center space-x-2 text-slate-400 text-sm">
                        <span>Crafted with</span>
                        <svg class="w-4 h-4 text-red-400 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        <span>by</span>
                        <span class="font-medium text-white bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Rex</span>
                    </div>
                </div>
            </div>

            <!-- Floating Action Button -->
            <div class="fixed bottom-6 right-6 z-50">
                <button class="group w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 rounded-full shadow-2xl hover:shadow-3xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 animate-bounce">
                    <svg class="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                    </svg>
                </button>
            </div>
        </div>
    </footer>
</template>

<style scoped>
@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
}

.animate-float {
    animation: float 3s ease-in-out infinite;
}

/* Custom gradient border */
.border-gradient-to-r {
    background: linear-gradient(to right, transparent, rgb(92, 58, 232), transparent);
    height: 1px;
    border: none;
}

/* Smooth scroll behavior */
html {
    scroll-behavior: smooth;
}

/* Custom shadow for floating button */
.shadow-3xl {
    box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgb(92, 58, 232);
}
</style>