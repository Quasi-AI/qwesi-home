import { ref, readonly } from 'vue'
import type { FirebaseError } from 'firebase/app'
import { 
  uploadBytesResumable, 
  getDownloadURL, 
  ref as storageRef,
  type UploadTask,
  type StorageReference 
} from 'firebase/storage'

export const useImageUpload = () => {
  console.log('🖼️  Initializing image upload composable...')
  
  const { $firebase } = useNuxtApp()
  
  console.log('Firebase from useNuxtApp():', $firebase)
  
  // Enhanced error handling for Firebase initialization
  if (!$firebase) {
    console.error('❌ $firebase is null or undefined')
    console.error('Available nuxt app keys:', Object.keys(useNuxtApp()))
    throw new Error('Firebase is not initialized. Make sure your Firebase plugin is properly configured and your environment variables are set.')
  }

  console.log('✅ Firebase is available:', !!$firebase)
  console.log('Firebase services:', {
    app: !!$firebase.app,
    auth: !!$firebase.auth,
    db: !!$firebase.db,
    storage: !!$firebase.storage
  })

  const { storage } = $firebase

  const uploading = ref(false)
  const uploadProgress = ref(0)
  const uploadTask = ref<UploadTask | null>(null)

  // Cancel ongoing upload
  const cancelUpload = () => {
    if (uploadTask.value) {
      uploadTask.value.cancel()
      resetUploadState()
    }
  }

  const resetUploadState = () => {
    uploading.value = false
    uploadProgress.value = 0
    uploadTask.value = null
  }

  const uploadImage = async (
    file: File,
    path: string = "profile-images"
  ): Promise<string> => {
    if (!file) {
      throw new Error("No file provided")
    }

    if (!validateImage(file)) {
      throw new Error("Invalid image file. Please upload a JPEG, PNG, or WebP image under 5MB")
    }

    uploading.value = true
    uploadProgress.value = 0

    try {
      // Create a unique filename with original extension
      const fileExtension = file.name.split('.').pop() || 'jpg'
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 8)
      const fileName = `${timestamp}_${randomString}.${fileExtension}`
      const fullPath = `${path}/${fileName}`

      // Create storage reference - use the imported storageRef function
      const fileRef: StorageReference = storageRef(storage, fullPath)

      // Use uploadBytesResumable for progress tracking
      uploadTask.value = uploadBytesResumable(fileRef, file)

      // Return a promise that resolves when upload completes
      return new Promise((resolve, reject) => {
        if (!uploadTask.value) {
          reject(new Error('Failed to initialize upload'))
          return
        }

        uploadTask.value.on(
          'state_changed',
          (snapshot) => {
            // Progress tracking
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            uploadProgress.value = Math.round(progress)
          },
          (error) => {
            // Handle upload errors
            console.error("Upload error:", error)
            reject(error)
          },
          async () => {
            // Upload completed successfully
            try {
              const downloadURL = await getDownloadURL(fileRef)
              console.log("Upload successful. File available at:", downloadURL)
              resolve(downloadURL)
            } catch (error) {
              reject(error)
            }
          }
        )
      })

    } catch (error: unknown) {
      console.error("Image upload error:", error)
      
      let errorMessage = "Failed to upload image"
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      } else if (error && typeof error === 'object' && 'code' in error) {
        const firebaseError = error as FirebaseError
        switch (firebaseError.code) {
          case 'storage/unauthorized':
            errorMessage = "You don't have permission to upload files"
            break
          case 'storage/canceled':
            errorMessage = "Upload was canceled"
            break
          case 'storage/unknown':
            errorMessage = "Unknown error occurred during upload"
            break
          case 'storage/invalid-format':
            errorMessage = "Invalid file format"
            break
          case 'storage/object-not-found':
            errorMessage = "File not found"
            break
          case 'storage/quota-exceeded':
            errorMessage = "Storage quota exceeded"
            break
          default:
            errorMessage = firebaseError.message || errorMessage
        }
      }
      
      throw new Error(errorMessage)
    } finally {
      resetUploadState()
    }
  }

  const validateImage = (file: File): boolean => {
    if (!file) return false

    // Check file type
    const allowedTypes = [
      'image/jpeg', 
      'image/jpg', 
      'image/png', 
      'image/webp',
      'image/gif'
    ]
    if (!allowedTypes.includes(file.type)) {
      return false
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return false
    }

    return true
  }

  const compressImage = async (
    file: File,
    options: {
      maxWidth?: number
      maxHeight?: number
      quality?: number
      type?: string
    } = {}
  ): Promise<File> => {
    const {
      maxWidth = 800,
      maxHeight = 800,
      quality = 0.8,
      type = file.type
    } = options

    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()
      let objectUrl: string | null = null

      if (!ctx) {
        reject(new Error("Canvas context not available"))
        return
      }

      img.onload = () => {
        try {
          // Calculate new dimensions while maintaining aspect ratio
          let { width, height } = img
          
          if (width > height && width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          } else if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }

          // Set canvas dimensions
          canvas.width = width
          canvas.height = height

          // Draw image with high quality scaling
          ctx.imageSmoothingQuality = 'high'
          ctx.drawImage(img, 0, 0, width, height)

          // Convert to blob
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Canvas to Blob conversion failed"))
                return
              }

              // Create new file with compressed image
              const compressedFile = new File([blob], file.name, {
                type: type || file.type,
                lastModified: Date.now(),
              })

              resolve(compressedFile)
            },
            type || file.type,
            quality
          )
        } catch (error) {
          reject(error)
        } finally {
          // Clean up object URL
          if (objectUrl) {
            URL.revokeObjectURL(objectUrl)
          }
        }
      }

      img.onerror = () => {
        reject(new Error("Failed to load image file"))
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl)
        }
      }

      // Create object URL for the image
      objectUrl = URL.createObjectURL(file)
      img.src = objectUrl
    })
  }

  return {
    uploadImage,
    validateImage,
    compressImage,
    cancelUpload,
    uploading: readonly(uploading),
    uploadProgress: readonly(uploadProgress),
  }
}