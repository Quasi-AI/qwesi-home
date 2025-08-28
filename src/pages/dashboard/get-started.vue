<template>
    <div class="dashboard-container">
        <!-- Sidebar -->
        <Sidebar :user="user" />

        <!-- Main Content -->
        <div class="main-content">
            <!-- Ultra-Modern Header -->
            <header class="modern-header">
                <div class="header-backdrop"></div>
                <div class="header-content">
                    <div class="header-info">
                        <div class="welcome-section">
                            <h1 class="dashboard-title">Get Started</h1>
                            <p class="welcome-message">Choose your path and let <span class="user-highlight">AI accelerate your success</span></p>
                        </div>
                        <div class="header-decorations">
                            <div class="floating-orb orb-1"></div>
                            <div class="floating-orb orb-2"></div>
                            <div class="floating-orb orb-3"></div>
                        </div>
                    </div>

                    <!-- Enhanced Header Actions -->
                    <div class="header-actions">
                        <!-- Profile Dropdown -->
                        <div class="profile-dropdown">
                            <button @click="profileMenuOpen = !profileMenuOpen" class="profile-btn">
                                <div class="profile-avatar">
                                    <div v-if="user.profileImage" class="avatar-image">
                                        <img :src="user.profileImage" alt="Profile Picture" />
                                    </div>
                                    <div v-else class="avatar-initials">
                                        <span>{{ userInitials }}</span>
                                    </div>
                                    <div class="avatar-ring"></div>
                                </div>
                                <span class="profile-name">{{ displayName }}</span>
                                <svg class="dropdown-arrow" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                                </svg>
                            </button>

                            <!-- Profile Menu -->
                            <div v-if="profileMenuOpen" class="profile-menu">
                                <div class="menu-backdrop"></div>
                                <div class="menu-content">
                                    <button @click="editProfile" class="menu-item">
                                        <svg class="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span>Edit Profile</span>
                                    </button>
                                    <div class="menu-divider"></div>
                                    <button @click="handleLogout" class="menu-item logout-item">
                                        <svg class="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Main Content Area -->
            <main class="dashboard-main">
                <div class="max-w-7xl mx-auto w-full">
                    <!-- Hero Section -->
                    <div class="hero-section">
                        <div class="hero-backdrop"></div>
                        <div class="hero-content">
                            <div class="hero-text">
                                <h2 class="hero-title">Choose Your Journey</h2>
                                <p class="hero-description">
                                    Whether you're seeking opportunities, investing in the future, hiring talent, or pitching your next big idea, 
                                    QWESI AI has the perfect tools to accelerate your success.
                                </p>
                            </div>
                            <div class="hero-decorations">
                                <div class="hero-orb hero-orb-1"></div>
                                <div class="hero-orb hero-orb-2"></div>
                                <div class="hero-orb hero-orb-3"></div>
                            </div>
                        </div>
                    </div>

                    <!-- User Type Cards -->
                    <div class="cards-section">
                        <div class="section-header">
                            <h3 class="section-title">Select Your Path</h3>
                            <div class="section-decorator"></div>
                        </div>
                        
                        <div class="user-cards-grid">
                            <!-- Job Seeker Card -->
                            <div class="user-type-card job-seeker-card">
                                <div class="card-backdrop"></div>
                                <div class="card-header bg-gradient-to-br from-blue-500/10 to-blue-600/5">
                                    <div class="card-icon bg-gradient-to-br from-blue-500 to-blue-600">
                                        <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                    <div class="card-title-section">
                                        <h3 class="card-title">Job Seeker</h3>
                                        <p class="card-subtitle">Find your dream career with AI-powered guidance</p>
                                    </div>
                                </div>
                                <div class="card-content">
                                    <ul class="card-features">
                                        <li class="feature-item">
                                            <svg class="feature-icon" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                            </svg>
                                            <span>Smart job matching</span>
                                        </li>
                                        <li class="feature-item">
                                            <svg class="feature-icon" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                            </svg>
                                            <span>AI interview coach</span>
                                        </li>
                                        <li class="feature-item">
                                            <svg class="feature-icon" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                            </svg>
                                            <span>Resume optimization</span>
                                        </li>
                                        <li class="feature-item">
                                            <svg class="feature-icon" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                            </svg>
                                            <span>Career guidance</span>
                                        </li>
                                    </ul>
                                    <NuxtLink to="/dashboard/job-seeker" class="card-cta blue-cta">
                                        <span>Get Started</span>
                                        <svg class="cta-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </NuxtLink>
                                </div>
                            </div>

                            <!-- Investor Card -->
                            <div class="user-type-card investor-card">
                                <div class="card-backdrop"></div>
                                <div class="card-header bg-gradient-to-br from-emerald-500/10 to-emerald-600/5">
                                    <div class="card-icon bg-gradient-to-br from-emerald-500 to-emerald-600">
                                        <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                                        </svg>
                                    </div>
                                    <div class="card-title-section">
                                        <h3 class="card-title">Investor</h3>
                                        <p class="card-subtitle">Connect with investment opportunities or seek funding</p>
                                    </div>
                                </div>
                                <div class="card-content">
                                    <ul class="card-features">
                                        <li class="feature-item">
                                            <svg class="feature-icon" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                            </svg>
                                            <span>Smart matching</span>
                                        </li>
                                        <li class="feature-item">
                                            <svg class="feature-icon" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                            </svg>
                                            <span>Market insights</span>
                                        </li>
                                        <li class="feature-item">
                                            <svg class="feature-icon" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                            </svg>
                                            <span>Secure platform</span>
                                        </li>
                                        <li class="feature-item">
                                            <svg class="feature-icon" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                            </svg>
                                            <span>Investment networking</span>
                                        </li>
                                    </ul>
                                    <NuxtLink to="/dashboard/investor-registration" class="card-cta emerald-cta">
                                        <span>Get Started</span>
                                        <svg class="cta-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </NuxtLink>
                                </div>
                            </div>

                            <!-- Employer Card -->
                            <div class="user-type-card employer-card">
                                <div class="card-backdrop"></div>
                                <div class="card-header bg-gradient-to-br from-amber-500/10 to-amber-600/5">
                                    <div class="card-icon bg-gradient-to-br from-amber-500 to-amber-600">
                                        <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                    <div class="card-title-section">
                                        <h3 class="card-title">Employer</h3>
                                        <p class="card-subtitle">Find top talent and grow your business</p>
                                    </div>
                                </div>
                                <div class="card-content">
                                    <ul class="card-features">
                                        <li class="feature-item">
                                            <svg class="feature-icon" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                            </svg>
                                            <span>AI candidate screening</span>
                                        </li>
                                        <li class="feature-item">
                                            <svg class="feature-icon" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                            </svg>
                                            <span>Smart talent matching</span>
                                        </li>
                                        <li class="feature-item">
                                            <svg class="feature-icon" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                            </svg>
                                            <span>24/7 recruitment support</span>
                                        </li>
                                        <li class="feature-item">
                                            <svg class="feature-icon" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                            </svg>
                                            <span>Business advertising</span>
                                        </li>
                                    </ul>
                                    <NuxtLink to="/dashboard/employer-registration" class="card-cta amber-cta">
                                        <span>Get Started</span>
                                        <svg class="cta-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </NuxtLink>
                                </div>
                            </div>

                            <!-- Pitch Competition Card -->
                            <div class="user-type-card pitch-card">
                                <div class="card-backdrop"></div>
                                <div class="card-header bg-gradient-to-br from-purple-500/10 to-purple-600/5">
                                    <div class="card-icon bg-gradient-to-br from-purple-500 to-purple-600">
                                        <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    </div>
                                    <div class="card-title-section">
                                        <h3 class="card-title">Pitch Competition</h3>
                                        <p class="card-subtitle">Submit your innovative ideas for funding</p>
                                    </div>
                                </div>
                                <div class="card-content">
                                    <ul class="card-features">
                                        <li class="feature-item">
                                            <svg class="feature-icon" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                            </svg>
                                            <span>Funding opportunities</span>
                                        </li>
                                        <li class="feature-item">
                                            <svg class="feature-icon" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                            </svg>
                                            <span>Expert mentorship</span>
                                        </li>
                                        <li class="feature-item">
                                            <svg class="feature-icon" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                            </svg>
                                            <span>Network access</span>
                                        </li>
                                        <li class="feature-item">
                                            <svg class="feature-icon" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                            </svg>
                                            <span>Competition platform</span>
                                        </li>
                                    </ul>
                                    <NuxtLink to="/dashboard/pitch" class="card-cta purple-cta">
                                        <span>Submit Pitch</span>
                                        <svg class="cta-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </NuxtLink>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Features Overview -->
                    <div class="features-section">
                        <div class="features-backdrop"></div>
                        <div class="features-content">
                            <div class="features-header">
                                <h3 class="features-title">Powered by Advanced AI</h3>
                                <p class="features-subtitle">Experience the future of career development, investment matching, and talent acquisition</p>
                            </div>

                            <div class="features-grid">
                                <div class="feature-card">
                                    <div class="feature-icon-wrapper bg-gradient-to-br from-blue-500/10 to-blue-600/5">
                                        <div class="feature-main-icon bg-gradient-to-br from-blue-500 to-blue-600">
                                            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div class="feature-text">
                                        <h4 class="feature-name">Smart AI Matching</h4>
                                        <p class="feature-description">Our advanced algorithms connect the right people with the right opportunities, ensuring perfect matches every time.</p>
                                    </div>
                                </div>

                                <div class="feature-card">
                                    <div class="feature-icon-wrapper bg-gradient-to-br from-emerald-500/10 to-emerald-600/5">
                                        <div class="feature-main-icon bg-gradient-to-br from-emerald-500 to-emerald-600">
                                            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div class="feature-text">
                                        <h4 class="feature-name">24/7 AI Assistant</h4>
                                        <p class="feature-description">Get round-the-clock support, guidance, and assistance from our intelligent AI that never sleeps.</p>
                                    </div>
                                </div>

                                <div class="feature-card">
                                    <div class="feature-icon-wrapper bg-gradient-to-br from-purple-500/10 to-purple-600/5">
                                        <div class="feature-main-icon bg-gradient-to-br from-purple-500 to-purple-600">
                                            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div class="feature-text">
                                        <h4 class="feature-name">Proven Results</h4>
                                        <p class="feature-description">Join thousands of successful users who have achieved their goals with our AI-powered platform.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Call to Action -->
                    <div class="cta-section">
                        <div class="cta-backdrop"></div>
                        <div class="cta-content">
                            <div class="cta-text">
                                <h3 class="cta-title">Ready to Transform Your Future?</h3>
                                <p class="cta-description">
                                    Choose your path above and let QWESI AI accelerate your journey to success. 
                                    Whether you're seeking opportunities, building connections, or innovating solutions, we're here to help.
                                </p>
                            </div>
                            <div class="cta-actions">
                                <NuxtLink to="/dashboard/job-seeker" class="cta-btn primary-cta">
                                    <span>Start Job Search</span>
                                    <svg class="cta-btn-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </NuxtLink>
                                <NuxtLink to="/dashboard/pitch" class="cta-btn secondary-cta">
                                    <span>Submit Your Pitch</span>
                                    <svg class="cta-btn-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/features/auth/stores/auth.store'
