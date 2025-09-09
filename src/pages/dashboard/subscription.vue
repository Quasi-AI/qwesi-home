<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <Sidebar :user="user" />

    <!-- Main Content -->
    <div class="main-content">
      <!-- Ultra-Modern Header -->
      <header class="modern-header">
        <div class="header-backdrop"></div>
        <div class="header-content">
          <div class="header-info">
            <div class="welcome-section">
              <h1 class="dashboard-title">Subscription Management</h1>
              <p class="welcome-message">Manage your <span class="user-highlight">QWESI AI subscription</span></p>
            </div>
            <div class="header-decorations">
              <div class="floating-orb orb-1"></div>
              <div class="floating-orb orb-2"></div>
              <div class="floating-orb orb-3"></div>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content Area -->
      <main class="dashboard-main">
        <div class="max-w-7xl mx-auto w-full">
          <!-- Current Plan Status Hero Card -->
          <div class="plan-status-card">
            <div class="status-backdrop"></div>
            <div class="status-content">
              <div class="status-main">
                <div class="plan-info">
                  <div class="plan-icon-section">
                    <div class="plan-icon">
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                    <div class="plan-details">
                      <h2 class="plan-name">{{ currentPlanName }}</h2>
                      <p class="plan-message">{{ subscriptionMessage }}</p>
                    </div>
                  </div>
                  <div class="plan-pricing">
                    <div class="price-amount">{{ currentPlanPrice }}</div>
                    <div class="price-period">per month</div>
                  </div>
                </div>
                
                <!-- Subscription Details -->
                <div class="subscription-details">
                  <div class="details-grid">
                    <div class="detail-item">
                      <svg class="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      <div class="detail-text">
                        <div class="detail-label">{{ isPro ? 'Started' : 'Account Created' }}</div>
                        <div class="detail-value">{{ formattedAccountCreationDate }}</div>
                      </div>
                    </div>
                    <div class="detail-item">
                      <svg class="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12,6 12,12 16,14"/>
                      </svg>
                      <div class="detail-text">
                        <div class="detail-label">{{ isPro ? 'Next Billing' : 'Upgrade Available' }}</div>
                        <div class="detail-value">{{ isPro ? formattedSubscriptionEndDate : 'Anytime' }}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Payment Method -->
                <div class="payment-method-section" v-if="hasPaymentMethod">
                  <div class="payment-info">
                    <div class="payment-icon-section">
                      <svg class="payment-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                        <line x1="8" y1="21" x2="16" y2="21"/>
                        <line x1="12" y1="17" x2="12" y2="21"/>
                      </svg>
                      <div class="payment-details">
                        <div class="payment-label">Payment Method</div>
                        <div class="payment-value">VISA •••• {{ maskedCardNumber }}</div>
                      </div>
                    </div>
                    <button @click="showUpdatePaymentModal = true" class="update-payment-btn">
                      <span>Update</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Status Decorations -->
              <div class="status-decorations">
                <div class="status-orb status-orb-1"></div>
                <div class="status-orb status-orb-2"></div>
                <div class="status-orb status-orb-3"></div>
              </div>
            </div>
          </div>

          <!-- Plan Comparison Section -->
          <div class="plans-section">
            <div class="section-header">
              <h3 class="section-title">Choose Your Plan</h3>
              <div class="section-decorator"></div>
            </div>

            <div class="plans-grid">
              <!-- Free Plan Card -->
              <div class="plan-card free-plan" :class="{'current-plan': !isPro}">
                <div class="plan-backdrop"></div>
                
                <!-- Current Plan Badge -->
                <div v-if="!isPro" class="current-plan-badge">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>Current Plan</span>
                </div>
                
                <div class="plan-header">
                  <div class="plan-title-section">
                    <h3 class="plan-title">Free Plan</h3>
                    <p class="plan-description">Perfect for getting started</p>
                  </div>
                  <div class="plan-price-section">
                    <div class="plan-price">$0</div>
                    <div class="plan-period">forever</div>
                  </div>
                </div>
                
                <div class="plan-features">
                  <ul class="features-list">
                    <li class="feature-item available">
                      <div class="feature-icon available">
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        </svg>
                      </div>
                      <div class="feature-text">
                        <div class="feature-name">Basic AI Assistant</div>
                        <div class="feature-desc">Access to core AI features</div>
                      </div>
                    </li>
                    <li class="feature-item available">
                      <div class="feature-icon available">
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        </svg>
                      </div>
                      <div class="feature-text">
                        <div class="feature-name">10 Queries per Day</div>
                        <div class="feature-desc">Perfect for light usage</div>
                      </div>
                    </li>
                    <li class="feature-item available">
                      <div class="feature-icon available">
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        </svg>
                      </div>
                      <div class="feature-text">
                        <div class="feature-name">Email Support</div>
                        <div class="feature-desc">48-hour response time</div>
                      </div>
                    </li>
                    <li class="feature-item available">
                      <div class="feature-icon available">
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        </svg>
                      </div>
                      <div class="feature-text">
                        <div class="feature-name">Basic Templates</div>
                        <div class="feature-desc">Access to 5 templates</div>
                      </div>
                    </li>
                    <li class="feature-item unavailable">
                      <div class="feature-icon unavailable">
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                        </svg>
                      </div>
                      <div class="feature-text">
                        <div class="feature-name">No API Access</div>
                      </div>
                    </li>
                  </ul>
                  
                  <button 
                    class="plan-cta"
                    :class="{'current-cta': isPro, 'upgrade-cta': !isPro}"
                    :disabled="isPro"
                    @click="!isPro && (showUpgradeModal = true)">
                    {{ isPro ? 'Current Plan' : 'Upgrade to Pro' }}
                  </button>
                </div>
              </div>

              <!-- Pro Plan Card -->
              <div class="plan-card pro-plan" :class="{'current-plan': isPro}">
                <div class="plan-backdrop"></div>
                
                <!-- Current Plan Badge -->
                <div v-if="isPro" class="current-plan-badge">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>Current Plan</span>
                </div>
                
                <div class="plan-header">
                  <div class="plan-title-section">
                    <h3 class="plan-title">Pro Plan</h3>
                    <p class="plan-description">For power users and professionals</p>
                  </div>
                  <div class="plan-price-section">
                    <div class="plan-price">$4.99</div>
                    <div class="plan-period">per month</div>
                  </div>
                </div>
                
                <div class="plan-features">
                  <ul class="features-list">
                    <li class="feature-item available">
                      <div class="feature-icon available">
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        </svg>
                      </div>
                      <div class="feature-text">
                        <div class="feature-name">Advanced AI Models</div>
                        <div class="feature-desc">GPT-4, Claude, and more</div>
                      </div>
                    </li>
                    <li class="feature-item available">
                      <div class="feature-icon available">
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        </svg>
                      </div>
                      <div class="feature-text">
                        <div class="feature-name">Unlimited Queries</div>
                        <div class="feature-desc">No daily limits</div>
                      </div>
                    </li>
                    <li class="feature-item available">
                      <div class="feature-icon available">
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        </svg>
                      </div>
                      <div class="feature-text">
                        <div class="feature-name">Priority Support</div>
                        <div class="feature-desc">24/7 chat support</div>
                      </div>
                    </li>
                    <li class="feature-item available">
                      <div class="feature-icon available">
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        </svg>
                      </div>
                      <div class="feature-text">
                        <div class="feature-name">100+ Premium Templates</div>
                        <div class="feature-desc">Industry-specific templates</div>
                      </div>
                    </li>
                    <li class="feature-item available">
                      <div class="feature-icon available">
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        </svg>
                      </div>
                      <div class="feature-text">
                        <div class="feature-name">API Access</div>
                        <div class="feature-desc">Integrate with your apps</div>
                      </div>
                    </li>
                    <li class="feature-item available">
                      <div class="feature-icon available">
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        </svg>
                      </div>
                      <div class="feature-text">
                        <div class="feature-name">Team Collaboration</div>
                        <div class="feature-desc">Share projects with team</div>
                      </div>
                    </li>
                  </ul>
                  
                  <button 
                    @click="isPro ? showCancelModal = true : showUpgradeModal = true"
                    class="plan-cta"
                    :class="{'cancel-cta': isPro, 'pro-cta': !isPro}">
                    {{ isPro ? 'Cancel Subscription' : 'Upgrade to Pro' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Modals -->
    <ProModal v-model="showUpgradeModal" mode="upgrade" :loading="subscriptionStore.isLoading" />
    <ProModal v-model="showCancelModal" mode="cancel" :loading="subscriptionStore.isLoading" />
    <ProModal v-model="showUpdatePaymentModal" mode="update" :loading="subscriptionStore.isLoading" @submit="handleUpdatePayment" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/features/auth/stores/auth.store'
import { useSubscriptionStore } from '~/features/subscription/stores/subscription.store'
import Sidebar from '@/features/dashboard/components/dashboard-sidebar.vue'
import ProModal from '@/features/subscription/components/pro-modal.vue'

const authStore = useAuthStore()
const subscriptionStore = useSubscriptionStore()

const showUpgradeModal = ref(false)
const showCancelModal = ref(false)
const showUpdatePaymentModal = ref(false)

// Computed properties
const user = computed(() => ({
  ...authStore.getUser,
  isSubscribe: subscriptionStore.isSubscribed,
  subscription: subscriptionStore.currentSubscription,
  paymentMethod: subscriptionStore.currentSubscription?.paymentMethod || null,
  createdAt: authStore.getUser?.createdAt || new Date().toISOString()
}))

const isPro = computed(() => subscriptionStore.isSubscribed)
const hasPaymentMethod = computed(() => !!user.value.paymentMethod)
const maskedCardNumber = computed(() => user.value.paymentMethod?.last4 || '')

const currentPlanName = computed(() => isPro.value ? 'QWESI AI Pro' : 'QWESI AI Free')
const currentPlanPrice = computed(() => isPro.value ? '$4.99' : '$0')

const formattedAccountCreationDate = computed(() => {
  if (!user.value?.createdAt) return ''
  const date = new Date(user.value.createdAt)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

const formattedSubscriptionEndDate = computed(() => {
  if (!user.value?.subscription?.currentPeriodEnd) return ''
  const date = new Date(user.value.subscription.currentPeriodEnd)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

const subscriptionMessage = computed(() => {
  return isPro.value
    ? 'You have access to all Pro features and unlimited AI queries.'
    : 'Upgrade to Pro to unlock advanced AI models and unlimited usage.'
})

// Methods
const handleUpdatePayment = async (formData) => {
  try {
    const result = await subscriptionStore.updatePaymentMethod({
      paymentMethodId: 'pm_' + Date.now() // Mock payment method ID
    })

    if (result.success) {
      showUpdatePaymentModal.value = false
      alert('Payment method updated successfully!')
    } else {
      alert(result.error || 'Failed to update payment method')
    }
  } catch (error) {
    console.error('Update payment error:', error)
    alert('An unexpected error occurred')
  }
}

// Lifecycle
onMounted(async () => {
  
  await subscriptionStore.fetchSubscription()
  await subscriptionStore.fetchPlans()
})

// Set page title
useHead({
  title: 'Subscription - QWESI AI'
})
</script>

<style scoped>
/* Base Layout */
.dashboard-container {
  @apply min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex;
  position: relative;
  overflow-x: hidden;
  height: 100vh;
}

.main-content {
  @apply flex-1 flex flex-col;
  min-width: 0;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
}

/* Ultra-Modern Header */
.modern-header {
  @apply relative border-b border-slate-200/60;
  backdrop-filter: blur(20px);
}

.header-backdrop {
  @apply absolute inset-0 bg-gradient-to-r from-white/95 via-white/90 to-blue-50/80;
}

.header-content {
  @apply relative z-10 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0;
}

.header-info {
  @apply relative;
}

.welcome-section {
  @apply text-center sm:text-left;
}

.dashboard-title {
  @apply text-2xl font-black bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent;
  font-variant: small-caps;
  letter-spacing: -0.025em;
}

.welcome-message {
  @apply text-sm font-medium text-slate-600 mt-1;
}

.user-highlight {
  @apply font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent;
}

.header-decorations {
  @apply absolute -inset-4 pointer-events-none;
}

.floating-orb {
  @apply absolute w-1 h-1 rounded-full opacity-20;
  animation: float 6s ease-in-out infinite;
}

.orb-1 {
  @apply bg-blue-400 top-2 right-8;
  animation-delay: 0s;
}

.orb-2 {
  @apply bg-purple-400 top-8 right-4;
  animation-delay: 2s;
}

.orb-3 {
  @apply bg-emerald-400 top-6 right-12;
  animation-delay: 4s;
}

/* Main Dashboard Content */
.dashboard-main {
  @apply flex-1 p-6 flex flex-col space-y-8;
  min-height: 0;
  overflow-y: auto;
  padding-bottom: 2rem;
}

/* Plan Status Card */
.plan-status-card {
  @apply relative rounded-3xl overflow-hidden mb-8;
  backdrop-filter: blur(20px);
}

.status-backdrop {
  @apply absolute inset-0 bg-gradient-to-br from-indigo-600/95 via-purple-600/90 to-blue-600/95;
}

.status-content {
  @apply relative z-10 p-8 text-white;
}

.status-main {
  @apply space-y-8;
}

.plan-info {
  @apply flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0;
}

.plan-icon-section {
  @apply flex items-center space-x-4;
}

.plan-icon {
  @apply w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center;
  @apply shadow-lg;
  backdrop-filter: blur(12px);
}

.plan-icon svg {
  @apply w-8 h-8;
}

.plan-details {
  @apply space-y-1;
}

.plan-name {
  @apply text-2xl font-black;
  background: linear-gradient(to right, rgba(255,255,255,0.95), rgba(255,255,255,0.8));
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.plan-message {
  @apply text-blue-100;
}

.plan-pricing {
  @apply text-center sm:text-right;
}

.price-amount {
  @apply text-4xl font-black text-white;
}

.price-period {
  @apply text-blue-200;
}

/* Subscription Details */
.subscription-details {
  @apply border-t border-white/20 pt-6;
}

.details-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-6;
}

.detail-item {
  @apply flex items-center space-x-3;
}

.detail-icon {
  @apply w-5 h-5 text-blue-200 flex-shrink-0;
}

.detail-text {
  @apply space-y-1;
}

.detail-label {
  @apply text-sm text-blue-200;
}

.detail-value {
  @apply font-bold text-white;
}

/* Payment Method Section */
.payment-method-section {
  @apply border-t border-white/20 pt-6;
}

.payment-info {
  @apply flex items-center justify-between;
}

.payment-icon-section {
  @apply flex items-center space-x-3;
}

.payment-icon {
  @apply w-5 h-5 text-blue-200 flex-shrink-0;
}

.payment-details {
  @apply space-y-1;
}

.payment-label {
  @apply text-sm text-blue-200;
}

.payment-value {
  @apply font-bold text-white;
}

.update-payment-btn {
  @apply px-4 py-2 bg-white/20 text-white rounded-2xl;
  @apply hover:bg-white/30 transition-all duration-300 hover:scale-105;
  @apply text-sm font-bold;
  backdrop-filter: blur(12px);
}

/* Status Decorations */
.status-decorations {
  @apply absolute inset-0 pointer-events-none;
}

.status-orb {
  @apply absolute rounded-full opacity-10;
  animation: statusFloat 10s ease-in-out infinite;
}

.status-orb-1 {
  @apply w-32 h-32 bg-white top-8 right-16;
  animation-delay: 0s;
}

.status-orb-2 {
  @apply w-20 h-20 bg-yellow-300 bottom-12 left-20;
  animation-delay: 4s;
}

.status-orb-3 {
  @apply w-24 h-24 bg-pink-300 top-20 right-1/3;
  animation-delay: 8s;
}

/* Plans Section */
.plans-section {
  @apply space-y-8;
}

.section-header {
  @apply flex items-center space-x-4;
}

.section-title {
  @apply text-2xl font-bold text-slate-900;
}

.section-decorator {
  @apply flex-1 h-px bg-gradient-to-r from-slate-300 via-blue-300 to-transparent;
}

.plans-grid {
  @apply grid md:grid-cols-2 gap-8;
}

/* Plan Cards */
.plan-card {
  @apply relative rounded-3xl overflow-hidden transition-all duration-300;
  @apply hover:-translate-y-2 hover:scale-105 hover:shadow-2xl;
  backdrop-filter: blur(20px);
}

.plan-card.current-plan {
  @apply ring-2 ring-emerald-500/50 shadow-2xl shadow-emerald-500/10;
}

.plan-backdrop {
  @apply absolute inset-0 bg-white/70 border border-slate-200/60;
}

/* Current Plan Badge */
.current-plan-badge {
  @apply absolute -top-4 left-1/2 transform -translate-x-1/2 z-20;
  @apply bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-2 rounded-full;
  @apply text-sm font-bold flex items-center space-x-2 shadow-lg shadow-emerald-500/25;
}

.current-plan-badge svg {
  @apply w-4 h-4;
}

/* Plan Header */
.plan-header {
  @apply relative z-10 p-6 border-b border-slate-200/40 mt-4;
}

.plan-title-section {
  @apply mb-6;
}

.plan-title {
  @apply text-xl font-bold text-slate-900 mb-2;
}

.plan-description {
  @apply text-slate-600;
}

.plan-price-section {
  @apply text-center;
}

.plan-price {
  @apply text-4xl font-black text-slate-900;
}

.plan-period {
  @apply text-slate-500;
}

/* Plan Features */
.plan-features {
  @apply relative z-10 p-6 space-y-6;
}

.features-list {
  @apply space-y-4;
}

.feature-item {
  @apply flex items-start space-x-3;
}

.feature-icon {
  @apply w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5;
}

.feature-icon.available {
  @apply bg-emerald-100 text-emerald-600;
}

.feature-icon.unavailable {
  @apply bg-slate-100 text-slate-400;
}

.feature-icon svg {
  @apply w-3 h-3;
}

.feature-text {
  @apply flex-1;
}

.feature-name {
  @apply font-bold text-slate-900;
}

.feature-desc {
  @apply text-sm text-slate-600;
}

.feature-item.unavailable {
  @apply opacity-50;
}

.feature-item.unavailable .feature-name {
  @apply text-slate-500;
}

/* Plan CTAs */
.plan-cta {
  @apply w-full px-6 py-3 rounded-2xl font-bold transition-all duration-300;
  @apply hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4;
}

.current-cta {
  @apply bg-slate-100 text-slate-600 cursor-not-allowed;
}

.upgrade-cta {
  @apply bg-gradient-to-r from-emerald-500 to-emerald-600 text-white;
  @apply hover:from-emerald-600 hover:to-emerald-700;
  @apply focus:ring-emerald-500/20 shadow-emerald-500/25;
}

.pro-cta {
  @apply bg-gradient-to-r from-blue-500 to-blue-600 text-white;
  @apply hover:from-blue-600 hover:to-blue-700;
  @apply focus:ring-blue-500/20 shadow-blue-500/25;
}

.cancel-cta {
  @apply bg-gradient-to-r from-red-500 to-red-600 text-white;
  @apply hover:from-red-600 hover:to-red-700;
  @apply focus:ring-red-500/20 shadow-red-500/25;
}

/* Custom Scrollbar Styling */
.main-content {
  scrollbar-width: thin;
  scrollbar-color: rgba(148, 163, 184, 0.3) transparent;
}

.main-content::-webkit-scrollbar {
  width: 6px;
}

.main-content::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 3px;
}

.main-content::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, rgba(148, 163, 184, 0.3), rgba(148, 163, 184, 0.5));
  border-radius: 3px;
  transition: all 0.3s ease;
}

.main-content::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, rgba(148, 163, 184, 0.5), rgba(148, 163, 184, 0.7));
}

.dashboard-main {
  scrollbar-width: thin;
  scrollbar-color: rgba(148, 163, 184, 0.3) transparent;
}

.dashboard-main::-webkit-scrollbar {
  width: 6px;
}

.dashboard-main::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 3px;
}

