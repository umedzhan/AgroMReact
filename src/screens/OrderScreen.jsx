import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { tUZ } from '../utils/translateHelper';

const OrderScreen = () => {
    const { id: orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    const updateLocalOrderCache = (updatedOrder) => {
        try {
            const localOrders = JSON.parse(localStorage.getItem('localOrders')) || [];
            const index = localOrders.findIndex(o => o._id === updatedOrder._id);
            if (index !== -1) {
                localOrders[index] = updatedOrder;
                localStorage.setItem('localOrders', JSON.stringify(localOrders));
            }
        } catch (err) {
            console.error('Failed to update local order cache', err);
        }
    };

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.get(`/api/orders/${orderId}`, config);
                setOrder(data);
                updateLocalOrderCache(data);
                setLoading(false);
            } catch (error) {
                toast.error(tUZ('Buyurtmalarni yuklab bo\'lmadi'));
                setLoading(false);
            }
        };

        if (user) {
            fetchOrder();
        }
    }, [orderId, user]);

    const payHandler = async () => {
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.put(`/api/orders/${order._id}/pay/admin`, {}, config);
            setLoading(false);
            toast.success(tUZ('Buyurtma to\'langan deb belgilandi'));

            // Reload order data
            const { data } = await axios.get(`/api/orders/${orderId}`, config);
            setOrder(data);
            updateLocalOrderCache(data);
        } catch (error) {
            setLoading(false);
            toast.error(error.response?.data?.message || error.message);
        }
    };

    const deliverHandler = async () => {
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.put(`/api/orders/${order._id}/deliver`, {}, config);
            setLoading(false);
            toast.success(tUZ('Buyurtma yetkazildi'));

            // Reload order data
            const { data } = await axios.get(`/api/orders/${orderId}`, config);
            setOrder(data);
            updateLocalOrderCache(data);
        } catch (error) {
            setLoading(false);
            toast.error(error.response?.data?.message || error.message);
        }
    };

    if (loading) return <div className="mt-10"><Loader /></div>;
    if (!order) return <div className="mt-10 text-center text-red-500">{tUZ("Buyurtma topilmadi")}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">{tUZ("Buyurtma")} {order._id}</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4 text-gray-700">{tUZ("Yetkazib berish")}</h2>
                        <p><strong>{tUZ("Ism")}: </strong> {order.user.name}</p>
                        <p><strong>{tUZ("Pochta: ")}</strong> <a href={`mailto:${order.user.email}`} className="text-green-600">{order.user.email}</a></p>
                        <p className="mt-2">
                            <strong>{tUZ("Manzil")}: </strong>
                            {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
                            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                        </p>
                        {order.isDelivered ? (
                            <div className="bg-green-100 text-green-700 p-3 rounded mt-4">{tUZ("Yetkazildi: ")}{order.deliveredAt}</div>
                        ) : (
                            <div className="bg-red-100 text-red-700 p-3 rounded mt-4">{tUZ("Yetkazilmagan")}</div>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4 text-gray-700">{tUZ("To'lov usuli")}</h2>
                        <p><strong>{tUZ("Usul: ")}</strong> {order.paymentMethod}</p>
                        {order.isPaid ? (
                            <div className="bg-green-100 text-green-700 p-3 rounded mt-4">{tUZ("To'landi: ")}{order.paidAt}</div>
                        ) : (
                            <div className="bg-red-100 text-red-700 p-3 rounded mt-4">{tUZ("To'lanmagan")}</div>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4 text-gray-700">{tUZ("Buyurtma mahsulotlari")}</h2>
                        <div className="divide-y divide-gray-200">
                            {order.orderItems.map((item, index) => (
                                <div key={index} className="py-4 flex items-center justify-between">
                                    <div className="flex items-center">
                                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded mr-4" />
                                        <Link to={`/product/${item._id}`} className="text-green-600 hover:text-green-800 font-semibold">
                                            {item.name}
                                        </Link>
                                    </div>
                                    <div className="text-gray-600">
                                        {item.qty} x {item.price} UZS = {(item.qty * item.price).toFixed(2)} UZS
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
                        <h2 className="text-xl font-bold mb-6 text-gray-700 border-b pb-2">{tUZ("Buyurtma hisobi")}</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between text-gray-600">
                                <span>{tUZ("Mahsulotlar")}</span>
                                <span>{order.itemsPrice ? order.itemsPrice.toFixed(2) : 0} UZS</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>{tUZ("Yetkazib berish")}</span>
                                <span>{order.shippingPrice ? order.shippingPrice.toFixed(2) : 0} UZS</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>{tUZ("Soliq")}</span>
                                <span>{order.taxPrice ? order.taxPrice.toFixed(2) : 0} UZS</span>
                            </div>
                            <div className="border-t pt-4 flex justify-between font-bold text-lg text-gray-800">
                                <span>{tUZ("Jami")}</span>
                                <span>{order.totalPrice ? order.totalPrice.toFixed(2) : 0} UZS</span>
                            </div>
                        </div>

                        {user && user.isAdmin && !order.isPaid && (
                            <button
                                type="button"
                                className="w-full bg-blue-600 text-white font-bold py-3 mt-8 rounded hover:bg-blue-700 transition-colors shadow-md"
                                onClick={payHandler}
                            >
                                {tUZ("To'langan deb belgilash")}
                            </button>
                        )}

                        {user && user.isAdmin && order.isPaid && !order.isDelivered && (
                            <button
                                type="button"
                                className="w-full bg-green-600 text-white font-bold py-3 mt-4 rounded hover:bg-green-700 transition-colors shadow-md"
                                onClick={deliverHandler}
                            >
                                {tUZ("Yetkazilgan deb belgilash")}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderScreen;