import Sidebar from '@/features/dashboard/components/dashboard-sidebar.vue'

const authStore = useAuthStore()

// User state
const user = computed(() => authStore.getUser || {})
const profileMenuOpen = ref(false)

const userInitials = computed(() => {
    const name = user.value.name || ''
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2)
})

const displayName = computed(() => {
    return user.value.name || 'User'
})

// Methods
const editProfile = () => {
    profileMenuOpen.value = false
    navigateTo('/dashboard/profile')
}

const handleLogout = async () => {
    await authStore.logout()
    navigateTo('/')
}

// Lifecycle
onMounted(async () => {
    if (!authStore.isAuthenticated) {
        navigateTo('/auth/login')
        return
    }
})

useHead({
    title: 'Get Started - QWESI AI'
})
</script>

<style scoped>
/* Base Layout */
.dashboard-container {
    @apply min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex;
    position: relative;
    overflow-x: hidden;
    height: 100vh;
}

.main-content {
    @apply flex-1 flex flex-col;
    min-width: 0;
    height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
}

/* Ultra-Modern Header */
.modern-header {
    @apply relative border-b border-slate-200/60;
    backdrop-filter: blur(20px);
}

.header-backdrop {
    @apply absolute inset-0 bg-gradient-to-r from-white/95 via-white/90 to-blue-50/80;
}

