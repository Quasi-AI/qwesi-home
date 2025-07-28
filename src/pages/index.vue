<template>
    <div class="min-h-screen bg-white overflow-x-hidden pt-16">
        <!-- Header/Navigation -->
        <header class="bg-white/80 backdrop-blur-md border-b border-gray-200/50 fixed top-0 left-0 w-full z-50">
            <div class="px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <!-- Logo -->
                    <div class="flex items-center space-x-2">
                        <img src="@/assets/images/logo.png" alt="QWESI AI Logo" class="w-32 h-auto" />
                    </div>

                    <!-- Desktop Navigation -->
                    <nav class="hidden md:flex items-center space-x-8">
                        <a href="#" @click="scrollToTop" :class="[
                            activeSection === 'home'
                                ? 'text-green-600 font-medium'
                                : 'text-gray-600 hover:text-gray-900'
                        ]" class="cursor-pointer transition-colors duration-200">Home</a>
                        <a href="#features" @click="scrollToFeatures" :class="[
                            activeSection === 'features'
                                ? 'text-green-600 font-medium'
                                : 'text-gray-600 hover:text-gray-900'
                        ]" class="cursor-pointer transition-colors duration-200">How I work</a>
                    </nav>

                    <!-- Desktop CTA Buttons -->
                    <div class="hidden md:flex items-center space-x-3">
                        <a href="tel:+12019790148"
                            class="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors shadow-sm">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                            <span>Call Me</span>
                        </a>
                        <NuxtLink v-if="!isLoggedIn" to="/auth/login"
                            class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm hover:shadow-md">
                            <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1">
                                </path>
                            </svg>
                            Login
                        </NuxtLink>
                        <NuxtLink v-else to="/dashboard"
                            class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm hover:shadow-md">
                            <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z">
                                </path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z">
                                </path>
                            </svg>
                            Dashboard
                        </NuxtLink>
                    </div>

                    <!-- Mobile Menu Button -->
                    <div class="flex items-center space-x-2 md:hidden">
                        <div class="relative w-10 h-10 flex items-center justify-center rounded-full">
                            <span class="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-20"></span>
                            <a href="tel:+12019790148"
                                class="p-2 rounded-full hover:bg-blue-50 transition-colors relative z-10"
                                aria-label="Call Me">
                                <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                </svg>
                            </a>
                        </div>
                        <button @click="toggleMobileMenu" class="p-2 rounded-lg hover:bg-gray-100/50 transition-colors">
                            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Mobile Menu -->
                <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-200/50 bg-white/90 backdrop-blur-md">
                    <div class="px-2 pt-2 pb-3 space-y-1">
                        <a href="#" @click="scrollToTop" :class="[
                            activeSection === 'home'
                                ? 'block px-3 py-2 text-green-600 font-medium hover:bg-gray-50/50 rounded'
                                : 'block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50/50 rounded'
                        ]" class="cursor-pointer transition-colors duration-200">Home</a>
                        <a href="#features" @click="scrollToFeatures" :class="[
                            activeSection === 'features'
                                ? 'block px-3 py-2 text-green-600 font-medium hover:bg-gray-50/50 rounded'
                                : 'block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50/50 rounded'
                        ]" class="cursor-pointer transition-colors duration-200">How I work</a>

                        <NuxtLink v-if="!isLoggedIn" to="/auth/login"
                            class="w-full bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm hover:shadow-md flex items-center justify-center space-x-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1">
                                </path>
                            </svg>
                            <span>Login</span>
                        </NuxtLink>
                        <NuxtLink v-else to="/dashboard"
                            class="w-full bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm hover:shadow-md flex items-center justify-center space-x-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z">
                                </path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z">
                                </path>
                            </svg>
                            <span>Dashboard</span>
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </header>

        <!-- Hero Section -->
        <section class="py-20 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid lg:grid-cols-2 gap-12 items-center">
                    <!-- Left Content -->
                    <div class="space-y-8">
                        <h1 class="text-3xl lg:text-xl font-medium text-gray-900 leading-tight">
                            Qwesi - Your 24/7 Career & Recruitment Assistant
                            <span class="inline-block w-3 h-3 bg-green-500 rounded-full ml-2"></span>
                        </h1>

                        <div class="space-y-6">
                            <div class="grid grid-cols-1 sm:flex sm:flex-row lg:grid lg:grid-cols-2 gap-4">
                                <a href="https://api.whatsapp.com/send/?phone=12019790148&text&type=phone_number&app_absent=0"
                                    target="_blank" rel="noopener noreferrer"
                                    class="w-full sm:w-auto bg-green-500 text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-green-600 transition-colors h-full">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path
                                            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                                    </svg>
                                    <span>Get Started on WhatsApp</span>
                                </a>
                                <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-all duration-300 cursor-pointer group w-full h-full"
                                    @click="openDemoModal">
                                    <div class="relative">
                                        <button
                                            class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 group-hover:scale-105">
                                            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M8 5v10l8-5-8-5z" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <span
                                            class="text-gray-900 font-medium text-base group-hover:text-blue-600 transition-colors duration-300">Watch
                                            Demo Video</span>
                                        <p class="text-gray-600 text-xs mt-0.5">See Qwesi in action</p>
                                    </div>
                                    <svg class="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors duration-300 flex-shrink-0"
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Content - Illustration -->
                    <div class="flex justify-center lg:justify-end">
                        <div class="relative">
                            <!-- Thinking UI Elements -->
                            <div
                                class="absolute -top-4 -right-4 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center animate-bounce">
                                <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                            </div>
                            <div class="absolute -top-2 -right-12 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center animate-bounce"
                                style="animation-delay: 0.2s;">
                                <div class="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            </div>
                            <div class="absolute top-8 -right-8 w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center animate-bounce"
                                style="animation-delay: 0.4s;">
                                <div class="w-1 h-1 bg-purple-500 rounded-full"></div>
                            </div>

                            <!-- Floating dots around the image -->
                            <div
                                class="absolute -top-6 left-8 w-3 h-3 bg-yellow-400 rounded-full animate-pulse opacity-80">
                            </div>
                            <div class="absolute top-4 -left-4 w-2 h-2 bg-pink-400 rounded-full animate-pulse opacity-70"
                                style="animation-delay: 0.5s;"></div>
                            <div class="absolute top-16 -left-6 w-2.5 h-2.5 bg-indigo-400 rounded-full animate-pulse opacity-60"
                                style="animation-delay: 1s;"></div>

                            <!-- Main Image -->
                            <img src="@/assets/images/qwesi-image.png" alt="Professional AI Assistant"
                                class="w-64 h-auto object-contain rounded-2xl animate-breathing relative z-10" />

                            <!-- Bottom thinking elements -->
                            <div class="absolute -bottom-4 left-12 w-4 h-4 bg-orange-100 rounded-full flex items-center justify-center animate-bounce"
                                style="animation-delay: 0.6s;">
                                <div class="w-1 h-1 bg-orange-500 rounded-full"></div>
                            </div>
                            <div class="absolute -bottom-2 right-8 w-3 h-3 bg-teal-100 rounded-full flex items-center justify-center animate-bounce"
                                style="animation-delay: 0.8s;">
                                <div class="w-0.5 h-0.5 bg-teal-500 rounded-full"></div>
                            </div>

                            <!-- Connection lines (subtle) -->
                            <div
                                class="absolute top-1/2 -right-2 w-8 h-px bg-gradient-to-r from-blue-200 to-transparent opacity-30">
                            </div>
                            <div
                                class="absolute top-1/3 -left-2 w-6 h-px bg-gradient-to-l from-green-200 to-transparent opacity-30">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section id="features" class="py-20 bg-gray-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid md:grid-cols-3 gap-8">
                    <!-- Feature 1 -->
                    <div class="bg-white p-8 rounded-xl hover:shadow-lg hover:border-blue-200 hover:bg-blue-50 transition-all duration-300 ease-in-out transform hover:-translate-y-1 group border border-transparent opacity-0 translate-y-8"
                        :class="{ 'animate-fade-in-up': featuresAnimated }" style="animation-delay: 0.1s;">
                        <div
                            class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors duration-300">
                            <svg class="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform duration-300"
                                fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                        </div>
                        <h3
                            class="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-900 transition-colors duration-300">
                            Automated Job Alerts
                        </h3>
                        <p class="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                            Qwesi finds and emails you job opportunities based on your skills—
                            no more endless searching.
                        </p>
                    </div>

                    <!-- Feature 2 -->
                    <div class="bg-white p-8 rounded-xl hover:shadow-lg hover:border-green-200 hover:bg-green-50 transition-all duration-300 ease-in-out transform hover:-translate-y-1 group border border-transparent opacity-0 translate-y-8"
                        :class="{ 'animate-fade-in-up': featuresAnimated }" style="animation-delay: 0.2s;">
                        <div
                            class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors duration-300">
                            <svg class="w-6 h-6 text-green-600 group-hover:scale-110 transition-transform duration-300"
                                fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd"
                                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                    clipRule="evenodd" />
                            </svg>
                        </div>
                        <h3
                            class="text-xl font-bold text-gray-900 mb-4 group-hover:text-green-900 transition-colors duration-300">
                            Homework & Job Assistant
                        </h3>
                        <p class="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                            Stuck with a question or need help preparing for work? Qwesi is
                            always ready to assist you, day or night.
                        </p>
                    </div>

                    <!-- Feature 3 -->
                    <div class="bg-white p-8 rounded-xl hover:shadow-lg hover:border-blue-200 hover:bg-blue-50 transition-all duration-300 ease-in-out transform hover:-translate-y-1 group border border-transparent opacity-0 translate-y-8"
                        :class="{ 'animate-fade-in-up': featuresAnimated }" style="animation-delay: 0.3s;">
                        <div
                            class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors duration-300">
                            <svg class="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform duration-300"
                                fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                            </svg>
                        </div>
                        <h3
                            class="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-900 transition-colors duration-300">
                            Investor Matchmaking
                        </h3>
                        <p class="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                            Qwesi helps you meet the right investors who align with your
                            project, passion, and growth vision.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Company Logos Section -->
        <section class="py-16 bg-gray-50">
            <div class="max-w-7xl mx-auto">
                <div class="text-center mb-12">
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">
                        Connect With People From Top Companies
                    </h2>
                    <p class="text-gray-600">
                        Grow your network with professionals from industry-leading
                        organizations.
                    </p>
                </div>

                <div class="relative overflow-hidden">
                    <div class="flex animate-scroll-left">
                        <!-- First set of logos -->
                        <div class="flex items-center space-x-12 flex-shrink-0">
                            <div class="w-32 h-16 flex items-center justify-center">
                                <img src="@/assets/images/brands/linkedin.png" alt="LinkedIn"
                                    class="w-full h-full object-contain" />
                            </div>
                            <div class="w-32 h-16 flex items-center justify-center">
                                <img src="@/assets/images/brands/amazon.png" alt="Amazon"
                                    class="w-full h-full object-contain" />
                            </div>
                            <div class="w-32 h-16 flex items-center justify-center">
                                <img src="@/assets/images/brands/microsoft.png" alt="Microsoft"
                                    class="w-full h-full object-contain" />
                            </div>
                            <div class="w-32 h-16 flex items-center justify-center">
                                <img src="@/assets/images/brands/apple.png" alt="Apple"
                                    class="w-full h-full object-contain" />
                            </div>
                            <div class="w-32 h-16 flex items-center justify-center">
                                <img src="@/assets/images/brands/meta.png" alt="Meta"
                                    class="w-full h-full object-contain" />
                            </div>
                            <div class="w-32 h-16 flex items-center justify-center">
                                <img src="@/assets/images/brands/netflix.webp" alt="Netflix"
                                    class="w-full h-full object-contain" />
                            </div>
                            <div class="w-32 h-16 flex items-center justify-center">
                                <img src="@/assets/images/brands/ibm.png" alt="IBM"
                                    class="w-full h-full object-contain" />
                            </div>
                            <div class="w-32 h-16 flex items-center justify-center">
                                <img src="@/assets/images/brands/google.png" alt="Google"
                                    class="w-full h-full object-contain" />
                            </div>
                        </div>
                        <!-- Duplicate set for seamless loop -->
                        <div class="flex items-center space-x-12 flex-shrink-0">
                            <div class="w-32 h-16 flex items-center justify-center">
                                <img src="@/assets/images/brands/linkedin.png" alt="LinkedIn"
                                    class="w-full h-full object-contain" />
                            </div>
                            <div class="w-32 h-16 flex items-center justify-center">
                                <img src="@/assets/images/brands/amazon.png" alt="Amazon"
                                    class="w-full h-full object-contain" />
                            </div>
                            <div class="w-32 h-16 flex items-center justify-center">
                                <img src="@/assets/images/brands/microsoft.png" alt="Microsoft"
                                    class="w-full h-full object-contain" />
                            </div>
                            <div class="w-32 h-16 flex items-center justify-center">
                                <img src="@/assets/images/brands/apple.png" alt="Apple"
                                    class="w-full h-full object-contain" />
                            </div>
                            <div class="w-32 h-16 flex items-center justify-center">
                                <img src="@/assets/images/brands/meta.png" alt="Meta"
                                    class="w-full h-full object-contain" />
                            </div>
                            <div class="w-32 h-16 flex items-center justify-center">
                                <img src="@/assets/images/brands/netflix.webp" alt="Netflix"
                                    class="w-full h-full object-contain" />
                            </div>
                            <div class="w-32 h-16 flex items-center justify-center">
                                <img src="@/assets/images/brands/ibm.png" alt="IBM"
                                    class="w-full h-full object-contain" />
                            </div>
                            <div class="w-32 h-16 flex items-center justify-center">
                                <img src="@/assets/images/brands/google.png" alt="Google"
                                    class="w-full h-full object-contain" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Statistics Section -->
        <section id="stats" class="py-20 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid md:grid-cols-4 gap-8">
                    <!-- Stat 1 -->
                    <div class="text-center">
                        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                            </svg>
                        </div>
                        <div class="text-3xl font-bold text-blue-600 mb-2 transition-transform duration-300"
                            :class="{ 'scale-110': statsAnimated }">{{ animatedStats.jobSeekers.toLocaleString() }}
                        </div>
                        <p class="text-gray-600">Job Seekers Assisted</p>
                    </div>

                    <!-- Stat 2 -->
                    <div class="text-center">
                        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd"
                                    d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                                    clipRule="evenodd" />
                            </svg>
                        </div>
                        <div class="text-3xl font-bold text-blue-600 mb-2 transition-transform duration-300"
                            :class="{ 'scale-110': statsAnimated }">{{ animatedStats.jobsSent.toLocaleString() }}</div>
                        <p class="text-gray-600">Jobs Sent to Users</p>
                    </div>

                    <!-- Stat 3 -->
                    <div class="text-center">
                        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd" />
                            </svg>
                        </div>
                        <div class="text-3xl font-bold text-blue-600 mb-2 transition-transform duration-300"
                            :class="{ 'scale-110': statsAnimated }">{{ animatedStats.successfulMatches.toLocaleString()
                            }}</div>
                        <p class="text-gray-600">Successful Matches</p>
                    </div>

                    <!-- Stat 4 -->
                    <div class="text-center">
                        <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd"
                                    d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                                    clipRule="evenodd" />
                            </svg>
                        </div>
                        <div class="text-3xl font-bold text-blue-600 mb-2 transition-transform duration-300"
                            :class="{ 'scale-110': statsAnimated }">{{ animatedStats.partneredCompanies.toLocaleString()
                            }}</div>
                        <p class="text-gray-600">Partnered Companies</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Testimonials Section -->
        <section class="py-20 bg-white">
            <div class="max-w-7xl mx-auto">
                <div class="text-center mb-16 px-4">
                    <h2 class="text-4xl font-bold text-gray-900 mb-6">TESTIMONIALS</h2>
                    <p class="text-lg text-gray-600 mb-4">
                        Discover how Qwesi AI is empowering people across the globe through
                        voice, WhatsApp, and smart conversations.
                    </p>
                    <p class="text-gray-600">
                        See how Qwesi AI is transforming lives - from job seekers and
                        students to entrepreneurs. Real feedback from real users.
                    </p>
                </div>

                <div class="relative overflow-hidden">
                    <!-- Navigation Arrows -->
                    <button @click="() => { previousTestimonial(); pauseAutoScroll(); }"
                        class="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/40 backdrop-blur border border-white/30 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        aria-label="Previous testimonial">
                        <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button @click="() => { nextTestimonial(); pauseAutoScroll(); }"
                        class="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/40 backdrop-blur border border-white/30 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        aria-label="Next testimonial">
                        <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    <!-- Testimonials Container -->
                    <div class="flex transition-transform duration-500 ease-in-out"
                        :style="{ transform: `translateX(-${currentTestimonialIndex * 100}%)` }"
                        @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd"
                        @keydown="handleKeydown" tabindex="0" role="region" aria-label="Testimonials carousel">

                        <div v-for="(testimonial, index) in testimonials" :key="index"
                            class="w-full flex-shrink-0 px-4">
                            <div class="bg-gray-50 p-8 rounded-xl max-w-md mx-auto">
                                <div class="text-blue-600 text-4xl mb-4">"</div>
                                <p class="text-gray-700 mb-6">
                                    {{ testimonial.text }}
                                </p>
                                <div class="flex items-center space-x-4">
                                    <div class="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                                        <span class="text-blue-600 font-bold">{{ testimonial.initials }}</span>
                                    </div>
                                    <div>
                                        <h4 class="font-semibold text-gray-900">{{ testimonial.name }}</h4>
                                        <p class="text-gray-600">{{ testimonial.role }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Pagination Dots -->
                <div class="flex justify-center mt-8 space-x-2" role="tablist" aria-label="Testimonial navigation">
                    <button v-for="(testimonial, index) in testimonials" :key="index" @click="goToTestimonial(index)"
                        :class="[
                            'w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                            currentTestimonialIndex === index
                                ? 'bg-blue-600 scale-110'
                                : 'bg-gray-300 hover:bg-gray-400 hover:scale-105'
                        ]" :aria-label="`Go to testimonial ${index + 1}`"
                        :aria-selected="currentTestimonialIndex === index" role="tab"></button>
                </div>
            </div>
        </section>

        <!-- Team Section -->
        <section class="py-20 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h2 class="text-4xl font-bold text-gray-900 mb-6">TEAM</h2>
                    <p class="text-lg text-gray-600 max-w-3xl mx-auto">
                        Meet the passionate minds behind Qwesi AI – a dedicated team of
                        innovators, engineers, and educators committed to making powerful AI
                        accessible to everyone, everywhere.
                    </p>
                </div>

                <div class="grid grid-cols-1 md:flex md:justify-center md:space-x-16 max-w-4xl mx-auto gap-8 md:gap-0">
                    <!-- Team Member 1 -->
                    <div class="text-center">
                        <img src="@/assets/images/paul.png" alt="DR. Paul Amissah"
                            class="w-48 h-48 rounded-full mx-auto mb-6 object-cover" />
                        <h3 class="text-xl font-bold text-gray-900 mb-2">
                            DR. Paul Amissah
                        </h3>
                        <p class="text-blue-600 mb-4">Chief Executive Officer</p>
                        <div class="flex justify-center">
                            <a href="https://www.linkedin.com/in/paul-amissah-91b98890/" target="_blank"
                                rel="noopener noreferrer" class="text-gray-400 hover:text-blue-700 transition-colors">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path
                                        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    <!-- Team Member 2 -->
                    <div class="text-center">
                        <img src="@/assets/images/rexton.jpg" alt="Rexton Itsiah"
                            class="w-48 h-48 rounded-full mx-auto mb-6 object-cover" />
                        <h3 class="text-xl font-bold text-gray-900 mb-2">Rexton Itsiah</h3>
                        <p class="text-blue-600 mb-4">Technical Co-Founder</p>
                        <div class="flex justify-center">
                            <a href="https://www.linkedin.com/in/rexton-itsiah-129945173/" target="_blank"
                                rel="noopener noreferrer" class="text-gray-400 hover:text-blue-700 transition-colors">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path
                                        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <Footer :show-scroll-top="true" />

        <!-- Demo Modal -->
        <DemoModal :is-open="demoModalOpen" @close="closeDemoModal" />
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import DemoModal from "@/components/landing/demo.vue";
import Footer from "@/components/Footer.vue";
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore();
const mobileMenuOpen = ref(false);
const demoModalOpen = ref(false);
const activeSection = ref('home');
const statsAnimated = ref(false);
const featuresAnimated = ref(false);

