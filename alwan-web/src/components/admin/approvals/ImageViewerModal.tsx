'use client'

import { X } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

interface ImageViewerModalProps {
  isOpen: boolean
  onClose: () => void
  images: {
    idFrontUrl?: string
    idBackUrl?: string
    selfieUrl?: string
  }
  applicantName: string
}

export function ImageViewerModal({ isOpen, onClose, images, applicantName }: ImageViewerModalProps) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  if (!isOpen) return null

  const handleImageError = (imageType: string) => {
    setImageErrors(prev => ({ ...prev, [imageType]: true }))
    console.error(`Failed to load ${imageType}:`, images[imageType as keyof typeof images])
  }

  const hasAnyImage = images.idFrontUrl || images.idBackUrl || images.selfieUrl

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-lg overflow-hidden my-8">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Document Verification</h3>
            <p className="text-sm text-gray-600">{applicantName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h5 className="font-semibold text-blue-900 mb-3">Verification Checklist</h5>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <input type="checkbox" id="check-id-match" className="mt-1" />
                <label htmlFor="check-id-match" className="text-gray-700">
                  ID number matches the ID document shown in images
                </label>
              </div>
              <div className="flex items-start gap-2">
                <input type="checkbox" id="check-face-match" className="mt-1" />
                <label htmlFor="check-face-match" className="text-gray-700">
                  Face in selfie matches face in ID document
                </label>
              </div>
              <div className="flex items-start gap-2">
                <input type="checkbox" id="check-id-valid" className="mt-1" />
                <label htmlFor="check-id-valid" className="text-gray-700">
                  ID document appears valid and not expired
                </label>
              </div>
              <div className="flex items-start gap-2">
                <input type="checkbox" id="check-clear" className="mt-1" />
                <label htmlFor="check-clear" className="text-gray-700">
                  All images are clear and readable
                </label>
              </div>
              <div className="flex items-start gap-2">
                <input type="checkbox" id="check-name" className="mt-1" />
                <label htmlFor="check-name" className="text-gray-700">
                  Name on ID matches application name
                </label>
              </div>
            </div>
          </div>

          {hasAnyImage ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.idFrontUrl && (
                <div className="group relative">
                  <p className="text-gray-600 text-sm font-medium mb-2">ID Front</p>
                  <div className="relative overflow-hidden rounded-lg border-2 border-gray-200 hover:border-green-500 transition-colors duration-200 bg-gray-100 min-h-[200px]">
                    {!imageErrors.idFrontUrl ? (
                      <>
                        <Image
                          src={images.idFrontUrl}
                          alt="ID Front"
                          width={400}
                          height={300}
                          className="w-full h-auto object-cover"
                          unoptimized
                          onError={() => handleImageError('idFrontUrl')}
                        />
                        <a
                          href={images.idFrontUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                        >
                          <span className="text-white font-medium">View Full Size</span>
                        </a>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[200px] text-gray-500">
                        <p className="text-sm">Failed to load image</p>
                        <a 
                          href={images.idFrontUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline mt-2"
                        >
                          Try opening directly
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {images.idBackUrl && (
                <div className="group relative">
                  <p className="text-gray-600 text-sm font-medium mb-2">ID Back</p>
                  <div className="relative overflow-hidden rounded-lg border-2 border-gray-200 hover:border-green-500 transition-colors duration-200 bg-gray-100 min-h-[200px]">
                    {!imageErrors.idBackUrl ? (
                      <>
                        <Image
                          src={images.idBackUrl}
                          alt="ID Back"
                          width={400}
                          height={300}
                          className="w-full h-auto object-cover"
                          unoptimized
                          onError={() => handleImageError('idBackUrl')}
                        />
                        <a
                          href={images.idBackUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                        >
                          <span className="text-white font-medium">View Full Size</span>
                        </a>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[200px] text-gray-500">
                        <p className="text-sm">Failed to load image</p>
                        <a 
                          href={images.idBackUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline mt-2"
                        >
                          Try opening directly
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {images.selfieUrl && (
                <div className="group relative">
                  <p className="text-gray-600 text-sm font-medium mb-2">Selfie</p>
                  <div className="relative overflow-hidden rounded-lg border-2 border-gray-200 hover:border-green-500 transition-colors duration-200 bg-gray-100 min-h-[200px]">
                    {!imageErrors.selfieUrl ? (
                      <>
                        <Image
                          src={images.selfieUrl}
                          alt="Selfie"
                          width={400}
                          height={300}
                          className="w-full h-auto object-cover"
                          unoptimized
                          onError={() => handleImageError('selfieUrl')}
                        />
                        <a
                          href={images.selfieUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                        >
                          <span className="text-white font-medium">View Full Size</span>
                        </a>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[200px] text-gray-500">
                        <p className="text-sm">Failed to load image</p>
                        <a 
                          href={images.selfieUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline mt-2"
                        >
                          Try opening directly
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <p className="text-yellow-800 font-medium mb-2">No images available</p>
                <p className="text-yellow-700 text-sm">
                  This application was submitted without ID images. The applicant may need to complete the identity verification step.
                </p>
              </div>
            </div>
          )}

          {/* Debug info in development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 text-xs">
              <p className="font-semibold mb-2">Debug Info:</p>
              <div className="space-y-1 font-mono">
                <p>ID Front: {images.idFrontUrl || 'Not provided'}</p>
                <p>ID Back: {images.idBackUrl || 'Not provided'}</p>
                <p>Selfie: {images.selfieUrl || 'Not provided'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
