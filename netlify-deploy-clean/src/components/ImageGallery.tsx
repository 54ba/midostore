'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'

interface ImageGalleryProps {
    images: string[]
    alt: string
    className?: string
    autoPlay?: boolean
    autoPlayInterval?: number
    showThumbnails?: boolean
    showNavigation?: boolean
    showCounter?: boolean
    height?: string
    onImageChange?: (index: number) => void
}

export default function ImageGallery({
    images,
    alt,
    className = '',
    autoPlay = false,
    autoPlayInterval = 3000,
    showThumbnails = true,
    showNavigation = true,
    showCounter = true,
    height = 'h-64',
    onImageChange
}: ImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(autoPlay)
    const [isHovered, setIsHovered] = useState(false)

    // Auto-play functionality
    useEffect(() => {
        if (!autoPlay || !isPlaying || isHovered) return

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length)
        }, autoPlayInterval)

        return () => clearInterval(interval)
    }, [autoPlay, isPlaying, isHovered, autoPlayInterval, images.length])

    const nextImage = () => {
        const newIndex = (currentIndex + 1) % images.length
        setCurrentIndex(newIndex)
        onImageChange?.(newIndex)
    }

    const prevImage = () => {
        const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1
        setCurrentIndex(newIndex)
        onImageChange?.(newIndex)
    }

    const goToImage = (index: number) => {
        setCurrentIndex(index)
        onImageChange?.(index)
    }

    const toggleAutoPlay = () => {
        setIsPlaying(!isPlaying)
    }

    if (!images || images.length === 0) {
        return (
            <div className={`${height} bg-gray-200 rounded-lg flex items-center justify-center ${className}`}>
                <span className="text-gray-500">No images available</span>
            </div>
        )
    }

    return (
        <div
            className={`relative overflow-hidden rounded-lg ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Main Image */}
            <div className={`relative ${height} w-full`}>
                <Image
                    src={images[currentIndex]}
                    alt={`${alt} ${currentIndex + 1}`}
                    fill
                    className="object-cover transition-all duration-500"
                    priority={currentIndex === 0}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                {/* Navigation Arrows */}
                {showNavigation && images.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 hover:opacity-100 transition-opacity duration-300">
                        <button
                            onClick={prevImage}
                            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200 hover:scale-110"
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="w-5 h-5 text-white" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200 hover:scale-110"
                            aria-label="Next image"
                        >
                            <ChevronRight className="w-5 h-5 text-white" />
                        </button>
                    </div>
                )}

                {/* Auto-play Controls */}
                {autoPlay && (
                    <div className="absolute top-2 right-2">
                        <button
                            onClick={toggleAutoPlay}
                            className="w-8 h-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/60 transition-colors"
                            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
                        >
                            {isPlaying ? (
                                <Pause className="w-4 h-4 text-white" />
                            ) : (
                                <Play className="w-4 h-4 text-white" />
                            )}
                        </button>
                    </div>
                )}

                {/* Image Counter */}
                {showCounter && images.length > 1 && (
                    <div className="absolute bottom-2 left-2">
                        <span className="px-2 py-1 bg-black/40 backdrop-blur-sm text-white text-xs rounded-full">
                            {currentIndex + 1} / {images.length}
                        </span>
                    </div>
                )}

                {/* Progress Bar for Auto-play */}
                {autoPlay && isPlaying && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                        <div
                            className="h-full bg-white transition-all duration-100 ease-linear"
                            style={{
                                width: `${((currentIndex + 1) / images.length) * 100}%`
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Thumbnails */}
            {showThumbnails && images.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => goToImage(index)}
                            className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200 ${index === currentIndex
                                    ? 'ring-2 ring-blue-500 scale-110'
                                    : 'hover:scale-105 hover:ring-2 hover:ring-gray-300'
                                }`}
                            aria-label={`Go to image ${index + 1}`}
                        >
                            <Image
                                src={image}
                                alt={`${alt} thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                            {index === currentIndex && (
                                <div className="absolute inset-0 bg-blue-500/20" />
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* Keyboard Navigation */}
            <div
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'ArrowLeft') prevImage()
                    if (e.key === 'ArrowRight') nextImage()
                    if (e.key === ' ') {
                        e.preventDefault()
                        if (autoPlay) toggleAutoPlay()
                    }
                }}
                className="outline-none"
                aria-label="Image gallery navigation"
            />
        </div>
    )
}