<template>
    <div class="min-h-screen flex relative overflow-hidden">
        <!-- Animated Background -->
        <div class="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
            <!-- Floating Orbs -->
            <div class="absolute top-10 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
            <div class="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float-delayed"></div>
            <div class="absolute top-1/3 right-1/4 w-64 h-64 bg-pink-500/15 rounded-full blur-2xl animate-pulse"></div>
            <div class="absolute bottom-1/3 left-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-float-slow"></div>
            
            <!-- Dynamic Grid Pattern -->
            <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0); background-size: 60px 60px;"></div>
            
            <!-- Animated Lines -->
            <div class="absolute inset-0">
                <div class="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent animate-pulse"></div>
                <div class="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent animate-pulse" style="animation-delay: 2s;"></div>
            </div>
        </div>

        <!-- Back Button -->
        <BackButton class="absolute top-6 left-6 z-20 text-white hover:text-purple-300 transition-colors" />

        <!-- Left Side - Signup Form -->
        <div class="relative w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 z-10">
            <div class="max-w-md w-full">
                <!-- Glassmorphism Card -->
                <div class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                    <!-- Logo and Header -->
                    <div class="text-center mb-8">
                        <div class="relative inline-block mb-6">
                            <div class="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
                            <img src="~/assets/images/qwesi-head.png" alt="QWESI AI Logo"
                                class="relative w-20 h-20 object-cover mx-auto rounded-full border-2 border-white/30 shadow-xl" />
                        </div>
                        <h2 class="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Join QWESI AI
                        </h2>
                        <p class="text-slate-300 text-lg">Start your AI-powered journey today</p>
                    </div>

                    <!-- Signup Form -->
                    <form class="space-y-5" @submit.prevent="handleSignup">
                        <!-- Error Message -->
                        <div v-if="error" class="bg-red-500/20 border border-red-400/30 rounded-xl p-4 backdrop-blur-sm animate-shake">
                            <div class="flex items-center space-x-2">
                                <svg class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                </svg>
                                <p class="text-sm text-red-300">{{ error }}</p>
                            </div>
                        </div>

                        <!-- Success Message -->
                        <div v-if="success" class="bg-green-500/20 border border-green-400/30 rounded-xl p-4 backdrop-blur-sm animate-bounce-in">
                            <div class="flex items-center space-x-2">
                                <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                </svg>
                                <p class="text-sm text-green-300">{{ success }}</p>
                            </div>
                        </div>

                        <!-- Name Input -->
                        <div class="space-y-2">
                            <label for="name" class="block text-sm font-semibold text-white flex items-center space-x-2">
                                <svg class="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                </svg>
                                <span>Full Name</span>
                            </label>
                            <div class="relative group">
                                <input id="name" v-model="form.name" type="text" required
                                    class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 hover:bg-white/15"
                                    placeholder="Enter your full name" />
                                <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                            </div>
                        </div>

                        <!-- Email Input -->
                        <div class="space-y-2">
                            <label for="email" class="block text-sm font-semibold text-white flex items-center space-x-2">
                                <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                                </svg>
                                <span>Email Address</span>
                            </label>
                            <div class="relative group">
                                <input id="email" v-model="form.email" type="email" required
                                    class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 hover:bg-white/15"
                                    placeholder="Enter your email address" />
                                <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                            </div>
                        </div>

                        <!-- Date of Birth -->
                        <div class="space-y-2">
                            <label for="dob" class="block text-sm font-semibold text-white flex items-center space-x-2">
                                <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                                <span>Date of Birth</span>
                            </label>
                            <div class="relative group">
                                <input id="dob" v-model="form.dob" type="date" required
                                    class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 hover:bg-white/15"
                                    style="color-scheme: dark;" />
                                <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                            </div>
                        </div>

                        <!-- Password Inputs -->
                        <div class="grid grid-cols-1 gap-4">
                            <!-- Password -->
                            <div class="space-y-2">
                                <label for="password" class="block text-sm font-semibold text-white flex items-center space-x-2">
                                    <svg class="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                    </svg>
                                    <span>Password</span>
                                </label>
                                <div class="relative group">
                                    <input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'"
                                        required
                                        class="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 hover:bg-white/15"
                                        placeholder="Create a strong password" />
                                    <button type="button" @click="showPassword = !showPassword"
                                        class="absolute inset-y-0 right-0 pr-4 flex items-center hover:scale-110 transition-transform duration-200">
                                        <svg v-if="showPassword" class="h-5 w-5 text-slate-400 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21">
                                            </path>
                                        </svg>
                                        <svg v-else class="h-5 w-5 text-slate-400 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                                            </path>
                                        </svg>
                                    </button>
                                    <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                                </div>
                            </div>

                            <!-- Confirm Password -->
                            <div class="space-y-2">
                                <label for="confirmPassword" class="block text-sm font-semibold text-white flex items-center space-x-2">
                                    <svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                    <span>Confirm Password</span>
                                </label>
                                <div class="relative group">
                                    <input id="confirmPassword" v-model="form.confirmPassword"
                                        :type="showConfirmPassword ? 'text' : 'password'" required
                                        class="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 hover:bg-white/15"
                                        :class="{ 'border-red-400/50': form.confirmPassword && form.password !== form.confirmPassword, 'border-green-400/50': form.confirmPassword && form.password === form.confirmPassword }"
                                        placeholder="Confirm your password" />
                                    <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                                        class="absolute inset-y-0 right-0 pr-4 flex items-center hover:scale-110 transition-transform duration-200">
                                        <svg v-if="showConfirmPassword" class="h-5 w-5 text-slate-400 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21">
                                            </path>
                                        </svg>
                                        <svg v-else class="h-5 w-5 text-slate-400 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                                            </path>
                                        </svg>
                                    </button>
                                    <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                                </div>
                                <!-- Password Match Indicator -->
                                <div v-if="form.confirmPassword" class="flex items-center space-x-2 mt-1">
                                    <div v-if="form.password === form.confirmPassword" class="flex items-center space-x-1 text-green-400">
                                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                        </svg>
                                        <span class="text-xs">Passwords match</span>
                                    </div>
                                    <div v-else class="flex items-center space-x-1 text-red-400">
                                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                                        </svg>
                                        <span class="text-xs">Passwords don't match</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Phone Number Input -->
                        <div class="space-y-2">
                            <label for="phone" class="block text-sm font-semibold text-white flex items-center space-x-2">
                                <svg class="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                </svg>
                                <span>Phone Number</span>
                            </label>
                            <div class="flex space-x-3">
                                <div class="w-1/3">
                                    <CountryCodeSelector v-model="form.countryCode" 
                                        class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 hover:bg-white/15" />
                                </div>
                                <div class="flex-1 relative group">
                                    <input id="phone" v-model="form.phoneNumber" type="tel" required
                                        class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 hover:bg-white/15"
                                        placeholder="Enter phone number" />
                                    <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                                </div>
                            </div>
                        </div>

                        <!-- Terms Checkbox -->
                        <div class="flex items-start space-x-3 p-4 bg-white/5 rounded-xl border border-white/10">
                            <div class="relative mt-1">
                                <input id="terms" v-model="form.acceptTerms" type="checkbox" required class="sr-only" />
                                <label for="terms" class="flex items-center cursor-pointer group">
                                    <div class="w-5 h-5 bg-white/10 border border-white/30 rounded-md flex items-center justify-center group-hover:bg-white/20 transition-all duration-200"
                                         :class="{ 'bg-gradient-to-r from-purple-500 to-pink-600 border-transparent': form.acceptTerms }">
                                        <svg v-if="form.acceptTerms" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                        </svg>
                                    </div>
                                </label>
                            </div>
                            <label for="terms" class="text-sm text-slate-300 leading-relaxed cursor-pointer">
                                I agree to the
                                <a href="#" class="text-purple-400 hover:text-purple-300 transition-colors relative group">
                                    <span>Terms of Service</span>
                                    <div class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300"></div>
                                </a>
                                and
                                <a href="#" class="text-blue-400 hover:text-blue-300 transition-colors relative group">
                                    <span>Privacy Policy</span>
                                    <div class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></div>
                                </a>
                            </label>
                        </div>

                        <!-- Submit Button -->
                        <button type="submit"
                            :disabled="loading || !form.acceptTerms || !isFormValid || form.password !== form.confirmPassword"
                            class="group relative w-full overflow-hidden rounded-xl transition-all duration-300 transform hover:scale-[1.02] focus:scale-[1.02] disabled:scale-100 disabled:opacity-50">
                            <div class="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-size-200 bg-pos-0 group-hover:bg-pos-100 transition-all duration-500"></div>
                            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div class="relative px-6 py-4 flex items-center justify-center space-x-2">
                                <svg v-if="loading" class="w-5 h-5 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                                </svg>
                                <span class="font-semibold text-white">
                                    {{ loading ? 'Creating Account...' : 'Create Your Account' }}
                                </span>
                                <svg v-if="!loading" class="w-5 h-5 text-white group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                                </svg>
                            </div>
                        </button>

                        <!-- Divider -->
                        <div class="relative my-6">
                            <div class="absolute inset-0 flex items-center">
                                <div class="w-full border-t border-white/20"></div>
                            </div>
                            <div class="relative flex justify-center">
                                <span class="bg-gradient-to-r from-indigo-900 to-purple-900 px-4 text-sm text-slate-400">or</span>
                            </div>
                        </div>

                        <!-- Sign In Link -->
                        <div class="text-center">
                            <p class="text-slate-300 text-sm mb-3">
                                Already have an account?
                            </p>
                            <NuxtLink to="/auth/login" 
                                class="group inline-flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-xl text-white font-medium transition-all duration-300 transform hover:scale-105">
                                <svg class="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                                </svg>
                                <span>Sign In Instead</span>
                                <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                </svg>
                            </NuxtLink>
                        </div>
                    </form>
                </div>

                <!-- Features Preview -->
                <div class="mt-8 grid grid-cols-3 gap-4 text-center">
                    <div class="group p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                        <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-200">
                            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                            </svg>
                        </div>
                        <p class="text-xs text-slate-300 group-hover:text-white transition-colors">Instant AI</p>
                    </div>
                    <div class="group p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                        <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-200">
                            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </div>
                        <p class="text-xs text-slate-300 group-hover:text-white transition-colors">Secure</p>
                    </div>
                    <div class="group p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                        <div class="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-200">
                            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                            </svg>
                        </div>
                        <p class="text-xs text-slate-300 group-hover:text-white transition-colors">Loved</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Right Side - Enhanced Auth Sidebar -->
        <div class="hidden lg:flex lg:w-1/2 relative">
            <!-- Floating Welcome Message -->
            <div class="absolute inset-0 z-20 flex items-center justify-center p-12">
                <div class="text-center max-w-lg space-y-8">
                    <!-- Main Welcome Card -->
                    <div class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 transform hover:scale-105 transition-all duration-300 hover:bg-white/15">
                        <div class="mb-6">
                            <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                                </svg>
                            </div>
                            <h3 class="text-2xl font-bold text-white mb-3">Welcome to the Future</h3>
                            <p class="text-slate-300 text-sm leading-relaxed">
                                Join thousands of users who are already experiencing the power of next-generation AI technology.
                            </p>
                        </div>
                        
                        <!-- Stats -->
                        <div class="grid grid-cols-3 gap-4 text-center">
                            <div class="space-y-1">
                                <div class="text-2xl font-bold text-white bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">10K+</div>
                                <div class="text-xs text-slate-400">Active Users</div>
                            </div>
                            <div class="space-y-1">
                                <div class="text-2xl font-bold text-white bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">99.9%</div>
                                <div class="text-xs text-slate-400">Uptime</div>
                            </div>
                            <div class="space-y-1">
                                <div class="text-2xl font-bold text-white bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">24/7</div>
                                <div class="text-xs text-slate-400">Support</div>
                            </div>
                        </div>
                    </div>

                    <!-- Feature Highlights -->
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 transform hover:scale-105 transition-all duration-300 hover:bg-white/15">
                            <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-3">
                                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                </svg>
                            </div>
                            <h4 class="text-white font-semibold text-sm mb-1">Smart AI</h4>
                            <p class="text-slate-400 text-xs">Advanced algorithms</p>
                        </div>
                        
                        <div class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 transform hover:scale-105 transition-all duration-300 hover:bg-white/15">
                            <div class="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-3">
                                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <h4 class="text-white font-semibold text-sm mb-1">Reliable</h4>
                            <p class="text-slate-400 text-xs">Always available</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Floating Particles -->
        <div class="absolute inset-0 pointer-events-none">
            <div class="particle absolute top-1/6 left-1/5 w-1 h-1 bg-purple-400 rounded-full animate-ping" style="animation-delay: 0s;"></div>
            <div class="particle absolute top-2/3 left-1/4 w-1 h-1 bg-blue-400 rounded-full animate-ping" style="animation-delay: 1.5s;"></div>
            <div class="particle absolute top-1/3 right-1/5 w-1 h-1 bg-pink-400 rounded-full animate-ping" style="animation-delay: 3s;"></div>
            <div class="particle absolute bottom-1/5 right-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-ping" style="animation-delay: 4.5s;"></div>
            <div class="particle absolute top-3/4 left-1/2 w-1 h-1 bg-green-400 rounded-full animate-ping" style="animation-delay: 2s;"></div>
        </div>

        <!-- Progress Indicator -->
        <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 lg:hidden">
            <div class="flex space-x-2">
                <div class="w-2 h-2 bg-white/30 rounded-full"></div>
                <div class="w-8 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                <div class="w-2 h-2 bg-white/30 rounded-full"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/features/auth/stores/auth.store'
