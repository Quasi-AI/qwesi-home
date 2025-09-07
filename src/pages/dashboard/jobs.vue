<!-- pages/dashboard/jobs.vue -->
<template>
  <div class="dashboard-container">
    <MessagePopup ref="alertRef" />

    <!-- Sidebar -->
    <Sidebar :user="user" />

    <!-- Main Content Area -->
    <div class="main-content">
      <!-- Ultra-Modern Header -->
      <div class="modern-header">
        <div class="header-backdrop"></div>
        <div class="header-content">
          <div class="header-info">
            <div class="welcome-section">
              <h1 class="dashboard-title">Job Opportunities</h1>
              <p class="welcome-message">
                Discover your next <span class="user-highlight">career opportunity</span>
              </p>
            </div>
            <!-- Floating decorative elements -->
            <div class="header-decorations">
              <div class="floating-orb orb-1"></div>
              <div class="floating-orb orb-2"></div>
              <div class="floating-orb orb-3"></div>
            </div>
          </div>
          
          <div class="header-actions">
            <!-- Search Input -->
            <div class="relative">
              <div class="absolute inset-0 bg-white/60 rounded-2xl backdrop-blur-xl border border-white/40"></div>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search jobs..."
                class="relative z-10 w-72 pl-12 pr-4 py-3 bg-transparent border-0 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:outline-none placeholder-slate-500 font-medium text-slate-700"
                @input="handleSearch"
              />
              <Search class="absolute left-4 top-3.5 h-5 w-5 text-slate-400 z-10" />
            </div>

            <!-- Filters Button -->
            <button
              @click="showFilters = !showFilters"
              class="action-btn tips-btn"
            >
              <div class="btn-bg"></div>
              <div class="btn-content">
                <Filter class="btn-icon" />
                <span>Filters</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Filters Panel -->
      <!-- Update the Filters Panel section -->

      <div v-if="showFilters" class="relative">
        <div class="absolute inset-0 bg-white/70 backdrop-blur-xl border-b border-slate-200/60"></div>
        <div class="relative z-10 px-6 py-6">
          <div class="grid grid-cols-1 md:grid-cols-5 gap-6"> <!-- Changed from 4 to 5 columns -->
            
            <!-- Country Filter - New -->
            <div class="filter-group">
              <label class="filter-label">Country</label>
              <div class="filter-select-wrapper">
                <select v-model="filters.country" @change="applyFilters" class="filter-select">
                  <option value="">All Countries</option>
                  <option v-for="country in uniqueCountries" :key="country" :value="country">
                    {{ country }}
                  </option>
                </select>
                <Globe class="filter-icon" />
              </div>
            </div>

            <!-- Location Filter -->
            <div class="filter-group">
              <label class="filter-label">Location</label>
              <div class="filter-select-wrapper">
                <select v-model="filters.location" @change="applyFilters" class="filter-select">
                  <option value="">All Locations</option>
                  <option v-for="location in uniqueLocations" :key="location" :value="location">
                    {{ location }}
                  </option>
                </select>
                <MapPin class="filter-icon" />
              </div>
            </div>

            <!-- Sector Filter -->
            <div class="filter-group">
              <label class="filter-label">Sector</label>
              <div class="filter-select-wrapper">
                <select v-model="filters.sector" @change="applyFilters" class="filter-select">
                  <option value="">All Sectors</option>
                  <option v-for="sector in uniqueSectors" :key="sector" :value="sector">
                    {{ sector }}
                  </option>
                </select>
                <Building class="filter-icon" />
              </div>
            </div>

            <!-- Experience Level Filter -->
            <div class="filter-group">
              <label class="filter-label">Experience Level</label>
              <div class="filter-select-wrapper">
                <select v-model="filters.experience_level" @change="applyFilters" class="filter-select">
                  <option value="">All Levels</option>
                  <option v-for="level in uniqueExperienceLevels" :key="level" :value="level">
                    {{ level }}
                  </option>
                </select>
                <Zap class="filter-icon" />
              </div>
            </div>

            <!-- Clear Filters -->
            <div class="flex items-end">
              <button
                @click="clearFilters"
                class="w-full px-6 py-3 text-sm font-medium text-slate-600 bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl hover:bg-slate-50/70 transition-all duration-300 hover:scale-105"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Bar -->
      <div class="relative">
        <div class="absolute inset-0 bg-white/50 backdrop-blur-xl border-b border-slate-200/40"></div>
        <div class="relative z-10 px-6 py-4">
          <div class="flex items-center justify-between text-sm">
            <div class="flex items-center space-x-6">
              <span class="font-bold text-slate-900">
                {{ filteredJobs.length }} job{{ filteredJobs.length !== 1 ? 's' : '' }} found
              </span>
              <div class="h-4 w-px bg-slate-300"></div>
              <div class="flex items-center space-x-2 text-slate-600">
                <Clock class="w-4 h-4" />
                <span>Updated {{ new Date().toLocaleDateString() }}</span>
              </div>
            </div>
            
            <div class="flex items-center space-x-4">
              <span class="font-medium text-slate-600">Sort by:</span>
              <div class="relative">
                <select 
                  v-model="sortBy" 
                  @change="applySorting" 
                  class="appearance-none bg-white/60 backdrop-blur-xl border border-white/40 rounded-xl px-4 py-2 text-sm font-medium text-slate-700 focus:ring-4 focus:ring-blue-500/20 focus:outline-none cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">Job Title A-Z</option>
                  <option value="company">Company A-Z</option>
                </select>
                <ChevronRight class="absolute right-2 top-2.5 w-4 h-4 text-slate-400 rotate-90 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Dashboard Content -->
      <div class="dashboard-main">
        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p class="loading-text">Discovering opportunities...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <div class="error-icon">
            <X class="w-8 h-8" />
          </div>
          <h3 class="text-lg font-bold text-red-700 mb-2">Error Loading Jobs</h3>
          <p class="error-message mb-4">{{ error }}</p>
          <button
            @click="fetchJobs"
            class="px-6 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all duration-300 font-medium"
          >
            Try Again
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredJobs.length === 0" class="text-center py-12">
          <div class="relative mx-auto w-24 h-24 mb-6">
            <div class="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl"></div>
            <div class="relative z-10 w-full h-full flex items-center justify-center">
              <Briefcase class="w-12 h-12 text-slate-400" />
            </div>
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-2">No Jobs Found</h3>
          <p class="text-slate-500 mb-6 max-w-md mx-auto">
            {{ searchQuery || Object.values(filters).some(f => f) ? 'Try adjusting your search criteria or filters to find more opportunities.' : 'No job listings available at the moment. Check back soon for new opportunities!' }}
          </p>
          <button
            v-if="searchQuery || Object.values(filters).some(f => f)"
            @click="clearAllFilters"
            class="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all duration-300 font-medium hover:scale-105"
          >
            Clear All Filters
          </button>
        </div>

        <!-- Jobs Grid -->
        <div v-else class="space-y-6">
          <!-- Applications Summary -->
          <div v-if="userApplications.length > 0" class="applications-summary">
            <div class="summary-card">
              <div class="summary-header">
                <Briefcase class="w-5 h-5 text-blue-600" />
                <span class="summary-title">Your Applications</span>
              </div>
              <div class="summary-stats">
                <div class="stat-item">
                  <span class="stat-number">{{ userApplications.length }}</span>
                  <span class="stat-label">Total Applied</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">{{ userApplications.filter(app => app.status === 'under_review').length }}</span>
                  <span class="stat-label">Under Review</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">{{ userApplications.filter(app => app.status === 'interview_scheduled').length }}</span>
                  <span class="stat-label">Interviews</span>
                </div>
              </div>
            </div>
          </div>

          <div class="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            <div
              v-for="job in paginatedJobs"
              :key="job._id"
              class="job-card group"
            >
              <!-- Card Background -->
              <div class="card-bg"></div>
              <div class="card-glow bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
              
              <!-- Job Card Content -->
              <div class="card-content">
                <!-- Job Header -->
                <div class="job-header">
                  <div class="job-main-info">
                    <h3 class="job-title">
                      {{ job.title || 'Untitled Position' }}
                    </h3>
                    <p class="company-name">{{ job.employer || 'Company Name' }}</p>
                  </div>
                  <div v-if="job.salary" class="salary-badge">
                    {{ job.salary }}
                  </div>
                </div>

                <!-- Job Details -->
                <div class="job-details">
                  <div v-if="job.location" class="detail-item">
                    <MapPin class="detail-icon" />
                    <span>{{ job.location }}</span>
                  </div>
                  <div v-if="job.location" class="detail-item">
                    <MapPin class="detail-icon" />
                    <span>{{ job.location }}</span>
                    <span v-if="extractCountryFromLocation(job.location)" class="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {{ extractCountryFromLocation(job.location) }}
                    </span>
                  </div>
                  <div v-if="job.sector" class="detail-item">
                    <Building class="detail-icon" />
                    <span>{{ job.sector }}</span>
                  </div>

                  <div v-if="job.experience_level" class="detail-item">
                    <Zap class="detail-icon" />
                    <span>{{ job.experience_level }}</span>
                  </div>

                  <div v-if="job.posted" class="detail-item text-slate-500">
                    <Clock class="detail-icon" />
                    <span>Posted {{ formatDate(job.posted) }}</span>
                  </div>
                </div>

                <!-- Job Description Preview -->
                <div v-if="job.job_description" class="job-description">
                  <p class="line-clamp-3">{{ job.job_description }}</p>
                </div>

                <!-- Tags -->
                <div class="job-tags">
                  <span v-if="job.field" class="tag tag-primary">
                    {{ job.field }}
                  </span>
                  <span v-if="job.experience_length" class="tag tag-secondary">
                    {{ job.experience_length }}
                  </span>
                </div>

                <!-- Card Footer -->
                <div class="job-footer">
                  <button
                    @click="openJobDetailsModal(job)"
                    class="view-details-btn"
                  >
                    <span>View Details</span>
                    <ArrowRight class="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                  
                  <div class="job-actions">
                    <button
                      @click="saveJob(job)"
                      :class="[
                        'save-btn',
                        savedJobs.includes(job._id) ? 'saved' : ''
                      ]"
                      :title="savedJobs.includes(job._id) ? 'Remove from saved' : 'Save job'"
                    >
                      <Heart :fill="savedJobs.includes(job._id) ? 'currentColor' : 'none'" class="w-4 h-4" />
                    </button>
                    
                    <!-- Updated Apply Button with Status Check -->
                    <button
                      @click="applyToJob(job)"
                      :class="getApplyButtonClass(job)"
                      :disabled="hasAppliedToJob(job._id)"
                      :title="hasAppliedToJob(job._id) ? 'You have already applied for this position' : 'Apply for this position'"
                    >
                      {{ getApplyButtonText(job) }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="filteredJobs.length > jobsPerPage" class="pagination-container">
            <div class="pagination-info">
              Showing {{ ((currentPage - 1) * jobsPerPage) + 1 }} to {{ Math.min(currentPage * jobsPerPage, filteredJobs.length) }} of {{ filteredJobs.length }} jobs
            </div>
            
            <div class="pagination-controls">
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="pagination-btn"
              >
                <ChevronLeft class="w-4 h-4" />
                <span>Previous</span>
              </button>
              
              <div class="pagination-numbers">
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="currentPage = page"
                  :class="[
                    'page-btn',
                    page === currentPage ? 'active' : ''
                  ]"
                >
                  {{ page }}
                </button>
              </div>
              
              <button
                @click="currentPage++"
                :disabled="currentPage === totalPages"
                class="pagination-btn"
              >
                <span>Next</span>
                <ChevronRight class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Job Application Modal -->
    <div v-if="showApplicationModal" class="application-modal-overlay" @click="closeApplicationModal">
      <div class="application-modal" @click.stop>
        <div class="modal-backdrop"></div>
        
        <!-- Modal Header -->
        <div class="modal-header">
          <div class="modal-title-section">
            <h3 class="modal-title">Apply for Position</h3>
            <p class="modal-company">{{ selectedJob?.title || 'Position' }} at {{ selectedJob?.employer || 'Company' }}</p>
            <div class="title-decoration"></div>
          </div>
          <button @click="closeApplicationModal" class="modal-close">
            <X class="w-6 h-6" />
          </button>
        </div>

        <!-- Modal Content -->
        <div class="modal-content">
          <div class="modal-scroll-area">
            <form @submit.prevent="submitApplication" class="space-y-6">
              
              <!-- Personal Information Section -->
              <div class="form-section">
                <h4 class="section-title">
                  <User class="w-5 h-5 text-blue-600" />
                  Personal Information
                </h4>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- First Name -->
                  <div class="form-group">
                    <label class="form-label">First Name *</label>
                    <input
                      v-model="applicationForm.applicantDetails.firstName"
                      type="text"
                      class="form-input"
                      :class="{ 'error': applicationErrors.firstName }"
                      placeholder="Enter your first name"
                    />
                    <span v-if="applicationErrors.firstName" class="error-message">
                      {{ applicationErrors.firstName }}
                    </span>
                  </div>

                  <!-- Last Name -->
                  <div class="form-group">
                    <label class="form-label">Last Name *</label>
                    <input
                      v-model="applicationForm.applicantDetails.lastName"
                      type="text"
                      class="form-input"
                      :class="{ 'error': applicationErrors.lastName }"
                      placeholder="Enter your last name"
                    />
                    <span v-if="applicationErrors.lastName" class="error-message">
                      {{ applicationErrors.lastName }}
                    </span>
                  </div>

                  <!-- Email -->
                  <div class="form-group">
                    <label class="form-label">Email Address *</label>
                    <input
                      v-model="applicationForm.applicantDetails.email"
                      type="email"
                      class="form-input"
                      :class="{ 'error': applicationErrors.email }"
                      placeholder="Enter your email"
                    />
                    <span v-if="applicationErrors.email" class="error-message">
                      {{ applicationErrors.email }}
                    </span>
                  </div>

                  <!-- Phone -->
                  <div class="form-group">
                    <label class="form-label">Phone Number *</label>
                    <input
                      v-model="applicationForm.applicantDetails.phone"
                      type="tel"
                      class="form-input"
                      :class="{ 'error': applicationErrors.phone }"
                      placeholder="Enter your phone number"
                    />
                    <span v-if="applicationErrors.phone" class="error-message">
                      {{ applicationErrors.phone }}
                    </span>
                  </div>
                </div>

                <div class="grid grid-cols-1 gap-4 mt-4">
                  <!-- Address -->
                  <div class="form-group">
                    <label class="form-label">Address</label>
                    <input
                      v-model="applicationForm.applicantDetails.address"
                      type="text"
                      class="form-input"
                      placeholder="Enter your address (optional)"
                    />
                  </div>

                  <!-- LinkedIn -->
                  <div class="form-group">
                    <label class="form-label">LinkedIn Profile</label>
                    <input
                      v-model="applicationForm.applicantDetails.linkedin"
                      type="url"
                      class="form-input"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>

                  <!-- Portfolio -->
                  <div class="form-group">
                    <label class="form-label">Portfolio Website</label>
                    <input
                      v-model="applicationForm.applicantDetails.portfolio"
                      type="url"
                      class="form-input"
                      placeholder="https://yourportfolio.com"
                    />
                  </div>
                </div>
              </div>

              <!-- Resume Upload Section -->
              <div class="form-section">
                <h4 class="section-title">
                  <FileText class="w-5 h-5 text-blue-600" />
                  Resume/CV
                </h4>
                
                <div class="form-group">
                  <label class="form-label">Upload Resume *</label>
                  <div class="file-upload-area">
                    <input
                      type="file"
                      id="resume-upload"
                      accept=".pdf,.doc,.docx"
                      @change="handleFileUpload"
                      class="hidden"
                    />
                    <label for="resume-upload" class="file-upload-label">
                      <Upload class="w-8 h-8 text-slate-400 mb-2" />
                      <span class="block text-sm font-medium text-slate-700 mb-1">
                        {{ resumeFile?.name || 'Click to upload resume' }}
                      </span>
                      <span class="text-xs text-slate-500">
                        PDF, DOC, or DOCX (Max 5MB)
                      </span>
                    </label>
                  </div>
                  <span v-if="applicationErrors.resume" class="error-message">
                    {{ applicationErrors.resume }}
                  </span>
                </div>
              </div>

              <!-- Skills Section -->
              <div class="form-section">
                <h4 class="section-title">
                  <Zap class="w-5 h-5 text-blue-600" />
                  Skills
                </h4>
                
                <div class="form-group">
                  <label class="form-label">Add Skills</label>
                  <div class="flex space-x-2">
                    <input
                      v-model="newSkill"
                      type="text"
                      class="form-input flex-1"
                      placeholder="Enter a skill"
                      @keypress.enter.prevent="addSkill"
                    />
                    <button
                      type="button"
                      @click="addSkill"
                      class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus class="w-4 h-4" />
                    </button>
                  </div>
                  
                  <!-- Skills Tags -->
                  <div v-if="applicationForm.skills.length > 0" class="flex flex-wrap gap-2 mt-3">
                    <span
                      v-for="(skill, index) in applicationForm.skills"
                      :key="index"
                      class="skill-tag"
                    >
                      {{ skill }}
                      <button
                        type="button"
                        @click="removeSkill(index)"
                        class="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X class="w-3 h-3" />
                      </button>
                    </span>
                  </div>
                </div>
              </div>

              <!-- Experience Section -->
              <div class="form-section">
                <h4 class="section-title">
                  <Briefcase class="w-5 h-5 text-blue-600" />
                  Experience
                </h4>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="form-group">
                    <label class="form-label">Years of Experience</label>
                    <input
                      v-model.number="applicationForm.experience.years"
                      type="number"
                      min="0"
                      max="50"
                      class="form-input"
                      placeholder="0"
                    />
                  </div>
                </div>
                
                <div class="form-group mt-4">
                  <label class="form-label">Experience Summary</label>
                  <textarea
                    v-model="applicationForm.experience.description"
                    rows="4"
                    class="form-input"
                    placeholder="Briefly describe your relevant experience..."
                  ></textarea>
                </div>
              </div>

              <!-- Cover Letter Section -->
              <div class="form-section">
                <h4 class="section-title">
                  <MessageSquare class="w-5 h-5 text-blue-600" />
                  Cover Letter
                </h4>
                
                <div class="form-group">
                  <label class="form-label">Cover Letter (Optional)</label>
                  <textarea
                    v-model="applicationForm.coverLetter"
                    rows="6"
                    class="form-input"
                    placeholder="Write a personalized cover letter for this position..."
                    maxlength="5000"
                  ></textarea>
                  <div class="text-xs text-slate-500 mt-1 text-right">
                    {{ applicationForm.coverLetter.length }}/5000 characters
                  </div>
                </div>
              </div>

              <!-- Form Actions -->
              <div class="form-actions">
                <button
                  type="button"
                  @click="closeApplicationModal"
                  class="btn-secondary"
                  :disabled="applicationLoading"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  class="btn-primary"
                  :disabled="applicationLoading"
                >
                  <div v-if="applicationLoading" class="flex items-center space-x-2">
                    <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </div>
                  <div v-else class="flex items-center space-x-2">
                    <Send class="w-4 h-4" />
                    <span>Submit Application</span>
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Job Details Modal -->
    <div v-if="viewingJob" class="job-details-modal-overlay" @click="closeJobDetailsModal">
      <div class="job-details-modal" @click.stop>
        <div class="modal-backdrop"></div>
        
        <!-- Modal Header -->
        <div class="modal-header">
          <div class="modal-title-section">
            <h3 class="modal-title">{{ viewingJob.title || 'Job Details' }}</h3>
            <p class="modal-company">{{ viewingJob.employer || 'Company' }}</p>
            <div class="title-decoration"></div>
          </div>
          <button @click="closeJobDetailsModal" class="modal-close">
            <X class="w-6 h-6" />
          </button>
        </div>

        <!-- Modal Content -->
        <div class="modal-content">
          <div class="modal-scroll-area">
            <!-- Job Information -->
            <div class="job-details-content space-y-6">
              
              <!-- Basic Info -->
              <div class="details-section">
                <h4 class="section-title">Job Information</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-if="viewingJob.location" class="info-item">
                    <MapPin class="info-icon" />
                    <span class="info-label">Location:</span>
                    <span class="info-value">{{ viewingJob.location }}</span>
                  </div>
                  <div v-if="viewingJob.sector" class="info-item">
                    <Building class="info-icon" />
                    <span class="info-label">Sector:</span>
                    <span class="info-value">{{ viewingJob.sector }}</span>
                  </div>
                  <div v-if="viewingJob.experience_level" class="info-item">
                    <Zap class="info-icon" />
                    <span class="info-label">Experience Level:</span>
                    <span class="info-value">{{ viewingJob.experience_level }}</span>
                  </div>
                  <div v-if="viewingJob.salary" class="info-item">
                    <span class="info-icon">💰</span>
                    <span class="info-label">Salary:</span>
                    <span class="info-value">{{ viewingJob.salary }}</span>
                  </div>
                </div>
              </div>

              <!-- Job Description -->
              <div v-if="viewingJob.job_description" class="details-section">
                <h4 class="section-title">Job Description</h4>
                <div class="description-content">
                  <p class="whitespace-pre-line">{{ viewingJob.job_description }}</p>
                </div>
              </div>

              <!-- Additional Details -->
              <div class="details-section">
                <h4 class="section-title">Additional Information</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-if="viewingJob.field" class="info-item">
                    <span class="info-label">Field:</span>
                    <span class="info-value">{{ viewingJob.field }}</span>
                  </div>
                  <div v-if="viewingJob.experience_length" class="info-item">
                    <span class="info-label">Experience Required:</span>
                    <span class="info-value">{{ viewingJob.experience_length }}</span>
                  </div>
                  <div v-if="viewingJob.posted" class="info-item">
                    <Clock class="info-icon" />
                    <span class="info-label">Posted:</span>
                    <span class="info-value">{{ formatDate(viewingJob.posted) }}</span>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="details-actions">
                <button
                  @click="closeJobDetailsModal"
                  class="btn-secondary"
                >
                  Close
                </button>
                <button
                  @click="applyToJob(viewingJob)"
                  :class="getApplyButtonClass(viewingJob)"
                  :disabled="hasAppliedToJob(viewingJob._id)"
                >
                  {{ getApplyButtonText(viewingJob) }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import { useApplications } from '@/shared/composables/useApplications'
import MessagePopup from '~/shared/components/message/MessagePopup.vue'
import Sidebar from '@/features/dashboard/components/dashboard-sidebar.vue'
import { API_ROUTES } from '@/shared/constants/api-routes'

// Import icons
import {
  Search,
  Filter,
  MapPin,
  Building,
  Zap,
  Clock,
  ChevronRight,
  ChevronLeft,
  X,
  Briefcase,
  ArrowRight,
  Heart,
  User,
  FileText,
  Upload,
  Plus,
  MessageSquare,
  Send,
  Globe
} from 'lucide-vue-next'

// Page metadata
definePageMeta({
  layout: 'dashboard'
})

// Type definitions
// Update your Job interface to include country
interface Job {
  _id: string;
  title?: string;
  employer?: string;
  location?: string;
  country?: string;  // Add this field
  sector?: string;
  experience_level?: string;
  salary?: string;
  job_description?: string;
  field?: string;
  experience_length?: string;
  posted?: string;
  created_at?: string;
}

// Update your filters object
const filters = ref({
  location: '',
  country: '',     // Add this
  sector: '',
  experience_level: ''
})

interface Application {
  _id: string;
  jobId: string;
  status: string;
}

interface ApplicationFormData {
  jobId: string;
  applicantDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    linkedin: string;
    portfolio: string;
  };
  coverLetter: string;
  skills: string[];
  experience: {
    years: number;
    description: string;
  };
}

