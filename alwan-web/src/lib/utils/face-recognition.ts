import * as faceapi from 'face-api.js'

let modelsLoaded = false

/**
 * Load face-api.js models
 */
export async function loadFaceModels() {
  if (modelsLoaded) return

  const MODEL_URL = '/models' // We'll need to add models to public folder

  try {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
    ])
    modelsLoaded = true
    console.log('Face recognition models loaded')
  } catch (error) {
    console.error('Error loading face models:', error)
    throw error
  }
}

/**
 * Detect face in image
 */
export async function detectFace(imageElement: HTMLImageElement | HTMLVideoElement) {
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
  image1: HTMLImageElement,
  image2: HTMLImageElement
): Promise<{ match: boolean; distance: number; score: number }> {
  try {
    await loadFaceModels()

    const detection1 = await detectFace(image1)
    const detection2 = await detectFace(image2)

    if (!detection1 || !detection2) {
      throw new Error('Could not detect faces in one or both images')
    }

    // Calculate Euclidean distance between face descriptors
    const distance = faceapi.euclideanDistance(
      detection1.descriptor,
      detection2.descriptor
    )

    // Convert distance to similarity score (0-100)
    // Lower distance = higher similarity
    // Typical threshold is 0.6 for a match
    const score = Math.max(0, Math.min(100, (1 - distance) * 100))
    const match = distance < 0.6

    return { match, distance, score }
  } catch (error) {
    console.error('Error comparing faces:', error)
    throw error
  }
}

/**
 * Validate image has a clear face
 */
export async function validateFaceImage(imageElement: HTMLImageElement): Promise<{
  valid: boolean
  message: string
}> {
  try {
    await loadFaceModels()

    const detections = await faceapi
      .detectAllFaces(imageElement, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()

    if (detections.length === 0) {
      return { valid: false, message: 'No face detected in image' }
    }

    if (detections.length > 1) {
      return { valid: false, message: 'Multiple faces detected. Please ensure only one face is visible' }
    }

    const detection = detections[0]
    
    // Check detection confidence
    if (detection.detection.score < 0.5) {
      return { valid: false, message: 'Face detection confidence too low. Please use a clearer image' }
    }

    return { valid: true, message: 'Face detected successfully' }
  } catch (error) {
    console.error('Error validating face:', error)
    return { valid: false, message: 'Error validating image' }
  }
}

/**
 * Load image from File object
 */
export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
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
