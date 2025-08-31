<template>
  <div class="forgot-password-container">
    <!-- Dynamic Background -->
    <div class="background-elements">
      <div class="floating-shape shape-1"></div>
      <div class="floating-shape shape-2"></div>
      <div class="floating-shape shape-3"></div>
      <div class="floating-shape shape-4"></div>
      <div class="mesh-gradient"></div>
      <div class="grid-overlay"></div>
    </div>

    <!-- Back Button -->
    <BackButton class="back-button" />

    <!-- Main Content -->
    <div class="main-wrapper">
      <!-- Left Side - Forgot Password Form -->
      <div class="form-section">
        <div class="form-container">
          <!-- Logo and Header -->
          <div class="header-section">
            <div class="logo-container">
              <div class="logo-wrapper">
                <img src="~/assets/images/qwesi-head.png" alt="QWESI AI Logo" class="logo-image" />
                <div class="logo-glow"></div>
              </div>
            </div>
            <div class="header-text">
              <h1 class="main-title">Reset Your Password</h1>
              <p class="subtitle">Enter your email to receive reset instructions</p>
            </div>
          </div>

          <!-- Success State -->
          <div v-if="emailSent" class="success-section">
            <div class="success-animation">
              <div class="email-icon-container">
                <div class="email-icon">
                  <i class="fas fa-envelope"></i>
                </div>
                <div class="email-waves">
                  <div class="wave wave-1"></div>
                  <div class="wave wave-2"></div>
                  <div class="wave wave-3"></div>
                </div>
                <div class="flying-envelope">
                  <i class="fas fa-paper-plane"></i>
                </div>
              </div>
            </div>
            
            <div class="success-content">
              <h2>Check Your Email!</h2>
              <p>Reset instructions have been sent to</p>
              <div class="email-highlight">
                <i class="fas fa-at"></i>
                <span>{{ form.email }}</span>
              </div>
              <div class="next-steps">
                <div class="step-item">
                  <div class="step-number">1</div>
                  <span>Check your email inbox</span>
                </div>
                <div class="step-item">
                  <div class="step-number">2</div>
                  <span>Click the reset link</span>
                </div>
                <div class="step-item">
                  <div class="step-number">3</div>
                  <span>Create your new password</span>
                </div>
              </div>
            </div>
            
            <div class="success-actions">
              <NuxtLink to="/auth/login" class="action-button primary">
                <i class="fas fa-sign-in-alt"></i>
                <span>Back to Sign In</span>
              </NuxtLink>
              <button @click="resendEmail" class="action-button secondary" :disabled="resendCooldown > 0">
                <i class="fas fa-redo"></i>
                <span v-if="resendCooldown > 0">Resend in {{ resendCooldown }}s</span>
                <span v-else>Resend Email</span>
              </button>
            </div>
          </div>

          <!-- Forgot Password Form -->
          <div v-else class="form-section-inner">
            <!-- Email Tips -->
            <div class="email-tips">
              <div class="tip-header">
                <i class="fas fa-lightbulb"></i>
                <span>Tip</span>
              </div>
              <p>Enter the email address associated with your Qwesi account</p>
            </div>

            <!-- Error Message -->
            <transition name="error">
              <div v-if="error" class="error-message">
                <div class="error-icon">
                  <i class="fas fa-exclamation-triangle"></i>
                </div>
                <div class="error-content">
                  <p>{{ error }}</p>
                </div>
                <button @click="error = ''" class="error-close">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </transition>

            <!-- Form -->
            <form @submit.prevent="handleForgotPassword" class="forgot-form">
              <!-- Email Field -->
              <div class="input-group">
                <label for="email" class="input-label">
                  <i class="fas fa-envelope"></i>
                  Email Address
                </label>
                <div class="input-wrapper">
                  <input 
                    id="email" 
                    v-model="form.email" 
                    type="email" 
                    required
                    class="form-input"
                    :class="{ 'valid': isValidEmail }"
                    placeholder="Enter your email address"
                    @input="validateEmail"
                  />
                  <div class="input-icon">
                    <i class="fas fa-at"></i>
                  </div>
                  <transition name="check">
                    <div v-if="isValidEmail" class="validation-check">
                      <i class="fas fa-check"></i>
                    </div>
                  </transition>
                </div>
                <transition name="fade">
                  <div v-if="emailError" class="field-error">
                    <i class="fas fa-exclamation-circle"></i>
                    {{ emailError }}
                  </div>
                </transition>
              </div>

              <!-- Submit Button -->
              <button 
                type="submit" 
                :disabled="loading || !isValidEmail"
                class="submit-button"
                :class="{ 'loading': loading }"
              >
                <div class="button-content">
                  <div v-if="loading" class="loading-spinner">
                    <div class="spinner"></div>
                  </div>
                  <i v-else class="fas fa-paper-plane"></i>
                  <span>{{ loading ? 'Sending Instructions...' : 'Send Reset Instructions' }}</span>
                </div>
                <div class="button-ripple"></div>
              </button>

              <!-- Alternative Actions -->
              <div class="form-footer">
                <div class="divider">
                  <span>or</span>
                </div>
                <div class="alternative-actions">
                  <NuxtLink to="/auth/login" class="link-button">
                    <i class="fas fa-arrow-left"></i>
                    <span>Back to Sign In</span>
                  </NuxtLink>
                  <NuxtLink to="/auth/register" class="link-button">
                    <i class="fas fa-user-plus"></i>
                    <span>Create Account</span>
                  </NuxtLink>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Right Side - Visual Elements -->
      <div class="visual-section">
        <div class="visual-content">
          <!-- Email Illustration -->
          <div class="email-illustration">
            <div class="mailbox-container">
              <div class="mailbox">
                <div class="mailbox-body">
                  <div class="mailbox-door"></div>
                  <div class="mailbox-flag"></div>
                </div>
                <div class="mailbox-post"></div>
              </div>
              <div class="floating-emails">
                <div class="floating-email email-1">
                  <i class="fas fa-envelope"></i>
                </div>
                <div class="floating-email email-2">
                  <i class="fas fa-envelope-open"></i>
                </div>
                <div class="floating-email email-3">
                  <i class="fas fa-paper-plane"></i>
                </div>
              </div>
            </div>
          </div>

          <!-- Security Info -->
          <div class="security-info">
            <h3>Secure Password Recovery</h3>
            <div class="security-features">
              <div class="security-item">
                <div class="security-icon">
                  <i class="fas fa-shield-alt"></i>
                </div>
                <div class="security-text">
                  <h4>Encrypted Links</h4>
                  <p>Reset links are encrypted and expire after 1 hour</p>
                </div>
              </div>
              <div class="security-item">
                <div class="security-icon">
                  <i class="fas fa-clock"></i>
                </div>
                <div class="security-text">
                  <h4>Time Limited</h4>
                  <p>Links automatically expire for your security</p>
                </div>
              </div>
              <div class="security-item">
                <div class="security-icon">
                  <i class="fas fa-user-lock"></i>
                </div>
                <div class="security-text">
                  <h4>Account Protected</h4>
                  <p>Your account remains secure during recovery</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Help Section -->
          <div class="help-section">
            <h4>Need Help?</h4>
            <div class="help-options">
              <a href="mailto:info@qwesi.org" class="help-option">
                <i class="fas fa-envelope"></i>
                <span>Contact Support</span>
              </a>
              <a href="tel:+12082796057" class="help-option">
                <i class="fas fa-phone"></i>
                <span>Call Us</span>
              </a>
              <NuxtLink to="/faq" class="help-option">
                <i class="fas fa-question-circle"></i>
                <span>View FAQ</span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/features/auth/stores/auth.store'
