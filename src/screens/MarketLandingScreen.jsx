import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaHeart, FaRegHeart, FaStore, FaGlobeAsia } from 'react-icons/fa';
import Loader from '../components/Loader';
import Rating from '../components/Rating';
import Hero from '../components/Hero';
import InfoSection from '../components/InfoSection';
import WishlistContext from '../context/WishlistContext';
import { useTranslation } from 'react-i18next';
import { tUZ } from '../utils/translateHelper';
import { getImageUrl } from '../utils/getImageUrl';

const FEATURED_COUNT = 8;

// On the live *.agrom24.uz hosts the shop and export sections have their own
// subdomains; anywhere else (localhost, previews) fall back to in-app routes.
const isAgromHost = window.location.hostname.endsWith('agrom24.uz');
const MB_URL = isAgromHost ? 'https://mb.agrom24.uz' : '/shop';
const EXPORT_URL = isAgromHost ? 'https://export.agrom24.uz' : '/export';

const SmartLink = ({ href, className, children }) =>
    href.startsWith('http') ? (
        <a href={href} className={className}>{children}</a>
    ) : (
        <Link to={href} className={className}>{children}</Link>
    );

const MarketLandingScreen = () => {
    const { t } = useTranslation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get('/api/products?pageNumber=1');
                setProducts((data.products || []).slice(0, FEATURED_COUNT));
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const toggleWishlist = (e, product) => {
        e.preventDefault();
        if (isInWishlist(product._id)) {
            removeFromWishlist(product._id);
        } else {
            addToWishlist(product._id);
        }
    };

    const gateways = [
        {
            href: MB_URL,
            domain: 'mb.agrom24.uz',
            icon: <FaStore size={28} />,
            title: tUZ("Mahsulotlar do'koni"),
            text: tUZ("Fermerlardan to'g'ridan-to'g'ri yangi mahsulotlar: barcha toifalar, filtrlar va qulay buyurtma."),
            cta: tUZ("Do'konga o'tish"),
            style: 'from-emerald-700 to-green-500',
        },
        {
            href: EXPORT_URL,
            domain: 'export.agrom24.uz',
            icon: <FaGlobeAsia size={28} />,
            title: tUZ("Logistika & Eksport"),
            text: tUZ("Mahsulotlarni xorijga eksport qilish: davlatlar bo'yicha talab, logistika va hujjatlar."),
            cta: tUZ("Eksportga o'tish"),
            style: 'from-sky-700 to-blue-500',
        },
    ];

    return (
        <div>
            <Hero />

            {/* Gateways to the mb and export subdomains */}
            <section className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {gateways.map((g) => (
                        <SmartLink
                            key={g.domain}
                            href={g.href}
                            className={`group bg-gradient-to-r ${g.style} rounded-2xl p-6 md:p-8 text-white shadow-md hover:shadow-xl transition-shadow flex flex-col`}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-white/20 rounded-xl p-3">{g.icon}</div>
                                <span className="text-xs font-semibold uppercase tracking-wider bg-black/20 rounded-full py-1 px-3">
                                    {g.domain}
                                </span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-extrabold mb-2">{g.title}</h2>
                            <p className="text-white/85 text-sm md:text-base mb-6 max-w-md">{g.text}</p>
                            <span className="mt-auto inline-flex items-center font-semibold">
                                {g.cta}
                                <FaArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                            </span>
                        </SmartLink>
                    ))}
                </div>
            </section>

            <InfoSection />

            {/* A short selection of products; the full catalogue lives on mb */}
            <section className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-end mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">{t('home.popular_products')}</h2>
                    <SmartLink href={MB_URL} className="text-brand font-medium hover:text-brand-dark flex items-center">
                        {t('home.view_all')} <FaArrowRight className="ml-2" />
                    </SmartLink>
                </div>

                {loading ? <Loader /> : error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
                        {products.map((product) => (
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
                                        <h3 className="text-sm md:text-lg font-bold text-gray-800 hover:text-green-600 transition-colors line-clamp-2 mb-1 md:mb-2 min-h-[40px] md:min-h-0">{product.name}</h3>
                                    </Link>
                                    <div className="flex items-center mb-2 md:mb-3">
                                        <Rating value={product.rating} text={`${product.numReviews}`} color="#FBBF24" />
                                        <span className="text-xs text-gray-400 ml-1">{t('home.reviews')}</span>
                                    </div>
                                    <p className="mt-auto text-lg md:text-2xl font-bold text-gray-900">{product.price} UZS</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="text-center mt-10">
                    <SmartLink
                        href={MB_URL}
                        className="inline-flex items-center bg-brand text-white px-8 py-3 rounded-full font-semibold hover:bg-brand-dark transition-colors"
                    >
                        {tUZ("Barcha mahsulotlarni ko'rish")} <FaArrowRight className="ml-2" />
                    </SmartLink>
                </div>
            </section>
        </div>
    );
};

export default MarketLandingScreen;