// Computed property to safely check login status
const isLoggedIn = computed(() => {
    try {
        if (process.client && authStore) {
            return authStore.isLoggedIn;
        }
        return false;
    } catch (error) {
        console.warn('Auth store not ready:', error);
        return false;
    }
});

// Testimonials functionality
const currentTestimonialIndex = ref(0);
const touchStartX = ref(0);
const touchEndX = ref(0);
const autoScrollInterval = ref(null);
const isUserInteracting = ref(false);

const testimonials = ref([
    {
        name: "Akua Boateng",
        role: "High School Student",
        initials: "AB",
        text: "As a student, I use Qwesi AI for math homework and research questions. It's like having a smart friend available 24/7 on my phone!"
    },
    {
        name: "Kwabena Owusu",
        role: "Entrepreneur",
        initials: "KO",
        text: "I run a small business and Qwesi AI helped me draft customer emails, proposals, and even marketing plans. It saves me so much time and effort."
    },
    {
        name: "Nana Ama",
        role: "Family Caregiver",
        initials: "NA",
        text: "What I love most about Qwesi is the voice support. I can just speak and get intelligent responses – no typing needed. It's helped my grandma use tech more confidently."
    },
    {
        name: "Sarah Kwame",
        role: "Software Developer",
        initials: "SK",
        text: "Qwesi AI transformed my job search. It found opportunities I never would have discovered and helped me prepare for interviews perfectly!"
    },
    {
        name: "Michael Addo",
        role: "Startup Founder",
        initials: "MA",
        text: "The investor matchmaking feature is incredible! Qwesi connected me with the perfect investors who understood my vision and helped scale my startup."
    }
]);