// Composables and stores
const authStore = useAuthStore()
const applicationsComposable = useApplications()

// Refs
const alertRef = ref<InstanceType<typeof MessagePopup> | null>(null)

// User data
const user = computed(() => authStore.getUser)

// State management
const loading = ref<boolean>(true)
const error = ref<string | null>(null)
const jobs = ref<Job[]>([])
const selectedJob = ref<Job | null>(null)
const viewingJob = ref<Job | null>(null)
const searchQuery = ref<string>('')
const showFilters = ref<boolean>(false)
const currentPage = ref<number>(1)
const jobsPerPage = ref<number>(12)
const sortBy = ref<string>('newest')
const savedJobs = ref<string[]>([])

// Application form data
const showApplicationModal = ref<boolean>(false)
const applicationLoading = ref<boolean>(false)
const applicationForm = ref<ApplicationFormData>({
  jobId: '',
  applicantDetails: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    portfolio: ''
  },
  coverLetter: '',
  skills: [],
  experience: {
    years: 0,
    description: ''
  }
})
const resumeFile = ref<File | null>(null)
const newSkill = ref<string>('')
const applicationErrors = ref<Record<string, string>>({})

// User applications tracking
const userApplications = ref<Application[]>([])
const applicationsLoading = ref<boolean>(false)


