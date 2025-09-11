<template>
  <BaseModal 
    :show="show" 
    @update:show="handleClose"
    @close="handleClose"
    title="Create New Task"
  >
    <div class="task-content">
      <form @submit.prevent="submitTask" class="space-y-6">
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

        <!-- Task Details Section -->
        <div class="form-section">
          <div class="section-header">
            <div class="header-icon gradient-blue">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h4 class="section-title">Task Details</h4>
            <div class="title-glow"></div>
          </div>

          <!-- Task Title -->
          <div class="field-container">
            <label for="taskTitle" class="field-label">
              Task Title *
            </label>
            <div class="input-wrapper">
              <input
                id="taskTitle"
                v-model="form.title"
                type="text"
                required
                class="form-input"
                placeholder="Enter a clear, actionable task title"
              />
              <div class="input-glow"></div>
            </div>
          </div>

          <!-- Task Description -->
          <div class="field-container">
            <label for="taskDescription" class="field-label">
              Description
            </label>
            <div class="textarea-wrapper">
              <textarea
                id="taskDescription"
                v-model="form.description"
                rows="4"
                class="form-textarea"
                placeholder="Provide detailed instructions, requirements, or context for this task..."
              ></textarea>
              <div class="input-glow"></div>
            </div>
          </div>
        </div>

        <!-- Priority & Timing Section -->
        <div class="form-section">
          <div class="section-header">
            <div class="header-icon gradient-amber">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 class="section-title">Priority & Timing</h4>
            <div class="title-glow"></div>
          </div>

          <div class="fields-grid grid-cols-2">
            <!-- Priority -->
            <div class="field-container">
              <label for="priority" class="field-label">
                Priority Level
              </label>
              <div class="select-wrapper">
                <select
                  id="priority"
                  v-model="form.priority"
                  class="form-select priority-select"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="urgent">Urgent</option>
                </select>
                <div class="select-arrow">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 9 6 6 6-6"></path>
                  </svg>
                </div>
                <div class="input-glow"></div>
              </div>
            </div>

            <!-- Due Date -->
            <div class="field-container">
              <label for="dueDate" class="field-label">
                Due Date
              </label>
              <div class="input-wrapper">
                <input
                  id="dueDate"
                  v-model="form.dueDate"
                  type="date"
                  class="form-input date-input"
                />
                <div class="input-glow"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Assignment Section -->
        <div class="form-section">
          <div class="section-header">
            <div class="header-icon gradient-emerald">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h4 class="section-title">Assignment</h4>
            <div class="title-glow"></div>
          </div>

          <!-- Assign To -->
          <div class="field-container">
            <label for="assignee" class="field-label">
              Assign To Team Member
            </label>
            <div class="select-wrapper">
              <select
                id="assignee"
                v-model="form.assignedTo"
                class="form-select"
              >
                <option value="">Select team member</option>
                <option v-for="member in teamMembers" :key="member.id" :value="member.id">
                  {{ member.name }} • {{ member.role }}
                </option>
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

        <!-- Organization Section -->
        <div class="form-section">
          <div class="section-header">
            <div class="header-icon gradient-purple">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h4 class="section-title">Organization</h4>
            <div class="title-glow"></div>
          </div>

          <!-- Tags -->
          <div class="field-container">
            <label for="tags" class="field-label">
              Tags
            </label>
            <div class="input-wrapper">
              <input
                id="tags"
                v-model="form.tags"
                type="text"
                class="form-input"
                placeholder="frontend, bug-fix, feature, urgent (separate with commas)"
              />
              <div class="input-glow"></div>
            </div>
            <div class="field-hint">
              <svg class="hint-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="hint-text">Use tags to categorize and filter tasks easily</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="actions-section">
          <div class="actions-backdrop"></div>
          <div class="actions-content">
            <button
              type="button"
              @click="handleClose"
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
                <span class="btn-text">Creating Task...</span>
              </span>
              <span v-else class="btn-content">
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span class="btn-text">Create Task</span>
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
import { taskService } from '~/services/taskService'
import { useAuthStore } from '~/features/auth/stores/auth.store'

const props = defineProps({
  show: Boolean
})

const authStore = useAuthStore()
const emit = defineEmits(['update:show', 'task-created', 'close'])

const loading = ref(false)
const teamMembers = ref([])

const form = reactive({
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
  assignedTo: '',
  tags: ''
})

const errors = reactive({})
const currentUser = authStore.getUser

// Handle close events
const handleClose = () => {
  emit('update:show', false)
  emit('close')
  resetForm()
}