import BackButton from '@/shared/components/ui/back-button.vue'

const authStore = useAuthStore()
const router = useRouter()

// Reactive data
const loading = ref(false)
const emailSent = ref(false)
const error = ref('')
const emailError = ref('')
const resendCooldown = ref(0)

const form = ref({
  email: ''
})

// Email validation
const isValidEmail = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(form.value.email)
})

// Methods
const validateEmail = () => {
  emailError.value = ''
  if (form.value.email && !isValidEmail.value) {
    emailError.value = 'Please enter a valid email address'
  }
}

const handleForgotPassword = async () => {
  loading.value = true
  error.value = ''
  emailError.value = ''

  try {
    if (!isValidEmail.value) {
      emailError.value = 'Please enter a valid email address'
      return
    }

    const result = await authStore.forgotPassword(form.value.email)

    if (result.success) {
      emailSent.value = true
      startResendCooldown()
    } else {
      error.value = result.error || 'Failed to send reset email'
    }
  } catch (err) {
    console.error('Forgot password error:', err)
    error.value = 'An unexpected error occurred'
  } finally {
    loading.value = false
  }
}

const resendEmail = async () => {
  if (resendCooldown.value > 0) return
  await handleForgotPassword()
}

const startResendCooldown = () => {
  resendCooldown.value = 60
  const interval = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) {
      clearInterval(interval)
    }
  }, 1000)
}

