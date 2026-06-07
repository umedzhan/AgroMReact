import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { FaUserCircle, FaAward, FaShoppingBag, FaHeart, FaTruck, FaFileContract, FaUserEdit, FaChevronRight, FaPlus, FaChartLine, FaBoxOpen } from 'react-icons/fa';
import { tUZ } from '../utils/translateHelper';
import { useTranslation } from 'react-i18next';

const ProfileScreen = () => {
    useTranslation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [updateLoading, setUpdateLoading] = useState(false);
    
    // Role state
    const [role, setRole] = useState(null); // 'buyer' or 'seller' or null (role selector)
    const [showEditForm, setShowEditForm] = useState(false);

    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            setName(user.name);
            setEmail(user.email);
            // Default to buyer if logged in
            setRole('buyer');
        }
    }, [navigate, user]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage(tUZ('Parollar mos kelmadi'));
            toast.error(tUZ('Parollar mos kelmadi'));
        } else {
            setMessage(null);
            setUpdateLoading(true);
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                    },
                };

                const { data } = await axios.put(
                    '/api/auth/profile',
                    { id: user._id, name, email, password },
                    config
                );

                localStorage.setItem('userInfo', JSON.stringify(data));
                toast.success(tUZ('Profil muvaffaqiyatli yangilandi'));
                setUpdateLoading(false);
                setShowEditForm(false);
                window.location.reload();
            } catch (error) {
                const message = error.response?.data?.message || error.message;
                toast.error(message);
                setUpdateLoading(false);
            }
        }
    };

    if (!user) return null;

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            {/* 1. ROLE SELECTOR SCREEN */}
            {role === null && (
                <div className="min-h-[60vh] flex flex-col justify-center items-center space-y-8 animate-fadeIn">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-extrabold text-gray-900">{tUZ("Platformadagi rolingizni tanlang")}</h1>
                        <p className="text-gray-500 text-sm max-w-md">{tUZ("Siz o'z faoliyatingizga mos rejimni tanlang. Istalgan vaqtda rejimni o'zgartira olasiz.")}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
                        <div 
                            onClick={() => setRole('buyer')}
                            className="bg-white border border-gray-100 hover:border-brand rounded-2xl p-8 cursor-pointer shadow-sm hover:shadow-lg transition-all text-center flex flex-col items-center justify-between group min-h-[250px]"
                        >
                            <div className="bg-green-50 text-brand p-5 rounded-full group-hover:scale-110 transition-transform">
                                <FaShoppingBag size={36} />
                            </div>
                            <div className="mt-4">
                                <h3 className="text-xl font-bold text-gray-900">{tUZ("Men Xaridorman")}</h3>
                                <p className="text-xs text-gray-500 mt-2 max-w-xs mx-auto">
                                    {tUZ("Sifatli qishloq xo'jaligi mahsulotlarini qidiring, buyurtmalarni rasmiylashtiring va bonuslar yig'ing.")}
                                </p>
                            </div>
                            <span className="text-brand font-bold text-sm flex items-center gap-1.5 mt-4">
                                {tUZ("Kirish")} <FaChevronRight size={12} />
                            </span>
                        </div>

                        <div 
                            onClick={() => setRole('seller')}
                            className="bg-white border border-gray-100 hover:border-brand rounded-2xl p-8 cursor-pointer shadow-sm hover:shadow-lg transition-all text-center flex flex-col items-center justify-between group min-h-[250px]"
                        >
                            <div className="bg-amber-50 text-amber-600 p-5 rounded-full group-hover:scale-110 transition-transform">
                                <FaChartLine size={36} />
                            </div>
                            <div className="mt-4">
                                <h3 className="text-xl font-bold text-gray-900">{tUZ("Men Sotuvchiman")}</h3>
                                <p className="text-xs text-gray-500 mt-2 max-w-xs mx-auto">
                                    {tUZ("Mahsulotlaringizni joylang, shartnomalarni boshqaring va real vaqtdagi savdo tahlillarini kuzating.")}
                                </p>
                            </div>
                            <span className="text-amber-600 font-bold text-sm flex items-center gap-1.5 mt-4">
                                {tUZ("Kirish")} <FaChevronRight size={12} />
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. BUYER PROFILE DASHBOARD */}
            {role === 'buyer' && (
                <div className="space-y-8 animate-fadeIn">
                    {/* Header Banner */}
                    <div className="bg-gradient-to-r from-emerald-800 to-brand p-6 md:p-8 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md relative overflow-hidden">
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="h-16 w-16 md:h-20 md:w-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/50">
                                <FaUserCircle className="text-white h-full w-full opacity-80" />
                            </div>
                            <div>
                                <h2 className="text-xl md:text-2xl font-extrabold">{user.name}</h2>
                                <p className="text-emerald-100 text-xs md:text-sm">{user.email}</p>
                                <span className="bg-white/20 text-white text-[10px] uppercase font-bold py-0.5 px-2 rounded-full inline-block mt-2">
                                    {tUZ("Xaridor")}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 relative z-10">
                            <button 
                                onClick={() => setShowEditForm(!showEditForm)}
                                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold py-2 px-4 rounded-xl transition-all flex items-center gap-1.5"
                            >
                                <FaUserEdit /> {tUZ("Tahrirlash")}
                            </button>
                            <button 
                                onClick={() => setRole('seller')}
                                className="bg-white text-brand hover:bg-green-50 text-xs font-bold py-2 px-4 rounded-xl transition-all"
                            >
                                {tUZ("Sotuvchi rejimiga o'tish")}
                            </button>
                        </div>
                    </div>

                    {/* Dashboard Body Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Loyalty Card Column */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="font-extrabold text-gray-900 text-base">{tUZ("Sodiqlik Tizimi")}</h3>
                                <span className="text-yellow-500"><FaAward size={20} /></span>
                            </div>

                            <div className="bg-yellow-50/50 rounded-2xl p-4 border border-yellow-100/50 text-center">
                                <span className="text-xs uppercase tracking-wider text-yellow-600 font-extrabold">{tUZ("Joriy Status")}</span>
                                <h4 className="text-2xl font-black text-yellow-700 mt-1">{tUZ("Oltin A'zo (Gold)")}</h4>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold text-gray-500">
                                    <span>{tUZ("Reting ballingiz:")} 750 {tUZ("ball")}</span>
                                    <span>1000 {tUZ("ball")}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                                </div>
                                <p className="text-[10px] text-gray-400">{tUZ("Yana 250 ball to'plab, Platinum statusiga va bepul ekspress yetkazib berish xizmatiga ega bo'ling!")}</p>
                            </div>
                        </div>

                        {/* Quick Navigation grid */}
                        <div className="lg:col-span-2 space-y-6">
                            <h3 className="font-extrabold text-gray-900 text-lg">{tUZ("Tezkor Menyu")}</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <Link to="/orders" className="bg-white border border-gray-100 hover:border-brand p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group">
                                    <div className="bg-green-50 text-brand p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
                                        <FaShoppingBag size={20} />
                                    </div>
                                    <span className="font-bold text-gray-800 text-sm">{tUZ("Buyurtmalarim")}</span>
                                </Link>

                                <Link to="/cart" className="bg-white border border-gray-100 hover:border-brand p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group">
                                    <div className="bg-green-50 text-brand p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
                                        <FaShoppingBag size={20} />
                                    </div>
                                    <span className="font-bold text-gray-800 text-sm">{tUZ("Savatim")}</span>
                                </Link>

                                <Link to="/wishlist" className="bg-white border border-gray-100 hover:border-brand p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group">
                                    <div className="bg-red-50 text-red-500 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
                                        <FaHeart size={20} />
                                    </div>
                                    <span className="font-bold text-gray-800 text-sm">{tUZ("Sevimlilar")}</span>
                                </Link>

                                <Link to="/export" className="bg-white border border-gray-100 hover:border-brand p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group">
                                    <div className="bg-blue-50 text-blue-600 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
                                        <FaTruck size={20} />
                                    </div>
                                    <span className="font-bold text-gray-800 text-sm">{tUZ("Logistika statusi")}</span>
                                </Link>

                                <Link to="/contracts" className="bg-white border border-gray-100 hover:border-brand p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group">
                                    <div className="bg-amber-50 text-amber-700 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
                                        <FaFileContract size={20} />
                                    </div>
                                    <span className="font-bold text-gray-800 text-sm">{tUZ("Shartnomalarim")}</span>
                                </Link>

                                <Link to="/certification" className="bg-white border border-gray-100 hover:border-brand p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group">
                                    <div className="bg-purple-50 text-purple-600 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
                                        <FaAward size={20} />
                                    </div>
                                    <span className="font-bold text-gray-800 text-sm">{tUZ("Sertifikatlarim")}</span>
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {/* 3. SELLER PROFILE DASHBOARD */}
            {role === 'seller' && (
                <div className="space-y-8 animate-fadeIn">
                    {/* Header Banner */}
                    <div className="bg-gradient-to-r from-amber-700 to-amber-500 p-6 md:p-8 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md relative overflow-hidden">
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="h-16 w-16 md:h-20 md:w-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/50">
                                <FaUserCircle className="text-white h-full w-full opacity-80" />
                            </div>
                            <div>
                                <h2 className="text-xl md:text-2xl font-extrabold">{user.name}</h2>
                                <p className="text-amber-100 text-xs md:text-sm">{user.email}</p>
                                <span className="bg-white/20 text-white text-[10px] uppercase font-bold py-0.5 px-2 rounded-full inline-block mt-2">
                                    {tUZ("Sotuvchi (Seller)")}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 relative z-10">
                            <button 
                                onClick={() => setShowEditForm(!showEditForm)}
                                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold py-2 px-4 rounded-xl transition-all flex items-center gap-1.5"
                            >
                                <FaUserEdit /> {tUZ("Tahrirlash")}
                            </button>
                            <button 
                                onClick={() => setRole('buyer')}
                                className="bg-white text-amber-700 hover:bg-amber-50 text-xs font-bold py-2 px-4 rounded-xl transition-all"
                            >
                                {tUZ("Xaridor rejimiga o'tish")}
                            </button>
                        </div>
                    </div>

                    {/* Seller Analytics stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{tUZ("Jami Savdo")}</span>
                            <h3 className="text-2xl font-black text-gray-900 mt-2">12,450,000 UZS</h3>
                            <p className="text-xs text-brand font-semibold mt-1">{tUZ("▲ O'tgan oyga nisbatan +15%")}</p>
                        </div>

                        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{tUZ("Faol Mahsulotlar")}</span>
                            <h3 className="text-2xl font-black text-gray-900 mt-2">18 {tUZ("ta mahsulot")}</h3>
                            <p className="text-xs text-gray-400 mt-1">{tUZ("Barcha mahsulotlar tasdiqlangan")}</p>
                        </div>

                        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{tUZ("Shartnomalar")}</span>
                            <h3 className="text-2xl font-black text-gray-900 mt-2">5 {tUZ("ta faol kelishuv")}</h3>
                            <p className="text-xs text-amber-600 font-semibold mt-1">{tUZ("● 1 ta imzolash kutilmoqda")}</p>
                        </div>
                    </div>

                    {/* Quick navigation and action widgets */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-4">
                            <h3 className="font-extrabold text-gray-900 text-lg">{tUZ("Do'kon Boshqaruvi")}</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <Link to="/admin/product/create" className="border border-dashed border-gray-300 hover:border-brand p-5 rounded-xl text-center flex flex-col items-center justify-center group transition-colors">
                                    <FaPlus className="text-gray-400 group-hover:text-brand mb-2" />
                                    <span className="text-xs font-bold text-gray-700 group-hover:text-brand">{tUZ("Yangi Mahsulot")}</span>
                                </Link>
                                <Link to="/admin/productlist" className="border border-dashed border-gray-300 hover:border-brand p-5 rounded-xl text-center flex flex-col items-center justify-center group transition-colors">
                                    <FaBoxOpen className="text-gray-400 group-hover:text-brand mb-2" />
                                    <span className="text-xs font-bold text-gray-700 group-hover:text-brand">{tUZ("Mahsulotlar ro'yxati")}</span>
                                </Link>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-4">
                            <h3 className="font-extrabold text-gray-900 text-lg">{tUZ("Faol Kelishuvlar & Shartnomalar")}</h3>
                            <div className="divide-y divide-gray-100">
                                <div className="py-3 flex justify-between items-center">
                                    <div>
                                        <p className="text-xs font-bold text-gray-800">Shartnoma #204 - Dehqonobod MCHJ</p>
                                        <p className="text-[10px] text-gray-400">{tUZ("Bug'doy yetkazib berish (10 tonna)")}</p>
                                    </div>
                                    <span className="text-[10px] font-bold py-0.5 px-2 bg-green-50 text-brand rounded-full">{tUZ("Faol")}</span>
                                </div>
                                <div className="py-3 flex justify-between items-center">
                                    <div>
                                        <p className="text-xs font-bold text-gray-800">Shartnoma #205 - Agrosanoat Savdo</p>
                                        <p className="text-[10px] text-gray-400">{tUZ("Organik Kartoshka (5 tonna)")}</p>
                                    </div>
                                    <span className="text-[10px] font-bold py-0.5 px-2 bg-amber-50 text-amber-600 rounded-full">{tUZ("Imzo kutilmoqda")}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* EDIT PROFILE FORM MODAL / OVERLAY */}
            {showEditForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl w-full max-w-md border border-gray-100 space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-extrabold text-gray-955">{tUZ("Profilni Yangilash")}</h3>
                            <button 
                                onClick={() => setShowEditForm(false)}
                                className="text-gray-400 hover:text-gray-600 font-bold"
                            >
                                {tUZ("yopish")}
                            </button>
                        </div>

                        {message && <div className="bg-red-50 text-red-600 border border-red-100 text-xs px-4 py-3.5 rounded-xl">{tUZ(message)}</div>}

                        <form onSubmit={submitHandler} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">{tUZ("Ism")}</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder={tUZ("Ismingizni kiriting")}
                                    className="w-full border border-gray-200 px-4 py-2 rounded-xl focus:outline-none focus:border-brand bg-gray-50/50"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">{tUZ("Email manzilingiz")}</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={tUZ("Email manzilingiz")}
                                    className="w-full border border-gray-200 px-4 py-2 rounded-xl focus:outline-none focus:border-brand bg-gray-50/50"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">{tUZ("Yangi parol (ixtiyoriy)")}</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={tUZ("Kamida 6 ta belgi")}
                                    className="w-full border border-gray-200 px-4 py-2 rounded-xl focus:outline-none focus:border-brand bg-gray-50/50"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">{tUZ("Yangi parolni tasdiqlash")}</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder={tUZ("Parolni qayta kiriting")}
                                    className="w-full border border-gray-200 px-4 py-2 rounded-xl focus:outline-none focus:border-brand bg-gray-50/50"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={updateLoading}
                                className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-3 rounded-xl transition-all shadow-md mt-2"
                            >
                                {updateLoading ? tUZ('Saqlanmoqda...') : tUZ('Saqlash')}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileScreen;
