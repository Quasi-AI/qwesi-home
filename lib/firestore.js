import { db } from '@/src/firebase/config';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

export async function saveUserProfile(uid, profile) {
  try {
    await setDoc(doc(db, 'users', uid), profile);
    return { success: true };
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw new Error('Failed to save user profile');
  }
}

export async function getUserProfile(uid) {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error('Failed to fetch user profile');
  }
}

export async function updateUserProfile(uid, updates) {
  try {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, updates);
    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update user profile');
  }
}
