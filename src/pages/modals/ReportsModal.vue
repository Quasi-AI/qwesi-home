<template>
  <BaseModal 
    :show="show" 
    @update:show="$emit('update:show', $event)"
    title="Dashboard Reports"
  >
    <div class="space-y-6">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>

      <!-- Reports Content -->
      <div v-else class="space-y-8">
        <!-- Overview Stats -->
        <div>
          <h4 class="text-lg font-medium text-gray-900 mb-4">Overview</h4>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div class="bg-blue-50 p-4 rounded-lg text-center">
              <div class="text-2xl font-bold text-blue-600">{{ stats.totalTasks }}</div>
              <div class="text-sm text-gray-600">Total Tasks</div>
            </div>
            <div class="bg-green-50 p-4 rounded-lg text-center">
              <div class="text-2xl font-bold text-green-600">{{ stats.completedTasks }}</div>
              <div class="text-sm text-gray-600">Completed</div>
            </div>
            <div class="bg-yellow-50 p-4 rounded-lg text-center">
              <div class="text-2xl font-bold text-yellow-600">{{ stats.pendingTasks }}</div>
              <div class="text-sm text-gray-600">Pending</div>
            </div>
            <div class="bg-purple-50 p-4 rounded-lg text-center">
              <div class="text-2xl font-bold text-purple-600">{{ stats.teamMembers }}</div>
              <div class="text-sm text-gray-600">Team Members</div>
            </div>
          </div>
        </div>

        <!-- Performance Chart -->
        <div>
          <h4 class="text-lg font-medium text-gray-900 mb-4">Performance This Month</h4>
          <div class="bg-gray-50 p-6 rounded-lg">
            <div class="flex items-center justify-between mb-4">
              <span class="text-sm text-gray-600">Completion Rate</span>
              <span class="text-lg font-semibold text-gray-900">{{ completionRate }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div 
                class="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                :style="{ width: completionRate + '%' }"
              ></div>
            </div>
        </div>

        <!-- Recent Activity -->
        <div>
          <h4 class="text-lg font-medium text-gray-900 mb-4">Recent Activity</h4>
          <div class="space-y-3">
            <div v-for="activity in recentActivity" :key="activity.id" 
              class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div class="flex-shrink-0">
                <div :class="getActivityIconClass(activity.type)" class="w-8 h-8 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path v-if="activity.type === 'task_created'" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
                    <path v-else-if="activity.type === 'task_completed'" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    <path v-else d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm text-gray-900">{{ activity.message }}</p>
                <p class="text-xs text-gray-500">{{ formatTime(activity.timestamp) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Team Performance -->
        <div>
          <h4 class="text-lg font-medium text-gray-900 mb-4">Team Performance</h4>
          <div class="space-y-3">
            <div v-for="member in teamPerformance" :key="member.id" 
              class="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div class="flex items-center space-x-3">
                <img :src="member.avatar || '/default-avatar.png'" :alt="member.name" 
                  class="w-8 h-8 rounded-full">
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ member.name }}</p>
                  <p class="text-xs text-gray-500">{{ member.role }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-semibold text-gray-900">{{ member.completedTasks }}/{{ member.totalTasks }}</p>
                <p class="text-xs text-gray-500">Tasks completed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Export Button -->
      <div class="flex justify-end pt-6 border-t border-gray-200">
        <button
          @click="exportReport"
          :disabled="exporting"
          class="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
        >
          <span v-if="exporting" class="flex items-center">
            <svg class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Exporting...
          </span>
          <span v-else>Export Report</span>
        </button>
      </div>
    </div>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
// import BaseModal from './BaseModal.vue'
// import { reportsService } from '../services/reportsService'

const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['update:show'])

const loading = ref(false)
const exporting = ref(false)

const stats = reactive({
  totalTasks: 0,
  completedTasks: 0,
  pendingTasks: 0,
  teamMembers: 0
})

const recentActivity = ref([])
const teamPerformance = ref([])

const completionRate = computed(() => {
  if (stats.totalTasks === 0) return 0
  return Math.round((stats.completedTasks / stats.totalTasks) * 100)
})

const loadReportsData = async () => {
  loading.value = true
  try {
    const [statsResponse, activityResponse, performanceResponse] = await Promise.all([
      reportsService.getStats(),
      reportsService.getRecentActivity(),
      reportsService.getTeamPerformance()
    ])

    if (statsResponse.success) {
      Object.assign(stats, statsResponse.data)
    }
    if (activityResponse.success) {
      recentActivity.value = activityResponse.data
    }
    if (performanceResponse.success) {
      teamPerformance.value = performanceResponse.data
    }
  } catch (error) {
    console.error('Failed to load reports data:', error)
  } finally {
    loading.value = false
  }
}

const exportReport = async () => {
  exporting.value = true
  try {
    const response = await reportsService.exportReport()
    if (response.success) {
      // Create download link
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `report_${new Date().toISOString().split('T')[0]}.pdf`
      link.click()
      window.URL.revokeObjectURL(url)
    }
  } catch (error) {
    console.error('Failed to export report:', error)
  } finally {
    exporting.value = false
  }
}

const getActivityIconClass = (type) => {
  const classes = {
    task_created: 'bg-blue-100 text-blue-600',
    task_completed: 'bg-green-100 text-green-600',
    member_invited: 'bg-purple-100 text-purple-600'
  }
  return classes[type] || 'bg-gray-100 text-gray-600'
}

const formatTime = (timestamp) => {
  const now = new Date()
  const time = new Date(timestamp)
  const diff = Math.floor((now - time) / 1000)

  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
  return `${Math.floor(diff / 86400)} days ago`
}

// Load data when modal opens
watch(() => props.show, (newValue) => {
  if (newValue) {
    loadReportsData()
  }
}, { immediate: true })
</script>
