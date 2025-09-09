
<style scoped>
/* Base Layout */
.dashboard-container {
    @apply min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex;
    position: relative;
    overflow-x: hidden;
    height: 100vh; /* Ensure full viewport height */
}

.main-content {
    @apply flex-1 flex flex-col;
    min-width: 0;
    height: 100vh; /* Full height */
    overflow-y: auto; /* Enable vertical scrolling */
    overflow-x: hidden; /* Prevent horizontal scroll */
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

.action-btn {
    @apply relative px-4 py-2 rounded-2xl font-medium text-sm transition-all duration-300;
    @apply hover:scale-105 hover:shadow-lg;
    backdrop-filter: blur(12px);
}

.btn-bg {
    @apply absolute inset-0 rounded-2xl transition-all duration-300;
}

.tips-btn .btn-bg {
    @apply bg-gradient-to-r from-slate-100/80 to-slate-200/60;
}

.referral-btn .btn-bg {
    @apply bg-gradient-to-r from-blue-100/80 to-purple-100/60;
}

.btn-content {
    @apply relative z-10 flex items-center space-x-2;
}

.btn-icon {
    @apply w-4 h-4;
}

.tips-btn {
    @apply text-slate-700 hover:text-slate-900;
}

.referral-btn {
    @apply text-blue-700 hover:text-blue-900;
}

.points-badge {
    @apply bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs px-2 py-1 rounded-full font-bold;
    @apply shadow-lg shadow-emerald-500/25;
}

/* Profile Dropdown */
.profile-dropdown {
    @apply relative z-50;
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
    min-height: 0; /* Allow shrinking */
    overflow-y: auto; /* Enable scrolling within main content */
    padding-bottom: 2rem; /* Add bottom padding for scroll end */
}

/* Enhanced Banners */
.onboarding-banner {
    @apply relative rounded-3xl overflow-hidden;
    backdrop-filter: blur(20px);
}

.banner-backdrop {
    @apply absolute inset-0 bg-gradient-to-r from-indigo-600/95 via-purple-600/90 to-blue-600/95;
}

.banner-content {
    @apply relative z-10 p-8 text-white;
}

.banner-main {
    @apply flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6;
}

.banner-icon {
    @apply w-12 h-12 text-yellow-300;
    animation: pulse 2s ease-in-out infinite;
}

.banner-title {
    @apply text-xl font-bold;
}

.banner-description {
    @apply text-indigo-100;
}

.banner-actions {
    @apply flex flex-wrap gap-3;
}

.banner-btn {
    @apply px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300;
    @apply hover:scale-105 hover:shadow-lg;
}

.banner-btn.primary {
    @apply bg-white text-indigo-600 hover:bg-indigo-50;
}

.banner-btn.secondary {
    @apply bg-indigo-500/70 text-white hover:bg-indigo-400/70;
}

.banner-close {
    @apply absolute top-4 right-4 p-2 text-indigo-200 hover:text-white transition-colors;
    @apply rounded-xl hover:bg-white/10;
}

.pro-banner {
    @apply relative rounded-3xl overflow-hidden;
}

.pro-banner-bg {
    @apply absolute inset-0 bg-gradient-to-r from-blue-600/95 to-blue-700/90;
}

.pro-content {
    @apply relative z-10 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0;
}

.pro-text {
    @apply flex-1 text-white;
}

.pro-title {
    @apply text-lg font-bold mb-2;
}

.pro-description {
    @apply text-blue-100;
}

.pro-btn {
    @apply bg-white text-blue-600 px-6 py-3 rounded-2xl font-bold;
    @apply hover:bg-blue-50 transition-all duration-300;
    @apply flex items-center space-x-2 hover:scale-105 hover:shadow-lg;
}

.pro-arrow {
    @apply w-4 h-4;
}

/* Quick Actions */
.quick-actions-container {
    @apply space-y-6;
}

.section-header {
    @apply flex items-center space-x-4;
}

.section-title {
    @apply text-xl font-bold text-slate-900;
}

.section-decorator {
    @apply flex-1 h-px bg-gradient-to-r from-slate-300 via-blue-300 to-transparent;
}

.quick-actions-grid {
    @apply grid grid-cols-2 sm:grid-cols-4 gap-4;
}

.quick-action-card {
    @apply relative p-6 rounded-3xl transition-all duration-300;
    @apply hover:-translate-y-2 hover:scale-105;
    @apply focus:outline-none focus:ring-4 focus:ring-blue-500/20;
    backdrop-filter: blur(20px);
}

.card-bg {
    @apply absolute inset-0 rounded-3xl border border-white/60;
}

.card-glow {
    @apply absolute -inset-px rounded-3xl opacity-0 transition-all duration-500;
    @apply hover:opacity-100;
    filter: blur(8px);
}

.card-content {
    @apply relative z-10 flex flex-col items-center space-y-3;
}

.card-icon {
    @apply w-12 h-12 rounded-2xl flex items-center justify-center;
    @apply shadow-lg transition-transform duration-300;
}

.card-icon svg {
    @apply w-6 h-6 text-white;
}

.quick-action-card:hover .card-icon {
    @apply scale-110 rotate-3;
}

.card-label {
    @apply text-sm font-bold text-slate-700;
}

/* Stats Section */
.stats-section {
    @apply space-y-6;
}

.refresh-btn {
    @apply relative px-4 py-2 rounded-2xl font-medium text-sm text-blue-700;
    @apply flex items-center space-x-2 transition-all duration-300;
    @apply hover:scale-105 disabled:opacity-50;
}

.refresh-bg {
    @apply absolute inset-0 bg-gradient-to-r from-blue-100/80 to-blue-200/60 rounded-2xl;
    backdrop-filter: blur(12px);
}

.refresh-icon {
    @apply w-4 h-4 relative z-10;
}

.spinning {
    animation: spin 1s linear infinite;
}

/* Loading States */
.loading-state, .error-state {
    @apply flex flex-col items-center justify-center py-12 space-y-4;
}

.loading-spinner {
    @apply w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full;
    animation: spin 1s linear infinite;
}

.loading-spinner.small {
    @apply w-6 h-6 border-2;
}

.loading-text {
    @apply text-slate-600 font-medium;
}

.error-state {
    @apply bg-red-50/70 rounded-2xl p-6 border border-red-200/60;
}

.error-icon {
    @apply w-8 h-8 text-red-500;
}

.error-message {
    @apply text-red-600 text-sm;
}

/* Tables Section */
.tables-section {
    @apply space-y-6;
}

.tables-grid {
    @apply grid grid-cols-1 lg:grid-cols-2 gap-8;
}

.table-container {
    @apply relative;
}

.table-loading {
    @apply bg-white/70 rounded-3xl p-8 border border-slate-200/60;
    backdrop-filter: blur(20px);
}

.table-loading-content {
    @apply flex items-center justify-center space-x-3 text-slate-600;
}

/* Pitch Banner */
.pitch-banner {
    @apply relative rounded-3xl overflow-hidden;
}

.pitch-banner-bg {
    @apply absolute inset-0 bg-gradient-to-r from-amber-400/95 via-yellow-400/90 to-orange-400/95;
}

.pitch-content {
    @apply relative z-10 p-6 flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6;
}

.pitch-icon {
    @apply w-12 h-12 text-blue-900 flex-shrink-0;
}

.pitch-text {
    @apply flex-1 text-blue-900;
}

.pitch-title {
    @apply font-bold text-lg mb-1;
}

.pitch-description {
    @apply text-blue-800;
}

.pitch-btn {
    @apply bg-blue-900 text-white px-6 py-3 rounded-2xl font-bold;
    @apply hover:bg-blue-800 transition-all duration-300;
    @apply flex items-center space-x-2 hover:scale-105;
    @apply shadow-lg shadow-blue-900/25;
}

.pitch-sparkle {
    animation: bounce 2s ease-in-out infinite;
}

.pitch-close {
    @apply absolute top-4 right-4 p-2 text-blue-800 hover:text-blue-900;
    @apply rounded-xl hover:bg-white/20 transition-colors;
}

/* Modal Styles */
.modal-overlay {
    @apply fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50;
    backdrop-filter: blur(8px);
}

.modal-backdrop {
    @apply absolute inset-0 bg-black/40;
}

.referral-modal, .tips-modal {
    @apply relative bg-white/95 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden;
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.modal-header {
    @apply flex items-center justify-between p-8 border-b border-slate-200/60;
}

.modal-title-section {
    @apply space-y-2;
}

.modal-title {
    @apply text-xl font-bold text-slate-900;
}

.title-decoration {
    @apply w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full;
}

.modal-close {
    @apply p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100/70;
    @apply transition-colors duration-200;
}

/* Onboarding Overlay */
.onboarding-overlay {
    @apply fixed inset-0 bg-black/60 z-50;
    backdrop-filter: blur(4px);
}

.z-60 {
    z-index: 60;
}

/* Animations */
@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-6px); }
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
}

