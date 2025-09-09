<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-x-hidden relative">
    <!-- Animated background elements -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div class="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
    </div>

    <!-- Header/Navigation -->
    <header class="fixed top-0 left-0 w-full z-50 transition-all duration-300">
      <div class="glass-nav border-b border-white/10">
        <div class="max-w-7xl mx-auto px-6 lg:px-8">
          <div class="flex justify-between items-center h-20">
            <!-- Logo -->
            <div class="flex items-center space-x-3">
              <div class="relative">
                <img src="~/assets/images/logo.png" alt="QWESI AI Logo" class="w-36 h-auto " />
                <div class="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-20 rounded-lg "></div>
              </div>
            </div>

            <!-- Desktop Navigation -->
            <nav class="hidden md:flex items-center space-x-12">
              <a href="#" @click="scrollToTop" 
                :class="[
                  activeSection === 'home'
                    ? 'text-white font-semibold bg-white/10 px-4 py-2 rounded-full'
                    : 'text-white/80 hover:text-white hover:bg-white/5 px-4 py-2 rounded-full'
                ]" 
                class="cursor-pointer transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                Home
              </a>
              <a href="#features" @click="scrollToFeatures" 
                :class="[
                  activeSection === 'features'
                    ? 'text-white font-semibold bg-white/10 px-4 py-2 rounded-full'
                    : 'text-white/80 hover:text-white hover:bg-white/5 px-4 py-2 rounded-full'
                ]" 
                class="cursor-pointer transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                How I work
              </a>
            </nav>

            <!-- Desktop CTA Buttons -->
            <div class="hidden md:flex items-center space-x-4">
              <div class="relative inline-block">
                <div class="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-30"></div>
                <a href="tel:+12019790148"
                    class="relative flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 border border-blue-400 hover:bg-blue-700 transition-all duration-300 hover:scale-110 group"
                    aria-label="Call Me">
                    <svg class="w-6 h-6 text-white group-hover:text-blue-200 transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                </a>
              </div>
              
              <NuxtLink v-if="!isLoggedIn" to="/auth/login"
                class="glass-button text-white px-6 py-3 rounded-full hover:bg-white/20 transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105 border border-white/20">
                <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                </svg>
                Login
              </NuxtLink>
              
              <!-- User Dropdown for logged in users -->
              <div v-else class="relative">
                <button @click="userMenuOpen = !userMenuOpen" data-user-button
                  class="glass-button text-white px-4 py-3 rounded-full hover:bg-white/20 transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105 flex items-center space-x-3 border border-white/20">
                  <div v-if="user.profileImage" class="w-8 h-8 rounded-full overflow-hidden border-2 border-white/30">
                    <img :src="user.profileImage" alt="Profile Picture" class="w-full h-full object-cover" />
                  </div>
                  <div v-else class="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                    <span class="text-white font-semibold text-sm">{{ userInitials }}</span>
                  </div>
                  <span>Dashboard</span>
                  <svg class="w-4 h-4 transition-transform duration-300" :class="{ 'rotate-180': userMenuOpen }" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>

                <!-- User Menu -->
                <div v-if="userMenuOpen" data-user-menu
                  class="absolute right-0 mt-3 w-56 glass-card rounded-2xl shadow-2xl border border-white/20 py-3 z-20 animate-fade-in">
                  <NuxtLink to="/dashboard"
                    class="block w-full text-left px-6 py-3 text-sm text-white/90 hover:bg-white/10 transition-all duration-200 rounded-xl mx-2">
                    Dashboard
                  </NuxtLink>
                  <NuxtLink to="/dashboard/profile"
                    class="block w-full text-left px-6 py-3 text-sm text-white/90 hover:bg-white/10 transition-all duration-200 rounded-xl mx-2">
                    Edit Profile
                  </NuxtLink>
                  <button @click="handleLogout"
                    class="block w-full text-left px-6 py-3 text-sm text-white/90 hover:bg-white/10 transition-all duration-200 rounded-xl mx-2">
                    Sign Out
                  </button>
                </div>
              </div>
            </div>

            <!-- Mobile Menu Button -->
            <button @click="toggleMobileMenu" class="md:hidden p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
    
    <!-- Mobile Menu -->
    <div v-if="mobileMenuOpen"
      class="md:hidden fixed top-20 left-0 w-full z-40 glass-nav border-t border-white/10 animate-slide-down">
      <div class="px-6 py-6 space-y-4">
        <a href="#" @click="scrollToTop"
          class="block w-full text-center py-3 px-4 text-white/90 hover:bg-white/10 rounded-xl transition-all duration-300">
          Home
        </a>
        <a href="#features" @click="scrollToFeatures"
          class="block w-full text-center py-3 px-4 text-white/90 hover:bg-white/10 rounded-xl transition-all duration-300">
          How I work
        </a>
        <NuxtLink v-if="!isLoggedIn" to="/auth/login" 
          class="block w-full text-center py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl transition-all duration-300 hover:scale-105">
          Login
        </NuxtLink>
        <NuxtLink v-else to="/dashboard" 
          class="block w-full text-center py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl transition-all duration-300 hover:scale-105">
          Dashboard
        </NuxtLink>
      </div>
    </div>
    
    <!-- Hero Section -->
    <section class="min-h-screen flex items-center justify-center pt-20 pb-20 relative">
      <div class="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div class="grid lg:grid-cols-2 gap-20 items-center">
          <!-- Left Content -->
          <div class="space-y-10">
            <div class="space-y-6">
              <div class="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span class="text-white/90 text-sm font-medium">24/7 AI Assistant</span>
              </div>
              
              <h2 class="text-2xl lg:text-3xl font-light text-white/90 leading-relaxed">
                Your Career & Recruitment Assistant
              </h2>
              
              <p class="text-xl text-white/70 max-w-lg leading-relaxed">
                AI-powered career assistance that works for you around the clock. Get job matches, interview prep, and career guidance.
              </p>
            </div>
            
            <div class="space-y-8">
              <div class="space-y-4">
                <p class="text-white/90 font-semibold text-lg">Get Started</p>
                <div class="flex flex-col sm:flex-row gap-4">
                  <a href="https://api.whatsapp.com/send/?phone=12019790148&text&type=phone_number&app_absent=0"
                    target="_blank" rel="noopener noreferrer"
                    class="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-2xl flex items-center justify-center space-x-3 hover:from-green-400 hover:to-green-500 transition-all duration-300 shadow-2xl hover:shadow-green-500/25 hover:scale-105 font-semibold">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                    </svg>
                    <span>WhatsApp</span>
                  </a>
                  
                  <a href="https://m.me/61577053655499" target="_blank" rel="noopener noreferrer"
                    class="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-2xl flex items-center justify-center space-x-3 hover:from-blue-500 hover:to-blue-600 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 hover:scale-105 font-semibold">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
                    </svg>
                    <span>Messenger</span>
                  </a>
                </div>
              </div>
              
              <div class="glass-card p-6 rounded-2xl border border-white/20 hover:border-white/30 transition-all duration-500 cursor-pointer group shadow-2xl hover:shadow-purple-500/20"
                @click="openDemoModal">
                <div class="flex items-center space-x-4">
                  <div class="relative">
                    <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
                    <button class="relative w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg">
                      <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 5v10l8-5-8-5z" />
                      </svg>
                    </button>
                  </div>
                  <div class="flex-1">
                    <span class="text-white font-semibold text-lg group-hover:text-blue-300 transition-colors duration-300">
                      Watch Demo
                    </span>
                    <p class="text-white/60 text-sm">See how Qwesi works</p>
                  </div>
                  <svg class="w-5 h-5 text-white/60 group-hover:text-white transition-all duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Right Content - Professional AI Illustration -->
          <div class="flex justify-center lg:justify-end">
            <div class="relative">
              <!-- Professional container with modern styling -->
              <div class="relative w-80 h-80 lg:w-96 lg:h-96">
                <!-- Outer glow ring -->
                <div class="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-2xl animate-pulse"></div>
                
                <!-- Inner professional frame -->
                <div class="relative w-full h-full glass-card rounded-3xl p-8 border border-white/20 shadow-2xl backdrop-blur-xl">
                  <!-- Professional AI Image -->
                  <img src="~/assets/images/qwesi-image.png" alt="Professional AI Assistant"
                    class="w-full h-full object-contain rounded-2xl filter brightness-110 contrast-110 animate-float" />
                  
                  <!-- Modern floating indicators -->
                  <div class="absolute -top-4 -right-4 glass-card rounded-full p-3 border border-white/20 shadow-xl animate-bounce">
                    <div class="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></div>
                  </div>
                  
                  <div class="absolute -top-6 -left-6 glass-card rounded-full p-2 border border-white/20 shadow-xl animate-bounce delay-200">
                    <div class="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                  </div>
                  
                  <div class="absolute -bottom-4 -left-4 glass-card rounded-full p-4 border border-white/20 shadow-xl animate-bounce delay-500">
                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  
                  <div class="absolute -bottom-6 -right-6 glass-card rounded-full p-3 border border-white/20 shadow-xl animate-bounce delay-700">
                    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-32 relative">
      <div class="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-white/95 backdrop-blur-3xl"></div>
      <div class="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div class="text-center mb-20">
          <div class="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-300/20 rounded-full px-6 py-3 mb-8">
            <svg class="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-blue-300 font-medium">How It Works</span>
          </div>
          <h2 class="text-5xl lg:text-6xl font-black text-gray-900 mb-6">How Qwesi Works</h2>
          <p class="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            AI-powered assistance that transforms your career journey with personalized support
          </p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-10">
          <!-- Feature 1 -->
          <div class="group relative" :class="{ 'animate-fade-in-up': featuresAnimated }" style="animation-delay: 0.1s;">
            <div class="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div class="relative glass-card p-10 rounded-3xl border border-white/20 hover:border-blue-300/30 transition-all duration-500 hover:scale-105 shadow-2xl hover:shadow-blue-500/20">
              <div class="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 transition-all duration-300">
                <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-900 transition-colors duration-300">
                Automated Job Alerts
              </h3>
              <p class="text-gray-600 text-lg leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                Qwesi finds and emails you job opportunities based on your skills—no more endless searching.
              </p>
            </div>
          </div>

          <!-- Feature 2 -->
          <div class="group relative" :class="{ 'animate-fade-in-up': featuresAnimated }" style="animation-delay: 0.2s;">
            <div class="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div class="relative glass-card p-10 rounded-3xl border border-white/20 hover:border-green-300/30 transition-all duration-500 hover:scale-105 shadow-2xl hover:shadow-green-500/20">
              <div class="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 transition-all duration-300">
                <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-900 transition-colors duration-300">
                Homework & Job Assistant
              </h3>
              <p class="text-gray-600 text-lg leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                Stuck with a question or need help preparing for work? Qwesi is always ready to assist you, day or night.
              </p>
            </div>
          </div>

          <!-- Feature 3 -->
          <div class="group relative" :class="{ 'animate-fade-in-up': featuresAnimated }" style="animation-delay: 0.3s;">
            <div class="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div class="relative glass-card p-10 rounded-3xl border border-white/20 hover:border-purple-300/30 transition-all duration-500 hover:scale-105 shadow-2xl hover:shadow-purple-500/20">
              <div class="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 transition-all duration-300">
                <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-900 transition-colors duration-300">
                Investor Matchmaking
              </h3>
              <p class="text-gray-600 text-lg leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                Qwesi helps you meet the right investors who align with your project, passion, and growth vision.
              </p>
            </div>
          </div>
        </div>

        <!-- Pitch/Challenge Banner -->
        <div v-if="FEATURE_SWITCH.showPitchBanner && showPitchBanner"
          class="mt-20 relative group">
          <div class="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-3xl blur-xl opacity-60"></div>
          <div class="relative glass-card rounded-3xl p-8 lg:p-12 border border-yellow-300/30 shadow-2xl hover:shadow-yellow-500/20 transition-all duration-500">
            
            <!-- Desktop Layout -->
            <div class="hidden md:flex items-center relative z-10">
              <div class="flex items-center mr-6">
                <div class="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17 3a1 1 0 0 1 1 1v2h1a1 1 0 0 1 1 1v2a5 5 0 0 1-4 4.9V15a5 5 0 0 1-4 4.9V21h3a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2h3v-1.1A5 5 0 0 1 7 15v-2.1A5 5 0 0 1 3 7V5a1 1 0 0 1 1-1h1V4a1 1 0 0 1 1-1h12zm-1 2H8v2a3 3 0 0 0 6 0V5zm-8 2v2a3 3 0 0 0 2 2.83V7H6zm10 0h-2v4.83A3 3 0 0 0 18 9V7z" />
                  </svg>
                </div>
              </div>
              <div class="flex-1">
                <h3 class="font-black text-2xl text-gray-900 mb-2">Pitch/Challenge Submissions Open!</h3>
                <p class="text-gray-600 text-lg">Have a great idea, startup, or challenge? Submit it for competitions and get noticed!</p>
              </div>
              <NuxtLink to="/dashboard/get-started?tab=pitch"
                class="ml-8 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-white font-bold px-8 py-4 rounded-2xl shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 hover:scale-105">
                Submit Your Pitch
              </NuxtLink>
            </div>

            <!-- Mobile Layout -->
            <div class="md:hidden space-y-6 relative z-10">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mr-4 shadow-xl">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17 3a1 1 0 0 1 1 1v2h1a1 1 0 0 1 1 1v2a5 5 0 0 1-4 4.9V15a5 5 0 0 1-4 4.9V21h3a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2h3v-1.1A5 5 0 0 1 7 15v-2.1A5 5 0 0 1 3 7V5a1 1 0 0 1 1-1h1V4a1 1 0 0 1 1-1h12zm-1 2H8v2a3 3 0 0 0 6 0V5zm-8 2v2a3 3 0 0 0 2 2.83V7H6zm10 0h-2v4.83A3 3 0 0 0 18 9V7z" />
                  </svg>
                </div>
                <h3 class="font-black text-xl text-gray-900">Pitch/Challenge Submissions Open!</h3>
              </div>
              <p class="text-gray-600 text-base">Have a great idea, startup, or challenge? Submit it for competitions and get noticed!</p>
              <NuxtLink to="/dashboard/get-started?tab=pitch"
                class="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-white font-bold px-6 py-3 rounded-xl shadow-xl hover:shadow-yellow-500/25 transition-all duration-300 hover:scale-105">
                Submit Your Pitch
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Add this section after the Pitch/Challenge Banner and before the closing div of the features section -->
        <!-- Keep everything exactly the same, just add this new banner below the existing pitch banner -->

        <!-- Donation Support Banner -->
        <div v-if="FEATURE_SWITCH.showDonationBanner && showDonationBanner"
          class="mt-12 relative group">
          <div class="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-500/20 rounded-3xl blur-xl opacity-60"></div>
          <div class="relative glass-card rounded-3xl p-8 lg:p-12 border border-green-300/30 shadow-2xl hover:shadow-green-500/20 transition-all duration-500">
            
            <!-- Desktop Layout -->
            <div class="hidden md:flex items-center relative z-10">
              <div class="flex items-center mr-6">
                <div class="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
              </div>
              <div class="flex-1">
                <h3 class="font-black text-2xl text-gray-900 mb-2">Support Our Mission</h3>
                <p class="text-gray-600 text-lg">Help us make AI accessible to everyone. Your donation keeps Qwesi free for students and job seekers!</p>
              </div>
              <button @click="handleDonation"
                :disabled="donationLoading"
                class="ml-8 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-300 hover:to-blue-400 text-white font-bold px-8 py-4 rounded-2xl shadow-2xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                <span v-if="donationLoading" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
                <span v-else>Donate Now</span>
              </button>
            </div>

            <!-- Mobile Layout -->
            <div class="md:hidden space-y-6 relative z-10">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center mr-4 shadow-xl">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <h3 class="font-black text-xl text-gray-900">Support Our Mission</h3>
              </div>
              <p class="text-gray-600 text-base">Help us make AI accessible to everyone. Your donation keeps Qwesi free for students and job seekers!</p>
              <button @click="handleDonation"
                :disabled="donationLoading"
                class="inline-block bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-300 hover:to-blue-400 text-white font-bold px-6 py-3 rounded-xl shadow-xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                <span v-if="donationLoading" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
                <span v-else>Donate Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Company Logos Section -->
    <section class="py-24 bg-white relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-white/50 to-gray-50/50"></div>
      <div class="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div class="text-center mb-16">
          <div class="inline-flex items-center space-x-2 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full px-6 py-3 mb-8">
            <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
            </svg>
            <span class="text-gray-600 font-medium">Network</span>
          </div>
          <h2 class="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
            Connect With People From Top Companies
          </h2>
          <p class="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Grow your network with professionals from industry-leading organizations.
          </p>
        </div>

        <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-50 to-white p-8">
          <div class="flex animate-scroll-left">
            <!-- First set of logos -->
            <div class="flex items-center space-x-16 flex-shrink-0 pr-16">
              <div class="w-40 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 opacity-70 hover:opacity-100 hover:scale-110">
                <img src="~/assets/images/brands/linkedin.png" alt="LinkedIn" class="w-full h-full object-contain" />
              </div>
              <div class="w-40 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 opacity-70 hover:opacity-100 hover:scale-110">
                <img src="~/assets/images/brands/amazon.png" alt="Amazon" class="w-full h-full object-contain" />
              </div>
              <div class="w-40 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 opacity-70 hover:opacity-100 hover:scale-110">
                <img src="~/assets/images/brands/microsoft.png" alt="Microsoft" class="w-full h-full object-contain" />
              </div>
              <div class="w-40 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 opacity-70 hover:opacity-100 hover:scale-110">
                <img src="~/assets/images/brands/apple.png" alt="Apple" class="w-full h-full object-contain" />
              </div>
              <div class="w-40 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 opacity-70 hover:opacity-100 hover:scale-110">
                <img src="~/assets/images/brands/meta.png" alt="Meta" class="w-full h-full object-contain" />
              </div>
              <div class="w-40 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 opacity-70 hover:opacity-100 hover:scale-110">
                <img src="~/assets/images/brands/netflix.webp" alt="Netflix" class="w-full h-full object-contain" />
              </div>
              <div class="w-40 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 opacity-70 hover:opacity-100 hover:scale-110">
                <img src="~/assets/images/brands/ibm.png" alt="IBM" class="w-full h-full object-contain" />
              </div>
              <div class="w-40 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 opacity-70 hover:opacity-100 hover:scale-110">
                <img src="~/assets/images/brands/google.png" alt="Google" class="w-full h-full object-contain" />
              </div>
            </div>
            <!-- Duplicate set for seamless loop -->
            <div class="flex items-center space-x-16 flex-shrink-0 pr-16">
              <div class="w-40 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 opacity-70 hover:opacity-100 hover:scale-110">
                <img src="~/assets/images/brands/linkedin.png" alt="LinkedIn" class="w-full h-full object-contain" />
              </div>
              <div class="w-40 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 opacity-70 hover:opacity-100 hover:scale-110">
                <img src="~/assets/images/brands/amazon.png" alt="Amazon" class="w-full h-full object-contain" />
              </div>
              <div class="w-40 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 opacity-70 hover:opacity-100 hover:scale-110">
                <img src="~/assets/images/brands/microsoft.png" alt="Microsoft" class="w-full h-full object-contain" />
              </div>
              <div class="w-40 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 opacity-70 hover:opacity-100 hover:scale-110">
                <img src="~/assets/images/brands/apple.png" alt="Apple" class="w-full h-full object-contain" />
              </div>
              <div class="w-40 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 opacity-70 hover:opacity-100 hover:scale-110">
                <img src="~/assets/images/brands/meta.png" alt="Meta" class="w-full h-full object-contain" />
              </div>
              <div class="w-40 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 opacity-70 hover:opacity-100 hover:scale-110">
                <img src="~/assets/images/brands/netflix.webp" alt="Netflix" class="w-full h-full object-contain" />
              </div>
              <div class="w-40 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 opacity-70 hover:opacity-100 hover:scale-110">
                <img src="~/assets/images/brands/ibm.png" alt="IBM" class="w-full h-full object-contain" />
              </div>
              <div class="w-40 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 opacity-70 hover:opacity-100 hover:scale-110">
                <img src="~/assets/images/brands/google.png" alt="Google" class="w-full h-full object-contain" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Statistics Section -->
    <section id="stats" class="py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <div class="absolute inset-0">
        <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div class="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div class="text-center mb-16">
          <div class="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-6 py-3 mb-8">
            <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-blue-600 font-medium">Our Team</span>
          </div>
          <h2 class="text-4xl lg:text-5xl font-black text-gray-900 mb-6">Meet The Team</h2>
          <p class="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Meet the passionate minds behind Qwesi AI – a dedicated team of innovators, engineers, and educators committed to making powerful AI accessible to everyone, everywhere.
          </p>
        </div>

        <div class="flex justify-center">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl">
            <!-- Team Member 1 -->
            <div class="group relative">
              <div class="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div class="relative glass-card p-10 rounded-3xl border border-white/30 shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:scale-105 text-center">
                <div class="relative mb-8">
                  <div class="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-2xl"></div>
                  <img src="~/assets/images/paul.png" alt="DR. Paul Amissah"
                    class="relative w-48 h-48 rounded-3xl mx-auto object-cover shadow-2xl border-4 border-white group-hover:scale-105 transition-all duration-300" />
                </div>
                <h3 class="text-2xl font-black text-gray-900 mb-2">DR. Paul Amissah</h3>
                <p class="text-blue-600 mb-6 font-semibold text-lg">Chief Executive Officer</p>
                <div class="flex justify-center">
                  <a href="https://www.linkedin.com/in/paul-amissah-91b98890/" target="_blank"
                    rel="noopener noreferrer" 
                    class="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white hover:from-blue-400 hover:to-blue-500 transition-all duration-300 hover:scale-110 shadow-2xl hover:shadow-blue-500/25">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <!-- Team Member 2 -->
            <div class="group relative">
              <div class="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div class="relative glass-card p-10 rounded-3xl border border-white/30 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:scale-105 text-center">
                <div class="relative mb-8">
                  <div class="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-2xl"></div>
                  <img src="~/assets/images/rexton-1.jpeg" alt="Rexton Itsiah"
                    class="relative w-48 h-48 rounded-3xl mx-auto object-cover shadow-2xl border-4 border-white group-hover:scale-105 transition-all duration-300" />
                </div>
                <h3 class="text-2xl font-black text-gray-900 mb-2">Rexton Itsiah</h3>
                <p class="text-purple-600 mb-6 font-semibold text-lg">Technical Co-Founder</p>
                <div class="flex justify-center">
                  <a href="https://www.linkedin.com/in/rexton-itsiah-129945173/" target="_blank"
                    rel="noopener noreferrer" 
                    class="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white hover:from-purple-400 hover:to-pink-500 transition-all duration-300 hover:scale-110 shadow-2xl hover:shadow-purple-500/25">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Scroll to Top Button -->
    <button v-if="showScrollTopButton" @click="scrollToTop"
      :class="[
        'fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center hover:from-blue-500 hover:to-purple-500 transition-all duration-300 z-50 shadow-2xl hover:shadow-blue-500/25 hover:scale-110',
        showScrollTopButton
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4 pointer-events-none',
      ]">
      <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
      </svg>
    </button>
    
    <!-- Footer -->
    <Footer />

    <!-- Demo Modal -->
    <DemoModal :is-open="demoModalOpen" @close="closeDemoModal" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import DemoModal from "@/features/landing/components/landing-demo.vue";