// Computed properties
const uniqueLocations = computed((): string[] => {
  const locations = jobs.value.map(job => job.location).filter(Boolean) as string[]
  return [...new Set(locations)].sort()
})

const uniqueSectors = computed((): string[] => {
  const sectors = jobs.value.map(job => job.sector).filter(Boolean) as string[]
  return [...new Set(sectors)].sort()
})

const uniqueExperienceLevels = computed((): string[] => {
  const levels = jobs.value.map(job => job.experience_level).filter(Boolean) as string[]
  return [...new Set(levels)].sort()
})

const filteredJobs = computed((): Job[] => {
  let filtered = jobs.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(job =>
      (job.title?.toLowerCase() || '').includes(query) ||
      (job.employer?.toLowerCase() || '').includes(query) ||
      (job.job_description?.toLowerCase() || '').includes(query) ||
      (job.location?.toLowerCase() || '').includes(query) ||
      (job.sector?.toLowerCase() || '').includes(query)
    )
  }

  // Add country filtering
  if (filters.value.country) {
    filtered = filtered.filter(job => {
      const jobCountry = extractCountryFromLocation(job.location || '')
      return jobCountry === filters.value.country
    })
  }

  if (filters.value.location) {
    filtered = filtered.filter(job => job.location === filters.value.location)
  }
  if (filters.value.sector) {
    filtered = filtered.filter(job => job.sector === filters.value.sector)
  }
  if (filters.value.experience_level) {
    filtered = filtered.filter(job => job.experience_level === filters.value.experience_level)
  }

  // Rest of your sorting logic...
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'newest':
        return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
      case 'oldest':
        return new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime()
      case 'title':
        return (a.title || '').localeCompare(b.title || '')
      case 'company':
        return (a.employer || '').localeCompare(b.employer || '')
      default:
        return 0
    }
  })

  return filtered
})

