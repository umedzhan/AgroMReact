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
            dark: false,
        },
        {
            href: EXPORT_URL,
            domain: 'export.agrom24.uz',
            icon: <FaGlobeAsia size={28} />,
            title: tUZ("Logistika & Eksport"),
            text: tUZ("Mahsulotlarni xorijga eksport qilish: davlatlar bo'yicha talab, logistika va hujjatlar."),
            cta: tUZ("Eksportga o'tish"),
            dark: true,
        },
    ];

    return (
        <div>
            <Hero />

            {/* Gateways to the mb and export subdomains */}
            <section className="py-8 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {gateways.map((g) => (
                        <SmartLink
                            key={g.domain}
                            href={g.href}
                            className={`group relative flex min-h-[260px] flex-col overflow-hidden rounded-3xl p-6 md:p-8 transition duration-300 hover:-translate-y-1 ${
                                g.dark ? 'bg-ink-950 text-white shadow-lift' : 'border border-line bg-white shadow-card hover:shadow-lift'
                            }`}
                        >
                            {g.dark && <div className="bg-grid-dark absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" />}
                            <div className={`absolute -right-16 -top-16 size-56 rounded-full blur-3xl ${g.dark ? 'bg-brand-500/25' : 'bg-harvest-200/50'}`} />
                            <div className="relative flex items-start justify-between">
                                <div className={`grid size-12 place-items-center rounded-xl ${g.dark ? 'bg-white/10 text-harvest-300' : 'bg-brand-50 text-brand-700'}`}>{g.icon}</div>
                                <span className={`rounded-full px-2.5 py-1 font-mono text-[11px] ${g.dark ? 'bg-white/10 text-ink-200' : 'bg-ink-50 text-ink-500'}`}>
                                    {g.domain}
                                </span>
                            </div>
                            <div className="relative mt-auto pt-8">
                                <div className={`text-xs font-bold uppercase tracking-[0.16em] ${g.dark ? 'text-harvest-300' : 'text-brand-600'}`}>{g.title}</div>
                                <p className={`mt-2 font-display text-xl font-bold md:text-2xl ${g.dark ? 'text-white' : 'text-ink-900'}`}>{g.text}</p>
                                <span className={`mt-6 inline-flex h-12 items-center gap-2 rounded-xl px-5 text-[15px] font-semibold transition ${
                                    g.dark ? 'bg-harvest-400 text-ink-950 group-hover:bg-harvest-300' : 'bg-brand-600 text-white group-hover:bg-brand-700'
                                }`}>
                                    {g.cta}
                                    <FaArrowRight className="transition group-hover:translate-x-0.5" />
                                </span>
                            </div>
                        </SmartLink>
                    ))}
                </div>
            </section>

            <InfoSection />

            {/* A short selection of products; the full catalogue lives on mb */}
            <section className="py-4">
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="eyebrow mb-3">mb.agrom24.uz</div>
                        <h2 className="text-3xl font-bold leading-tight text-ink-900 md:text-[2.5rem]">{t('home.popular_products')}</h2>
                    </div>
                    <SmartLink href={MB_URL} className="btn-outline self-start md:self-auto">
                        {t('home.view_all')} <FaArrowRight />
                    </SmartLink>
                </div>

                {loading ? <Loader /> : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">{error}</div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
                        {products.map((product) => (
                            <div key={product._id} className="card group overflow-hidden flex flex-col transition duration-300 hover:-translate-y-0.5 hover:shadow-lift">
                                <Link to={`/product/${product._id}`}>
                                    <div className="h-32 md:h-48 overflow-hidden bg-ink-50 flex items-center justify-center relative">
                                        <img
                                            src={getImageUrl(product.image)}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <button
                                            onClick={(e) => toggleWishlist(e, product)}
                                            className="absolute top-2 right-2 grid size-8 md:size-9 place-items-center rounded-full bg-white/90 text-ink-400 hover:text-red-500 transition-colors z-10 shadow-sm backdrop-blur"
                                        >
                                            {isInWishlist(product._id) ? (
                                                <FaHeart className="text-red-500 w-4 h-4" />
                                            ) : (
                                                <FaRegHeart className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </Link>
                                <div className="p-3 md:p-4 flex-grow flex flex-col">
                                    <Link to={`/product/${product._id}`}>
                                        <h3 className="text-sm md:text-base font-semibold text-ink-900 hover:text-brand-700 transition-colors line-clamp-2 mb-1 md:mb-2 min-h-[40px] md:min-h-0">{product.name}</h3>
                                    </Link>
                                    <div className="flex items-center mb-2 md:mb-3">
                                        <Rating value={product.rating} text={`${product.numReviews}`} color="#FBBF24" />
                                        <span className="text-xs text-ink-400 ml-1">{t('home.reviews')}</span>
                                    </div>
                                    <p className="mt-auto font-display text-lg md:text-xl font-extrabold text-ink-950">{product.price} <span className="text-xs font-semibold text-ink-400">UZS</span></p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="text-center mt-10">
                    <SmartLink
                        href={MB_URL}
                        className="btn-primary group h-12 px-6"
                    >
                        {tUZ("Barcha mahsulotlarni ko'rish")} <FaArrowRight className="transition group-hover:translate-x-0.5" />
                    </SmartLink>
                </div>
            </section>
        </div>
    );
};

export default MarketLandingScreen;
