import React, { useState, useEffect, useContext } from 'react';
import { tUZ } from '../utils/translateHelper';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import Rating from '../components/Rating';
import Paginate from '../components/Paginate';
import Hero from '../components/Hero';
import InfoSection from '../components/InfoSection';
import { FaArrowRight, FaHeart, FaRegHeart } from 'react-icons/fa';
import WishlistContext from '../context/WishlistContext';
import { useTranslation } from 'react-i18next';
import { getImageUrl } from '../utils/getImageUrl';

const HomeScreen = () => {
    const { keyword, pageNumber } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const { t } = useTranslation();

    const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);

    const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 12, minutes: 45, seconds: 30 });

    useEffect(() => {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 3);

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const difference = targetDate.getTime() - now;

            if (difference <= 0) {
                clearInterval(timer);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            } else {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);
                setTimeLeft({ days, hours, minutes, seconds });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get(`/api/products?keyword=${keyword || ''}&pageNumber=${pageNumber || 1}`);
                setProducts(data.products || []);
                setPage(data.page || 1);
                setPages(data.pages || 1);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setProducts([]);
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

            {/* Premium Discount Banner with Countdown Timer */}
            <div className="container mx-auto px-4 mb-12">
                <div className="bg-gradient-to-r from-emerald-800 to-green-600 rounded-2xl p-6 md:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border border-emerald-700 relative overflow-hidden">
                    <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-12 -translate-y-12">
                        <svg width="300" height="300" fill="currentColor" viewBox="0 0 100 100">
                            <path d="M10 80 Q 52.5 10, 95 80" stroke="white" strokeWidth="5" fill="none" />
                        </svg>
                    </div>
                    <div className="relative z-10">
                        <span className="bg-brand-dark/30 border border-brand/50 text-white text-xs font-semibold uppercase tracking-wider py-1 px-3 rounded-full mb-3 inline-block">
                            {tUZ("Cheklangan Taklif")}
                        </span>
                        <h2 className="text-2xl md:text-3xl font-extrabold mb-2 leading-tight">{tUZ("Yozgi Aksiyada 30% gacha Chegirma!")}</h2>
                        <p className="text-emerald-100 text-sm max-w-xl">{tUZ("Barcha yangi sabzavotlar va poliz ekinlariga ajoyib chegirmalar. Hoziroq xarid qiling va sifatga baho bering!")}</p>
                    </div>
                    {/* Timer blocks */}
                    <div className="flex items-center gap-2 md:gap-3 relative z-10 shrink-0">
                        <div className="bg-black/30 backdrop-blur-md rounded-xl p-3 w-16 md:w-20 text-center border border-white/10">
                            <span className="block text-xl md:text-2xl font-bold">{String(timeLeft.days).padStart(2, '0')}</span>
                            <span className="text-[9px] uppercase text-emerald-200 font-semibold">{tUZ("Kun")}</span>
                        </div>
                        <div className="text-xl font-bold animate-pulse text-emerald-300">:</div>
                        <div className="bg-black/30 backdrop-blur-md rounded-xl p-3 w-16 md:w-20 text-center border border-white/10">
                            <span className="block text-xl md:text-2xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>
                            <span className="text-[9px] uppercase text-emerald-200 font-semibold">{tUZ("Soat")}</span>
                        </div>
                        <div className="text-xl font-bold animate-pulse text-emerald-300">:</div>
                        <div className="bg-black/30 backdrop-blur-md rounded-xl p-3 w-16 md:w-20 text-center border border-white/10">
                            <span className="block text-xl md:text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>
                            <span className="text-[9px] uppercase text-emerald-200 font-semibold">{tUZ("Daqiqa")}</span>
                        </div>
                        <div className="text-xl font-bold animate-pulse text-emerald-300">:</div>
                        <div className="bg-black/30 backdrop-blur-md rounded-xl p-3 w-16 md:w-20 text-center border border-white/10">
                            <span className="block text-xl md:text-2xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span>
                            <span className="text-[9px] uppercase text-emerald-200 font-semibold">{tUZ("Soniya")}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-end mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">{t('home.popular_products')}</h2>
                    <Link to="/shop" className="text-brand font-medium hover:text-brand-dark flex items-center">
                        {t('home.view_all')} <FaArrowRight className="ml-2" />
                    </Link>
                </div>

                {loading ? <Loader /> : error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
                            {products?.map((product) => (
                                <div key={product._id} className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col">
                                    <Link to={`/product/${product._id}`}>
                                        <div className="h-32 md:h-48 overflow-hidden bg-gray-100 flex items-center justify-center relative">
                                            <img
                                                src={getImageUrl(product.image)}
                                                alt={product.name}
                                                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                                            />
                                            <button
                                                onClick={(e) => toggleWishlist(e, product)}
                                                className="absolute top-2 right-2 bg-white/80 p-1.5 md:p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors z-10 shadow-sm"
                                            >
                                                {isInWishlist(product._id) ? (
                                                    <FaHeart className="text-red-500 w-4 h-4 md:w-5 md:h-5" />
                                                ) : (
                                                    <FaRegHeart className="w-4 h-4 md:w-5 md:h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </Link>
                                    <div className="p-3 md:p-5 flex-grow flex flex-col">
                                        <Link to={`/product/${product._id}`}>
                                            <h2 className="text-sm md:text-lg font-bold text-gray-800 hover:text-green-600 transition-colors line-clamp-2 mb-1 md:mb-2 min-h-[40px] md:min-h-0">{product.name}</h2>
                                        </Link>
                                        <div className="flex items-center mb-2 md:mb-3">
                                            <Rating value={product.rating} text={`${product.numReviews}`} color="#FBBF24" />
                                            <span className="text-xs text-gray-400 ml-1">{t('home.reviews')}</span>
                                        </div>
                                        <div className="mt-auto flex items-center justify-between">
                                            <p className="text-lg md:text-2xl font-bold text-gray-900">{product.price} UZS</p>
                                            <Link to={`/product/${product._id}`} className="text-green-600 hover:bg-green-50 p-1.5 md:p-2 rounded-full transition-colors bg-green-50 md:bg-transparent">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
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
