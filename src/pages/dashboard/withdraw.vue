<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <Sidebar :user="user" />

    <!-- Main Content -->
    <div class="main-content">
      <!-- Modern Header -->
      <header class="modern-header">
        <div class="header-backdrop"></div>
        <div class="header-content">
          <div class="header-info">
            <div class="welcome-section">
              <h1 class="dashboard-title">Withdrawal Requests</h1>
              <p class="welcome-message">Manage your earnings withdrawals and payment methods</p>
            </div>
          </div>

          <div class="header-actions">
            <button @click="showNewRequestModal = true" class="action-btn create-btn">
              <div class="btn-bg"></div>
              <div class="btn-content">
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>New Withdrawal</span>
              </div>
            </button>

            <NuxtLink to="/dashboard/get-started" class="action-btn referral-btn">
              <div class="btn-bg"></div>
              <div class="btn-content">
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Dashboard</span>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Header Decorations -->
        <div class="header-decorations">
          <div class="floating-orb orb-1"></div>
          <div class="floating-orb orb-2"></div>
          <div class="floating-orb orb-3"></div>
        </div>
      </header>

      <MessagePopup ref="alertRef" />

      <!-- Main Content Area -->
      <main class="dashboard-main">
        <div class="max-w-6xl mx-auto w-full space-y-8">
          
          <!-- Balance Summary -->
          <div class="balance-summary">
            <div class="balance-card available">
              <div class="balance-backdrop"></div>
              <div class="balance-content">
                <div class="balance-icon">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zM14 6a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h8zM6 10a2 2 0 100 4 2 2 0 000-4z" />
                  </svg>
                </div>
                <div class="balance-info">
                  <h3 class="balance-label">Available Balance</h3>
                  <p class="balance-amount">${{ formatAmount(userBalance.available) }}</p>
                </div>
              </div>
            </div>

            <div class="balance-card pending">
              <div class="balance-backdrop"></div>
              <div class="balance-content">
                <div class="balance-icon">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="balance-info">
                  <h3 class="balance-label">Pending Withdrawals</h3>
                  <p class="balance-amount">${{ formatAmount(userBalance.pending) }}</p>
                </div>
              </div>
            </div>

            <div class="balance-card total">
              <div class="balance-backdrop"></div>
              <div class="balance-content">
                <div class="balance-icon">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
                <div class="balance-info">
                  <h3 class="balance-label">Total Withdrawn</h3>
                  <p class="balance-amount">${{ formatAmount(userBalance.totalWithdrawn) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Filters and Search -->
          <div class="search-filter-bar">
            <div class="search-backdrop"></div>
            <div class="search-content">
              <div class="search-input-container">
                <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input v-model="searchQuery" type="text" placeholder="Search withdrawals..." class="search-input" />
              </div>
              
              <select v-model="statusFilter" class="status-filter">
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <!-- Withdrawals List -->
          <div v-if="loading" class="loading-container">
            <div class="loading-spinner"></div>
            <p class="loading-text">Loading withdrawals...</p>
          </div>

          <div v-else-if="filteredWithdrawals.length === 0" class="empty-state">
            <div class="empty-backdrop"></div>
            <div class="empty-content">
              <div class="empty-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v2" />
                </svg>
              </div>
              <h3 class="empty-title">No withdrawals found</h3>
              <p class="empty-description">
                {{ searchQuery || statusFilter ? 'Try adjusting your filters' : 'You haven\'t made any withdrawal requests yet' }}
              </p>
              <button v-if="!searchQuery && !statusFilter" @click="showNewRequestModal = true" class="empty-action-btn">
                Make Your First Withdrawal
              </button>
            </div>
          </div>

          <div v-else class="withdrawals-grid">
            <div v-for="withdrawal in filteredWithdrawals" :key="withdrawal._id" class="withdrawal-card">
              <div class="withdrawal-backdrop"></div>
              <div class="withdrawal-content">
                <div class="withdrawal-header">
                  <div class="withdrawal-info">
                    <h4 class="withdrawal-amount">${{ formatAmount(withdrawal.amount) }}</h4>
                    <p class="withdrawal-method">{{ formatMethod(withdrawal.method) }}</p>
                  </div>
                  <div class="withdrawal-status" :class="`status-${withdrawal.status}`">
                    {{ formatStatus(withdrawal.status) }}
                  </div>
                </div>

                <div class="withdrawal-details">
                  <div class="detail-row">
                    <span class="detail-label">Net Amount:</span>
                    <span class="detail-value">${{ formatAmount(withdrawal.netAmount) }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Fees:</span>
                    <span class="detail-value">${{ formatAmount(withdrawal.fees) }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Requested:</span>
                    <span class="detail-value">{{ formatDate(withdrawal.requestedAt) }}</span>
                  </div>
                  <div v-if="withdrawal.transactionId" class="detail-row">
                    <span class="detail-label">Transaction ID:</span>
                    <span class="detail-value">{{ withdrawal.transactionId }}</span>
                  </div>
                </div>

                <div class="withdrawal-actions">
                  <button @click="viewDetails(withdrawal)" class="action-btn view-btn">
                    <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Details
                  </button>
                  <button 
                    v-if="withdrawal.status === 'pending'" 
                    @click="cancelWithdrawal(withdrawal._id)" 
                    class="action-btn cancel-btn"
                    :disabled="cancelling"
                  >
                    <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- New Withdrawal Request Modal -->
          <div v-if="showNewRequestModal" class="modal-overlay" @click="closeNewRequestModal">
            <div class="modal-container" @click.stop>
              <div class="modal-backdrop"></div>
              <div class="modal-content">
                <div class="modal-header">
                  <h3 class="modal-title">New Withdrawal Request</h3>
                  <button @click="closeNewRequestModal" class="modal-close">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div class="modal-body">
                  <form @submit.prevent="submitWithdrawal" class="withdrawal-form">
                    <!-- Amount -->
                    <div class="form-group">
                      <label class="form-label">Withdrawal Amount *</label>
                      <div class="amount-input-container">
                        <span class="currency-symbol">$</span>
                        <input 
                          v-model="withdrawalForm.amount" 
                          type="number" 
                          step="0.01" 
                          min="1" 
                          max="10000"
                          placeholder="0.00"
                          class="amount-input" 
                          required 
                        />
                      </div>
                      <div class="amount-info">
                        <span class="available-balance">Available: ${{ formatAmount(userBalance.available) }}</span>
                        <span v-if="withdrawalForm.amount && withdrawalForm.method" class="fee-info">
                          Fee: ${{ calculateFee(withdrawalForm.amount, withdrawalForm.method) }} | 
                          Net: ${{ calculateNetAmount(withdrawalForm.amount, withdrawalForm.method) }}
                        </span>
                      </div>
                    </div>

                    <!-- Withdrawal Method -->
                    <div class="form-group">
                      <label class="form-label">Withdrawal Method *</label>
                      <div class="method-grid">
                        <div 
                          v-for="method in withdrawalMethods" 
                          :key="method.value"
                          class="method-option"
                          :class="{ active: withdrawalForm.method === method.value }"
                          @click="withdrawalForm.method = method.value">
                          <div class="method-info">
                            <h4 class="method-title">{{ method.title }}</h4>
                            <p class="method-fee">{{ method.feeText }}</p>
                            <p class="method-time">{{ method.processingTime }}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Account Details -->
                    <div v-if="withdrawalForm.method" class="form-group">
                      <label class="form-label">Account Details *</label>
                      
                      <!-- Bank Transfer Fields -->
                      <div v-if="withdrawalForm.method === 'bank_transfer'" class="account-fields">
                        <input v-model="withdrawalForm.accountDetails.accountHolderName" type="text" placeholder="Account Holder Name" class="form-input" required />
                        <input v-model="withdrawalForm.accountDetails.accountNumber" type="text" placeholder="Account Number" class="form-input" required />
                        <input v-model="withdrawalForm.accountDetails.bankName" type="text" placeholder="Bank Name" class="form-input" required />
                        <input v-model="withdrawalForm.accountDetails.routingNumber" type="text" placeholder="Routing Number (Optional)" class="form-input" />
                      </div>

                      <!-- PayPal Fields -->
                      <div v-if="withdrawalForm.method === 'paypal'" class="account-fields">
                        <input v-model="withdrawalForm.accountDetails.email" type="email" placeholder="PayPal Email Address" class="form-input" required />
                      </div>

                      <!-- Mobile Money Fields -->
                      <div v-if="withdrawalForm.method === 'mobile_money'" class="account-fields">
                        <select v-model="withdrawalForm.accountDetails.provider" class="form-select" required>
                          <option value="">Select Provider</option>
                          <option value="mtn">MTN Mobile Money</option>
                          <option value="vodafone">Vodafone Cash</option>
                          <option value="airteltigo">AirtelTigo Money</option>
                        </select>
                        <input v-model="withdrawalForm.accountDetails.phoneNumber" type="tel" placeholder="Phone Number" class="form-input" required />
                      </div>

                      <!-- Crypto Fields -->
                      <div v-if="withdrawalForm.method === 'crypto'" class="account-fields">
                        <select v-model="withdrawalForm.accountDetails.currency" class="form-select" required>
                          <option value="">Select Currency</option>
                          <option value="BTC">Bitcoin (BTC)</option>
                          <option value="ETH">Ethereum (ETH)</option>
                          <option value="USDT">Tether (USDT)</option>
                          <option value="USDC">USD Coin (USDC)</option>
                        </select>
                        <input v-model="withdrawalForm.accountDetails.address" type="text" placeholder="Wallet Address" class="form-input" required />
                        <input v-model="withdrawalForm.accountDetails.network" type="text" placeholder="Network (e.g., ERC-20, TRC-20)" class="form-input" />
                      </div>
                    </div>

                    <!-- Reason (Optional) -->
                    <div class="form-group">
                      <label class="form-label">Reason (Optional)</label>
                      <textarea v-model="withdrawalForm.reason" placeholder="Why are you withdrawing these funds?" class="form-textarea" rows="3"></textarea>
                    </div>

                    <!-- Form Actions -->
                    <div class="form-actions">
                      <button type="button" @click="closeNewRequestModal" class="cancel-btn">Cancel</button>
                      <button type="submit" :disabled="submitting || !isFormValid" class="submit-btn">
                        <span v-if="submitting" class="flex items-center">
                          <svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l-3-2.647z"></path>
                          </svg>
                          Submitting...
                        </span>
                        <span v-else>Submit Request</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <!-- Withdrawal Details Modal -->
          <div v-if="showDetailsModal" class="modal-overlay" @click="closeDetailsModal">
            <div class="modal-container" @click.stop>
              <div class="modal-backdrop"></div>
              <div class="modal-content">
                <div class="modal-header">
                  <h3 class="modal-title">Withdrawal Details</h3>
                  <button @click="closeDetailsModal" class="modal-close">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div v-if="selectedWithdrawal" class="modal-body">
                  <div class="detail-section">
                    <h4 class="section-title">Transaction Information</h4>
                    <div class="detail-grid">
                      <div class="detail-item">
                        <span class="item-label">Amount</span>
                        <span class="item-value">${{ formatAmount(selectedWithdrawal.amount) }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="item-label">Fees</span>
                        <span class="item-value">${{ formatAmount(selectedWithdrawal.fees) }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="item-label">Net Amount</span>
                        <span class="item-value">${{ formatAmount(selectedWithdrawal.netAmount) }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="item-label">Method</span>
                        <span class="item-value">{{ formatMethod(selectedWithdrawal.method) }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="item-label">Status</span>
                        <span class="item-value status-badge" :class="`status-${selectedWithdrawal.status}`">
                          {{ formatStatus(selectedWithdrawal.status) }}
                        </span>
                      </div>
                      <div class="detail-item">
                        <span class="item-label">Requested</span>
                        <span class="item-value">{{ formatDateLong(selectedWithdrawal.requestedAt) }}</span>
                      </div>
                    </div>
                  </div>

                  <div v-if="selectedWithdrawal.reason" class="detail-section">
                    <h4 class="section-title">Reason</h4>
                    <p class="reason-text">{{ selectedWithdrawal.reason }}</p>
                  </div>

                  <div v-if="selectedWithdrawal.adminNotes || selectedWithdrawal.rejectionReason" class="detail-section">
                    <h4 class="section-title">Admin Notes</h4>
                    <p class="admin-notes">{{ selectedWithdrawal.adminNotes || selectedWithdrawal.rejectionReason }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/features/auth/stores/auth.store'
import Sidebar from '@/features/dashboard/components/dashboard-sidebar.vue'
import MessagePopup from '~/shared/components/message/MessagePopup.vue'

const alertRef = ref(null)
const authStore = useAuthStore()

// API Base URL
const BASE_API_URL = 'https://dark-caldron-448714-u5.uc.r.appspot.com'

// User state
const user = computed(() => authStore.getUser || {})

// Reactive data
const withdrawals = ref([])
const userBalance = ref({
  available: 0,
  pending: 0,
  totalWithdrawn: 0
})
const loading = ref(false)
const submitting = ref(false)
const cancelling = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const showNewRequestModal = ref(false)
const showDetailsModal = ref(false)
const selectedWithdrawal = ref(null)

// Form data
const withdrawalForm = ref({
  amount: '',
  method: '',
  accountDetails: {},
  reason: ''
})

// Withdrawal methods configuration
const withdrawalMethods = [
  {
    value: 'bank_transfer',
    title: 'Bank Transfer',
    feeText: '2% fee',
    processingTime: '3-5 business days'
  },
  {
    value: 'paypal',
    title: 'PayPal',
    feeText: '2.5% fee',
    processingTime: '1-2 business days'
  },
  {
    value: 'mobile_money',
    title: 'Mobile Money',
    feeText: '1.5% fee',
    processingTime: '24 hours'
  },
  {
    value: 'crypto',
    title: 'Cryptocurrency',
    feeText: '1% fee',
    processingTime: '1 hour'
  }
]

// Computed properties
const filteredWithdrawals = computed(() => {
  let filtered = withdrawals.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(w => 
      w.amount.toString().includes(query) ||
      w.method.toLowerCase().includes(query) ||
      w.status.toLowerCase().includes(query)
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(w => w.status === statusFilter.value)
  }

  return filtered
})

const isFormValid = computed(() => {
  return withdrawalForm.value.amount && 
         withdrawalForm.value.method && 
         validateAccountDetails()
})

// Methods
const fetchWithdrawals = async () => {
  loading.value = true
  try {
    const response = await $fetch(`${BASE_API_URL}/withdrawals/user/${user.value._id}`, {
      headers: {
        'Authorization': `Bearer ${authStore.getToken}`
      }
    })

    if (response.success) {
      withdrawals.value = response.data
    }
  } catch (error) {
    alertRef.value?.error('Failed to load withdrawals')
  } finally {
    loading.value = false
  }
}

const fetchUserBalance = async () => {
  try {
    const response = await $fetch(`${BASE_API_URL}/users/balance`, {
      headers: {
        'Authorization': `Bearer ${authStore.getToken}`
      }
    })

    if (response.success) {
      userBalance.value = response.data
    }
  } catch (error) {
    console.error('Failed to fetch balance:', error)
  }
}

const submitWithdrawal = async () => {
  if (!isFormValid.value) return

  submitting.value = true
  try {
    const response = await $fetch(`${BASE_API_URL}/withdrawals/request`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.getToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(withdrawalForm.value)
    })

    if (response.success) {
      alertRef.value?.success('Withdrawal request submitted successfully!')
      closeNewRequestModal()
      await Promise.all([fetchWithdrawals(), fetchUserBalance()])
    } else {
      alertRef.value?.error(response.message || 'Failed to submit withdrawal request')
    }
  } catch (error) {
    alertRef.value?.error('Failed to submit withdrawal request')
  } finally {
    submitting.value = false
  }
}

const cancelWithdrawal = async (withdrawalId) => {
  if (!confirm('Are you sure you want to cancel this withdrawal request?')) return

  cancelling.value = true
  try {
    const response = await $fetch(`${BASE_API_URL}/withdrawals/${withdrawalId}/cancel`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authStore.getToken}`
      }
    })

    if (response.success) {
      alertRef.value?.success('Withdrawal cancelled successfully!')
      await Promise.all([fetchWithdrawals(), fetchUserBalance()])
    } else {
      alertRef.value?.error(response.message || 'Failed to cancel withdrawal')
    }
  } catch (error) {
    alertRef.value?.error('Failed to cancel withdrawal')
  } finally {
    cancelling.value = false
  }
}

const viewDetails = (withdrawal) => {
  selectedWithdrawal.value = withdrawal
  showDetailsModal.value = true
}

const closeNewRequestModal = () => {
  showNewRequestModal.value = false
  withdrawalForm.value = {
    amount: '',
    method: '',
    accountDetails: {},
    reason: ''
  }
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedWithdrawal.value = null
}

const validateAccountDetails = () => {
  const { method, accountDetails } = withdrawalForm.value
  if (!method || !accountDetails) return false

  switch (method) {
    case 'bank_transfer':
      return accountDetails.accountNumber && accountDetails.bankName && accountDetails.accountHolderName
    case 'paypal':
      return accountDetails.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(accountDetails.email)
    case 'mobile_money':
      return accountDetails.phoneNumber && accountDetails.provider
    case 'crypto':
      return accountDetails.address && accountDetails.currency
    default:
      return false
  }
}

// Utility functions
const formatAmount = (amount) => {
  return parseFloat(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })
}

const formatMethod = (method) => {
  const methods = {
    bank_transfer: 'Bank Transfer',
    paypal: 'PayPal',
    mobile_money: 'Mobile Money',
    crypto: 'Cryptocurrency'
  }
  return methods[method] || method
}

const formatStatus = (status) => {
  const statuses = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    cancelled: 'Cancelled',
    completed: 'Completed'
  }
  return statuses[status] || status
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatDateLong = (date) => {
  return new Date(date).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const calculateFee = (amount, method) => {
  if (!amount || !method) return '0.00'
  
  const feeRates = {
    bank_transfer: 0.02,
    paypal: 0.025,
    mobile_money: 0.015,
    crypto: 0.01
  }
  
  const fee = parseFloat(amount) * (feeRates[method] || 0.02)
  return Math.min(fee, 50).toFixed(2)
}

const calculateNetAmount = (amount, method) => {
  if (!amount || !method) return '0.00'
  const fee = parseFloat(calculateFee(amount, method))
  return (parseFloat(amount) - fee).toFixed(2)
}
</script>

<style scoped>
/* Complete CSS Styles for Withdrawal Request Component */

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

/* Header Styles */
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
  @apply text-2xl bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent;
  font-variant: small-caps;
  letter-spacing: -0.025em;
}

.welcome-message {
  @apply text-sm font-medium text-slate-600 mt-1;
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
  @apply bg-amber-400 top-6 right-12;
  animation-delay: 4s;
}

/* Header Actions */
.header-actions {
  @apply flex items-center space-x-3;
}

.action-btn {
  @apply relative px-4 py-2 rounded-2xl font-medium text-sm transition-all duration-300;
  @apply hover:scale-105 hover:shadow-lg;
  backdrop-filter: blur(12px);
}

.btn-bg {
  @apply absolute inset-0 rounded-2xl transition-all duration-300;
}

.create-btn .btn-bg {
  @apply bg-gradient-to-r from-green-100/80 to-emerald-100/60;
}

.referral-btn .btn-bg {
  @apply bg-gradient-to-r from-blue-100/80 to-purple-100/60;
}

.btn-content {
  @apply relative z-10 flex items-center space-x-2;
}

.btn-icon {
  @apply w-4 h-4;
}

.create-btn {
  @apply text-green-700 hover:text-green-900;
}

.referral-btn {
  @apply text-blue-700 hover:text-blue-900;
}

/* Main Dashboard Content */
.dashboard-main {
  @apply flex-1 p-6 flex flex-col space-y-8;
  min-height: 0;
  overflow-y: auto;
  padding-bottom: 2rem;
}

/* Balance Summary */
.balance-summary {
  @apply grid grid-cols-1 md:grid-cols-3 gap-6;
}

.balance-card {
  position: relative;
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
}

.balance-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.balance-backdrop {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0.03;
  z-index: 0;
}

.balance-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
}

.balance-icon {
  width: 4rem;
  height: 4rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.balance-card.available .balance-icon {
  background-color: #10b981;
}

.balance-card.pending .balance-icon {
  background-color: #f59e0b;
}

.balance-card.total .balance-icon {
  background-color: #3b82f6;
}

.balance-icon svg {
  width: 2rem;
  height: 2rem;
}

.balance-info {
  flex: 1;
}

.balance-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.balance-amount {
  font-size: 2rem;
  font-weight: 800;
  color: #1f2937;
  margin: 0;
  line-height: 1;
}

/* Search and Filter */
.search-filter-bar {
  @apply relative rounded-3xl overflow-hidden;
  backdrop-filter: blur(20px);
}

.search-backdrop {
  @apply absolute inset-0 bg-gradient-to-r from-white/95 via-white/90 to-slate-50/80 border border-white/60;
}

.search-content {
  @apply relative z-10 p-6 flex flex-col sm:flex-row gap-4;
}

.search-input-container {
  @apply relative flex-1;
}

.search-icon {
  @apply absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400;
}

.search-input {
  @apply w-full pl-12 pr-4 py-3 bg-white/80 border border-slate-200/60 rounded-2xl;
  @apply focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400;
  @apply transition-all duration-300;
}

.status-filter {
  @apply px-4 py-3 bg-white/80 border border-slate-200/60 rounded-2xl;
  @apply focus:ring-2 focus:ring-blue-500 focus:border-transparent;
  @apply transition-all duration-300 text-slate-700;
}

/* Loading and Empty States */
.loading-container {
  @apply flex flex-col items-center justify-center py-16 space-y-4;
}

.loading-spinner {
  @apply w-8 h-8 border-4 border-slate-200 border-t-blue-500 rounded-full;
  animation: spin 1s linear infinite;
}

.loading-text {
  @apply text-slate-600 font-medium;
}

.empty-state {
  @apply relative rounded-3xl overflow-hidden;
  backdrop-filter: blur(20px);
}

.empty-backdrop {
  @apply absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-slate-50/80 border border-white/60;
}

.empty-content {
  @apply relative z-10 p-12 text-center;
}

.empty-icon {
  @apply w-16 h-16 mx-auto mb-4 text-slate-400;
}

.empty-icon svg {
  @apply w-full h-full;
}

.empty-title {
  @apply text-xl font-bold text-slate-700 mb-2;
}

.empty-description {
  @apply text-slate-500 mb-6;
}

.empty-action-btn {
  @apply px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl;
  @apply font-medium hover:shadow-lg hover:scale-105 transition-all duration-300;
}

/* Withdrawals Grid */
.withdrawals-grid {
  @apply grid grid-cols-1 lg:grid-cols-2 gap-6;
}

.withdrawal-card {
  @apply relative rounded-3xl overflow-hidden transition-all duration-300;
  @apply hover:scale-[1.02] hover:shadow-xl;
  backdrop-filter: blur(20px);
}

.withdrawal-backdrop {
  @apply absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-slate-50/80 border border-white/60;
}

.withdrawal-content {
  @apply relative z-10 p-6 space-y-4;
}

.withdrawal-header {
  @apply flex items-start justify-between;
}

.withdrawal-info h4.withdrawal-amount {
  @apply text-xl font-bold text-slate-900;
}

.withdrawal-method {
  @apply text-sm text-slate-600 font-medium;
}

.withdrawal-status {
  @apply px-3 py-1 rounded-full text-xs font-medium;
}

.status-pending {
  @apply bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200;
}

.status-approved {
  @apply bg-green-100 text-green-800 ring-1 ring-green-200;
}

.status-rejected {
  @apply bg-red-100 text-red-800 ring-1 ring-red-200;
}

.status-cancelled {
  @apply bg-gray-100 text-gray-800 ring-1 ring-gray-200;
}

.status-completed {
  @apply bg-blue-100 text-blue-800 ring-1 ring-blue-200;
}

.withdrawal-details {
  @apply space-y-2;
}

.detail-row {
  @apply flex justify-between text-sm;
}

.detail-label {
  @apply text-slate-500 font-medium;
}

.detail-value {
  @apply text-slate-800 font-semibold;
}

.withdrawal-actions {
  @apply flex space-x-2 pt-4 border-t border-slate-200/60;
}

.action-btn {
  @apply flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-medium;
  @apply transition-all duration-300 hover:scale-105;
}

.action-icon {
  @apply w-3 h-3;
}

.view-btn {
  @apply bg-blue-100 text-blue-700 hover:bg-blue-200;
}

.cancel-btn {
  @apply bg-red-100 text-red-700 hover:bg-red-200;
}

/* Modal Styles */
.modal-overlay {
  @apply fixed inset-0 bg-white/50 flex items-center justify-center z-50 p-4;
  backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease-out;
}

.modal-container {
  @apply relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl;
  animation: slideIn 0.3s ease-out;
}

.modal-backdrop {
  @apply absolute inset-0 bg-white/95 border border-white/60;
  backdrop-filter: blur(20px);
}

.modal-content {
  @apply relative z-10 flex flex-col max-h-[90vh];
}

.modal-header {
  @apply flex items-center justify-between p-6 border-b border-slate-200/60;
}

.modal-title {
  @apply text-xl font-bold text-slate-900;
}

.modal-close {
  @apply p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100/70;
  @apply transition-all duration-300;
}

.modal-close svg {
  @apply w-5 h-5;
}

.modal-body {
  @apply p-6 overflow-y-auto flex-1;
}

/* Form Styles */
.withdrawal-form {
  @apply space-y-6;
}

.form-group {
  @apply space-y-2;
}

.form-label {
  @apply block text-sm font-medium text-slate-700;
}

.amount-input-container {
  @apply relative;
}

.currency-symbol {
  @apply absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium;
}

.amount-input {
  @apply w-full pl-8 pr-4 py-3 bg-white border border-slate-200 rounded-2xl;
  @apply focus:ring-2 focus:ring-blue-500 focus:border-transparent;
  @apply transition-all duration-300 text-lg font-semibold;
}

.amount-info {
  @apply flex justify-between text-xs text-slate-500 mt-2;
}

.available-balance {
  @apply font-medium;
}

.fee-info {
  @apply text-blue-600;
}

.method-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 gap-3;
}

.method-option {
  @apply p-4 border-2 border-slate-200 rounded-2xl cursor-pointer transition-all duration-300;
  @apply hover:border-blue-300 hover:bg-blue-50/50;
}

.method-option:hover {
  transform: translateY(-2px);
}

.method-option.active {
  @apply border-blue-500 bg-blue-50;
}

.method-title {
  @apply font-semibold text-slate-900 text-sm;
}

.method-fee {
  @apply text-xs text-slate-500;
}

.method-time {
  @apply text-xs text-blue-600;
}

.account-fields {
  @apply space-y-3;
}

.form-input {
  @apply w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl;
  @apply focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400;
  @apply transition-all duration-300;
}

.form-input:invalid {
  @apply border-red-300 focus:border-red-500 focus:ring-red-500;
}

.form-input:valid {
  @apply border-green-300 focus:border-green-500 focus:ring-green-500;
}

.form-select {
  @apply w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl;
  @apply focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700;
  @apply transition-all duration-300;
}

.form-textarea {
  @apply w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl;
  @apply focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400;
  @apply resize-none transition-all duration-300;
}

.form-actions {
  @apply flex justify-end space-x-4 pt-6 border-t border-slate-200;
}

.cancel-btn {
  @apply px-6 py-3 bg-slate-100 text-slate-700 rounded-2xl font-medium;
  @apply hover:bg-slate-200 transition-all duration-300;
}

.cancel-btn:disabled {
  @apply cursor-not-allowed opacity-50;
}

.submit-btn {
  @apply px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl;
  @apply font-medium hover:shadow-lg hover:scale-105 focus:ring-2 focus:ring-blue-500;
  @apply focus:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed;
  @apply transition-all duration-300;
}

/* Details Modal */
.detail-section {
  @apply mb-6;
}

.section-title {
  @apply text-lg font-bold text-slate-900 mb-4;
}

.detail-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 gap-4;
}

.detail-item {
  @apply flex flex-col space-y-1;
}

.item-label {
  @apply text-sm font-medium text-slate-500;
}

.item-value {
  @apply text-sm text-slate-900 font-semibold;
}

.status-badge {
  @apply px-2 py-1 rounded-lg text-xs font-medium;
}

.reason-text {
  @apply bg-slate-50 rounded-2xl p-4 text-slate-700 leading-relaxed;
}

.admin-notes {
  @apply bg-amber-50 rounded-2xl p-4 text-amber-800 leading-relaxed;
  @apply border-l-4 border-amber-400;
}

/* Animations */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
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

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Custom Scrollbar */
.main-content,
.dashboard-main,
.modal-body {
  scrollbar-width: thin;
  scrollbar-color: rgba(148, 163, 184, 0.3) transparent;
}

.main-content::-webkit-scrollbar,
.dashboard-main::-webkit-scrollbar,
.modal-body::-webkit-scrollbar {
  width: 6px;
}

.main-content::-webkit-scrollbar-track,
.dashboard-main::-webkit-scrollbar-track,
.modal-body::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 3px;
}

.main-content::-webkit-scrollbar-thumb,
.dashboard-main::-webkit-scrollbar-thumb,
.modal-body::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, rgba(148, 163, 184, 0.3), rgba(148, 163, 184, 0.5));
  border-radius: 3px;
  transition: all 0.3s ease;
}

.main-content::-webkit-scrollbar-thumb:hover,
.dashboard-main::-webkit-scrollbar-thumb:hover,
.modal-body::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, rgba(148, 163, 184, 0.5), rgba(148, 163, 184, 0.7));
}

/* Responsive Design */
@media (max-width: 640px) {
  .dashboard-title {
    @apply text-xl;
  }
  
  .header-actions {
    @apply flex-wrap justify-center;
  }
  
  .withdrawals-grid {
    @apply grid-cols-1;
  }
  
  .withdrawal-actions {
    @apply flex-col space-y-2 space-x-0;
  }
  
  .action-btn {
    @apply justify-center;
  }
  
  .method-grid {
    @apply grid-cols-1;
  }
  
  .form-actions {
    @apply flex-col space-y-3 space-x-0;
  }
  
  .detail-grid {
    @apply grid-cols-1;
  }
  
  .dashboard-main {
    @apply px-3;
  }
  
  .modal-container {
    @apply mx-2;
  }
  
  .balance-content {
    @apply flex-col text-center;
  }
  
  .balance-icon {
    @apply w-12 h-12 mx-auto;
  }
  
  .withdrawal-header {
    @apply flex-col space-y-2 items-start;
  }
}

@media (max-width: 480px) {
  .dashboard-main {
    @apply px-3;
  }
  
  .modal-container {
    @apply mx-2;
  }
  
  .balance-content {
    @apply flex-col text-center;
  }
  
  .balance-icon {
    @apply w-12 h-12 mx-auto;
  }
  
  .withdrawal-header {
    @apply flex-col space-y-2 items-start;
  }
}

@media (min-width: 1280px) {
  .withdrawals-grid {
    @apply grid-cols-3;
  }
  
  .balance-summary {
    @apply grid-cols-3;
  }
}

/* Focus styles for accessibility */
.action-btn:focus,
.method-option:focus,
.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  @apply outline-none ring-2 ring-blue-500 ring-offset-2;
}

.action-btn:focus-visible,
.form-input:focus-visible,
.form-select:focus-visible {
  @apply ring-2 ring-blue-500 ring-offset-2 outline-none;
}

/* Print styles */
@media print {
  .header-decorations,
  .floating-orb,
  .header-actions,
  .search-filter-bar,
  .withdrawal-actions {
    display: none !important;
  }
  
  .dashboard-container {
    @apply bg-white;
  }
  
  .withdrawal-card,
  .balance-card {
    @apply border border-slate-300 shadow-none;
    break-inside: avoid;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .balance-backdrop,
  .search-backdrop,
  .empty-backdrop,
  .withdrawal-backdrop,
  .modal-backdrop {
    @apply bg-white border-2 border-slate-900;
  }
  
  .floating-orb {
    @apply opacity-60;
  }
  
  .method-option.active {
    @apply border-blue-900 bg-blue-100;
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .floating-orb,
  .loading-spinner {
    animation: none;
  }
  
  .balance-card:hover,
  .withdrawal-card:hover,
  .action-btn:hover,
  .submit-btn:hover {
    transform: none;
  }
  
  * {
    transition-duration: 0.01ms !important;
  }
}

@media (prefers-reduced-motion: no-preference) {
  .balance-card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .withdrawal-card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}


/* Utility classes */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Message styles */
.error-message {
  @apply bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg;
}

.success-message {
  @apply bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg;
}
</style>