// Lifecycle
onMounted(() => {
  if (authStore.isAuthenticated) {
    const redirectUrl = localStorage.getItem('redirect_after_login')
    if (redirectUrl) {
      localStorage.removeItem('redirect_after_login')
      navigateTo(redirectUrl)
    } else {
      navigateTo('/dashboard')
    }
  }
})

// Meta
useHead({
  title: 'Forgot Password - QWESI AI'
})
</script>

<style scoped>
/* CSS Variables */
:root {
  --primary: #6366f1;
  --primary-dark: #4f46e5;
  --secondary: #8b5cf6;
  --accent: #10b981;
  --danger: #ef4444;
  --warning: #f59e0b;
  --success: #10b981;
  --gradient-primary: linear-gradient(135deg, #6366f1, #8b5cf6);
  --gradient-success: linear-gradient(135deg, #10b981, #059669);
  --glass: rgba(255, 255, 255, 0.1);
  --glass-border: rgba(255, 255, 255, 0.2);
  --surface: rgba(255, 255, 255, 0.95);
  --text-primary: #0f172a;
  --text-secondary: #64748b;
}

/* Base Styles */
.forgot-password-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

/* Animated Background */
.background-elements {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.floating-shape {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05));
  animation: float 18s ease-in-out infinite;
}

.shape-1 {
  width: 250px;
  height: 250px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 180px;
  height: 180px;
  top: 70%;
  right: 15%;
  animation-delay: -6s;
}

.shape-3 {
  width: 120px;
  height: 120px;
  top: 30%;
  right: 30%;
  animation-delay: -12s;
}

.shape-4 {
  width: 200px;
  height: 200px;
  bottom: 10%;
  left: 60%;
  animation-delay: -9s;
}

.mesh-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.05) 0%, transparent 50%);
  animation: mesh-pulse 12s ease-in-out infinite;
}

.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  animation: grid-drift 20s linear infinite;
}

