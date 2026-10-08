import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaBell } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import { tUZ } from '../utils/translateHelper';

const NotificationBell = () => {
    const { user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const boxRef = useRef(null);

    const fetchNotifications = async () => {
        try {
            const { data } = await axios.get('/api/notifications', {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setNotifications(data);
        } catch (error) {
            // Silent — a failed notification fetch shouldn't disrupt the page
        }
    };

    useEffect(() => {
        if (!user) return;
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!user) return null;

    const unreadCount = notifications.filter((n) => !n.read).length;

    const handleClick = async (n) => {
        if (!n.read) {
            try {
                await axios.patch(`/api/notifications/${n._id}`, {}, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setNotifications((prev) => prev.map((x) => (x._id === n._id ? { ...x, read: true } : x)));
            } catch (error) {
                // Ignore — not worth blocking navigation over
            }
        }
        setOpen(false);
        if (n.href) navigate(n.href);
    };

    return (
        <div className="relative" ref={boxRef}>
            <button onClick={() => setOpen(!open)} className="relative text-gray-700 hover:text-brand transition-colors p-2">
                <FaBell className="text-lg" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-50 max-h-96 overflow-y-auto">
                    <div className="px-4 py-2.5 border-b border-gray-50">
                        <p className="text-xs font-bold text-gray-700">{tUZ("Bildirishnomalar")}</p>
                    </div>
                    {notifications.length === 0 ? (
                        <p className="px-4 py-6 text-center text-xs text-gray-400">{tUZ("Hozircha bildirishnoma yo'q")}</p>
                    ) : (
                        notifications.map((n) => (
                            <button
                                key={n._id}
                                onClick={() => handleClick(n)}
                                className={`w-full text-left px-4 py-2.5 text-xs border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                                    n.read ? 'text-gray-500' : 'text-gray-900 font-semibold'
                                }`}
                            >
                                {!n.read && <span className="inline-block w-1.5 h-1.5 bg-brand rounded-full mr-1.5" />}
                                {n.title}
                                <div className="text-[10px] text-gray-400 mt-0.5">
                                    {new Date(n.createdAt).toLocaleString()}
                                </div>
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
