<template>
  <BaseModal 
    :show="show" 
    @update:show="$emit('update:show', $event)"
    title="Help & Tips"
  >
    <div class="help-content">
      <!-- Quick Tips Section -->
      <div class="content-section">
        <div class="section-header">
          <div class="header-icon gradient-orange">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </div>
          <h4 class="section-title">Quick Tips</h4>
          <div class="title-glow"></div>
        </div>
        
        <div class="tips-grid">
          <div class="tip-card card-orange">
            <div class="card-backdrop"></div>
            <div class="card-glow glow-orange"></div>
            <div class="card-content">
              <div class="card-header">
                <div class="emoji-icon">💡</div>
                <h5 class="card-title">Task Management</h5>
              </div>
              <ul class="tip-list">
                <li class="tip-item">
                  <div class="bullet-point"></div>
                  <span>Use priority levels to organize your work effectively</span>
                </li>
                <li class="tip-item">
                  <div class="bullet-point"></div>
                  <span>Set due dates to keep track of deadlines</span>
                </li>
                <li class="tip-item">
                  <div class="bullet-point"></div>
                  <span>Add tags to categorize and filter tasks easily</span>
                </li>
                <li class="tip-item">
                  <div class="bullet-point"></div>
                  <span>Assign tasks to team members for better collaboration</span>
                </li>
              </ul>
            </div>
          </div>

          <div class="tip-card card-emerald">
            <div class="card-backdrop"></div>
            <div class="card-glow glow-emerald"></div>
            <div class="card-content">
              <div class="card-header">
                <div class="emoji-icon">👥</div>
                <h5 class="card-title">Team Collaboration</h5>
              </div>
              <ul class="tip-list">
                <li class="tip-item">
                  <div class="bullet-point"></div>
                  <span>Invite team members with appropriate roles and permissions</span>
                </li>
                <li class="tip-item">
                  <div class="bullet-point"></div>
                  <span>Use @mentions in task descriptions to notify team members</span>
                </li>
                <li class="tip-item">
                  <div class="bullet-point"></div>
                  <span>Regular check-ins help maintain project momentum</span>
                </li>
                <li class="tip-item">
                  <div class="bullet-point"></div>
                  <span>Share progress updates to keep everyone informed</span>
                </li>
              </ul>
            </div>
          </div>

          <div class="tip-card card-purple">
            <div class="card-backdrop"></div>
            <div class="card-glow glow-purple"></div>
            <div class="card-content">
              <div class="card-header">
                <div class="emoji-icon">📊</div>
                <h5 class="card-title">Reports & Analytics</h5>
              </div>
              <ul class="tip-list">
                <li class="tip-item">
                  <div class="bullet-point"></div>
                  <span>Monitor completion rates to track team productivity</span>
                </li>
                <li class="tip-item">
                  <div class="bullet-point"></div>
                  <span>Use activity logs to identify bottlenecks</span>
                </li>
                <li class="tip-item">
                  <div class="bullet-point"></div>
                  <span>Export reports for stakeholder meetings</span>
                </li>
                <li class="tip-item">
                  <div class="bullet-point"></div>
                  <span>Review team performance regularly for improvements</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Keyboard Shortcuts Section -->
      <div class="content-section">
        <div class="section-header">
          <div class="header-icon gradient-blue">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </div>
          <h4 class="section-title">Keyboard Shortcuts</h4>
          <div class="title-glow"></div>
        </div>
        
        <div class="shortcuts-container">
          <div class="shortcuts-backdrop"></div>
          <div class="shortcuts-grid">
            <div class="shortcut-group">
              <div class="shortcut-item">
                <span class="shortcut-label">New Task</span>
                <div class="shortcut-keys">
                  <kbd class="key-badge">Ctrl</kbd>
                  <span class="key-separator">+</span>
                  <kbd class="key-badge">N</kbd>
                </div>
              </div>
              <div class="shortcut-item">
                <span class="shortcut-label">Search Tasks</span>
                <div class="shortcut-keys">
                  <kbd class="key-badge">Ctrl</kbd>
                  <span class="key-separator">+</span>
                  <kbd class="key-badge">F</kbd>
                </div>
              </div>
              <div class="shortcut-item">
                <span class="shortcut-label">Invite Member</span>
                <div class="shortcut-keys">
                  <kbd class="key-badge">Ctrl</kbd>
                  <span class="key-separator">+</span>
                  <kbd class="key-badge">I</kbd>
                </div>
              </div>
            </div>
            <div class="shortcut-group">
              <div class="shortcut-item">
                <span class="shortcut-label">View Reports</span>
                <div class="shortcut-keys">
                  <kbd class="key-badge">Ctrl</kbd>
                  <span class="key-separator">+</span>
                  <kbd class="key-badge">R</kbd>
                </div>
              </div>
              <div class="shortcut-item">
                <span class="shortcut-label">Help</span>
                <div class="shortcut-keys">
                  <kbd class="key-badge">Ctrl</kbd>
                  <span class="key-separator">+</span>
                  <kbd class="key-badge">?</kbd>
                </div>
              </div>
              <div class="shortcut-item">
                <span class="shortcut-label">Close Modal</span>
                <div class="shortcut-keys">
                  <kbd class="key-badge special">Esc</kbd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- FAQs Section -->
      <div class="content-section">
        <div class="section-header">
          <div class="header-icon gradient-indigo">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 class="section-title">Frequently Asked Questions</h4>
          <div class="title-glow"></div>
        </div>
        
        <div class="faqs-container">
          <details class="faq-item group">
            <summary class="faq-summary">
              <div class="faq-question">How do I change task priorities?</div>
              <div class="faq-arrow">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 9 6 6 6-6"></path>
                </svg>
              </div>
            </summary>
            <div class="faq-answer">
              <p>Click on any task to open the edit modal, then select a new priority level from the dropdown menu. Changes are saved automatically.</p>
            </div>
          </details>

          <details class="faq-item group">
            <summary class="faq-summary">
              <div class="faq-question">Can I assign multiple people to one task?</div>
              <div class="faq-arrow">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 9 6 6 6-6"></path>
                </svg>
              </div>
            </summary>
            <div class="faq-answer">
              <p>Currently, each task can only be assigned to one person. However, you can create subtasks and assign them to different team members for collaborative work.</p>
            </div>
          </details>

          <details class="faq-item group">
            <summary class="faq-summary">
              <div class="faq-question">How do I export my data?</div>
              <div class="faq-arrow">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 9 6 6 6-6"></path>
                </svg>
              </div>
            </summary>
            <div class="faq-answer">
              <p>Go to Reports and click the "Export Report" button. You can export data as PDF or CSV format for external analysis or backup purposes.</p>
            </div>
          </details>
        </div>
      </div>

      <!-- Contact Support Section -->
      <div class="support-section">
        <div class="support-backdrop"></div>
        <div class="support-glow"></div>
        <div class="support-content">
          <div class="support-header">
            <div class="support-icon">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
              </svg>
            </div>
            <h5 class="support-title">Need More Help?</h5>
          </div>
          <p class="support-description">
            Can't find what you're looking for? Our support team is here to help!
          </p>
          <div class="support-actions">
            <button class="support-btn email-btn">
              <div class="btn-backdrop"></div>
              <span class="btn-emoji">📧</span>
              <span class="btn-text">Email Support</span>
            </button>
            <button class="support-btn chat-btn">
              <div class="btn-backdrop"></div>
              <span class="btn-emoji">💬</span>
              <span class="btn-text">Live Chat</span>
            </button>
            <button class="support-btn docs-btn">
              <div class="btn-backdrop"></div>
              <span class="btn-emoji">📖</span>
              <span class="btn-text">Documentation</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import BaseModal from '~/pages/modals/BaseModal.vue'