.dashboard-main::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, rgba(148, 163, 184, 0.3), rgba(148, 163, 184, 0.5));
  border-radius: 3px;
  transition: all 0.3s ease;
}

.dashboard-main::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, rgba(148, 163, 184, 0.5), rgba(148, 163, 184, 0.7));
}

/* Animations */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
}

@keyframes statusFloat {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-16px) rotate(180deg); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .dashboard-title {
    @apply text-xl;
  }
  
  .plan-info {
    @apply flex-col space-y-4;
  }
  
  .plan-icon-section {
    @apply justify-center text-center;
  }
  
  .plan-pricing {
    @apply text-center;
  }
  
  .plans-grid {
    @apply grid-cols-1 gap-6;
  }
  
  .details-grid {
    @apply grid-cols-1;
  }
  
  .payment-info {
    @apply flex-col space-y-4;
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .floating-orb,
  .status-orb,
  .plan-card {
    animation: none;
  }
  
  .plan-card:hover,
  .plan-cta:hover,
  .update-payment-btn:hover {
    transform: none;
  }
}

/* Enhanced Focus States */
.plan-cta:focus-visible,
.update-payment-btn:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* High Contrast Mode Support */
@media (prefers-contrast: high) {
  .plan-backdrop {
    @apply bg-white border-slate-400;
  }
  
  .status-backdrop {
    @apply from-indigo-800 via-purple-800 to-blue-800;
  }
}
</style>