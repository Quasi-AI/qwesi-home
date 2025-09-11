<template>
  <div class="table-container">
    <div class="table-backdrop"></div>
    <div class="table-content">
      <!-- Table Header -->
      <div class="table-header">
        <div class="header-content">
          <div class="header-title-section">
            <h3 class="table-title">Team Members</h3>
            <p class="table-subtitle">Manage your team and collaborate</p>
          </div>
          <div class="header-actions">
            <button 
              @click="refreshTeam" 
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
            <button @click="$emit('invite-member')" class="add-button">
              <svg class="add-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span>Invite Member</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <span class="loading-text">Loading team members...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <div class="error-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="error-message">{{ error }}</p>
        <button @click="refreshTeam" class="retry-button">
          Try Again
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="teamMembers.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h4 class="empty-title">No team members yet</h4>
        <p class="empty-description">Invite your first team member to get started</p>
        <button @click="$emit('invite-member')" class="empty-action-button">
          Invite Member
        </button>
      </div>

      <!-- Team Members Table -->
      <div v-else class="table-wrapper">
        <table class="team-table">
          <thead class="table-head">
            <tr>
              <th class="table-header-cell">Member</th>
              <th class="table-header-cell">Role</th>
              <th class="table-header-cell">Status</th>
              <th class="table-header-cell">Last Active</th>
              <th class="table-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody class="table-body">
            <tr 
              v-for="member in teamMembers" 
              :key="member.id"
              class="table-row"
              @click="$emit('view-member', member)"
            >
              <!-- Member Info -->
              <td class="table-cell member-cell">
                <div class="member-info">
                  <div class="member-avatar">
                    <img 
                      v-if="member.avatar" 
                      :src="member.avatar" 
                      :alt="member.name"
                      class="avatar-image"
                    />
                    <span v-else class="avatar-initials">
                      {{ getInitials(member.name) }}
                    </span>
                  </div>
                  <div class="member-details">
                    <h4 class="member-name">{{ member.name }}</h4>
                    <p class="member-email">{{ member.email }}</p>
                    <div v-if="member.isOwner" class="owner-badge">
                      <svg class="owner-icon" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span>Owner</span>
                    </div>
                  </div>
                </div>
              </td>

              <!-- Role -->
              <td class="table-cell role-cell">
                <span :class="`role-badge role-${member.role?.toLowerCase()?.replace(' ', '-')}`">
                  {{ member.role || 'Member' }}
                </span>
              </td>

              <!-- Status -->
              <td class="table-cell status-cell">
                <div class="status-indicator">
                  <span :class="`status-dot ${member.isActive ? 'active' : 'inactive'}`"></span>
                  <span class="status-text">
                    {{ member.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </div>
              </td>

              <!-- Last Active -->
              <td class="table-cell date-cell">
                <div v-if="member.lastActive" class="last-active">
                  <span class="date-text">{{ formatDate(member.lastActive) }}</span>
                  <span class="relative-time">{{ getRelativeTime(member.lastActive) }}</span>
                </div>
                <span v-else class="no-activity">Never active</span>
              </td>

              <!-- Actions -->
              <td class="table-cell actions-cell">
                <div class="action-buttons">
                    <button 
                    @click.stop="editMember(member)"
                    class="action-button edit-button"
                    title="Edit member"
                    >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    </button>
                    <button 
                    v-if="!member.isOwner"
                    @click.stop="confirmToggleStatus(member)"
                    :class="`action-button ${member.isActive ? 'deactivate-button' : 'activate-button'}`"
                    :title="member.isActive ? 'Deactivate member' : 'Activate member'"
                    >
                    <svg v-if="member.isActive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                    </svg>
                    <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    </button>
                    <button 
                    v-if="!member.isOwner"
                    @click.stop="confirmRemoveMember(member.id, member.name)"
                    class="action-button delete-button"
                    title="Remove member"
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
import { ref, onMounted } from 'vue'
import { teamService } from '~/services/teamService'

const emit = defineEmits(['invite-member', 'edit-member', 'view-member', 'member-updated', 'member-removed'])

// Reactive data
const teamMembers = ref([])
const loading = ref(false)
const error = ref(null)

// Methods
const fetchTeamMembers = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await teamService.getTeamMembers()
    if (response.success) {
      teamMembers.value = response.data
    } else {
      error.value = response.message || 'Failed to fetch team members'
    }
  } catch (err) {
    error.value = 'Failed to load team members'
    console.error('Error fetching team members:', err)
  } finally {
    loading.value = false
  }
}

const editMember = (member) => {
  console.log('Edit member clicked:', member)
  emit('edit-member', member)
}

