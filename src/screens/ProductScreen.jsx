import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import CartContext from '../context/CartContext';
import WishlistContext from '../context/WishlistContext';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const ProductScreen = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [qty, setQty] = useState(1);

    const { addToCart } = useContext(CartContext);
    const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`/api/products/${id}`);
                setProduct(data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const addToCartHandler = () => {
        addToCart(product, Number(qty));
        navigate('/cart');
    };

    if (loading) return <Loader />;
    if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
    if (!product) return <div className="text-center mt-10">Product not found</div>;

    return (
        <div className="md:flex md:space-x-8">
            {/* Product Image */}
            <div className="md:w-1/2">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-auto rounded-lg shadow-lg"
                />
            </div>

            {/* Product Details */}
            <div className="md:w-1/2 mt-8 md:mt-0">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

                <div className="flex items-center mb-4">
                    <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                </div>

                <p className="text-2xl font-bold text-gray-900 mb-4">${product.price}</p>

                <p className="text-gray-700 mb-6 leading-relaxed">
                    {product.description}
                </p>

                {/* Add to Cart Card */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-semibold text-lg">${product.price}</span>
                    </div>

                    <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
                        <span className="text-gray-600">Status:</span>
                        <span className={`font-semibold ${product.countInStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                    </div>

                    {product.countInStock > 0 && (
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-gray-600">Qty:</span>
                            <select
                                value={qty}
                                onChange={(e) => setQty(e.target.value)}
                                className="border border-gray-300 rounded px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                {[...Array(product.countInStock).keys()].map((x) => (
                                    <option key={x + 1} value={x + 1}>
                                        {x + 1}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <button
                        onClick={addToCartHandler}
                        disabled={product.countInStock === 0}
                        className={`w-full py-3 rounded-md font-semibold text-white transition-colors ${product.countInStock > 0
                            ? 'bg-green-600 hover:bg-green-700 shadow-md'
                            : 'bg-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>

                    <button
                        onClick={() => isInWishlist(product._id) ? removeFromWishlist(product._id) : addToWishlist(product._id)}
                        className="w-full py-3 mt-3 rounded-md font-semibold text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center"
                    >
                        {isInWishlist(product._id) ? (
                            <>
                                <FaHeart className="text-red-500 mr-2" /> Remove from Wishlist
                            </>
                        ) : (
                            <>
                                <FaRegHeart className="mr-2" /> Add to Wishlist
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductScreen;
