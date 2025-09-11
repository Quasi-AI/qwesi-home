<template>
  <div class="table-container" data-onboard="activity-tables">
    <div class="table-backdrop"></div>
    <div class="table-content">
      <!-- Table Header -->
      <div class="table-header">
        <div class="header-content">
          <div class="header-title-section">
            <h3 class="table-title">Recent Tasks</h3>
            <p class="table-subtitle">Track and manage your team's tasks</p>
          </div>
          <div class="header-actions">
            <button 
              @click="refreshTasks" 
              :disabled="loading"
              class="refresh-button"
            >
              <svg v-if="loading" class="refresh-icon spinning" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="refresh-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button @click="$emit('create-task')" class="add-button">
              <svg class="add-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add Task</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <span class="loading-text">Loading tasks...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <div class="error-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="error-message">{{ error }}</p>
        <button @click="refreshTasks" class="retry-button">
          Try Again
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="tasks.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h4 class="empty-title">No tasks yet</h4>
        <p class="empty-description">Create your first task to get started</p>
        <button @click="$emit('create-task')" class="empty-action-button">
          Create Task
        </button>
      </div>

      <!-- Tasks Table -->
      <div v-else class="table-wrapper">
        <table class="tasks-table">
          <thead class="table-head">
            <tr>
              <th class="table-header-cell">Task</th>
              <th class="table-header-cell">Assignee</th>
              <th class="table-header-cell">Priority</th>
              <th class="table-header-cell">Status</th>
              <th class="table-header-cell">Due Date</th>
              <th class="table-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody class="table-body">
            <tr 
              v-for="task in tasks" 
              :key="task.id"
              class="table-row"
              @click="$emit('view-task', task)"
            >
              <!-- Task Title -->
              <td class="table-cell task-cell">
                <div class="task-info">
                  <h4 class="task-title">{{ task.title }}</h4>
                  <p class="task-description">{{ truncateText(task.description, 60) }}</p>
                  <div v-if="task.tags && task.tags.length" class="task-tags">
                    <span 
                      v-for="tag in task.tags.slice(0, 2)" 
                      :key="tag"
                      class="task-tag"
                    >
                      {{ tag }}
                    </span>
                    <span v-if="task.tags.length > 2" class="more-tags">
                      +{{ task.tags.length - 2 }}
                    </span>
                  </div>
                </div>
              </td>

              <!-- Assignee -->
              <td class="table-cell assignee-cell">
                <div v-if="task.assignedTo" class="assignee-info">
                  <div class="assignee-avatar">
                    {{ getInitials(getAssigneeName(task.assignedTo)) }}
                  </div>
                  <div class="assignee-details">
                    <span class="assignee-name">{{ getAssigneeName(task.assignedTo) }}</span>
                    <span class="assignee-role">{{ getAssigneeRole(task.assignedTo) }}</span>
                  </div>
                </div>
                <span v-else class="unassigned">Unassigned</span>
              </td>

              <!-- Priority -->
              <td class="table-cell priority-cell">
                <span :class="`priority-badge priority-${task.priority}`">
                  <span class="priority-dot"></span>
                  {{ formatPriority(task.priority) }}
                </span>
              </td>

              <!-- Status -->
              <td class="table-cell status-cell">
                <select
                  :value="task.status"
                  @change="updateTaskStatus(task.id, $event.target.value)"
                  @click.stop
                  class="status-select"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="completed">Completed</option>
                </select>
              </td>

              <!-- Due Date -->
              <td class="table-cell date-cell">
                <div v-if="task.dueDate" class="due-date">
                  <span class="date-text">{{ formatDate(task.dueDate) }}</span>
                  <span v-if="isOverdue(task.dueDate)" class="overdue-indicator">
                    Overdue
                  </span>
                </div>
                <span v-else class="no-date">No due date</span>
              </td>

              <!-- Actions -->
            <td class="table-cell actions-cell">
            <div class="action-buttons">
                <button 
                @click.stop="editTask(task)"
                class="action-button edit-button"
                title="Edit task"
                >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                </button>
                <button 
                @click.stop="confirmDeleteTask(task.id)"
                class="action-button delete-button"
                title="Delete task"
                >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                </button>
            </div>
            </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { taskService } from '~/services/taskService'
import { teamService } from '~/services/teamService'

const emit = defineEmits(['create-task', 'edit-task', 'view-task', 'task-updated', 'task-deleted'])

