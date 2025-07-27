<template>
    <div class="min-h-screen bg-white">
        <!-- Header/Navigation -->
        <header class="bg-white border-b border-gray-100 sticky top-0 z-50">
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
                        ]" class="cursor-pointer">Home</a>
                        <a href="#features" @click="scrollToFeatures" :class="[
                            activeSection === 'features'
                                ? 'text-green-600 font-medium'
                                : 'text-gray-600 hover:text-gray-900'
                        ]" class="cursor-pointer">How I work</a>
                    </nav>

                    <!-- Desktop CTA Buttons -->
                    <div class="hidden md:flex items-center space-x-3">
                        <a href="tel:+12019790148"
                            class="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                            <span>Call Me</span>
                        </a>
                        <NuxtLink v-if="!authStore.isLoggedIn" to="/auth/login"
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
                    <button @click="toggleMobileMenu"
                        class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h16" />
                            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <!-- Mobile Menu -->
                <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-200 bg-white">
                    <div class="px-2 pt-2 pb-3 space-y-1">
                        <a href="#" @click="scrollToTop" :class="[
                            activeSection === 'home'
                                ? 'block px-3 py-2 text-green-600 font-medium hover:bg-gray-50 rounded'
                                : 'block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded'
                        ]" class="cursor-pointer">Home</a>
                        <a href="#features" @click="scrollToFeatures" :class="[
                            activeSection === 'features'
                                ? 'block px-3 py-2 text-green-600 font-medium hover:bg-gray-50 rounded'
                                : 'block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded'
                        ]" class="cursor-pointer">How I work</a>
                        <div class="pt-4 space-y-2">
                            <a href="tel:+12019790148"
                                class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                </svg>
                                <span>Call Me</span>
                            </a>
                            <NuxtLink v-if="!authStore.isLoggedIn" to="/auth/login"
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
            </div>
        </header>

        <!-- Hero Section -->
        <section class="py-20 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid lg:grid-cols-2 gap-12 items-center">
                    <!-- Left Content -->
                    <div class="space-y-8">
                        <h1 class="text-lg lg:text-xl font-medium text-gray-900 leading-tight">
                            Qwesi - Your 24/7 Career & Recruitment Assistant
                            <span class="inline-block w-3 h-3 bg-green-500 rounded-full ml-2"></span>
                        </h1>

                        <div class="space-y-6">
                            <div
                                class="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                                <a href="https://api.whatsapp.com/send/?phone=12019790148&text&type=phone_number&app_absent=0"
                                    target="_blank" rel="noopener noreferrer"
                                    class="w-full sm:w-auto bg-green-500 text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-green-600 transition-colors">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                    <span>Get Started on WhatsApp</span>
                                </a>

                                <button
                                    class="w-full sm:w-auto bg-blue-500 text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-600 transition-colors">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                    </svg>
                                    <span>Get Started on here</span>
                                </button>
                            </div>

                            <div class="flex items-center space-x-3">
                                <button @click="openDemoModal"
                                    class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                                    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M8 5v10l8-5-8-5z" />
                                    </svg>
                                </button>
                                <span class="text-gray-900 font-medium">Watch demo Video</span>
                            </div>
                        </div>
                    </div>

                    <!-- Right Content - Illustration -->
                    <div class="flex justify-center lg:justify-end">
                        <div class="relative">
                            <img src="@/assets/images/qwesi-image.png" alt="Professional AI Assistant"
                                class="w-64 h-auto object-contain rounded-2xl animate-breathing" />
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
                    <div class="bg-white p-8 rounded-xl">
                        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                            <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-4">
                            Automated Job Alerts
                        </h3>
                        <p class="text-gray-600">
                            Qwesi finds and emails you job opportunities based on your skills—
                            no more endless searching.
                        </p>
                    </div>

                    <!-- Feature 2 -->
                    <div class="bg-white p-8 rounded-xl">
                        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                            <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd"
                                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                    clipRule="evenodd" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-4">
                            Homework & Job Assistant
                        </h3>
                        <p class="text-gray-600">
                            Stuck with a question or need help preparing for work? Qwesi is
                            always ready to assist you, day or night.
                        </p>
                    </div>

                    <!-- Feature 3 -->
                    <div class="bg-white p-8 rounded-xl">
                        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                            <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-4">
                            Investor Matchmaking
                        </h3>
                        <p class="text-gray-600">
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
        <section class="py-20 bg-white">
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
                        <div class="text-3xl font-bold text-blue-600 mb-2">10000</div>
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
                        <div class="text-3xl font-bold text-blue-600 mb-2">5000</div>
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
                        <div class="text-3xl font-bold text-blue-600 mb-2">7000</div>
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
                        <div class="text-3xl font-bold text-blue-600 mb-2">200</div>
                        <p class="text-gray-600">Partnered Companies</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Testimonials Section -->
        <section class="py-20 bg-white">
            <div class="max-w-7xl mx-auto">
                <div class="text-center mb-16">
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
                    <div class="flex animate-scroll-testimonials">
                        <!-- First set of testimonials -->
                        <div class="flex space-x-8 flex-shrink-0">
                            <!-- Testimonial 1 -->
                            <div class="bg-gray-50 p-8 rounded-xl w-80">
                                <div class="text-blue-600 text-4xl mb-4">"</div>
                                <p class="text-gray-700 mb-6">
                                    As a student, I use Qwesi AI for math homework and research
                                    questions. It's like having a smart friend available 24/7 on
                                    my phone!
                                </p>
                                <div class="flex items-center space-x-4">
                                    <div class="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                                        <span class="text-blue-600 font-bold">AB</span>
                                    </div>
                                    <div>
                                        <h4 class="font-semibold text-gray-900">Akua Boateng</h4>
                                        <p class="text-gray-600">High School Student</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Testimonial 2 -->
                            <div class="bg-gray-50 p-8 rounded-xl w-80">
                                <div class="text-blue-600 text-4xl mb-4">"</div>
                                <p class="text-gray-700 mb-6">
                                    I run a small business and Qwesi AI helped me draft customer
                                    emails, proposals, and even marketing plans. It saves me so
                                    much time and effort.
                                </p>
                                <div class="flex items-center space-x-4">
                                    <div class="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                                        <span class="text-blue-600 font-bold">KO</span>
                                    </div>
                                    <div>
                                        <h4 class="font-semibold text-gray-900">Kwabena Owusu</h4>
                                        <p class="text-gray-600">Entrepreneur</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Testimonial 3 -->
                            <div class="bg-gray-50 p-8 rounded-xl w-80">
                                <div class="text-blue-600 text-4xl mb-4">"</div>
                                <p class="text-gray-700 mb-6">
                                    What I love most about Qwesi is the voice support. I can just
                                    speak and get intelligent responses – no typing needed. It's
                                    helped my grandma use tech more confidently.
                                </p>
                                <div class="flex items-center space-x-4">
                                    <div class="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                                        <span class="text-blue-600 font-bold">NA</span>
                                    </div>
                                    <div>
                                        <h4 class="font-semibold text-gray-900">Nana Ama</h4>
                                        <p class="text-gray-600">Family Caregiver</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Testimonial 4 -->
                            <div class="bg-gray-50 p-8 rounded-xl w-80">
                                <div class="text-blue-600 text-4xl mb-4">"</div>
                                <p class="text-gray-700 mb-6">
                                    Qwesi AI transformed my job search. It found opportunities I
                                    never would have discovered and helped me prepare for
                                    interviews perfectly!
                                </p>
                                <div class="flex items-center space-x-4">
                                    <div class="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                                        <span class="text-blue-600 font-bold">SK</span>
                                    </div>
                                    <div>
                                        <h4 class="font-semibold text-gray-900">Sarah Kwame</h4>
                                        <p class="text-gray-600">Software Developer</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Testimonial 5 -->
                            <div class="bg-gray-50 p-8 rounded-xl w-80">
                                <div class="text-blue-600 text-4xl mb-4">"</div>
                                <p class="text-gray-700 mb-6">
                                    The investor matchmaking feature is incredible! Qwesi
                                    connected me with the perfect investors who understood my
                                    vision and helped scale my startup.
                                </p>
                                <div class="flex items-center space-x-4">
                                    <div class="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                                        <span class="text-blue-600 font-bold">MA</span>
                                    </div>
                                    <div>
                                        <h4 class="font-semibold text-gray-900">Michael Addo</h4>
                                        <p class="text-gray-600">Startup Founder</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Duplicate set for seamless loop -->
                        <div class="flex space-x-8 flex-shrink-0">
                            <!-- Testimonial 1 -->
                            <div class="bg-gray-50 p-8 rounded-xl w-80">
                                <div class="text-blue-600 text-4xl mb-4">"</div>
                                <p class="text-gray-700 mb-6">
                                    As a student, I use Qwesi AI for math homework and research
                                    questions. It's like having a smart friend available 24/7 on
                                    my phone!
                                </p>
                                <div class="flex items-center space-x-4">
                                    <div class="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                                        <span class="text-blue-600 font-bold">AB</span>
                                    </div>
                                    <div>
                                        <h4 class="font-semibold text-gray-900">Akua Boateng</h4>
                                        <p class="text-gray-600">High School Student</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Testimonial 2 -->
                            <div class="bg-gray-50 p-8 rounded-xl w-80">
                                <div class="text-blue-600 text-4xl mb-4">"</div>
                                <p class="text-gray-700 mb-6">
                                    I run a small business and Qwesi AI helped me draft customer
                                    emails, proposals, and even marketing plans. It saves me so
                                    much time and effort.
                                </p>
                                <div class="flex items-center space-x-4">
                                    <div class="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                                        <span class="text-blue-600 font-bold">KO</span>
                                    </div>
                                    <div>
                                        <h4 class="font-semibold text-gray-900">Kwabena Owusu</h4>
                                        <p class="text-gray-600">Entrepreneur</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Testimonial 3 -->
                            <div class="bg-gray-50 p-8 rounded-xl w-80">
                                <div class="text-blue-600 text-4xl mb-4">"</div>
                                <p class="text-gray-700 mb-6">
                                    What I love most about Qwesi is the voice support. I can just
                                    speak and get intelligent responses – no typing needed. It's
                                    helped my grandma use tech more confidently.
                                </p>
                                <div class="flex items-center space-x-4">
                                    <div class="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                                        <span class="text-blue-600 font-bold">NA</span>
                                    </div>
                                    <div>
                                        <h4 class="font-semibold text-gray-900">Nana Ama</h4>
                                        <p class="text-gray-600">Family Caregiver</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Testimonial 4 -->
                            <div class="bg-gray-50 p-8 rounded-xl w-80">
                                <div class="text-blue-600 text-4xl mb-4">"</div>
                                <p class="text-gray-700 mb-6">
                                    Qwesi AI transformed my job search. It found opportunities I
                                    never would have discovered and helped me prepare for
                                    interviews perfectly!
                                </p>
                                <div class="flex items-center space-x-4">
                                    <div class="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                                        <span class="text-blue-600 font-bold">SK</span>
                                    </div>
                                    <div>
                                        <h4 class="font-semibold text-gray-900">Sarah Kwame</h4>
                                        <p class="text-gray-600">Software Developer</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Testimonial 5 -->
                            <div class="bg-gray-50 p-8 rounded-xl w-80">
                                <div class="text-blue-600 text-4xl mb-4">"</div>
                                <p class="text-gray-700 mb-6">
                                    The investor matchmaking feature is incredible! Qwesi
                                    connected me with the perfect investors who understood my
                                    vision and helped scale my startup.
                                </p>
                                <div class="flex items-center space-x-4">
                                    <div class="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                                        <span class="text-blue-600 font-bold">MA</span>
                                    </div>
                                    <div>
                                        <h4 class="font-semibold text-gray-900">Michael Addo</h4>
                                        <p class="text-gray-600">Startup Founder</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Pagination Dots -->
                <div class="flex justify-center mt-8 space-x-2">
                    <div class="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                    <div class="w-3 h-3 bg-blue-600 rounded-full animate-pulse" style="animation-delay: 8s"></div>
                    <div class="w-3 h-3 bg-blue-600 rounded-full animate-pulse" style="animation-delay: 16s"></div>
                    <div class="w-3 h-3 bg-blue-600 rounded-full animate-pulse" style="animation-delay: 24s"></div>
                    <div class="w-3 h-3 bg-blue-600 rounded-full animate-pulse" style="animation-delay: 32s"></div>
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
        <footer class="bg-white border-t border-gray-200">
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
                            <a href="#" class="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                                <span class="text-blue-600">></span>
                                <span>Home</span>
                            </a>
                            <a href="#" class="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                                <span class="text-blue-600">></span>
                                <span>How I Work</span>
                            </a>
                            <a href="#" class="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                                <span class="text-blue-600">></span>
                                <span>Privacy Policy</span>
                            </a>
                            <a href="#" class="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                                <span class="text-blue-600">></span>
                                <span>Frequently Asked Questions</span>
                            </a>
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

            <!-- Scroll to Top Button -->
            <button @click="scrollToTop" :class="[
                'fixed bottom-8 right-8 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-all duration-300 ease-in-out',
                showScrollTop
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

        <!-- Demo Modal -->
        <DemoModal :is-open="demoModalOpen" @close="closeDemoModal" />
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import DemoModal from "@/components/landing/demo.vue";
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore();
const mobileMenuOpen = ref(false);
const showScrollTop = ref(false);
const demoModalOpen = ref(false);
const activeSection = ref('home');

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
    showScrollTop.value = window.scrollY > 300;

    // Detect active section based on scroll position
    const scrollY = window.scrollY;
    const featuresSection = document.getElementById('features');

    if (featuresSection) {
        const featuresTop = featuresSection.offsetTop;
        const featuresBottom = featuresTop + featuresSection.offsetHeight;

        if (scrollY >= featuresTop - 100 && scrollY < featuresBottom - 100) {
            activeSection.value = 'features';
        } else {
            activeSection.value = 'home';
        }
    }
};

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
    activeSection.value = 'home';
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

onMounted(() => {
    window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
});
</script>
