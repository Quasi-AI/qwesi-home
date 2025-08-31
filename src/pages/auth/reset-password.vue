<template>
  <div class="reset-password-container">
    <!-- Animated Background -->
    <div class="background-elements">
      <div class="floating-orb orb-1"></div>
      <div class="floating-orb orb-2"></div>
      <div class="floating-orb orb-3"></div>
      <div class="mesh-gradient"></div>
    </div>

    <!-- Back Button -->
    <BackButton class="back-button" />

    <!-- Main Content -->
    <div class="main-wrapper">
      <!-- Left Side - Reset Password Form -->
      <div class="form-section">
        <div class="form-container">
          <!-- Logo and Header -->
          <div class="header-section">
            <div class="logo-container">
              <div class="logo-wrapper">
                <img src="~/assets/images/qwesi-head.png" alt="QWESI AI Logo" class="logo-image" />
                <div class="logo-pulse"></div>
              </div>
            </div>
            <div class="header-text">
              <h1 class="main-title">Set New Password</h1>
              <p class="subtitle">Create a strong password to secure your account</p>
            </div>
          </div>

          <!-- Success State -->
          <div v-if="passwordReset" class="success-section">
            <div class="success-animation">
              <div class="success-circle">
                <div class="checkmark">
                  <i class="fas fa-check"></i>
                </div>
              </div>
              <div class="success-rings">
                <div class="ring ring-1"></div>
                <div class="ring ring-2"></div>
                <div class="ring ring-3"></div>
              </div>
            </div>
            <div class="success-content">
              <h2>Password Reset Successfully!</h2>
              <p>Your password has been updated. You can now sign in with your new password.</p>
            </div>
            <div class="success-actions">
              <NuxtLink to="/auth/login" class="action-button primary">
                <i class="fas fa-sign-in-alt"></i>
                <span>Continue to Sign In</span>
              </NuxtLink>
            </div>
          </div>

          <!-- Reset Password Form -->
          <div v-else class="form-section-inner">
            <!-- Security Features Info -->
            <div class="security-info">
              <h3>Password Requirements</h3>
              <div class="requirements-list">
                <div class="requirement" :class="{ 'met': passwordChecks.length }">
                  <i class="fas fa-check"></i>
                  <span>At least 8 characters long</span>
                </div>
                <div class="requirement" :class="{ 'met': passwordChecks.uppercase }">
                  <i class="fas fa-check"></i>
                  <span>Contains uppercase letter</span>
                </div>
                <div class="requirement" :class="{ 'met': passwordChecks.lowercase }">
                  <i class="fas fa-check"></i>
                  <span>Contains lowercase letter</span>
                </div>
                <div class="requirement" :class="{ 'met': passwordChecks.number }">
                  <i class="fas fa-check"></i>
                  <span>Contains number</span>
                </div>
              </div>
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
            <form @submit.prevent="handleResetPassword" class="reset-form">
              <!-- Password Field -->
              <div class="input-group">
                <label for="password" class="input-label">
                  <i class="fas fa-lock"></i>
                  New Password
                </label>
                <div class="input-wrapper">
                  <input 
                    id="password" 
                    v-model="form.password" 
                    :type="showPassword ? 'text' : 'password'"
                    required
                    class="form-input"
                    placeholder="Enter your new password"
                    @input="validatePassword"
                  />
                  <button 
                    type="button"
                    @click="showPassword = !showPassword"
                    class="password-toggle"
                  >
                    <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
                <div class="password-strength">
                  <div class="strength-bar">
                    <div 
                      class="strength-fill" 
                      :class="`strength-${passwordStrength}`"
                      :style="{ width: passwordStrengthWidth + '%' }"
                    ></div>
                  </div>
                  <span class="strength-text">{{ passwordStrengthText }}</span>
                </div>
              </div>

              <!-- Confirm Password Field -->
              <div class="input-group">
                <label for="confirmPassword" class="input-label">
                  <i class="fas fa-shield-alt"></i>
                  Confirm Password
                </label>
                <div class="input-wrapper">
                  <input 
                    id="confirmPassword" 
                    v-model="form.confirmPassword" 
                    :type="showConfirmPassword ? 'text' : 'password'"
                    required
                    class="form-input"
                    :class="{ 'error': form.confirmPassword && form.password !== form.confirmPassword }"
                    placeholder="Confirm your new password"
                  />
                  <button 
                    type="button"
                    @click="showConfirmPassword = !showConfirmPassword"
                    class="password-toggle"
                  >
                    <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
                <transition name="fade">
                  <div v-if="form.confirmPassword && form.password !== form.confirmPassword" class="field-error">
                    <i class="fas fa-exclamation-circle"></i>
                    Passwords do not match
                  </div>
                </transition>
              </div>

              <!-- Submit Button -->
              <button 
                type="submit" 
                :disabled="loading || !isFormValid"
                class="submit-button"
                :class="{ 'loading': loading }"
              >
                <div class="button-content">
                  <div v-if="loading" class="loading-spinner">
                    <div class="spinner"></div>
                  </div>
                  <i v-else class="fas fa-key"></i>
                  <span>{{ loading ? 'Resetting Password...' : 'Reset Password' }}</span>
                </div>
                <div class="button-bg"></div>
              </button>

              <!-- Alternative Actions -->
              <div class="form-footer">
                <div class="divider">
                  <span>or</span>
                </div>
                <NuxtLink to="/auth/login" class="link-button">
                  <i class="fas fa-arrow-left"></i>
                  <span>Back to Sign In</span>
                </NuxtLink>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Right Side - Visual Elements -->
      <div class="visual-section">
        <div class="visual-content">
          <!-- Security Illustration -->
          <div class="security-illustration">
            <div class="shield-container">
              <div class="shield-layers">
                <div class="shield-layer layer-1"></div>
                <div class="shield-layer layer-2"></div>
                <div class="shield-layer layer-3"></div>
              </div>
              <div class="shield-core">
                <i class="fas fa-shield-alt"></i>
              </div>
              <div class="security-particles">
                <div class="particle particle-1"></div>
                <div class="particle particle-2"></div>
                <div class="particle particle-3"></div>
                <div class="particle particle-4"></div>
              </div>
            </div>
          </div>

          <!-- Security Features -->
          <div class="features-list">
            <div class="feature-item">
              <div class="feature-icon">
                <i class="fas fa-lock"></i>
              </div>
              <div class="feature-text">
                <h4>End-to-End Encryption</h4>
                <p>Your data is protected with military-grade encryption</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">
                <i class="fas fa-user-shield"></i>
              </div>
              <div class="feature-text">
                <h4>Privacy First</h4>
                <p>We never store or share your personal information</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">
                <i class="fas fa-fingerprint"></i>
              </div>
              <div class="feature-text">
                <h4>Secure Authentication</h4>
                <p>Advanced security measures keep your account safe</p>
              </div>
            </div>
          </div>

          <!-- Trust Indicators -->
          <div class="trust-indicators">
            <div class="trust-item">
              <div class="trust-badge">
                <i class="fas fa-certificate"></i>
              </div>
              <span>SOC 2 Compliant</span>
            </div>
            <div class="trust-item">
              <div class="trust-badge">
                <i class="fas fa-shield-check"></i>
              </div>
              <span>GDPR Ready</span>
            </div>
            <div class="trust-item">
              <div class="trust-badge">
                <i class="fas fa-lock"></i>
              </div>
              <span>256-bit SSL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/features/auth/stores/auth.store'
