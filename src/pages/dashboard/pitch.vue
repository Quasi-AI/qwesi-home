<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <Sidebar :user="user" />

    <!-- Main Content -->
    <div class="main-content">
      <!-- Enhanced Top Navigation -->
      <header class="modern-header">
        <div class="header-backdrop"></div>
        <div class="header-content">
          <div class="header-info">
            <div class="welcome-section">
              <h1 class="dashboard-title">Pitch Competition</h1>
              <p class="welcome-message">Submit your innovative ideas and compete for funding opportunities</p>
            </div>
          </div>

          <!-- Header Actions -->
          <div class="header-actions">
            <!-- View My Submissions -->
            <button @click="showMySubmissions = true" class="action-btn submissions-btn">
              <div class="btn-bg"></div>
              <div class="btn-content">
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>My Submissions</span>
              </div>
            </button>

            <!-- Competition Stats -->
            <button @click="loadCompetitionStats" class="action-btn stats-btn">
              <div class="btn-bg"></div>
              <div class="btn-content">
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Stats</span>
              </div>
            </button>

            <!-- Back to Main -->
            <NuxtLink to="/dashboard/get-started" class="action-btn referral-btn">
              <div class="btn-bg"></div>
              <div class="btn-content">
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Options</span>
              </div>
            </NuxtLink>
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
        <div class="max-w-4xl mx-auto w-full space-y-8">
          <!-- Success Banner for existing submissions -->
          <div v-if="hasExistingSubmission" class="success-banner">
            <div class="banner-backdrop"></div>
            <div class="banner-content">
              <div class="banner-main">
                <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <svg class="banner-icon text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h2 class="banner-title">You've Already Submitted This Year!</h2>
                  <p class="banner-description">
                    You have already submitted a pitch for this year's competition. Check your submission status below or wait for next year's competition.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Hero Section - Enhanced -->
          <div v-else class="onboarding-banner">
            <div class="banner-backdrop"></div>
            <div class="banner-content">
              <div class="banner-main">
                <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <svg class="banner-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div>
                  <h2 class="banner-title">Showcase Your Innovation!</h2>
                  <p class="banner-description">
                    Submit your groundbreaking ideas, business plans, or innovative solutions to compete for funding, 
                    mentorship, and the chance to turn your vision into reality.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Competition Stats Display -->
          <div v-if="showStats && competitionStats" class="stats-display">
            <div class="stats-backdrop"></div>
            <div class="stats-content">
              <h3 class="stats-title">Competition Statistics</h3>
              <div class="stats-grid">
                <div class="stat-card">
                  <div class="stat-number">{{ competitionStats.total || 0 }}</div>
                  <div class="stat-label">Total Submissions</div>
                </div>
                <div class="stat-card">
                  <div class="stat-number">{{ competitionStats.thisYear || 0 }}</div>
                  <div class="stat-label">This Year</div>
                </div>
                <div class="stat-card">
                  <div class="stat-number">{{ competitionStats.byStatus?.pending || 0 }}</div>
                  <div class="stat-label">Pending Review</div>
                </div>
                <div class="stat-card">
                  <div class="stat-number">{{ competitionStats.byStatus?.approved || 0 }}</div>
                  <div class="stat-label">Approved</div>
                </div>
              </div>
              <button @click="showStats = false" class="stats-close">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Registration Form - Enhanced with validation -->
          <div v-if="!hasExistingSubmission" class="relative rounded-3xl overflow-hidden">
            <div class="absolute inset-0 bg-white/95 border border-slate-200/60 backdrop-blur-xl"></div>
            <div class="relative z-10 p-8">
              <form @submit.prevent="submitPitchForm" class="space-y-8">
                <div class="form-header">
                  <h3 class="text-xl font-bold text-slate-900 mb-2">Competition Submission</h3>
                  <div class="form-progress">
                    <div class="progress-bar" :style="{ width: `${formProgress}%` }"></div>
                  </div>
                  <p class="text-sm text-slate-600 mt-2">{{ formProgress }}% Complete</p>
                </div>

                <!-- Personal Information -->
                <div class="form-section">
                  <h4 class="section-title">Personal Information</h4>
                  <div class="section-content">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div class="field-group">
                        <label class="field-label">Full Name *</label>
                        <input 
                          v-model="pitchForm.name" 
                          type="text" 
                          placeholder="Enter your full name"
                          class="field-input"
                          :class="{ 'field-error': errors.name }"
                          @blur="validateField('name')"
                          required 
                        />
                        <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
                      </div>

                      <div class="field-group">
                        <label class="field-label">Email Address *</label>
                        <input 
                          v-model="pitchForm.email" 
                          type="email" 
                          placeholder="your.email@example.com"
                          class="field-input"
                          :class="{ 'field-error': errors.email }"
                          @blur="validateField('email')"
                          required 
                        />
                        <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
                      </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      <div class="field-group">
                        <label class="field-label">Phone Number *</label>
                        <div class="flex flex-col sm:flex-row gap-2">
                          <div class="w-full sm:w-auto">
                            <CountryCodeSelector v-model="pitchForm.countryCode" />
                          </div>
                          <input 
                            v-model="pitchForm.phone" 
                            type="tel" 
                            placeholder="Your phone number"
                            class="field-input flex-1"
                            :class="{ 'field-error': errors.phone }"
                            @blur="validateField('phone')"
                            required 
                          />
                        </div>
                        <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
                      </div>

                      <div class="field-group">
                        <label class="field-label">Organization/Company (Optional)</label>
                        <input 
                          v-model="pitchForm.organization" 
                          type="text"
                          placeholder="Your organization or company"
                          class="field-input" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Project Information -->
                <div class="form-section">
                  <h4 class="section-title">Project Information</h4>
                  <div class="section-content">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div class="field-group">
                        <label class="field-label">Project/Idea Name *</label>
                        <input 
                          v-model="pitchForm.projectName" 
                          type="text"
                          placeholder="Your innovative project name"
                          class="field-input"
                          :class="{ 'field-error': errors.projectName }"
                          @blur="validateField('projectName')"
                          required 
                        />
                        <span v-if="errors.projectName" class="error-message">{{ errors.projectName }}</span>
                      </div>

                      <div class="field-group">
                        <label class="field-label">Industry/Category *</label>
                        <select 
                          v-model="pitchForm.industry"
                          class="field-input"
                          :class="{ 'field-error': errors.industry }"
                          @change="validateField('industry')"
                          required
                        >
                          <option value="">Select Industry</option>
                          <option v-for="industry in industries" :key="industry" :value="industry">{{ industry }}</option>
                        </select>
                        <span v-if="errors.industry" class="error-message">{{ errors.industry }}</span>
                      </div>
                    </div>

                    <div class="field-group mt-4">
                      <label class="field-label">Project Summary *</label>
                      <textarea 
                        v-model="pitchForm.summary" 
                        rows="3"
                        placeholder="Provide a compelling summary of your project in 2-3 sentences"
                        class="field-input resize-none"
                        :class="{ 'field-error': errors.summary }"
                        @blur="validateField('summary')"
                        maxlength="500"
                        required
                      ></textarea>
                      <div class="flex justify-between items-center mt-1">
                        <span v-if="errors.summary" class="error-message">{{ errors.summary }}</span>
                        <span class="text-xs text-slate-500">{{ pitchForm.summary.length }}/500</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Competition Type -->
                <div class="form-section">
                  <h4 class="section-title">Competition Type *</h4>
                  <div class="section-content">
                    <div class="space-y-2">
                      <label v-for="option in pitchTypes" :key="option.value" 
                             class="competition-option"
                             :class="{ 'selected': pitchForm.submissionType === option.value }">
                        <input 
                          v-model="pitchForm.submissionType" 
                          :value="option.value" 
                          type="radio"
                          name="submissionType"
                          class="option-radio"
                          @change="validateField('submissionType')"
                        />
                        <div class="option-content">
                          <span class="option-title">{{ option.label }}</span>
                          <span class="option-description">{{ option.description }}</span>
                        </div>
                      </label>
                    </div>
                    <span v-if="errors.submissionType" class="error-message">{{ errors.submissionType }}</span>
                  </div>
                </div>

                <!-- Detailed Description -->
                <div class="form-section">
                  <h4 class="section-title">Detailed Project Description *</h4>
                  <div class="section-content">
                    <div class="field-group">
                      <textarea 
                        v-model="pitchForm.description" 
                        rows="8"
                        placeholder="Provide a comprehensive description of your project including:&#10;• The problem you're solving&#10;• Your innovative solution&#10;• Target market and audience&#10;• What makes your idea unique&#10;• Potential impact and benefits&#10;• Your competitive advantage"
                        class="field-input resize-none"
                        :class="{ 'field-error': errors.description }"
                        @blur="validateField('description')"
                        maxlength="2000"
                        required
                      ></textarea>
                      <div class="flex justify-between items-center mt-1">
                        <span v-if="errors.description" class="error-message">{{ errors.description }}</span>
                        <span class="text-xs text-slate-500">{{ pitchForm.description.length }}/2000</span>
                      </div>
                      <p class="text-xs text-slate-500 mt-2">Be detailed and specific - this is your chance to showcase your innovation</p>
                    </div>
                  </div>
                </div>

                <!-- Stage and Funding -->
                <div class="form-section">
                  <h4 class="section-title">Project Details</h4>
                  <div class="section-content">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div class="field-group">
                        <label class="field-label">Current Development Stage *</label>
                        <select 
                          v-model="pitchForm.stage"
                          class="field-input"
                          :class="{ 'field-error': errors.stage }"
                          @change="validateField('stage')"
                          required
                        >
                          <option value="">Select Stage</option>
                          <option v-for="stage in projectStages" :key="stage" :value="stage">{{ stage }}</option>
                        </select>
                        <span v-if="errors.stage" class="error-message">{{ errors.stage }}</span>
                      </div>

                      <div class="field-group">
                        <label class="field-label">Funding Sought (Optional)</label>
                        <input 
                          v-model="pitchForm.fundingAmount" 
                          type="text"
                          placeholder="e.g., $50,000 or Not Seeking Funding"
                          class="field-input" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Additional Information -->
                <div class="form-section">
                  <h4 class="section-title">Additional Details</h4>
                  <div class="section-content">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div class="field-group">
                        <label class="field-label">Team Size</label>
                        <select v-model="pitchForm.teamSize" class="field-input">
                          <option value="">Select Team Size</option>
                          <option value="Just me">Just me (Solo founder)</option>
                          <option value="2-3 people">2-3 people</option>
                          <option value="4-10 people">4-10 people</option>
                          <option value="10+ people">10+ people</option>
                        </select>
                      </div>

                      <div class="field-group">
                        <label class="field-label">Website/Demo URL (Optional)</label>
                        <input 
                          v-model="pitchForm.websiteUrl" 
                          type="url"
                          placeholder="https://your-project.com"
                          class="field-input"
                          :class="{ 'field-error': errors.websiteUrl }"
                          @blur="validateField('websiteUrl')"
                        />
                        <span v-if="errors.websiteUrl" class="error-message">{{ errors.websiteUrl }}</span>
                      </div>
                    </div>

                    <!-- What they're seeking -->
                    <div class="field-group mt-6">
                      <label class="field-label mb-3">What are you looking for? (Check all that apply)</label>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <label v-for="option in seekingOptions" :key="option.value"
                               class="seeking-option"
                               :class="{ 'selected': pitchForm.seeking.includes(option.value) }">
                          <input 
                            v-model="pitchForm.seeking" 
                            :value="option.value" 
                            type="checkbox"
                            class="seeking-checkbox"
                          />
                          <div class="option-content">
                            <span class="option-title">{{ option.label }}</span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Submit Button -->
                <div class="form-footer">
                  <div class="footer-info">
                    <p class="text-xs text-slate-500">
                      * Required fields. All submissions will be reviewed by our expert panel.
                    </p>
                  </div>
                  <button 
                    type="submit" 
                    :disabled="isSubmitting || !isFormValid"
                    class="submit-btn"
                    :class="{ 'disabled': isSubmitting || !isFormValid }"
                  >
                    <span v-if="isSubmitting" class="submit-loading">
                      <svg class="animate-spin h-4 w-4 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                    <span v-else>Submit Pitch</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- My Submissions Modal -->
          <div v-if="showMySubmissions" class="modal-overlay" @click="showMySubmissions = false">
            <div class="submissions-modal" @click.stop>
              <div class="modal-header">
                <h3 class="modal-title">My Submissions</h3>
                <button @click="showMySubmissions = false" class="modal-close">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div class="modal-content">
                <div v-if="loadingSubmissions" class="loading-state">
                  <div class="loading-spinner"></div>
                  <p class="loading-text">Loading your submissions...</p>
                </div>
                <div v-else-if="userSubmissions.length === 0" class="empty-state">
                  <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p class="empty-text">No submissions yet</p>
                  <p class="empty-description">You haven't submitted any pitches yet. Submit your first pitch above!</p>
                </div>
                <div v-else class="submissions-list">
                  <div v-for="submission in userSubmissions" :key="submission._id" class="submission-card">
                    <div class="submission-header">
                      <h4 class="submission-title">{{ submission.projectName }}</h4>
                      <span class="submission-status" :class="getStatusClass(submission.status)">
                        {{ formatStatus(submission.status) }}
                      </span>
                    </div>
                    <div class="submission-details">
                      <p class="submission-summary">{{ submission.summary }}</p>
                      <div class="submission-meta">
                        <span class="meta-item">{{ submission.industry }}</span>
                        <span class="meta-separator">•</span>
                        <span class="meta-item">{{ submission.stage }}</span>
                        <span class="meta-separator">•</span>
                        <span class="meta-item">{{ formatDate(submission.submittedAt) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Benefits Section -->
          <div class="benefits-section">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="benefit-card">
                <div class="card-bg bg-gradient-to-br from-purple-50 to-purple-100/70"></div>
                <div class="card-glow bg-gradient-to-br from-purple-200 to-purple-300"></div>
                <div class="card-content">
                  <div class="card-icon bg-gradient-to-br from-purple-500 to-purple-600">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                    </svg>
                  </div>
                  <h3 class="card-title">Funding Opportunities</h3>
                  <p class="card-description">Win cash prizes, grants, and investment opportunities from our network of investors and partners.</p>
                </div>
              </div>

              <div class="benefit-card">
                <div class="card-bg bg-gradient-to-br from-blue-50 to-blue-100/70"></div>
                <div class="card-glow bg-gradient-to-br from-blue-200 to-blue-300"></div>
                <div class="card-content">
                  <div class="card-icon bg-gradient-to-br from-blue-500 to-blue-600">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                    </svg>
                  </div>
                  <h3 class="card-title">Expert Mentorship</h3>
                  <p class="card-description">Get guidance from industry experts, successful entrepreneurs, and seasoned investors.</p>
                </div>
              </div>

              <div class="benefit-card">
                <div class="card-bg bg-gradient-to-br from-green-50 to-green-100/70"></div>
                <div class="card-glow bg-gradient-to-br from-green-200 to-green-300"></div>
                <div class="card-content">
                  <div class="card-icon bg-gradient-to-br from-green-500 to-green-600">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <h3 class="card-title">Network Access</h3>
                  <p class="card-description">Connect with like-minded entrepreneurs, potential co-founders, and industry professionals.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Competition Timeline -->
          <div class="timeline-section">
            <div class="timeline-backdrop"></div>
            <div class="timeline-content">
              <h3 class="timeline-title">Competition Timeline</h3>
              <div class="timeline-grid">
                <div class="timeline-step">
                  <div class="step-icon step-1">
                    <span class="step-number">1</span>
                  </div>
                  <h4 class="step-title">Submit</h4>
                  <p class="step-description">Complete and submit your pitch application</p>
                </div>
                <div class="timeline-step">
                  <div class="step-icon step-2">
                    <span class="step-number">2</span>
                  </div>
                  <h4 class="step-title">Review</h4>
                  <p class="step-description">Expert panel reviews all submissions</p>
                </div>
                <div class="timeline-step">
                  <div class="step-icon step-3">
                    <span class="step-number">3</span>
                  </div>
                  <h4 class="step-title">Shortlist</h4>
                  <p class="step-description">Selected finalists are notified</p>
                </div>
                <div class="timeline-step">
                  <div class="step-icon step-4">
                    <span class="step-number">4</span>
                  </div>
                  <h4 class="step-title">Present</h4>
                  <p class="step-description">Final presentations and winner announcement</p>
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
import CountryCodeSelector from '~/shared/components/ui/country-code-selector.vue'
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

// UI State
const profileMenuOpen = ref(false)
const showMySubmissions = ref(false)
const showStats = ref(false)
const loadingSubmissions = ref(false)
const hasExistingSubmission = ref(false)

// Form options - Enhanced
const pitchTypes = [
  { 
    value: 'business_plan', 
    label: 'Business Plan Competition',
    description: 'Submit your comprehensive business plan for review and funding opportunities'
  },
  { 
    value: 'startup_pitch', 
    label: 'Startup Pitch',
    description: 'Present your startup idea for early-stage funding and mentorship'
  },
  { 
    value: 'innovation_challenge', 
    label: 'Innovation Challenge',
    description: 'Showcase innovative solutions to real-world problems'
  }
]

const industries = [
  'Technology', 'Healthcare', 'Education', 'Finance', 'E-commerce', 'Agriculture', 
  'Manufacturing', 'Energy', 'Transportation', 'Entertainment', 'Food & Beverage', 
  'Real Estate', 'Environmental', 'Social Impact', 'Other'
]

const projectStages = [
  'Idea Stage', 'Concept Development', 'Prototype/MVP', 'Testing Phase', 
  'Market Ready', 'Early Revenue', 'Scaling'
]

const seekingOptions = [
  { value: 'funding', label: 'Funding/Investment' },
  { value: 'mentorship', label: 'Mentorship & Guidance' },
  { value: 'partnerships', label: 'Strategic Partnerships' },
  { value: 'team_members', label: 'Team Members/Co-founders' },
  { value: 'market_access', label: 'Market Access & Customers' },
  { value: 'technical_support', label: 'Technical Support' }
]

// Form data and validation
const pitchForm = ref({
  name: '',
  email: '',
  phone: '',
  countryCode: '+233',
  organization: '',
  projectName: '',
  industry: '',
  summary: '',
  submissionType: '',
  description: '',
  stage: '',
  fundingAmount: '',
  teamSize: '',
  websiteUrl: '',
  seeking: []
})

const errors = ref({})
const isSubmitting = ref(false)
const userSubmissions = ref([])
const competitionStats = ref(null)

// Validation rules
const validationRules = {
  name: (value) => {
    if (!value) return 'Name is required'
    if (value.length < 2) return 'Name must be at least 2 characters'
    return null
  },
  email: (value) => {
    if (!value) return 'Email is required'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) return 'Please enter a valid email address'
    return null
  },
  phone: (value) => {
    if (!value) return 'Phone number is required'
    if (value.length < 7) return 'Phone number is too short'
    return null
  },
  projectName: (value) => {
    if (!value) return 'Project name is required'
    if (value.length < 3) return 'Project name must be at least 3 characters'
    return null
  },
  industry: (value) => {
    if (!value) return 'Please select an industry'
    return null
  },
  summary: (value) => {
    if (!value) return 'Project summary is required'
    if (value.length < 50) return 'Summary must be at least 50 characters'
    if (value.length > 500) return 'Summary must be less than 500 characters'
    return null
  },
  submissionType: (value) => {
    if (!value) return 'Please select a competition type'
    return null
  },
  description: (value) => {
    if (!value) return 'Project description is required'
    if (value.length < 100) return 'Description must be at least 100 characters'
    if (value.length > 2000) return 'Description must be less than 2000 characters'
    return null
  },
  stage: (value) => {
    if (!value) return 'Please select your project stage'
    return null
  },
  websiteUrl: (value) => {
    if (value && !/^https?:\/\/.+\..+/.test(value)) return 'Please enter a valid URL'
    return null
  }
}

// Form validation
const validateField = (fieldName) => {
  const rule = validationRules[fieldName]
  if (rule) {
    const error = rule(pitchForm.value[fieldName])
    if (error) {
      errors.value[fieldName] = error
    } else {
      delete errors.value[fieldName]
    }
  }
}

const validateForm = () => {
  const newErrors = {}
  Object.keys(validationRules).forEach(field => {
    const error = validationRules[field](pitchForm.value[field])
    if (error) {
      newErrors[field] = error
    }
  })
  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

// Computed properties
const isFormValid = computed(() => {
  return validateForm() && pitchForm.value.name && pitchForm.value.email && 
         pitchForm.value.phone && pitchForm.value.projectName && pitchForm.value.industry &&
         pitchForm.value.summary && pitchForm.value.submissionType && 
         pitchForm.value.description && pitchForm.value.stage
})

const formProgress = computed(() => {
  const requiredFields = ['name', 'email', 'phone', 'projectName', 'industry', 
                         'summary', 'submissionType', 'description', 'stage']
  const filledFields = requiredFields.filter(field => pitchForm.value[field]).length
  return Math.round((filledFields / requiredFields.length) * 100)
})

// API functions
const checkExistingSubmission = async () => {
  try {
    if (!user.value?.email) return
    
    const response = await $fetch(`${API_ROUTES.SUBMISSIONS}/${encodeURIComponent(user.value.email)}`)
    
    if (response.success && response.data.length > 0) {
      // Check if any submission is from current year
      const currentYear = new Date().getFullYear()
      const currentYearSubmission = response.data.find(submission => {
        const submissionYear = new Date(submission.submittedAt).getFullYear()
        return submissionYear === currentYear
      })
      
      hasExistingSubmission.value = !!currentYearSubmission
      userSubmissions.value = response.data
    }
  } catch (error) {
    console.error('Error checking existing submissions:', error)
  }
}

const loadUserSubmissions = async () => {
  if (!user.value?.email) return
  
  loadingSubmissions.value = true
  try {
    const response = await $fetch(`${API_ROUTES.SUBMISSIONS}/${encodeURIComponent(user.value.email)}`)
    
    if (response.success) {
      userSubmissions.value = response.data
    }
  } catch (error) {
    console.error('Error loading submissions:', error)
    alertRef.value?.error('Failed to load submissions', { title: 'Error' })
  } finally {
    loadingSubmissions.value = false
  }
}

const loadCompetitionStats = async () => {
  try {
    const response = await $fetch(`${API_ROUTES.SUBMISSIONS}/stats`)
    
    if (response.success) {
      competitionStats.value = response.data
      showStats.value = true
    }
  } catch (error) {
    console.error('Error loading stats:', error)
    alertRef.value?.error('Failed to load competition statistics', { title: 'Error' })
  }
}

// Main submit function
const submitPitchForm = async () => {
  if (!validateForm()) {
    alertRef.value?.error('Please fix the errors in the form', { title: 'Validation Error' })
    return
  }

  isSubmitting.value = true
  
  try {
    const payload = {
      name: pitchForm.value.name,
      email: pitchForm.value.email,
      phone: pitchForm.value.countryCode + pitchForm.value.phone,
      organization: pitchForm.value.organization,
      projectName: pitchForm.value.projectName,
      industry: pitchForm.value.industry,
      summary: pitchForm.value.summary,
      submissionType: pitchForm.value.submissionType,
      description: pitchForm.value.description,
      stage: pitchForm.value.stage,
      fundingAmount: pitchForm.value.fundingAmount,
      teamSize: pitchForm.value.teamSize,
      websiteUrl: pitchForm.value.websiteUrl,
      seeking: pitchForm.value.seeking
    }

    const response = await $fetch(`${API_ROUTES.SUBMISSIONS}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: payload
    })

    if (response.success) {
      alertRef.value?.success('Pitch submitted successfully! Our expert panel will review your submission and contact you within 5-7 business days.', {
        title: 'Submission Received!',
        duration: 4000
      })
      
      resetPitchForm()
      hasExistingSubmission.value = true
      
      // Redirect to dashboard after success
      setTimeout(() => {
        navigateTo('/dashboard')
      }, 3000)
    } else {
      throw new Error(response.message || 'Submission failed')
    }

  } catch (error) {
    console.error('Pitch submission error:', error)
    
    let errorMessage = 'Pitch submission failed. Please try again.'
    let errorTitle = 'Error'
    
    if (error.status === 409) {
      errorMessage = 'You have already submitted a pitch this year. Please wait for next year\'s competition.'
      errorTitle = 'Duplicate Submission'
      hasExistingSubmission.value = true
    } else if (error.data?.message) {
      errorMessage = error.data.message
    }
    
    alertRef.value?.error(errorMessage, {
      title: errorTitle,
      duration: 0
    })
  } finally {
    isSubmitting.value = false
  }
}

// Utility functions
const resetPitchForm = () => {
  pitchForm.value = {
    name: '',
    email: '',
    phone: '',
    countryCode: '+233',
    organization: '',
    projectName: '',
    industry: '',
    summary: '',
    submissionType: '',
    description: '',
    stage: '',
    fundingAmount: '',
    teamSize: '',
    websiteUrl: '',
    seeking: []
  }
  errors.value = {}
}

const formatStatus = (status) => {
  const statusMap = {
    pending: 'Under Review',
    reviewed: 'Reviewed',
    approved: 'Approved',
    rejected: 'Not Selected'
  }
  return statusMap[status] || status
}

const getStatusClass = (status) => {
  const statusClasses = {
    pending: 'status-pending',
    reviewed: 'status-reviewed', 
    approved: 'status-approved',
    rejected: 'status-rejected'
  }
  return statusClasses[status] || 'status-default'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Watch for changes in showMySubmissions
watch(showMySubmissions, (newValue) => {
  if (newValue) {
    loadUserSubmissions()
  }
})

// Lifecycle
onMounted(async () => {
  if (!authStore.isAuthenticated) {
    navigateTo('/auth/login')
    return
  }
  
  // Pre-fill form with user data if available
  if (user.value?.email) {
    pitchForm.value.email = user.value.email
  }
  if (user.value?.name) {
    pitchForm.value.name = user.value.name
  }
  
  // Check for existing submissions
  await checkExistingSubmission()
})

// Set page title
useHead({
  title: 'Pitch Competition - QWESI AI'
})
</script>

<style scoped>
/* Enhanced Styles for the competition form */

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

/* Modern Header */
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

/* Header Actions */
.header-actions {
  @apply flex items-center space-x-3 flex-wrap;
}

.action-btn {
  @apply relative px-4 py-2 rounded-2xl font-medium text-sm transition-all duration-300;
  @apply hover:scale-105 hover:shadow-lg;
  backdrop-filter: blur(12px);
}

.btn-bg {
  @apply absolute inset-0 rounded-2xl transition-all duration-300;
}

.submissions-btn .btn-bg {
  @apply bg-gradient-to-r from-green-100/80 to-green-200/60;
}

.stats-btn .btn-bg {
  @apply bg-gradient-to-r from-amber-100/80 to-amber-200/60;
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

.submissions-btn {
  @apply text-green-700 hover:text-green-900;
}

.stats-btn {
  @apply text-amber-700 hover:text-amber-900;
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

.dropdown-arrow {
  @apply w-4 h-4 text-slate-400 transition-transform duration-300;
}

.profile-menu {
  @apply absolute right-0 mt-2 w-48 rounded-2xl overflow-hidden z-50;
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

/* Main Content */
.dashboard-main {
  @apply flex-1 p-6 flex flex-col space-y-8;
  min-height: 0;
  overflow-y: auto;
  padding-bottom: 2rem;
}

/* Success Banner */
.success-banner {
  @apply relative rounded-3xl overflow-hidden;
  backdrop-filter: blur(20px);
}

.success-banner .banner-backdrop {
  @apply absolute inset-0 bg-gradient-to-r from-green-600/95 via-emerald-600/90 to-teal-600/95;
}

.success-banner .banner-content {
  @apply relative z-10 p-8 text-white;
}

.success-banner .banner-main {
  @apply flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4;
}

/* Onboarding Banner */
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
  @apply flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4;
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

/* Stats Display */
.stats-display {
  @apply relative rounded-3xl overflow-hidden;
}

.stats-backdrop {
  @apply absolute inset-0 bg-white/95 border border-slate-200/60;
  backdrop-filter: blur(20px);
}

.stats-content {
  @apply relative z-10 p-8;
}

.stats-title {
  @apply text-xl font-bold text-slate-900 mb-6;
}

.stats-grid {
  @apply grid grid-cols-2 md:grid-cols-4 gap-6;
}

.stat-card {
  @apply text-center;
}

.stat-number {
  @apply text-3xl font-bold text-blue-600 mb-1;
}

.stat-label {
  @apply text-sm font-medium text-slate-600;
}

.stats-close {
  @apply absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600;
  @apply rounded-xl hover:bg-slate-100/70 transition-colors;
}

/* Form Styles */
.form-header {
  @apply mb-8;
}

.form-progress {
  @apply w-full bg-slate-200 rounded-full h-2 mt-4;
}

.progress-bar {
  @apply bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500;
}

.form-section {
  @apply bg-slate-50/70 p-6 rounded-2xl backdrop-blur-sm border border-slate-200/30;
}

.section-title {
  @apply text-lg font-semibold text-slate-900 mb-4;
}

.section-content {
  @apply space-y-4;
}

.field-group {
  @apply space-y-2;
}

.field-label {
  @apply block text-sm font-medium text-slate-700;
}

.field-input {
  @apply w-full px-4 py-3 border border-slate-300 rounded-xl;
  @apply focus:ring-2 focus:ring-purple-500 focus:border-purple-500;
  @apply bg-white/80 backdrop-blur-sm transition-all duration-200;
  @apply hover:border-slate-400;
}

.field-input.field-error {
  @apply border-red-400 focus:ring-red-500 focus:border-red-500;
}

.error-message {
  @apply text-red-600 text-xs font-medium;
}

/* Competition Options */
.competition-option {
  @apply flex items-start p-4 border border-slate-200 rounded-xl cursor-pointer;
  @apply hover:bg-slate-50/70 transition-all duration-200;
  @apply backdrop-blur-sm;
}

.competition-option.selected {
  @apply border-purple-400 bg-purple-50/70;
}

.option-radio {
  @apply w-4 h-4 text-purple-600 border-slate-300 focus:ring-purple-500 mt-1 mr-3 flex-shrink-0;
}

.option-content {
  @apply flex-1;
}

.option-title {
  @apply text-sm font-semibold text-slate-700 block mb-1;
}

.option-description {
  @apply text-xs text-slate-600;
}

/* Seeking Options */
.seeking-option {
  @apply flex items-center p-4 border border-slate-200 rounded-xl cursor-pointer;
  @apply hover:bg-slate-50/70 transition-all duration-200;
  @apply backdrop-blur-sm;
}

.seeking-option.selected {
  @apply border-green-400 bg-green-50/70;
}

.seeking-checkbox {
  @apply w-4 h-4 text-green-600 border-slate-300 rounded focus:ring-green-500 mr-3;
}

/* Form Footer */
.form-footer {
  @apply flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-slate-200 space-y-4 sm:space-y-0;
}

.footer-info {
  @apply text-center sm:text-left;
}

.submit-btn {
  @apply w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl;
  @apply hover:from-purple-700 hover:to-purple-800 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2;
  @apply transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40;
  @apply font-semibold;
}

.submit-btn.disabled {
  @apply opacity-50 cursor-not-allowed;
}

.submit-loading {
  @apply flex items-center justify-center;
}

/* My Submissions Modal */
.modal-overlay {
  @apply fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50;
  backdrop-filter: blur(8px);
}

.submissions-modal {
  @apply bg-white/95 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.modal-header {
  @apply flex items-center justify-between p-6 border-b border-slate-200/60;
}

.modal-title {
  @apply text-xl font-bold text-slate-900;
}

.modal-close {
  @apply p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100/70;
  @apply transition-colors duration-200;
}

.modal-content {
  @apply p-6 max-h-[70vh] overflow-y-auto;
}

/* Loading and Empty States */
.loading-state, .empty-state {
  @apply flex flex-col items-center justify-center py-12 space-y-4;
}

.loading-spinner {
  @apply w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full;
  animation: spin 1s linear infinite;
}

.loading-text {
  @apply text-slate-600 font-medium;
}

.empty-icon {
  @apply w-16 h-16 text-slate-400;
}

.empty-text {
  @apply text-lg font-semibold text-slate-700;
}

.empty-description {
  @apply text-slate-500 text-center max-w-md;
}

/* Submissions List */
.submissions-list {
  @apply space-y-4;
}

.submission-card {
  @apply bg-slate-50/70 rounded-2xl p-6 border border-slate-200/30;
  @apply hover:shadow-md transition-all duration-200;
}

.submission-header {
  @apply flex items-start justify-between mb-3;
}

.submission-title {
  @apply text-lg font-semibold text-slate-900;
}

.submission-status {
  @apply px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide;
}

.status-pending {
  @apply bg-yellow-100 text-yellow-800;
}

.status-reviewed {
  @apply bg-blue-100 text-blue-800;
}

.status-approved {
  @apply bg-green-100 text-green-800;
}

.status-rejected {
  @apply bg-red-100 text-red-800;
}

.status-default {
  @apply bg-slate-100 text-slate-800;
}

.submission-details {
  @apply space-y-3;
}

.submission-summary {
  @apply text-slate-700 text-sm leading-relaxed;
}

.submission-meta {
  @apply flex items-center space-x-2 text-xs text-slate-500;
}

.meta-item {
  @apply font-medium;
}

.meta-separator {
  @apply text-slate-400;
}

/* Benefits Section */
.benefits-section {
  @apply space-y-6;
}

.benefit-card {
  @apply relative p-6 rounded-3xl transition-all duration-300;
  @apply hover:-translate-y-2 hover:scale-105;
  backdrop-filter: blur(20px);
}

.card-bg {
  @apply absolute inset-0 rounded-3xl border border-white/60;
}

.card-glow {
  @apply absolute -inset-px rounded-3xl opacity-0 transition-all duration-500;
  filter: blur(8px);
}

.benefit-card:hover .card-glow {
  @apply opacity-100;
}

.card-content {
  @apply relative z-10 flex flex-col items-center space-y-3 text-center;
}

.card-icon {
  @apply w-12 h-12 rounded-2xl flex items-center justify-center;
  @apply shadow-lg transition-transform duration-300;
}

.card-icon svg {
  @apply w-6 h-6 text-white;
}

.benefit-card:hover .card-icon {
  @apply scale-110 rotate-3;
}

.card-title {
  @apply text-lg font-bold text-slate-700;
}

.card-description {
  @apply text-sm text-slate-600 leading-relaxed;
}

/* Timeline Section */
.timeline-section {
  @apply relative rounded-3xl overflow-hidden;
}

.timeline-backdrop {
  @apply absolute inset-0 bg-white/95 border border-slate-200/60;
  backdrop-filter: blur(20px);
}

.timeline-content {
  @apply relative z-10 p-8;
}

.timeline-title {
  @apply text-lg font-semibold text-slate-900 mb-6 text-center;
}

.timeline-grid {
  @apply grid grid-cols-1 md:grid-cols-4 gap-6;
}

.timeline-step {
  @apply text-center space-y-3;
}

.step-icon {
  @apply w-12 h-12 rounded-full flex items-center justify-center mx-auto;
  @apply shadow-lg transition-transform duration-300;
}

.step-1 {
  @apply bg-gradient-to-br from-blue-100 to-blue-200;
}

.step-2 {
  @apply bg-gradient-to-br from-yellow-100 to-yellow-200;
}

.step-3 {
  @apply bg-gradient-to-br from-green-100 to-green-200;
}

.step-4 {
  @apply bg-gradient-to-br from-purple-100 to-purple-200;
}

.step-number {
  @apply text-slate-700 font-bold text-lg;
}

.step-title {
  @apply font-semibold text-slate-900 text-lg;
}

.step-description {
  @apply text-sm text-slate-600;
}

/* Floating Decorations */
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

/* Custom Scrollbars */
.main-content,
.dashboard-main,
.modal-content {
  scrollbar-width: thin;
  scrollbar-color: rgba(148, 163, 184, 0.3) transparent;
}

.main-content::-webkit-scrollbar,
.dashboard-main::-webkit-scrollbar,
.modal-content::-webkit-scrollbar {
  width: 6px;
}

.main-content::-webkit-scrollbar-track,
.dashboard-main::-webkit-scrollbar-track,
.modal-content::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 3px;
}

.main-content::-webkit-scrollbar-thumb,
.dashboard-main::-webkit-scrollbar-thumb,
.modal-content::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, rgba(148, 163, 184, 0.3), rgba(148, 163, 184, 0.5));
  border-radius: 3px;
  transition: all 0.3s ease;
}

.main-content::-webkit-scrollbar-thumb:hover,
.dashboard-main::-webkit-scrollbar-thumb:hover,
.modal-content::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, rgba(148, 163, 184, 0.5), rgba(148, 163, 184, 0.7));
}

/* Responsive Design */
@media (max-width: 640px) {
  .dashboard-title {
    @apply text-xl;
  }
  
  .header-actions {
    @apply gap-2;
  }
  
  .action-btn {
    @apply px-3 py-2 text-xs;
  }
  
  .btn-content span {
    @apply hidden;
  }
  
  .timeline-grid {
    @apply grid-cols-2 gap-4;
  }
  
  .stats-grid {
    @apply grid-cols-2 gap-4;
  }
  
  .form-section {
    @apply p-4;
  }
  
  .submissions-modal {
    @apply mx-2 max-w-full;
  }
}

@media (max-width: 480px) {
  .dashboard-main {
    @apply p-4;
  }
  
  .form-footer {
    @apply flex-col space-y-4;
  }
  
  .submit-btn {
    @apply w-full;
  }
}


/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  .floating-orb,
  .benefit-card,
  .card-icon,
  .banner-icon,
  .step-icon {
    animation: none;
  }
  
  .benefit-card:hover,
  .card-icon:hover {
    transform: none;
  }
  
  * {
    transition-duration: 0.01ms !important;
  }
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  .field-input {
    @apply border-2 border-slate-900;
  }
  
  .field-input:focus {
    @apply ring-4 ring-blue-600;
  }
  
  .submit-btn {
    @apply border-2 border-purple-800;
  }
  
  .competition-option,
  .seeking-option {
    @apply border-2;
  }
  
  .competition-option.selected,
  .seeking-option.selected {
    @apply border-2 border-purple-600;
  }
}

/* Print Styles */
@media print {
  .header-actions,
  .modal-overlay,
  .floating-orb {
    @apply hidden;
  }
  
  .form-section {
    @apply border border-slate-300 mb-4;
  }
  
  .field-input {
    @apply border border-slate-400;
  }
}
</style>