<template>
  <!-- Modal Overlay -->
  <div 
    v-if="show" 
    class="modal-overlay"
    @click="handleOverlayClick"
    @keydown.esc="handleClose"
    tabindex="0"
  >
    <!-- Modal Container -->
    <div 
      class="modal-container"
      @click.stop
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
    >
      <!-- Modal Backdrop -->
      <div class="modal-backdrop"></div>
      
      <!-- Modal Content -->
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <div class="modal-title-section">
            <h3 :id="titleId" class="modal-title">{{ title }}</h3>
            <div class="title-decoration"></div>
          </div>
          <button 
            @click="handleClose" 
            class="modal-close"
            aria-label="Close modal"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Modal'
  },
  closeOnOverlayClick: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:show', 'close'])

// Generate unique ID for aria-labelledby
const titleId = computed(() => `modal-title-${Math.random().toString(36).substr(2, 9)}`)

// Handle close events
const handleClose = () => {
  emit('update:show', false)
  emit('close')
}

// Handle overlay clicks
const handleOverlayClick = () => {
  if (props.closeOnOverlayClick) {
    handleClose()
  }
}

// Handle body scroll lock
const lockBodyScroll = () => {
  const scrollY = window.scrollY
  document.body.style.position = 'fixed'
  document.body.style.top = `-${scrollY}px`
  document.body.style.width = '100%'
  document.body.classList.add('modal-open')
}

const unlockBodyScroll = () => {
  const scrollY = document.body.style.top
  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.width = ''
  document.body.classList.remove('modal-open')
  
  if (scrollY) {
    window.scrollTo(0, parseInt(scrollY || '0') * -1)
  }
}

// Watch for show prop changes
watch(() => props.show, (newVal) => {
  if (newVal) {
    lockBodyScroll()
    // Focus the modal for keyboard navigation
    setTimeout(() => {
      const modalOverlay = document.querySelector('.modal-overlay')
      if (modalOverlay) {
        modalOverlay.focus()
      }
    }, 100)
  } else {
    unlockBodyScroll()
  }
}, { immediate: true })

// Handle escape key globally
const handleEscapeKey = (event) => {
  if (event.key === 'Escape' && props.show) {
    handleClose()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscapeKey)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscapeKey)
  // Clean up body styles if component unmounts with modal open
  if (props.show) {
    unlockBodyScroll()
  }
})
</script>

<style scoped>
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;
  padding: 1rem;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Modal Container */
.modal-container {
  position: relative;
  width: 100%;
  max-width: 42rem;
  max-height: 90vh;
  overflow: hidden;
  border-radius: 1.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from { 
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Modal Backdrop */
.modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.6);
}

/* Modal Content */
.modal-content {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

/* Modal Header */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
  flex-shrink: 0;
}

.modal-title-section {
  space-y: 0.5rem;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.title-decoration {
  width: 3rem;
  height: 0.25rem;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 9999px;
}

.modal-close {
  padding: 0.5rem;
  color: #64748b;
  background: none;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  color: #374151;
  background: rgba(248, 250, 252, 0.8);
}

.modal-close svg {
  width: 1.25rem;
  height: 1.25rem;
}

/* Modal Body */
.modal-body {
  padding: 0 2rem 2rem;
  overflow-y: auto;
  flex: 1;
}

/* Responsive Design */
@media (max-width: 768px) {
  .modal-container {
    max-width: calc(100vw - 1rem);
    margin: 0.5rem;
  }
  
  .modal-header {
    padding: 1.25rem 1.5rem;
  }
  
  .modal-body {
    padding: 0 1.5rem 1.5rem;
  }
  
  .modal-title {
    font-size: 1.125rem;
  }
}

@media (max-width: 480px) {
  .modal-overlay {
    padding: 0.5rem;
  }
  
  .modal-container {
    max-width: 100%;
    border-radius: 1rem;
  }
  
  .modal-header {
    padding: 1rem 1.25rem;
  }
  
  .modal-body {
    padding: 0 1.25rem 1.25rem;
  }
}

/* Custom Scrollbar */
.modal-body {
  scrollbar-width: thin;
  scrollbar-color: rgba(148, 163, 184, 0.3) transparent;
}

.modal-body::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, rgba(148, 163, 184, 0.3), rgba(148, 163, 184, 0.5));
  border-radius: 3px;
  transition: all 0.3s ease;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, rgba(148, 163, 184, 0.5), rgba(148, 163, 184, 0.7));
}

/* Focus states for accessibility */
.modal-close:focus {
  outline: none;
  ring: 2px solid #3b82f6;
  ring-offset: 2px;
}

.modal-overlay:focus {
  outline: none;
}

/* Prevent body scroll when modal is open */
:global(body.modal-open) {
  overflow: hidden;
  height: 100vh;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .modal-backdrop {
    background: rgba(255, 255, 255, 0.98);
    border: 2px solid #000;
  }
  
  .modal-title {
    color: #000;
  }
  
  .modal-close {
    border: 1px solid #000;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .modal-overlay,
  .modal-container {
    animation: none;
  }
}
</style>