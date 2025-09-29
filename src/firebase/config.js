import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAH_3l6IEAldLkXyB0CXqYpHRwWDvqZjhU',
  authDomain: 'park4me-b2127.firebaseapp.com',
  projectId: 'park4me-b2127',
  storageBucket: 'park4me-b2127.appspot.com',
  messagingSenderId: '372838267059',
  appId: '1:372838267059:web:20430ac4e8fe7f2f4cd8c6'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