/* Back Button */
.back-button {
  position: fixed;
  top: 1.5rem;
  left: 1.5rem;
  z-index: 100;
  background: var(--glass);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 1rem;
  padding: 0.75rem;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

/* Main Layout */
.main-wrapper {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  position: relative;
  z-index: 10;
}

/* Form Section */
.form-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.form-container {
  max-width: 480px;
  width: 100%;
  background: var(--surface);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 2rem;
  padding: 3rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

/* Header Section */
.header-section {
  text-align: center;
  margin-bottom: 3rem;
}

.logo-container {
  position: relative;
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.logo-wrapper {
  position: relative;
}

.logo-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 2;
}

.logo-glow {
  position: absolute;
  inset: -15px;
  background: var(--gradient-primary);
  border-radius: 50%;
  filter: blur(20px);
  opacity: 0.3;
  animation: glow-pulse 3s ease-in-out infinite;
}

.main-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 1rem;
  font-weight: 500;
}

/* Success Section */
.success-section {
  text-align: center;
  padding: 2rem 0;
}

.success-animation {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
  height: 120px;
}

.email-icon-container {
  position: relative;
}

.email-icon {
  width: 80px;
  height: 80px;
  background: var(--gradient-primary);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  position: relative;
  z-index: 3;
  animation: email-bounce 0.6s ease-out;
}

.email-waves {
  position: absolute;
  inset: 0;
}

.wave {
  position: absolute;
  border-radius: 1rem;
  border: 2px solid var(--primary);
  animation: wave-expand 2s ease-out infinite;
}

.wave-1 {
  width: 100px;
  height: 100px;
  top: -10px;
  left: -10px;
  animation-delay: 0s;
}

.wave-2 {
  width: 120px;
  height: 120px;
  top: -20px;
  left: -20px;
  animation-delay: 0.4s;
}

.wave-3 {
  width: 140px;
  height: 140px;
  top: -30px;
  left: -30px;
  animation-delay: 0.8s;
}

.flying-envelope {
  position: absolute;
  top: -20px;
  right: -20px;
  color: var(--accent);
  font-size: 1.5rem;
  animation: fly-away 2s ease-out 1s both;
}

.success-content h2 {
  color: var(--text-primary);
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.success-content p {
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.email-highlight {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: #eef2ff;
  border: 1px solid #c7d2fe;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  margin: 1rem 0 2rem;
  color: var(--primary);
  font-weight: 600;
}

.next-steps {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 2rem 0;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-align: left;
}

.step-number {
  width: 24px;
  height: 24px;
  background: var(--gradient-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
}

.step-item span {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.success-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
}

/* Email Tips */
.email-tips {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 1rem;
  padding: 1rem;
  margin-bottom: 2rem;
}

.tip-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.tip-header i {
  color: var(--warning);
}

.tip-header span {
  color: var(--text-primary);
  font-weight: 600;
  font-size: 0.875rem;
}

.email-tips p {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin: 0;
}

/* Form */
.forgot-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.input-label i {
  color: var(--primary);
}

.input-wrapper {
  position: relative;
}

.form-input {
  width: 100%;
  padding: 1rem 3.5rem 1rem 3rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  font-size: 1rem;
  color: var(--text-primary);
  transition: all 0.3s ease;
  outline: none;
}

.form-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-input.valid {
  border-color: var(--success);
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  transition: all 0.3s ease;
}

.form-input:focus + .input-icon {
  color: var(--primary);
}

.validation-check {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  background: var(--success);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
}

/* Field Error */
.field-error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--danger);
  font-size: 0.875rem;
}

/* Error Message */
.error-message {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 1rem;
}

.error-icon {
  color: var(--danger);
  margin-top: 0.125rem;
}

.error-content {
  flex: 1;
}

.error-content p {
  color: #dc2626;
  font-size: 0.875rem;
  margin: 0;
}

.error-close {
  background: none;
  border: none;
  color: var(--danger);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.3s ease;
}

.error-close:hover {
  background: rgba(239, 68, 68, 0.1);
}

/* Submit Button */
.submit-button {
  position: relative;
  width: 100%;
  padding: 1rem 1.5rem;
  background: var(--gradient-primary);
  border: none;
  border-radius: 0.75rem;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  margin-top: 0.5rem;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(99, 102, 241, 0.3);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.button-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.button-ripple {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s ease;
}

.submit-button:hover .button-ripple {
  left: 100%;
}

/* Action Buttons */
.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-radius: 0.75rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.action-button.primary {
  background: var(--gradient-primary);
  color: white;
}

.action-button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(99, 102, 241, 0.3);
}

.action-button.secondary {
  background: white;
  color: var(--text-primary);
  border: 1px solid #e5e7eb;
}

.action-button.secondary:hover:not(:disabled) {
  background: #f8fafc;
  border-color: var(--primary);
}

.action-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Form Footer */
.form-footer {
  text-align: center;
  margin-top: 1rem;
}

.divider {
  position: relative;
  margin: 1.5rem 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e5e7eb;
}

.alternative-actions {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.link-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.link-button:hover {
  background: rgba(99, 102, 241, 0.1);
}

/* Visual Section */
.visual-section {
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.visual-content {
  max-width: 400px;
  width: 100%;
}

/* Email Illustration */
.email-illustration {
  margin-bottom: 3rem;
  display: flex;
  justify-content: center;
}

.mailbox-container {
  position: relative;
  width: 200px;
  height: 200px;
}

.mailbox {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

.mailbox-body {
  width: 80px;
  height: 60px;
  background: var(--gradient-primary);
  border-radius: 0.75rem 0.75rem 0.5rem 0.5rem;
  position: relative;
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);
}

.mailbox-door {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem 0.5rem 0.25rem 0.25rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.mailbox-flag {
  position: absolute;
  right: -10px;
  top: 10px;
  width: 20px;
  height: 12px;
  background: var(--danger);
  border-radius: 0.25rem;
  animation: flag-wave 2s ease-in-out infinite;
}

.mailbox-post {
  width: 8px;
  height: 40px;
  background: #64748b;
  border-radius: 4px;
  margin: 0 auto;
}

.floating-emails {
  position: absolute;
  inset: 0;
}

.floating-email {
  position: absolute;
  width: 32px;
  height: 32px;
  background: white;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: email-float 4s ease-in-out infinite;
}

.email-1 {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.email-2 {
  top: 30%;
  right: 15%;
  animation-delay: -1.3s;
}

.email-3 {
  bottom: 40%;
  left: 20%;
  animation-delay: -2.6s;
}

/* Security Info */
.security-info {
  margin-bottom: 3rem;
  text-align: center;
}

.security-info h3 {
  color: white;
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 2rem;
}

.security-features {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.security-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  text-align: left;
}

.security-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.security-text h4 {
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.security-text p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.75rem;
  line-height: 1.4;
  margin: 0;
}

/* Help Section */
.help-section {
  text-align: center;
}

.help-section h4 {
  color: white;
  font-weight: 600;
  margin-bottom: 1rem;
}

.help-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.help-option {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.75rem;
  color: white;
  text-decoration: none;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.help-option:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

/* Animations */
@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(8px, -8px) rotate(1deg); }
  50% { transform: translate(-4px, -12px) rotate(-0.5deg); }
  75% { transform: translate(-8px, 4px) rotate(0.5deg); }
}

@keyframes mesh-pulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.02); }
}

@keyframes grid-drift {
  0% { transform: translate(0, 0); }
  100% { transform: translate(40px, 40px); }
}

@keyframes glow-pulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.1); }
}

