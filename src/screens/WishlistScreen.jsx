import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaShoppingCart, FaRegHeart } from 'react-icons/fa';
import WishlistContext from '../context/WishlistContext';
import Loader from '../components/Loader';
import Rating from '../components/Rating';
import { tUZ } from '../utils/translateHelper';
import { useTranslation } from 'react-i18next';
import { getImageUrl } from '../utils/getImageUrl';

const WishlistScreen = () => {
    useTranslation();
    const { wishlist, loading, removeFromWishlist } = useContext(WishlistContext);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">{tUZ("Mening Tanlanganlarim")}</h1>

            {loading ? (
                <Loader />
            ) : wishlist.length === 0 ? (
                <div className="bg-emerald-50 border-l-4 border-brand text-emerald-800 p-6 rounded-r-xl shadow-sm flex items-start gap-4" role="alert">
                    <FaRegHeart className="text-brand text-2xl mt-1 flex-shrink-0" />
                    <div>
                        <p className="font-bold text-lg mb-1">{tUZ("Sizning tanlanganlar ro'yxatingiz bo'sh.")}</p>
                        <p className="text-emerald-700 text-sm mb-4">{tUZ("Yoqtirgan mahsulotlaringizni saqlab qo'yish uchun ularni sevimlilarga qo'shing.")}</p>
                        <Link to="/shop" className="inline-block bg-brand hover:bg-brand-dark text-white font-semibold px-6 py-2 rounded-lg transition-colors shadow-sm">
                            {tUZ("Xarid qilishga o'tish")}
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {wishlist.map((product) => (
                        <div key={product._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col">
                            <Link to={`/product/${product._id}`}>
                                <div className="h-48 overflow-hidden bg-gray-100 flex items-center justify-center relative">
                                    <img
                                        src={getImageUrl(product.image)}
                                        alt={product.name}
                                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            removeFromWishlist(product._id);
                                        }}
                                        className="absolute top-2 right-2 bg-white/80 p-2 rounded-full text-red-500 hover:bg-red-50 transition-colors z-10"
                                        title={tUZ("Sevimlilardan o'chirish")}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </Link>
                            <div className="p-5 flex-grow flex flex-col">
                                <Link to={`/product/${product._id}`}>
                                    <h2 className="text-lg font-bold text-gray-800 hover:text-green-600 transition-colors truncate mb-2">{product.name}</h2>
                                </Link>
                                <div className="flex items-center mb-3">
                                    <Rating value={product.rating} text={`${product.numReviews} ${tUZ("sharhlar")}`} color="#FBBF24" />
                                </div>
                                <div className="mt-auto flex items-center justify-between">
                                    <p className="text-2xl font-bold text-gray-900">{product.price} UZS</p>
                                    <Link to={`/product/${product._id}`} className="text-green-600 hover:bg-green-50 p-2 rounded-full transition-colors">
                                        <FaShoppingCart className="w-5 h-5" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WishlistScreen;
