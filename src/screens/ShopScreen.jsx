import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import Loader from '../components/Loader';
import Rating from '../components/Rating';
import Paginate from '../components/Paginate';
import { FaFilter, FaHeart, FaRegHeart, FaChevronDown } from 'react-icons/fa';
import WishlistContext from '../context/WishlistContext';
import { tUZ } from '../utils/translateHelper';
import { useTranslation } from 'react-i18next';
import { getImageUrl } from '../utils/getImageUrl';
import { PRODUCT_CATEGORIES, getCategoryLabel } from '../utils/categories';

const ShopScreen = () => {
    const { t } = useTranslation();
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
    const [filterOpen, setFilterOpen] = useState(false);

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
        <div className="space-y-8">
            {/* Page header */}
            <div className="card relative overflow-hidden rounded-3xl">
                <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_right,black_20%,transparent_70%)]" />
                <div className="absolute -right-24 -top-24 size-72 rounded-full bg-harvest-200/40 blur-3xl" />
                <div className="relative p-6 md:p-10">
                    <div className="eyebrow mb-3">🇺🇿 mb.agrom24.uz</div>
                    <h1 className="text-3xl font-extrabold leading-tight text-ink-950 md:text-5xl">{tUZ("Do'kon")}</h1>
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-ink-500">
                        <Link to="/" className="hover:text-ink-900">{tUZ("Bosh sahifa")}</Link>
                        <span className="text-ink-300">/</span>
                        <span className="font-semibold text-brand-700">{tUZ("Do'kon")}</span>
                        {categoryQuery && (
                            <>
                                <span className="text-ink-300">/</span>
                                <span className="font-semibold text-ink-900 capitalize">{getCategoryLabel(categoryQuery, t)}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
                {/* Filters Sidebar */}
                <aside>
                    <div className="card lg:sticky lg:top-36 lg:p-5">
                        <button
                            type="button"
                            onClick={() => setFilterOpen((open) => !open)}
                            className="flex w-full items-center justify-between p-5 lg:pointer-events-none lg:mb-4 lg:p-0"
                        >
                            <span className="flex items-center gap-2">
                                <FaFilter className="text-brand-600" size={14} />
                                <h3 className="font-display text-lg font-bold text-ink-900">{tUZ("Filtr")}</h3>
                            </span>
                            <FaChevronDown className={`text-ink-400 transition-transform lg:hidden ${filterOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <div className={`${filterOpen ? 'block' : 'hidden'} lg:block px-5 pb-5 lg:p-0`}>
                            <h4 className="mb-2 text-sm font-medium text-ink-700">{tUZ("Kategoriyalar")}</h4>
                            <ul className="space-y-0.5 text-[15px]">
                                <li>
                                    <Link
                                        to="/shop"
                                        className={`block rounded-xl px-3 py-2 transition ${!categoryQuery ? 'bg-brand-50 font-semibold text-brand-800' : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'}`}
                                    >
                                        {tUZ("Barcha kategoriyalar")}
                                    </Link>
                                </li>
                                {PRODUCT_CATEGORIES.map((c) => (
                                    <li key={c.value}>
                                        <Link
                                            to={`/shop?category=${c.value}`}
                                            className={`block rounded-xl px-3 py-2 transition ${categoryQuery === c.value ? 'bg-brand-50 font-semibold text-brand-800' : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'}`}
                                        >
                                            {t(`header.nav.${c.navKey}`)}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="min-w-0">
                    <div className="mb-5 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-sm text-ink-500 ring-1 ring-inset ring-line">
                            <span className="font-bold text-ink-900">{products.length}</span> {tUZ("Natijalar topildi")}
                        </span>
                    </div>

                    {loading ? <Loader /> : error ? (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">{error}</div>
                    ) : (
                        <>
                            {products.length === 0 && (
                                <div className="card px-6 py-14 text-center">
                                    <p className="text-ink-500">{tUZ("Kategoriyada mahsulotlar topilmadi.")}</p>
                                    <Link to="/shop" className="btn-outline mt-4">{tUZ("Filtrlarni tozalash")}</Link>
                                </div>
                            )}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                {products.map((product) => (
                                    <div key={product._id} className="card group flex flex-col overflow-hidden transition duration-300 hover:-translate-y-0.5 hover:shadow-lift">
                                        <Link to={`/product/${product._id}`}>
                                            <div className="relative flex h-52 items-center justify-center overflow-hidden bg-ink-50">
                                                <img
                                                    src={getImageUrl(product.image)}
                                                    alt={product.name}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                                <button
                                                    onClick={(e) => toggleWishlist(e, product)}
                                                    className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full bg-white/90 text-ink-400 shadow-sm backdrop-blur transition-colors hover:text-red-500"
                                                >
                                                    {isInWishlist(product._id) ? (
                                                        <FaHeart className="h-4 w-4 text-red-500" />
                                                    ) : (
                                                        <FaRegHeart className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </Link>
                                        <div className="flex flex-grow flex-col p-4">
                                            <Link to={`/product/${product._id}`}>
                                                <h2 className="mb-1 truncate text-base font-semibold text-ink-900 transition-colors hover:text-brand-700">{product.name}</h2>
                                            </Link>
                                            <div className="mb-3 flex items-center justify-between">
                                                <span className="text-xs text-ink-400">{product.price} UZS / kg</span>
                                                <Rating value={product.rating} text={null} color="#FBBF24" />
                                            </div>
                                            <div className="mt-auto flex items-center justify-between border-t border-line pt-3">
                                                <p className="font-display text-xl font-extrabold text-ink-950">{product.price} <span className="text-xs font-semibold text-ink-400">UZS</span></p>
                                                <Link to={`/product/${product._id}`} className="grid size-10 place-items-center rounded-xl bg-brand-50 text-brand-700 transition-all hover:bg-brand-600 hover:text-white">
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