import BackButton from '@/shared/components/ui/back-button.vue'

const authStore = useAuthStore()
const router = useRouter()

// Reactive data
const loading = ref(false)
const passwordReset = ref(false)
const error = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const form = ref({
  password: '',
  confirmPassword: ''
})

// Password validation
const passwordChecks = computed(() => {
  const password = form.value.password
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password)
  }
})

const passwordStrength = computed(() => {
  const checks = passwordChecks.value
  const score = Object.values(checks).filter(Boolean).length
  
  if (score === 0) return 'none'
  if (score <= 1) return 'weak'
  if (score <= 2) return 'fair'
  if (score <= 3) return 'good'
  return 'strong'
})

const passwordStrengthWidth = computed(() => {
  const score = Object.values(passwordChecks.value).filter(Boolean).length
  return (score / 4) * 100
})

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value
  const texts = {
    none: 'Enter password',
    weak: 'Weak password',
    fair: 'Fair password',
    good: 'Good password',
    strong: 'Strong password'
  }
  return texts[strength]
})

const isFormValid = computed(() => {
  return form.value.password && 
         form.value.confirmPassword && 
         form.value.password === form.value.confirmPassword &&
         Object.values(passwordChecks.value).every(Boolean)
})

// Methods
const validatePassword = () => {
  // Real-time validation feedback could be added here
}

