import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaBox, FaUsers, FaClipboardList } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import { tUZ } from '../utils/translateHelper';
import { useTranslation } from 'react-i18next';

const AdminSidebar = () => {
    useTranslation();
    const location = useLocation();
    const { user } = useContext(AuthContext);

    const isActive = (path) => {
        return location.pathname.includes(path) ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100';
    };

    return (
        <div className="w-64 bg-white shadow-md rounded-lg hidden md:block h-full min-h-[500px]">
            <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">
                    {user && user.isAdmin
                        ? tUZ('Admin menyusi')
                        : user && user.isFarmer
                            ? tUZ('Dehqon menyusi')
                            : tUZ('Mening mahsulotlarim')}
                </h2>
            </div>
            <nav className="p-4 space-y-2">
                {user && (user.isAdmin || user.isFarmer) && (
                    <Link to="/admin/dashboard" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/dashboard')}`}>
                        <FaTachometerAlt />
                        <span className="font-medium">{tUZ("Boshqaruv paneli")}</span>
                    </Link>
                )}
                <Link to="/admin/productlist" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/productlist')}`}>
                    <FaBox />
                    <span className="font-medium">{tUZ("Mahsulotlar")}</span>
                </Link>

                {/* Only show Users and Orders to actual Admins */}
                {user && user.isAdmin && (
                    <>
                        <Link to="/admin/orderlist" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/orderlist')}`}>
                            <FaClipboardList />
                            <span className="font-medium">{tUZ("Buyurtmalar")}</span>
                        </Link>
                        <Link to="/admin/userlist" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/userlist')}`}>
                            <FaUsers />
                            <span className="font-medium">{tUZ("Foydalanuvchilar")}</span>
                        </Link>
                    </>
                )}
            </nav>
        </div>
    );
};

export default AdminSidebar;
