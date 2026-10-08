import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Loader from '../components/Loader';
import AuthContext from '../context/AuthContext';
import { tUZ } from '../utils/translateHelper';
import { useTranslation } from 'react-i18next';
import { PRODUCT_CATEGORIES } from '../utils/categories';
import { REGIONS } from '../utils/regions';

const BUYER_TYPES = ['wholesale', 'retail', 'processing', 'horeca', 'distributor', 'exporter'];
const BUYER_TYPE_LABELS = {
    wholesale: "Ulgurji",
    retail: "Chakana",
    processing: "Qayta ishlash",
    horeca: "HoReCa (mehmonxona/restoran)",
    distributor: "Distribyutor",
    exporter: "Eksportyor",
};
const DELIVERY_OPTIONS = ['pickup', 'seller', 'partner'];
const DELIVERY_OPTION_LABELS = {
    pickup: "O'zi olib ketadi",
    seller: "Sotuvchi yetkazadi",
    partner: "Hamkor logistika orqali",
};

const ProductEditScreen = () => {
    const { t } = useTranslation();
    const { id: productId } = useParams();
    const isEditMode = productId !== undefined; // If ID exists, we are editing

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');
    // Optional "Market" (local/export trade) fields
    const [region, setRegion] = useState('');
    const [grade, setGrade] = useState('');
    const [certificatesText, setCertificatesText] = useState('');
    const [harvestDate, setHarvestDate] = useState('');
    const [buyerTypes, setBuyerTypes] = useState([]);
    const [delivery, setDelivery] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [uploading, setUploading] = useState(false);

    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (!user) {
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
                    setRegion(data.region || '');
                    setGrade(data.grade || '');
                    setCertificatesText((data.certificates || []).join(', '));
                    setHarvestDate(data.harvestDate ? data.harvestDate.substring(0, 10) : '');
                    setBuyerTypes(data.buyerTypes || []);
                    setDelivery(data.delivery || []);
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

    const toggleArrayValue = (list, setList, value) => {
        setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
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

            const payload = {
                name,
                price,
                image,
                brand,
                category,
                description,
                countInStock,
                region: region || undefined,
                grade: grade || undefined,
                certificates: certificatesText
                    ? certificatesText.split(',').map((c) => c.trim()).filter(Boolean)
                    : [],
                harvestDate: harvestDate || undefined,
                buyerTypes,
                delivery,
            };

            if (isEditMode) {
                await axios.put(`/api/products/${productId}`, payload, config);
                toast.success(tUZ('Mahsulot muvaffaqiyatli yangilandi'));
            } else {
                await axios.post('/api/products', payload, config);
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
        <div className="max-w-3xl mx-auto mt-10">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">{tUZ("Kategoriya")}</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 outline-none bg-white"
                            >
                                <option value="">{tUZ("Kategoriyani tanlang")}</option>
                                {PRODUCT_CATEGORIES.map((c) => (
                                    <option key={c.value} value={c.value}>{t(`header.nav.${c.navKey}`)}</option>
                                ))}
                            </select>
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

                        <div className="border-t pt-4 mt-2 mb-4">
                            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
                                {tUZ("Bozor va eksport uchun qo'shimcha ma'lumot (ixtiyoriy)")}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2">{tUZ("Hudud")}</label>
                                    <select
                                        value={region}
                                        onChange={(e) => setRegion(e.target.value)}
                                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 outline-none bg-white"
                                    >
                                        <option value="">{tUZ("Hududni tanlang")}</option>
                                        {REGIONS.map((r) => (
                                            <option key={r.value} value={r.value}>{tUZ(r.label)}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2">{tUZ("Sifat darajasi")}</label>
                                    <select
                                        value={grade}
                                        onChange={(e) => setGrade(e.target.value)}
                                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 outline-none bg-white"
                                    >
                                        <option value="">{tUZ("Tanlanmagan")}</option>
                                        <option value="premium">{tUZ("Premium")}</option>
                                        <option value="grade1">{tUZ("1-sifat")}</option>
                                        <option value="grade2">{tUZ("2-sifat")}</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2">{tUZ("Sertifikatlar (vergul bilan)")}</label>
                                    <input
                                        type="text"
                                        placeholder="GlobalGAP, Organic"
                                        value={certificatesText}
                                        onChange={(e) => setCertificatesText(e.target.value)}
                                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2">{tUZ("Hosil yig'ish sanasi")}</label>
                                    <input
                                        type="date"
                                        value={harvestDate}
                                        onChange={(e) => setHarvestDate(e.target.value)}
                                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2">{tUZ("Xaridor turi")}</label>
                                <div className="flex flex-wrap gap-3">
                                    {BUYER_TYPES.map((bt) => (
                                        <label key={bt} className="flex items-center gap-1.5 text-sm text-gray-700">
                                            <input
                                                type="checkbox"
                                                checked={buyerTypes.includes(bt)}
                                                onChange={() => toggleArrayValue(buyerTypes, setBuyerTypes, bt)}
                                            />
                                            {tUZ(BUYER_TYPE_LABELS[bt])}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2">{tUZ("Yetkazib berish usuli")}</label>
                                <div className="flex flex-wrap gap-3">
                                    {DELIVERY_OPTIONS.map((d) => (
                                        <label key={d} className="flex items-center gap-1.5 text-sm text-gray-700">
                                            <input
                                                type="checkbox"
                                                checked={delivery.includes(d)}
                                                onChange={() => toggleArrayValue(delivery, setDelivery, d)}
                                            />
                                            {tUZ(DELIVERY_OPTION_LABELS[d])}
                                        </label>
                                    ))}
                                </div>
                            </div>
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