@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
}

/* Responsive Design */
@media (max-width: 640px) {
    .dashboard-title {
        @apply text-xl;
    }
    
    .quick-actions-grid {
        @apply grid-cols-2 gap-3;
    }
    
    .quick-action-card {
        @apply p-4;
    }
    
    .tables-grid {
        @apply grid-cols-1 gap-6;
    }

    .tooltip-responsive {
        left: 1rem !important;
        right: 1rem !important;
        max-width: calc(100vw - 2rem) !important;
    }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
    .floating-orb,
    .quick-action-card,
    .card-icon,
    .pitch-sparkle {
        animation: none;
    }
    
    .quick-action-card:hover {
        transform: none;
    }
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

/* Prevent sidebar distortion */
.sidebar-fixed {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: 320px;
    z-index: 40;
    overflow-y: auto;
    overflow-x: hidden;
}

.sidebar-collapsed {
    width: 80px;
}

/* Main content margin adjustment */
.main-content-adjusted {
    margin-left: 320px;
}

.main-content-collapsed {
    margin-left: 80px;
}

/* Smooth height transitions */
.smooth-height {
    transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Fix mobile menu overflow */
@media (max-width: 767px) {
    .main-content-adjusted,
    .main-content-collapsed {
        margin-left: 0;
    }
    
    /* Prevent body scroll when mobile menu is open */
    body.mobile-menu-open {
        overflow: hidden;
        height: 100vh;
    }
    
    .dashboard-container {
        height: 100vh;
        overflow: hidden;
    }
    
    .main-content {
        height: 100vh;
        overflow-y: auto;
    }
}
</style>

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
                            <h1 class="dashboard-title">Dashboard</h1>
                            <p class="welcome-message">Welcome back, <span class="user-highlight">{{ displayName }}</span></p>
                        </div>
                        <div class="header-decorations">
                            <div class="floating-orb orb-1"></div>
                            <div class="floating-orb orb-2"></div>
                            <div class="floating-orb orb-3"></div>
                        </div>
                    </div>

                    <!-- Enhanced Header Actions -->
                    <div class="header-actions" data-onboard="header-actions">
                        <!-- Tips Button -->
                        <button @click="showTipsModal = true" class="action-btn tips-btn">
                            <div class="btn-bg"></div>
                            <div class="btn-content">
                                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                                <span class="btn-text">Tips</span>
                            </div>
                        </button>

                        <!-- Referral Button -->
                        <button @click="showReferralModal = true" class="action-btn referral-btn">
                            <div class="btn-bg bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
                            <div class="btn-content">
                                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                                <span class="btn-text">Refer Friends</span>
                                <div class="points-badge">+{{ userPoints.total || 0 }}</div>
                            </div>
                        </button>

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
                <!-- Onboarding Banner -->
                <div v-if="showOnboarding && !user.hasCompletedOnboarding" class="onboarding-banner">
                    <div class="banner-backdrop"></div>
                    <div class="banner-content">
                        <div class="banner-main">
                            <div class="banner-icon">
                                <svg fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                            </div>
                            <div class="banner-text">
                                <h3 class="banner-title">Welcome to QWESI AI!</h3>
                                <p class="banner-description">Let's get you started with a quick tour of your dashboard and key features.</p>
                            </div>
                        </div>
                        <div class="banner-actions">
                            <button @click="startOnboarding" class="banner-btn primary">Start Tour</button>
                            <button @click="showTipsModal = true" class="banner-btn secondary">View Tips</button>
                        </div>
                        <button @click="dismissOnboarding" class="banner-close">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Pro Banner -->
                <div v-if="!isSubscribed" class="pro-banner">
                    <div class="pro-banner-bg"></div>
                    <div class="pro-content">
                        <div class="pro-text">
                            <h3 class="pro-title">Unlock Premium Features</h3>
                            <p class="pro-description">Get access to advanced AI features, priority support, and more.</p>
                        </div>
                        <button @click="showProModal = true" class="pro-btn">
                            <span>Try Pro for 7 Days</span>
                            <svg class="pro-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="quick-actions-container" data-onboard="quick-actions">
                    <div class="section-header">
                        <h3 class="section-title">Quick Actions</h3>
                        <div class="section-decorator"></div>
                    </div>
                    <div class="quick-actions-grid">
                        <button @click="openNewTaskModal" class="quick-action-card task-card">
                            <div class="card-bg bg-gradient-to-br from-blue-500/10 to-blue-600/5"></div>
                            <div class="card-glow bg-blue-500/20"></div>
                            <div class="card-content">
                                <div class="card-icon bg-gradient-to-br from-blue-500 to-blue-600">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </div>
                                <span class="card-label">New Task</span>
                            </div>
                        </button>

                        <button @click="openInviteTeamModal" class="quick-action-card team-card">
                            <div class="card-bg bg-gradient-to-br from-emerald-500/10 to-emerald-600/5"></div>
                            <div class="card-glow bg-emerald-500/20"></div>
                            <div class="card-content">
                                <div class="card-icon bg-gradient-to-br from-emerald-500 to-emerald-600">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                </div>
                                <span class="card-label">Invite Team</span>
                            </div>
                        </button>

                        <button @click="openReportsModal" class="quick-action-card reports-card">
                            <div class="card-bg bg-gradient-to-br from-purple-500/10 to-purple-600/5"></div>
                            <div class="card-glow bg-purple-500/20"></div>
                            <div class="card-content">
                                <div class="card-icon bg-gradient-to-br from-purple-500 to-purple-600">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <span class="card-label">Reports</span>
                            </div>
                        </button>

                        <button @click="openHelpModal" class="quick-action-card help-card">
                            <div class="card-bg bg-gradient-to-br from-amber-500/10 to-amber-600/5"></div>
                            <div class="card-glow bg-amber-500/20"></div>
                            <div class="card-content">
                                <div class="card-icon bg-gradient-to-br from-amber-500 to-amber-600">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span class="card-label">Help</span>
                            </div>
                        </button>
                    </div>
                </div>

                <!-- Stats Section -->
                <div class="stats-section" data-onboard="stats-grid">
                    <div class="section-header">
                        <h2 class="section-title">Dashboard Overview</h2>
                        <button @click="fetchDashboardSummary()" :disabled="dashboardLoading" class="refresh-btn">
                            <div class="refresh-bg"></div>
                            <svg v-if="dashboardLoading" class="refresh-icon spinning" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <svg v-else class="refresh-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>Refresh</span>
                        </button>
                    </div>

                    <div v-if="dashboardLoading" class="loading-state">
                        <div class="loading-spinner"></div>
                        <span class="loading-text">Loading dashboard data...</span>
                    </div>
                    <div v-else-if="dashboardError" class="error-state">
                        <div class="error-icon">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p class="error-message">{{ dashboardError }}</p>
                    </div>
                    <Stats v-else :stats="stats" />
                </div>

                <!-- Component Instances -->
                <NewTaskModal 
                    :show="modals.newTask" 
                    @update:show="modals.newTask = $event"
                    @task-created="handleTaskCreated"
                    @close="closeNewTaskModal" />
                
                <InviteTeamModal 
                    :show="modals.inviteTeam"
                    @update:show="modals.inviteTeam = $event"
                    @member-invited="handleMemberInvited"
                    @close="closeInviteTeamModal" />
                
                <ReportsModal 
                    :show="modals.reports"
                    @update:show="modals.reports = $event"
                    @close="closeReportsModal" />
                
                <HelpModal 
                    :show="modals.help"
                    @update:show="modals.help = $event"
                    @close="closeHelpModal" />

                <MessagePopup ref="alertRef" />
            </main>
        </div>

        <!-- Modals -->
        <ProModal v-model="showProModal" mode="upgrade" />

        <!-- Leaderboard Modal -->
        <div v-if="showLeaderboardModal" class="modal-overlay" @click.self="showLeaderboardModal = false">
            <div class="modal-backdrop"></div>
            <div class="referral-modal">
                <div class="modal-header">
                    <div class="modal-title-section">
                        <h3 class="modal-title">Referral Leaderboard</h3>
                        <div class="title-decoration"></div>
                    </div>
                    <button @click="showLeaderboardModal = false" class="modal-close">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="p-6 overflow-y-auto max-h-[60vh]">
                    <!-- Loading State -->
                    <div v-if="leaderboardLoading" class="loading-state">
                        <div class="loading-spinner small"></div>
                        <span class="loading-text">Loading leaderboard...</span>
                    </div>

                    <!-- Error State -->
                    <div v-else-if="leaderboardError" class="error-state">
                        <div class="error-icon">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p class="error-message">{{ leaderboardError }}</p>
                        <button @click="fetchLeaderboard" class="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                            Try Again
                        </button>
                    </div>

                    <!-- Leaderboard Content -->
                    <div v-else>
                        <!-- Top 3 Podium -->
                        <div v-if="leaderboard.length >= 3" class="mb-8">
                            <h4 class="text-lg font-semibold text-gray-900 mb-4 text-center">Top Referrers</h4>
                            <div class="flex items-end justify-center space-x-4">
                                <!-- 2nd Place -->
                                <div class="text-center">
                                    <div class="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2 mx-auto">
                                        2
                                    </div>
                                    <div class="bg-gray-100 rounded-lg p-3 w-24">
                                        <div class="font-semibold text-sm text-gray-900 truncate">{{ leaderboard[1]?.name || 'Anonymous' }}</div>
                                        <div class="text-xs text-gray-600">{{ leaderboard[1]?.totalReferrals || 0 }} referrals</div>
                                        <div class="text-xs text-blue-600 font-medium">{{ leaderboard[1]?.totalPointsEarned || 0 }} pts</div>
                                    </div>
                                </div>

                                <!-- 1st Place -->
                                <div class="text-center">
                                    <div class="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-2 mx-auto relative">
                                        <svg class="w-6 h-6 absolute -top-2 -right-2 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        1
                                    </div>
                                    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 w-28">
                                        <div class="font-bold text-sm text-gray-900 truncate">{{ leaderboard[0]?.name || 'Anonymous' }}</div>
                                        <div class="text-xs text-gray-600">{{ leaderboard[0]?.totalReferrals || 0 }} referrals</div>
                                        <div class="text-xs text-yellow-600 font-bold">{{ leaderboard[0]?.totalPointsEarned || 0 }} pts</div>
                                    </div>
                                </div>

                                <!-- 3rd Place -->
                                <div class="text-center">
                                    <div class="w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2 mx-auto">
                                        3
                                    </div>
                                    <div class="bg-amber-50 rounded-lg p-3 w-24">
                                        <div class="font-semibold text-sm text-gray-900 truncate">{{ leaderboard[2]?.name || 'Anonymous' }}</div>
                                        <div class="text-xs text-gray-600">{{ leaderboard[2]?.totalReferrals || 0 }} referrals</div>
                                        <div class="text-xs text-amber-600 font-medium">{{ leaderboard[2]?.totalPointsEarned || 0 }} pts</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Full Leaderboard Table -->
                        <div class="bg-white rounded-lg border border-gray-200">
                            <div class="px-4 py-3 border-b border-gray-200">
                                <h4 class="font-semibold text-gray-900">Full Rankings</h4>
                            </div>
                            <div class="divide-y divide-gray-200">
                                <div v-for="user in leaderboard" :key="user.rank" 
                                    :class="[
                                        'px-4 py-3 flex items-center justify-between',
                                        user.rank <= 3 ? 'bg-gradient-to-r from-blue-50 to-transparent' : 'hover:bg-gray-50'
                                    ]">
                                    <div class="flex items-center space-x-3">
                                        <div :class="[
                                            'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                                            user.rank === 1 ? 'bg-yellow-500 text-white' :
                                            user.rank === 2 ? 'bg-gray-400 text-white' :
                                            user.rank === 3 ? 'bg-amber-600 text-white' :
                                            'bg-gray-200 text-gray-700'
                                        ]">
                                            {{ user.rank }}
                                        </div>
                                        <div>
                                            <div class="font-medium text-gray-900">{{ user.name || 'Anonymous User' }}</div>
                                            <div class="text-sm text-gray-500">{{ user.totalReferrals }} successful referrals</div>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <div class="font-bold text-blue-600">{{ user.totalPointsEarned }} pts</div>
                                        <div v-if="user.rank <= 3" class="text-xs text-yellow-600 font-medium">🏆 Top Performer</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Empty State -->
                        <div v-if="leaderboard.length === 0" class="text-center py-8">
                            <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <h3 class="text-lg font-medium text-gray-900 mb-2">No referrals yet</h3>
                            <p class="text-gray-500">Be the first to start referring friends and climb the leaderboard!</p>
                        </div>

                        <!-- User's Position (if not in top 10) -->
                        <div v-if="userPosition && userPosition.rank > 10" class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 class="font-medium text-blue-900 mb-2">Your Position</h4>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-3">
                                    <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                        {{ userPosition.rank }}
                                    </div>
                                    <div>
                                        <div class="font-medium text-blue-900">{{ userPosition.name }}</div>
                                        <div class="text-sm text-blue-700">{{ userPosition.totalReferrals }} referrals</div>
                                    </div>
                                </div>
                                <div class="text-blue-600 font-bold">{{ userPosition.totalPointsEarned }} pts</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer Actions -->
                <div class="p-6 border-t border-gray-200">
                    <div class="flex space-x-3">
                        <button @click="fetchLeaderboard" :disabled="leaderboardLoading" class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50">
                            <svg v-if="leaderboardLoading" class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {{ leaderboardLoading ? 'Refreshing...' : 'Refresh' }}
                        </button>
                        <button @click="showLeaderboardModal = false" class="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Enhanced Referral Modal -->
        <div v-if="showReferralModal" class="modal-overlay" @click.self="showReferralModal = false">
            <div class="modal-backdrop"></div>
            <div class="referral-modal">
                <div class="modal-header">
                    <div class="modal-title-section">
                        <h3 class="modal-title">Refer Friends & Earn Points</h3>
                        <div class="title-decoration"></div>
                    </div>
                    <button @click="showReferralModal = false" class="modal-close">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="p-6 overflow-y-auto">
                    <!-- Points Summary -->
                    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6">
                        <div class="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div class="text-2xl font-bold text-blue-600">{{ userPoints.total || 0 }}</div>
                                <div class="text-xs text-gray-600">Total Earned</div>
                            </div>
                            <div>
                                <div class="text-2xl font-bold text-green-600">{{ userPoints.available || 0 }}</div>
                                <div class="text-xs text-gray-600">Available</div>
                            </div>
                            <div>
                                <div class="text-2xl font-bold text-orange-600">{{ referralStats.totalReferrals || 0 }}</div>
                                <div class="text-xs text-gray-600">Referrals</div>
                            </div>
                        </div>
                    </div>

                    <!-- Referral Code Section -->
                    <div class="text-center mb-6">
                        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                        </div>
                        <p class="text-gray-600 mb-4">Share QWESI AI with friends and earn points when they sign up!</p>
                        <div class="bg-gray-50 rounded-lg p-4 mb-4">
                            <p class="text-sm text-gray-600 mb-2">Your referral code:</p>
                            <div class="flex items-center space-x-2">
                                <code class="bg-white px-3 py-2 rounded border text-sm font-mono flex-1">{{ referralCode }}</code>
                                <button @click="copyReferralCode" class="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm">
                                    {{ copied ? 'Copied!' : 'Copy' }}
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Rewards Info -->
                    <div class="bg-gray-50 rounded-lg p-4 mb-6">
                        <h4 class="font-semibold text-gray-900 mb-3">Referral Rewards</h4>
                        <div class="space-y-2 text-sm text-gray-600">
                            <div class="flex items-center">
                                <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                </svg>
                                You get <strong>100 points</strong> for each successful referral
                            </div>
                            <div class="flex items-center">
                                <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                </svg>
                                Your friend gets <strong>50 points</strong> welcome bonus
                            </div>
                            <div class="flex items-center">
                                <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                </svg>
                                No limit on referrals - earn unlimited points!
                            </div>
                        </div>
                    </div>

                    <!-- Recent Points Activity -->
                    <div v-if="pointsHistory.length > 0" class="mb-6">
                        <h4 class="font-semibold text-gray-900 mb-3">Recent Activity</h4>
                        <div class="space-y-2 max-h-32 overflow-y-auto">
                            <div v-for="activity in pointsHistory.slice(0, 5)" :key="activity._id" 
                                class="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                                <div class="flex items-center">
                                    <div :class="activity.type === 'earned' || activity.type === 'referral' ? 'text-green-600' : 'text-orange-600'" 
                                        class="w-2 h-2 rounded-full mr-2"></div>
                                    <span class="text-gray-700">{{ activity.description }}</span>
                                </div>
                                <span :class="activity.amount > 0 ? 'text-green-600' : 'text-red-600'" class="font-medium">
                                    {{ activity.amount > 0 ? '+' : '' }}{{ activity.amount }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex space-x-3">
                        <button @click="shareReferral" class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                            Share Link
                        </button>
                        <button @click="viewLeaderboard" class="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                            Leaderboard
                        </button>
                        <button @click="showReferralModal = false" class="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium">
                            Cancel
                        </button>
                    </div>
                    
                    <!-- Points Redemption -->
                    <div v-if="userPoints.available >= 100" class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p class="text-sm text-yellow-800 mb-2">You have enough points to redeem rewards!</p>
                        <button @click="showRedemptionModal = true" class="w-full bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium">
                            Redeem Points
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Points Redemption Modal -->
        <div v-if="showRedemptionModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-xl max-w-md w-full p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-bold text-gray-900">Redeem Points</h3>
                    <button @click="showRedemptionModal = false" class="text-gray-400 hover:text-gray-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <div class="mb-6">
                    <p class="text-gray-600 mb-4">Available Points: <strong>{{ userPoints.available }}</strong></p>
                    <div class="space-y-3">
                        <div class="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer" @click="redeemPoints(100, 'Premium feature access for 1 week')">
                            <div class="flex items-center justify-between">
                                <div>
                                    <div class="font-medium">1 Week Premium</div>
                                    <div class="text-sm text-gray-600">Access premium features for 7 days</div>
                                </div>
                                <div class="text-blue-600 font-bold">100 pts</div>
                            </div>
                        </div>
                        <div class="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer" @click="redeemPoints(250, 'Priority support for 1 month')">
                            <div class="flex items-center justify-between">
                                <div>
                                    <div class="font-medium">Priority Support</div>
                                    <div class="text-sm text-gray-600">Get priority customer support for 30 days</div>
                                </div>
                                <div class="text-blue-600 font-bold">250 pts</div>
                            </div>
                        </div>
                        <div class="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer" @click="redeemPoints(500, 'Custom AI model training session')">
                            <div class="flex items-center justify-between">
                                <div>
                                    <div class="font-medium">Custom AI Training</div>
                                    <div class="text-sm text-gray-600">One-on-one AI model customization session</div>
                                </div>
                                <div class="text-blue-600 font-bold">500 pts</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Enhanced Tips Modal -->
        <div v-if="showTipsModal" class="modal-overlay">
            <div class="modal-backdrop"></div>
            <div class="tips-modal">
                <div class="modal-header">
                    <div class="modal-title-section">
                        <h3 class="modal-title">How to Use QWESI AI</h3>
                        <div class="title-decoration"></div>
                    </div>
                    <button @click="showTipsModal = false" class="modal-close">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <div class="p-6 overflow-y-auto max-h-[60vh]">
                    <div class="space-y-6">
                        <!-- Getting Started -->
                        <div>
                            <h4 class="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Getting Started
                            </h4>
                            <ul class="space-y-2 text-sm text-gray-600">
                                <li class="flex items-start">
                                    <span class="text-blue-600 mr-2">•</span>
                                    Use the Quick Actions bar to create tasks, invite team members, and access reports quickly
                                </li>
                                <li class="flex items-start">
                                    <span class="text-blue-600 mr-2">•</span>
                                    Check your dashboard overview regularly to monitor progress and productivity
                                </li>
                                <li class="flex items-start">
                                    <span class="text-blue-600 mr-2">•</span>
                                    Complete your profile setup for better team collaboration
                                </li>
                            </ul>
                        </div>

                        <!-- Task Management -->
                        <div>
                            <h4 class="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                <svg class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                                Task Management
                            </h4>
                            <ul class="space-y-2 text-sm text-gray-600">
                                <li class="flex items-start">
                                    <span class="text-green-600 mr-2">•</span>
                                    Create detailed tasks with clear descriptions, due dates, and assignees
                                </li>
                                <li class="flex items-start">
                                    <span class="text-green-600 mr-2">•</span>
                                    Use priority levels to focus on what matters most
                                </li>
                                <li class="flex items-start">
                                    <span class="text-green-600 mr-2">•</span>
                                    Track progress with status updates and comments
                                </li>
                                <li class="flex items-start">
                                    <span class="text-green-600 mr-2">•</span>
                                    Set up recurring tasks for regular activities
                                </li>
                            </ul>
                        </div>

                        <!-- Team Collaboration -->
                        <div>
                            <h4 class="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                <svg class="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Team Collaboration
                            </h4>
                            <ul class="space-y-2 text-sm text-gray-600">
                                <li class="flex items-start">
                                    <span class="text-purple-600 mr-2">•</span>
                                    Invite team members using email addresses or invitation links
                                </li>
                                <li class="flex items-start">
                                    <span class="text-purple-600 mr-2">•</span>
                                    Assign roles and permissions to control access levels
                                </li>
                                <li class="flex items-start">
                                    <span class="text-purple-600 mr-2">•</span>
                                    Use @mentions in comments to notify specific team members
                                </li>
                                <li class="flex items-start">
                                    <span class="text-purple-600 mr-2">•</span>
                                    Share your referral code to earn credits when inviting new users
                                </li>
                            </ul>
                        </div>

                        <!-- AI Features -->
                        <div>
                            <h4 class="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                <svg class="w-5 h-5 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                                AI-Powered Features
                            </h4>
                            <ul class="space-y-2 text-sm text-gray-600">
                                <li class="flex items-start">
                                    <span class="text-orange-600 mr-2">•</span>
                                    Get AI suggestions for task optimization and scheduling
                                </li>
                                <li class="flex items-start">
                                    <span class="text-orange-600 mr-2">•</span>
                                    Use smart analytics to identify productivity patterns
                                </li>
                                <li class="flex items-start">
                                    <span class="text-orange-600 mr-2">•</span>
                                    Leverage automated workflows to streamline repetitive tasks
                                </li>
                                <li class="flex items-start">
                                    <span class="text-orange-600 mr-2">•</span>
                                    Upgrade to Pro for advanced AI features and priority support
                                </li>
                            </ul>
                        </div>

                        <!-- Productivity Tips -->
                        <div>
                            <h4 class="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                <svg class="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                Productivity Tips
                            </h4>
                            <ul class="space-y-2 text-sm text-gray-600">
                                <li class="flex items-start">
                                    <span class="text-red-600 mr-2">•</span>
                                    Review your dashboard daily to stay on top of important metrics
                                </li>
                                <li class="flex items-start">
                                    <span class="text-red-600 mr-2">•</span>
                                    Set up notifications to never miss important deadlines
                                </li>
                                <li class="flex items-start">
                                    <span class="text-red-600 mr-2">•</span>
                                    Use the reports section to analyze your team's performance trends
                                </li>
                                <li class="flex items-start">
                                    <span class="text-red-600 mr-2">•</span>
                                    Take advantage of keyboard shortcuts for faster navigation
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div class="p-6 border-t border-gray-200">
                    <div class="flex space-x-3">
                        <button @click="startOnboarding" class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                            Start Interactive Tour
                        </button>
                        <button @click="showTipsModal = false" class="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                            Got It
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Onboarding Tour Overlay -->
        <div v-if="onboardingStep >= 0" class="onboarding-overlay">
            <div class="absolute inset-0 pointer-events-none">
                <!-- Spotlight effect for current element -->
                <div v-if="currentOnboardingTarget" 
                     :style="spotlightStyle"
                     class="absolute bg-white bg-opacity-20 rounded-lg border-2 border-blue-400 shadow-lg pointer-events-none transition-all duration-500">
                </div>
            </div>
            
            <!-- Onboarding tooltip -->
            <div v-if="onboardingSteps[onboardingStep]"
                 :class="tooltipPositionClass"
                 class="absolute bg-white rounded-lg shadow-xl p-6 max-w-sm z-60 transition-all duration-300">
                <div class="flex items-start justify-between mb-4">
                    <h4 class="text-lg font-semibold text-gray-900">
                        {{ onboardingSteps[onboardingStep].title }}
                    </h4>
                    <button @click="endOnboarding" class="text-gray-400 hover:text-gray-600 ml-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <p class="text-gray-600 mb-6">
                    {{ onboardingSteps[onboardingStep].description }}
                </p>
                
                <div class="flex items-center justify-between">
                    <div class="flex space-x-2">
                        <span v-for="(step, index) in onboardingSteps" :key="index"
                              :class="index === onboardingStep ? 'bg-blue-600' : 'bg-gray-300'"
                              class="w-2 h-2 rounded-full transition-colors duration-200">
                        </span>
                    </div>
                    
                    <div class="flex space-x-2">
                        <button v-if="onboardingStep > 0" 
                                @click="previousOnboardingStep"
                                class="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                            Previous
                        </button>
                        <button v-if="onboardingStep < onboardingSteps.length - 1"
                                @click="nextOnboardingStep"
                                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                            Next
                        </button>
                        <button v-else
                                @click="endOnboarding"
                                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                            Finish
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, reactive } from 'vue'
import { useAuthStore } from '~/features/auth/stores/auth.store'
import { useSubscriptionStore } from '~/features/subscription/stores/subscription.store'
import { useDashboard } from '~/features/dashboard/composables/use-dashboard'
import Sidebar from '@/features/dashboard/components/dashboard-sidebar.vue'
import Stats from '@/features/dashboard/components/dashboard-stats.vue'
import Table from '@/features/dashboard/components/dashboard-table.vue'
import ProModal from '@/features/subscription/components/pro-modal.vue'
import { FEATURE_SWITCH } from '~/shared/constants/feature-switch'
import MessagePopup from '~/shared/components/message/MessagePopup.vue'
import NewTaskModal from '~/pages/modals/NewTaskModal.vue'
import InviteTeamModal from '~/pages/modals/InviteTeamModal.vue'
import ReportsModal from '~/pages/modals/ReportsModal.vue'
import HelpModal from '~/pages/modals/HelpModal.vue'
import { API_ROUTES } from '~/shared/constants/api-routes'

