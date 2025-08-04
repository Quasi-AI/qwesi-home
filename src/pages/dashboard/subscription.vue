<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <Sidebar :user="user" />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Top Navigation -->
      <header class="bg-white border-b border-gray-200 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Subscription Management</h1>
            <p class="text-sm text-gray-600">Manage your QWESI AI subscription</p>
          </div>
        </div>
      </header>

      <!-- Main Content Area -->
      <main class="flex-1 p-6">
        <div class="max-w-6xl mx-auto">
          <!-- Current Plan Status -->
          <div class="mb-8">
            <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-white/20 rounded-lg">
                      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                    <div>
                      <h2 class="text-2xl font-bold">{{ currentPlanName }}</h2>
                      <p class="text-blue-100">{{ subscriptionMessage }}</p>
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-3xl font-bold">{{ currentPlanPrice }}</div>
                  <div class="text-blue-100">per month</div>
                </div>
              </div>
              
              <!-- Subscription Details -->
              <div class="mt-6 pt-6 border-t border-white/20">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="flex items-center gap-3">
                    <svg class="w-5 h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <div>
                      <div class="text-sm text-blue-200">
                        {{ isPro ? 'Started' : 'Account Created' }}
                      </div>
                      <div class="font-medium">{{ formattedAccountCreationDate }}</div>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <svg class="w-5 h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12,6 12,12 16,14"/>
                    </svg>
                    <div>
                      <div class="text-sm text-blue-200">
                        {{ isPro ? 'Next Billing' : 'Upgrade Available' }}
                      </div>
                      <div class="font-medium">
                        {{ isPro ? formattedSubscriptionEndDate : 'Anytime' }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Payment Method -->
              <div class="mt-6 pt-6 border-t border-white/20" v-if="hasPaymentMethod">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <svg class="w-5 h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                      <line x1="8" y1="21" x2="16" y2="21"/>
                      <line x1="12" y1="17" x2="12" y2="21"/>
                    </svg>
                    <div>
                      <div class="text-sm text-blue-200">Payment Method</div>
                      <div class="font-medium">VISA •••• {{ maskedCardNumber }}</div>
                    </div>
                  </div>
                  <button @click="showUpdatePaymentModal = true"
                    class="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-sm font-medium">
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Plan Comparison -->
          <div class="grid md:grid-cols-2 gap-8 mb-8">
            <!-- Free Plan -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative"
                 :class="{'border-2 border-green-500': !isPro}">
              <div v-if="!isPro" class="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div class="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Current Plan
                </div>
              </div>
              
              <div class="p-6 border-b border-gray-100 mt-4">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-xl font-bold text-gray-900">Free Plan</h3>
                    <p class="text-gray-600">Perfect for getting started</p>
                  </div>
                  <div class="text-right">
                    <div class="text-3xl font-bold text-gray-900">$0</div>
                    <div class="text-sm text-gray-500">forever</div>
                  </div>
                </div>
              </div>
              
              <div class="p-6">
                <ul class="space-y-4">
                  <li class="flex items-start gap-3">
                    <div class="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <svg class="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">Basic AI Assistant</div>
                      <div class="text-sm text-gray-600">Access to core AI features</div>
                    </div>
                  </li>
                  <li class="flex items-start gap-3">
                    <div class="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <svg class="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">10 Queries per Day</div>
                      <div class="text-sm text-gray-600">Perfect for light usage</div>
                    </div>
                  </li>
                  <li class="flex items-start gap-3">
                    <div class="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <svg class="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">Email Support</div>
                      <div class="text-sm text-gray-600">48-hour response time</div>
                    </div>
                  </li>
                  <li class="flex items-start gap-3">
                    <div class="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <svg class="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">Basic Templates</div>
                      <div class="text-sm text-gray-600">Access to 5 templates</div>
                    </div>
                  </li>
                  <li class="flex items-start gap-3 opacity-50">
                    <div class="flex-shrink-0 w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center mt-0.5">
                      <svg class="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <div class="font-medium text-gray-500">No API Access</div>
                    </div>
                  </li>
                </ul>
                
                <button 
                  class="w-full mt-6 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium cursor-not-allowed"
                  :class="{'bg-green-600 text-white hover:bg-green-700 cursor-pointer': !isPro}"
                  @click="!isPro && (showUpgradeModal = true)">
                  {{ isPro ? 'Current Plan' : 'Upgrade to Pro' }}
                </button>
              </div>
            </div>

            <!-- Pro Plan -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative"
                 :class="{'border-2 border-green-500': isPro}">
              <div v-if="isPro" class="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div class="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Current Plan
                </div>
              </div>
              
              <div class="p-6 border-b border-gray-100 mt-4">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-xl font-bold text-gray-900">Pro Plan</h3>
                    <p class="text-gray-600">For power users and professionals</p>
                  </div>
                  <div class="text-right">
                    <div class="text-3xl font-bold text-gray-900">$4.99</div>
                    <div class="text-sm text-gray-500">per month</div>
                  </div>
                </div>
              </div>
              
              <div class="p-6">
                <ul class="space-y-4">
                  <li class="flex items-start gap-3">
                    <div class="flex-shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <svg class="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">Advanced AI Models</div>
                      <div class="text-sm text-gray-600">GPT-4, Claude, and more</div>
                    </div>
                  </li>
                  <li class="flex items-start gap-3">
                    <div class="flex-shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <svg class="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">Unlimited Queries</div>
                      <div class="text-sm text-gray-600">No daily limits</div>
                    </div>
                  </li>
                  <li class="flex items-start gap-3">
                    <div class="flex-shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <svg class="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">Priority Support</div>
                      <div class="text-sm text-gray-600">24/7 chat support</div>
                    </div>
                  </li>
                  <li class="flex items-start gap-3">
                    <div class="flex-shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <svg class="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">100+ Premium Templates</div>
                      <div class="text-sm text-gray-600">Industry-specific templates</div>
                    </div>
                  </li>
                  <li class="flex items-start gap-3">
                    <div class="flex-shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <svg class="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">API Access</div>
                      <div class="text-sm text-gray-600">Integrate with your apps</div>
                    </div>
                  </li>
                  <li class="flex items-start gap-3">
                    <div class="flex-shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <svg class="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">Team Collaboration</div>
                      <div class="text-sm text-gray-600">Share projects with team</div>
                    </div>
                  </li>
                </ul>
                
                <button 
                  @click="isPro ? showCancelModal = true : showUpgradeModal = true"
                  class="w-full mt-6 px-4 py-3 rounded-lg font-medium transition-colors"
                  :class="{
                    'bg-red-600 text-white hover:bg-red-700': isPro,
                    'bg-blue-600 text-white hover:bg-blue-700': !isPro
                  }">
                  {{ isPro ? 'Cancel Subscription' : 'Upgrade to Pro' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Feature Comparison Table -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="p-6 border-b border-gray-200">
              <h3 class="text-xl font-bold text-gray-900">Detailed Feature Comparison</h3>
              <p class="text-gray-600">See exactly what's included in each plan</p>
            </div>
            
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-4 text-left text-sm font-medium text-gray-900">Features</th>
                    <th class="px-6 py-4 text-center text-sm font-medium" 
                        :class="{'text-white bg-green-600': !isPro, 'text-gray-900': isPro}">
                      Free {{ !isPro ? '(Current)' : '' }}
                    </th>
                    <th class="px-6 py-4 text-center text-sm font-medium" 
                        :class="{'text-white bg-green-600': isPro, 'text-gray-900': !isPro}">
                      Pro {{ isPro ? '(Current)' : '' }}
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr>
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">AI Model Access</td>
                    <td class="px-6 py-4 text-center text-sm" 
                        :class="{'text-white bg-green-600 font-medium': !isPro, 'text-gray-600': isPro}">
                      GPT-3.5
                    </td>
                    <td class="px-6 py-4 text-center text-sm" 
                        :class="{'text-white bg-green-600 font-medium': isPro, 'text-gray-600': !isPro}">
                      GPT-4, Claude, Gemini
                    </td>
                  </tr>
                  <tr class="bg-gray-50">
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">Monthly Queries</td>
                    <td class="px-6 py-4 text-center text-sm" 
                        :class="{'text-white bg-green-600 font-medium': !isPro, 'text-gray-600': isPro}">
                      300
                    </td>
                    <td class="px-6 py-4 text-center text-sm" 
                        :class="{'text-white bg-green-600 font-medium': isPro, 'text-gray-600': !isPro}">
                      Unlimited
                    </td>
                  </tr>
                  <tr>
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">Templates</td>
                    <td class="px-6 py-4 text-center text-sm" 
                        :class="{'text-white bg-green-600 font-medium': !isPro, 'text-gray-600': isPro}">
                      5 Basic
                    </td>
                    <td class="px-6 py-4 text-center text-sm" 
                        :class="{'text-white bg-green-600 font-medium': isPro, 'text-gray-600': !isPro}">
                      100+ Premium
                    </td>
                  </tr>
                  <tr class="bg-gray-50">
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">File Upload Size</td>
                    <td class="px-6 py-4 text-center text-sm" 
                        :class="{'text-white bg-green-600 font-medium': !isPro, 'text-gray-600': isPro}">
                      5MB
                    </td>
                    <td class="px-6 py-4 text-center text-sm" 
                        :class="{'text-white bg-green-600 font-medium': isPro, 'text-gray-600': !isPro}">
                      100MB
                    </td>
                  </tr>
                  <tr>
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">Export Formats</td>
                    <td class="px-6 py-4 text-center text-sm" 
                        :class="{'text-white bg-green-600 font-medium': !isPro, 'text-gray-600': isPro}">
                      TXT
                    </td>
                    <td class="px-6 py-4 text-center text-sm" 
                        :class="{'text-white bg-green-600 font-medium': isPro, 'text-gray-600': !isPro}">
                      PDF, DOCX, HTML
                    </td>
                  </tr>
                  <tr class="bg-gray-50">
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">API Access</td>
                    <td class="px-6 py-4 text-center" 
                        :class="{'bg-green-600': !isPro}">
                      <svg class="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 20 20"
                           :class="{'text-red-500': !isPro, 'text-white': isPro}">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                      </svg>
                    </td>
                    <td class="px-6 py-4 text-center" 
                        :class="{'bg-green-600': isPro}">
                      <svg class="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 20 20"
                           :class="{'text-green-500': !isPro, 'text-white': isPro}">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                      </svg>
                    </td>
                  </tr>
                  <tr>
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">Support</td>
                    <td class="px-6 py-4 text-center text-sm" 
                        :class="{'text-white bg-green-600 font-medium': !isPro, 'text-gray-600': isPro}">
                      Email (48h)
                    </td>
                    <td class="px-6 py-4 text-center text-sm" 
                        :class="{'text-white bg-green-600 font-medium': isPro, 'text-gray-600': !isPro}">
                      24/7 Chat
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Upgrade Modal -->
    <ProModal v-model="showUpgradeModal" mode="upgrade" :loading="subscriptionStore.isLoading" />

    <!-- Cancel Subscription Modal -->
    <ProModal v-model="showCancelModal" mode="cancel" :loading="subscriptionStore.isLoading" />

    <!-- Update Payment Modal -->
    <ProModal v-model="showUpdatePaymentModal" mode="update" :loading="subscriptionStore.isLoading"
        @submit="handleUpdatePayment" />
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
  if (!authStore.isAuthenticated) {
    navigateTo('/auth/login')
    return
  }
  
  await subscriptionStore.fetchSubscription()
  await subscriptionStore.fetchPlans()
})

// Set page title
useHead({
  title: 'Subscription - QWESI AI'
})
</script>