<template>
  <BaseModal 
    :show="show" 
    @update:show="$emit('update:show', $event)"
    title="Invite Team Member"
  >
    <form @submit.prevent="submitInvite" class="space-y-6">
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

      <!-- Full Name -->
      <div>
        <label for="fullName" class="block text-sm font-medium text-gray-700 mb-2">
          Full Name *
        </label>
        <input
          id="fullName"
          v-model="form.name"
          type="text"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Enter full name"
        />
      </div>

      <!-- Email Address -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
          Email Address *
        </label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Enter email address"
        />
      </div>

      <!-- Role and Department -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label for="role" class="block text-sm font-medium text-gray-700 mb-2">
            Role
          </label>
          <select
            id="role"
            v-model="form.role"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="member">Team Member</option>
            <option value="lead">Team Lead</option>
            <option value="manager">Manager</option>
            <option value="admin">Administrator</option>
          </select>
        </div>

        <div>
          <label for="department" class="block text-sm font-medium text-gray-700 mb-2">
            Department
          </label>
          <select
            id="department"
            v-model="form.department"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select department</option>
            <option value="engineering">Engineering</option>
            <option value="design">Design</option>
            <option value="marketing">Marketing</option>
            <option value="sales">Sales</option>
            <option value="hr">Human Resources</option>
            <option value="finance">Finance</option>
          </select>
        </div>
      </div>

      <!-- Permissions -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">
          Permissions
        </label>
        <div class="space-y-3">
          <label class="flex items-center">
            <input
              v-model="form.permissions.canCreateTasks"
              type="checkbox"
              class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <span class="ml-2 text-sm text-gray-700">Can create tasks</span>
          </label>
          <label class="flex items-center">
            <input
              v-model="form.permissions.canAssignTasks"
              type="checkbox"
              class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <span class="ml-2 text-sm text-gray-700">Can assign tasks to others</span>
          </label>
          <label class="flex items-center">
            <input
              v-model="form.permissions.canViewReports"
              type="checkbox"
              class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <span class="ml-2 text-sm text-gray-700">Can view reports</span>
          </label>
        </div>
      </div>

      <!-- Welcome Message -->
      <div>
        <label for="welcomeMessage" class="block text-sm font-medium text-gray-700 mb-2">
          Welcome Message (Optional)
        </label>
        <textarea
          id="welcomeMessage"
          v-model="form.welcomeMessage"
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Add a personal welcome message..."
        ></textarea>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end space-x-3 pt-6">
        <button
          type="button"
          @click="$emit('update:show', false)"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="loading"
          class="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
        >
          <span v-if="loading" class="flex items-center">
            <svg class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            Sending Invite...
          </span>
          <span v-else>Send Invitation</span>
        </button>
      </div>
    </form>
  </BaseModal>
</template>

<script setup>
import { ref, reactive } from 'vue'
// import BaseModal from './BaseModal.vue'
// import { teamService } from '../services/teamService'

const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['update:show', 'member-invited'])

const loading = ref(false)

const form = reactive({
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

const errors = reactive({})

const submitInvite = async () => {
  loading.value = true
  Object.keys(errors).forEach(key => delete errors[key])

  try {
    const response = await teamService.inviteMember(form)
    
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
</script>