const alertRef = ref(null)
const authStore = useAuthStore()
const subscriptionStore = useSubscriptionStore()
const { loading: dashboardLoading, error: dashboardError, summary, fetchDashboardSummary } = useDashboard()

// User state
const user = computed(() => authStore.getUser || {})
const profileMenuOpen = ref(false)
const showProModal = ref(false)

// Modal states
const showReferralModal = ref(false)
const showRedemptionModal = ref(false)
const showTipsModal = ref(false)

// Points and referral data
const userPoints = ref({ total: 0, available: 0, redeemed: 0 })
const referralStats = ref({ totalReferrals: 0, successfulReferrals: 0, totalPointsEarned: 0 })
const pointsHistory = ref([])
const copied = ref(false)

// Modal states - all initialized to false
const modals = reactive({
  newTask: false,
  inviteTeam: false,
  reports: false,
  help: false
})

// Computed properties
const userInitials = computed(() => {
    const name = user.value.name || ''
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2)
})

const displayName = computed(() => {
    return user.value.name || 'User'
})

const isSubscribed = computed(() => {
    return !!(user.value && user.value.isSubscribe)
})

const referralCode = computed(() => user.value.referralCode || 'Loading...')

const stats = computed(() => {
    if (!summary.value) {
        return {
            jobs: 0,
            activeTasks: 0,
            people: 0,
            productivity: 0,
            changes: {
                jobs: { value: 0, period: "last month" },
                activeTasks: { value: 0, period: "last week" },
                people: { value: 0, period: "last month" },
                productivity: { value: 0, period: "last week" }
            }
        }
    }
    return {
        jobs: summary.value.jobs,
        activeTasks: summary.value.activeTasks,
        people: summary.value.people,
        productivity: summary.value.productivity,
        changes: summary.value.changes || {
            jobs: { value: 0, period: "last month" },
            activeTasks: { value: 0, period: "last week" },
            people: { value: 0, period: "last month" },
            productivity: { value: 0, period: "last week" }
        }
    }
})