const startAutoScroll = () => {
    if (autoScrollInterval.value) {
        clearInterval(autoScrollInterval.value);
    }
    autoScrollInterval.value = setInterval(() => {
        if (!isUserInteracting.value) {
            nextTestimonial();
        }
    }, 4000); // Change testimonial every 4 seconds
};

const stopAutoScroll = () => {
    if (autoScrollInterval.value) {
        clearInterval(autoScrollInterval.value);
        autoScrollInterval.value = null;
    }
};

const pauseAutoScroll = () => {
    isUserInteracting.value = true;
    stopAutoScroll();

    // Resume auto-scroll after 5 seconds of inactivity
    setTimeout(() => {
        isUserInteracting.value = false;
        startAutoScroll();
    }, 5000);
};

const nextTestimonial = () => {
    currentTestimonialIndex.value = (currentTestimonialIndex.value + 1) % testimonials.value.length;
};

const previousTestimonial = () => {
    currentTestimonialIndex.value = currentTestimonialIndex.value === 0
        ? testimonials.value.length - 1
        : currentTestimonialIndex.value - 1;
};

const goToTestimonial = (index) => {
    currentTestimonialIndex.value = index;
    pauseAutoScroll();
};

// Touch/swipe functionality
const handleTouchStart = (event) => {
    touchStartX.value = event.touches[0].clientX;
    pauseAutoScroll();
};

