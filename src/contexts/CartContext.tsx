"use client";

import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface CartItem {
    id: string;
    title: string;
    price: number;
    image: string;
    quantity: number;
    supplierId?: string;
}

interface CartState {
    items: CartItem[];
    total: number;
    itemCount: number;
}

type CartAction =
    | { type: 'ADD_ITEM'; payload: CartItem }
    | { type: 'REMOVE_ITEM'; payload: string }
    | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
    | { type: 'CLEAR_CART' }
    | { type: 'LOAD_CART'; payload: CartItem[] };

const initialState: CartState = {
    items: [],
    total: 0,
    itemCount: 0,
};

function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case 'ADD_ITEM': {
            const existingItem = state.items.find(item => item.id === action.payload.id);

            if (existingItem) {
                const updatedItems = state.items.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: item.quantity + action.payload.quantity }
                        : item
                );

                return {
                    ...state,
                    items: updatedItems,
                    total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                    itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
                };
            } else {
                const newItems = [...state.items, action.payload];
                return {
                    ...state,
                    items: newItems,
                    total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                    itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
                };
            }
        }

        case 'REMOVE_ITEM': {
            const updatedItems = state.items.filter(item => item.id !== action.payload);
            return {
                ...state,
                items: updatedItems,
                total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
            };
        }

        case 'UPDATE_QUANTITY': {
            const updatedItems = state.items.map(item =>
                item.id === action.payload.id
                    ? { ...item, quantity: action.payload.quantity }
                    : item
            );

            return {
                ...state,
                items: updatedItems,
                total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
            };
        }

        case 'CLEAR_CART':
            return initialState;

        case 'LOAD_CART': {
            const items = action.payload;
            return {
                items,
                total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
            };
        }

        default:
            return state;
    }
}

interface CartContextType {
    state: CartState;
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    isInCart: (id: string) => boolean;
    getItemQuantity: (id: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('midostore-cart');
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                dispatch({ type: 'LOAD_CART', payload: parsedCart });
            } catch (error) {
                console.error('Failed to parse saved cart:', error);
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('midostore-cart', JSON.stringify(state.items));
    }, [state.items]);

    const addItem = (item: Omit<CartItem, 'quantity'>) => {
        dispatch({ type: 'ADD_ITEM', payload: { ...item, quantity: 1 } });
    };

    const removeItem = (id: string) => {
        dispatch({ type: 'REMOVE_ITEM', payload: id });
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(id);
        } else {
            dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
        }
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    const isInCart = (id: string) => {
        return state.items.some(item => item.id === id);
    };

    const getItemQuantity = (id: string) => {
        const item = state.items.find(item => item.id === id);
        return item ? item.quantity : 0;
    };

    const value: CartContextType = {
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isInCart,
        getItemQuantity,
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