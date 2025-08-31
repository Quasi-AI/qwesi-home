<template>
    <div class="dashboard-container">
        <!-- Sidebar -->
        <Sidebar :user="user" />

        <!-- Main Content -->
        <div class="main-content">
            <!-- Modern Header -->
            <header class="modern-header">
                <div class="header-backdrop"></div>
                <div class="header-content">
                    <div class="header-info">
                        <div class="welcome-section">
                            <h1 class="dashboard-title">{{ currentView === 'list' ? 'Job Management' : currentView === 'create' ? 'Create New Job' : 'Edit Job' }}</h1>
                            <p class="welcome-message">
                                {{ currentView === 'list' ? 'Manage your job postings and find the best talent' : 
                                   currentView === 'create' ? 'Post a new job opening to attract qualified candidates' : 
                                   'Update your job posting details' }}
                            </p>
                        </div>
                    </div>

                    <!-- Header Actions -->
                    <div class="header-actions">
                        <!-- View Toggle Buttons -->
                        <button v-if="currentView !== 'list'" @click="switchToList" class="action-btn tips-btn">
                            <div class="btn-bg"></div>
                            <div class="btn-content">
                                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                </svg>
                                <span>View Jobs</span>
                            </div>
                        </button>

                        <button v-if="currentView === 'list'" @click="switchToCreate" class="action-btn create-btn">
                            <div class="btn-bg"></div>
                            <div class="btn-content">
                                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                                </svg>
                                <span>Create Job</span>
                            </div>
                        </button>

                        <!-- Tips Button -->
                        <button @click="showTipsModal = true" class="action-btn tips-btn">
                            <div class="btn-bg"></div>
                            <div class="btn-content">
                                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Tips</span>
                            </div>
                        </button>

                        <!-- Back Button -->
                        <NuxtLink to="/dashboard/get-started" class="action-btn referral-btn">
                            <div class="btn-bg"></div>
                            <div class="btn-content">
                                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                <span>Dashboard</span>
                            </div>
                        </NuxtLink>

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
                                <span class="hidden sm:block">{{ displayName }}</span>
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
                
                <!-- Header Decorations -->
                <div class="header-decorations">
                    <div class="floating-orb orb-1"></div>
                    <div class="floating-orb orb-2"></div>
                    <div class="floating-orb orb-3"></div>
                </div>
            </header>

            <MessagePopup ref="alertRef" />

            <!-- Main Content Area -->
            <main class="dashboard-main">
                <div class="max-w-6xl mx-auto w-full space-y-8">
                    
                    <!-- Jobs List View -->
                    <div v-if="currentView === 'list'" class="space-y-6">
                        <!-- Stats Cards -->
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div class="stats-card">
                                <div class="stats-backdrop"></div>
                                <div class="stats-content">
                                <div class="stats-icon bg-blue-500">
                                    <svg fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                                <div class="stats-info">
                                    <h3 class="stats-title">Total Jobs</h3>
                                    <p class="stats-number">{{ jobs.length }}</p>
                                </div>
                                </div>
                            </div>

                            <div class="stats-card">
                                <div class="stats-backdrop"></div>
                                <div class="stats-content">
                                <div class="stats-icon bg-green-500">
                                    <svg fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                                <div class="stats-info">
                                    <h3 class="stats-title">Active Jobs</h3>
                                    <p class="stats-number">{{ activeJobs }}</p>
                                </div>
                                </div>
                            </div>

                            <div class="stats-card">
                                <div class="stats-backdrop"></div>
                                <div class="stats-content">
                                <div class="stats-icon bg-purple-500">
                                    <svg fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                    </svg>
                                </div>
                                <div class="stats-info">
                                    <h3 class="stats-title">Total Views</h3>
                                    <p class="stats-number">{{ totalViews }}</p>
                                </div>
                                </div>
                            </div>
                            </div>


                        <!-- Search and Filter Bar -->
                        <div class="search-filter-bar">
                            <div class="search-backdrop"></div>
                            <div class="search-content">
                                <div class="search-input-container">
                                    <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input v-model="searchQuery" type="text" placeholder="Search jobs..."
                                        class="search-input" />
                                </div>
                                <select v-model="statusFilter" class="status-filter">
                                    <option value="">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="paused">Paused</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </div>
                        </div>

                        <!-- Jobs List -->
                        <div v-if="loading" class="loading-container">
                            <div class="loading-spinner"></div>
                            <p class="loading-text">Loading your jobs...</p>
                        </div>

                        <div v-else-if="filteredJobs.length === 0" class="empty-state">
                            <div class="empty-backdrop"></div>
                            <div class="empty-content">
                                <div class="empty-icon">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h8z" />
                                    </svg>
                                </div>
                                <h3 class="empty-title">No jobs found</h3>
                                <p class="empty-description">
                                    {{ searchQuery || statusFilter ? 'Try adjusting your search or filter criteria' : 'Start by creating your first job posting' }}
                                </p>
                                <button v-if="!searchQuery && !statusFilter" @click="switchToCreate" class="empty-action-btn">
                                    <span>Create Your First Job</span>
                                </button>
                            </div>
                        </div>

                        <div v-else class="jobs-grid">
                            <div v-for="job in filteredJobs" :key="job.id" class="job-card">
                                <div class="job-backdrop"></div>
                                <div class="job-content">
                                    <div class="job-header">
                                        <div class="job-title-section">
                                            <h3 class="job-title">{{ job.title }}</h3>
                                            <span class="job-company">{{ job.companyName }}</span>
                                        </div>
                                        <div class="job-status" :class="`status-${job.status}`">
                                            {{ job.status }}
                                        </div>
                                    </div>

                                    <div class="job-details">
                                        <div class="job-meta">
                                            <span class="job-meta-item">
                                                <svg class="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {{ job.location }}
                                            </span>
                                            <span class="job-meta-item">
                                                <svg class="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                                </svg>
                                                {{ job.salary }}
                                            </span>
                                            <span class="job-meta-item">
                                                <svg class="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {{ formatDate(job.createdAt) }}
                                            </span>
                                        </div>
                                        <p class="job-description">{{ truncateText(job.job_description, 120) }}</p>
                                    </div>

                                    <div class="job-actions">
                                        <button @click="viewJob(job.id)" class="job-action-btn view-btn">
                                            <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            View
                                        </button>
                                        <button @click="editJob(job)" class="job-action-btn edit-btn">
                                            <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Edit
                                        </button>
                                        <button @click="deleteJob(job.id)" class="job-action-btn delete-btn">
                                            <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Job Form (Create/Edit) -->
                    <div v-else class="form-container">
                        <div class="form-card">
                            <div class="form-backdrop"></div>
                            <div class="form-content">
                                <form @submit.prevent="submitJobForm" class="space-y-6">
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label class="form-label">Job Title *</label>
                                            <input v-model="jobForm.title" type="text" placeholder="e.g. Senior Software Engineer"
                                                class="form-input" required />
                                        </div>

                                        <div>
                                            <label class="form-label">Company Name *</label>
                                            <input v-model="jobForm.companyName" type="text" placeholder="Your company name"
                                                class="form-input" required />
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label class="form-label">Location *</label>
                                            <input v-model="jobForm.location" type="text" placeholder="e.g. Remote, New York, London"
                                                class="form-input" required />
                                        </div>

                                        <div>
                                            <label class="form-label">Salary Range *</label>
                                            <input v-model="jobForm.salary" type="text" placeholder="e.g. $50,000 - $80,000"
                                                class="form-input" required />
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label class="form-label">Job Type *</label>
                                            <select v-model="jobForm.jobType" class="form-select" required>
                                                <option value="">Select job type</option>
                                                <option value="full-time">Full-time</option>
                                                <option value="part-time">Part-time</option>
                                                <option value="contract">Contract</option>
                                                <option value="internship">Internship</option>
                                                <option value="freelance">Freelance</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label class="form-label">Experience Level *</label>
                                            <select v-model="jobForm.experience_level" class="form-select" required>
                                                <option value="">Select experience level</option>
                                                <option value="entry">Entry Level</option>
                                                <option value="mid">Mid Level</option>
                                                <option value="senior">Senior Level</option>
                                                <option value="lead">Lead/Manager</option>
                                                <option value="executive">Executive</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label class="form-label">Required Skills</label>
                                        <input v-model="jobForm.skills" type="text" 
                                            placeholder="e.g. JavaScript, React, Node.js (comma separated)"
                                            class="form-input" />
                                        <p class="form-help">Separate skills with commas</p>
                                    </div>

                                    <div>
                                        <label class="form-label">Job Description *</label>
                                        <textarea v-model="jobForm.job_description" rows="8"
                                            placeholder="Provide a detailed job description including:&#10;- Role responsibilities&#10;- Required qualifications&#10;- Company culture&#10;- Benefits and perks&#10;- Application instructions"
                                            class="form-textarea" required></textarea>
                                    </div>

                                    <div>
                                        <label class="form-label">Application Deadline</label>
                                        <input v-model="jobForm.deadline" type="date" class="form-input" />
                                    </div>

                                    <div>
                                        <label class="form-label">Status *</label>
                                        <select v-model="jobForm.status" class="form-select" required>
                                            <option value="active">Active</option>
                                            <option value="paused">Paused</option>
                                            <option value="closed">Closed</option>
                                        </select>
                                    </div>

                                    <div class="form-actions">
                                        <button type="button" @click="cancelForm" class="cancel-btn">
                                            Cancel
                                        </button>
                                        <button type="submit" :disabled="isSubmitting" class="submit-btn">
                                            <span v-if="isSubmitting" class="flex items-center justify-center">
                                                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l-3-2.647z"></path>
                                                </svg>
                                                {{ currentView === 'create' ? 'Creating...' : 'Updating...' }}
                                            </span>
                                            <span v-else>
                                                {{ currentView === 'create' ? 'Create Job' : 'Update Job' }}
                                            </span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <!-- Job Detail Modal -->
                    <div v-if="showJobDetail" class="modal-overlay" @click="closeJobDetail">
                        <div class="modal-container" @click.stop>
                            <div class="modal-backdrop"></div>
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h3 class="modal-title">Job Details</h3>
                                    <button @click="closeJobDetail" class="modal-close">
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                
                                <div v-if="selectedJob" class="modal-body">
                                    <div class="job-detail-header">
                                        <h4 class="detail-title">{{ selectedJob.title }}</h4>
                                        <span class="detail-company">{{ selectedJob.companyName }}</span>
                                        <div class="detail-status" :class="`status-${selectedJob.status}`">
                                            {{ selectedJob.status }}
                                        </div>
                                    </div>

                                    <div class="job-detail-meta">
                                        <div class="detail-meta-item">
                                            <span class="meta-label">Location:</span>
                                            <span class="meta-value">{{ selectedJob.location }}</span>
                                        </div>
                                        <div class="detail-meta-item">
                                            <span class="meta-label">Salary:</span>
                                            <span class="meta-value">{{ selectedJob.salary }}</span>
                                        </div>
                                        <div class="detail-meta-item">
                                            <span class="meta-label">Job Type:</span>
                                            <span class="meta-value">{{ selectedJob.jobType }}</span>
                                        </div>
                                        <div class="detail-meta-item">
                                            <span class="meta-label">Experience:</span>
                                            <span class="meta-value">{{ selectedJob.experience_level }}</span>
                                        </div>
                                        <div v-if="selectedJob.skills" class="detail-meta-item">
                                            <span class="meta-label">Skills:</span>
                                            <span class="meta-value">{{ selectedJob.skills }}</span>
                                        </div>
                                        <div v-if="selectedJob.deadline" class="detail-meta-item">
                                            <span class="meta-label">Deadline:</span>
                                            <span class="meta-value">{{ formatDate(selectedJob.deadline) }}</span>
                                        </div>
                                    </div>

                                    <div class="job-detail-description">
                                        <h5 class="description-title">Job Description</h5>
                                        <p class="description-text">{{ selectedJob.job_description }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Delete Confirmation Modal -->
                    <div v-if="showDeleteConfirm" class="modal-overlay" @click="cancelDelete">
                        <div class="modal-container small" @click.stop>
                            <div class="modal-backdrop"></div>
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h3 class="modal-title text-red-600">Confirm Delete</h3>
                                    <button @click="cancelDelete" class="modal-close">
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                
                                <div class="modal-body">
                                    <p class="text-slate-600">Are you sure you want to delete this job? This action cannot be undone.</p>
                                    <div class="flex justify-end space-x-3 mt-6">
                                        <button @click="cancelDelete" class="cancel-btn">
                                            Cancel
                                        </button>
                                        <button @click="confirmDelete" :disabled="isDeleting" class="delete-confirm-btn">
                                            <span v-if="isDeleting" class="flex items-center">
                                                <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l-3-2.647z"></path>
                                                </svg>
                                                Deleting...
                                            </span>
                                            <span v-else>Delete Job</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup>
import { API_ROUTES } from '~/shared/constants/api-routes'
import { useAuthStore } from '~/features/auth/stores/auth.store'
import Sidebar from '@/features/dashboard/components/dashboard-sidebar.vue'
import MessagePopup from '~/shared/components/message/MessagePopup.vue'

const alertRef = ref(null)
const authStore = useAuthStore()

// User state
const user = computed(() => authStore.getUser || {})
const userInitials = computed(() => {
    const name = user.value?.name || 'User'
    return name.charAt(0).toUpperCase()
})
const displayName = computed(() => user.value?.name || 'User')

// View state
const currentView = ref('list') // 'list', 'create', 'edit'
const profileMenuOpen = ref(false)
const showTipsModal = ref(false)
const showJobDetail = ref(false)
const showDeleteConfirm = ref(false)

// Data state
const jobs = ref([])
const selectedJob = ref(null)
const jobToDelete = ref(null)
const loading = ref(false)
const isSubmitting = ref(false)
const isDeleting = ref(false)

// Search and filter
const searchQuery = ref('')
const statusFilter = ref('')

// Job form data
const jobForm = ref({
    id: null,
    title: '',
    companyName: '',
    location: '',
    salary: '',
    jobType: '',
    experience_level: '',
    skills: '',
    job_description: '',
    deadline: '',
    status: 'active'
})

// Computed properties
const filteredJobs = computed(() => {
    let filtered = jobs.value

    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(job => 
            job.title.toLowerCase().includes(query) ||
            job.companyName.toLowerCase().includes(query) ||
            job.location.toLowerCase().includes(query)
        )
    }

    if (statusFilter.value) {
        filtered = filtered.filter(job => job.status === statusFilter.value)
    }

    return filtered
})