const handleTouchMove = (event) => {
    touchEndX.value = event.touches[0].clientX;
};

const handleTouchEnd = () => {
    const swipeThreshold = 50;
    const diff = touchStartX.value - touchEndX.value;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swiped left - next testimonial
            nextTestimonial();
        } else {
            // Swiped right - previous testimonial
            previousTestimonial();
        }
    }
};

// Keyboard navigation
const handleKeydown = (event) => {
    if (event.key === 'ArrowLeft') {
        previousTestimonial();
        pauseAutoScroll();
    } else if (event.key === 'ArrowRight') {
        nextTestimonial();
        pauseAutoScroll();
    }
};

const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value;
};

const openDemoModal = () => {
    demoModalOpen.value = true;
};

const closeDemoModal = () => {
    demoModalOpen.value = false;
};

const handleScroll = () => {
    if (!process.client) return;

    // Detect active section based on scroll position
    const scrollY = window.scrollY;
    const featuresSection = document.getElementById('features');
    const statsSection = document.getElementById('stats');

    if (featuresSection) {
        const featuresTop = featuresSection.offsetTop;
        const featuresBottom = featuresTop + featuresSection.offsetHeight;

        if (scrollY >= featuresTop - 100 && scrollY < featuresBottom - 100) {
            activeSection.value = 'features';
        } else if (statsSection && scrollY >= statsSection.offsetTop - 200 && scrollY < statsSection.offsetTop + statsSection.offsetHeight - 100) {
            activeSection.value = 'stats';
            // Trigger animation when stats section is approaching viewport
            if (!statsAnimated.value && scrollY >= statsSection.offsetTop - 100) {
                animateStats();
            }
        } else {
            activeSection.value = 'home';
        }
    }
};

