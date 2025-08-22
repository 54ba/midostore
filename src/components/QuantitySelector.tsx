'use client'

import React, { useId } from 'react'

interface QuantitySelectorProps {
  id?: string
  quantity: number
  onQuantityChange: (quantity: number) => void
  min?: number
  max?: number
}

export default function QuantitySelector({
  id,
  quantity,
  onQuantityChange,
  min = 1,
  max = 999
}: QuantitySelectorProps) {
  const defaultId = useId()
  const componentId = id || defaultId

  const handleDecrease = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1)
    }
  }

  const handleIncrease = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || min
    if (value >= min && value <= max) {
      onQuantityChange(value)
    }
  }

  return (
    <div className="flex items-center space-x-2" id={componentId}>
      <button
        id="quantity-selector-decrease-button"
        type="button"
        onClick={handleDecrease}
        disabled={quantity <= min}
        className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-gray-700 disabled:hover:border-gray-300 dark:disabled:hover:border-gray-600 transition-all duration-200"
        aria-label="Decrease quantity"
      >
        <svg
          id="quantity-selector-decrease-icon"
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>

      <div className="relative">
        <input
          id="quantity-selector-input"
          type="number"
          value={quantity}
          onChange={handleInputChange}
          min={min}
          max={max}
          className="w-16 h-10 text-center border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
          aria-label="Quantity"
        />
      </div>

      <button
        id="quantity-selector-increase-button"
        type="button"
        onClick={handleIncrease}
        disabled={quantity >= max}
        className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-gray-700 disabled:hover:border-gray-300 dark:disabled:hover:border-gray-600 transition-all duration-200"
        aria-label="Increase quantity"
      >
        <svg
          id="quantity-selector-increase-icon"
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>

      <span id="quantity-selector-label" className="text-sm text-gray-500 ml-2">
        Qty
      </span>
    </div>
  )
}