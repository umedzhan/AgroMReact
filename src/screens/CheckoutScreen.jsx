import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tUZ } from '../utils/translateHelper';
import { FaMapMarkerAlt, FaTruck, FaCreditCard, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const CheckoutScreen = () => {
    const navigate = useNavigate();
    const { cartItems, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const [step, setStep] = useState(1);
    const [shippingData, setShippingData] = useState({
        fullName: '',
        phone: '',
        address: '',
        city: 'Toshkent',
        zipCode: ''
    });
    const [deliveryType, setDeliveryType] = useState('standard');
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // GPS tracking simulation variables
    const [trackingProgress, setTrackingProgress] = useState(0);
    const [trackingStatus, setTrackingStatus] = useState("Yuk tayyorlanmoqda...");

    const handleInputChange = (e) => {
        setShippingData({ ...shippingData, [e.target.name]: e.target.value });
    };

    const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

    // Handle form submit to step 4 (GPS simulation start)
    const handleOrderSubmit = async () => {
        if (!user) {
            toast.error(tUZ("Iltimos, avval tizimga kiring."));
            navigate('/login?redirect=/checkout');
            return;
        }

        setIsSubmitting(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const orderData = {
                orderItems: cartItems.map((item) => ({
                    name: item.name,
                    qty: item.qty,
                    image: item.image,
                    price: item.price,
                    product: item._id
                })),
                shippingAddress: {
                    address: shippingData.address,
                    city: shippingData.city,
                    postalCode: shippingData.zipCode || '100000',
                    country: 'O\'zbekiston'
                },
                paymentMethod: paymentMethod === 'card' ? 'Click/Payme' : paymentMethod === 'cash' ? 'Cash' : 'Bank Transfer',
                itemsPrice: totalAmount,
                shippingPrice: deliveryFee,
                taxPrice: 0,
                totalPrice: finalTotal
            };

            const { data } = await axios.post('/api/orders', orderData, config);

            // Save order locally for user dashboard access
            const localOrders = JSON.parse(localStorage.getItem('localOrders')) || [];
            localOrders.push(data);
            localStorage.setItem('localOrders', JSON.stringify(localOrders));

            toast.success(tUZ("Buyurtma rasmiylashtirildi!"));
            setIsSubmitting(false);
            setStep(4);
            clearCart();
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
            setIsSubmitting(false);
        }
    };

    // Tracking simulation logic
    useEffect(() => {
        if (step === 4) {
            const interval = setInterval(() => {
                setTrackingProgress((prev) => {
                    const next = prev + 5;
                    if (next >= 100) {
                        clearInterval(interval);
                        setTrackingStatus("Yetkazib berildi! Yoqimli ishtaha!");
                        return 100;
                    }
                    if (next > 75) {
                        setTrackingStatus("Kuryer manzilingizga juda yaqin.");
                    } else if (next > 40) {
                        setTrackingStatus("Yuk kuryer tomonidan yo'lga olib chiqildi.");
                    } else if (next > 15) {
                        setTrackingStatus("Buyurtma muvaffaqiyatli rasmiylashtirildi, kuryerga topshirildi.");
                    }
                    return next;
                });
            }, 600);
            return () => clearInterval(interval);
        }
    }, [step]);

    const totalAmount = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
    const deliveryFee = deliveryType === 'express' ? 30000 : deliveryType === 'standard' ? 15000 : 0;
    const finalTotal = totalAmount + deliveryFee;

    const steps = [
        { id: 1, label: tUZ('Manzil'), icon: <FaMapMarkerAlt /> },
        { id: 2, label: tUZ('Yetkazib berish'), icon: <FaTruck /> },
        { id: 3, label: tUZ("To'lov"), icon: <FaCreditCard /> },
        { id: 4, label: tUZ('Kuryer Status'), icon: <FaCheckCircle /> }
    ];

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Step Wizard Header */}
            <div className="flex items-center justify-between mb-12 relative">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
                <div 
                    className="absolute top-1/2 left-0 h-1 bg-brand -translate-y-1/2 z-0 transition-all duration-500"
                    style={{ width: `${((step - 1) / 3) * 100}%` }}
                ></div>

                {steps.map((s) => (
                    <div key={s.id} className="relative z-10 flex flex-col items-center">
                        <div className={`h-10 w-10 md:h-12 md:w-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 font-bold ${
                            step >= s.id 
                                ? 'bg-brand border-brand text-white' 
                                : 'bg-white border-gray-300 text-gray-400'
                        }`}>
                            {s.icon}
                        </div>
                        <span className={`text-[10px] md:text-xs font-bold mt-2 ${
                            step >= s.id ? 'text-brand' : 'text-gray-400'
                        }`}>{s.label}</span>
                    </div>
                ))}
            </div>

            {/* Step Contents */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 md:p-8 min-h-[400px] flex flex-col justify-between">
                
                {/* STEP 1: SHIPPING ADDRESS */}
                {step === 1 && (
                    <div className="space-y-6 animate-fadeIn">
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{tUZ("Qabul Qiluvchi Ma'lumotlari")}</h2>
                            <p className="text-gray-500 text-sm">{tUZ("Buyurtma yetkaziladigan manzil va bog'lanish telefonini kiriting.")}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">{tUZ("To'liq ism-sharifingiz")}</label>
                                <input 
                                    type="text" 
                                    name="fullName"
                                    value={shippingData.fullName}
                                    onChange={handleInputChange}
                                    placeholder={tUZ("Masalan: Umedjon Ahmedov")}
                                    className="w-full border border-gray-200 px-4 py-2.5 rounded-lg focus:outline-none focus:border-brand bg-gray-50/50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">{tUZ("Telefon raqam")}</label>
                                <input 
                                    type="text" 
                                    name="phone"
                                    value={shippingData.phone}
                                    onChange={handleInputChange}
                                    placeholder="+998 90 123 45 67"
                                    className="w-full border border-gray-200 px-4 py-2.5 rounded-lg focus:outline-none focus:border-brand bg-gray-50/50"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-1">{tUZ("Manzil (Ko'cha, uy, xonadon)")}</label>
                                <input 
                                    type="text" 
                                    name="address"
                                    value={shippingData.address}
                                    onChange={handleInputChange}
                                    placeholder={tUZ("Yunusobod tumani, 4-mavze, 12-uy, 45-xonadon")}
                                    className="w-full border border-gray-200 px-4 py-2.5 rounded-lg focus:outline-none focus:border-brand bg-gray-50/50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">{tUZ("Shahar / Viloyat")}</label>
                                <select 
                                    name="city"
                                    value={shippingData.city}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-200 px-4 py-2.5 rounded-lg focus:outline-none focus:border-brand bg-gray-50/50"
                                >
                                    <option value="Toshkent">{tUZ("Toshkent shahri")}</option>
                                    <option value="Samarqand">{tUZ("Samarqand")}</option>
                                    <option value="Buxoro">{tUZ("Buxoro")}</option>
                                    <option value="Farg'ona">{tUZ("Farg'ona")}</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">{tUZ("Pochta indeksi (ixtiyoriy)")}</label>
                                <input 
                                    type="text" 
                                    name="zipCode"
                                    value={shippingData.zipCode}
                                    onChange={handleInputChange}
                                    placeholder="100015"
                                    className="w-full border border-gray-200 px-4 py-2.5 rounded-lg focus:outline-none focus:border-brand bg-gray-50/50"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 2: DELIVERY TYPE */}
                {step === 2 && (
                    <div className="space-y-6 animate-fadeIn">
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{tUZ("Yetkazib Berish Usuli")}</h2>
                            <p className="text-gray-500 text-sm">{tUZ("Sizga ma'qul bo'lgan yetkazib berish xizmatini tanlang.")}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div 
                                onClick={() => setDeliveryType('standard')}
                                className={`border-2 rounded-xl p-4 md:p-6 cursor-pointer hover:border-brand transition-all flex flex-col justify-between min-h-[140px] ${
                                    deliveryType === 'standard' ? 'border-brand bg-green-50/40' : 'border-gray-150'
                                }`}
                            >
                                <div>
                                    <h3 className="font-bold text-gray-900 text-base">{tUZ("Oddiy yetkazib berish")}</h3>
                                    <p className="text-xs text-gray-500 mt-1">{tUZ("24 soat ichida uyingizga.")}</p>
                                </div>
                                <span className="text-brand font-extrabold text-sm mt-4">15,000 UZS</span>
                            </div>

                            <div 
                                onClick={() => setDeliveryType('express')}
                                className={`border-2 rounded-xl p-4 md:p-6 cursor-pointer hover:border-brand transition-all flex flex-col justify-between min-h-[140px] ${
                                    deliveryType === 'express' ? 'border-brand bg-green-50/40' : 'border-gray-150'
                                }`}
                            >
                                <div>
                                    <h3 className="font-bold text-gray-900 text-base">{tUZ("Tezkor yetkazib berish")}</h3>
                                    <p className="text-xs text-gray-500 mt-1">{tUZ("3 soat ichida ekspress yetkazish.")}</p>
                                </div>
                                <span className="text-brand font-extrabold text-sm mt-4">30,000 UZS</span>
                            </div>

                            <div 
                                onClick={() => setDeliveryType('pickup')}
                                className={`border-2 rounded-xl p-4 md:p-6 cursor-pointer hover:border-brand transition-all flex flex-col justify-between min-h-[140px] ${
                                    deliveryType === 'pickup' ? 'border-brand bg-green-50/40' : 'border-gray-150'
                                }`}
                            >
                                <div>
                                    <h3 className="font-bold text-gray-900 text-base">{tUZ("O'zi olib ketish (Pickup)")}</h3>
                                    <p className="text-xs text-gray-500 mt-1">{tUZ("Eng yaqin omborxonamizdan.")}</p>
                                </div>
                                <span className="text-brand font-extrabold text-sm mt-4">{tUZ("Bepul")}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 3: PAYMENT METHOD */}
                {step === 3 && (
                    <div className="space-y-6 animate-fadeIn">
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{tUZ("To'lov Tizimi")}</h2>
                            <p className="text-gray-500 text-sm">{tUZ("O'zingizga qulay to'lov turini belgilang.")}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div 
                                onClick={() => setPaymentMethod('card')}
                                className={`border-2 rounded-xl p-5 cursor-pointer hover:border-brand transition-all flex items-center space-x-4 ${
                                    paymentMethod === 'card' ? 'border-brand bg-green-50/40' : 'border-gray-150'
                                }`}
                            >
                                <div className="text-brand text-2xl"><FaCreditCard /></div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">Click / Payme</h4>
                                    <p className="text-[10px] text-gray-500">{tUZ("Karta orqali onlayn to'lov")}</p>
                                </div>
                            </div>

                            <div 
                                onClick={() => setPaymentMethod('cash')}
                                className={`border-2 rounded-xl p-5 cursor-pointer hover:border-brand transition-all flex items-center space-x-4 ${
                                    paymentMethod === 'cash' ? 'border-brand bg-green-50/40' : 'border-gray-150'
                                }`}
                            >
                                <div className="text-brand text-2xl"><FaTruck /></div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">{tUZ("Naqd pulda")}</h4>
                                    <p className="text-[10px] text-gray-500">{tUZ("Mahsulotni qo'lga olganda")}</p>
                                </div>
                            </div>

                            <div 
                                onClick={() => setPaymentMethod('bank')}
                                className={`border-2 rounded-xl p-5 cursor-pointer hover:border-brand transition-all flex items-center space-x-4 ${
                                    paymentMethod === 'bank' ? 'border-brand bg-green-50/40' : 'border-gray-150'
                                }`}
                            >
                                <div className="text-brand text-2xl"><FaCheckCircle /></div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">{tUZ("Bank o'tkazmasi")}</h4>
                                    <p className="text-[10px] text-gray-500">{tUZ("Yuridik shaxslar uchun shartnoma")}</p>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary details */}
                        <div className="mt-8 bg-gray-50 rounded-xl p-5 border border-gray-100">
                            <h3 className="font-bold text-gray-900 text-base mb-3">{tUZ("Buyurtma yakuni")}</h3>
                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span>{tUZ("Mahsulotlar summasi:")}</span>
                                    <span>{totalAmount.toLocaleString()} UZS</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>{tUZ("Yetkazib berish haqi")} ({deliveryType === 'express' ? tUZ('Tezkor') : tUZ('Oddiy')}):</span>
                                    <span>{deliveryFee.toLocaleString()} UZS</span>
                                </div>
                                <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-2 text-base">
                                    <span>{tUZ("Jami to'lov:")}</span>
                                    <span>{finalTotal.toLocaleString()} UZS</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 4: TRACKING & REALTIME GPS SIMULATOR */}
                {step === 4 && (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="text-center">
                            <h2 className="text-2xl font-extrabold text-brand flex items-center justify-center gap-2">
                                <FaCheckCircle />
                                {tUZ("Rahmat, Buyurtmangiz Qabul Qilindi!")}
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">
                                {tUZ("Quyida kuryerning real vaqtdagi harakatini kuzatishingiz mumkin.")}
                            </p>
                        </div>

                        {/* Animated Map Tracking Viewport */}
                        <div className="bg-emerald-50 rounded-2xl p-4 md:p-6 border border-emerald-100 shadow-inner relative overflow-hidden h-[300px] flex flex-col justify-between">
                            {/* SVG Simulated Map Layout */}
                            <svg className="absolute inset-0 w-full h-full text-emerald-100/40" viewBox="0 0 100 100" preserveAspectRatio="none">
                                {/* Simulated roads */}
                                <line x1="10" y1="50" x2="90" y2="50" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
                                <line x1="30" y1="10" x2="30" y2="90" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
                                <line x1="70" y1="10" x2="70" y2="90" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
                                <circle cx="30" cy="50" r="3" fill="#94A3B8" />
                                <circle cx="70" cy="50" r="3" fill="#94A3B8" />
                            </svg>

                            {/* Delivery start point */}
                            <div className="absolute left-[8%] top-[40%] z-10 flex flex-col items-center">
                                <div className="bg-brand text-white p-1 rounded-full text-xs">🏠</div>
                                <span className="text-[9px] font-bold text-gray-600 bg-white/80 px-1 rounded shadow-sm">{tUZ("Ombor")}</span>
                            </div>

                            {/* Delivery destination point */}
                            <div className="absolute right-[8%] top-[40%] z-10 flex flex-col items-center">
                                <div className="bg-blue-600 text-white p-1 rounded-full text-xs">📍</div>
                                <span className="text-[9px] font-bold text-gray-600 bg-white/80 px-1 rounded shadow-sm">{tUZ("Sizning uyingiz")}</span>
                            </div>

                            {/* Moving Car Icon */}
                            <div 
                                className="absolute top-[44%] z-20 flex flex-col items-center transition-all duration-300 transform -translate-x-1/2"
                                style={{ left: `${10 + trackingProgress * 0.8}%` }}
                            >
                                <div className="bg-yellow-500 text-white p-2 rounded-full shadow-lg border border-white animate-bounce text-sm">
                                    🚗
                                </div>
                                <span className="text-[9px] font-extrabold text-gray-800 bg-white/90 px-1.5 py-0.5 rounded shadow-sm border border-yellow-300">
                                    {tUZ("Kuryer")} ({trackingProgress}%)
                                </span>
                            </div>

                            {/* Progress bar tracking status info at bottom of map */}
                            <div className="mt-auto bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-md border border-emerald-100 flex items-center justify-between gap-4 z-10">
                                <div className="flex items-center gap-3">
                                    <div className="bg-brand text-white rounded-full p-2 animate-pulse">
                                        <FaTruck size={14} />
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">{tUZ("Kuryer Holati")}</h4>
                                        <p className="text-sm font-extrabold text-gray-800">{tUZ(trackingStatus)}</p>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-xs font-semibold text-gray-500">{tUZ("Yetkazish vaqti:")}</p>
                                    <p className="text-sm font-extrabold text-brand">~25 daqiqa</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <button 
                                onClick={() => {
                                    clearCart();
                                    navigate('/');
                                }}
                                className="bg-brand hover:bg-brand-dark text-white font-bold py-2.5 px-8 rounded-xl transition-all shadow"
                            >
                                {tUZ("Bosh sahifaga qaytish")}
                            </button>
                        </div>
                    </div>
                )}

                {/* Footer Buttons */}
                {step < 4 && (
                    <div className="flex justify-between items-center border-t border-gray-100 pt-6 mt-8">
                        <button
                            onClick={prevStep}
                            disabled={step === 1}
                            className={`px-5 py-2.5 rounded-lg border font-semibold text-sm transition-colors ${
                                step === 1 
                                    ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            {tUZ("Orqaga")}
                        </button>

                        {step < 3 ? (
                            <button
                                onClick={nextStep}
                                className="bg-brand hover:bg-brand-dark text-white font-bold py-2.5 px-6 rounded-lg text-sm shadow transition-all"
                            >
                                {tUZ("Davom etish")}
                            </button>
                        ) : (
                            <button
                                onClick={handleOrderSubmit}
                                disabled={isSubmitting || !shippingData.fullName || !shippingData.phone || !shippingData.address}
                                className={`font-bold py-2.5 px-8 rounded-lg text-sm shadow transition-all flex items-center gap-2 ${
                                    (!shippingData.fullName || !shippingData.phone || !shippingData.address)
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-brand hover:bg-brand-dark text-white'
                                }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <FaSpinner className="animate-spin" />
                                        {tUZ("Rasmiylashtirilmoqda...")}
                                    </>
                                ) : (
                                    tUZ('Buyurtma berish')
                                )}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckoutScreen;
