import * as faceapi from 'face-api.js'

let modelsLoaded = false

/**
 * Load face-api.js models from CDN
 * Models are loaded once and cached
 */
export async function loadFaceModels(): Promise<void> {
  if (modelsLoaded) return

  try {
    const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model'
    
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    ])

    modelsLoaded = true
    console.log('Face recognition models loaded successfully')
  } catch (error) {
    console.error('Error loading face recognition models:', error)
    throw new Error('Failed to load face recognition models')
  }
}

/**
 * Create an image element from a File
 */
export async function createImageFromFile(file: File): Promise<HTMLImageElement> {
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
 * Detect face and extract descriptor from image
 */
async function detectFaceDescriptor(image: HTMLImageElement) {
  const detection = await faceapi
    .detectSingleFace(image, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptor()

  if (!detection) {
    throw new Error('No face detected in image')
  }

  return detection.descriptor
}

/**
 * Calculate Euclidean distance between two face descriptors
 * Lower distance = more similar faces
 */
function calculateDistance(descriptor1: Float32Array, descriptor2: Float32Array): number {
  return faceapi.euclideanDistance(descriptor1, descriptor2)
}

/**
 * Convert distance to similarity percentage
 * Distance typically ranges from 0 (identical) to 1+ (very different)
 */
function distanceToSimilarity(distance: number): number {
  // Threshold of 0.6 is commonly used for face matching
  // Convert to percentage where lower distance = higher similarity
  const similarity = Math.max(0, Math.min(100, (1 - distance) * 100))
  return Math.round(similarity)
}

/**
 * Compare two faces and return match result
 */
export async function compareFaces(
  idImage: HTMLImageElement,
  selfieImage: HTMLImageElement
): Promise<{ match: boolean; similarity: number; distance: number }> {
  try {
    // Ensure models are loaded
    if (!modelsLoaded) {
      await loadFaceModels()
    }

    // Detect faces and extract descriptors
    const idDescriptor = await detectFaceDescriptor(idImage)
    const selfieDescriptor = await detectFaceDescriptor(selfieImage)

    // Calculate distance between faces
    const distance = calculateDistance(idDescriptor, selfieDescriptor)
    
    // Convert to similarity percentage
    const similarity = distanceToSimilarity(distance)

    // Match threshold: distance < 0.6 (or similarity > 40%)
    const match = distance < 0.6

    return {
      match,
      similarity,
      distance,
    }
  } catch (error) {
    console.error('Face comparison error:', error)
    throw error
  }
}

/**
 * Capture image from video element
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
export async function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob)
      } else {
        reject(new Error('Failed to convert canvas to blob'))
      }
    }, 'image/jpeg', 0.95)
  })
}

/**
 * Validate image quality for face detection
 */
export async function validateImageQuality(image: HTMLImageElement): Promise<{
  valid: boolean
  issues: string[]
}> {
  const issues: string[] = []

  // Check image dimensions
  if (image.width < 200 || image.height < 200) {
    issues.push('Image resolution too low (minimum 200x200)')
  }

  try {
    // Try to detect face
    const detection = await faceapi
      .detectSingleFace(image, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()

    if (!detection) {
      issues.push('No face detected in image')
    } else {
      // Check face size relative to image
      const faceBox = detection.detection.box
      const faceArea = faceBox.width * faceBox.height
      const imageArea = image.width * image.height
      const faceRatio = faceArea / imageArea

      if (faceRatio < 0.05) {
        issues.push('Face too small in image (face should be at least 5% of image)')
      }

      // Check if face is too close to edges
      const margin = 20
      if (
        faceBox.x < margin ||
        faceBox.y < margin ||
        faceBox.x + faceBox.width > image.width - margin ||
        faceBox.y + faceBox.height > image.height - margin
      ) {
        issues.push('Face too close to image edges')
      }
    }
  } catch (error) {
    issues.push('Failed to analyze image quality')
  }

  return {
    valid: issues.length === 0,
    issues,
  }
}