const activeJobs = computed(() => {
    return jobs.value.filter(job => job.status === 'active').length
})

const totalViews = computed(() => {
    return jobs.value.reduce((total, job) => total + (job.views || 0), 0)
})

// API Functions
const fetchJobs = async () => {
    loading.value = true
    try {
        const response = await $fetch(`${API_ROUTES.JOBS}/${user.value.email}`, {
            method: 'GET',
            throw: false
        })

        if (response.success) {
            jobs.value = response.data || []
        } else {
            alertRef.value.error(response.message || 'Failed to fetch jobs')
        }
    } catch (error) {
        console.error('Fetch jobs error:', error)
        alertRef.value.error('Failed to load jobs')
    } finally {
        loading.value = false
    }
}

const fetchJobById = async (jobId) => {
    try {
        const response = await $fetch(`${API_ROUTES.JOBS}/${jobId}`, {
            method: 'GET',
            throw: false
        })

        if (response.success) {
            selectedJob.value = response.data
            showJobDetail.value = true
        } else {
            alertRef.value.error(response.message || 'Failed to fetch job details')
        }
    } catch (error) {
        console.error('Fetch job by ID error:', error)
        alertRef.value.error('Failed to load job details')
    }
}

const createJob = async (payload) => {
    const response = await $fetch(`${API_ROUTES.JOBS}/create`, {
        method: 'POST',
        body: payload,
        throw: false
    })
    return response
}

