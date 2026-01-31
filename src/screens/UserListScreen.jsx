import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheck, FaTimes, FaTrash, FaUserTag } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Loader from '../components/Loader';
import AuthContext from '../context/AuthContext';
import AdminLayout from '../components/AdminLayout';

const UserListScreen = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user && user.isAdmin) {
            fetchUsers();
        } else {
            navigate('/login');
        }
    }, [user, navigate]);

    const fetchUsers = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get('/api/auth', config);
            setUsers(data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setLoading(false);
            toast.error('Failed to load users');
        }
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                await axios.delete(`/api/auth/${id}`, config);
                toast.success('User deleted');
                fetchUsers();
            } catch (err) {
                toast.error(err.response?.data?.message || err.message);
            }
        }
    };

    const toggleFarmerHandler = async (id, currentStatus) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.put(`/api/auth/${id}`, { isFarmer: !currentStatus }, config);
            toast.success(`User is ${!currentStatus ? 'now' : 'no longer'} a Farmer`);
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        }
    };

    return (
        <AdminLayout>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Users</h1>
            {loading ? (
                <Loader />
            ) : error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
            ) : (
                <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Admin
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Farmer
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u._id} className="bg-white hover:bg-gray-50">
                                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{u._id.substring(0, 10)}...</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap font-semibold">{u.name}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                        <a href={`mailto:${u.email}`} className="text-blue-500 hover:text-blue-700">{u.email}</a>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                        {u.isAdmin ? (
                                            <FaCheck className="text-green-500" />
                                        ) : (
                                            <FaTimes className="text-red-500" />
                                        )}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                        {u.isFarmer ? (
                                            <FaCheck className="text-green-500" />
                                        ) : (
                                            <FaTimes className="text-red-500" />
                                        )}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 text-sm flex space-x-2">
                                        <button
                                            onClick={() => toggleFarmerHandler(u._id, u.isFarmer)}
                                            className="text-white bg-yellow-500 hover:bg-yellow-600 p-2 rounded transition-colors"
                                            title="Toggle Farmer Status"
                                        >
                                            <FaUserTag />
                                        </button>
                                        <button
                                            onClick={() => deleteHandler(u._id)}
                                            className="text-white bg-red-500 hover:bg-red-600 p-2 rounded transition-colors"
                                            title="Delete User"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </AdminLayout>
    );
};

export default UserListScreen;
