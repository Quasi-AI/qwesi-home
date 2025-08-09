<template>
  <BaseModal 
    :show="show" 
    @update:show="$emit('update:show', $event)"
    title="Create New Task"
  >
    <form @submit.prevent="submitTask" class="space-y-6">
      <!-- Error Alert -->
      <div v-if="errors.general" class="p-4 bg-red-50 border border-red-200 rounded-md">
        <div class="flex">
          <svg class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <div class="ml-3">
            <p class="text-sm text-red-800">{{ errors.general }}</p>
          </div>
        </div>
      </div>

      <!-- Task Title -->
      <div>
        <label for="taskTitle" class="block text-sm font-medium text-gray-700 mb-2">
          Task Title *
        </label>
        <input
          id="taskTitle"
          v-model="form.title"
          type="text"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter task title"
        />
      </div>

      <!-- Task Description -->
      <div>
        <label for="taskDescription" class="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="taskDescription"
          v-model="form.description"
          rows="4"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Describe the task..."
        ></textarea>
      </div>

      <!-- Priority and Due Date -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label for="priority" class="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <select
            id="priority"
            v-model="form.priority"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <div>
          <label for="dueDate" class="block text-sm font-medium text-gray-700 mb-2">
            Due Date
          </label>
          <input
            id="dueDate"
            v-model="form.dueDate"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <!-- Assign To -->
      <div>
        <label for="assignee" class="block text-sm font-medium text-gray-700 mb-2">
          Assign To
        </label>
        <select
          id="assignee"
          v-model="form.assignedTo"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select team member</option>
          <option v-for="member in teamMembers" :key="member.id" :value="member.id">
            {{ member.name }} ({{ member.role }})
          </option>
        </select>
      </div>

      <!-- Tags -->
      <div>
        <label for="tags" class="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <input
          id="tags"
          v-model="form.tags"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter tags separated by commas"
        />
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end space-x-3 pt-6">
        <button
          type="button"
          @click="$emit('update:show', false)"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="loading"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <span v-if="loading" class="flex items-center">
            <svg class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Creating...
          </span>
          <span v-else>Create Task</span>
        </button>
      </div>
    </form>
  </BaseModal>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
// import BaseModal from './BaseModal.vue'
// import { taskService } from '../services/taskService'

const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['update:show', 'task-created'])

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

const submitTask = async () => {
  loading.value = true
  Object.keys(errors).forEach(key => delete errors[key])

  try {
    const taskData = {
      ...form,
      tags: form.tags ? form.tags.split(',').map(tag => tag.trim()) : []
    }

    const response = await taskService.createTask(taskData)
    
    if (response.success) {
      emit('task-created', response.data)
      emit('update:show', false)
      resetForm()
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