@keyframes email-bounce {
  0% { transform: scale(0) rotate(-180deg); }
  50% { transform: scale(1.2) rotate(-90deg); }
  100% { transform: scale(1) rotate(0deg); }
}

@keyframes wave-expand {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(1.4); opacity: 0; }
}

@keyframes fly-away {
  0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
  100% { transform: translate(60px, -60px) rotate(45deg); opacity: 0; }
}

@keyframes flag-wave {
  0%, 100% { transform: scaleX(1); }
  50% { transform: scaleX(1.2); }
}

@keyframes email-float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Transitions */
.error-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.error-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.error-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.error-leave-to {
  opacity: 0;
  transform: translateY(-5px) scale(0.98);
}

.check-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.check-enter-from {
  opacity: 0;
  transform: scale(0);
}

.fade-enter-active, .fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .main-wrapper {
    grid-template-columns: 1fr;
  }
  
  .visual-section {
    display: none;
  }
  
  .form-container {
    max-width: 600px;
  }
}

@media (max-width: 768px) {
  .back-button {
    top: 1rem;
    left: 1rem;
  }
  
  .form-section {
    padding: 1rem;
  }
  
  .form-container {
    padding: 2rem;
    border-radius: 1.5rem;
  }
  
  .main-title {
    font-size: 1.75rem;
  }
  
  .success-actions {
    gap: 0.75rem;
  }
  
  .alternative-actions {
    flex-direction: column;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .form-container {
    padding: 1.5rem;
    margin: 0.5rem;
  }
  
  .main-title {
    font-size: 1.5rem;
  }
  
  .email-tips {
    padding: 0.75rem;
  }
  
  .form-input {
    padding: 0.875rem 3rem 0.875rem 2.5rem;
  }
  
  .submit-button {
    padding: 0.875rem 1rem;
  }
  
  .action-button {
    padding: 0.875rem 1rem;
  }
  
  .next-steps {
    gap: 0.5rem;
  }
  
  .step-item span {
    font-size: 0.8125rem;
  }
}
</style>