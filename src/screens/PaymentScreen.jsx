import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';
import { tUZ } from '../utils/translateHelper';
import { useTranslation } from 'react-i18next';

const PaymentScreen = () => {
    useTranslation();
    const navigate = useNavigate();
    const { shippingAddress, savePaymentMethod } = useContext(CartContext);

    if (!shippingAddress.address) {
        navigate('/shipping');
    }

    const [paymentMethod, setPaymentMethod] = useState('PayPal');

    const submitHandler = (e) => {
        e.preventDefault();
        savePaymentMethod(paymentMethod);
        navigate('/placeorder');
    };

    return (
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">{tUZ("To'lov usuli")}</h1>

                <form onSubmit={submitHandler}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">{tUZ("Usulni tanlang")}</label>
                        <div className="mt-2">
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    className="form-radio text-green-600 h-5 w-5"
                                    name="paymentMethod"
                                    value="PayPal"
                                    checked={paymentMethod === 'PayPal'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <span className="ml-2 text-gray-700">{tUZ("PayPal yoki kredit karta")}</span>
                            </label>
                        </div>
                        <div className="mt-2">
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    className="form-radio text-green-600 h-5 w-5"
                                    name="paymentMethod"
                                    value="Stripe"
                                    checked={paymentMethod === 'Stripe'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <span className="ml-2 text-gray-700">{tUZ("Stripe")}</span>
                            </label>
                        </div>
                        <div className="mt-2">
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    className="form-radio text-green-600 h-5 w-5"
                                    name="paymentMethod"
                                    value="CashOnDelivery"
                                    checked={paymentMethod === 'CashOnDelivery'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <span className="ml-2 text-gray-700">{tUZ("Yetkazib berilganda to'lash (Naqd pul)")}</span>
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 shadow-md"
                    >
                        {tUZ("Davom etish")}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PaymentScreen;
