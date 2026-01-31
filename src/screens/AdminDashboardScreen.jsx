import React from 'react';
import { FaMoneyBillWave, FaShoppingCart, FaUserPlus, FaBoxOpen } from 'react-icons/fa';
import AdminLayout from '../components/AdminLayout';

const AdminDashboardScreen = () => {
    // Mock data for now - could be fetched from a new /api/dashboard/stats endpoint later
    const stats = [
        { title: 'Total Sales', value: '$12,340', icon: <FaMoneyBillWave />, color: 'bg-green-100 text-green-600' },
        { title: 'Total Orders', value: '45', icon: <FaShoppingCart />, color: 'bg-blue-100 text-blue-600' },
        { title: 'Total Products', value: '8', icon: <FaBoxOpen />, color: 'bg-orange-100 text-orange-600' },
        { title: 'Total Users', value: '12', icon: <FaUserPlus />, color: 'bg-purple-100 text-purple-600' },
    ];

    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-500">Welcome back to your admin panel.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
                        <div className={`p-4 rounded-full ${stat.color} mr-4`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">{stat.title}</p>
                            <h3 className="text-xl font-bold text-gray-800">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                            <p className="text-gray-600">New order #9348</p>
                            <span className="text-sm text-gray-400">2 mins ago</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                            <p className="text-gray-600">User registered</p>
                            <span className="text-sm text-gray-400">1 hour ago</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                            <p className="text-gray-600">Product updated</p>
                            <span className="text-sm text-gray-400">3 hours ago</span>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <button className="w-full bg-brand text-white py-2 rounded hover:bg-brand-dark transition-colors">Add New Product</button>
                        <button className="w-full border border-gray-200 text-gray-700 py-2 rounded hover:bg-gray-50 transition-colors">View All Orders</button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboardScreen;
