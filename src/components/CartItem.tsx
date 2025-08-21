'use client';

import React, { useId } from 'react';
import { Minus, Plus, Trash2, Package } from 'lucide-react';
import Image from 'next/image';
import { CartItem as CartItemType } from '@/app/contexts/CartContext';

interface CartItemProps {
  id?: string;
  item: CartItemType;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
  updating?: boolean;
}

export default function CartItem({
  id,
  item,
  onUpdateQuantity,
  onRemove,
  updating = false
}: CartItemProps) {
  const defaultId = useId();
  const componentId = id || defaultId;

  const handleQuantityDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.quantity - 1);
    }
  };

  const handleQuantityIncrease = () => {
    onUpdateQuantity(item.quantity + 1);
  };

  const totalPrice = item.price * item.quantity;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:shadow-md">
      <div className="flex items-start gap-4">
        {/* Product Image */}
        <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
          {item.image_url ? (
            <Image
              src={item.image_url}
              alt={item.product_name}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-gray-900 mb-1 line-clamp-2">
            {item.product_name}
          </h3>

          {item.category && (
            <p className="text-sm text-gray-500 mb-2">
              Category: {item.category}
            </p>
          )}

          <div className="flex items-center justify-between">
            {/* Price */}
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-gray-900">
                ${item.price.toFixed(2)} each
              </span>
              <span className="text-sm text-gray-500">
                Total: ${totalPrice.toFixed(2)}
              </span>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={handleQuantityDecrease}
                  disabled={item.quantity <= 1 || updating}
                  className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <span className="px-3 py-2 min-w-[3rem] text-center font-medium">
                  {item.quantity}
                </span>

                <button
                  onClick={handleQuantityIncrease}
                  disabled={updating}
                  className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Remove Button */}
              <button
                onClick={onRemove}
                disabled={updating}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {updating && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
}