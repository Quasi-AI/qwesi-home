<template>
  <BaseModal 
    :show="show" 
    @update:show="$emit('update:show', $event)"
    title="Invite Team Member"
  >
    <div class="invite-content">
      <form @submit.prevent="submitInvite" class="space-y-6">
        <!-- Error Alert -->
        <div v-if="errors.general" class="error-alert">
          <div class="error-backdrop"></div>
          <div class="error-content">
            <div class="error-icon">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <p class="error-text">{{ errors.general }}</p>
          </div>
        </div>

        <!-- Personal Information Section -->
        <div class="form-section">
          <div class="section-header">
            <div class="header-icon gradient-blue">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h4 class="section-title">Personal Information</h4>
            <div class="title-glow"></div>
          </div>

          <div class="fields-grid">
            <!-- Full Name -->
            <div class="field-container">
              <label for="fullName" class="field-label">
                Full Name *
              </label>
              <div class="input-wrapper">
                <input
                  id="fullName"
                  v-model="form.name"
                  type="text"
                  required
                  class="form-input"
                  placeholder="Enter full name"
                />
                <div class="input-glow"></div>
              </div>
            </div>

            <!-- Email Address -->
            <div class="field-container">
              <label for="email" class="field-label">
                Email Address *
              </label>
              <div class="input-wrapper">
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  class="form-input"
                  placeholder="Enter email address"
                />
                <div class="input-glow"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Role & Department Section -->
        <div class="form-section">
          <div class="section-header">
            <div class="header-icon gradient-emerald">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6z" />
              </svg>
            </div>
            <h4 class="section-title">Role & Department</h4>
            <div class="title-glow"></div>
          </div>

          <div class="fields-grid grid-cols-2">
            <!-- Role -->
            <div class="field-container">
              <label for="role" class="field-label">
                Role
              </label>
              <div class="select-wrapper">
                <select
                  id="role"
                  v-model="form.role"
                  class="form-select"
                >
                  <option value="member">Team Member</option>
                  <option value="lead">Team Lead</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Administrator</option>
                </select>
                <div class="select-arrow">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 9 6 6 6-6"></path>
                  </svg>
                </div>
                <div class="input-glow"></div>
              </div>
            </div>

            <!-- Department -->
            <div class="field-container">
              <label for="department" class="field-label">
                Department
              </label>
              <div class="select-wrapper">
                <select
                  id="department"
                  v-model="form.department"
                  class="form-select"
                >
                  <option value="">Select department</option>
                  <option value="engineering">Engineering</option>
                  <option value="design">Design</option>
                  <option value="marketing">Marketing</option>
                  <option value="sales">Sales</option>
                  <option value="hr">Human Resources</option>
                  <option value="finance">Finance</option>
                </select>
                <div class="select-arrow">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 9 6 6 6-6"></path>
                  </svg>
                </div>
                <div class="input-glow"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Permissions Section -->
        <div class="form-section">
          <div class="section-header">
            <div class="header-icon gradient-purple">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h4 class="section-title">Permissions</h4>
            <div class="title-glow"></div>
          </div>

          <div class="permissions-grid">
            <div class="permission-item">
              <div class="permission-backdrop"></div>
              <label class="permission-label">
                <div class="checkbox-wrapper">
                  <input
                    v-model="form.permissions.canCreateTasks"
                    type="checkbox"
                    class="permission-checkbox"
                  />
                  <div class="checkbox-visual">
                    <svg class="checkbox-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="m5 13 4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
                <div class="permission-content">
                  <span class="permission-title">Create Tasks</span>
                  <span class="permission-desc">Can create and manage new tasks</span>
                </div>
              </label>
            </div>

            <div class="permission-item">
              <div class="permission-backdrop"></div>
              <label class="permission-label">
                <div class="checkbox-wrapper">
                  <input
                    v-model="form.permissions.canAssignTasks"
                    type="checkbox"
                    class="permission-checkbox"
                  />
                  <div class="checkbox-visual">
                    <svg class="checkbox-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="m5 13 4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
                <div class="permission-content">
                  <span class="permission-title">Assign Tasks</span>
                  <span class="permission-desc">Can assign tasks to team members</span>
                </div>
              </label>
            </div>

            <div class="permission-item">
              <div class="permission-backdrop"></div>
              <label class="permission-label">
                <div class="checkbox-wrapper">
                  <input
                    v-model="form.permissions.canViewReports"
                    type="checkbox"
                    class="permission-checkbox"
                  />
                  <div class="checkbox-visual">
                    <svg class="checkbox-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="m5 13 4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
                <div class="permission-content">
                  <span class="permission-title">View Reports</span>
                  <span class="permission-desc">Can access team reports and analytics</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- Welcome Message Section -->
        <div class="form-section">
          <div class="section-header">
            <div class="header-icon gradient-amber">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h4 class="section-title">Welcome Message</h4>
            <div class="title-glow"></div>
          </div>

          <div class="field-container">
            <label for="welcomeMessage" class="field-label">
              Personal Welcome Message (Optional)
            </label>
            <div class="textarea-wrapper">
              <textarea
                id="welcomeMessage"
                v-model="form.welcomeMessage"
                rows="4"
                class="form-textarea"
                placeholder="Add a personal welcome message for the new team member..."
              ></textarea>
              <div class="input-glow"></div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="actions-section">
          <div class="actions-backdrop"></div>
          <div class="actions-content">
            <button
              type="button"
              @click="$emit('update:show', false)"
              class="action-btn cancel-btn"
            >
              <div class="btn-backdrop"></div>
              <span class="btn-text">Cancel</span>
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="action-btn submit-btn"
            >
              <div class="btn-backdrop"></div>
              <div class="btn-glow"></div>
              <span v-if="loading" class="btn-content loading">
                <div class="loading-spinner">
                  <div class="spinner-ring"></div>
                </div>
                <span class="btn-text">Sending Invite...</span>
              </span>
              <span v-else class="btn-content">
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
                <span class="btn-text">Send Invitation</span>
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import BaseModal from '~/pages/modals/BaseModal.vue'
import { teamService } from '~/services/teamService'
import { taskService } from '~/services/taskService'
import { useAuthStore } from '~/features/auth/stores/auth.store'