const handleResetPassword = async () => {
  loading.value = true
  error.value = ''

  try {
    if (form.value.password !== form.value.confirmPassword) {
      error.value = 'Passwords do not match'
      return
    }

    // Get token from URL params
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token') || 'mock-reset-token'

    const result = await authStore.resetPassword(token, form.value.password)

    if (result.success) {
      passwordReset.value = true
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigateTo('/auth/login')
      }, 3000)
    } else {
      error.value = result.error || 'Password reset failed'
    }
  } catch (err) {
    console.error('Reset password error:', err)
    error.value = 'An unexpected error occurred'
  } finally {
    loading.value = false
  }
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
  title: 'Reset Password - QWESI AI'
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
.reset-password-container {
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

.floating-orb {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05));
  animation: float 20s ease-in-out infinite;
}

.orb-1 {
  width: 300px;
  height: 300px;
  top: -50px;
  right: -50px;
  animation-delay: 0s;
}

.orb-2 {
  width: 200px;
  height: 200px;
  bottom: -50px;
  left: -50px;
  animation-delay: -10s;
}

.orb-3 {
  width: 150px;
  height: 150px;
  top: 50%;
  left: 50%;
  animation-delay: -5s;
}

.mesh-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.1) 0%, transparent 50%);
  animation: mesh-move 15s ease-in-out infinite;
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