// Reactive data
const tasks = ref([])
const teamMembers = ref([])
const loading = ref(false)
const error = ref(null)

// Computed properties
const assigneeMap = computed(() => {
  const map = new Map()
  teamMembers.value.forEach(member => {
    map.set(member.id, member)
  })
  return map
})

// Methods
const fetchTasks = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await taskService.getTasks()
    if (response.success) {
      tasks.value = response.data
    } else {
      error.value = response.message || 'Failed to fetch tasks'
    }
  } catch (err) {
    error.value = 'Failed to load tasks'
    console.error('Error fetching tasks:', err)
  } finally {
    loading.value = false
  }
}

const editTask = (task) => {
  console.log('Edit task clicked:', task)
  emit('edit-task', task)
}

const confirmDeleteTask = async (taskId) => {
  const taskToDelete = tasks.value.find(t => t.id === taskId)
  const taskTitle = taskToDelete ? taskToDelete.title : 'this task'
  
  if (confirm(`Are you sure you want to delete "${taskTitle}"? This action cannot be undone.`)) {
    await deleteTask(taskId)
  }
}

const deleteTask = async (taskId) => {
  try {
    console.log('Deleting task:', taskId)
    
    const response = await taskService.deleteTask(taskId)
    
    if (response.success) {
      // Remove from local array
      tasks.value = tasks.value.filter(t => t.id !== taskId)
      emit('task-deleted', taskId)
      
      console.log('Task deleted successfully')
    } else {
      console.error('Failed to delete task:', response.message)
      alert(`Failed to delete task: ${response.message || 'Unknown error'}`)
    }
  } catch (err) {
    console.error('Error deleting task:', err)
    alert('Error deleting task. Please check your connection and try again.')
  }
}

const fetchTeamMembers = async () => {
  try {
    const response = await teamService.getTeamMembers()
    if (response.success) {
      teamMembers.value = response.data
    }
  } catch (err) {
    console.error('Error fetching team members:', err)
  }
}

const refreshTasks = async () => {
  await fetchTasks()
}

const updateTaskStatus = async (taskId, newStatus) => {
  try {
    const response = await taskService.updateTaskStatus(taskId, newStatus)
    if (response.success) {
      // Update local task
      const taskIndex = tasks.value.findIndex(t => t.id === taskId)
      if (taskIndex !== -1) {
        tasks.value[taskIndex].status = newStatus
      }
      emit('task-updated', response.data)
    } else {
      console.error('Failed to update task status:', response.message)
    }
  } catch (err) {
    console.error('Error updating task status:', err)
  }
}

// Utility functions
const getAssigneeName = (assigneeId) => {
  const assignee = assigneeMap.value.get(assigneeId)
  return assignee ? assignee.name : 'Unknown'
}

const getAssigneeRole = (assigneeId) => {
  const assignee = assigneeMap.value.get(assigneeId)
  return assignee ? assignee.role : ''
}

const getInitials = (name) => {
  return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2)
}

const formatPriority = (priority) => {
  const priorities = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent'
  }
  return priorities[priority] || priority
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const isOverdue = (dueDate) => {
  if (!dueDate) return false
  return new Date(dueDate) < new Date()
}

const truncateText = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    fetchTasks(),
    fetchTeamMembers()
  ])
})

// Expose methods for parent component
defineExpose({
  refreshTasks,
  fetchTasks
})
</script>

<style scoped>
/* Table Container */
.table-container {
  @apply relative rounded-3xl overflow-hidden;
  backdrop-filter: blur(20px);
}

.table-backdrop {
  @apply absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-slate-50/80 border border-white/60;
}

.table-content {
  @apply relative z-10;
}

/* Table Header */
.table-header {
  @apply p-6 border-b border-slate-200/60;
}

.header-content {
  @apply flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0;
}

.header-title-section {
  @apply space-y-1;
}

.table-title {
  @apply text-lg font-bold text-slate-900;
}

.table-subtitle {
  @apply text-sm text-slate-600;
}

.header-actions {
  @apply flex items-center space-x-3;
}

.refresh-button {
  @apply p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100/70;
  @apply transition-all duration-200 disabled:opacity-50;
}

.refresh-icon {
  @apply w-5 h-5;
}

.spinning {
  animation: spin 1s linear infinite;
}

.add-button {
  @apply flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700;
  @apply text-white rounded-xl hover:from-blue-700 hover:to-blue-800;
  @apply transition-all duration-300 hover:scale-105 hover:shadow-lg;
}

