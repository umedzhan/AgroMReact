import React, { useState } from 'react';
import { FaAward, FaExclamationTriangle, FaDownload, FaUpload, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { tUZ } from '../utils/translateHelper';
import { useTranslation } from 'react-i18next';

const CertificationScreen = () => {
    useTranslation();
    const [certificates, setCertificates] = useState([
        {
            id: 'CERT-HA109',
            name: 'Halal Certification',
            type: 'Halal',
            number: 'UZ-HAL-2024-0089',
            issueDate: '2024-06-15',
            expiryDate: '2026-06-19', // ~12 days left from local date
            status: 'expiring',
            issuer: 'O\'zbekiston Standartlashtirish Markazi'
        },
        {
            id: 'CERT-OR552',
            name: 'Organic Food Certificate',
            type: 'Organic',
            number: 'EU-ORG-9923-UZ',
            issueDate: '2025-01-10',
            expiryDate: '2027-01-10',
            status: 'active',
            issuer: 'European Organic Inspectorate'
        },
        {
            id: 'CERT-QS041',
            name: 'ISO 9001:2015 Quality Management',
            type: 'Quality',
            number: 'ISO-9001-88410',
            issueDate: '2023-09-20',
            expiryDate: '2028-09-20',
            status: 'active',
            issuer: 'International Certifications Ltd'
        },
        {
            id: 'CERT-EX771',
            name: 'Export License Certification',
            type: 'Export',
            number: 'EXP-LIC-00441',
            issueDate: '2025-03-01',
            expiryDate: '2026-03-01',
            status: 'active',
            issuer: 'Tashqi Iqtisodiy Aloqalar Vazirligi'
        }
    ]);

    const [isUploading, setIsUploading] = useState(false);
    const [newCertName, setNewCertName] = useState('');
    const [newCertType, setNewCertType] = useState('Halal');

    const handleDownload = (certName) => {
        toast.success(`${tUZ(certName)} ${tUZ("PDF fayli yuklab olindi.")}`);
    };

    const handleRenew = (certId) => {
        toast.loading(tUZ("Yangilash so'rovi yuborilmoqda..."));
        setTimeout(() => {
            toast.dismiss();
            toast.success(tUZ("Yangilash arizasi muvaffaqiyatli topshirildi. Operator siz bilan bog'lanadi."));
        }, 1200);
    };

    const handleUploadSubmit = (e) => {
        e.preventDefault();
        if (!newCertName) {
            toast.error(tUZ("Iltimos, sertifikat nomini kiriting!"));
            return;
        }

        setIsUploading(true);
        setTimeout(() => {
            const newCert = {
                id: `CERT-NEW${Math.floor(Math.random() * 1000)}`,
                name: newCertName,
                type: newCertType,
                number: `PENDING-${Math.floor(Math.random() * 100000)}`,
                issueDate: new Date().toISOString().split('T')[0],
                expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
                status: 'pending',
                issuer: tUZ('Tekshirilmoqda...')
            };

            setCertificates([newCert, ...certificates]);
            setIsUploading(false);
            setNewCertName('');
            toast.success(tUZ("Hujjat yuklandi va tekshiruvga yuborildi!"));
        }, 1500);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8 animate-fadeIn">
            {/* Title */}
            <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 flex items-center gap-2">
                    <FaAward className="text-brand" />
                    {tUZ("Sertifikatlar va Standartlar")}
                </h1>
                <p className="text-gray-500 text-sm">{tUZ("Xalqaro savdo va eksport talablariga mos keluvchi faol sertifikatlaringizni boshqaring.")}</p>
            </div>

            {/* Warning Banner for Expiring Certificates */}
            {certificates.some(c => c.status === 'expiring') && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
                    <div className="bg-amber-100 text-amber-700 p-2.5 rounded-xl">
                        <FaExclamationTriangle size={20} />
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-extrabold text-amber-900 text-sm md:text-base">{tUZ("Muddati yakunlanayotgan sertifikatlar aniqlandi!")}</h4>
                        <p className="text-amber-800 text-xs md:text-sm">
                            {tUZ("Sizning **Halal Certification** sertifikatingiz muddati 12 kundan keyin tugaydi. Platformadagi savdo jarayonlari to'xtab qolmasligi uchun yangilash arizasini bering.")}
                        </p>
                    </div>
                </div>
            )}

            {/* Certificates List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certificates.map((cert) => (
                    <div key={cert.id} className="bg-white border border-gray-150 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
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
                                    <span className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">{tUZ("Turi:")} {tUZ(cert.type)}</span>
                                    <h3 className="font-extrabold text-gray-900 text-base md:text-lg mt-0.5">{tUZ(cert.name)}</h3>
                                </div>
                                <span className={`text-[10px] font-bold py-0.5 px-2 rounded-full ${
                                    cert.status === 'active' 
                                        ? 'bg-green-50 text-brand' 
                                        : cert.status === 'expiring'
                                        ? 'bg-amber-50 text-amber-600'
                                        : 'bg-gray-50 text-gray-400'
                                }`}>
                                    {cert.status === 'active' ? tUZ('Faol') : cert.status === 'expiring' ? tUZ('Muddati tugamoqda') : tUZ('Kutilmoqda')}
                                </span>
                            </div>

                            <div className="space-y-2 text-xs text-gray-500 bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                                <div className="flex justify-between">
                                    <span>{tUZ("Hujjat raqami:")}</span>
                                    <span className="font-bold text-gray-800">{cert.number}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>{tUZ("Berilgan sana:")}</span>
                                    <span className="font-bold text-gray-800">{cert.issueDate}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>{tUZ("Amal qilish muddati:")}</span>
                                    <span className="font-bold text-gray-800">{cert.expiryDate}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>{tUZ("Organ:")}</span>
                                    <span className="font-bold text-gray-800 truncate max-w-[180px]">{tUZ(cert.issuer)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-6">
                            <button 
                                onClick={() => handleDownload(cert.name)}
                                className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-2 px-3 rounded-lg text-xs border border-gray-200 transition-colors flex items-center justify-center gap-1.5"
                            >
                                <FaDownload size={10} /> {tUZ("Yuklab olish")}
                            </button>
                            {cert.status === 'expiring' && (
                                <button 
                                    onClick={() => handleRenew(cert.id)}
                                    className="flex-1 bg-brand hover:bg-brand-dark text-white font-bold py-2 px-3 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                                >
                                    {tUZ("Yangilash arizasi")}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Document Upload Interface */}
            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-6">
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
                            <option value="Halal">Halal</option>
                            <option value="Organic">Organic</option>
                            <option value="Quality">ISO Quality</option>
                            <option value="Export">Export License</option>
                        </select>
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
