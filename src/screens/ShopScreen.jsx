import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import Loader from '../components/Loader';
import Rating from '../components/Rating';
import Paginate from '../components/Paginate';
import { FaFilter, FaHeart, FaRegHeart } from 'react-icons/fa';
import WishlistContext from '../context/WishlistContext';

const ShopScreen = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const categoryQuery = queryParams.get('category') || '';
    const keywordQuery = queryParams.get('keyword') || '';
    const pageNumberQuery = queryParams.get('pageNumber') || 1;

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                let url = `/api/products?pageNumber=${pageNumberQuery}`;
                if (keywordQuery) url += `&keyword=${keywordQuery}`;
                if (categoryQuery) url += `&category=${categoryQuery}`;

                const { data } = await axios.get(url);
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
    }, [categoryQuery, keywordQuery, pageNumberQuery]);

    const toggleWishlist = (e, product) => {
        e.preventDefault();
        if (isInWishlist(product._id)) {
            removeFromWishlist(product._id);
        } else {
            addToWishlist(product._id);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb or Header */}
            <div className="bg-green-50 p-8 rounded-lg mb-8 text-center bg-[url('/images/breadcrumb.jpg')] bg-cover bg-center relative">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop</h1>
                    <div className="flex justify-center space-x-2 text-sm text-gray-500">
                        <Link to="/" className="hover:text-brand">Home</Link>
                        <span>/</span>
                        <span className="text-brand font-medium">Shop</span>
                        {categoryQuery && (
                            <>
                                <span>/</span>
                                <span className="text-gray-900 capitalize">{categoryQuery}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Filters Sidebar (Mock for now, scalable later) */}
                <div className="w-full md:w-1/4">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex items-center space-x-2 mb-6 pb-4 border-b border-gray-100">
                            <FaFilter className="text-brand" />
                            <h3 className="font-bold text-gray-900 text-lg">Filter</h3>
                        </div>

                        <div className="mb-6">
                            <h4 className="font-semibold text-gray-900 mb-3">Categories</h4>
                            <ul className="space-y-2 text-gray-600 text-sm">
                                <li>
                                    <Link to="/shop" className={`hover:text-brand ${!categoryQuery ? 'text-brand font-bold' : ''}`}>All Categories</Link>
                                </li>
                                <li>
                                    <Link to="/shop?category=Vegetables" className={`hover:text-brand ${categoryQuery === 'Vegetables' ? 'text-brand font-bold' : ''}`}>Vegetables</Link>
                                </li>
                                <li>
                                    <Link to="/shop?category=Fruits" className={`hover:text-brand ${categoryQuery === 'Fruits' ? 'text-brand font-bold' : ''}`}>Fresh Fruits</Link>
                                </li>
                                <li>
                                    <Link to="/shop?category=Wheat" className={`hover:text-brand ${categoryQuery === 'Wheat' ? 'text-brand font-bold' : ''}`}>Wheat & Grains</Link>
                                </li>
                                <li>
                                    <Link to="/shop?category=Beans" className={`hover:text-brand ${categoryQuery === 'Beans' ? 'text-brand font-bold' : ''}`}>Beans & Legumes</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="w-full md:w-3/4">
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-gray-500 text-sm"><span className="font-bold text-gray-900">{products.length}</span> Results Found</p>
                    </div>

                    {loading ? <Loader /> : error ? (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
                    ) : (
                        <>
                            {products.length === 0 && (
                                <div className="text-center py-10 bg-gray-50 rounded-lg">
                                    <p className="text-gray-500">No products found in this category.</p>
                                    <Link to="/shop" className="text-brand font-bold mt-2 inline-block">Clear Filters</Link>
                                </div>
                            )}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <div key={product._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 group flex flex-col">
                                        <Link to={`/product/${product._id}`}>
                                            <div className="h-48 overflow-hidden bg-gray-100 flex items-center justify-center relative">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
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
                                        <div className="p-4 flex-grow flex flex-col">
                                            <Link to={`/product/${product._id}`}>
                                                <h2 className="text-base font-bold text-gray-800 hover:text-brand transition-colors truncate mb-1">{product.name}</h2>
                                            </Link>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-gray-500 text-xs">${product.price} / kg</span>
                                                <Rating value={product.rating} text={null} color="#FBBF24" />
                                            </div>
                                            <div className="mt-auto flex items-center justify-between">
                                                <p className="text-lg font-bold text-gray-900">${product.price}</p>
                                                <Link to={`/product/${product._id}`} className="bg-gray-100 hover:bg-brand hover:text-white text-gray-900 p-2 rounded-full transition-all">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8">
                                <Paginate pages={pages} page={page} keyword={keywordQuery} />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShopScreen;
