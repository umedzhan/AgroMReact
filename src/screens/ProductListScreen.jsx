import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';
import AuthContext from '../context/AuthContext';
import AdminLayout from '../components/AdminLayout';
import { tUZ } from '../utils/translateHelper';
import { useTranslation } from 'react-i18next';

const ProductListScreen = () => {
    useTranslation();
    const { pageNumber } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (!user || (!user.isAdmin && !user.isFarmer)) {
            navigate('/login');
        } else {
            fetchProducts();
        }
    }, [user, navigate, pageNumber]);

    const fetchProducts = async () => {
        try {
            let url = `/api/products?pageNumber=${pageNumber || 1}`;
            // If user is a Farmer (and NOT Admin), only fetch their own products
            if (user.isFarmer && !user.isAdmin) {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                url = `/api/products?pageNumber=${pageNumber || 1}&myproducts=true`;
                const { data } = await axios.get(url, config);
                setProducts(data.products);
                setPage(data.page);
                setPages(data.pages);
            } else {
                // Admin sees all
                const { data } = await axios.get(url);
                setProducts(data.products);
                setPage(data.page);
                setPages(data.pages);
            }

            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setLoading(false);
            toast.error(tUZ('Mahsulotlarni yuklab bo\'lmadi'));
        }
    };

    const deleteHandler = async (id) => {
        if (window.confirm(tUZ('Ushbu mahsulotni o\'chirishni xohlaysizmi?'))) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                await axios.delete(`/api/products/${id}`, config);
                toast.success(tUZ('Mahsulot muvaffaqiyatli o\'chirildi'));
                fetchProducts();
            } catch (err) {
                toast.error(err.response?.data?.message || err.message);
            }
        }
    };

    const createProductHandler = () => {
        navigate('/admin/product/create');
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">{tUZ("Mahsulotlar")}</h1>
                <button
                    onClick={createProductHandler}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
                >
                    <FaPlus className="mr-2" /> {tUZ("Mahsulot yaratish")}
                </button>
            </div>

            {loading ? (
                <Loader />
            ) : error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
            ) : (
                <>
                    <div className="overflow-x-auto shadow-md rounded-lg">
                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        {tUZ("ID")}
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        {tUZ("Nomi")}
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        {tUZ("Narxi")}
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        {tUZ("Kategoriya")}
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        {tUZ("Brend")}
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        {tUZ("Harakatlar")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product._id} className="bg-white hover:bg-gray-50">
                                        <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap">{product._id.substring(0, 10)}...</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap font-semibold">{product.name}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap">{product.price} UZS</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap">{tUZ(product.category)}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap">{product.brand}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 text-sm flex space-x-2">
                                            <Link
                                                to={`/admin/product/${product._id}/edit`}
                                                className="text-white bg-blue-500 hover:bg-blue-600 p-2 rounded transition-colors"
                                            >
                                                <FaEdit />
                                            </Link>
                                            <button
                                                onClick={() => deleteHandler(product._id)}
                                                className="text-white bg-red-500 hover:bg-red-600 p-2 rounded transition-colors"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Paginate pages={pages} page={page} isAdmin={true} />
                </>
            )}
        </AdminLayout>
    );
};

export default ProductListScreen;