const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
        featuresSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        activeSection.value = 'features';
    }
};

const animatedStats = ref({
    jobSeekers: 0,
    jobsSent: 0,
    successfulMatches: 0,
    partneredCompanies: 0,
});

const animateStats = () => {
    if (statsAnimated.value) return; // Prevent re-animation

    statsAnimated.value = true;
    const duration = 1500; // Reduced animation duration for more responsiveness
    const startTime = performance.now();

    const animate = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);

        // Use easing function for smoother animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);

        animatedStats.value.jobSeekers = Math.floor(easeOutQuart * 10000);
        animatedStats.value.jobsSent = Math.floor(easeOutQuart * 5000);
        animatedStats.value.successfulMatches = Math.floor(easeOutQuart * 7000);
        animatedStats.value.partneredCompanies = Math.floor(easeOutQuart * 200);

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    };

    requestAnimationFrame(animate);
};

onMounted(() => {
    if (process.client) {
        window.addEventListener("scroll", handleScroll);
        window.addEventListener("keydown", handleKeydown);
        startAutoScroll(); // Start auto-scrolling on mount

        // Set up Intersection Observer for stats animation
        const statsSection = document.getElementById('stats');
        if (statsSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !statsAnimated.value) {
                        animateStats();
                    }
                });
            }, {
                threshold: 0.3, // Trigger when 30% of the section is visible
                rootMargin: '0px 0px -100px 0px' // Trigger 100px before the section comes into view
            });

            observer.observe(statsSection);
        }

        // Set up Intersection Observer for features animation
        const featuresSection = document.getElementById('features');
        if (featuresSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !featuresAnimated.value) {
                        featuresAnimated.value = true;
                    }
                });
            }, {
                threshold: 0.2, // Trigger when 20% of the section is visible
                rootMargin: '0px 0px -50px 0px' // Trigger 50px before the section comes into view
            });

            observer.observe(featuresSection);
        }
    }
});

onUnmounted(() => {
    if (process.client) {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("keydown", handleKeydown);
        stopAutoScroll(); // Stop auto-scrolling on unmount
    }
});
</script>

<style scoped>
/* Fade in up animation for features */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(32px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in-up {
    animation: fadeInUp 0.8s ease-out forwards;
}

/* Breathing animation for the main image */
@keyframes breathing {

    0%,
    100% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.05);
    }
}

.animate-breathing {
    animation: breathing 4s ease-in-out infinite;
}
</style>
