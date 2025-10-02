import React from 'react'
import { X, Star, Zap, Check, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSubscriptionStore } from '@/stores/subscriptionStore'
import { useAuthStore } from '@/stores/authStore'

const SubscriptionModal = ({ isOpen, onClose }) => {
  const router = useRouter()
  const { createCheckoutSession } = useSubscriptionStore()
  const { user, isAuthenticated } = useAuthStore()

  // Fallback to localStorage if user or user.email is not available
  const getUserEmail = () => {
    if (user && user.email) return user.email
    try {
      const authData = localStorage.getItem('auth')
      if (authData) {
        const auth = JSON.parse(authData)
        if (auth.user && auth.user.email) {
          return auth.user.email
        }
      }
    } catch (error) {
      console.error('Error reading user email from localStorage:', error)
    }
    return null
  }

  if (!isOpen) return null

  const handleUpgrade = async () => {
    onClose()
    if (!isAuthenticated) {
      if (typeof window !== 'undefined') window.dispatchEvent(new Event('auth:open-login'))
      return
    }
    try {
      const email = getUserEmail()
      if (!email) {
        console.error('User email is required for checkout session')
        return
      }
      const result = await createCheckoutSession({
        priceId: 'price_pro_monthly', // You may need to adjust this based on your Stripe price ID
        email,
        successUrl: `${window.location.origin}/dashboard/subscription?success=true`,
        cancelUrl: `${window.location.origin}/scholarships`
      })

      if (result.success && result.checkoutUrl) {
        window.location.href = result.checkoutUrl
      } else {
        console.error('Failed to create checkout session:', result.error)
        // Fallback to dashboard if checkout creation fails
        router.push('/dashboard/subscription')
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      // Fallback to dashboard if there's an error
      router.push('/dashboard/subscription')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#5C3AEC]/10 rounded-lg">
                <Star className="w-5 h-5 text-[#5C3AEC]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Upgrade to Pro</h3>
                <p className="text-sm text-gray-600">Unlock full access to premium content</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#5C3AEC] to-[#5C3AEC] rounded-full mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">Premium Access Required</h4>
            <p className="text-gray-600">
              You've reached the limit of free content. Upgrade to Pro to access all scholarships, investors, and talent profiles.
            </p>
          </div>

          <div className="bg-[#5C3AEC]/5 border border-[#5C3AEC]/20 rounded-lg p-4 mb-6">
            <h5 className="font-semibold text-[#5C3AEC] mb-3">Pro Plan Benefits:</h5>
            <ul className="space-y-2 text-sm text-[#5C3AEC]/80">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#5C3AEC]" />
                Unlimited access to all scholarships
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#5C3AEC]" />
                Full investor database and contact info
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#5C3AEC]" />
                Complete talent pool with chat features
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#5C3AEC]" />
                Priority customer support
              </li>
            </ul>
          </div>

          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-gray-900">$4.99<span className="text-lg text-gray-600">/month</span></div>
            <p className="text-sm text-gray-600 mt-1">Cancel anytime</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Maybe Later
            </button>
            <button
              onClick={handleUpgrade}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-[#5C3AEC] to-[#5C3AEC] text-white rounded-lg hover:from-[#5C3AEC]/90 hover:to-[#5C3AEC]/90 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              Upgrade Now
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionModal
