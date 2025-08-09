<template>
  <div class="alert-container">
    <transition-group name="alert" tag="div">
      <div
        v-for="alert in alerts"
        :key="alert.id"
        :class="[
          'alert',
          `alert-${alert.type}`,
          { 'alert-dismissible': alert.dismissible }
        ]"
        @click="alert.dismissible && removeAlert(alert.id)"
      >
        <div class="alert-icon">
          <i :class="getIcon(alert.type)"></i>
        </div>
        <div class="alert-content">
          <h4 v-if="alert.title" class="alert-title">{{ alert.title }}</h4>
          <p class="alert-message">{{ alert.message }}</p>
        </div>
        <button
          v-if="alert.dismissible"
          @click.stop="removeAlert(alert.id)"
          class="alert-close"
        >
          <i class="fas fa-times"></i>
        </button>
        <div
          v-if="alert.duration"
          class="alert-progress"
          :style="{ animationDuration: alert.duration + 'ms' }"
        ></div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const alerts = ref([])
let alertId = 0

const getIcon = (type) => {
  const icons = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
    warning: 'fas fa-exclamation-triangle',
    info: 'fas fa-info-circle'
  }
  return icons[type] || icons.info
}

const addAlert = (options) => {
  const alert = {
    id: ++alertId,
    type: options.type || 'info',
    title: options.title || '',
    message: options.message || '',
    duration: options.duration || 5000,
    dismissible: options.dismissible !== false
  }
  
  alerts.value.push(alert)
  
  if (alert.duration > 0) {
    setTimeout(() => {
      removeAlert(alert.id)
    }, alert.duration)
  }
  
  return alert.id
}

const removeAlert = (id) => {
  const index = alerts.value.findIndex(alert => alert.id === id)
  if (index > -1) {
    alerts.value.splice(index, 1)
  }
}

const clearAllAlerts = () => {
  alerts.value = []
}

// Expose methods for external use
defineExpose({
  addAlert,
  removeAlert,
  clearAllAlerts,
  success: (message, options = {}) => addAlert({ ...options, type: 'success', message }),
  error: (message, options = {}) => addAlert({ ...options, type: 'error', message }),
  warning: (message, options = {}) => addAlert({ ...options, type: 'warning', message }),
  info: (message, options = {}) => addAlert({ ...options, type: 'info', message })
})
</script>

<style scoped>
.alert-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  width: 400px;
  max-width: calc(100vw - 40px);
}

.alert {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
  padding: 16px 20px;
  border-radius: 12px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  cursor: default;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.alert:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.alert-dismissible {
  cursor: pointer;
}

.alert-success {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.9), rgba(22, 163, 74, 0.9));
  border-color: rgba(34, 197, 94, 0.3);
  color: white;
}

.alert-error {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.9));
  border-color: rgba(239, 68, 68, 0.3);
  color: white;
}

.alert-warning {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.9), rgba(217, 119, 6, 0.9));
  border-color: rgba(245, 158, 11, 0.3);
  color: white;
}

.alert-info {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(37, 99, 235, 0.9));
  border-color: rgba(59, 130, 246, 0.3);
  color: white;
}

.alert-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  margin-top: 2px;
}

.alert-content {
  flex: 1;
  min-width: 0;
}

.alert-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
  line-height: 1.3;
}

.alert-message {
  font-size: 14px;
  margin: 0;
  line-height: 1.4;
  opacity: 0.95;
}

.alert-close {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 12px;
}

.alert-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.alert-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.4);
  animation: progress-bar linear forwards;
  border-radius: 0 0 12px 12px;
}

@keyframes progress-bar {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

/* Transition animations */
.alert-enter-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.alert-leave-active {
  transition: all 0.3s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}

.alert-enter-from {
  transform: translateX(100%) scale(0.8);
  opacity: 0;
}

.alert-leave-to {
  transform: translateX(100%) scale(0.8);
  opacity: 0;
}

.alert-move {
  transition: transform 0.3s ease;
}

/* Responsive design */
@media (max-width: 480px) {
  .alert-container {
    width: calc(100vw - 20px);
    right: 10px;
    top: 10px;
  }
  
  .alert {
    padding: 14px 16px;
  }
  
  .alert-title {
    font-size: 15px;
  }
  
  .alert-message {
    font-size: 13px;
  }
}
</style>