const updateJob = async (payload) => {
    const response = await $fetch(`${API_ROUTES.JOBS}/update`, {
        method: 'PUT',
        body: payload,
        throw: false
    })
    return response
}

const deleteJobById = async (jobId) => {
    const response = await $fetch(`${API_ROUTES.JOBS}/delete`, {
        method: 'DELETE',
        body: { id: jobId },
        throw: false
    })
    return response
}

// Form Functions
const submitJobForm = async () => {
    isSubmitting.value = true
    
    try {
        const payload = {
            ...jobForm.value,
            email: user.value.email,
        }

        let response
        if (currentView.value === 'create') {
            response = await createJob(payload)
        } else {
            response = await updateJob(payload)
        }

        if (response.success) {
            const action = currentView.value === 'create' ? 'created' : 'updated'
            alertRef.value.success(`Job ${action} successfully!`, {
                title: 'Success',
                duration: 3000
            })
            resetJobForm()
            switchToList()
            await fetchJobs() // Refresh the jobs list
        } else {
            alertRef.value.error(response.message || `Failed to ${currentView.value} job`)
        }
    } catch (error) {
        console.error('Submit job error:', error)
        alertRef.value.error(`Failed to ${currentView.value} job`)
    } finally {
        isSubmitting.value = false
    }
}

