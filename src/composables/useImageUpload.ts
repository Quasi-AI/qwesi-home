export const useImageUpload = () => {
  const { $firebase } = useNuxtApp();
  const uploading = ref(false);
  const uploadProgress = ref(0);

  const uploadImage = async (
    file: File,
    path: string = "profile-images"
  ): Promise<string> => {
    if (!file) {
      throw new Error("No file provided");
    }

    uploading.value = true;
    uploadProgress.value = 0;

    try {
      // Create a unique filename
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const fullPath = `${path}/${fileName}`;

      // Create storage reference
      const storageReference = $firebase.storageRef(
        $firebase.storage,
        fullPath
      );

      // Upload file
      const snapshot = await $firebase.uploadBytes(storageReference, file);

      // Get download URL
      const downloadURL = await $firebase.getDownloadURL(snapshot.ref);

      uploadProgress.value = 100;

      // Only return the filename for security
      console.log("Upload successful:", fileName);

      return downloadURL;
    } catch (error) {
      console.error("Image upload error:", error);
      throw new Error("Failed to upload image");
    } finally {
      uploading.value = false;
      uploadProgress.value = 0;
    }
  };

  const validateImage = (file: File): boolean => {
    // Check file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return false;
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return false;
    }

    return true;
  };

  const compressImage = async (
    file: File,
    maxWidth: number = 800,
    quality: number = 0.8
  ): Promise<File> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw and compress image
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error("Failed to compress image"));
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(file);
    });
  };

  return {
    uploadImage,
    validateImage,
    compressImage,
    uploading: readonly(uploading),
    uploadProgress: readonly(uploadProgress),
  };
};
