import { storage } from '@/src/firebase/config';

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const uploadResume = async (resume) => {
  try {
    const storageRef = ref(storage, `resumes/${resume.name}`);
    await uploadBytes(storageRef, resume);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading resume:', error);
    throw error;
  }
};