import Footer from "@/shared/components/ui/footer.vue";
import { useAuthStore } from '~/features/auth/stores/auth.store'
import { FEATURE_SWITCH } from '~/shared/constants/feature-switch'
import { API_ROUTES } from "~/shared/constants/api-routes";

const authStore = useAuthStore();
const mobileMenuOpen = ref(false);
const demoModalOpen = ref(false);
const userMenuOpen = ref(false);
const activeSection = ref('home');
const statsAnimated = ref(false);
const featuresAnimated = ref(false);
const showPitchBanner = ref(true);
const showDonationBanner = ref(true);

// User state
const user = computed(() => authStore.getUser || {})

// Computed
const userInitials = computed(() => {
  const name = user.value.name || ''
  return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2)
})

// Add these variables to your existing ref declarations in the script setup section
const donationLoading = ref(false);

// Add this method to handle donation requests
const handleDonation = async () => {
  donationLoading.value = true;
  
  try {
    // Use logged in user's email if available, otherwise use a default
    const donationEmail = user.value?.email || 'donor@qwesi.org';
    
    // Make API call to your backend
    const response = await fetch(`${API_ROUTES.BASE_URL}api/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: donationEmail,
        type: 'donation' // This tells your backend it's a donation
      })
    });

    const data = await response.json();

    if (response.ok && data.checkoutUrl) {
      // Redirect to Stripe checkout
      window.location.href = data.checkoutUrl;
    } else {
      throw new Error(data.error || 'Failed to create donation session');
    }
  } catch (error) {
    console.error('Donation error:', error);
    
    // Show error message to user
    alert('Unable to process donation at this time. Please try again later.');
  } finally {
    donationLoading.value = false;
  }
};

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
  }, 4000);
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
      nextTestimonial();
    } else {
      previousTestimonial();
    }
  }
};

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

const handleLogout = async () => {
  try {
    await authStore.logout();
    userMenuOpen.value = false;
    await navigateTo('/');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const scrollToFeatures = () => {
  const element = document.getElementById('features');
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
  mobileMenuOpen.value = false;
};

const animatedStats = ref({
  jobSeekers: 0,
  jobsSent: 0,
  successfulMatches: 0,
  partneredCompanies: 0,
});

const animateStats = () => {
  if (statsAnimated.value) return;

  statsAnimated.value = true;
  const duration = 1500;
  const startTime = performance.now();

  const animate = (currentTime) => {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);
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

const showScrollTopButton = ref(false);

const handleScroll = () => {
  showScrollTopButton.value = window.scrollY > 300;
  
  // Update active section based on scroll position
  const sections = ['home', 'features', 'stats'];
  const scrollPosition = window.scrollY + 100;
  
  for (const section of sections) {
    const element = document.getElementById(section === 'home' ? 'hero' : section);
    if (element) {
      const { offsetTop, offsetHeight } = element;
      if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
        activeSection.value = section;
        break;
      }
    }
  }
};

onMounted(() => {
  if (process.client) {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("keydown", handleKeydown);
    startAutoScroll();

    document.addEventListener('click', (event) => {
      const userMenu = document.querySelector('[data-user-menu]');
      const userButton = document.querySelector('[data-user-button]');

      if (userMenu && userButton && !userButton.contains(event.target) && !userMenu.contains(event.target)) {
        userMenuOpen.value = false;
      }
    });

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
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
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
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
      });

      observer.observe(featuresSection);
    }
  }
});

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener("scroll", handleScroll);
    window.removeEventListener("keydown", handleKeydown);
    stopAutoScroll();
  }
});
</script>

<style scoped>
/* Ultra-modern glassmorphism */
.glass-nav {
  background: rgba(30, 30, 46, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.glass-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.glass-button {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
}

/* Modern animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(60px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(2deg);
  }
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes scrollLeft {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 1s ease-out forwards;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-slide-down {
  animation: slideDown 0.3s ease-out forwards;
}

.animate-scroll-left {
  animation: scrollLeft 40s linear infinite;
}

.animate-fade-in {
  animation: fadeInUp 0.3s ease-out forwards;
}

/* Modern hover effects */
.hover-lift {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover-lift:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 25px 50px -12px rgb(92, 58, 232);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgb(92, 58, 232);
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #5a6fd8 0%, #6a4190 100%);
}

/* Smooth transitions for all interactive elements */
* {
  transition-property: transform, opacity, box-shadow, background-color, border-color;
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Focus states for accessibility */
button:focus,
a:focus {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}

/* Modern gradient text */
.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Enhanced shadow effects */
.shadow-modern {
  box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.shadow-modern-lg {
  box-shadow: 0 20px 40px -4px rgba(0, 0, 0, 0.1), 0 8px 16px -4px rgba(0, 0, 0, 0.06);
}

/* Responsive typography scaling */
@media (max-width: 640px) {
  .text-5xl {
    font-size: 2.5rem;
    line-height: 1.2;
  }
  
  .text-6xl {
    font-size: 3rem;
    line-height: 1.1;
  }
  
  .text-7xl {
    font-size: 3.5rem;
    line-height: 1.1;
  }
}
</style> 