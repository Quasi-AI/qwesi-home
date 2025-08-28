<template>
  <Teleport to="body">
    <Transition
      enter-active-class="modal-enter-active"
      enter-from-class="modal-enter-from"
      enter-to-class="modal-enter-to"
      leave-active-class="modal-leave-active"
      leave-from-class="modal-leave-from"
      leave-to-class="modal-leave-to"
    >
      <div v-if="show" class="modal-overlay" @click.self="closeModal">
        <!-- Animated Background Particles -->
        <div class="modal-particles">
          <div class="particle particle-1"></div>
          <div class="particle particle-2"></div>
          <div class="particle particle-3"></div>
          <div class="particle particle-4"></div>
          <div class="particle particle-5"></div>
        </div>

        <div class="modal-container">
          <!-- Background Blur Overlay -->
          <Transition
            enter-active-class="backdrop-enter"
            enter-from-class="backdrop-enter-from"
            enter-to-class="backdrop-enter-to"
            leave-active-class="backdrop-leave"
            leave-from-class="backdrop-leave-from"
            leave-to-class="backdrop-leave-to"
          >
            <div v-if="show" class="modal-backdrop"></div>
          </Transition>

          <!-- Enhanced Modal Panel -->
          <div class="modal-panel">
            <!-- Glassmorphism Background Layers -->
            <div class="panel-backdrop"></div>
            <div class="panel-glow"></div>
            <div class="panel-border"></div>
            
            <!-- Content Container -->
            <div class="modal-content">
              <!-- Enhanced Header -->
              <div class="modal-header">
                <div class="header-content">
                  <div class="title-section">
                    <h3 class="modal-title">{{ title }}</h3>
                    <div class="title-decoration"></div>
                  </div>
                  <div class="header-actions">
                    <button @click="closeModal" class="close-button">
                      <div class="close-bg"></div>
                      <div class="close-icon">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                    </button>
                  </div>
                </div>
                <div class="header-glow"></div>
              </div>

              <!-- Enhanced Content Area -->
              <div class="content-area">
                <div class="content-wrapper">
                  <slot></slot>
                </div>
                <!-- Content Gradient Overlay -->
                <div class="content-overlay"></div>
              </div>
            </div>

            <!-- Interactive Border Effects -->
            <div class="interactive-border">
              <div class="border-segment segment-1"></div>
              <div class="border-segment segment-2"></div>
              <div class="border-segment segment-3"></div>
              <div class="border-segment segment-4"></div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:show'])

const closeModal = () => {
  emit('update:show', false)
}
</script>

<style scoped>
/* Base Modal Overlay */
.modal-overlay {
  @apply fixed inset-0 z-50 overflow-y-auto;
  backdrop-filter: blur(12px);
  background: rgba(15, 23, 42, 0.4);
}

.modal-container {
  @apply flex items-center justify-center min-h-screen px-4 py-8;
  @apply relative;
}

/* Animated Background Particles */
.modal-particles {
  @apply absolute inset-0 pointer-events-none overflow-hidden;
}

.particle {
  @apply absolute rounded-full opacity-20;
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
}

.particle-1 {
  @apply w-2 h-2 top-1/4 left-1/4;
  animation: float 6s ease-in-out infinite;
}

.particle-2 {
  @apply w-1 h-1 top-3/4 right-1/4;
  animation: float 8s ease-in-out infinite reverse;
}

.particle-3 {
  @apply w-3 h-3 top-1/2 left-1/3;
  animation: pulse 4s ease-in-out infinite;
}

.particle-4 {
  @apply w-1.5 h-1.5 top-1/3 right-1/3;
  animation: float 7s ease-in-out infinite;
  animation-delay: 2s;
}

.particle-5 {
  @apply w-2.5 h-2.5 bottom-1/4 left-1/2;
  animation: pulse 5s ease-in-out infinite;
  animation-delay: 1s;
}

/* Enhanced Backdrop */
.modal-backdrop {
  @apply absolute inset-0 transition-all duration-500;
  background: radial-gradient(circle at center, rgba(59, 130, 246, 0.15), rgba(15, 23, 42, 0.6));
}

/* Ultra-Modern Modal Panel */
.modal-panel {
  @apply relative w-full max-w-md mx-auto;
  @apply transform transition-all duration-500 ease-out;
}