const totalPages = computed((): number => {
  return Math.max(1, Math.ceil(filteredJobs.value.length / jobsPerPage.value))
})

const paginatedJobs = computed((): Job[] => {
  const start = (currentPage.value - 1) * jobsPerPage.value
  const end = start + jobsPerPage.value
  return filteredJobs.value.slice(start, end)
})

const visiblePages = computed((): number[] => {
  const pages: number[] = []
  const maxVisible = 5
  let startPage = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let endPage = Math.min(totalPages.value, startPage + maxVisible - 1)

  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return pages
})

const uniqueCountries = computed((): string[] => {
  const countries = jobs.value
    .map(job => extractCountryFromLocation(job.location || ''))
    .filter(Boolean) as string[]
  return [...new Set(countries)].sort()
})

// Helper function to extract country from location string
const extractCountryFromLocation = (location: string): string => {
  if (!location) return ''
  
  // Common country patterns in job locations
  const countryPatterns = [
    // African Countries
    'Ghana', 'Nigeria', 'Kenya', 'South Africa', 'Egypt', 'Morocco', 'Tunisia',
    'Ethiopia', 'Uganda', 'Tanzania', 'Rwanda', 'Botswana', 'Zambia', 'Zimbabwe',
    'Senegal', 'Mali', 'Burkina Faso', 'Ivory Coast', 'Cameroon', 'Algeria',
    
    // European Countries
    'United Kingdom', 'UK', 'Germany', 'France', 'Spain', 'Italy', 'Netherlands',
    'Switzerland', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Belgium', 'Austria',
    'Portugal', 'Ireland', 'Poland', 'Czech Republic', 'Hungary', 'Romania',
    
    // North American Countries
    'United States', 'USA', 'US', 'Canada', 'Mexico',
    
    // Asian Countries
    'India', 'China', 'Japan', 'Singapore', 'Malaysia', 'Thailand', 'Vietnam',
    'Philippines', 'Indonesia', 'South Korea', 'Hong Kong', 'Taiwan', 'UAE',
    'Saudi Arabia', 'Qatar', 'Kuwait', 'Israel', 'Turkey',
    
    // Oceania
    'Australia', 'New Zealand',
    
    // South American Countries
    'Brazil', 'Argentina', 'Chile', 'Colombia', 'Peru', 'Venezuela', 'Uruguay',
    
    // Other patterns
    'Remote', 'Worldwide', 'Global'
  ]
  
  // Check for exact country matches (case insensitive)
  for (const country of countryPatterns) {
    if (location.toLowerCase().includes(country.toLowerCase())) {
      // Normalize some common variations
      if (country.toLowerCase() === 'uk') return 'United Kingdom'
      if (country.toLowerCase() === 'usa' || country.toLowerCase() === 'us') return 'United States'
      return country
    }
  }
  
  // If no country found, try to extract from common location formats
  // Format: "City, Country" or "City, State, Country"
  const parts = location.split(',').map(part => part.trim())
  if (parts.length >= 2) {
    const lastPart = parts[parts.length - 1]
    // Check if the last part matches any known country
    for (const country of countryPatterns) {
      if (lastPart.toLowerCase() === country.toLowerCase()) {
        return country
      }
    }
    return lastPart // Return the last part as potential country
  }
  
  return '' // No country identified
}

