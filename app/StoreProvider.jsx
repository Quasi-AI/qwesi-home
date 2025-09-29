'use client'

import { Provider } from 'react-redux'
import { makeStore } from '@/lib/store'
import { useAuthStore } from '@/stores/authStore'
import { useEffect } from 'react'

const store = makeStore()

function AuthInitializer() {
  const initAuth = useAuthStore((state) => state.initAuth)
  useEffect(() => {
    initAuth()
  }, [initAuth])
  return null
}

export default function StoreProvider({ children }) {
  return (
    <Provider store={store}>
      <AuthInitializer />
      {children}
    </Provider>
  )
}