/* Glassmorphism Layers */
.panel-backdrop {
  @apply absolute inset-0 rounded-3xl;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.panel-glow {
  @apply absolute -inset-1 rounded-3xl opacity-0 transition-opacity duration-700;
  background: linear-gradient(45deg, 
    rgba(59, 130, 246, 0.3), 
    rgba(139, 92, 246, 0.3), 
    rgba(236, 72, 153, 0.3)
  );
  filter: blur(20px);
  animation: glow-pulse 3s ease-in-out infinite;
}

.panel-border {
  @apply absolute inset-0 rounded-3xl;
  background: linear-gradient(45deg, 
    rgba(59, 130, 246, 0.2), 
    rgba(139, 92, 246, 0.2), 
    transparent, 
    rgba(236, 72, 153, 0.2)
  );
  padding: 2px;
}

.panel-border::before {
  content: '';
  @apply absolute inset-0 rounded-3xl;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
}

/* Interactive Border Effects */
.interactive-border {
  @apply absolute inset-0 rounded-3xl overflow-hidden pointer-events-none;
}

.border-segment {
  @apply absolute bg-gradient-to-r from-transparent via-blue-500 to-transparent;
  @apply opacity-0 transition-opacity duration-300;
  height: 2px;
}

.segment-1 {
  @apply top-0 left-0 right-0;
  animation: border-flow 2s linear infinite;
}

.segment-2 {
  @apply top-0 bottom-0 right-0;
  @apply bg-gradient-to-b;
  width: 2px;
  animation: border-flow 2s linear infinite;
  animation-delay: 0.5s;
}

.segment-3 {
  @apply bottom-0 left-0 right-0;
  animation: border-flow 2s linear infinite reverse;
  animation-delay: 1s;
}

.segment-4 {
  @apply top-0 bottom-0 left-0;
  @apply bg-gradient-to-t;
  width: 2px;
  animation: border-flow 2s linear infinite reverse;
  animation-delay: 1.5s;
}

.modal-panel:hover .border-segment {
  @apply opacity-60;
}

/* Content Structure */
.modal-content {
  @apply relative z-10 p-8;
}

/* Enhanced Header */
.modal-header {
  @apply relative mb-6;
}

.header-content {
  @apply flex items-start justify-between;
}

.title-section {
  @apply flex-1 space-y-2;
}

.modal-title {
  @apply text-xl font-bold;
  background: linear-gradient(135deg, #1e293b, #3730a3, #7c3aed);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-variant: small-caps;
  letter-spacing: -0.025em;
}

.title-decoration {
  @apply w-16 h-1 rounded-full;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
  animation: decoration-shift 3s ease-in-out infinite;
}

.header-glow {
  @apply absolute -inset-2 opacity-0 transition-opacity duration-300;
  background: radial-gradient(circle at center, rgba(59, 130, 246, 0.1), transparent);
  border-radius: 1rem;
}

.modal-header:hover .header-glow {
  @apply opacity-100;
}

/* Close Button */
.close-button {
  @apply relative p-2.5 rounded-2xl transition-all duration-300;
  @apply hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-500/20;
}

.close-bg {
  @apply absolute inset-0 rounded-2xl transition-all duration-300;
  background: linear-gradient(135deg, rgba(248, 250, 252, 0.8), rgba(241, 245, 249, 0.6));
  backdrop-filter: blur(10px);
}

.close-button:hover .close-bg {
  background: linear-gradient(135deg, rgba(254, 226, 226, 0.9), rgba(252, 231, 243, 0.7));
}

.close-icon {
  @apply relative z-10 w-5 h-5 text-slate-500 transition-colors duration-300;
}

.close-button:hover .close-icon {
  @apply text-red-500;
}

/* Enhanced Content Area */
.content-area {
  @apply relative;
}

.content-wrapper {
  @apply relative z-10;
}

.content-overlay {
  @apply absolute inset-0 pointer-events-none;
  background: radial-gradient(circle at top, 
    rgba(59, 130, 246, 0.02), 
    transparent 50%, 
    rgba(139, 92, 246, 0.02)
  );
  border-radius: 1rem;
}

/* Transition Classes */
.modal-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(-20px);
}

.modal-enter-to,
.modal-leave-from {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.backdrop-enter {
  transition: opacity 0.4s ease-out;
}

.backdrop-leave {
  transition: opacity 0.3s ease-in;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

.backdrop-enter-to,
.backdrop-leave-from {
  opacity: 1;
}

/* Animations */
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(180deg); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.2; }
  50% { transform: scale(1.5); opacity: 0.4; }
}

@keyframes glow-pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

@keyframes decoration-shift {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(4px); }
}

@keyframes border-flow {
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
}

/* Responsive Design */
@media (max-width: 640px) {
  .modal-container {
    @apply px-4 py-4;
  }
  
  .modal-content {
    @apply p-6;
  }
  
  .modal-title {
    @apply text-lg;
  }
  
  .modal-panel {
    @apply max-w-sm;
  }
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  .modal-overlay {
    background: rgba(0, 0, 0, 0.6);
  }
  
  .panel-backdrop {
    background: rgba(15, 23, 42, 0.95);
    border: 1px solid rgba(71, 85, 105, 0.2);
  }
  
  .panel-border::before {
    background: rgba(15, 23, 42, 0.98);
  }
  
  .modal-title {
    background: linear-gradient(135deg, #f1f5f9, #60a5fa, #a78bfa);
    background-clip: text;
    -webkit-background-clip: text;
  }
  
  .close-bg {
    background: linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(51, 65, 85, 0.6));
  }
  
  .close-button:hover .close-bg {
    background: linear-gradient(135deg, rgba(127, 29, 29, 0.9), rgba(131, 24, 67, 0.7));
  }
  
  .close-icon {
    @apply text-slate-400;
  }
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  .particle,
  .panel-glow,
  .border-segment,
  .title-decoration {
    animation: none;
  }
  
  .modal-enter-active,
  .modal-leave-active,
  .backdrop-enter,
  .backdrop-leave {
    transition-duration: 0.1s;
  }
  
  .close-button:hover {
    transform: none;
  }
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  .panel-backdrop {
    border: 2px solid #000;
  }
  
  .modal-title {
    color: #000;
    background: none;
    -webkit-text-fill-color: initial;
  }
  
  .close-icon {
    color: #000;
  }
}

/* Focus Management */
.modal-overlay:focus-within .panel-glow {
  @apply opacity-100;
}

/* Custom Scrollbar for Content */
.content-wrapper {
  scrollbar-width: thin;
  scrollbar-color: rgba(59, 130, 246, 0.3) transparent;
}

.content-wrapper::-webkit-scrollbar {
  width: 4px;
}

.content-wrapper::-webkit-scrollbar-track {
  background: transparent;
}

.content-wrapper::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.3));
  border-radius: 2px;
}

.content-wrapper::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, rgba(59, 130, 246, 0.5), rgba(139, 92, 246, 0.5));
}
</style>