// Modal Management Methods
const openJobDetailsModal = (job: Job): void => {
  showApplicationModal.value = false
  selectedJob.value = null
  viewingJob.value = job
}

const closeJobDetailsModal = (): void => {
  viewingJob.value = null
}

const openApplicationModal = (job: Job): void => {
  viewingJob.value = null
  selectedJob.value = job
  applicationForm.value.jobId = job._id
  
  if (user.value) {
    const nameParts = (user.value.name || '').split(' ')
    applicationForm.value.applicantDetails.firstName = nameParts[0] || ''
    applicationForm.value.applicantDetails.lastName = nameParts.slice(1).join(' ') || ''
    applicationForm.value.applicantDetails.email = user.value.email || ''
  }
  
  nextTick(() => {
    showApplicationModal.value = true
  })
}

// Application Methods
const applyToJob = (job: Job): void => {
  const existingApplication = userApplications.value.find(
    (app: Application) => app.jobId === job._id && app.status !== 'withdrawn'
  )
  
  if (existingApplication) {
    alertRef.value?.error('You have already applied for this position', {
      title: 'Already Applied',
      duration: 3000
    })
    return
  }

  openApplicationModal(job)
}

const submitApplication = async (): Promise<void> => {
  const validation = applicationsComposable.validateApplicationForm(applicationForm.value, resumeFile.value || undefined)
  
  if (!validation.isValid) {
    applicationErrors.value = validation.errors
    alertRef.value?.error('Please correct the errors in the form', {
      title: 'Validation Error',
      duration: 4000
    })
    return
  }

  applicationLoading.value = true
  applicationErrors.value = {}

  try {
    const formData = applicationsComposable.formatApplicationData(
      applicationForm.value, 
      resumeFile.value || undefined
    )

    const response = await applicationsComposable.submitApplication(formData)

    if (response.success) {
      alertRef.value?.success('Application submitted successfully! We will review your submission and get back to you within 5-7 business days.', {
        title: 'Application Submitted!',
        duration: 5000
      })
      
      closeApplicationModal()
      await fetchUserApplications()
    }

  } catch (error: any) {
    console.error('Error submitting application:', error)
    
    let errorMessage = 'Failed to submit application. Please try again.'
    let errorTitle = 'Submission Failed'
    
    if (error.status === 409) {
      errorMessage = 'You have already applied for this position this year.'
      errorTitle = 'Duplicate Application'
    } else if (error.data?.errors) {
      error.data.errors.forEach((err: any) => {
        applicationErrors.value[err.field] = err.message
      })
      errorMessage = 'Please correct the errors and try again'
      errorTitle = 'Validation Error'
    } else if (error.data?.message) {
      errorMessage = error.data.message
    }
    
    alertRef.value?.error(errorMessage, {
      title: errorTitle,
      duration: 6000
    })
  } finally {
    applicationLoading.value = false
  }
}

