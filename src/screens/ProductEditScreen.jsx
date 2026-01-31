import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Loader from '../components/Loader';
import AuthContext from '../context/AuthContext';

const ProductEditScreen = () => {
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
                    toast.error('Failed to fetch product details');
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
                },
            };
            const { data } = await axios.post('/api/upload', formData, config);
            setImage(data);
            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploading(false);
            toast.error('Image upload failed');
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
                toast.success('Product Updated Successfully');
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
                toast.success('Product Created Successfully');
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
                Go Back
            </Link>

            <div className="bg-white shadow-md rounded-lg p-8">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">
                    {isEditMode ? 'Edit Product' : 'Create Product'}
                </h1>

                {loading ? (
                    <Loader />
                ) : (
                    <form onSubmit={submitHandler}>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Name</label>
                            <input
                                type="text"
                                placeholder="Enter name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Price</label>
                            <input
                                type="number"
                                placeholder="Enter price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Image</label>
                            <input
                                type="text"
                                placeholder="Enter image url"
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
                            {uploading && <div className="text-sm text-gray-500 mt-1">Uploading...</div>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Brand</label>
                            <input
                                type="text"
                                placeholder="Enter brand"
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Count In Stock</label>
                            <input
                                type="number"
                                placeholder="Enter count in stock"
                                value={countInStock}
                                onChange={(e) => setCountInStock(e.target.value)}
                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Category</label>
                            <input
                                type="text"
                                placeholder="Enter category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Description</label>
                            <textarea
                                placeholder="Enter description"
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
                            {loadingUpdate ? 'Processing...' : (isEditMode ? 'Update' : 'Create')}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ProductEditScreen;
