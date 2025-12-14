import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('sweetShopCart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('sweetShopCart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (sweet, quantity = 1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === sweet.id);

            if (existingItem) {
                return prevItems.map(item =>
                    item.id === sweet.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            return [...prevItems, { ...sweet, quantity }];
        });
    };

    const removeFromCart = (sweetId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== sweetId));
    };

    const updateQuantity = (sweetId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(sweetId);
            return;
        }

        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === sweetId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('sweetShopCart');
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
