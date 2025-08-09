import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'

// Define the Firebase interface
interface FirebaseServices {
  app: FirebaseApp
  auth: Auth
  db: Firestore
  storage: FirebaseStorage
}

// Declare module for Nuxt to understand the injected types
declare module '#app' {
  interface NuxtApp {
    $firebase: FirebaseServices | null
  }
}

export default defineNuxtPlugin(() => {
  console.log('🔥 Firebase plugin loading...')
  
  const config = useRuntimeConfig()
  
  console.log('🔧 Runtime config:', {
    firebaseApiKey: config.public.firebaseApiKey ? '[SET]' : '[MISSING]',
    firebaseAuthDomain: config.public.firebaseAuthDomain ? '[SET]' : '[MISSING]',
    firebaseProjectId: config.public.firebaseProjectId ? '[SET]' : '[MISSING]',
    firebaseStorageBucket: config.public.firebaseStorageBucket ? '[SET]' : '[MISSING]',
    firebaseMessagingSenderId: config.public.firebaseMessagingSenderId ? '[SET]' : '[MISSING]',
    firebaseAppId: config.public.firebaseAppId ? '[SET]' : '[MISSING]'
  })
  
  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId
  }

  // Validate Firebase configuration
  if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
    console.error('❌ Firebase configuration is incomplete. Check your environment variables.')
    console.error('Missing config values:', {
      apiKey: firebaseConfig.apiKey ? '✅' : '❌ MISSING',
      authDomain: firebaseConfig.authDomain ? '✅' : '❌ MISSING',
      projectId: firebaseConfig.projectId ? '✅' : '❌ MISSING',
      storageBucket: firebaseConfig.storageBucket ? '✅' : '❌ MISSING',
      messagingSenderId: firebaseConfig.messagingSenderId ? '✅' : '❌ MISSING',
      appId: firebaseConfig.appId ? '✅' : '❌ MISSING'
    })
    
    return {
      provide: {
        firebase: null as FirebaseServices | null
      }
    }
  }

  try {
    console.log('🚀 Initializing Firebase with config...')
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig)

    // Initialize Firebase services
    const auth = getAuth(app)
    const db = getFirestore(app)
    const storage = getStorage(app)

    console.log('✅ Firebase initialized successfully!')
    console.log('Firebase services:', {
      app: !!app,
      auth: !!auth,
      db: !!db,
      storage: !!storage
    })

    return {
      provide: {
        firebase: {
          app,
          auth,
          db,
          storage
        } as FirebaseServices
      }
    }
  } catch (error) {
    console.error('❌ Failed to initialize Firebase:', error)
    return {
      provide: {
        firebase: null as FirebaseServices | null
      }
    }
  }
})