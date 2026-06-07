import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';
import { tUZ } from '../utils/translateHelper';
import { useTranslation } from 'react-i18next';

const ShippingScreen = () => {
    useTranslation();
    const { shippingAddress, saveShippingAddress } = useContext(CartContext);

    const [address, setAddress] = useState(shippingAddress.address || '');
    const [city, setCity] = useState(shippingAddress.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
    const [country, setCountry] = useState(shippingAddress.country || '');

    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        saveShippingAddress({ address, city, postalCode, country });
        navigate('/payment');
    };

    return (
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">{tUZ("Yetkazib berish")}</h1>

                <form onSubmit={submitHandler}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                            {tUZ("Manzil")}
                        </label>
                        <input
                            type="text"
                            id="address"
                            placeholder={tUZ("Manzilni kiriting")}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
                            {tUZ("Shahar")}
                        </label>
                        <input
                            type="text"
                            id="city"
                            placeholder={tUZ("Shaharni kiriting")}
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="postalCode">
                            {tUZ("Pochta indeksi")}
                        </label>
                        <input
                            type="text"
                            id="postalCode"
                            placeholder={tUZ("Pochta indeksini kiriting")}
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="country">
                            {tUZ("Mamlakat")}
                        </label>
                        <input
                            type="text"
                            id="country"
                            placeholder={tUZ("Mamlakatni kiriting")}
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
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

export default ShippingScreen;
