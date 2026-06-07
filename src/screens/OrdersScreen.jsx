import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaDownload, FaTruck, FaClock, FaCheckCircle, FaTimesCircle, FaChartPie, FaCalendarAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Loader from '../components/Loader';
import { tUZ } from '../utils/translateHelper';
import { useTranslation } from 'react-i18next';

const OrdersScreen = () => {
    useTranslation();
    const { user } = useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            let fetchedOrders = [];
            
            // 1. Try to fetch orders from backend (Admin only)
            if (user && user.isAdmin) {
                try {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    };
                    const { data } = await axios.get('/api/orders', config);
                    
                    // Filter orders belonging to the logged-in user
                    const userOrders = data.filter(order => {
                        const orderUserId = order.user?._id || order.user;
                        return orderUserId === user._id;
                    });

                    fetchedOrders = userOrders.map(order => ({
                        id: order._id,
                        date: order.createdAt?.substring(0, 10) || new Date().toISOString().split('T')[0],
                        total: order.totalPrice,
                        status: order.isDelivered ? 'completed' : 'active',
                        deliveryStep: order.isDelivered ? 3 : order.isPaid ? 2 : 1,
                        items: order.orderItems?.map(item => `${item.name} (${item.qty} dona)`).join(', ') || 'Mahsulotlar',
                        payment: order.isPaid ? 'To\'langan' : 'To\'lov kutilmoqda'
                    }));
                } catch (err) {
                    console.log("Could not fetch backend orders, using local fallback");
                }
            }

            // 2. Load locally created orders from localStorage
            const localOrders = JSON.parse(localStorage.getItem('localOrders')) || [];
            let syncedLocalOrders = [...localOrders];

            if (user && localOrders.length > 0) {
                try {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    };
                    
                    const syncPromises = localOrders.map(async (order) => {
                        if (order._id && !order._id.startsWith('LOCAL-')) {
                            try {
                                const { data } = await axios.get(`/api/orders/${order._id}`, config);
                                return data;
                            } catch (err) {
                                console.log(`Could not sync status of order ${order._id} from backend:`, err);
                                return order;
                            }
                        }
                        return order;
                    });
                    
                    syncedLocalOrders = await Promise.all(syncPromises);
                    localStorage.setItem('localOrders', JSON.stringify(syncedLocalOrders));
                } catch (err) {
                    console.error("Error batch syncing local orders:", err);
                }
            }

            const localMapped = syncedLocalOrders.map(order => ({
                id: order._id || `LOCAL-${Math.floor(Math.random() * 100000)}`,
                date: order.createdAt?.substring(0, 10) || new Date().toISOString().split('T')[0],
                total: order.totalPrice,
                status: order.isDelivered ? 'completed' : 'active',
                deliveryStep: order.isDelivered ? 3 : order.isPaid ? 2 : 1,
                items: order.orderItems?.map(item => `${item.name} (${item.qty} dona)`).join(', ') || 'Mahsulotlar',
                payment: order.isPaid ? 'To\'langan' : 'To\'lov kutilmoqda'
            }));

            // Combine both sources
            const allOrders = [...fetchedOrders, ...localMapped];
            
            // Deduplicate orders by ID
            const uniqueOrders = [];
            const idsSeen = new Set();
            for (const o of allOrders) {
                if (!idsSeen.has(o.id)) {
                    idsSeen.add(o.id);
                    uniqueOrders.push(o);
                }
            }

            // Fallback default mock orders if list is totally empty
            if (uniqueOrders.length === 0) {
                uniqueOrders.push(
                    {
                        id: 'AGR-98741',
                        date: '2026-06-05',
                        total: 215000,
                        status: 'active',
                        deliveryStep: 2,
                        items: 'Bug\'doy (50 kg), Organik Kartoshka (10 kg)',
                        payment: 'Click orqali to\'langan'
                    },
                    {
                        id: 'AGR-98412',
                        date: '2026-05-28',
                        total: 340000,
                        status: 'completed',
                        deliveryStep: 3,
                        items: 'Qizil Pomidor (20 kg), Shirin Piyoz (15 kg)',
                        payment: 'Karta orqali to\'langan'
                    }
                );
            }

            setOrders(uniqueOrders);
            setLoading(false);
        };

        fetchOrders();
    }, [user]);

    const handleExport = () => {
        toast.success(tUZ("Excel formatida yuklab olish boshlandi..."));
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              order.items.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = activeTab === 'all' ? true : order.status === activeTab;
        return matchesSearch && matchesTab;
    });

    const activeOrdersCount = orders.filter(o => o.status === 'active').length;
    const completedOrdersCount = orders.filter(o => o.status === 'completed').length;
    const totalExpenses = orders
        .filter(o => o.status === 'completed' || o.status === 'active')
        .reduce((sum, o) => sum + o.total, 0);

    if (loading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8 animate-fadeIn">
            {/* Page Title & Export button */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">{tUZ("Buyurtmalarim")}</h1>
                    <p className="text-gray-500 text-sm">{tUZ("Buyurtmalaringizning umumiy tahlili va kuryerlik holati.")}</p>
                </div>
                <button 
                    onClick={handleExport}
                    className="bg-brand hover:bg-brand-dark text-white font-bold py-2.5 px-5 rounded-xl transition-all shadow-sm flex items-center gap-2 text-sm"
                >
                    <FaDownload size={14} /> {tUZ("Eksport (Excel)")}
                </button>
            </div>

            {/* Dashboard Analytics Panel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm flex items-center gap-4">
                    <div className="bg-green-50 text-brand p-4 rounded-full">
                        <FaChartPie size={24} />
                    </div>
                    <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{tUZ("Jami Xarajatlar")}</span>
                        <h3 className="text-xl md:text-2xl font-black text-gray-950 mt-1">{totalExpenses.toLocaleString()} UZS</h3>
                    </div>
                </div>

                <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm flex items-center gap-4">
                    <div className="bg-blue-50 text-blue-600 p-4 rounded-full">
                        <FaClock size={24} />
                    </div>
                    <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{tUZ("Faol Buyurtmalar")}</span>
                        <h3 className="text-xl md:text-2xl font-black text-gray-950 mt-1">{activeOrdersCount} {tUZ("ta buyurtma")}</h3>
                    </div>
                </div>

                <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm flex items-center gap-4">
                    <div className="bg-emerald-50 text-emerald-600 p-4 rounded-full">
                        <FaCheckCircle size={24} />
                    </div>
                    <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{tUZ("Yakunlanganlar")}</span>
                        <h3 className="text-xl md:text-2xl font-black text-gray-950 mt-1">{completedOrdersCount} {tUZ("ta buyurtma")}</h3>
                    </div>
                </div>
            </div>

            {/* Filtering and Search Controls */}
            <div className="bg-white border border-gray-150 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Tabs */}
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
                    {[
                        { key: 'all', label: tUZ('Hammasi') },
                        { key: 'active', label: tUZ('Faol') },
                        { key: 'completed', label: tUZ('Yakunlangan') },
                        { key: 'cancelled', label: tUZ('Bekor qilingan') }
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`py-2 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                                activeTab === tab.key 
                                    ? 'bg-brand text-white shadow-sm' 
                                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Search field */}
                <div className="relative w-full md:w-72">
                    <input 
                        type="text" 
                        placeholder={tUZ("ID yoki mahsulot bo'yicha...")}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-brand text-sm bg-gray-50/50"
                    />
                    <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                </div>
            </div>

            {/* Orders list */}
            <div className="space-y-6">
                {filteredOrders.length === 0 ? (
                    <div className="bg-gray-50 text-center py-12 rounded-2xl border border-dashed border-gray-200">
                        <p className="text-gray-500 text-sm font-semibold">{tUZ("Mos keladigan buyurtmalar topilmadi.")}</p>
                    </div>
                ) : (
                    filteredOrders.map((order) => (
                        <div key={order.id} className="bg-white border border-gray-150 rounded-2xl shadow-sm overflow-hidden p-5 space-y-6 hover:shadow-md transition-shadow">
                            
                            {/* Order general header */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-4 gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-extrabold text-gray-900 text-base">{order.id}</h4>
                                        <span className={`text-[10px] font-bold py-0.5 px-2 rounded-full uppercase ${
                                            order.status === 'active' 
                                                ? 'bg-blue-50 text-blue-600' 
                                                : order.status === 'completed'
                                                ? 'bg-green-50 text-brand'
                                                : 'bg-red-50 text-red-500'
                                        }`}>
                                            {order.status === 'active' ? tUZ('Yetkazilmoqda') : order.status === 'completed' ? tUZ('Yetkazildi') : tUZ('Bekor qilingan')}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400 flex items-center gap-1.5">
                                        <FaCalendarAlt size={10} /> {order.date}
                                    </p>
                                </div>
                                <div className="text-left md:text-right">
                                    <p className="text-xs text-gray-400">{tUZ("Umumiy summa:")}</p>
                                    <p className="text-lg font-black text-gray-900">{order.total.toLocaleString()} UZS</p>
                                </div>
                            </div>

                            {/* Details and delivery progress */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">{tUZ("Mahsulotlar tarkibi")}</p>
                                        <p className="text-sm font-semibold text-gray-800 mt-1">{order.items.split(', ').map(item => {
                                            if (item.includes(' dona')) {
                                                const parts = item.split(' (');
                                                const name = parts[0];
                                                const qtyDona = parts[1].replace(')', '');
                                                const qty = qtyDona.split(' ')[0];
                                                return `${tUZ(name)} (${qty} ${tUZ('dona')})`;
                                            }
                                            return tUZ(item);
                                        }).join(', ')}</p>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">{tUZ("To'lov statusi")}</p>
                                            <p className="text-xs font-semibold text-gray-600 mt-1">{tUZ(order.payment)}</p>
                                        </div>
                                        {!order.id.startsWith('LOCAL-') && (
                                            <Link 
                                                to={`/order/${order.id}`}
                                                className="text-xs text-brand hover:underline font-bold"
                                            >
                                                {tUZ("Batafsil ma'lumot →")}
                                            </Link>
                                        )}
                                    </div>
                                </div>

                                {/* Parcel Status Progress Bar (Timeline tracker) */}
                                {order.status !== 'cancelled' && (
                                    <div className="space-y-3">
                                        <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">{tUZ("Kuryerlik Bosqichi")}</p>
                                        <div className="flex items-center justify-between relative mt-2">
                                            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
                                            <div 
                                                className="absolute top-1/2 left-0 h-1 bg-brand -translate-y-1/2 z-0 transition-all duration-500"
                                                style={{ width: `${order.deliveryStep === 3 ? 100 : order.deliveryStep === 2 ? 50 : 0}%` }}
                                            ></div>

                                            {[
                                                { step: 1, label: tUZ('Tayyorlandi') },
                                                { step: 2, label: tUZ('Yo\'lda (Kuryer)') },
                                                { step: 3, label: tUZ('Yetkazildi') }
                                            ].map((s) => (
                                                <div key={s.step} className="relative z-10 flex flex-col items-center">
                                                    <div className={`h-6 w-6 rounded-full flex items-center justify-center border-2 text-[10px] font-bold ${
                                                        order.deliveryStep >= s.step 
                                                            ? 'bg-brand border-brand text-white' 
                                                            : 'bg-white border-gray-300 text-gray-400'
                                                    }`}>
                                                        {order.deliveryStep >= s.step ? '✓' : s.step}
                                                    </div>
                                                    <span className={`text-[9px] font-bold mt-1.5 ${
                                                        order.deliveryStep >= s.step ? 'text-brand' : 'text-gray-400'
                                                    }`}>{s.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default OrdersScreen;
