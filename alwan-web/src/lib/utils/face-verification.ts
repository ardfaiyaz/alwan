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
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL), // More accurate detector
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
    // Enable CORS for cross-origin images
    img.crossOrigin = 'anonymous'
  })
}

/**
 * Resize image if too large for better processing
 */
function resizeImage(img: HTMLImageElement, maxSize: number = 1024): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  let width = img.width
  let height = img.height

  // Only resize if image is larger than maxSize
  if (width > maxSize || height > maxSize) {
    if (width > height) {
      height = (height / width) * maxSize
      width = maxSize
    } else {
      width = (width / height) * maxSize
      height = maxSize
    }
  }

  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.drawImage(img, 0, 0, width, height)
  }

  return canvas
}

/**
 * Detect face and extract descriptor from image with multiple detection strategies
 */
async function detectFaceDescriptor(image: HTMLImageElement) {
  // Try multiple detection strategies for better accuracy
  
  // Strategy 1: SSD MobileNet (more accurate, slower)
  let detection = await faceapi
    .detectSingleFace(image, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
    .withFaceLandmarks()
    .withFaceDescriptor()

  // Strategy 2: If SSD fails, try with resized image
  if (!detection) {
    console.log('SSD detection failed, trying with resized image...')
    const resizedCanvas = resizeImage(image, 800)
    detection = await faceapi
      .detectSingleFace(resizedCanvas, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.4 }))
      .withFaceLandmarks()
      .withFaceDescriptor()
  }

  // Strategy 3: If still failing, try TinyFaceDetector with lower threshold
  if (!detection) {
    console.log('Trying TinyFaceDetector with lower threshold...')
    detection = await faceapi
      .detectSingleFace(image, new faceapi.TinyFaceDetectorOptions({ 
        inputSize: 512, // Larger input size for better accuracy
        scoreThreshold: 0.3 // Lower threshold
      }))
      .withFaceLandmarks()
      .withFaceDescriptor()
  }

  // Strategy 4: Try with even more aggressive resizing
  if (!detection) {
    console.log('Trying with aggressive resizing...')
    const smallCanvas = resizeImage(image, 512)
    detection = await faceapi
      .detectSingleFace(smallCanvas, new faceapi.TinyFaceDetectorOptions({ 
        inputSize: 416,
        scoreThreshold: 0.25
      }))
      .withFaceLandmarks()
      .withFaceDescriptor()
  }

  if (!detection) {
    throw new Error('No face detected in image. Please ensure your face is clearly visible and well-lit.')
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
 * Validate image quality for face detection with multiple strategies
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
    // Try multiple detection strategies
    let detection = await faceapi
      .detectSingleFace(image, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
      .withFaceLandmarks()

    // Fallback to TinyFaceDetector if SSD fails
    if (!detection) {
      detection = await faceapi
        .detectSingleFace(image, new faceapi.TinyFaceDetectorOptions({ 
          inputSize: 512,
          scoreThreshold: 0.3 
        }))
        .withFaceLandmarks()
    }

    if (!detection) {
      issues.push('No face detected in image. Please ensure your face is clearly visible and well-lit.')
    } else {
      // Check face size relative to image
      const faceBox = detection.detection.box
      const faceArea = faceBox.width * faceBox.height
      const imageArea = image.width * image.height
      const faceRatio = faceArea / imageArea

      if (faceRatio < 0.03) {
        issues.push('Face too small in image (face should be at least 3% of image)')
      }

      // Check detection confidence
      if (detection.detection.score < 0.4) {
        issues.push('Face detection confidence low. Please use a clearer, well-lit photo.')
      }
    }
  } catch (error) {
    console.error('Image validation error:', error)
    issues.push('Failed to analyze image quality')
  }

  return {
    valid: issues.length === 0,
    issues,
  }
}
