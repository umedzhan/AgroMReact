import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaCheckCircle, FaSpinner, FaExternalLinkAlt, FaPlus, FaTruck, FaRoute } from 'react-icons/fa';
import { tUZ } from '../utils/translateHelper';
import AuthContext from '../context/AuthContext';
import Loader from '../components/Loader';

const STATUS_BADGE = {
    verified: { label: "Tasdiqlangan", className: 'bg-brand-50 text-brand-700 ring-brand-100' },
    pending: { label: "Tekshirilmoqda", className: 'bg-harvest-50 text-harvest-700 ring-harvest-100' },
    outdated: { label: "Eskirgan", className: 'bg-red-50 text-red-700 ring-red-100' },
};

const control =
    'w-full rounded-xl border border-line-strong bg-white px-3.5 text-[15px] text-ink-900 placeholder:text-ink-300 transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10';

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
        <div className="space-y-8">
            {/* Hero */}
            <section className="relative overflow-hidden rounded-3xl bg-ink-950 text-white shadow-lift">
                <div className="bg-grid-dark absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_right,black_20%,transparent_70%)]" />
                <div className="absolute -left-40 top-20 size-[500px] rounded-full bg-brand-600/20 blur-3xl" />
                <div className="absolute -right-20 -top-20 size-[400px] rounded-full bg-harvest-400/10 blur-3xl" />
                <svg className="absolute bottom-0 right-0 hidden h-full w-1/2 opacity-40 lg:block" viewBox="0 0 600 500" fill="none" aria-hidden>
                    <path d="M40 420 C 180 380, 220 260, 330 240 S 520 120, 580 60" stroke="url(#exportRoute)" strokeWidth="2" strokeDasharray="6 8" />
                    {[[40, 420], [330, 240], [580, 60]].map(([x, y], i) => (
                        <circle key={i} cx={x} cy={y} r={i === 1 ? 6 : 5} fill={i === 2 ? '#f0a52c' : '#4ca171'} />
                    ))}
                    <defs>
                        <linearGradient id="exportRoute" x1="0" x2="1">
                            <stop stopColor="#4ca171" />
                            <stop offset="1" stopColor="#f0a52c" />
                        </linearGradient>
                    </defs>
                </svg>
                <div className="relative px-6 py-12 md:px-12 md:py-20">
                    <div className="max-w-3xl">
                        <div className="mb-5 font-mono text-xs text-harvest-300">🌍 export.agrom24.uz</div>
                        <h1 className="text-balance text-4xl font-extrabold leading-[1.04] md:text-6xl">
                            {tUZ("Eksport bo'yicha davlat talablari")}
                        </h1>
                        <p className="mt-6 max-w-2xl text-lg text-ink-200 md:text-xl">
                            {tUZ("Davlatni tanlang va shu davlatga eksport qilish uchun qanday talablar borligini ko'ring. Har bir talab rasmiy manbaga ishora qiladi.")}
                        </p>
                    </div>
                    {countries.length > 0 && (
                        <div className="mt-10 flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur md:p-4">
                            {countries.map((c) => (
                                <button
                                    key={c.code}
                                    onClick={() => setSelectedCountry(c.code)}
                                    className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition ${
                                        selectedCountry === c.code
                                            ? 'bg-harvest-400 text-ink-950'
                                            : 'bg-white/10 text-ink-100 hover:bg-white/20'
                                    }`}
                                >
                                    <span>{c.flag}</span> {tUZ(c.name.uz)}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Requirements */}
            <section className="card p-5 md:p-8">
                <div className="mb-6 flex flex-col gap-1">
                    <div className="eyebrow">{selectedCountryData ? `${selectedCountryData.flag} ${tUZ(selectedCountryData.name.uz)}` : tUZ("Rasmiy manba")}</div>
                    <h2 className="text-2xl font-bold text-ink-900 md:text-3xl">{tUZ("Eksport bo'yicha davlat talablari")}</h2>
                </div>
                {loadingRequirements ? (
                    <Loader />
                ) : (
                    <div className="grid gap-3 md:grid-cols-2">
                        {requirements.length === 0 && (
                            <p className="text-sm text-ink-500">{tUZ("Bu davlat uchun hali talab qo'shilmagan.")}</p>
                        )}
                        {requirements.map((r) => {
                            const badge = STATUS_BADGE[r.verificationStatus] || STATUS_BADGE.pending;
                            return (
                                <div key={r._id} className="flex flex-col gap-3 rounded-2xl border border-line bg-canvas/60 p-4 md:p-5">
                                    <div className="flex items-start justify-between gap-3">
                                        <p className="font-display font-bold text-ink-900">{r.title?.uz}</p>
                                        <span className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${badge.className}`}>
                                            {r.verificationStatus === 'verified' ? <FaCheckCircle size={10} /> : <FaSpinner size={10} />}
                                            {tUZ(badge.label)}
                                        </span>
                                    </div>
                                    <div className="mt-auto space-y-1">
                                        {r.sourceName && (
                                            <a
                                                href={r.sourceUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:underline"
                                            >
                                                {tUZ("Rasmiy manba")}: {r.sourceName} <FaExternalLinkAlt size={9} />
                                            </a>
                                        )}
                                        <p className="text-xs text-ink-400">
                                            {tUZ("Oxirgi tekshiruv")}: {r.lastVerified ? new Date(r.lastVerified).toLocaleDateString() : '—'}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Logistics estimate */}
                <section className="card flex flex-col p-5 md:p-8">
                    <div className="mb-6 flex items-start gap-4">
                        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-ink-50 text-ink-700"><FaTruck /></span>
                        <div>
                            <h3 className="font-display text-xl font-bold text-ink-900">{tUZ("Logistika narxini taxminiy hisoblash")}</h3>
                            <p className="mt-1 text-sm text-ink-500">{tUZ("Bu taxminiy baho. Haqiqiy narx tashuvchi kompaniyaga bog'liq holda farq qilishi mumkin.")}</p>
                        </div>
                    </div>
                    <div className="mt-auto flex flex-wrap items-end gap-4">
                        <label className="block">
                            <span className="mb-1.5 block text-sm font-medium text-ink-700">{tUZ("Hajmi (tonna)")}</span>
                            <input
                                type="number"
                                min="0.1"
                                step="0.1"
                                value={logisticsWeight}
                                onChange={(e) => setLogisticsWeight(e.target.value)}
                                className={`${control} h-11 w-32`}
                            />
                        </label>
                        {loadingLogistics ? (
                            <Loader />
                        ) : logisticsEstimate ? (
                            <div className="flex-1 rounded-2xl bg-brand-50 px-4 py-3">
                                <p className="font-display text-2xl font-extrabold text-brand-800">
                                    ≈ ${logisticsEstimate.estimatedTotalUsd.toLocaleString()}
                                    <span className="ml-2 text-sm font-semibold text-brand-700">{logisticsEstimate.transitDays[0]}–{logisticsEstimate.transitDays[1]} {tUZ("kun")}</span>
                                </p>
                                <p className="mt-0.5 text-xs text-brand-700/80">{tUZ(logisticsEstimate.note)}</p>
                            </div>
                        ) : (
                            <p className="text-sm text-ink-400">{tUZ("Hisoblash uchun davlat va hajmni tanlang.")}</p>
                        )}
                    </div>
                </section>

                {/* Consultation CTA */}
                <section className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-ink-950 p-5 text-white shadow-lift md:p-8">
                    <div className="bg-grid-dark absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
                    <div className="absolute -right-16 -top-16 size-56 rounded-full bg-brand-500/25 blur-3xl" />
                    <div className="relative space-y-4">
                        <span className="inline-block text-xs font-bold uppercase tracking-[0.16em] text-harvest-300">
                            {tUZ("Eksportga Tavsiyalar")}
                        </span>
                        <h3 className="font-display text-2xl font-bold leading-tight">{tUZ("Yevropa Ittifoqiga eksport qilish uchun imtiyozlar bormi?")}</h3>
                        <p className="text-sm leading-relaxed text-ink-200">
                            {tUZ("O'zbekiston GSP+ tizimi doirasida 6000 dan ortiq tovar turlarini Yevropa Ittifoqiga bojxona to'lovlarisiz eksport qilishi mumkin. Hujjatlarni rasmiylashtirish bo'yicha bizning bepul maslahatchilarimiz xizmatidan foydalaning.")}
                        </p>
                    </div>
                    {showLeadForm ? (
                        <form onSubmit={sendLead} className="relative mt-6 space-y-2">
                            <textarea
                                rows="2"
                                required
                                placeholder={tUZ("Qanday mahsulot, qancha hajmda eksport qilmoqchisiz?")}
                                value={leadMessage}
                                onChange={(e) => setLeadMessage(e.target.value)}
                                className={`${control} py-2.5`}
                            />
                            <input
                                type="tel"
                                required
                                placeholder={tUZ("Telefon raqamingiz")}
                                value={leadPhone}
                                onChange={(e) => setLeadPhone(e.target.value)}
                                className={`${control} h-11`}
                            />
                            <button type="submit" disabled={sendingLead} className="btn-harvest w-full">
                                {sendingLead ? tUZ('Yuborilmoqda...') : tUZ("So'rovni yuborish")}
                            </button>
                        </form>
                    ) : (
                        <button onClick={() => setShowLeadForm(true)} className="btn-harvest relative mt-6 w-full">
                            {tUZ("Mutaxassis bilan bog'lanish")}
                        </button>
                    )}
                </section>
            </div>

            {user && (
                <section className="card space-y-5 p-5 md:p-8">
                    <div className="flex items-start gap-4">
                        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-harvest-400 text-ink-950"><FaRoute /></span>
                        <div>
                            <h3 className="font-display text-xl font-bold text-ink-900">{tUZ("Mening eksport jarayonlarim")}</h3>
                            <p className="mt-1 text-sm text-ink-500">
                                {selectedCountryData ? `${tUZ("Tanlangan davlat")}: ${selectedCountryData.flag} ${tUZ(selectedCountryData.name.uz)}` : ''}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={startOperation} className="flex flex-wrap items-end gap-3">
                        <select
                            value={newOpProduct}
                            onChange={(e) => setNewOpProduct(e.target.value)}
                            className={`${control} h-11 w-auto min-w-[200px] cursor-pointer`}
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
                            className={`${control} h-11 w-40`}
                            required
                        />
                        <button type="submit" disabled={startingOp} className="btn-primary">
                            <FaPlus size={10} /> {tUZ("Boshlash")}
                        </button>
                    </form>

                    <div className="grid gap-2 md:grid-cols-2">
                        {operations.length === 0 && (
                            <p className="text-sm text-ink-500">{tUZ("Hali eksport jarayoni boshlanmagan.")}</p>
                        )}
                        {operations.map((op) => (
                            <div key={op._id} className="flex items-center justify-between gap-3 rounded-2xl border border-line p-4 text-sm">
                                <span className="font-semibold text-ink-800">
                                    {op.product?.name || '—'} → {op.countryCode} ({op.quantityTons} t)
                                </span>
                                <span className="whitespace-nowrap rounded-full bg-harvest-50 px-2.5 py-0.5 text-xs font-semibold text-harvest-700 ring-1 ring-inset ring-harvest-100">
                                    {tUZ("Bosqich")}: {op.currentStage}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default ExportScreen;