import BackButton from '@/shared/components/ui/back-button.vue'
import AuthSidebar from '~/features/auth/components/auth-sidebar.vue'
import CountryCodeSelector from '~/shared/components/ui/country-code-selector.vue'

const authStore = useAuthStore()
const loading = ref(false)
const error = ref('')
const success = ref('')

const form = ref({
    name: '',
    email: '',
    dob: '',
    password: '',
    confirmPassword: '',
    countryCode: '',
    phoneNumber: '',
    acceptTerms: false
})

// Form validation
const isFormValid = computed(() => {
    return form.value.name &&
        form.value.email &&
        form.value.dob &&
        form.value.password &&
        form.value.confirmPassword &&
        form.value.countryCode &&
        form.value.phoneNumber &&
        form.value.password === form.value.confirmPassword
})

// Password visibility toggles
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Format date for API (DD/MM/YYYY)
const formatDate = (dateString) => {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
}

const handleSignup = async () => {
    loading.value = true
    error.value = ''
    success.value = ''

    try {
        // Validate passwords match
        if (form.value.password !== form.value.confirmPassword) {
            error.value = 'Passwords do not match'
            return
        }

        // Format the phone number with country code (CountryCodeSelector provides + prefix)
        let fullPhone = `${form.value.countryCode}${form.value.phoneNumber.replace(/\D/g, '')}`

        // Ensure exactly one plus sign at the beginning
        fullPhone = fullPhone.replace(/^\+*/, '+')

        // Format the date
        const formattedDob = formatDate(form.value.dob)

        const signupData = {
            phone: fullPhone,
            name: form.value.name,
            dob: formattedDob,
            email: form.value.email,
            password: form.value.password
        }

        const result = await authStore.signup(signupData)

        if (result.success) {
            success.value = result.message || 'Account created successfully! Please check your phone for login credentials.'
            // Clear form
            form.value = {
                name: '',
                email: '',
                dob: '',
                password: '',
                confirmPassword: '',
                countryCode: '',
                phoneNumber: '',
                acceptTerms: false
            }

            // Redirect to login after a short delay
            setTimeout(() => {
                navigateTo('/auth/login')
            }, 3000)
        } else {
            error.value = result.error || 'Signup failed'
        }
    } catch (err) {
        console.error('Signup error:', err)
        error.value = 'An unexpected error occurred'
    } finally {
        loading.value = false
    }
}

