import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/src/firebase/config';

export const uploadImage = async (file) => {
  if (!file) return null;

  const fileName = `products/${Date.now()}_${file.name}`;
  const imageRef = ref(storage, fileName);

  try {
    const snapshot = await uploadBytes(imageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const uploadMultipleImages = async (files) => {
  const urls = [];
  for (const file of files) {
    const url = await uploadImage(file);
    urls.push(url);
  }
  return urls;
};