const resetJobForm = () => {
    jobForm.value = {
        id: null,
        title: '',
        companyName: '',
        location: '',
        salary: '',
        jobType: '',
        experience_level: '',
        skills: '',
        job_description: '',
        deadline: '',
        status: 'active'
    }
}

// View Functions
const switchToList = () => {
    currentView.value = 'list'
    resetJobForm()
}

const switchToCreate = () => {
    currentView.value = 'create'
    resetJobForm()
}

const editJob = (job) => {
    currentView.value = 'edit'
    jobForm.value = { ...job }
}

const viewJob = async (jobId) => {
    await fetchJobById(jobId)
}

const deleteJob = (jobId) => {
    jobToDelete.value = jobId
    showDeleteConfirm.value = true
}

const confirmDelete = async () => {
    isDeleting.value = true
    try {
        const response = await deleteJobById(jobToDelete.value)
        
        if (response.success) {
            alertRef.value.success('Job deleted successfully!', {
                title: 'Deleted',
                duration: 3000
            })
            await fetchJobs() // Refresh the jobs list
        } else {
            alertRef.value.error(response.message || 'Failed to delete job')
        }
    } catch (error) {
        console.error('Delete job error:', error)
        alertRef.value.error('Failed to delete job')
    } finally {
        isDeleting.value = false
        cancelDelete()
    }
}