const submitTask = async () => {
  loading.value = true
  Object.keys(errors).forEach(key => delete errors[key])

  try {
    const taskData = {
      ...form,
      email: currentUser?.email,
      tags: form.tags ? form.tags.split(',').map(tag => tag.trim()) : []
    }

    const response = await taskService.createTask(taskData)
    
    if (response.success) {
      emit('task-created', response.data)
      handleClose()
    } else {
      errors.general = response.message || 'Failed to create task'
    }
  } catch (error) {
    errors.general = 'Failed to create task. Please try again.'
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  Object.assign(form, {
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    assignedTo: '',
    tags: ''
  })
  Object.keys(errors).forEach(key => delete errors[key])
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
/* Base Container - Lighter appearance */
.task-content {
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
  @apply shadow-md transform transition-all duration-300 hover:scale-110;
}

.header-icon svg {
  @apply w-full h-full text-white;
}

.gradient-blue {
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.25);
}

.gradient-amber {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.25);
}

.gradient-emerald {
  background: linear-gradient(135deg, #34d399, #10b981);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.25);
}

.gradient-purple {
  background: linear-gradient(135deg, #a78bfa, #8b5cf6);
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.25);
}

.section-title {
  @apply text-base font-bold text-slate-800;
}

.title-glow {
  @apply flex-1 h-px bg-gradient-to-r from-slate-200 via-blue-200 to-transparent opacity-50;
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

/* Input Styling - Much lighter */
.input-wrapper,
.select-wrapper,
.textarea-wrapper {
  @apply relative;
}

.form-input,
.form-select,
.form-textarea {
  @apply w-full px-4 py-3 rounded-xl transition-all duration-300;
  @apply bg-white border border-slate-200;
  @apply text-slate-900 placeholder-slate-400;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400;
  @apply hover:border-slate-300;
  @apply shadow-sm;
}

.form-textarea {
  @apply resize-none;
}

.form-select {
  @apply appearance-none pr-10;
}

.date-input {
  @apply text-slate-700;
}

.priority-select {
  @apply font-medium;
}

.select-arrow {
  @apply absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none;
  @apply w-5 h-5 text-slate-400;
}

.input-glow {
  @apply absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300;
  background: linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1));
  filter: blur(2px);
}

.form-input:focus + .input-glow,
.form-select:focus + .select-wrapper .input-glow,
.form-textarea:focus + .input-glow {
  @apply opacity-100;
}

/* Field Hint */
.field-hint {
  @apply flex items-center space-x-2 mt-2;
}

.hint-icon {
  @apply w-4 h-4 text-slate-400 flex-shrink-0;
}

.hint-text {
  @apply text-xs text-slate-500;
}

/* Error Alert - Lighter */
.error-alert {
  @apply relative rounded-xl overflow-hidden;
}

.error-backdrop {
  @apply absolute inset-0 rounded-xl;
  background: linear-gradient(135deg, rgba(254, 242, 242, 0.9), rgba(252, 165, 165, 0.2));
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.error-content {
  @apply relative z-10 flex items-center space-x-3 p-4;
}

.error-icon {
  @apply w-5 h-5 text-red-500 flex-shrink-0;
}

.error-text {
  @apply text-sm font-medium text-red-700;
}

/* Action Buttons - Lighter */
.actions-section {
  @apply relative rounded-xl overflow-hidden mt-8;
}

.actions-backdrop {
  @apply absolute inset-0 rounded-xl;
  background: linear-gradient(135deg, rgba(248, 250, 252, 0.7), rgba(241, 245, 249, 0.3));
  border: 1px solid rgba(148, 163, 184, 0.15);
}

.actions-content {
  @apply relative z-10 flex justify-end space-x-3 p-6;
}

.action-btn {
  @apply relative px-6 py-3 rounded-xl font-semibold text-sm;
  @apply transform transition-all duration-300;
  @apply hover:scale-105 hover:shadow-md;
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2;
  @apply disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none;
}

.cancel-btn {
  @apply text-slate-700 focus:ring-slate-400;
}

.cancel-btn .btn-backdrop {
  @apply absolute inset-0 rounded-xl;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.7));
  border: 1px solid rgba(203, 213, 225, 0.3);
}

.submit-btn {
  @apply text-white focus:ring-blue-400;
}

.submit-btn .btn-backdrop {
  @apply absolute inset-0 rounded-xl;
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.25);
}

.btn-glow {
  @apply absolute -inset-px rounded-xl opacity-0 transition-opacity duration-500;
  background: linear-gradient(45deg, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3));
  filter: blur(6px);
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

/* Enhanced form interactions */
.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  @apply shadow-md shadow-blue-500/10;
}

.date-input::-webkit-calendar-picker-indicator {
  @apply cursor-pointer opacity-70 hover:opacity-100 transition-opacity;
}

/* Priority color indicators */
.priority-select option[value="low"] {
  color: #059669;
}
.priority-select option[value="medium"] {
  color: #d97706;
}
.priority-select option[value="high"] {
  color: #dc2626;
}
.priority-select option[value="urgent"] {
  color: #7c2d12;
  font-weight: bold;
}
</style>