const fetchUserApplications = async (): Promise<void> => {
  if (!authStore.isAuthenticated || !user.value?.id) {
    alertRef.value?.error('Please log in to access this page', {
      title: 'Authentication Required',
      duration: 0
    })
    await navigateTo('/auth/login')
    return
  }

  applicationsLoading.value = true
  try {
    const response = await applicationsComposable.getUserApplications(user.value?.id, {
      page: 1,
      limit: 100,
      sortBy: 'submittedAt',
      sortOrder: 'desc'
    })

    if (response.success) {
      userApplications.value = response.data || []
    }
  } catch (error: any) {
    console.error('Error fetching applications:', error)
    alertRef.value?.error('Failed to load your applications', {
      title: 'Loading Error',
      duration: 4000
    })
  } finally {
    applicationsLoading.value = false
  }
}

// Form validation and utility methods
const handleFileUpload = (event: Event): void => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    resumeFile.value = file
    applicationErrors.value.resume = ''
  }
}

const addSkill = (): void => {
  if (newSkill.value.trim() && !applicationForm.value.skills.includes(newSkill.value.trim())) {
    applicationForm.value.skills.push(newSkill.value.trim())
    newSkill.value = ''
  }
}

const removeSkill = (index: number): void => {
  applicationForm.value.skills.splice(index, 1)
}

const resetApplicationForm = (): void => {
  applicationForm.value = {
    jobId: '',
    applicantDetails: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      linkedin: '',
      portfolio: ''
    },
    coverLetter: '',
    skills: [],
    experience: {
      years: 0,
      description: ''
    }
  }
  resumeFile.value = null
  newSkill.value = ''
  applicationErrors.value = {}
}

const closeApplicationModal = (): void => {
  showApplicationModal.value = false
  selectedJob.value = null
  resetApplicationForm()
}

const hasAppliedToJob = (jobId: string): boolean => {
  return userApplications.value.some(
    (app: Application) => app.jobId === jobId && app.status !== 'withdrawn'
  )
}

const getApplyButtonText = (job: Job): string => {
  if (hasAppliedToJob(job._id)) {
    const application = userApplications.value.find((app: Application) => app.jobId === job._id)
    return `Applied (${applicationsComposable.getStatusText(application?.status || 'submitted')})`
  }
  return 'Apply Now'
}

const getApplyButtonClass = (job: Job): string => {
  if (hasAppliedToJob(job._id)) {
    return 'applied-btn'
  }
  return 'apply-btn'
}

