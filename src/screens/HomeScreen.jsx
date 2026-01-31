import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import Rating from '../components/Rating';
import Paginate from '../components/Paginate';
import Hero from '../components/Hero';
import InfoSection from '../components/InfoSection';
import { FaArrowRight, FaHeart, FaRegHeart } from 'react-icons/fa';
import WishlistContext from '../context/WishlistContext';

const HomeScreen = () => {
    const { keyword, pageNumber } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get(`/api/products?keyword=${keyword || ''}&pageNumber=${pageNumber || 1}`);
                setProducts(data.products);
                setPage(data.page);
                setPages(data.pages);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        fetchProducts();
    }, [keyword, pageNumber]);

    const toggleWishlist = (e, product) => {
        e.preventDefault();
        if (isInWishlist(product._id)) {
            removeFromWishlist(product._id);
        } else {
            addToWishlist(product._id);
        }
    };

    return (
        <div>
            <Hero />
            <InfoSection />

            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-end mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Popular Products</h2>
                    <Link to="/shop" className="text-brand font-medium hover:text-brand-dark flex items-center">
                        View All <FaArrowRight className="ml-2" />
                    </Link>
                </div>

                {loading ? <Loader /> : error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {products.map((product) => (
                                <div key={product._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col">
                                    <Link to={`/product/${product._id}`}>
                                        <div className="h-48 overflow-hidden bg-gray-100 flex items-center justify-center relative">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                                            />
                                            <button
                                                onClick={(e) => toggleWishlist(e, product)}
                                                className="absolute top-2 right-2 bg-white/80 p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors z-10"
                                            >
                                                {isInWishlist(product._id) ? (
                                                    <FaHeart className="text-red-500 w-5 h-5" />
                                                ) : (
                                                    <FaRegHeart className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </Link>
                                    <div className="p-5 flex-grow flex flex-col">
                                        <Link to={`/product/${product._id}`}>
                                            <h2 className="text-lg font-bold text-gray-800 hover:text-green-600 transition-colors truncate mb-2">{product.name}</h2>
                                        </Link>
                                        <div className="flex items-center mb-3">
                                            <Rating value={product.rating} text={`${product.numReviews} reviews`} color="#FBBF24" />
                                        </div>
                                        <div className="mt-auto flex items-center justify-between">
                                            <p className="text-2xl font-bold text-gray-900">${product.price}</p>
                                            <Link to={`/product/${product._id}`} className="text-green-600 hover:bg-green-50 p-2 rounded-full transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8">
                            <Paginate pages={pages} page={page} keyword={keyword ? keyword : ''} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default HomeScreen;
