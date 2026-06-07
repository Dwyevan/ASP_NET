import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const savedCart = localStorage.getItem('wine_cart');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch {
            return [];
        }
    });

    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        localStorage.setItem('wine_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToast = useCallback((title, message, type = 'success') => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, title, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3500);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const addToCart = useCallback((product, quantity = 1) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { ...product, quantity }];
        });
        addToast('Thêm vào giỏ hàng', `${product.name} x${quantity} đã được thêm!`, 'success');
    }, [addToast]);

    const updateQuantity = useCallback((id, quantity) => {
        if (quantity < 1) return;
        setCartItems(prev =>
            prev.map(item => item.id === id ? { ...item, quantity } : item)
        );
    }, []);

    const removeFromCart = useCallback((id) => {
        setCartItems(prev => {
            const item = prev.find(i => i.id === id);
            if (item) {
                addToast('Đã xóa', `${item.name} đã được xóa khỏi giỏ hàng.`, 'info');
            }
            return prev.filter(item => item.id !== id);
        });
    }, [addToast]);

    const clearCart = useCallback(() => {
        setCartItems([]);
    }, []);

    const getCartTotal = useCallback(() => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    }, [cartItems]);

    const getCartCount = useCallback(() => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    }, [cartItems]);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart,
            getCartTotal,
            getCartCount,
            toasts,
            addToast,
            removeToast
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
