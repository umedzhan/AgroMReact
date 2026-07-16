import { createContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

// Read once, synchronously, on first render so there's no window where
// cartItems is briefly [] and the "save" effect below clobbers a real
// saved cart with an empty one (this happened on every full page load,
// e.g. visiting /cart directly or refreshing).
const readFromStorage = (key, fallback) => {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : fallback;
    } catch {
        return fallback;
    }
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => readFromStorage('cartItems', []));
    const [shippingAddress, setShippingAddress] = useState(() => readFromStorage('shippingAddress', {}));
    const [paymentMethod, setPaymentMethod] = useState(() => readFromStorage('paymentMethod', 'PayPal'));

    // Update local storage whenever cart changes
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, qty) => {
        const existItem = cartItems.find((x) => x._id === product._id);

        if (existItem) {
            setCartItems(
                cartItems.map((x) =>
                    x._id === existItem._id ? { ...product, qty: existItem.qty + qty } : x
                )
            );
        } else {
            setCartItems([...cartItems, { ...product, qty }]);
        }
        toast.success('Added to cart');
    };

    const removeFromCart = (id) => {
        setCartItems(cartItems.filter((x) => x._id !== id));
        toast.success('Removed from cart');
    };

    const saveShippingAddress = (data) => {
        setShippingAddress(data);
        localStorage.setItem('shippingAddress', JSON.stringify(data));
    };

    const savePaymentMethod = (data) => {
        setPaymentMethod(data);
        localStorage.setItem('paymentMethod', JSON.stringify(data));
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cartItems');
    }

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            clearCart,
            shippingAddress,
            saveShippingAddress,
            paymentMethod,
            savePaymentMethod
        }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;