// Check if user is already logged in
onMounted(() => {
    if (authStore.isAuthenticated) {
        const redirectUrl = localStorage.getItem('redirect_after_login')
        if (redirectUrl) {
            localStorage.removeItem('redirect_after_login')
            navigateTo(redirectUrl)
        } else {
            navigateTo('/dashboard')
        }
    }
})

// Set page title
useHead({
    title: 'Sign Up - QWESI AI'
})
</script>

<style scoped>
@keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-25px) rotate(8deg); }
}

@keyframes float-delayed {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(-5deg); }
}

@keyframes float-slow {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-15px) rotate(3deg); }
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}

@keyframes bounce-in {
    0% { transform: scale(0.3); opacity: 0; }
    50% { transform: scale(1.1); }
    70% { transform: scale(0.9); }
    100% { transform: scale(1); opacity: 1; }
}

.animate-float {
    animation: float 8s ease-in-out infinite;
}

.animate-float-delayed {
    animation: float-delayed 10s ease-in-out infinite;
}

.animate-float-slow {
    animation: float-slow 12s ease-in-out infinite;
}

.animate-shake {
    animation: shake 0.5s ease-in-out;
}

.animate-bounce-in {
    animation: bounce-in 0.6s ease-out;
}

.bg-size-200 {
    background-size: 200% 100%;
}

.bg-pos-0 {
    background-position: 0% 50%;
}

.bg-pos-100 {
    background-position: 100% 50%;
}

/* Custom scrollbar */
::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
}

::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #8b5cf6, #ec4899);
    border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #7c3aed, #db2777);
}

/* Enhanced focus effects */
input:focus {
    box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1), 0 0 20px rgba(168, 85, 247, 0.2);
}

/* Particle animation */
@keyframes ping-custom {
    0% {
        transform: scale(1);
        opacity: 1;
    }
    75%, 100% {
        transform: scale(3);
        opacity: 0;
    }
}

.particle {
    animation: ping-custom 5s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* Password strength indicator colors */
.border-red-400\/50 {
    border-color: rgba(248, 113, 113, 0.5);
}

.border-green-400\/50 {
    border-color: rgba(74, 222, 128, 0.5);
}

/* Date input styling for dark theme */
input[type="date"]::-webkit-calendar-picker-indicator {
    filter: invert(1);
    cursor: pointer;
}

input[type="date"]::-webkit-inner-spin-button,
input[type="date"]::-webkit-clear-button {
    display: none;
}
</style>