<template>
    <div class="min-h-screen bg-gray-50 flex">
        <!-- Sidebar -->
        <Sidebar :user="user" />

        <!-- Main Content -->
        <div class="flex-1 flex flex-col">
            <!-- Top Navigation -->
            <header class="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                    <div class="text-center sm:text-left">
                        <h1 class="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
                        <p class="text-sm text-gray-600">Welcome back, {{ displayName }}</p>
                    </div>

                    <!-- Enhanced Header Actions -->
                    <div class="flex items-center space-x-3">
                        <!-- Help/Tips Button -->
                        <button @click="showTipsModal = true"
                            class="flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Tips
                        </button>

                        <!-- Referral Button -->
                        <button @click="showReferralModal = true"
                            class="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                            Refer Friends
                        </button>

                        <!-- Profile Dropdown -->
                        <div class="relative">
                            <button @click="profileMenuOpen = !profileMenuOpen"
                                class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                <div v-if="user.profileImage"
                                    class="w-8 h-8 object-cover rounded-full overflow-hidden border-2 border-gray-200">
                                    <img :src="user.profileImage" alt="Profile Picture" class="w-8 h-8 object-cover" />
                                </div>
                                <div v-else class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span class="text-blue-600 font-medium text-sm">{{ userInitials }}</span>
                                </div>
                                <span class="text-sm font-medium text-gray-700 hidden sm:block">{{ displayName }}</span>
                                <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clip-rule="evenodd" />
                                </svg>
                            </button>

                            <!-- Profile Menu -->
                            <div v-if="profileMenuOpen"
                                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                <button @click="editProfile"
                                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Edit Profile
                                </button>
                                <div class="border-t border-gray-100 my-1"></div>
                                <button @click="handleLogout"
                                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Main Content Area -->
            <main class="flex-1 p-6 flex flex-col">
                <!-- Onboarding Banner - Show for new users -->
                <div v-if="showOnboarding && !user.hasCompletedOnboarding"
                    class="mb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-xl p-6 text-white relative overflow-hidden">
                    <div class="absolute inset-0 bg-black opacity-10"></div>
                    <div class="relative z-10">
                        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                            <div class="flex-1">
                                <div class="flex items-center mb-3">
                                    <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    <h3 class="text-xl font-bold">Welcome to QWESI AI!</h3>
                                </div>
                                <p class="text-indigo-100 mb-4">Let's get you started with a quick tour of your dashboard and key features.</p>
                                <div class="flex flex-wrap gap-2">
                                    <button @click="startOnboarding"
                                        class="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50 transition-colors text-sm">
                                        Start Tour
                                    </button>
                                    <button @click="showTipsModal = true"
                                        class="bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-400 transition-colors text-sm">
                                        View Tips
                                    </button>
                                </div>
                            </div>
                            <button @click="dismissOnboarding"
                                class="absolute top-4 right-4 text-indigo-200 hover:text-white transition-colors">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Try Pro Banner - Only show if user is not subscribed -->
                <div v-if="!isSubscribed"
                    class="mb-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4 sm:p-6 text-white">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                        <div class="flex-1">
                            <h3 class="text-lg font-semibold mb-2">Unlock Premium Features</h3>
                            <p class="text-blue-100 text-sm sm:text-base">Get access to advanced AI features, priority support, and more.</p>
                        </div>
                        <button @click="showProModal = true"
                            class="bg-white text-blue-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm sm:text-base w-full sm:w-auto">
                            Try Pro for 7 Days
                        </button>
                    </div>
                </div>

                <!-- Quick Actions Bar -->
                <!-- <div class="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <button @click="navigateTo('/dashboard/tasks/create')"
                            class="flex flex-col items-center p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors group">
                            <svg class="w-6 h-6 text-blue-600 mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span class="text-sm font-medium text-gray-700">New Task</span>
                        </button>
                        <button @click="navigateTo('/dashboard/team/invite')"
                            class="flex flex-col items-center p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors group">
                            <svg class="w-6 h-6 text-green-600 mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                            <span class="text-sm font-medium text-gray-700">Invite Team</span>
                        </button>
                        <button @click="navigateTo('/dashboard/reports')"
                            class="flex flex-col items-center p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors group">
                            <svg class="w-6 h-6 text-purple-600 mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <span class="text-sm font-medium text-gray-700">Reports</span>
                        </button>
                        <button @click="showTipsModal = true"
                            class="flex flex-col items-center p-3 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors group">
                            <svg class="w-6 h-6 text-orange-600 mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span class="text-sm font-medium text-gray-700">Help</span>
                        </button>
                    </div>
                </div> -->

                <!-- Stats Grid -->
                <div class="mb-8">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-xl font-semibold text-gray-900">Dashboard Overview</h2>
                        <button @click="() => fetchDashboardSummary()" :disabled="dashboardLoading"
                            class="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            <svg v-if="dashboardLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600"
                                fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                            </svg>
                            <svg v-else class="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Refresh
                        </button>
                    </div>
                    <div v-if="dashboardLoading" class="flex justify-center items-center py-8">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span class="ml-2 text-gray-600">Loading dashboard data...</span>
                    </div>
                    <div v-else-if="dashboardError" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p class="text-red-600 text-sm">{{ dashboardError }}</p>
                    </div>
                    <Stats v-else :stats="stats" />
                </div>

                <!-- Tables Grid -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <!-- Tasks Table -->
                    <div v-if="dashboardLoading" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div class="flex justify-center items-center py-8">
                            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            <span class="ml-2 text-gray-600">Loading tasks...</span>
                        </div>
                    </div>
                    <Table v-else title="Recent Tasks" description="Your latest tasks and their status"
                        :columns="taskColumns" :data="tasks" />

                    <!-- People Table -->
                    <div v-if="dashboardLoading" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div class="flex justify-center items-center py-8">
                            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            <span class="ml-2 text-gray-600">Loading team members...</span>
                        </div>
                    </div>
                    <Table v-else title="Team Members" description="People working on your projects"
                        :columns="peopleColumns" :data="people" />
                </div>

                <!-- Pitch Banner -->
                <div v-if="FEATURE_SWITCH.showPitchBanner && showPitchBanner"
                    class="relative flex flex-col sm:flex-row items-center sm:items-center gap-4 p-4 sm:p-6 bg-white border-l-8 border-blue-600 border border-blue-200 rounded-lg mb-8 text-center sm:text-left">
                    <button @click="closePitchBanner" aria-label="Close banner"
                        class="absolute top-2 right-2 sm:static sm:ml-2 text-gray-400 hover:text-blue-600 transition-colors rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-200">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <span
                        class="flex items-center justify-center text-2xl bg-blue-100 rounded-full w-12 h-12 mx-auto sm:mx-0">
                        <svg class="w-7 h-7 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                            <path
                                d="M17 3a1 1 0 0 1 1 1v2h1a1 1 0 0 1 1 1v2a5 5 0 0 1-4 4.9V15a5 5 0 0 1-4 4.9V21h3a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2h3v-1.1A5 5 0 0 1 7 15v-2.1A5 5 0 0 1 3 7V5a1 1 0 0 1 1-1h1V4a1 1 0 0 1 1-1h12zm-1 2H8v2a3 3 0 0 0 6 0V5zm-8 2v2a3 3 0 0 0 2 2.83V7H6zm10 0h-2v4.83A3 3 0 0 0 18 9V7z" />
                        </svg>
                    </span>
                    <div class="flex-1 min-w-0 mt-2 sm:mt-0">
                        <div class="font-bold text-blue-700 text-base sm:text-lg mb-1">Pitch/Challenge Submissions Open!</div>
                        <div class="text-gray-700 text-sm sm:text-base">Have a great idea, startup, or challenge? Submit it for competitions and get noticed!</div>
                    </div>
                    <NuxtLink to="/dashboard/get-started?tab=pitch"
                        class="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold px-4 py-2 rounded-lg transition-colors text-xs sm:text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 mt-3 sm:mt-0">
                        Submit Your Pitch
                    </NuxtLink>
                </div>

                <!-- Footer -->
                <div class="mt-auto">
                    <!-- Footer component was removed -->
                </div>
            </main>
        </div>

        <!-- Modals -->
        <ProModal v-model="showProModal" mode="upgrade" />
        
        <!-- Referral Modal -->
        <div v-if="showReferralModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-hidden">
                <div class="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 class="text-xl font-bold text-gray-900">Refer Friends & Earn Points</h3>
                    <button @click="showReferralModal = false" class="text-gray-400 hover:text-gray-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        <!-- Tips Modal -->
        <div v-if="showTipsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                <div class="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 class="text-xl font-bold text-gray-900">How to Use QWESI AI</h3>
                    <button @click="showTipsModal = false" class="text-gray-400 hover:text-gray-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div v-if="onboardingStep >= 0" class="fixed inset-0 bg-black bg-opacity-50 z-50">
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
import { ref, computed, onMounted, nextTick } from 'vue'

