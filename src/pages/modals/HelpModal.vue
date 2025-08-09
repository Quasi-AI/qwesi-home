<template>
  <BaseModal 
    :show="show" 
    @update:show="$emit('update:show', $event)"
    title="Help & Tips"
  >
    <div class="space-y-6">
      <!-- Quick Tips -->
      <div>
        <h4 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <svg class="w-5 h-5 text-orange-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
          Quick Tips
        </h4>
        <div class="space-y-4">
          <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h5 class="font-medium text-orange-900 mb-2">💡 Task Management</h5>
            <ul class="text-sm text-orange-800 space-y-1">
              <li>• Use priority levels to organize your work effectively</li>
              <li>• Set due dates to keep track of deadlines</li>
              <li>• Add tags to categorize and filter tasks easily</li>
              <li>• Assign tasks to team members for better collaboration</li>
            </ul>
          </div>

          <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <h5 class="font-medium text-green-900 mb-2">👥 Team Collaboration</h5>
            <ul class="text-sm text-green-800 space-y-1">
              <li>• Invite team members with appropriate roles and permissions</li>
              <li>• Use @mentions in task descriptions to notify team members</li>
              <li>• Regular check-ins help maintain project momentum</li>
              <li>• Share progress updates to keep everyone informed</li>
            </ul>
          </div>

          <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h5 class="font-medium text-purple-900 mb-2">📊 Reports & Analytics</h5>
            <ul class="text-sm text-purple-800 space-y-1">
              <li>• Monitor completion rates to track team productivity</li>
              <li>• Use activity logs to identify bottlenecks</li>
              <li>• Export reports for stakeholder meetings</li>
              <li>• Review team performance regularly for improvements</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Keyboard Shortcuts -->
      <div>
        <h4 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <svg class="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
          Keyboard Shortcuts
        </h4>
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">New Task</span>
                <kbd class="px-2 py-1 bg-gray-200 rounded text-xs">Ctrl + N</kbd>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Search Tasks</span>
                <kbd class="px-2 py-1 bg-gray-200 rounded text-xs">Ctrl + F</kbd>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Invite Member</span>
                <kbd class="px-2 py-1 bg-gray-200 rounded text-xs">Ctrl + I</kbd>
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">View Reports</span>
                <kbd class="px-2 py-1 bg-gray-200 rounded text-xs">Ctrl + R</kbd>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Help</span>
                <kbd class="px-2 py-1 bg-gray-200 rounded text-xs">Ctrl + ?</kbd>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Close Modal</span>
                <kbd class="px-2 py-1 bg-gray-200 rounded text-xs">Esc</kbd>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- FAQs -->
      <div>
        <h4 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <svg class="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Frequently Asked Questions
        </h4>
        <div class="space-y-4">
          <details class="group">
            <summary class="flex justify-between items-center font-medium cursor-pointer list-none p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
              <span>How do I change task priorities?</span>
              <span class="transition group-open:rotate-180">
                <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24">
                  <path d="m6 9 6 6 6-6"></path>
                </svg>
              </span>
            </summary>
            <p class="text-gray-600 mt-3 px-3">
              Click on any task to open the edit modal, then select a new priority level from the dropdown menu. Changes are saved automatically.
            </p>
          </details>

          <details class="group">
            <summary class="flex justify-between items-center font-medium cursor-pointer list-none p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
              <span>Can I assign multiple people to one task?</span>
              <span class="transition group-open:rotate-180">
                <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24">
                  <path d="m6 9 6 6 6-6"></path>
                </svg>
              </span>
            </summary>
            <p class="text-gray-600 mt-3 px-3">
              Currently, each task can only be assigned to one person. However, you can create subtasks and assign them to different team members for collaborative work.
            </p>
          </details>

          <details class="group">
            <summary class="flex justify-between items-center font-medium cursor-pointer list-none p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
              <span>How do I export my data?</span>
              <span class="transition group-open:rotate-180">
                <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24">
                  <path d="m6 9 6 6 6-6"></path>
                </svg>
              </span>
            </summary>
            <p class="text-gray-600 mt-3 px-3">
              Go to Reports and click the "Export Report" button. You can export data as PDF or CSV format for external analysis or backup purposes.
            </p>
          </details>
        </div>
      </div>

      <!-- Contact Support -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h5 class="font-medium text-blue-900 mb-2 flex items-center">
          <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
          </svg>
          Need More Help?
        </h5>
        <p class="text-sm text-blue-800 mb-3">
          Can't find what you're looking for? Our support team is here to help!
        </p>
        <div class="flex space-x-3">
          <button class="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200">
            📧 Email Support
          </button>
          <button class="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200">
            💬 Live Chat
          </button>
          <button class="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200">
            📖 Documentation
          </button>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import BaseModal from './BaseModal.vue'

defineProps({
  show: Boolean
})

defineEmits(['update:show'])
</script>