const cancelDelete = () => {
    showDeleteConfirm.value = false
    jobToDelete.value = null
}

const cancelForm = () => {
    resetJobForm()
    switchToList()
}

const closeJobDetail = () => {
    showJobDetail.value = false
    selectedJob.value = null
}

// Utility Functions
const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

const truncateText = (text, length) => {
    if (!text) return ''
    return text.length > length ? text.substring(0, length) + '...' : text
}

// Profile actions
const editProfile = () => {
    profileMenuOpen.value = false
    navigateTo('/dashboard/profile')
}

const handleLogout = () => {
    profileMenuOpen.value = false
    authStore.logout()
    navigateTo('/auth/login')
}

// Lifecycle
onMounted(async () => {
    if (!authStore.isAuthenticated) {
        navigateTo('/auth/login')
        return
    }
    await fetchJobs()
})

// Set page title
useHead({
    title: 'Job Management - QWESI AI'
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

/* Header Styles */
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
    @apply bg-amber-400 top-6 right-12;
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

.create-btn .btn-bg {
    @apply bg-gradient-to-r from-green-100/80 to-emerald-100/60;
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

.create-btn {
    @apply text-green-700 hover:text-green-900;
}

.referral-btn {
    @apply text-blue-700 hover:text-blue-900;
}

/* Profile Dropdown */
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

/* Stats Cards */
.stats-card {
  position: relative;
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
}

.stats-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.stats-backdrop {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0.03;
  z-index: 0;
}

.stats-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stats-icon {
  width: 4rem;
  height: 4rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.stats-icon svg {
  width: 2rem;
  height: 2rem;
}

.stats-info {
  flex: 1;
}

.stats-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stats-number {
  font-size: 2rem;
  font-weight: 800;
  color: #1f2937;
  margin: 0;
  line-height: 1;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .stats-card {
    padding: 1.25rem;
  }
  
  .stats-icon {
    width: 3.5rem;
    height: 3.5rem;
  }
  
  .stats-icon svg {
    width: 1.75rem;
    height: 1.75rem;
  }
  
  .stats-number {
    font-size: 1.75rem;
  }
}

/* Animation for numbers */
.stats-number {
  transition: all 0.5s ease;
}

.stats-card:hover .stats-number {
  transform: scale(1.05);
}

/* Color variations */
.bg-blue-500 {
  background-color: #3b82f6;
}

.bg-green-500 {
  background-color: #10b981;
}

.bg-purple-500 {
  background-color: #8b5cf6;
}


/* Search and Filter */
.search-filter-bar {
    @apply relative rounded-3xl overflow-hidden;
    backdrop-filter: blur(20px);
}

.search-backdrop {
    @apply absolute inset-0 bg-gradient-to-r from-white/95 via-white/90 to-slate-50/80 border border-white/60;
}

.search-content {
    @apply relative z-10 p-6 flex flex-col sm:flex-row gap-4;
}

.search-input-container {
    @apply relative flex-1;
}

.search-icon {
    @apply absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400;
}

.search-input {
    @apply w-full pl-12 pr-4 py-3 bg-white/80 border border-slate-200/60 rounded-2xl;
    @apply focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400;
    @apply transition-all duration-300;
}

.status-filter {
    @apply px-4 py-3 bg-white/80 border border-slate-200/60 rounded-2xl;
    @apply focus:ring-2 focus:ring-blue-500 focus:border-transparent;
    @apply transition-all duration-300 text-slate-700;
}

/* Loading State */
.loading-container {
    @apply flex flex-col items-center justify-center py-12 space-y-4;
}

.loading-spinner {
    @apply w-8 h-8 border-4 border-slate-200 border-t-blue-500 rounded-full;
    animation: spin 1s linear infinite;
}

.loading-text {
    @apply text-slate-600 font-medium;
}

/* Empty State */
.empty-state {
    @apply relative rounded-3xl overflow-hidden;
    backdrop-filter: blur(20px);
}

.empty-backdrop {
    @apply absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-slate-50/80 border border-white/60;
}

.empty-content {
    @apply relative z-10 p-12 text-center;
}

.empty-icon {
    @apply w-16 h-16 mx-auto mb-4 text-slate-400;
}

.empty-icon svg {
    @apply w-full h-full;
}

.empty-title {
    @apply text-xl font-bold text-slate-700 mb-2;
}

.empty-description {
    @apply text-slate-500 mb-6;
}

.empty-action-btn {
    @apply px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl;
    @apply font-medium hover:shadow-lg hover:scale-105 transition-all duration-300;
}

/* Jobs Grid */
.jobs-grid {
    @apply grid grid-cols-1 lg:grid-cols-2 gap-6;
}

.job-card {
    @apply relative rounded-3xl overflow-hidden transition-all duration-300;
    @apply hover:scale-[1.02] hover:shadow-xl;
    backdrop-filter: blur(20px);
}

.job-backdrop {
    @apply absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-slate-50/80 border border-white/60;
}

.job-content {
    @apply relative z-10 p-6 space-y-4;
}

.job-header {
    @apply flex items-start justify-between;
}

.job-title-section {
    @apply flex-1 mr-4;
}

.job-title {
    @apply text-lg font-bold text-slate-900;
}

.job-company {
    @apply text-sm text-slate-600 font-medium;
}

.job-status {
    @apply px-3 py-1 rounded-full text-xs font-medium;
}

.status-active {
    @apply bg-green-100 text-green-700;
}

.status-paused {
    @apply bg-yellow-100 text-yellow-700;
}

.status-closed {
    @apply bg-red-100 text-red-700;
}

.job-details {
    @apply space-y-3;
}

.job-meta {
    @apply flex flex-wrap gap-4 text-sm text-slate-600;
}

.job-meta-item {
    @apply flex items-center space-x-1;
}

.meta-icon {
    @apply w-4 h-4;
}

.job-description {
    @apply text-sm text-slate-700 leading-relaxed;
}

.job-actions {
    @apply flex space-x-2 pt-4 border-t border-slate-200/60;
}

.job-action-btn {
    @apply flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-medium;
    @apply transition-all duration-300 hover:scale-105;
}

.action-icon {
    @apply w-4 h-4;
}

.view-btn {
    @apply bg-blue-100 text-blue-700 hover:bg-blue-200;
}

.edit-btn {
    @apply bg-orange-100 text-orange-700 hover:bg-orange-200;
}

.delete-btn {
    @apply bg-red-100 text-red-700 hover:bg-red-200;
}

/* Form Styles */
.form-container {
    @apply space-y-6;
}

.form-card {
    @apply relative rounded-3xl overflow-hidden;
    backdrop-filter: blur(20px);
}

.form-backdrop {
    @apply absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-slate-50/80 border border-white/60;
}

.form-content {
    @apply relative z-10 p-8;
}

.form-label {
    @apply block text-sm font-medium text-slate-700 mb-2;
}

.form-input {
    @apply w-full px-4 py-3 bg-white/80 border border-slate-200/60 rounded-2xl;
    @apply focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400;
    @apply transition-all duration-300;
}

.form-select {
    @apply w-full px-4 py-3 bg-white/80 border border-slate-200/60 rounded-2xl;
    @apply focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700;
    @apply transition-all duration-300;
}

.form-textarea {
    @apply w-full px-4 py-3 bg-white/80 border border-slate-200/60 rounded-2xl;
    @apply focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400;
    @apply resize-none transition-all duration-300;
}

.form-help {
    @apply text-xs text-slate-500 mt-2;
}

.form-actions {
    @apply flex justify-end space-x-4 pt-6 border-t border-slate-200/60;
}

.cancel-btn {
    @apply px-6 py-3 bg-slate-100 text-slate-700 rounded-2xl font-medium;
    @apply hover:bg-slate-200 transition-all duration-300;
}

.submit-btn {
    @apply px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl;
    @apply font-medium hover:shadow-lg hover:scale-105 focus:ring-2 focus:ring-blue-500;
    @apply focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed;
    @apply transition-all duration-300;
}

/* Modal Styles */
.modal-overlay {
    @apply fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4;
    backdrop-filter: blur(8px);
}

.modal-container {
    @apply relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl;
}

.modal-container.small {
    @apply max-w-md;
}

.modal-backdrop {
    @apply absolute inset-0 bg-white/95 border border-white/60;
    backdrop-filter: blur(20px);
}

.modal-content {
    @apply relative z-10 flex flex-col max-h-[90vh];
}

.modal-header {
    @apply flex items-center justify-between p-6 border-b border-slate-200/60;
}

.modal-title {
    @apply text-xl font-bold text-slate-900;
}

.modal-close {
    @apply p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100/70;
    @apply transition-all duration-300;
}

.modal-close svg {
    @apply w-5 h-5;
}

.modal-body {
    @apply p-6 overflow-y-auto flex-1;
}

/* Job Detail Styles */
.job-detail-header {
    @apply space-y-2 mb-6;
}

.detail-title {
    @apply text-2xl font-bold text-slate-900;
}

.detail-company {
    @apply text-lg text-slate-600 font-medium;
}

.detail-status {
    @apply inline-block px-3 py-1 rounded-full text-sm font-medium mt-2;
}

.job-detail-meta {
    @apply grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6;
}

.detail-meta-item {
    @apply flex flex-col space-y-1;
}

.meta-label {
    @apply text-sm font-medium text-slate-500;
}

.meta-value {
    @apply text-sm text-slate-900 font-medium;
}

.job-detail-description {
    @apply space-y-3;
}

.description-title {
    @apply text-lg font-bold text-slate-900;
}

.description-text {
    @apply text-slate-700 leading-relaxed whitespace-pre-line;
}

/* Delete Confirmation Styles */
.delete-confirm-btn {
    @apply px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl;
    @apply font-medium hover:shadow-lg hover:scale-105 focus:ring-2 focus:ring-red-500;
    @apply focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed;
    @apply transition-all duration-300;
}

/* Animations */
@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-6px); }
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 640px) {
    .dashboard-title {
        @apply text-xl;
    }
    
    .header-actions {
        @apply flex-wrap justify-center;
    }
    
    .jobs-grid {
        @apply grid-cols-1;
    }
    
    .job-meta {
        @apply flex-col space-y-2;
    }
    
    .form-actions {
        @apply flex-col space-y-3 space-x-0;
    }
}

/* Custom Scrollbar */
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

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
    .floating-orb,
    .loading-spinner {
        animation: none;
    }
    
    .job-card:hover {
        transform: none;
    }
    
    .action-btn:hover,
    .submit-btn:hover {
        transform: none;
    }
}
</style>