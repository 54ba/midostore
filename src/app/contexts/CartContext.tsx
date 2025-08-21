"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface CartItem {
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  image_url?: string;
  category?: string;
  currency?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  getCartItem: (productId: string) => CartItem | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('midohub_cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
        }
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
      // Ensure we always have a valid array
      setCartItems([]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('midohub_cart', JSON.stringify(cartItems));
      } catch (error) {
        console.error('Failed to save cart to localStorage:', error);
      }
    }
  }, [cartItems, isLoaded]);

  // Ensure cartItems is always an array (safety check)
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  // Calculate cart metrics
  const cartCount = safeCartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = safeCartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const addToCart = (product: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    setCartItems(prevItems => {
      const currentItems = Array.isArray(prevItems) ? prevItems : [];
      const existingItemIndex = currentItems.findIndex(item => item.product_id === product.product_id);

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
        return updatedItems;
      } else {
        // Add new item to cart
        return [...currentItems, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => {
      const currentItems = Array.isArray(prevItems) ? prevItems : [];
      return currentItems.filter(item => item.product_id !== productId);
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems => {
      const currentItems = Array.isArray(prevItems) ? prevItems : [];
      return currentItems.map(item =>
        item.product_id === productId
          ? { ...item, quantity }
          : item
      );
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const isInCart = (productId: string) => {
    return safeCartItems.some(item => item.product_id === productId);
  };

  const getCartItem = (productId: string) => {
    return safeCartItems.find(item => item.product_id === productId);
  };

  const value: CartContextType = {
    cartItems: safeCartItems,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getCartItem,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}