.header-content {
    @apply relative z-10 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0;
}

.header-info {
    @apply relative;
}

.welcome-section {
    @apply text-center sm:text-left;
}

.dashboard-title {
    @apply text-2xl font-black bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent;
    font-variant: small-caps;
    letter-spacing: -0.025em;
}

.welcome-message {
    @apply text-sm font-medium text-slate-600 mt-1;
}

.user-highlight {
    @apply font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent;
}

.header-decorations {
    @apply absolute -inset-4 pointer-events-none;
}

.floating-orb {
    @apply absolute w-1 h-1 rounded-full opacity-20;
    animation: float 6s ease-in-out infinite;
}

.orb-1 {
    @apply bg-blue-400 top-2 right-8;
    animation-delay: 0s;
}

.orb-2 {
    @apply bg-purple-400 top-8 right-4;
    animation-delay: 2s;
}

.orb-3 {
    @apply bg-emerald-400 top-6 right-12;
    animation-delay: 4s;
}

/* Header Actions */
.header-actions {
    @apply flex items-center space-x-3;
}

.profile-dropdown {
    @apply relative;
}

.profile-btn {
    @apply flex items-center space-x-3 p-2 rounded-2xl hover:bg-slate-100/70 transition-all duration-300;
}

.profile-avatar {
    @apply relative w-10 h-10;
}

