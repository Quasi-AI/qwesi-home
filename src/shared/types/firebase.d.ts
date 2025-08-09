import type { FirebaseApp } from 'firebase/app'
import type { Auth } from 'firebase/auth'
import type { Firestore } from 'firebase/firestore'
import type { FirebaseStorage } from 'firebase/storage'

export interface FirebaseServices {
  app: FirebaseApp
  auth: Auth
  db: Firestore
  storage: FirebaseStorage
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $firebase: FirebaseServices | null
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $firebase: FirebaseServices | null
  }
}