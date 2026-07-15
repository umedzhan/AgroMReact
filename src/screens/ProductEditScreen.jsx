import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Loader from '../components/Loader';
import AuthContext from '../context/AuthContext';
import { tUZ } from '../utils/translateHelper';
import { useTranslation } from 'react-i18next';

const ProductEditScreen = () => {
    useTranslation();
    const { id: productId } = useParams();
    const isEditMode = productId !== undefined; // If ID exists, we are editing

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [uploading, setUploading] = useState(false);

    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (!user || !user.isAdmin) {
            navigate('/login');
            return;
        }

        if (isEditMode) {
            const fetchProduct = async () => {
                try {
                    setLoading(true);
                    const { data } = await axios.get(`/api/products/${productId}`);
                    setName(data.name);
                    setPrice(data.price);
                    setImage(data.image);
                    setBrand(data.brand);
                    setCategory(data.category);
                    setCountInStock(data.countInStock);
                    setDescription(data.description);
                    setLoading(false);
                } catch (error) {
                    setLoading(false);
                    toast.error(tUZ('Mahsulot tafsilotlarini yuklab bo\'lmadi'));
                }
            };
            fetchProduct();
        }
    }, [user, navigate, productId, isEditMode]);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post('/api/upload', formData, config);
            setImage(data.path);
            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploading(false);
            toast.error(tUZ('Rasm yuklash bajarilmadi'));
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoadingUpdate(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            if (isEditMode) {
                await axios.put(
                    `/api/products/${productId}`,
                    {
                        name,
                        price,
                        image,
                        brand,
                        category,
                        description,
                        countInStock,
                    },
                    config
                );
                toast.success(tUZ('Mahsulot muvaffaqiyatli yangilandi'));
            } else {
                await axios.post(
                    '/api/products',
                    {
                        name,
                        price,
                        image,
                        brand,
                        category,
                        description,
                        countInStock,
                    },
                    config
                );
                toast.success(tUZ('Mahsulot muvaffaqiyatli yaratildi'));
            }
            setLoadingUpdate(false);
            navigate('/admin/productlist');
        } catch (error) {
            setLoadingUpdate(false);
            const message = error.response?.data?.message || error.message;
            toast.error(message);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10">
            <Link to="/admin/productlist" className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 mb-6 inline-block">
                {tUZ("Orqaga")}
            </Link>

            <div className="bg-white shadow-md rounded-lg p-8">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">
                    {isEditMode ? tUZ('Mahsulotni tahrirlash') : tUZ('Mahsulot yaratish')}
                </h1>

                {loading ? (
                    <Loader />
                ) : (
                    <form onSubmit={submitHandler}>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">{tUZ("Nomi")}</label>
                            <input
                                type="text"
                                placeholder={tUZ("Nomini kiriting")}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">{tUZ("Narxi")}</label>
                            <input
                                type="number"
                                placeholder={tUZ("Narxini kiriting")}
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">{tUZ("Rasm")}</label>
                            <input
                                type="text"
                                placeholder={tUZ("Rasm URL manzilini kiriting")}
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 outline-none mb-2"
                            />
                            <input
                                type="file"
                                id="image-file"
                                onChange={uploadFileHandler}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                            />
                            {uploading && <div className="text-sm text-gray-500 mt-1">{tUZ("Yuklanmoqda...")}</div>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">{tUZ("Brend")}</label>
                            <input
                                type="text"
                                placeholder={tUZ("Brendni kiriting")}
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">{tUZ("Ombordagi soni")}</label>
                            <input
                                type="number"
                                placeholder={tUZ("Ombordagi sonini kiriting")}
                                value={countInStock}
                                onChange={(e) => setCountInStock(e.target.value)}
                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">{tUZ("Kategoriya")}</label>
                            <input
                                type="text"
                                placeholder={tUZ("Kategoriyani kiriting")}
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">{tUZ("Tavsif")}</label>
                            <textarea
                                placeholder={tUZ("Tavsifni kiriting")}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows="4"
                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={loadingUpdate}
                            className="bg-green-600 text-white font-bold py-2 px-6 rounded hover:bg-green-700 transition-colors w-full"
                        >
                            {loadingUpdate ? tUZ('Bajarilmoqda...') : (isEditMode ? tUZ('Yangilash') : tUZ('Yaratish'))}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ProductEditScreen;