.avatar-image {
    @apply w-10 h-10 rounded-2xl overflow-hidden border-2 border-slate-200;
}

.avatar-image img {
    @apply w-full h-full object-cover;
}

.avatar-initials {
    @apply w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl;
    @apply flex items-center justify-center text-white font-bold text-sm;
    @apply shadow-lg shadow-blue-500/25;
}

.avatar-ring {
    @apply absolute -inset-1 rounded-2xl border-2 border-blue-400/30 opacity-0;
    @apply transition-opacity duration-300;
}

.profile-btn:hover .avatar-ring {
    @apply opacity-100;
}

.profile-name {
    @apply text-sm font-medium text-slate-700 hidden sm:block;
}

.dropdown-arrow {
    @apply w-4 h-4 text-slate-400 transition-transform duration-300;
}

.profile-btn:hover .dropdown-arrow {
    @apply rotate-180;
}

.profile-menu {
    @apply absolute right-0 mt-2 w-48 rounded-2xl overflow-hidden z-10;
}

.menu-backdrop {
    @apply absolute inset-0 bg-white/95 border border-slate-200/60;
    backdrop-filter: blur(20px);
    border-radius: inherit;
}

.menu-content {
    @apply relative z-10 py-2;
}

.menu-item {
    @apply w-full text-left px-4 py-3 text-sm font-medium text-slate-700;
    @apply hover:bg-slate-100/70 transition-colors duration-200 flex items-center space-x-3;
}

.menu-icon {
    @apply w-4 h-4;
}

.logout-item {
    @apply text-red-600 hover:text-red-700 hover:bg-red-50/70;
}

.menu-divider {
    @apply border-t border-slate-200/60 my-1;
}

/* Main Dashboard Content */
.dashboard-main {
    @apply flex-1 p-6 flex flex-col space-y-8;
    min-height: 0;
    overflow-y: auto;
    padding-bottom: 2rem;
}

/* Hero Section */
.hero-section {
    @apply relative rounded-3xl overflow-hidden mb-12;
    backdrop-filter: blur(20px);
}