// Jobs fetching method
const fetchJobs = async (): Promise<void> => {
  loading.value = true
  error.value = null
  
  try {
    const queryParams = new URLSearchParams()
    
    if (searchQuery.value) queryParams.append('search', searchQuery.value)
    if (filters.value.country) queryParams.append('country', filters.value.country)  // Add this
    if (filters.value.location) queryParams.append('location', filters.value.location)
    if (filters.value.sector) queryParams.append('sector', filters.value.sector)
    if (filters.value.experience_level) queryParams.append('experience_level', filters.value.experience_level)
    if (sortBy.value) queryParams.append('sort', sortBy.value)
    if (currentPage.value) queryParams.append('page', currentPage.value.toString())
    queryParams.append('limit', jobsPerPage.value.toString())

    const queryString = queryParams.toString()
    const url = `${API_ROUTES.BASE_URL}getjobs${queryString ? '?' + queryString : ''}`
    
    const response = await $fetch<any>(url)
    
    if (response.success) {
      jobs.value = response.data || []
    } else {
      throw new Error('Failed to fetch jobs')
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to fetch jobs'
    console.error('Error fetching jobs:', err)
    
    alertRef.value?.error('Failed to load job opportunities', {
      title: 'Loading Error',
      duration: 4000
    })
  } finally {
    loading.value = false
  }
}

const handleSearch = (): void => {
  currentPage.value = 1
  fetchJobs()
}

const applyFilters = (): void => {
  currentPage.value = 1
  fetchJobs()
}

const applySorting = (): void => {
  currentPage.value = 1
  fetchJobs()
}

const clearFilters = (): void => {
  filters.value = {
    location: '',
    country: '',    // Add this
    sector: '',
    experience_level: ''
  }
  currentPage.value = 1
  fetchJobs()
}

const clearAllFilters = (): void => {
  searchQuery.value = ''
  clearFilters()
}

const saveJob = (job: Job): void => {
  const index = savedJobs.value.indexOf(job._id)
  if (index > -1) {
    savedJobs.value.splice(index, 1)
    alertRef.value?.success('Job removed from saved', {
      title: 'Removed',
      duration: 2000
    })
  } else {
    savedJobs.value.push(job._id)
    alertRef.value?.success('Job saved successfully', {
      title: 'Saved',
      duration: 2000
    })
  }
}

const formatDate = (dateString: string): string => {
  if (!dateString) return ''
  
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`
    
    return date.toLocaleDateString()
  } catch {
    return dateString
  }
}

// Lifecycle
onMounted(async (): Promise<void> => {
  if (!authStore.isAuthenticated || !user.value?.id) {
    alertRef.value?.error('Please log in to access this page', {
      title: 'Authentication Required',
      duration: 0
    })
    await navigateTo('/auth/login')
    return
  }

  await Promise.all([
    fetchJobs(),
    fetchUserApplications()
  ])
})

// Watchers
watch(() => filteredJobs.value.length, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = Math.max(1, totalPages.value)
  }
})
</script>

<style scoped>
/* Base Layout - Inherit from dashboard */
.dashboard-container {
    @apply min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex;
    position: relative;
    overflow-x: hidden;
    height: 100vh;
}

.applied-btn {
  @apply px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-bold rounded-xl cursor-default shadow-lg shadow-green-500/25;
}

.main-content {
    @apply flex-1 flex flex-col;
    min-width: 0;
    height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
}

.main-content-adjusted {
    margin-left: 320px;
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
    @apply relative z-10 px-6 py-6 flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0;
}

.header-info {
    @apply relative;
}

.welcome-section {
    @apply text-center lg:text-left;
}

.dashboard-title {
    @apply text-3xl font-black bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent;
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

.header-actions {
    @apply flex items-center space-x-4;
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

.btn-content {
    @apply relative z-10 flex items-center space-x-2;
}

.btn-icon {
    @apply w-4 h-4;
}

.tips-btn {
    @apply text-slate-700 hover:text-slate-900
}

/* Filter Styles */
.filter-group {
@apply space-y-2;
}

.filter-label {
@apply block text-sm font-bold text-slate-700;
}

.filter-select-wrapper {
@apply relative;
}

.filter-select {
@apply w-full appearance-none bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl px-4 py-3 pl-12 text-sm font-medium text-slate-700 focus:ring-4 focus:ring-blue-500/20 focus:outline-none cursor-pointer transition-all duration-300;
}

.filter-icon {
@apply absolute left-4 top-3.5 w-4 h-4 text-slate-400 pointer-events-none;
}

/* Main Dashboard Content */
.dashboard-main {
@apply flex-1 p-6 flex flex-col space-y-8;
min-height: 0;
overflow-y: auto;
padding-bottom: 2rem;
}

/* Job Cards */
.job-card {
@apply relative rounded-3xl transition-all duration-500 cursor-pointer;
@apply hover:-translate-y-2 hover:scale-[1.02];
backdrop-filter: blur(20px);
}

.card-bg {
@apply absolute inset-0 rounded-3xl bg-white/70 border border-white/60;
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
}

.card-glow {
@apply absolute -inset-px rounded-3xl opacity-0 transition-all duration-500;
filter: blur(12px);
}

.job-card:hover .card-glow {
@apply opacity-100;
}

.card-content {
@apply relative z-10 p-6 space-y-6;
}

.job-header {
@apply flex items-start justify-between;
}

.job-main-info {
@apply flex-1 min-w-0;
}

.job-title {
@apply text-lg font-bold text-slate-900 mb-1 line-clamp-2;
}

.company-name {
@apply text-blue-600 font-semibold;
}

.salary-badge {
@apply inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25;
}

.job-details {
@apply space-y-2;
}

.detail-item {
@apply flex items-center text-sm text-slate-600;
}

.detail-icon {
@apply w-4 h-4 mr-3 flex-shrink-0;
}

.job-description {
@apply text-sm text-slate-600 leading-relaxed;
}

.job-tags {
@apply flex flex-wrap gap-2;
}

.tag {
@apply inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium;
}

.tag-primary {
@apply bg-blue-100 text-blue-700;
}

.tag-secondary {
@apply bg-slate-100 text-slate-700;
}

.job-footer {
@apply flex items-center justify-between;
}

.view-details-btn {
@apply flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-all duration-200 space-x-2;
}

.job-actions {
@apply flex items-center space-x-3;
}

.save-btn {
@apply p-2 rounded-full transition-all duration-300 text-slate-400 hover:text-red-500;
}

.save-btn.saved {
@apply text-red-500;
}

.apply-btn {
@apply px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:scale-105;
}

/* Enhanced Modal Styles to Prevent Conflicts */

/* Base modal overlay - ensure consistent z-index */
.modal-overlay {
  @apply fixed inset-0 bg-black/60 flex items-center justify-center p-4;
  backdrop-filter: blur(8px);
}

/* Job Details Modal - lower priority */
.job-details-modal-overlay {
  @apply fixed inset-0 bg-black/60 flex items-center justify-center p-4;
  backdrop-filter: blur(8px);
  z-index: 1000;
  animation: modalFadeIn 0.2s ease-out;
}

/* Application Modal - higher priority (appears on top) */
.application-modal-overlay {
  @apply fixed inset-0 bg-black/60 flex items-center justify-center p-4;
  backdrop-filter: blur(8px);
  z-index: 1010;
  animation: modalFadeIn 0.2s ease-out;
}

.application-modal {
  @apply relative bg-white/95 rounded-3xl max-w-5xl w-full max-h-[95vh] overflow-hidden;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: modalSlideIn 0.3s ease-out;
}

.job-details-modal {
  @apply relative bg-white/95 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: modalSlideIn 0.3s ease-out;
}

.modal-backdrop {
@apply absolute inset-0 bg-white/80 backdrop-blur-xl;
}

.modal-header {
@apply relative z-10 flex items-center justify-between p-8 border-b border-slate-200/60;
}

.modal-title-section {
@apply space-y-2;
}

.modal-title {
@apply text-2xl font-black text-slate-900;
}

.modal-company {
@apply text-lg font-semibold text-blue-600;
}

.title-decoration {
@apply w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full;
}

.modal-close {
@apply p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100/70 transition-all duration-200;
}

.modal-content {
@apply relative z-10 flex-1 overflow-hidden;
}

.modal-scroll-area {
@apply h-96 overflow-y-auto p-8 space-y-8;
scrollbar-width: thin;
scrollbar-color: rgba(148, 163, 184, 0.3) transparent;
}

.modal-scroll-area::-webkit-scrollbar {
width: 6px;
}

.modal-scroll-area::-webkit-scrollbar-track {
background: transparent;
}

.modal-scroll-area::-webkit-scrollbar-thumb {
background: linear-gradient(to bottom, rgba(148, 163, 184, 0.3), rgba(148, 163, 184, 0.5));
border-radius: 3px;
}

/* Form Styles */
.form-section {
@apply p-6 bg-slate-50/50 rounded-2xl border border-slate-200/60 space-y-4;
backdrop-filter: blur(10px);
}

.section-title {
@apply flex items-center space-x-3 text-lg font-bold text-slate-900 pb-4 border-b border-slate-200/60;
}

.form-group {
@apply space-y-2;
}

.form-label {
@apply block text-sm font-semibold text-slate-700;
}

.form-input {
@apply w-full px-4 py-3 bg-white/70 border border-slate-300/60 rounded-xl text-slate-900 placeholder-slate-500 backdrop-blur-xl transition-all duration-200;
@apply focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500;
}

.form-input.error {
@apply border-red-500 focus:ring-red-500/20 focus:border-red-500;
}

.error-message {
@apply text-xs font-medium text-red-600;
}

/* File Upload Styles */
.file-upload-area {
@apply border-2 border-dashed border-slate-300 rounded-xl p-6 text-center transition-colors;
@apply hover:border-blue-400 hover:bg-blue-50/50;
}

.file-upload-label {
@apply cursor-pointer flex flex-col items-center justify-center;
}

/* Skills Styles */
.skill-tag {
@apply inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full;
@apply border border-blue-200;
}

/* Form Actions */
.form-actions {
@apply flex items-center justify-end space-x-4 pt-6 border-t border-slate-200/60;
}

.btn-primary {
@apply flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-2xl;
@apply hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500/20;
@apply disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105;
}

.btn-secondary {
@apply px-8 py-3 bg-white/70 text-slate-700 font-bold rounded-2xl border border-slate-300/60 backdrop-blur-xl;
@apply hover:bg-slate-50/70 focus:outline-none focus:ring-4 focus:ring-slate-500/20;
@apply disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300;
}

/* Applications summary styles */
.applications-summary {
@apply mb-6;
}

.summary-card {
@apply bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/40;
}

.summary-header {
@apply flex items-center space-x-3 mb-4;
}

.summary-title {
@apply text-lg font-bold text-slate-900;
}

.summary-stats {
@apply grid grid-cols-3 gap-4;
}

.stat-item {
@apply text-center;
}

.stat-number {
@apply block text-2xl font-black text-blue-600;
}

.stat-label {
@apply block text-xs font-medium text-slate-600 mt-1;
}

/* Job Details Modal Styles */
.job-details-content {
  @apply space-y-6;
}

.details-section {
  @apply p-6 bg-slate-50/50 rounded-2xl border border-slate-200/60;
  backdrop-filter: blur(10px);
}

.info-item {
  @apply flex items-center space-x-3 text-sm;
}

.info-icon {
  @apply w-4 h-4 text-slate-500 flex-shrink-0;
}

.info-label {
  @apply font-semibold text-slate-700 min-w-0;
}

.info-value {
  @apply text-slate-600 flex-1;
}

.description-content {
  @apply text-slate-700 leading-relaxed text-sm space-y-3;
}

.description-content p {
  @apply mb-3;
}

.description-content ul, .description-content ol {
  @apply ml-4 space-y-1;
}

.description-content ul {
  @apply list-disc;
}

.description-content ol {
  @apply list-decimal;
}

.details-actions {
  @apply flex items-center justify-end space-x-4 pt-6 border-t border-slate-200/60;
}

/* Pagination */
.pagination-container {
@apply flex items-center justify-between mt-8 p-6 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/40;
}

.pagination-info {
@apply text-sm font-medium text-slate-600;
}

.pagination-controls {
@apply flex items-center space-x-2;
}

.pagination-btn {
@apply flex items-center space-x-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white/60 border border-white/40 rounded-xl hover:bg-slate-50/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 backdrop-blur-xl;
}

.pagination-numbers {
@apply flex items-center space-x-1;
}

.page-btn {
@apply px-3 py-2 text-sm font-bold rounded-xl transition-all duration-300 backdrop-blur-xl;
}

.page-btn:not(.active) {
@apply text-slate-600 bg-white/60 border border-white/40 hover:bg-slate-50/70;
}

.page-btn.active {
@apply bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25;
}

/* Loading States */
.loading-state {
@apply flex flex-col items-center justify-center py-16 space-y-4;
}

.loading-spinner {
@apply w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full;
animation: spin 1s linear infinite;
}

.loading-text {
@apply text-slate-600 font-semibold text-lg;
}

.error-state {
@apply flex flex-col items-center justify-center py-16 space-y-4 bg-red-50/70 rounded-3xl mx-6 border border-red-200/60 backdrop-blur-xl;
}

/* Utilities */
.line-clamp-2 {
display: -webkit-box;
-webkit-line-clamp: 2;
-webkit-box-orient: vertical;
overflow: hidden;
}

.line-clamp-3 {
display: -webkit-box;
-webkit-line-clamp: 3;
-webkit-box-orient: vertical;
overflow: hidden;
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

/* Modal Animations */
@keyframes modalFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Other Animations */
@keyframes float {
0%, 100% { transform: translateY(0px); }
50% { transform: translateY(-6px); }
}

@keyframes spin {
to { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 1024px) {
.main-content-adjusted {
margin-left: 0;
}
}

@media (max-width: 640px) {
.dashboard-title {
@apply text-2xl;
}
.header-content {
    @apply flex-col space-y-4;
}

.header-actions {
    @apply flex-col w-full space-y-3 space-x-0;
}

.header-actions > * {
    @apply w-full;
}

.pagination-container {
    @apply flex-col space-y-4;
}

.pagination-controls {
    @apply w-full justify-center;
}
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
.floating-orb,
.job-card,
.footer-btn,
.apply-btn {
animation: none;
}
.job-card:hover {
    transform: none;
}
}
</style>