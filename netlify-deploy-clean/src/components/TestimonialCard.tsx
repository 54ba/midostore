'use client'

import { useId } from 'react'
import Image from 'next/image'

interface TestimonialCardProps {
  id?: string
  testimonial: {
    name: string
    avatar: string
    rating: number
    comment: string
  }
}

export default function TestimonialCard({ id, testimonial }: TestimonialCardProps) {
  const defaultId = useId()
  const componentId = id || defaultId

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        id={`testimonial-card-star-${index}`}
        className={`w-4 h-4 ${index < rating ? 'text-amber-400' : 'text-gray-300'
          }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
  }

  return (
    <div
      id={componentId}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300"
    >
      {/* Header with avatar and name */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative">
          <Image
            id="testimonial-card-avatar"
            src={testimonial.avatar}
            alt={`${testimonial.name} avatar`}
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
            width={48}
            height={48}
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
        </div>
        <div>
          <h3 id="testimonial-card-name" className="font-semibold text-gray-900 text-base">
            {testimonial.name}
          </h3>
          <div className="flex items-center space-x-1 mt-1">
            {renderStars(testimonial.rating)}
            <span id="testimonial-card-rating" className="text-sm text-gray-600 ml-2">
              {testimonial.rating}/5
            </span>
          </div>
        </div>
      </div>

      {/* Comment */}
      <div className="relative">
        <svg
          id="testimonial-card-quote-icon"
          className="absolute -top-2 -left-1 w-6 h-6 text-teal-600 opacity-20"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
        </svg>
        <p id="testimonial-card-comment" className="text-gray-700 text-sm leading-relaxed pl-4">
          {testimonial.comment}
        </p>
      </div>

      {/* Decorative bottom accent */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
            <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
          </div>
          <span id="testimonial-card-verified" className="text-xs text-gray-500 font-medium">
            Verified Customer
          </span>
        </div>
      </div>
    </div>
  )
}