.hero-backdrop {
    @apply absolute inset-0 bg-gradient-to-br from-indigo-600/95 via-purple-600/90 to-blue-600/95;
}

.hero-content {
    @apply relative z-10 p-8 sm:p-12 text-center text-white;
}

.hero-text {
    @apply max-w-4xl mx-auto;
}

.hero-title {
    @apply text-3xl sm:text-4xl font-black mb-6;
    background: linear-gradient(to right, rgba(255,255,255,0.95), rgba(255,255,255,0.8));
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
}

.hero-description {
    @apply text-lg text-indigo-100 leading-relaxed;
}

.hero-decorations {
    @apply absolute inset-0 pointer-events-none;
}

.hero-orb {
    @apply absolute rounded-full opacity-10;
    animation: heroFloat 8s ease-in-out infinite;
}

.hero-orb-1 {
    @apply w-20 h-20 bg-white top-8 right-16;
    animation-delay: 0s;
}

.hero-orb-2 {
    @apply w-12 h-12 bg-yellow-300 bottom-12 left-20;
    animation-delay: 3s;
}

.hero-orb-3 {
    @apply w-16 h-16 bg-pink-300 top-20 left-1/3;
    animation-delay: 6s;
}

/* Cards Section */
.cards-section {
    @apply space-y-8 mb-12;
}

.section-header {
    @apply flex items-center space-x-4 mb-8;
}

.section-title {
    @apply text-2xl font-bold text-slate-900;
}

.section-decorator {
    @apply flex-1 h-px bg-gradient-to-r from-slate-300 via-blue-300 to-transparent;
}

.user-cards-grid {
    @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6;
}

.user-type-card {
    @apply relative rounded-3xl overflow-hidden transition-all duration-300;
    @apply hover:-translate-y-2 hover:scale-105 hover:shadow-2xl;
    backdrop-filter: blur(20px);
}

.card-backdrop {
    @apply absolute inset-0 bg-white/70 border border-slate-200/60;
}

.card-header {
    @apply relative z-10 p-6 border-b border-slate-200/40;
}

.card-icon {
    @apply w-12 h-12 rounded-2xl flex items-center justify-center mb-4;
    @apply shadow-lg transition-transform duration-300;
}

.user-type-card:hover .card-icon {
    @apply scale-110 rotate-3;
}

.card-title-section {
    @apply space-y-1;
}

.card-title {
    @apply text-xl font-bold text-slate-900;
}

.card-subtitle {
    @apply text-sm text-slate-600;
}

.card-content {
    @apply relative z-10 p-6 space-y-6;
}

.card-features {
    @apply space-y-3;
}

.feature-item {
    @apply flex items-center space-x-3 text-sm text-slate-700;
}

.feature-icon {
    @apply w-4 h-4 text-emerald-500 flex-shrink-0;
}

.card-cta {
    @apply flex items-center justify-center space-x-2 w-full px-6 py-3 rounded-2xl;
    @apply font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg;
}

.blue-cta {
    @apply bg-gradient-to-r from-blue-500 to-blue-600 text-white;
    @apply hover:from-blue-600 hover:to-blue-700 shadow-blue-500/25;
}

.emerald-cta {
    @apply bg-gradient-to-r from-emerald-500 to-emerald-600 text-white;
    @apply hover:from-emerald-600 hover:to-emerald-700 shadow-emerald-500/25;
}

.amber-cta {
    @apply bg-gradient-to-r from-amber-500 to-amber-600 text-white;
    @apply hover:from-amber-600 hover:to-amber-700 shadow-amber-500/25;
}

.purple-cta {
    @apply bg-gradient-to-r from-purple-500 to-purple-600 text-white;
    @apply hover:from-purple-600 hover:to-purple-700 shadow-purple-500/25;
}

.cta-arrow {
    @apply w-4 h-4 transition-transform duration-300;
}

.card-cta:hover .cta-arrow {
    @apply translate-x-1;
}

/* Features Section */
.features-section {
    @apply relative rounded-3xl overflow-hidden mb-12;
    backdrop-filter: blur(20px);
}