const authStore = useAuthStore()
const props = defineProps({
  show: Boolean
})
const teamMembers = ref([])
const emit = defineEmits(['update:show', 'member-invited'])

const loading = ref(false)
const currentUser = authStore.getUser
const form = reactive({
  name: '',
  sender: currentUser?.email,
  email: '',
  role: 'member',
  department: '',
  permissions: {
    canCreateTasks: true,
    canAssignTasks: false,
    canViewReports: false
  },
  welcomeMessage: ''
})

const errors = reactive({})

const submitInvite = async () => {
  loading.value = true
  Object.keys(errors).forEach(key => delete errors[key])

  try {
    const teamData = {
      ...form
    }
    const response = await teamService.createTeamMember(teamData)
    
    if (response.success) {
      emit('member-invited', response.data)
      emit('update:show', false)
      resetForm()
    } else {
      errors.general = response.message || 'Failed to send invitation'
    }
  } catch (error) {
    errors.general = 'Failed to send invitation. Please try again.'
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  Object.assign(form, {
    name: '',
    email: '',
    role: 'member',
    department: '',
    permissions: {
      canCreateTasks: true,
      canAssignTasks: false,
      canViewReports: false
    },
    welcomeMessage: ''
  })
}

const loadTeamMembers = async () => {
  try {
    const response = await taskService.getTeamMembers()
    if (response.success) {
      teamMembers.value = response.data
    }
  } catch (error) {
    console.error('Failed to load team members:', error)
  }
}

onMounted(() => {
  loadTeamMembers()
})
</script>

<style scoped>
/* Base Container */
.invite-content {
  @apply space-y-6;
}

/* Form Sections */
.form-section {
  @apply space-y-4;
}

.section-header {
  @apply relative flex items-center space-x-3 mb-6;
}

.header-icon {
  @apply w-6 h-6 p-1.5 rounded-xl flex items-center justify-center;
  @apply shadow-lg transform transition-all duration-300 hover:scale-110;
}

.header-icon svg {
  @apply w-full h-full text-white;
}

.gradient-blue {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.gradient-emerald {
  background: linear-gradient(135deg, #10b981, #059669);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.gradient-purple {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.gradient-amber {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.section-title {
  @apply text-base font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent;
}

.title-glow {
  @apply flex-1 h-px bg-gradient-to-r from-slate-300 via-blue-300 to-transparent opacity-60;
}

/* Fields Grid */
.fields-grid {
  @apply grid grid-cols-1 gap-4;
}

.fields-grid.grid-cols-2 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

@media (min-width: 640px) {
  .fields-grid.grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.field-container {
  @apply space-y-2;
}

.field-label {
  @apply block text-sm font-semibold text-slate-700;
}

/* Input Styling */
.input-wrapper,
.select-wrapper,
.textarea-wrapper {
  @apply relative;
}

.form-input,
.form-select,
.form-textarea {
  @apply w-full px-4 py-3 rounded-xl transition-all duration-300;
  @apply bg-white/70 backdrop-blur-sm;
  @apply border border-slate-200/60;
  @apply text-slate-900 placeholder-slate-400;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400/60;
  @apply hover:border-slate-300/80;
}

.form-textarea {
  @apply resize-none;
}

.form-select {
  @apply appearance-none pr-10;
}

.select-arrow {
  @apply absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none;
  @apply w-5 h-5 text-slate-400;
}

.input-glow {
  @apply absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300;
  background: linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1));
  filter: blur(4px);
}

.form-input:focus + .input-glow,
.form-select:focus + .select-wrapper .input-glow,
.form-textarea:focus + .input-glow {
  @apply opacity-100;
}

/* Permissions Grid */
.permissions-grid {
  @apply space-y-3;
}

.permission-item {
  @apply relative rounded-xl overflow-hidden;
  @apply transform transition-all duration-300 hover:scale-[1.02];
}

.permission-backdrop {
  @apply absolute inset-0 rounded-xl;
  background: linear-gradient(135deg, rgba(248, 250, 252, 0.9), rgba(241, 245, 249, 0.6));
  backdrop-filter: blur(10px);
  border: 1px solid rgba(203, 213, 225, 0.3);
}

.permission-label {
  @apply relative z-10 flex items-start space-x-4 p-4 cursor-pointer;
}

.checkbox-wrapper {
  @apply relative flex-shrink-0;
}

.permission-checkbox {
  @apply sr-only;
}

.checkbox-visual {
  @apply w-5 h-5 rounded-md transition-all duration-300;
  @apply border-2 border-slate-300 bg-white;
  @apply flex items-center justify-center;
}

.checkbox-icon {
  @apply w-3 h-3 text-white opacity-0 transition-opacity duration-200;
}

.permission-checkbox:checked + .checkbox-visual {
  @apply bg-gradient-to-br from-blue-500 to-purple-600 border-transparent;
}

.permission-checkbox:checked + .checkbox-visual .checkbox-icon {
  @apply opacity-100;
}

.permission-content {
  @apply flex-1 space-y-1;
}

.permission-title {
  @apply block font-semibold text-slate-900 text-sm;
}

.permission-desc {
  @apply block text-xs text-slate-600;
}

/* Error Alert */
.error-alert {
  @apply relative rounded-xl overflow-hidden;
}

.error-backdrop {
  @apply absolute inset-0 rounded-xl;
  background: linear-gradient(135deg, rgba(254, 226, 226, 0.9), rgba(252, 165, 165, 0.3));
  backdrop-filter: blur(10px);
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.error-content {
  @apply relative z-10 flex items-center space-x-3 p-4;
}

.error-icon {
  @apply w-5 h-5 text-red-500 flex-shrink-0;
}

.error-text {
  @apply text-sm font-medium text-red-800;
}

/* Action Buttons */
.actions-section {
  @apply relative rounded-xl overflow-hidden mt-8;
}

.actions-backdrop {
  @apply absolute inset-0 rounded-xl;
  background: linear-gradient(135deg, rgba(248, 250, 252, 0.8), rgba(226, 232, 240, 0.4));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.actions-content {
  @apply relative z-10 flex justify-end space-x-3 p-6;
}

.action-btn {
  @apply relative px-6 py-3 rounded-xl font-semibold text-sm;
  @apply transform transition-all duration-300;
  @apply hover:scale-105 hover:shadow-lg;
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2;
  @apply disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none;
}

.cancel-btn {
  @apply text-slate-700 focus:ring-slate-500;
}

.cancel-btn .btn-backdrop {
  @apply absolute inset-0 rounded-xl;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(248, 250, 252, 0.6));
  backdrop-filter: blur(10px);
  border: 1px solid rgba(203, 213, 225, 0.4);
}

.submit-btn {
  @apply text-white focus:ring-blue-500;
}

.submit-btn .btn-backdrop {
  @apply absolute inset-0 rounded-xl;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-glow {
  @apply absolute -inset-px rounded-xl opacity-0 transition-opacity duration-500;
  background: linear-gradient(45deg, rgba(59, 130, 246, 0.4), rgba(147, 51, 234, 0.4));
  filter: blur(8px);
}

.submit-btn:hover .btn-glow {
  @apply opacity-100;
}

.btn-content {
  @apply relative z-10 flex items-center space-x-2;
}

.btn-content.loading {
  @apply space-x-3;
}

.btn-icon {
  @apply w-4 h-4;
}

.btn-text {
  @apply font-semibold;
}

/* Loading Spinner */
.loading-spinner {
  @apply relative w-4 h-4;
}

.spinner-ring {
  @apply w-full h-full border-2 border-white/30 border-t-white rounded-full;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive Design */
@media (max-width: 640px) {
  .actions-content {
    @apply flex-col space-x-0 space-y-3;
  }
  
  .action-btn {
    @apply justify-center;
  }
  
  .fields-grid.grid-cols-2 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  .section-title {
    @apply from-slate-100 to-slate-300;
  }
  
  .form-input,
  .form-select,
  .form-textarea {
    @apply bg-slate-800/70 border-slate-600/60 text-slate-100 placeholder-slate-400;
  }
  
  .permission-backdrop,
  .actions-backdrop {
    background: rgba(15, 23, 42, 0.8) !important;
    border-color: rgba(71, 85, 105, 0.3) !important;
  }
  
  .permission-title {
    @apply text-slate-100;
  }
  
  .permission-desc {
    @apply text-slate-400;
  }
  
  .field-label {
    @apply text-slate-300;
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .permission-item,
  .header-icon,
  .action-btn {
    transition: none;
    animation: none;
  }
  
  .permission-item:hover,
  .header-icon:hover,
  .action-btn:hover {
    transform: none;
  }
  
  .spinner-ring {
    animation: none;
  }
}
</style>