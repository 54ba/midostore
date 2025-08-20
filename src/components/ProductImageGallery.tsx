'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useId } from 'react'

interface ProductImageGalleryProps {
  id?: string
  images: string[]
  productName: string
}

export default function ProductImageGallery({ 
  id: propId, 
  images = [], 
  productName = '' 
}: ProductImageGalleryProps) {
  const defaultId = useId()
  const id = propId || defaultId
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Handle empty or invalid images array
  const validImages = Array.isArray(images) && images.length > 0 ? images : []
  const hasImages = validImages.length > 0

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index)
    setIsLoading(true)
  }

  const handlePrevious = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? validImages.length - 1 : prev - 1
    )
    setIsLoading(true)
  }

  const handleNext = () => {
    setSelectedImageIndex((prev) => 
      prev === validImages.length - 1 ? 0 : prev + 1
    )
    setIsLoading(true)
  }

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  if (!hasImages) {
    return (
      <div id="product-image-gallery-container" className="w-full max-w-2xl mx-auto">
        <div id="product-image-gallery-placeholder" className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
          <div id="product-image-gallery-placeholder-content" className="text-center">
            <div id="product-image-gallery-placeholder-icon" className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
              <svg id="product-image-gallery-placeholder-svg" className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p id="product-image-gallery-placeholder-text" className="text-gray-500 text-sm font-medium">
              {productName || 'Product Image'}
            </p>
            <p id="product-image-gallery-placeholder-subtext" className="text-gray-400 text-xs mt-1">
              No images available
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div id="product-image-gallery-container" className="w-full max-w-2xl mx-auto">
      {/* Main Image Display */}
      <div id="product-image-gallery-main" className="relative aspect-square mb-4 bg-white rounded-lg overflow-hidden shadow-sm border">
        {/* Loading Overlay */}
        {isLoading && (
          <div id="product-image-gallery-loading" className="absolute inset-0 bg-gray-50 flex items-center justify-center z-10">
            <div id="product-image-gallery-spinner" className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        <Image
          id="product-image-gallery-main-image"
          src={validImages[selectedImageIndex]}
          alt={`${productName} - Image ${selectedImageIndex + 1}`}
          fill
          className="object-cover transition-opacity duration-300"
          onLoad={handleImageLoad}
          priority={selectedImageIndex === 0}
        />

        {/* Navigation Arrows */}
        {validImages.length > 1 && (
          <>
            <button
              id="product-image-gallery-prev-btn"
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center transition-all duration-200 hover:scale-105"
              aria-label="Previous image"
            >
              <svg id="product-image-gallery-prev-icon" className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              id="product-image-gallery-next-btn"
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center transition-all duration-200 hover:scale-105"
              aria-label="Next image"
            >
              <svg id="product-image-gallery-next-icon" className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Image Counter */}
        {validImages.length > 1 && (
          <div id="product-image-gallery-counter" className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
            <span id="product-image-gallery-counter-text">
              {selectedImageIndex + 1} / {validImages.length}
            </span>
          </div>
        )}
      </div>

      {/* Thumbnail Grid */}
      {validImages.length > 1 && (
        <div id="product-image-gallery-thumbnails" className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {validImages.map((image, index) => (
            <button
              key={index}
              id={`product-image-gallery-thumb-${index}`}
              onClick={() => handleThumbnailClick(index)}
              className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                index === selectedImageIndex
                  ? 'border-teal-600 ring-2 ring-teal-600/20'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              aria-label={`View image ${index + 1} of ${productName}`}
            >
              <Image
                id={`product-image-gallery-thumb-img-${index}`}
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 25vw, (max-width: 768px) 16vw, 12vw"
              />
              
              {/* Selected Overlay */}
              {index === selectedImageIndex && (
                <div id={`product-image-gallery-thumb-overlay-${index}`} className="absolute inset-0 bg-teal-600/20 flex items-center justify-center">
                  <div id={`product-image-gallery-thumb-check-${index}`} className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
                    <svg id={`product-image-gallery-thumb-check-icon-${index}`} className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Product Name */}
      {productName && (
        <div id="product-image-gallery-product-info" className="mt-4 text-center">
          <h3 id="product-image-gallery-product-name" className="text-lg font-semibold text-gray-900">
            {productName}
          </h3>
        </div>
      )}
    </div>
  )
}