import { useAuthStore } from '~/features/auth/stores/auth.store'
import { useSubscriptionStore } from '~/features/subscription/stores/subscription.store'
import { useDashboard } from '~/features/dashboard/composables/use-dashboard'
import Sidebar from '@/features/dashboard/components/dashboard-sidebar.vue'
import Stats from '@/features/dashboard/components/dashboard-stats.vue'
import Table from '@/features/dashboard/components/dashboard-table.vue'
import ProModal from '@/features/subscription/components/pro-modal.vue'
import { FEATURE_SWITCH } from '~/shared/constants/feature-switch'

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

// Referral system
const referralCode = computed(() => user.value.referralCode || 'Loading...')

// Enhanced stats with points
const enhancedStats = computed(() => {
    const baseStats = stats.value
    return {
        ...baseStats,
        points: userPoints.value.total,
        referrals: referralStats.value.totalReferrals,
        changes: {
            ...baseStats.changes,
            points: { value: referralStats.value.totalPointsEarned, period: "all time" },
            referrals: { value: referralStats.value.successfulReferrals, period: "this month" }
        }
    }
})

// API Functions
const fetchUserPoints = async () => {
    try {
        const token = authStore.getToken
        const response = await $fetch('https://dark-caldron-448714-u5.uc.r.appspot.com/user-points', {
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
        const response = await $fetch('https://dark-caldron-448714-u5.uc.r.appspot.com/redeem-points', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: {
                amount,
                description
            }
        })
        
        if (response.success) {
            userPoints.value = response.points
            showRedemptionModal.value = false
            // Show success message
            alert(`Successfully redeemed ${amount} points for ${description}!`)
            await fetchUserPoints() // Refresh data
        }
    } catch (error) {
        console.error('Error redeeming points:', error)
        alert('Failed to redeem points. Please try again.')
    }
}

const viewLeaderboard = async () => {
    try {
        const response = await $fetch('https://dark-caldron-448714-u5.uc.r.appspot.com/referral-leaderboard?limit=10')
        if (response.success) {
            // You could show this in a modal or navigate to a leaderboard page
            console.log('Leaderboard:', response.leaderboard)
            alert('Leaderboard feature coming soon!')
        }
    } catch (error) {
        console.error('Error fetching leaderboard:', error)
    }
}

// Existing computed properties and methods remain the same...
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

// Stats data - now computed from API response
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

// Methods
const editProfile = () => {
    profileMenuOpen.value = false
    navigateTo('/dashboard/profile')
}

const handleLogout = async () => {
    await authStore.logout()
    navigateTo('/')
}

const copyReferralCode = async () => {
    try {
        await navigator.clipboard.writeText(`${window.location.origin}/register?ref=${referralCode.value}`)
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
        url: `${window.location.origin}/register?ref=${referralCode.value}`
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

// Lifecycle
onMounted(async () => {
    // Check if user is authenticated
    if (!authStore.isAuthenticated) {
        navigateTo('/auth/login')
        return
    }

    // Fetch dashboard summary data
    await fetchDashboardSummary()
    
    // Fetch user points and referral data
    await fetchUserPoints()

    // Fetch subscription data to ensure we have the latest status
    await subscriptionStore.fetchSubscription()

    // Check onboarding status
    if (process.client) {
        const onboardingCompleted = localStorage.getItem('onboarding_completed')
        const onboardingDismissed = localStorage.getItem('onboarding_dismissed')
        showOnboarding.value = !onboardingCompleted && !onboardingDismissed && !user.value.hasCompletedOnboarding
        showPitchBanner.value = localStorage.getItem('hide_pitch_banner_dashboard') !== 'true'
    }
})

// Table data - now computed from API response
const taskColumns = [
    { key: 'taskName', label: 'Task Name' },
    { key: 'assignee', label: 'Assignee', type: 'avatar' },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'dueDate', label: 'Due Date' }
]

const tasks = computed(() => {
    return summary.value?.recentTasks || []
})

const peopleColumns = [
    { key: 'name', label: 'Name', type: 'avatar' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'lastActive', label: 'Last Active' }
]

const people = computed(() => {
    return summary.value?.teamMembers || []
})

// Onboarding system (existing code)
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

// Onboarding methods
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
    
    // Mark onboarding as completed
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
function closePitchBanner() {
    showPitchBanner.value = false
    if (process.client) {
        localStorage.setItem('hide_pitch_banner_dashboard', 'true')
    }
}

// Lifecycle
onMounted(async () => {
    // Check if user is authenticated
    if (!authStore.isAuthenticated) {
        navigateTo('/auth/login')
        return
    }

    // Fetch dashboard summary data
    await fetchDashboardSummary()

    // Fetch subscription data to ensure we have the latest status
    await subscriptionStore.fetchSubscription()

    // Check onboarding status
    if (process.client) {
        const onboardingCompleted = localStorage.getItem('onboarding_completed')
        const onboardingDismissed = localStorage.getItem('onboarding_dismissed')
        showOnboarding.value = !onboardingCompleted && !onboardingDismissed && !user.value.hasCompletedOnboarding
        showPitchBanner.value = localStorage.getItem('hide_pitch_banner_dashboard') !== 'true'
    }
})

// Set page title
useHead({
    title: 'Dashboard - QWESI AI'
})
</script>

<style scoped>
/* Custom styles for onboarding */
.z-60 {
    z-index: 60;
}

/* Smooth transitions for onboarding elements */
.transition-all {
    transition: all 0.3s ease-in-out;
}

/* Ensure proper stacking context */
.fixed {
    position: fixed;
}

/* Responsive tooltip positioning */
@media (max-width: 640px) {
    .tooltip-responsive {
        left: 1rem !important;
        right: 1rem !important;
        max-width: calc(100vw - 2rem) !important;
    }
}
</style>