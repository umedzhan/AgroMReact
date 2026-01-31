import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';
import { toast } from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchWishlist();
        } else {
            setWishlist([]);
        }
    }, [user]);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get('/api/wishlist', config);
            setWishlist(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const addToWishlist = async (productId) => {
        if (!user) {
            toast.error('Please login to add to wishlist');
            return;
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post('/api/wishlist', { productId }, config);
            setWishlist(data);
            toast.success('Added to wishlist');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error adding to wishlist');
        }
    };

    const removeFromWishlist = async (id) => {
        if (!user) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.delete(`/api/wishlist/${id}`, config);
            setWishlist(data);
            toast.success('Removed from wishlist');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error removing from wishlist');
        }
    };

    const isInWishlist = (productId) => {
        return wishlist.some((item) => item._id === productId);
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlist,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
                loading,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

export default WishlistContext;