.features-backdrop {
    @apply absolute inset-0 bg-white/70 border border-slate-200/60;
}

.features-content {
    @apply relative z-10 p-8 sm:p-12;
}

.features-header {
    @apply text-center mb-12;
}

.features-title {
    @apply text-2xl font-bold text-slate-900 mb-4;
}

.features-subtitle {
    @apply text-slate-600 max-w-3xl mx-auto;
}

.features-grid {
    @apply grid grid-cols-1 md:grid-cols-3 gap-8;
}

.feature-card {
    @apply text-center space-y-4;
}

.feature-icon-wrapper {
    @apply mx-auto w-20 h-20 rounded-3xl flex items-center justify-center;
    @apply border border-slate-200/40;
}

.feature-main-icon {
    @apply w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg;
}

.feature-text {
    @apply space-y-2;
}

.feature-name {
    @apply text-lg font-bold text-slate-900;
}

.feature-description {
    @apply text-sm text-slate-600 leading-relaxed;
}

/* Call to Action Section */
.cta-section {
    @apply relative rounded-3xl overflow-hidden;
    backdrop-filter: blur(20px);
}

.cta-backdrop {
    @apply absolute inset-0 bg-gradient-to-br from-blue-600/95 via-purple-600/90 to-indigo-600/95;
}

.cta-content {
    @apply relative z-10 p-8 sm:p-12 text-center text-white;
}

.cta-text {
    @apply max-w-3xl mx-auto mb-8;
}

.cta-title {
    @apply text-2xl font-bold mb-4;
}

.cta-description {
    @apply text-blue-100 leading-relaxed;
}

.cta-actions {
    @apply flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4;
}

.cta-btn {
    @apply flex items-center justify-center space-x-2 px-8 py-3 rounded-2xl;
    @apply font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg;
}

.primary-cta {
    @apply bg-white text-blue-600 hover:bg-blue-50;
    @apply shadow-lg shadow-white/25;
}

.secondary-cta {
    @apply bg-purple-700/70 text-white hover:bg-purple-600;
    @apply shadow-lg shadow-purple-700/25;
}

.cta-btn-arrow {
    @apply w-4 h-4 transition-transform duration-300;
}

.cta-btn:hover .cta-btn-arrow {
    @apply translate-x-1;
}

/* Custom Scrollbar Styling */
.main-content {
    scrollbar-width: thin;
    scrollbar-color: rgba(148, 163, 184, 0.3) transparent;
}

.main-content::-webkit-scrollbar {
    width: 6px;
}

.main-content::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 3px;
}

.main-content::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, rgba(148, 163, 184, 0.3), rgba(148, 163, 184, 0.5));
    border-radius: 3px;
    transition: all 0.3s ease;
}

.main-content::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, rgba(148, 163, 184, 0.5), rgba(148, 163, 184, 0.7));
}

.dashboard-main {
    scrollbar-width: thin;
    scrollbar-color: rgba(148, 163, 184, 0.3) transparent;
}

.dashboard-main::-webkit-scrollbar {
    width: 6px;
}

.dashboard-main::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 3px;
}

.dashboard-main::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, rgba(148, 163, 184, 0.3), rgba(148, 163, 184, 0.5));
    border-radius: 3px;
    transition: all 0.3s ease;
}

.dashboard-main::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, rgba(148, 163, 184, 0.5), rgba(148, 163, 184, 0.7));
}

/* Animations */
@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-6px); }
}

@keyframes heroFloat {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-12px) rotate(180deg); }
}

/* Responsive Design */
@media (max-width: 640px) {
    .dashboard-title {
        @apply text-xl;
    }
    
    .hero-title {
        @apply text-2xl;
    }
    
    .user-cards-grid {
        @apply grid-cols-1 gap-4;
    }
    
    .features-grid {
        @apply grid-cols-1 gap-6;
    }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
    .floating-orb,
    .hero-orb,
    .user-type-card,
    .card-icon {
        animation: none;
    }
    
    .user-type-card:hover,
    .card-cta:hover,
    .cta-btn:hover {
        transform: none;
    }
}
</style>