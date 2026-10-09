import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FaAward, FaDownload, FaUpload, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { tUZ } from '../utils/translateHelper';
import AuthContext from '../context/AuthContext';
import Loader from '../components/Loader';

const TYPE_OPTIONS = ['Halal', 'Organic', 'Quality', 'Export', 'Other'];

const CertificationScreen = () => {
    const { user } = useContext(AuthContext);

    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isUploading, setIsUploading] = useState(false);
    const [uploadingFile, setUploadingFile] = useState(false);
    const [newCertName, setNewCertName] = useState('');
    const [newCertType, setNewCertType] = useState('Halal');
    const [newCertNumber, setNewCertNumber] = useState('');
    const [newCertExpiry, setNewCertExpiry] = useState('');
    const [newCertFileUrl, setNewCertFileUrl] = useState('');

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        const fetchCertificates = async () => {
            try {
                const { data } = await axios.get('/api/certificates', {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setCertificates(data);
            } catch (error) {
                toast.error(tUZ("Sertifikatlarni yuklab bo'lmadi"));
            } finally {
                setLoading(false);
            }
        };
        fetchCertificates();
    }, [user]);

    const handleDownload = (cert) => {
        if (cert.fileUrl) {
            window.open(cert.fileUrl, '_blank');
        } else {
            toast.error(tUZ("Bu sertifikat uchun fayl yuklanmagan"));
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        setUploadingFile(true);
        try {
            const { data } = await axios.post('/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user.token}` },
            });
            setNewCertFileUrl(data.path);
        } catch (error) {
            toast.error(tUZ("Fayl yuklash bajarilmadi"));
        } finally {
            setUploadingFile(false);
        }
    };

    const handleUploadSubmit = async (e) => {
        e.preventDefault();
        if (!newCertName) {
            toast.error(tUZ("Iltimos, sertifikat nomini kiriting!"));
            return;
        }

        setIsUploading(true);
        try {
            const { data } = await axios.post(
                '/api/certificates',
                {
                    name: newCertName,
                    type: newCertType,
                    number: newCertNumber,
                    expiryDate: newCertExpiry || undefined,
                    fileUrl: newCertFileUrl || undefined,
                },
                { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` } }
            );
            setCertificates([data, ...certificates]);
            setNewCertName('');
            setNewCertNumber('');
            setNewCertExpiry('');
            setNewCertFileUrl('');
            toast.success(tUZ("Hujjat yuklandi va tekshiruvga yuborildi!"));
        } catch (error) {
            toast.error(error.response?.data?.message || tUZ("Hujjatni yuklab bo'lmadi"));
        } finally {
            setIsUploading(false);
        }
    };

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-16 text-center text-gray-500">
                {tUZ("Bu bo'limdan foydalanish uchun tizimga kiring.")}
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8 animate-fadeIn">
            <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 flex items-center gap-2">
                    <FaAward className="text-brand" />
                    {tUZ("Sertifikatlar va Standartlar")}
                </h1>
                <p className="text-gray-500 text-sm">{tUZ("Xalqaro savdo va eksport talablariga mos keluvchi faol sertifikatlaringizni boshqaring.")}</p>
            </div>

            {loading ? (
                <Loader />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {certificates.length === 0 && (
                        <p className="text-sm text-gray-500 md:col-span-2">{tUZ("Hali sertifikat yuklanmagan.")}</p>
                    )}
                    {certificates.map((cert) => (
                        <div key={cert._id} className="bg-white border border-line rounded-2xl p-5 md:p-6 shadow-card flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
                            {cert.status === 'pending' && (
                                <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
                                    <span className="bg-gray-100 border border-gray-200 text-gray-600 font-bold text-xs py-1.5 px-3 rounded-full flex items-center gap-1.5 shadow-sm">
                                        <FaSpinner className="animate-spin" /> {tUZ("Verifikatsiya kutilmoqda")}
                                    </span>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">{tUZ("Turi:")} {cert.type}</span>
                                        <h3 className="font-extrabold text-gray-900 text-base md:text-lg mt-0.5">{cert.name}</h3>
                                    </div>
                                    <span className={`text-[10px] font-bold py-0.5 px-2 rounded-full ${
                                        cert.status === 'active'
                                            ? 'bg-green-50 text-brand'
                                            : cert.status === 'expiring'
                                            ? 'bg-amber-50 text-amber-600'
                                            : cert.status === 'expired'
                                            ? 'bg-red-50 text-red-500'
                                            : 'bg-gray-50 text-gray-400'
                                    }`}>
                                        {cert.status === 'active' ? tUZ('Faol') : cert.status === 'expiring' ? tUZ('Muddati tugamoqda') : cert.status === 'expired' ? tUZ('Amal qilish muddati tugagan') : tUZ('Kutilmoqda')}
                                    </span>
                                </div>

                                <div className="space-y-2 text-xs text-gray-500 bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                                    <div className="flex justify-between">
                                        <span>{tUZ("Hujjat raqami:")}</span>
                                        <span className="font-bold text-gray-800">{cert.number || '—'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>{tUZ("Amal qilish muddati:")}</span>
                                        <span className="font-bold text-gray-800">{cert.expiryDate ? new Date(cert.expiryDate).toLocaleDateString() : '—'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>{tUZ("Organ:")}</span>
                                        <span className="font-bold text-gray-800 truncate max-w-[180px]">{cert.issuer || tUZ('Tekshirilmoqda...')}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-6">
                                <button
                                    onClick={() => handleDownload(cert)}
                                    className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-2 px-3 rounded-lg text-xs border border-gray-200 transition-colors flex items-center justify-center gap-1.5"
                                >
                                    <FaDownload size={10} /> {tUZ("Yuklab olish")}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="bg-white border border-line rounded-2xl p-6 shadow-card space-y-6">
                <div>
                    <h3 className="font-extrabold text-gray-900 text-lg">{tUZ("Yangi sertifikat yuklash")}</h3>
                    <p className="text-gray-500 text-xs">{tUZ("Sertifikatingiz PDF formatini va ma'lumotlarini yuklang. Biz uni 24 soat ichida tekshirib verifikatsiyadan o'tkazamiz.")}</p>
                </div>

                <form onSubmit={handleUploadSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                    <div className="space-y-1">
                        <label className="block text-xs font-semibold text-gray-700">{tUZ("Sertifikat nomi")}</label>
                        <input
                            type="text"
                            placeholder={tUZ("Masalan: Halal 2026 yangi")}
                            value={newCertName}
                            onChange={(e) => setNewCertName(e.target.value)}
                            className="w-full border border-gray-200 px-4 py-2 rounded-xl text-sm focus:outline-none focus:border-brand bg-gray-50/50"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-xs font-semibold text-gray-700">{tUZ("Turi")}</label>
                        <select
                            value={newCertType}
                            onChange={(e) => setNewCertType(e.target.value)}
                            className="w-full border border-gray-200 px-4 py-2 rounded-xl text-sm focus:outline-none focus:border-brand bg-gray-50/50"
                        >
                            {TYPE_OPTIONS.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="block text-xs font-semibold text-gray-700">{tUZ("Hujjat raqami")}</label>
                        <input
                            type="text"
                            value={newCertNumber}
                            onChange={(e) => setNewCertNumber(e.target.value)}
                            className="w-full border border-gray-200 px-4 py-2 rounded-xl text-sm focus:outline-none focus:border-brand bg-gray-50/50"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-xs font-semibold text-gray-700">{tUZ("Amal qilish muddati")}</label>
                        <input
                            type="date"
                            value={newCertExpiry}
                            onChange={(e) => setNewCertExpiry(e.target.value)}
                            className="w-full border border-gray-200 px-4 py-2 rounded-xl text-sm focus:outline-none focus:border-brand bg-gray-50/50"
                        />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                        <label className="block text-xs font-semibold text-gray-700">{tUZ("Fayl (PDF yoki rasm)")}</label>
                        <input
                            type="file"
                            accept="application/pdf,image/*"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                        />
                        {uploadingFile && <div className="text-xs text-gray-500 mt-1">{tUZ("Yuklanmoqda...")}</div>}
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            type="submit"
                            disabled={isUploading}
                            className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-2.5 px-4 rounded-xl transition-all shadow-sm text-sm flex items-center justify-center gap-1.5"
                        >
                            {isUploading ? (
                                <>
                                    <FaSpinner className="animate-spin" />
                                    {tUZ("Yuklanmoqda...")}
                                </>
                            ) : (
                                <>
                                    <FaUpload size={12} /> {tUZ("Hujjatni yuklash")}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CertificationScreen;