.logo-pulse {
  position: absolute;
  inset: -10px;
  border: 2px solid var(--primary);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
  opacity: 0.5;
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

.success-circle {
  width: 80px;
  height: 80px;
  background: var(--gradient-success);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 3;
  animation: success-bounce 0.6s ease-out;
}

.checkmark {
  color: white;
  font-size: 2rem;
  animation: checkmark-draw 0.8s ease-out 0.3s both;
}

.success-rings {
  position: absolute;
  inset: 0;
}

.ring {
  position: absolute;
  border-radius: 50%;
  border: 2px solid var(--success);
  animation: ring-expand 1.5s ease-out infinite;
}

.ring-1 {
  width: 100px;
  height: 100px;
  top: 10px;
  left: 10px;
  animation-delay: 0s;
}

.ring-2 {
  width: 120px;
  height: 120px;
  top: 0;
  left: 0;
  animation-delay: 0.3s;
}

.ring-3 {
  width: 140px;
  height: 140px;
  top: -10px;
  left: -10px;
  animation-delay: 0.6s;
}

.success-content h2 {
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.success-content p {
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

/* Security Info */
.security-info {
  background: #f8fafc;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.security-info h3 {
  color: var(--text-primary);
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.requirements-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.requirement {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
  transition: all 0.3s ease;
}

.requirement.met {
  color: var(--success);
}

.requirement i {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e5e7eb;
  border-radius: 50%;
  font-size: 0.625rem;
  transition: all 0.3s ease;
}

.requirement.met i {
  background: var(--success);
  color: white;
}

/* Form */
.reset-form {
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
  padding: 1rem 3rem 1rem 1rem;
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

.form-input.error {
  border-color: var(--danger);
}

.password-toggle {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.3s ease;
}

.password-toggle:hover {
  color: var(--primary);
  background: rgba(99, 102, 241, 0.1);
}

/* Password Strength */
.password-strength {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.strength-bar {
  flex: 1;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.strength-weak { background: var(--danger); }
.strength-fair { background: var(--warning); }
.strength-good { background: #3b82f6; }
.strength-strong { background: var(--success); }

.strength-text {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-secondary);
}

/* Field Error */
.field-error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--danger);
  font-size: 0.875rem;
  margin-top: 0.5rem;
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

.button-bg {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s ease;
}

.submit-button:hover .button-bg {
  left: 100%;
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

.divider span {
  background: var(--surface);
  padding: 0 1rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
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

.action-button {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.action-button.primary {
  background: var(--gradient-primary);
  color: white;
}

.action-button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(99, 102, 241, 0.3);
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
  text-align: center;
}

/* Security Illustration */
.security-illustration {
  margin-bottom: 3rem;
}

.shield-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.shield-layers {
  position: absolute;
  inset: 0;
}

.shield-layer {
  position: absolute;
  border-radius: 50%;
  border: 2px solid;
  animation: shield-rotate 15s linear infinite;
}

.layer-1 {
  width: 180px;
  height: 180px;
  top: 10px;
  left: 10px;
  border-color: rgba(99, 102, 241, 0.3);
  animation-duration: 15s;
}

.layer-2 {
  width: 150px;
  height: 150px;
  top: 25px;
  left: 25px;
  border-color: rgba(139, 92, 246, 0.5);
  animation-duration: 12s;
  animation-direction: reverse;
}

.layer-3 {
  width: 120px;
  height: 120px;
  top: 40px;
  left: 40px;
  border-color: rgba(16, 185, 129, 0.7);
  animation-duration: 10s;
}

.shield-core {
  position: relative;
  width: 80px;
  height: 80px;
  background: var(--gradient-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  z-index: 2;
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);
}

.security-particles {
  position: absolute;
  inset: 0;
}

.particle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: var(--primary);
  border-radius: 50%;
  animation: particle-float 8s ease-in-out infinite;
}

.particle-1 {
  top: 20%;
  left: 20%;
  animation-delay: 0s;
}

.particle-2 {
  top: 30%;
  right: 20%;
  animation-delay: -2s;
}

.particle-3 {
  bottom: 30%;
  left: 30%;
  animation-delay: -4s;
}

.particle-4 {
  bottom: 20%;
  right: 30%;
  animation-delay: -6s;
}

/* Features List */
.features-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  text-align: left;
}

.feature-icon {
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

.feature-text h4 {
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.feature-text p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.75rem;
  line-height: 1.4;
  margin: 0;
}

/* Trust Indicators */
.trust-indicators {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.trust-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.trust-badge {
  width: 40px;
  height: 40px;
  background: rgba(16, 185, 129, 0.2);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--success);
}

.trust-item span {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.625rem;
  font-weight: 500;
  text-align: center;
}

/* Animations */
@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(10px, -10px) rotate(1deg); }
  50% { transform: translate(-5px, -15px) rotate(-0.5deg); }
  75% { transform: translate(-10px, 5px) rotate(0.5deg); }
}

@keyframes mesh-move {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.05); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

@keyframes success-bounce {
  0% { transform: scale(0) rotate(-180deg); }
  50% { transform: scale(1.2) rotate(-90deg); }
  100% { transform: scale(1) rotate(0deg); }
}

@keyframes checkmark-draw {
  0% { transform: scale(0); }
  100% { transform: scale(1); }
}

@keyframes ring-expand {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(1.3); opacity: 0; }
}

@keyframes shield-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes particle-float {
  0%, 100% { transform: translateY(0) scale(1); opacity: 0.7; }
  50% { transform: translateY(-20px) scale(1.2); opacity: 1; }
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
  
  .success-animation {
    height: 100px;
  }
  
  .success-circle {
    width: 60px;
    height: 60px;
  }
  
  .checkmark {
    font-size: 1.5rem;
  }
  
  .ring-1 {
    width: 80px;
    height: 80px;
    top: 10px;
    left: 10px;
  }
  
  .ring-2 {
    width: 100px;
    height: 100px;
    top: 0;
    left: 0;
  }
  
  .ring-3 {
    width: 120px;
    height: 120px;
    top: -10px;
    left: -10px;
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
  
  .security-info {
    padding: 1rem;
  }
  
  .requirements-list {
    gap: 0.5rem;
  }
  
  .form-input {
    padding: 0.875rem 2.5rem 0.875rem 0.875rem;
  }
  
  .submit-button {
    padding: 0.875rem 1rem;
  }
  
  .action-button {
    padding: 0.875rem 1.5rem;
  }
}
</style>