.add-icon {
  @apply w-4 h-4;
}

/* Loading, Error, Empty States */
.loading-state,
.error-state,
.empty-state {
  @apply flex flex-col items-center justify-center py-12 space-y-4;
}

.loading-spinner {
  @apply w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full;
  animation: spin 1s linear infinite;
}

.loading-text {
  @apply text-slate-600 font-medium;
}

.error-state {
  @apply text-red-600;
}

.error-icon {
  @apply w-12 h-12;
}

.error-message {
  @apply text-center max-w-md;
}

.retry-button {
  @apply px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors;
}

.empty-state {
  @apply text-slate-500;
}

.empty-icon {
  @apply w-16 h-16;
}

.empty-title {
  @apply text-lg font-semibold text-slate-700;
}

.empty-description {
  @apply text-center max-w-md;
}

.empty-action-button {
  @apply px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl;
  @apply hover:from-blue-700 hover:to-blue-800 transition-all duration-300;
}

/* Table Styles */
.table-wrapper {
  @apply overflow-x-auto;
}

.tasks-table {
  @apply w-full;
}

.table-head {
  @apply bg-slate-50/70;
}

.table-header-cell {
  @apply px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider;
}

.table-body {
  @apply divide-y divide-slate-200/60;
}

.table-row {
  @apply hover:bg-slate-50/50 transition-colors duration-200 cursor-pointer;
}

.table-cell {
  @apply px-6 py-4 whitespace-nowrap;
}

/* Task Cell */
.task-cell {
  @apply max-w-xs;
}

.task-info {
  @apply space-y-2;
}

.task-title {
  @apply font-semibold text-slate-900;
}

.task-description {
  @apply text-sm text-slate-600;
}

.task-tags {
  @apply flex flex-wrap gap-1;
}

.task-tag {
  @apply px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md font-medium;
}

.more-tags {
  @apply px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md;
}

/* Assignee Cell */
.assignee-info {
  @apply flex items-center space-x-3;
}

.assignee-avatar {
  @apply w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg;
  @apply flex items-center justify-center text-white font-bold text-xs;
}

.assignee-details {
  @apply flex flex-col;
}

.assignee-name {
  @apply font-medium text-slate-900 text-sm;
}

.assignee-role {
  @apply text-xs text-slate-500;
}

.unassigned {
  @apply text-slate-400 italic;
}

/* Priority Cell */
.priority-badge {
  @apply inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium;
}

.priority-dot {
  @apply w-2 h-2 rounded-full;
}

.priority-low {
  @apply bg-green-100 text-green-700;
}

.priority-low .priority-dot {
  @apply bg-green-500;
}

.priority-medium {
  @apply bg-yellow-100 text-yellow-700;
}

.priority-medium .priority-dot {
  @apply bg-yellow-500;
}

.priority-high {
  @apply bg-orange-100 text-orange-700;
}

.priority-high .priority-dot {
  @apply bg-orange-500;
}

.priority-urgent {
  @apply bg-red-100 text-red-700;
}

.priority-urgent .priority-dot {
  @apply bg-red-500;
}

/* Status Cell */
.status-select {
  @apply text-sm border border-slate-200 rounded-lg px-3 py-1 bg-white;
  @apply focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

/* Date Cell */
.due-date {
  @apply space-y-1;
}

.date-text {
  @apply block text-sm text-slate-900;
}

.overdue-indicator {
  @apply text-xs text-red-600 font-medium;
}

.no-date {
  @apply text-slate-400 italic text-sm;
}

/* Actions Cell */
.action-buttons {
  @apply flex items-center space-x-2;
}

.action-button {
  @apply p-2 rounded-lg transition-colors duration-200;
}

.edit-button {
  @apply text-slate-600 hover:text-blue-600 hover:bg-blue-50;
}

.delete-button {
  @apply text-slate-600 hover:text-red-600 hover:bg-red-50;
}

.action-button svg {
  @apply w-4 h-4;
}

/* Responsive Design */
@media (max-width: 768px) {
  .table-wrapper {
    @apply -mx-6;
  }
  
  .table-header-cell,
  .table-cell {
    @apply px-4 py-3;
  }
  
  .header-content {
    @apply flex-col space-y-3;
  }
  
  .task-cell {
    @apply max-w-xs;
  }
  
  .assignee-info {
    @apply flex-col space-x-0 space-y-1 items-start;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>