defineProps({
  show: Boolean
})

defineEmits(['update:show'])
</script>

<style scoped>
/* Base Container */
.help-content {
  @apply space-y-8;
}

.content-section {
  @apply space-y-6;
}

/* Section Headers */
.section-header {
  @apply relative flex items-center space-x-4;
}

.header-icon {
  @apply w-6 h-6 p-1.5 rounded-xl flex items-center justify-center;
  @apply shadow-lg transform transition-all duration-300 hover:scale-110;
}

.header-icon svg {
  @apply w-full h-full text-white;
}

.gradient-orange {
  background: linear-gradient(135deg, #f97316, #ea580c);
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
}

.gradient-blue {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.gradient-indigo {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.section-title {
  @apply text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent;
}

.title-glow {
  @apply flex-1 h-px bg-gradient-to-r from-slate-300 via-blue-300 to-transparent opacity-60;
}

/* Tips Grid */
.tips-grid {
  @apply space-y-4;
}

.tip-card {
  @apply relative rounded-2xl overflow-hidden;
  @apply transform transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02];
}

.card-backdrop {
  @apply absolute inset-0;
  backdrop-filter: blur(20px);
}

.card-orange .card-backdrop {
  background: linear-gradient(135deg, rgba(254, 215, 170, 0.9), rgba(251, 191, 36, 0.3));
  border: 1px solid rgba(249, 115, 22, 0.2);
}

.card-emerald .card-backdrop {
  background: linear-gradient(135deg, rgba(167, 243, 208, 0.9), rgba(34, 197, 94, 0.3));
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.card-purple .card-backdrop {
  background: linear-gradient(135deg, rgba(196, 181, 253, 0.9), rgba(147, 51, 234, 0.3));
  border: 1px solid rgba(147, 51, 234, 0.2);
}

.card-glow {
  @apply absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500;
  filter: blur(8px);
}

.glow-orange {
  background: linear-gradient(45deg, rgba(249, 115, 22, 0.3), rgba(251, 146, 60, 0.3));
}

.glow-emerald {
  background: linear-gradient(45deg, rgba(34, 197, 94, 0.3), rgba(74, 222, 128, 0.3));
}

.glow-purple {
  background: linear-gradient(45deg, rgba(147, 51, 234, 0.3), rgba(168, 85, 247, 0.3));
}

.tip-card:hover .card-glow {
  @apply opacity-100;
}

.card-content {
  @apply relative z-10 p-6;
}

.card-header {
  @apply flex items-center space-x-3 mb-4;
}

.emoji-icon {
  @apply text-2xl;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.card-title {
  @apply font-bold text-slate-900;
}

.tip-list {
  @apply space-y-3;
}

.tip-item {
  @apply flex items-start space-x-3;
}

.bullet-point {
  @apply w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0;
  @apply bg-gradient-to-r from-blue-500 to-purple-500;
}

.tip-item span {
  @apply text-sm text-slate-700 leading-relaxed;
}

/* Keyboard Shortcuts */
.shortcuts-container {
  @apply relative rounded-2xl p-6;
}

.shortcuts-backdrop {
  @apply absolute inset-0 rounded-2xl;
  background: linear-gradient(135deg, rgba(248, 250, 252, 0.9), rgba(241, 245, 249, 0.7));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(203, 213, 225, 0.3);
}

.shortcuts-grid {
  @apply relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-6;
}

.shortcut-group {
  @apply space-y-4;
}

.shortcut-item {
  @apply flex justify-between items-center py-2;
}

.shortcut-label {
  @apply text-sm font-medium text-slate-600;
}

.shortcut-keys {
  @apply flex items-center space-x-1;
}

.key-badge {
  @apply px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200;
  @apply bg-gradient-to-b from-slate-100 to-slate-200;
  @apply border border-slate-300 shadow-sm;
  @apply text-slate-700;
}

.key-badge.special {
  @apply bg-gradient-to-b from-blue-100 to-blue-200;
  @apply border-blue-300 text-blue-700;
}

.key-separator {
  @apply text-slate-400 text-xs font-medium;
}

/* FAQs */
.faqs-container {
  @apply space-y-3;
}

.faq-item {
  @apply rounded-2xl overflow-hidden;
  @apply border border-slate-200/60 transition-all duration-300;
  backdrop-filter: blur(10px);
}

.faq-summary {
  @apply flex justify-between items-center p-4 cursor-pointer;
  @apply bg-gradient-to-r from-slate-50/80 to-white/60;
  @apply hover:from-slate-100/80 hover:to-slate-50/60;
  @apply transition-all duration-200 list-none;
}

.faq-question {
  @apply font-medium text-slate-900 flex-1;
}

.faq-arrow {
  @apply w-5 h-5 text-slate-500 transform transition-transform duration-300;
}

.faq-arrow svg {
  @apply w-full h-full;
}

.group[open] .faq-arrow {
  @apply rotate-180 text-blue-600;
}

.faq-answer {
  @apply p-4 bg-gradient-to-r from-white/90 to-slate-50/80;
  @apply border-t border-slate-200/40;
}

.faq-answer p {
  @apply text-sm text-slate-600 leading-relaxed;
}

/* Support Section */
.support-section {
  @apply relative rounded-2xl overflow-hidden;
}

.support-backdrop {
  @apply absolute inset-0;
  background: linear-gradient(135deg, rgba(219, 234, 254, 0.9), rgba(147, 197, 253, 0.3));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.support-glow {
  @apply absolute -inset-px rounded-2xl opacity-50;
  background: linear-gradient(45deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2));
  filter: blur(12px);
}

.support-content {
  @apply relative z-10 p-6;
}

.support-header {
  @apply flex items-center space-x-3 mb-3;
}

.support-icon {
  @apply w-5 h-5 text-blue-600;
}

.support-title {
  @apply font-bold text-blue-900;
}

.support-description {
  @apply text-sm text-blue-800 mb-6 leading-relaxed;
}

.support-actions {
  @apply flex flex-wrap gap-3;
}

.support-btn {
  @apply relative px-4 py-2 rounded-xl font-medium text-xs;
  @apply flex items-center space-x-2;
  @apply transform transition-all duration-300;
  @apply hover:scale-105 hover:shadow-lg;
}

.btn-backdrop {
  @apply absolute inset-0 rounded-xl transition-all duration-300;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(241, 245, 249, 0.6));
  backdrop-filter: blur(10px);
}

.support-btn:hover .btn-backdrop {
  background: linear-gradient(135deg, rgba(239, 246, 255, 0.9), rgba(219, 234, 254, 0.7));
}

.btn-emoji {
  @apply relative z-10;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.btn-text {
  @apply relative z-10 text-blue-700;
}

/* Responsive Design */
@media (max-width: 640px) {
  .shortcuts-grid {
    @apply grid-cols-1 gap-4;
  }
  
  .support-actions {
    @apply flex-col;
  }
  
  .support-btn {
    @apply justify-center;
  }
  
  .tips-grid {
    @apply space-y-3;
  }
  
  .card-content {
    @apply p-4;
  }
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  .section-title {
    @apply from-slate-100 to-slate-300;
  }
  
  .card-backdrop {
    background: rgba(15, 23, 42, 0.9) !important;
    border-color: rgba(71, 85, 105, 0.3) !important;
  }
  
  .card-title {
    @apply text-slate-100;
  }
  
  .tip-item span {
    @apply text-slate-300;
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .tip-card,
  .header-icon,
  .support-btn {
    transition: none;
    animation: none;
  }
  
  .tip-card:hover,
  .header-icon:hover,
  .support-btn:hover {
    transform: none;
  }
}
</style>