'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ResetPasswordModal from '@/modals/ResetPasswordModal'

// Component that uses useSearchParams
function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const email = searchParams.get('email') || ''

  return <ResetPasswordModal isOpen={true} onClose={() => {}} token={token} email={email} />
}

// Loading fallback
function ResetPasswordLoading() {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-10 bg-gray-200 rounded w-full mt-6"></div>
        </div>
      </div>
    </div>
  )
}

// Main page component with Suspense wrapper
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordContent />
    </Suspense>
  )
}