import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    FaTimes, 
    FaCheck, 
    FaEye, 
    FaSearch, 
    FaShoppingCart, 
    FaHourglassHalf, 
    FaTruck, 
    FaCheckCircle, 
    FaMoneyBillWave,
    FaUser
} from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Loader from '../components/Loader';
import AuthContext from '../context/AuthContext';
import AdminLayout from '../components/AdminLayout';
import { tUZ } from '../utils/translateHelper';
import { useTranslation } from 'react-i18next';

const OrderListScreen = () => {
    useTranslation();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Filters & Search
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');

    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user && user.isAdmin) {
            fetchOrders();
        } else {
            navigate('/login');
        }
    }, [user, navigate]);

    const fetchOrders = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get('/api/orders', config);
            const sortedOrders = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(sortedOrders);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setLoading(false);
            toast.error(tUZ('Buyurtmalarni yuklab bo\'lmadi'));
        }
    };

    // Helper counts
    const countAll = orders.length;
    const countPendingPayment = orders.filter(o => !o.isPaid).length;
    const countPendingDelivery = orders.filter(o => !o.isDelivered).length;
    const countDelivered = orders.filter(o => o.isDelivered).length;
    const countCompleted = orders.filter(o => o.isPaid && o.isDelivered).length;
    
    const totalRevenue = orders
        .filter(o => o.isPaid)
        .reduce((sum, o) => sum + Number(o.totalPrice || 0), 0);

    // Filtered orders list
    const filteredOrders = orders.filter(order => {
        // 1. Tab filter
        if (activeFilter === 'pending_payment' && order.isPaid) return false;
        if (activeFilter === 'pending_delivery' && order.isDelivered) return false;
        if (activeFilter === 'delivered' && !order.isDelivered) return false;
        if (activeFilter === 'completed' && !(order.isPaid && order.isDelivered)) return false;

        // 2. Search filter (by Order ID or Customer Name)
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            const orderId = order._id.toLowerCase();
            const customerName = order.user?.name?.toLowerCase() || '';
            const status = (order.isPaid ? 'paid to\'langan' : 'pending unpaid kutilmoqda').toLowerCase();
            return orderId.includes(term) || customerName.includes(term) || status.includes(term);
        }

        return true;
    });

    return (
        <AdminLayout>
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">{tUZ("Buyurtmalar paneli")}</h1>
                    <p className="text-gray-500 text-sm mt-1">{tUZ("Hamma buyurtmalarni filtrlash va boshqarish tizimi.")}</p>
                </div>
            </div>

            {loading ? (
                <Loader />
            ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-sm">{error}</div>
            ) : (
                <div className="space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {/* Total Revenue */}
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
                            <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-full flex-shrink-0">
                                <FaMoneyBillWave size={22} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <span className="text-gray-400 text-xs font-semibold block uppercase tracking-wider">{tUZ("Tushum")}</span>
                                <h3 className="text-base font-bold text-gray-900 truncate mt-1">
                                    {totalRevenue.toLocaleString()} UZS
                                </h3>
                            </div>
                        </div>

                        {/* All Orders */}
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 transition-all hover:shadow-md cursor-pointer" onClick={() => setActiveFilter('all')}>
                            <div className="p-3.5 bg-blue-50 text-blue-600 rounded-full flex-shrink-0">
                                <FaShoppingCart size={22} />
                            </div>
                            <div>
                                <span className="text-gray-400 text-xs font-semibold block uppercase tracking-wider">{tUZ("Barchasi")}</span>
                                <h3 className="text-xl font-bold text-gray-900 mt-1">{countAll}</h3>
                            </div>
                        </div>

                        {/* Pending Payment */}
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 transition-all hover:shadow-md cursor-pointer" onClick={() => setActiveFilter('pending_payment')}>
                            <div className="p-3.5 bg-amber-50 text-amber-600 rounded-full flex-shrink-0">
                                <FaHourglassHalf size={22} />
                            </div>
                            <div>
                                <span className="text-gray-400 text-xs font-semibold block uppercase tracking-wider">{tUZ("To'lov kutilayotgan")}</span>
                                <h3 className="text-xl font-bold text-gray-900 mt-1">{countPendingPayment}</h3>
                            </div>
                        </div>

                        {/* Pending Delivery */}
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 transition-all hover:shadow-md cursor-pointer" onClick={() => setActiveFilter('pending_delivery')}>
                            <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-full flex-shrink-0">
                                <FaTruck size={22} />
                            </div>
                            <div>
                                <span className="text-gray-400 text-xs font-semibold block uppercase tracking-wider">{tUZ("Yetkazish kutilayotgan")}</span>
                                <h3 className="text-xl font-bold text-gray-900 mt-1">{countPendingDelivery}</h3>
                            </div>
                        </div>

                        {/* Completed */}
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 transition-all hover:shadow-md cursor-pointer" onClick={() => setActiveFilter('completed')}>
                            <div className="p-3.5 bg-green-50 text-green-600 rounded-full flex-shrink-0">
                                <FaCheckCircle size={22} />
                            </div>
                            <div>
                                <span className="text-gray-400 text-xs font-semibold block uppercase tracking-wider">{tUZ("Tugallangan")}</span>
                                <h3 className="text-xl font-bold text-gray-900 mt-1">{countCompleted}</h3>
                            </div>
                        </div>
                    </div>

                    {/* Filters & Search Action Row */}
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Tab buttons */}
                        <div className="flex flex-wrap items-center gap-2">
                            {/* All */}
                            <button 
                                onClick={() => setActiveFilter('all')}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeFilter === 'all' ? 'bg-brand text-white shadow-sm' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                            >
                                {tUZ("Barchasi")}
                                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeFilter === 'all' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-800'}`}>{countAll}</span>
                            </button>

                            {/* Pending Payment */}
                            <button 
                                onClick={() => setActiveFilter('pending_payment')}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeFilter === 'pending_payment' ? 'bg-brand text-white shadow-sm' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                            >
                                {tUZ("To'lov kutilayotgan")}
                                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeFilter === 'pending_payment' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-800'}`}>{countPendingPayment}</span>
                            </button>

                            {/* Pending Delivery */}
                            <button 
                                onClick={() => setActiveFilter('pending_delivery')}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeFilter === 'pending_delivery' ? 'bg-brand text-white shadow-sm' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                            >
                                {tUZ("Yetkazish kutilayotgan")}
                                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeFilter === 'pending_delivery' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-800'}`}>{countPendingDelivery}</span>
                            </button>

                            {/* Delivered */}
                            <button 
                                onClick={() => setActiveFilter('delivered')}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeFilter === 'delivered' ? 'bg-brand text-white shadow-sm' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                            >
                                {tUZ("Yetkazilgan")}
                                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeFilter === 'delivered' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-800'}`}>{countDelivered}</span>
                            </button>

                            {/* Completed */}
                            <button 
                                onClick={() => setActiveFilter('completed')}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeFilter === 'completed' ? 'bg-brand text-white shadow-sm' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                            >
                                {tUZ("Tugallangan")}
                                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeFilter === 'completed' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-800'}`}>{countCompleted}</span>
                            </button>
                        </div>

                        {/* Search Input */}
                        <div className="relative w-full lg:w-72">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                                <FaSearch size={14} />
                            </span>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={tUZ("Qidiruv...")}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-brand focus:border-brand"
                            />
                        </div>
                    </div>

                    {/* Table View */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        {filteredOrders.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <FaShoppingCart size={40} className="mx-auto text-gray-200 mb-3 flex-shrink-0" />
                                <p className="font-semibold">{tUZ("Buyurtma topilmadi")}</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full leading-normal">
                                    <thead>
                                        <tr className="bg-gray-50/70 text-gray-500 text-left text-[11px] uppercase tracking-wider font-extrabold border-b border-gray-100">
                                            <th className="px-6 py-4">{tUZ("ID")}</th>
                                            <th className="px-6 py-4">{tUZ("Foydalanuvchi")}</th>
                                            <th className="px-6 py-4">{tUZ("Sana")}</th>
                                            <th className="px-6 py-4">{tUZ("Summa")}</th>
                                            <th className="px-6 py-4 text-center">{tUZ("To'lov holati")}</th>
                                            <th className="px-6 py-4 text-center">{tUZ("Yetkazib berish holati")}</th>
                                            <th className="px-6 py-4 text-center">{tUZ("Harakatlar")}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-sm">
                                        {filteredOrders.map((order) => (
                                            <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 font-mono text-gray-600 text-xs">
                                                    #{order._id.substring(0, 10)}...
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="bg-gray-100 text-gray-500 p-2 rounded-full hidden sm:block flex-shrink-0">
                                                            <FaUser size={12} />
                                                        </div>
                                                        <span className="font-bold text-gray-800">{order.user?.name || tUZ("Mavjud emas")}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {order.createdAt.substring(0, 10)}
                                                </td>
                                                <td className="px-6 py-4 font-extrabold text-gray-900">
                                                    {Number(order.totalPrice).toLocaleString()} UZS
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {order.isPaid ? (
                                                        <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-100">
                                                            <FaCheckCircle size={10} /> {tUZ("To'langan")} ({order.paidAt.substring(0, 10)})
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-bold px-3 py-1 rounded-full border border-amber-100">
                                                            <FaHourglassHalf size={10} /> {tUZ("Kutilmoqda")}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {order.isDelivered ? (
                                                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-100">
                                                            <FaCheckCircle size={10} /> {tUZ("Yetkazilgan")} ({order.deliveredAt.substring(0, 10)})
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-100">
                                                            <FaTruck size={10} /> {tUZ("Kutilmoqda")}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <Link 
                                                        to={`/order/${order._id}`} 
                                                        className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-brand hover:text-white text-gray-800 text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                                                    >
                                                        <FaEye size={12} /> {tUZ("Ko'rish")}
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default OrderListScreen;
