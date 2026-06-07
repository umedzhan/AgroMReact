import React, { useState } from 'react';
import { FaFileContract, FaPenNib, FaFileInvoiceDollar, FaCheckCircle, FaSpinner, FaChevronDown, FaPlus } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { tUZ } from '../utils/translateHelper';
import { useTranslation } from 'react-i18next';

const ContractsScreen = () => {
    useTranslation();
    const [contracts, setContracts] = useState([
        {
            id: 'CON-2026-001',
            partnerName: 'AgroEksport MCHJ',
            cropType: tUZ('Bug\'doy (Elite)'),
            volume: 20, // tons
            pricePerKg: 3500, // UZS
            paymentTerms: tUZ('50% oldindan to\'lov, 50% yetkazilgach'),
            status: 'active',
            dateCreated: '2026-05-15',
            signedDate: '2026-05-16'
        },
        {
            id: 'CON-2026-002',
            partnerName: 'Zamin Dehqonlari Klasteri',
            cropType: tUZ('Organik Kartoshka'),
            volume: 8,
            pricePerKg: 6500,
            paymentTerms: tUZ('100% to\'liq oldindan to\'lov'),
            status: 'draft',
            dateCreated: '2026-06-02',
            signedDate: null
        },
        {
            id: 'CON-2026-003',
            partnerName: 'Navoiy Agrosanoat XK',
            cropType: tUZ('Sariq Piyoz'),
            volume: 15,
            pricePerKg: 4200,
            paymentTerms: tUZ('100% yetkazib berilgach 5 kun ichida'),
            status: 'completed',
            dateCreated: '2026-03-10',
            signedDate: '2026-03-12'
        }
    ]);

    // Form states
    const [partnerName, setPartnerName] = useState('');
    const [cropType, setCropType] = useState('Bug\'doy (Sifatli)');
    const [volume, setVolume] = useState('');
    const [pricePerKg, setPricePerKg] = useState('');
    const [paymentTerms, setPaymentTerms] = useState(tUZ('50% oldindan to\'lov, 50% yetkazilgach'));

    // ERI modal states
    const [signingContract, setSigningContract] = useState(null);
    const [eriPassword, setEriPassword] = useState('');
    const [isSigning, setIsSigning] = useState(false);

    const handleCreateContract = (e) => {
        e.preventDefault();
        if (!partnerName || !volume || !pricePerKg) {
            toast.error(tUZ("Iltimos, barcha maydonlarni to'ldiring!"));
            return;
        }

        const newContract = {
            id: `CON-2026-00${contracts.length + 1}`,
            partnerName,
            cropType,
            volume: Number(volume),
            pricePerKg: Number(pricePerKg),
            paymentTerms,
            status: 'draft',
            dateCreated: new Date().toISOString().split('T')[0],
            signedDate: null
        };

        setContracts([newContract, ...contracts]);
        setPartnerName('');
        setVolume('');
        setPricePerKg('');
        toast.success(tUZ("Shartnoma loyihasi (Draft) muvaffaqiyatli yaratildi!"));
    };

    const handleEriSignClick = (contract) => {
        setSigningContract(contract);
    };

    const handleConfirmSign = (e) => {
        e.preventDefault();
        if (!eriPassword) {
            toast.error(tUZ("ERI parolini kiriting!"));
            return;
        }

        setIsSigning(true);
        setTimeout(() => {
            // Update status of the contract
            setContracts(prev => prev.map(c => {
                if (c.id === signingContract.id) {
                    return {
                        ...c,
                        status: 'active',
                        signedDate: new Date().toISOString().split('T')[0]
                    };
                }
                return c;
            }));

            setIsSigning(false);
            setSigningContract(null);
            setEriPassword('');
            toast.success(tUZ("Shartnoma ERI (Elektron Raqamli Imzo) orqali muvaffaqiyatli imzolandi!"));
        }, 1800);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8 animate-fadeIn">
            {/* Title */}
            <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 flex items-center gap-2">
                    <FaFileContract className="text-amber-700" />
                    {tUZ("Raqamli Shartnomalar (ERI)")}
                </h1>
                <p className="text-gray-500 text-sm">{tUZ("Platformadagi Elektron Raqamli Imzo (ERI/DS) orqali tasdiqlangan huquqiy shartnomalar.")}</p>
            </div>

            {/* Contract list container */}
            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-6">
                <h3 className="font-extrabold text-gray-900 text-lg">{tUZ("Mavjud Shartnomalar")}</h3>

                <div className="grid grid-cols-1 gap-6">
                    {contracts.map((c) => (
                        <div key={c.id} className="border border-gray-150 rounded-2xl p-5 md:p-6 hover:shadow-md transition-shadow flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative overflow-hidden bg-gray-50/20">
                            
                            {/* Contract details block */}
                            <div className="space-y-3 flex-1">
                                <div className="flex items-center gap-3">
                                    <h4 className="font-black text-gray-900 text-base">{c.partnerName}</h4>
                                    <span className="text-[10px] text-gray-400 font-bold bg-white border px-2 py-0.5 rounded-full">{c.id}</span>
                                    <span className={`text-[10px] font-extrabold py-0.5 px-2 rounded-full uppercase ${
                                        c.status === 'active' 
                                            ? 'bg-green-50 text-brand' 
                                            : c.status === 'completed'
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'bg-amber-50 text-amber-700 animate-pulse'
                                    }`}>
                                        {c.status === 'active' ? tUZ('Faol') : c.status === 'completed' ? tUZ('Yakunlangan') : tUZ('Imzo kutilmoqda')}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-500">
                                    <div>
                                        <p className="font-bold text-gray-400">{tUZ("MAHSULOT")}</p>
                                        <p className="font-bold text-gray-800 mt-0.5">{tUZ(c.cropType)}</p>
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-400">{tUZ("HAJM")}</p>
                                        <p className="font-bold text-gray-800 mt-0.5">{c.volume} {tUZ("tonna")}</p>
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-400">{tUZ("UMUMIY SUMMA")}</p>
                                        <p className="font-bold text-gray-800 mt-0.5">{(c.volume * 1000 * c.pricePerKg).toLocaleString()} UZS</p>
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-400">{tUZ("TUZILGAN SANA")}</p>
                                        <p className="font-bold text-gray-800 mt-0.5">{c.dateCreated}</p>
                                    </div>
                                </div>

                                <p className="text-xs text-gray-600 bg-white border border-gray-100 p-2.5 rounded-xl">
                                    <strong>{tUZ("To'lov shartlari:")}</strong> {tUZ(c.paymentTerms)}
                                </p>
                            </div>

                            {/* Actions or Stamp */}
                            <div className="shrink-0 flex flex-col items-stretch lg:items-end w-full lg:w-auto gap-3">
                                {c.status === 'draft' ? (
                                    <button 
                                        onClick={() => handleEriSignClick(c)}
                                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow flex items-center justify-center gap-1.5 text-sm"
                                    >
                                        <FaPenNib size={14} /> {tUZ("ERI bilan imzolash")}
                                    </button>
                                ) : (
                                    <div className="border border-green-200 bg-green-50 rounded-2xl p-3 flex flex-col items-center justify-center text-center w-full lg:w-36 text-brand">
                                        <FaCheckCircle className="text-2xl animate-scaleIn" />
                                        <span className="text-[10px] font-black uppercase tracking-wider mt-1.5">{tUZ("ERI tasdiqlangan")}</span>
                                        <span className="text-[9px] text-gray-500 font-semibold mt-0.5">{c.signedDate}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Template Generator Form */}
            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-6">
                <div>
                    <h3 className="font-extrabold text-gray-900 text-lg flex items-center gap-2">
                        <FaPlus className="text-brand text-sm" />
                        {tUZ("Yangi shartnoma shablonini yaratish")}
                    </h3>
                    <p className="text-gray-500 text-xs">{tUZ("Ushbu shablon orqali hamkor bilan elektron kelishuv shartnomasini avtomatik hosil qilasiz.")}</p>
                </div>

                <form onSubmit={handleCreateContract} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="block text-xs font-semibold text-gray-700">{tUZ("Hamkorning nomi (Kompaniya yoki shaxs)")}</label>
                        <input 
                            type="text" 
                            placeholder={tUZ("Masalan: Farg'ona Agro Klasteri MCHJ")}
                            value={partnerName}
                            onChange={(e) => setPartnerName(e.target.value)}
                            className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand bg-gray-50/50"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-xs font-semibold text-gray-700">{tUZ("Mahsulot turi")}</label>
                        <select 
                            value={cropType}
                            onChange={(e) => setCropType(e.target.value)}
                            className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand bg-gray-50/50"
                        >
                            <option value="Bug'doy (Sifatli)">{tUZ("Bug'doy (Sifatli)")}</option>
                            <option value="Organik Kartoshka">{tUZ("Organik Kartoshka")}</option>
                            <option value="Qizil Pomidor">{tUZ("Qizil Pomidor")}</option>
                            <option value="Sariq Piyoz">{tUZ("Sariq Piyoz")}</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="block text-xs font-semibold text-gray-700">{tUZ("Yuk hajmi (tonnada)")}</label>
                        <input 
                            type="number" 
                            placeholder={tUZ("Masalan: 12")}
                            value={volume}
                            onChange={(e) => setVolume(e.target.value)}
                            className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand bg-gray-50/50"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-xs font-semibold text-gray-700">{tUZ("1 kg uchun narx (UZS)")}</label>
                        <input 
                            type="number" 
                            placeholder={tUZ("Masalan: 4500")}
                            value={pricePerKg}
                            onChange={(e) => setPricePerKg(e.target.value)}
                            className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand bg-gray-50/50"
                        />
                    </div>
                    <div className="md:col-span-2 space-y-1">
                        <label className="block text-xs font-semibold text-gray-700">{tUZ("To'lov va yetkazib berish shartlari")}</label>
                        <textarea 
                            rows="2"
                            value={paymentTerms}
                            onChange={(e) => setPaymentTerms(e.target.value)}
                            className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand bg-gray-50/50"
                        ></textarea>
                    </div>
                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            className="bg-brand hover:bg-brand-dark text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-sm text-sm"
                        >
                            {tUZ("Shablonni Yaratish")}
                        </button>
                    </div>
                </form>
            </div>

            {/* ERI SIGNING MODAL POPUP */}
            {signingContract && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl w-full max-w-md border border-gray-100 space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-extrabold text-gray-950 flex items-center gap-1.5">
                                <FaPenNib className="text-amber-600" /> {tUZ("ERI Imzosi bilan Tasdiqlash")}
                            </h3>
                            <button 
                                onClick={() => setSigningContract(null)}
                                className="text-gray-400 hover:text-gray-600 font-bold"
                            >
                                {tUZ("yopish")}
                            </button>
                        </div>

                        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-xs space-y-1 text-amber-900">
                            <p><strong>{tUZ("Hamkor:")}</strong> {signingContract.partnerName}</p>
                            <p><strong>{tUZ("Hajm & Mahsulot:")}</strong> {signingContract.volume} t | {tUZ(signingContract.cropType)}</p>
                            <p><strong>{tUZ("Jami qiymat:")}</strong> {(signingContract.volume * 1000 * signingContract.pricePerKg).toLocaleString()} UZS</p>
                        </div>

                        <form onSubmit={handleConfirmSign} className="space-y-4">
                            <div className="space-y-1">
                                <label className="block text-xs font-semibold text-gray-700">{tUZ("Elektron Kalitni tanlang")}</label>
                                <select className="w-full border border-gray-200 px-4 py-2 rounded-xl text-sm focus:outline-none focus:border-brand bg-gray-50/50">
                                    <option value="key1">{tUZ("DS_KEY_EXPIRE_2028_10291.uzkey (Fizik shaxs)")}</option>
                                    <option value="key2">{tUZ("DS_KEY_AGRO_EXPERT_MCHJ.uzkey (Yuridik shaxs)")}</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-xs font-semibold text-gray-700">{tUZ("ERI Kalit paroli")}</label>
                                <input 
                                    type="password" 
                                    placeholder="••••••••"
                                    value={eriPassword}
                                    onChange={(e) => setEriPassword(e.target.value)}
                                    className="w-full border border-gray-200 px-4 py-2 rounded-xl text-sm focus:outline-none focus:border-brand bg-gray-50/50"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSigning}
                                className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-3 rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-2"
                            >
                                {isSigning ? (
                                    <>
                                        <FaSpinner className="animate-spin" />
                                        {tUZ("Imzolanmoqda...")}
                                    </>
                                ) : (
                                    tUZ("Tasdiqlash va Imzolash")
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContractsScreen;
