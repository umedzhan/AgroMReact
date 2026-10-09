import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaMapMarkedAlt, FaCheckCircle, FaSpinner, FaExternalLinkAlt, FaPlus } from 'react-icons/fa';
import { tUZ } from '../utils/translateHelper';
import AuthContext from '../context/AuthContext';
import Loader from '../components/Loader';

const STATUS_BADGE = {
    verified: { label: "Tasdiqlangan", className: 'bg-green-50 text-brand' },
    pending: { label: "Tekshirilmoqda", className: 'bg-amber-50 text-amber-600' },
    outdated: { label: "Eskirgan", className: 'bg-red-50 text-red-500' },
};

const ExportScreen = () => {
    const { user } = useContext(AuthContext);
    const [searchParams] = useSearchParams();
    const preselectedCountry = searchParams.get('country');

    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [requirements, setRequirements] = useState([]);
    const [loadingRequirements, setLoadingRequirements] = useState(false);

    const [myProducts, setMyProducts] = useState([]);
    const [operations, setOperations] = useState([]);
    const [newOpProduct, setNewOpProduct] = useState('');
    const [newOpTons, setNewOpTons] = useState('');
    const [startingOp, setStartingOp] = useState(false);

    const [logisticsWeight, setLogisticsWeight] = useState('5');
    const [logisticsEstimate, setLogisticsEstimate] = useState(null);
    const [loadingLogistics, setLoadingLogistics] = useState(false);

    const [showLeadForm, setShowLeadForm] = useState(false);
    const [leadMessage, setLeadMessage] = useState('');
    const [leadPhone, setLeadPhone] = useState('');
    const [sendingLead, setSendingLead] = useState(false);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const { data } = await axios.get('/api/countries');
                setCountries(data);
                const preselected = data.find((c) => c.code === preselectedCountry?.toUpperCase());
                setSelectedCountry(preselected ? preselected.code : data[0]?.code);
            } catch (error) {
                toast.error(tUZ("Davlatlar ro'yxatini yuklab bo'lmadi"));
            }
        };
        fetchCountries();
    }, []);

    useEffect(() => {
        if (!selectedCountry) return;
        const fetchRequirements = async () => {
            try {
                setLoadingRequirements(true);
                const { data } = await axios.get('/api/export-requirements', { params: { country: selectedCountry } });
                setRequirements(data);
            } catch (error) {
                toast.error(tUZ("Talablarni yuklab bo'lmadi"));
            } finally {
                setLoadingRequirements(false);
            }
        };
        fetchRequirements();
    }, [selectedCountry]);

    useEffect(() => {
        if (!user) return;

        const fetchMine = async () => {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            try {
                const [productsRes, opsRes] = await Promise.all([
                    axios.get('/api/products', { params: { myproducts: true }, ...config }),
                    axios.get('/api/export-operations', config),
                ]);
                setMyProducts(productsRes.data.products || []);
                setOperations(opsRes.data);
            } catch (error) {
                // Not critical for the read-only parts of the page
            }
        };
        fetchMine();
    }, [user]);

    const startOperation = async (e) => {
        e.preventDefault();
        if (!newOpProduct || !newOpTons || !selectedCountry) return;

        setStartingOp(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json' } };
            const { data } = await axios.post(
                '/api/export-operations',
                { product: newOpProduct, countryCode: selectedCountry, quantityTons: newOpTons },
                config
            );
            setOperations([data, ...operations]);
            setNewOpProduct('');
            setNewOpTons('');
            toast.success(tUZ("Eksport jarayoni boshlandi"));
        } catch (error) {
            toast.error(error.response?.data?.message || tUZ("Eksport jarayonini boshlab bo'lmadi"));
        } finally {
            setStartingOp(false);
        }
    };

    useEffect(() => {
        if (!selectedCountry || !logisticsWeight) return;
        const fetchEstimate = async () => {
            try {
                setLoadingLogistics(true);
                const { data } = await axios.get('/api/logistics/estimate', {
                    params: { country: selectedCountry, weightTons: logisticsWeight },
                });
                setLogisticsEstimate(data);
            } catch (error) {
                setLogisticsEstimate(null);
            } finally {
                setLoadingLogistics(false);
            }
        };
        fetchEstimate();
    }, [selectedCountry, logisticsWeight]);

    const sendLead = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error(tUZ("Iltimos, avval tizimga kiring."));
            return;
        }

        setSendingLead(true);
        try {
            await axios.post(
                '/api/export-leads',
                { countryCode: selectedCountry, message: leadMessage, contactPhone: leadPhone },
                { headers: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json' } }
            );
            setShowLeadForm(false);
            setLeadMessage('');
            setLeadPhone('');
            toast.success(tUZ("So'rovingiz qabul qilindi. Bizning konsultantlarimiz tez orada siz bilan bog'lanishadi."));
        } catch (error) {
            toast.error(error.response?.data?.message || tUZ("So'rovni yuborib bo'lmadi"));
        } finally {
            setSendingLead(false);
        }
    };

    const selectedCountryData = countries.find((c) => c.code === selectedCountry);

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8 animate-fadeIn">
            <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 flex items-center gap-2">
                    <FaMapMarkedAlt className="text-blue-600" />
                    {tUZ("Eksport bo'yicha davlat talablari")}
                </h1>
                <p className="text-gray-500 text-sm">
                    {tUZ("Davlatni tanlang va shu davlatga eksport qilish uchun qanday talablar borligini ko'ring. Har bir talab rasmiy manbaga ishora qiladi.")}
                </p>
            </div>

            <div className="bg-white border border-line rounded-2xl p-6 shadow-card space-y-6">
                <div className="flex flex-wrap gap-2">
                    {countries.map((c) => (
                        <button
                            key={c.code}
                            onClick={() => setSelectedCountry(c.code)}
                            className={`px-3 py-2 rounded-xl text-sm font-semibold border transition-colors flex items-center gap-1.5 ${
                                selectedCountry === c.code
                                    ? 'border-brand bg-green-50 text-brand'
                                    : 'border-gray-150 text-gray-600 hover:border-gray-300'
                            }`}
                        >
                            <span>{c.flag}</span> {tUZ(c.name.uz)}
                        </button>
                    ))}
                </div>

                {loadingRequirements ? (
                    <Loader />
                ) : (
                    <div className="space-y-3">
                        {requirements.length === 0 && (
                            <p className="text-sm text-gray-500">{tUZ("Bu davlat uchun hali talab qo'shilmagan.")}</p>
                        )}
                        {requirements.map((r) => {
                            const badge = STATUS_BADGE[r.verificationStatus] || STATUS_BADGE.pending;
                            return (
                                <div key={r._id} className="border border-gray-100 rounded-xl p-4 flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">{r.title?.uz}</p>
                                        {r.sourceName && (
                                            <a
                                                href={r.sourceUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1 mt-1"
                                            >
                                                {tUZ("Rasmiy manba")}: {r.sourceName} <FaExternalLinkAlt size={9} />
                                            </a>
                                        )}
                                        <p className="text-[11px] text-gray-400 mt-1">
                                            {tUZ("Oxirgi tekshiruv")}: {r.lastVerified ? new Date(r.lastVerified).toLocaleDateString() : '—'}
                                        </p>
                                    </div>
                                    <span className={`text-[10px] font-extrabold py-1 px-2.5 rounded-full flex items-center gap-1.5 shrink-0 ${badge.className}`}>
                                        {r.verificationStatus === 'verified' ? <FaCheckCircle size={10} /> : <FaSpinner size={10} />}
                                        {tUZ(badge.label)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="bg-white border border-line rounded-2xl p-6 shadow-card space-y-4">
                <div>
                    <h3 className="font-extrabold text-gray-900 text-lg">{tUZ("Logistika narxini taxminiy hisoblash")}</h3>
                    <p className="text-gray-500 text-xs">{tUZ("Bu taxminiy baho. Haqiqiy narx tashuvchi kompaniyaga bog'liq holda farq qilishi mumkin.")}</p>
                </div>
                <div className="flex flex-wrap items-end gap-3">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">{tUZ("Hajmi (tonna)")}</label>
                        <input
                            type="number"
                            min="0.1"
                            step="0.1"
                            value={logisticsWeight}
                            onChange={(e) => setLogisticsWeight(e.target.value)}
                            className="border rounded-lg px-3 py-2 text-sm w-28"
                        />
                    </div>
                    {loadingLogistics ? (
                        <Loader />
                    ) : logisticsEstimate ? (
                        <div className="text-sm">
                            <p className="font-bold text-gray-900">
                                ≈ ${logisticsEstimate.estimatedTotalUsd.toLocaleString()} ({logisticsEstimate.transitDays[0]}–{logisticsEstimate.transitDays[1]} {tUZ("kun")})
                            </p>
                            <p className="text-xs text-gray-500">{tUZ(logisticsEstimate.note)}</p>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400">{tUZ("Hisoblash uchun davlat va hajmni tanlang.")}</p>
                    )}
                </div>
            </div>

            {user && (
                <div className="bg-white border border-line rounded-2xl p-6 shadow-card space-y-5">
                    <div>
                        <h3 className="font-extrabold text-gray-900 text-lg">{tUZ("Mening eksport jarayonlarim")}</h3>
                        <p className="text-gray-500 text-xs">
                            {selectedCountryData ? `${tUZ("Tanlangan davlat")}: ${selectedCountryData.flag} ${tUZ(selectedCountryData.name.uz)}` : ''}
                        </p>
                    </div>

                    <form onSubmit={startOperation} className="flex flex-wrap items-end gap-3">
                        <select
                            value={newOpProduct}
                            onChange={(e) => setNewOpProduct(e.target.value)}
                            className="border rounded-lg px-3 py-2 text-sm bg-white"
                            required
                        >
                            <option value="">{tUZ("Mahsulotni tanlang")}</option>
                            {myProducts.map((p) => (
                                <option key={p._id} value={p._id}>{p.name}</option>
                            ))}
                        </select>
                        <input
                            type="number"
                            min="0.1"
                            step="0.1"
                            placeholder={tUZ("Hajmi (tonna)")}
                            value={newOpTons}
                            onChange={(e) => setNewOpTons(e.target.value)}
                            className="border rounded-lg px-3 py-2 text-sm w-36"
                            required
                        />
                        <button
                            type="submit"
                            disabled={startingOp}
                            className="bg-brand text-white font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-1.5 hover:bg-brand-dark transition-colors disabled:opacity-50"
                        >
                            <FaPlus size={10} /> {tUZ("Boshlash")}
                        </button>
                    </form>

                    <div className="space-y-2">
                        {operations.length === 0 && (
                            <p className="text-sm text-gray-500">{tUZ("Hali eksport jarayoni boshlanmagan.")}</p>
                        )}
                        {operations.map((op) => (
                            <div key={op._id} className="border border-gray-100 rounded-xl p-3 flex items-center justify-between text-sm">
                                <span className="font-semibold text-gray-800">
                                    {op.product?.name || '—'} → {op.countryCode} ({op.quantityTons} t)
                                </span>
                                <span className="text-xs font-bold text-blue-600">{tUZ("Bosqich")}: {op.currentStage}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-2xl p-6 text-white flex flex-col justify-between shadow-md border border-blue-800">
                <div className="space-y-4">
                    <span className="bg-blue-500 text-white text-[10px] uppercase font-bold py-1 px-3 rounded-full inline-block">
                        {tUZ("Eksportga Tavsiyalar")}
                    </span>
                    <h3 className="text-xl font-bold leading-tight">{tUZ("Yevropa Ittifoqiga eksport qilish uchun imtiyozlar bormi?")}</h3>
                    <p className="text-blue-100 text-xs leading-relaxed">
                        {tUZ("O'zbekiston GSP+ tizimi doirasida 6000 dan ortiq tovar turlarini Yevropa Ittifoqiga bojxona to'lovlarisiz eksport qilishi mumkin. Hujjatlarni rasmiylashtirish bo'yicha bizning bepul maslahatchilarimiz xizmatidan foydalaning.")}
                    </p>
                </div>
                {showLeadForm ? (
                    <form onSubmit={sendLead} className="space-y-2 mt-6">
                        <textarea
                            rows="2"
                            required
                            placeholder={tUZ("Qanday mahsulot, qancha hajmda eksport qilmoqchisiz?")}
                            value={leadMessage}
                            onChange={(e) => setLeadMessage(e.target.value)}
                            className="w-full rounded-xl px-3 py-2 text-sm text-gray-900"
                        />
                        <input
                            type="tel"
                            required
                            placeholder={tUZ("Telefon raqamingiz")}
                            value={leadPhone}
                            onChange={(e) => setLeadPhone(e.target.value)}
                            className="w-full rounded-xl px-3 py-2 text-sm text-gray-900"
                        />
                        <button
                            type="submit"
                            disabled={sendingLead}
                            className="bg-white hover:bg-blue-50 text-blue-900 font-bold py-2.5 rounded-2xl text-xs transition-colors shadow-card w-full disabled:opacity-50 border border-line"
                        >
                            {sendingLead ? tUZ('Yuborilmoqda...') : tUZ("So'rovni yuborish")}
                        </button>
                    </form>
                ) : (
                    <button
                        onClick={() => setShowLeadForm(true)}
                        className="bg-white hover:bg-blue-50 text-blue-900 font-bold py-2.5 rounded-2xl text-xs transition-colors shadow-card w-full mt-6 border border-line"
                    >
                        {tUZ("Mutaxassis bilan bog'lanish")}
                    </button>
                )}
            </div>
        </div>
    );
};

export default ExportScreen;