// Table data
const taskColumns = [
    { key: 'taskName', label: 'Task Name', type: 'title' },
    { key: 'assignee', label: 'Assignee', type: 'avatar' },
    { key: 'status', label: 'Status', type: 'status' },
]

const tasks = computed(() => {
    return summary.value?.recentTasks || []
})

const peopleColumns = [
    { key: 'name', label: 'Name', type: 'avatar' },
    { key: 'role', label: 'Role', type: 'role' },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'lastActive', label: 'Last Active' }
]

const people = computed(() => {
    return summary.value?.teamMembers || []
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

// Modal methods
const openNewTaskModal = () => { modals.newTask = true }
const openInviteTeamModal = () => { modals.inviteTeam = true }
const openReportsModal = () => { modals.reports = true }
const openHelpModal = () => { modals.help = true }
const closeNewTaskModal = () => { modals.newTask = false }
const closeInviteTeamModal = () => { modals.inviteTeam = false }
const closeReportsModal = () => { modals.reports = false }
const closeHelpModal = () => { modals.help = false }

// Add these new reactive variables to your existing script setup
// Add these new reactive variables to your existing script setup
const showLeaderboardModal = ref(false)
const leaderboard = ref([])
const leaderboardLoading = ref(false)
const leaderboardError = ref(null)
const userPosition = ref(null)

// Replace the existing viewLeaderboard function with this implementation
const viewLeaderboard = async () => {
    showReferralModal.value = false
    showLeaderboardModal.value = true
    await fetchLeaderboard()
}

// Add this new function
const fetchLeaderboard = async () => {
    leaderboardLoading.value = true
    leaderboardError.value = null
    
    try {
        const token = authStore.getToken
        const response = await $fetch(`${API_ROUTES.BASE_URL}referral-leaderboard?limit=10`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        
        if (response.success) {
            leaderboard.value = response.leaderboard
            
            // Check if current user is in the leaderboard
            const currentUserName = user.value?.name
            const currentUserInLeaderboard = leaderboard.value.find(leaderboardUser => 
                leaderboardUser.name === currentUserName
            )
            
            if (!currentUserInLeaderboard && referralStats.value.totalReferrals > 0) {
                // Fetch user's position if they're not in top 10
                await fetchUserPosition()
            } else {
                userPosition.value = null
            }
        } else {
            leaderboardError.value = 'Failed to load leaderboard data'
        }
    } catch (error) {
        console.error('Error fetching leaderboard:', error)
        leaderboardError.value = 'Unable to connect to server. Please try again.'
    } finally {
        leaderboardLoading.value = false
    }
}

// Add this helper function to get user's position if not in top 10
const fetchUserPosition = async () => {
    try {
        const token = authStore.getToken
        // This would require a new backend endpoint to get user's specific position
        // For now, we'll calculate it client-side based on their referral stats
        if (referralStats.value.totalReferrals > 0) {
            userPosition.value = {
                rank: '11+', // Placeholder - you'd get actual rank from backend
                name: user.value.name,
                totalReferrals: referralStats.value.totalReferrals,
                totalPointsEarned: referralStats.value.totalPointsEarned
            }
        }
    } catch (error) {
        console.error('Error fetching user position:', error)
    }
}

const handleTaskCreated = (task) => {
    closeNewTaskModal()
    alertRef.value.success(`Task ${task.title} created successfully!`, {
        title: 'Success',
        duration: 4000
    })
}

const handleMemberInvited = (member) => {
    closeInviteTeamModal()
    alertRef.value.success(`Invitation sent to ${member.email}!`, {
        title: 'Success',
        duration: 4000
    })
}

// API Functions
const fetchUserPoints = async () => {
    try {
        const token = authStore.getToken
        const response = await $fetch(`${API_ROUTES.BASE_URL}get-points/${user.value.email}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        
        if (response.success) {
            userPoints.value = response.data.points
            referralStats.value = response.data.referralStats
            pointsHistory.value = response.data.pointsHistory || []
        }
    } catch (error) {
        console.error('Error fetching user points:', error)
    }
}

const redeemPoints = async (amount, description) => {
    try {
        const token = authStore.getToken
        const response = await $fetch(`${API_ROUTES.BASE_URL}redeem-points`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: {
                email: user?.value.email,
                amount,
                description
            }
        })
        
        if (response.success) {
            userPoints.value = response.points
            showRedemptionModal.value = false
            alertRef.value.success(`Successfully redeemed ${amount} points for ${description}!`, {
                title: 'Success',
                duration: 4000
            })
            await fetchUserPoints()
        }
    } catch (error) {
        console.error('Error redeeming points:', error)
        alertRef.value.error('Failed to redeem points. Please try again.', {
            title: 'Error',
            duration: 4000
        })
    }
}

const copyReferralCode = async () => {
    try {
        await navigator.clipboard.writeText(`${window.location.origin}/auth/signup?ref=${referralCode.value}`)
        copied.value = true
        setTimeout(() => {
            copied.value = false
        }, 2000)
    } catch (err) {
        console.error('Failed to copy:', err)
    }
}

const shareReferral = async () => {
    const shareData = {
        title: 'Join QWESI AI',
        text: `Join me on QWESI AI and get 50 points welcome bonus!`,
        url: `${window.location.origin}/auth/signup?ref=${referralCode.value}`
    }

    if (navigator.share) {
        try {
            await navigator.share(shareData)
        } catch (err) {
            console.log('Share cancelled')
        }
    } else {
        copyReferralCode()
    }
}


// Onboarding
const showOnboarding = ref(true)
const onboardingStep = ref(-1)
const currentOnboardingTarget = ref(null)

const onboardingSteps = [
    {
        title: "Welcome to Your Dashboard",
        description: "This is your command center where you can see all your important metrics, tasks, and team activity at a glance.",
        target: "[data-onboard='dashboard-overview']"
    },
    {
        title: "Quick Actions",
        description: "Use these shortcuts to quickly create tasks, invite team members, generate reports, or get help whenever you need it.",
        target: "[data-onboard='quick-actions']"
    },
    {
        title: "Performance Stats",
        description: "Monitor your productivity metrics, active tasks, team size, and track changes over time to stay on top of your goals.",
        target: "[data-onboard='stats-grid']"
    },
    {
        title: "Recent Activity",
        description: "Keep track of your latest tasks and team members. Click on any item to view more details or make updates.",
        target: "[data-onboard='activity-tables']"
    },
    {
        title: "Points & Referrals",
        description: "Track your points, refer friends to earn rewards, and access tips and tutorials anytime. Your success is our priority!",
        target: "[data-onboard='header-actions']"
    }
]

const spotlightStyle = computed(() => {
    if (!currentOnboardingTarget.value) return {}
    
    const rect = currentOnboardingTarget.value.getBoundingClientRect()
    return {
        top: `${rect.top - 8}px`,
        left: `${rect.left - 8}px`,
        width: `${rect.width + 16}px`,
        height: `${rect.height + 16}px`
    }
})

const tooltipPositionClass = computed(() => {
    if (!currentOnboardingTarget.value) return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
    
    const rect = currentOnboardingTarget.value.getBoundingClientRect()
    const isTop = rect.top > window.innerHeight / 2
    const isLeft = rect.left > window.innerWidth / 2
    
    if (isTop && isLeft) return 'bottom-full right-0 mb-4'
    if (isTop && !isLeft) return 'bottom-full left-0 mb-4'
    if (!isTop && isLeft) return 'top-full right-0 mt-4'
    return 'top-full left-0 mt-4'
})

const startOnboarding = () => {
    onboardingStep.value = 0
    showTipsModal.value = false
    nextTick(() => {
        updateOnboardingTarget()
    })
}

const nextOnboardingStep = () => {
    if (onboardingStep.value < onboardingSteps.length - 1) {
        onboardingStep.value++
        nextTick(() => {
            updateOnboardingTarget()
        })
    }
}

const previousOnboardingStep = () => {
    if (onboardingStep.value > 0) {
        onboardingStep.value--
        nextTick(() => {
            updateOnboardingTarget()
        })
    }
}

const endOnboarding = async () => {
    onboardingStep.value = -1
    currentOnboardingTarget.value = null
    showOnboarding.value = false
    
    if (process.client) {
        localStorage.setItem('onboarding_completed', 'true')
    }
}

const updateOnboardingTarget = () => {
    if (onboardingStep.value >= 0 && onboardingStep.value < onboardingSteps.length) {
        const selector = onboardingSteps[onboardingStep.value].target
        currentOnboardingTarget.value = document.querySelector(selector)
    }
}

const dismissOnboarding = () => {
    showOnboarding.value = false
    if (process.client) {
        localStorage.setItem('onboarding_dismissed', 'true')
    }
}

const showPitchBanner = ref(true)
const closePitchBanner = () => {
    showPitchBanner.value = false
    if (process.client) {
        localStorage.setItem('hide_pitch_banner_dashboard', 'true')
    }
}

// Lifecycle
onMounted(async () => {
    if (!authStore.isAuthenticated) {
        navigateTo('/auth/login')
        return
    }

    await fetchDashboardSummary()
    await fetchUserPoints()
    await subscriptionStore.fetchSubscription()

    if (process.client) {
        const onboardingCompleted = localStorage.getItem('onboarding_completed')
        const onboardingDismissed = localStorage.getItem('onboarding_dismissed')
        showOnboarding.value = !onboardingCompleted && !onboardingDismissed && !user.value.hasCompletedOnboarding
        showPitchBanner.value = localStorage.getItem('hide_pitch_banner_dashboard') !== 'true'
    }
})

useHead({
    title: 'Dashboard - QWESI AI'
})

</script>