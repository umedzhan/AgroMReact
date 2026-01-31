import React, { useEffect, useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import Loader from '../components/Loader';

const PlaceOrderScreen = () => {
    const navigate = useNavigate();
    const { cartItems, shippingAddress, paymentMethod, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);

    const [loading, setLoading] = useState(false);

    // Calculate prices
    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2);
    };

    const itemsPrice = addDecimals(
        cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
    const shippingPrice = addDecimals(itemsPrice > 100 ? 0 : 10); // Free shipping over $100
    const taxPrice = addDecimals(Number((0.15 * itemsPrice).toFixed(2)));
    const totalPrice = (
        Number(itemsPrice) +
        Number(shippingPrice) +
        Number(taxPrice)
    ).toFixed(2);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else if (cartItems.length === 0) {
            navigate('/cart');
        } else if (!shippingAddress.address) {
            navigate('/shipping');
        } else if (!paymentMethod) {
            navigate('/payment');
        }
    }, [user, cartItems, shippingAddress, paymentMethod, navigate]);

    const placeOrderHandler = async () => {
        try {
            setLoading(true);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.post(
                '/api/orders',
                {
                    orderItems: cartItems.map((item) => ({
                        ...item,
                        product: item._id, // Key change: Backend expects 'product' for the ID
                    })),
                    shippingAddress,
                    paymentMethod,
                    itemsPrice,
                    shippingPrice,
                    taxPrice,
                    totalPrice,
                },
                config
            );

            clearCart();
            setLoading(false);
            toast.success('Order Placed Successfully');
            navigate(`/order/${data._id}`);
        } catch (error) {
            setLoading(false);
            toast.error(error.response?.data?.message || error.message);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Order Summary</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Order Details */}
                <div className="md:col-span-2 space-y-6">
                    {/* Shipping */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4 text-gray-700 border-b pb-2">Shipping</h2>
                        <p>
                            <strong>Address: </strong>
                            {shippingAddress.address}, {shippingAddress.city},{' '}
                            {shippingAddress.postalCode}, {shippingAddress.country}
                        </p>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4 text-gray-700 border-b pb-2">Payment Method</h2>
                        <p>
                            <strong>Method: </strong>
                            {paymentMethod}
                        </p>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4 text-gray-700 border-b pb-2">Order Items</h2>
                        {cartItems.length === 0 ? (
                            <p>Your cart is empty</p>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {cartItems.map((item, index) => (
                                    <div key={index} className="py-4 flex items-center justify-between">
                                        <div className="flex items-center">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-16 h-16 object-cover rounded mr-4"
                                            />
                                            <Link to={`/product/${item._id}`} className="text-green-600 hover:text-green-800 font-semibold">
                                                {item.name}
                                            </Link>
                                        </div>
                                        <div className="text-gray-600">
                                            {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Order Summary Card */}
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
                        <h2 className="text-xl font-bold mb-6 text-gray-700 border-b pb-2">Order Summary</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between text-gray-600">
                                <span>Items</span>
                                <span>${itemsPrice}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span>${shippingPrice}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Tax</span>
                                <span>${taxPrice}</span>
                            </div>
                            <div className="border-t pt-4 flex justify-between font-bold text-lg text-gray-800">
                                <span>Total</span>
                                <span>${totalPrice}</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="w-full bg-green-600 text-white font-bold py-3 mt-8 rounded hover:bg-green-700 transition-colors shadow-md disabled:bg-green-300"
                            disabled={cartItems === 0 || loading}
                            onClick={placeOrderHandler}
                        >
                            {loading ? 'Placing Order...' : 'Place Order'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrderScreen;