const confirmToggleStatus = async (member) => {
  const action = member.isActive ? 'deactivate' : 'activate'
  if (confirm(`Are you sure you want to ${action} ${member.name}?`)) {
    await toggleMemberStatus(member)
  }
}

const confirmRemoveMember = async (memberId, memberName) => {
  if (confirm(`Are you sure you want to remove ${memberName} from the team? This action cannot be undone.`)) {
    await removeMember(memberId)
  }
}

const toggleMemberStatus = async (member) => {
  try {
    const newStatus = !member.isActive
    console.log('Toggling member status:', member.id, 'to', newStatus)
    
    const response = await teamService.updateTeamMemberStatus(member.id, newStatus)
    
    if (response.success) {
      // Update local member
      const memberIndex = teamMembers.value.findIndex(m => m.id === member.id)
      if (memberIndex !== -1) {
        teamMembers.value[memberIndex].isActive = newStatus
      }
      emit('member-updated', response.data)
      
      console.log('Member status updated successfully')
    } else {
      console.error('Failed to update member status:', response.message)

    }
  } catch (err) {
    console.error('Error updating member status:', err)

  }
}

const removeMember = async (memberId) => {
  try {
    console.log('Removing member:', memberId)
    
    const response = await teamService.deleteTeamMember(memberId)
    
    if (response.success) {
      // Remove from local array
      teamMembers.value = teamMembers.value.filter(m => m.id !== memberId)
      emit('member-removed', memberId)
      
      console.log('Member removed successfully')
    } else {
      console.error('Failed to remove member:', response.message)
    }
  } catch (err) {
    console.error('Error removing member:', err)
  }
}

const refreshTeam = async () => {
  await fetchTeamMembers()
}

// Utility functions
const getInitials = (name) => {
  return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2)
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

const getRelativeTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return `${Math.floor(diffDays / 30)} months ago`
}

// Lifecycle
onMounted(async () => {
  await fetchTeamMembers()
})

// Expose methods for parent component
defineExpose({
  refreshTeam,
  fetchTeamMembers
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
  @apply flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700;
  @apply text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800;
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
  @apply w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full;
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
  @apply px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl;
  @apply hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300;
}

/* Table Styles */
.table-wrapper {
  @apply overflow-x-auto;
}

.team-table {
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

/* Member Cell */
.member-cell {
  @apply max-w-xs;
}

.member-info {
  @apply flex items-center space-x-3;
}

.member-avatar {
  @apply w-10 h-10 rounded-xl overflow-hidden border-2 border-slate-200 flex-shrink-0;
}

.avatar-image {
  @apply w-full h-full object-cover;
}

.avatar-initials {
  @apply w-full h-full bg-gradient-to-br from-emerald-500 to-emerald-600;
  @apply flex items-center justify-center text-white font-bold text-sm;
}

.member-details {
  @apply space-y-1;
}

.member-name {
  @apply font-semibold text-slate-900;
}

.member-email {
  @apply text-sm text-slate-600;
}

.owner-badge {
  @apply inline-flex items-center space-x-1 px-2 py-1 bg-yellow-100 text-yellow-700;
  @apply rounded-md text-xs font-medium;
}

.owner-icon {
  @apply w-3 h-3;
}

/* Role Cell */
.role-badge {
  @apply inline-flex px-3 py-1 rounded-full text-xs font-medium;
}

.role-admin {
  @apply bg-purple-100 text-purple-700;
}

.role-manager {
  @apply bg-blue-100 text-blue-700;
}

.role-developer {
  @apply bg-green-100 text-green-700;
}

.role-designer {
  @apply bg-pink-100 text-pink-700;
}

.role-member {
  @apply bg-slate-100 text-slate-700;
}

/* Status Cell */
.status-indicator {
  @apply flex items-center space-x-2;
}

.status-dot {
  @apply w-3 h-3 rounded-full;
}

.status-dot.active {
  @apply bg-green-500;
}

.status-dot.inactive {
  @apply bg-slate-400;
}

.status-text {
  @apply text-sm font-medium;
}

/* Date Cell */
.last-active {
  @apply space-y-1;
}

.date-text {
  @apply block text-sm text-slate-900;
}

.relative-time {
  @apply text-xs text-slate-500;
}

.no-activity {
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

.activate-button {
  @apply text-slate-600 hover:text-green-600 hover:bg-green-50;
}

.deactivate-button {
  @apply text-slate-600 hover:text-orange-600 hover:bg-orange-50;
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
  
  .member-cell {
    @apply max-w-xs;
  }
  
  .member-info {
    @apply flex-col space-x-0 space-y-2 items-start;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>