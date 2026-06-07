import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { tUZ } from '../utils/translateHelper';
import { useTranslation } from 'react-i18next';
import { FaTrash, FaPlus, FaMinus, FaLock, FaTruck } from 'react-icons/fa';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const CartScreen = () => {
    useTranslation();
    const navigate = useNavigate();
    const { cartItems, removeFromCart, addToCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);

    const totalAmount = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
    const freeDeliveryThreshold = 200000;
    const progressPercent = Math.min((totalAmount / freeDeliveryThreshold) * 100, 100);
    const amountNeeded = freeDeliveryThreshold - totalAmount;

    const checkoutHandler = () => {
        if (!user) {
            toast.error("Buyurtma rasmiylashtirish uchun tizimga kirishingiz yoki ro'yxatdan o'tishingiz shart.");
            navigate('/login?redirect=/checkout');
        } else {
            navigate('/checkout');
        }
    };

    // Recommended products mock data
    const recommendations = [
        { _id: 'rec1', name: 'Organik Kartoshka', price: 8000, image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
        { _id: 'rec2', name: 'Shirin Piyoz', price: 6000, image: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
        { _id: 'rec3', name: 'Qizil Pomidor', price: 12000, image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' }
    ];

    return (
        <div className="container mx-auto px-2 lg:px-4 py-6">
            <h1 className="text-2xl md:text-3xl font-extrabold mb-8 text-gray-900 flex items-center gap-2">
                {tUZ("Savat")}
                <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {cartItems.reduce((acc, item) => acc + item.qty, 0)} {tUZ("dona")}
                </span>
            </h1>

            {cartItems.length === 0 ? (
                <div className="bg-emerald-50 border-l-4 border-brand text-emerald-800 p-6 rounded-r-xl shadow-sm" role="alert">
                    <p className="font-bold text-lg mb-1">{tUZ("Savatingiz hozircha bo'sh.")}</p>
                    <p className="text-emerald-700 text-sm mb-4">{tUZ("Loyiha katalogidan yangi va tabiiy qishloq xo'jaligi mahsulotlarini qo'shishingiz mumkin.")}</p>
                    <Link to="/" className="inline-block bg-brand hover:bg-brand-dark text-white font-semibold px-6 py-2 rounded-lg transition-colors shadow-sm">
                        {tUZ("Asosiy Sahifaga Qaytish")}
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Free Shipping Tracker */}
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3 text-gray-800 mb-3 font-semibold text-sm md:text-base">
                                <FaTruck className="text-brand text-xl" />
                                {amountNeeded > 0 ? (
                                    <span>
                                        {tUZ("Bepul yetkazib berish uchun yana ")} <span className="text-brand font-bold">{amountNeeded.toLocaleString()} UZS</span>{tUZ("lik mahsulot qo'shing")}
                                    </span>
                                ) : (
                                    <span className="text-brand flex items-center gap-1">
                                        {tUZ("Tabriklaymiz! Sizga bepul yetkazib berish kafolatlandi.")}
                                    </span>
                                )}
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                <div 
                                    className="bg-brand h-2.5 rounded-full transition-all duration-500" 
                                    style={{ width: `${progressPercent}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Cart Items */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
                            {cartItems.map((item) => (
                                <div key={item._id} className="p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                    <div className="flex items-center space-x-4 flex-1">
                                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl border border-gray-100" />
                                        <div>
                                            <Link to={`/product/${item._id}`} className="text-gray-900 font-bold hover:text-brand transition-colors text-base md:text-lg">
                                                {item.name}
                                            </Link>
                                            <p className="text-xs text-gray-500 mt-1">{tUZ("Omborda mavjud")}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between w-full md:w-auto md:space-x-8">
                                        <div className="text-lg font-bold text-gray-900 whitespace-nowrap">
                                            {item.price.toLocaleString()} UZS
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                                            <button 
                                                onClick={() => item.qty > 1 && addToCart(item, item.qty - 1)}
                                                className="px-3 py-1.5 hover:bg-gray-200 text-gray-600 transition-colors"
                                                disabled={item.qty <= 1}
                                            >
                                                <FaMinus size={10} />
                                            </button>
                                            <span className="px-3 font-semibold text-gray-800 text-sm">{item.qty}</span>
                                            <button 
                                                onClick={() => item.qty < item.countInStock && addToCart(item, item.qty + 1)}
                                                className="px-3 py-1.5 hover:bg-gray-200 text-gray-600 transition-colors"
                                                disabled={item.qty >= item.countInStock}
                                            >
                                                <FaPlus size={10} />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item._id)}
                                            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2.5 rounded-full transition-colors"
                                            title={tUZ("O'chirish")}
                                        >
                                            <FaTrash size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary Card */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">{tUZ("Xarid Tafsilotlari")}</h2>
                            
                            <div className="space-y-4 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span>{tUZ("Jami mahsulotlar:")}</span>
                                    <span className="font-semibold text-gray-900">{cartItems.reduce((acc, item) => acc + item.qty, 0)} {tUZ("dona")}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>{tUZ("Yetkazib berish:")}</span>
                                    <span className="font-semibold text-gray-900">
                                        {totalAmount >= freeDeliveryThreshold ? tUZ("Bepul") : '15,000 UZS'}
                                    </span>
                                </div>
                                <div className="border-t border-gray-100 pt-4 flex justify-between text-lg font-extrabold text-gray-900">
                                    <span>{tUZ("Jami summa:")}</span>
                                    <span>
                                        {(totalAmount + (totalAmount >= freeDeliveryThreshold ? 0 : 15000)).toLocaleString()} UZS
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={checkoutHandler}
                                disabled={cartItems.length === 0}
                                className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 hover:shadow-lg active:scale-[0.98]"
                            >
                                <FaLock size={14} />
                                {tUZ("Rasmiylashtirishga o'tish")}
                            </button>

                            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                {tUZ("Biz orqali to'lovlar 100% xavfsiz va himoyalangan")}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Recommendations Section */}
            <div className="mt-16">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">{tUZ("Siz uchun tavsiyalar")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {recommendations.map((prod) => (
                        <div key={prod._id} className="bg-white rounded-2xl border border-gray-150 p-4 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
                            <img src={prod.image} alt={prod.name} className="w-20 h-20 object-cover rounded-xl" />
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 text-sm md:text-base">{prod.name}</h4>
                                <p className="text-brand font-extrabold text-sm mt-1">{prod.price.toLocaleString()} UZS / kg</p>
                                <Link 
                                    to="/"
                                    className="text-xs text-brand font-semibold hover:underline mt-2 inline-block"
                                >
                                    {tUZ("Batafsil ko'rish")}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CartScreen;
