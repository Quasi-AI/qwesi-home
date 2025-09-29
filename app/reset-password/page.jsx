'use client'

import { useSearchParams } from 'next/navigation'
import ResetPasswordModal from '@/modals/ResetPasswordModal'

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const email = decodeURIComponent(token)

  return <ResetPasswordModal isOpen={true} onClose={() => {}} token={token} email={email} />
}
