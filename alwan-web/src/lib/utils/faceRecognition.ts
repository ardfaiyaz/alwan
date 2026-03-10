import * as faceapi from 'face-api.js'

let modelsLoaded = false

/**
 * Load face-api.js models
 */
export async function loadFaceModels() {
  if (modelsLoaded) return

  try {
    const MODEL_URL = '/models'
    
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
    ])

    modelsLoaded = true
    console.log('Face recognition models loaded successfully')
  } catch (error) {
    console.error('Error loading face recognition models:', error)
    throw new Error('Failed to load face recognition models')
  }
}

/**
 * Detect face in image
 */
export async function detectFace(imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement) {
  try {
    const detection = await faceapi
      .detectSingleFace(imageElement, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor()

    return detection
  } catch (error) {
    console.error('Error detecting face:', error)
    return null
  }
}

/**
 * Compare two faces and return similarity score
 */
export async function compareFaces(
  image1: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement,
  image2: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement
): Promise<{ match: boolean; distance: number; similarity: number }> {
  try {
    // Ensure models are loaded
    if (!modelsLoaded) {
      await loadFaceModels()
    }

    // Detect faces in both images
    const detection1 = await detectFace(image1)
    const detection2 = await detectFace(image2)

    if (!detection1 || !detection2) {
      throw new Error('Could not detect face in one or both images')
    }

    // Calculate Euclidean distance between face descriptors
    const distance = faceapi.euclideanDistance(
      detection1.descriptor,
      detection2.descriptor
    )

    // Convert distance to similarity percentage (0-100)
    // Lower distance = higher similarity
    // Typical threshold is 0.6 (60% similarity)
    const similarity = Math.max(0, Math.min(100, (1 - distance) * 100))
    const match = distance < 0.6 // 60% threshold

    return {
      match,
      distance,
      similarity: Math.round(similarity * 100) / 100,
    }
  } catch (error) {
    console.error('Error comparing faces:', error)
    throw error
  }
}

/**
 * Validate image quality for face recognition
 */
export async function validateImageQuality(
  imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement
): Promise<{ valid: boolean; message?: string }> {
  try {
    const detection = await detectFace(imageElement)

    if (!detection) {
      return {
        valid: false,
        message: 'No face detected. Please ensure your face is clearly visible.',
      }
    }

    // Check detection confidence
    if (detection.detection.score < 0.5) {
      return {
        valid: false,
        message: 'Face detection confidence is too low. Please use a clearer image.',
      }
    }

    return { valid: true }
  } catch (error) {
    console.error('Error validating image quality:', error)
    return {
      valid: false,
      message: 'Error validating image. Please try again.',
    }
  }
}

/**
 * Create image element from file
 */
export function createImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }

    img.src = url
  })
}

/**
 * Capture image from video stream
 */
export function captureImageFromVideo(video: HTMLVideoElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Failed to get canvas context')
  }

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
  return canvas
}

/**
 * Convert canvas to blob
 */
export function canvasToBlob(canvas: HTMLCanvasElement, type = 'image/jpeg', quality = 0.95): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Failed to convert canvas to blob'))
        }
      },
      type,
      quality
    )
  })
}
