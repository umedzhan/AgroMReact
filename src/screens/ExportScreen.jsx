import React, { useState } from 'react';
import { FaPlane, FaTruck, FaShip, FaFlag, FaPassport, FaCheckCircle, FaSpinner, FaMapMarkedAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { tUZ } from '../utils/translateHelper';
import { useTranslation } from 'react-i18next';

const ExportScreen = () => {
    useTranslation();
    // Mode selectors
    const [selectedMode, setSelectedMode] = useState('all');

    // Shipments mock list
    const shipments = [
        {
            id: 'EXP-TR881',
            destination: tUZ('Rossiya (Moskva)'),
            mode: 'land',
            cargo: tUZ('Qizil Pomidor (18 tonna)'),
            status: 'cleared',
            statusLabel: tUZ('Bojxonadan o\'tdi'),
            eta: '2026-06-12'
        },
        {
            id: 'EXP-TR882',
            destination: tUZ('Turkiya (Istanbul)'),
            mode: 'sea',
            cargo: tUZ('Bug\'doy (45 tonna)'),
            status: 'inspection',
            statusLabel: tUZ('Bojxona tekshiruvida'),
            eta: '2026-06-18'
        },
        {
            id: 'EXP-TR883',
            destination: tUZ('BAA (Dubay)'),
            mode: 'air',
            cargo: tUZ('Shirin Gilos (2.5 tonna)'),
            status: 'documents',
            statusLabel: tUZ('Hujjat kutilmoqda'),
            eta: '2026-06-09'
        },
        {
            id: 'EXP-TR884',
            destination: tUZ('Qozog\'iston (Almati)'),
            mode: 'land',
            cargo: tUZ('Sariq Sabzi (12 tonna)'),
            status: 'cleared',
            statusLabel: tUZ('Bojxonadan o\'tdi'),
            eta: '2026-06-08'
        }
    ];

    // Country stats data
    const countryStats = [
        { name: tUZ('Rossiya'), tons: 250, percent: 85, flag: '🇷🇺' },
        { name: tUZ('Qozog\'iston'), tons: 120, percent: 55, flag: '🇰🇿' },
        { name: tUZ('Turkiya'), tons: 85, percent: 40, flag: '🇹🇷' },
        { name: tUZ('BAA'), tons: 35, percent: 20, flag: '🇦🇪' }
    ];

    const filteredShipments = selectedMode === 'all' 
        ? shipments 
        : shipments.filter(s => s.mode === selectedMode);

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8 animate-fadeIn">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 flex items-center gap-2">
                    <FaMapMarkedAlt className="text-blue-600" />
                    {tUZ("Logistika va Eksport Nazorati")}
                </h1>
                <p className="text-gray-500 text-sm">{tUZ("Xalqaro buyurtmalarning yetkazilishi, bojxona rasmiylashtiruvi va eksport statistikasi.")}</p>
            </div>

            {/* Logistics Modes Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Air freight */}
                <div 
                    onClick={() => setSelectedMode(selectedMode === 'air' ? 'all' : 'air')}
                    className={`bg-white border rounded-2xl p-5 shadow-sm cursor-pointer hover:shadow-md transition-all flex items-center gap-4 ${
                        selectedMode === 'air' ? 'border-blue-500 bg-blue-50/20' : 'border-gray-150'
                    }`}
                >
                    <div className="bg-blue-50 text-blue-600 p-4 rounded-full">
                        <FaPlane size={24} />
                    </div>
                    <div>
                        <h3 className="font-extrabold text-gray-900 text-base">{tUZ("Havo Yo'llari")}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">{tUZ("Tezkor yetkazish | 1 ta faol yuk")}</p>
                    </div>
                </div>

                {/* Land transport */}
                <div 
                    onClick={() => setSelectedMode(selectedMode === 'land' ? 'all' : 'land')}
                    className={`bg-white border rounded-2xl p-5 shadow-sm cursor-pointer hover:shadow-md transition-all flex items-center gap-4 ${
                        selectedMode === 'land' ? 'border-blue-500 bg-blue-50/20' : 'border-gray-150'
                    }`}
                >
                    <div className="bg-emerald-50 text-emerald-600 p-4 rounded-full">
                        <FaTruck size={24} />
                    </div>
                    <div>
                        <h3 className="font-extrabold text-gray-900 text-base">{tUZ("Quruqlik Yo'llari")}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">{tUZ("Standart eksport | 2 ta faol yuk")}</p>
                    </div>
                </div>

                {/* Sea cargo */}
                <div 
                    onClick={() => setSelectedMode(selectedMode === 'sea' ? 'all' : 'sea')}
                    className={`bg-white border rounded-2xl p-5 shadow-sm cursor-pointer hover:shadow-md transition-all flex items-center gap-4 ${
                        selectedMode === 'sea' ? 'border-blue-500 bg-blue-50/20' : 'border-gray-150'
                    }`}
                >
                    <div className="bg-purple-50 text-purple-600 p-4 rounded-full">
                        <FaShip size={24} />
                    </div>
                    <div>
                        <h3 className="font-extrabold text-gray-900 text-base">{tUZ("Dengiz Karteri")}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">{tUZ("Yirik hajmli yuklar | 1 ta faol yuk")}</p>
                    </div>
                </div>
            </div>

            {/* Active customs tracking list */}
            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-6">
                <div>
                    <h3 className="font-extrabold text-gray-900 text-lg">{tUZ("Faol Bojxona va Eksport Yuklari")}</h3>
                    <p className="text-gray-500 text-xs">{tUZ("Bojxona nazoratidagi yuklarning holati va taxminiy etib borish vaqti.")}</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600 min-w-[600px] divide-y divide-gray-100">
                        <thead>
                            <tr className="text-xs text-gray-400 font-bold uppercase pb-3 bg-gray-50/50">
                                <th className="p-3.5">{tUZ("ID")}</th>
                                <th className="p-3.5">{tUZ("Manzil")}</th>
                                <th className="p-3.5">{tUZ("Yuk turi")}</th>
                                <th className="p-3.5">{tUZ("Transport")}</th>
                                <th className="p-3.5">{tUZ("Bojxona Statusi")}</th>
                                <th className="p-3.5">{tUZ("Kutilayotgan sana")}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredShipments.map((ship) => (
                                <tr key={ship.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-3.5 font-bold text-gray-900">{ship.id}</td>
                                    <td className="p-3.5 font-semibold text-gray-800">{ship.destination}</td>
                                    <td className="p-3.5 text-xs">{ship.cargo}</td>
                                    <td className="p-3.5 capitalize text-xs">
                                        {ship.mode === 'air' ? tUZ('✈️ Havo') : ship.mode === 'land' ? tUZ('🚚 Quruqlik') : tUZ('🚢 Dengiz')}
                                    </td>
                                    <td className="p-3.5">
                                        <span className={`text-[10px] font-extrabold py-0.5 px-2 rounded-full flex items-center gap-1.5 w-max ${
                                            ship.status === 'cleared' 
                                                ? 'bg-green-50 text-brand' 
                                                : ship.status === 'inspection'
                                                ? 'bg-amber-50 text-amber-600 animate-pulse'
                                                : 'bg-red-50 text-red-500'
                                        }`}>
                                            {ship.status === 'cleared' ? <FaCheckCircle size={10} /> : <FaSpinner className={ship.status === 'inspection' ? 'animate-spin' : ''} size={10} />}
                                            {tUZ(ship.statusLabel)}
                                        </span>
                                    </td>
                                    <td className="p-3.5 font-bold text-gray-700 text-xs">{ship.eta}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Country wise Export stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Stats chart */}
                <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-6">
                    <div>
                        <h3 className="font-extrabold text-gray-900 text-lg">{tUZ("Eksport Statistikasi (Mamlakat bo'yicha)")}</h3>
                        <p className="text-gray-500 text-xs">{tUZ("2026-yilgi umumiy eksport qilingan mahsulot hajmi (tonnada).")}</p>
                    </div>

                    <div className="space-y-4">
                        {countryStats.map((c, index) => (
                            <div key={index} className="space-y-1.5">
                                <div className="flex justify-between text-xs font-bold text-gray-700">
                                    <span className="flex items-center gap-1.5">{c.flag} {tUZ(c.name)}</span>
                                    <span>{c.tons} {tUZ("tonna")}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-3.5 overflow-hidden">
                                    <div 
                                        className="bg-blue-500 h-3.5 rounded-full transition-all duration-1000" 
                                        style={{ width: `${c.percent}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Logistics Info Card */}
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
                    <button 
                        onClick={() => toast.success(tUZ("Bizning konsultantlarimiz tez orada siz bilan bog'lanishadi."))}
                        className="bg-white hover:bg-blue-50 text-blue-900 font-bold py-2.5 rounded-xl text-xs transition-colors shadow-sm w-full mt-6"
                    >
                        {tUZ("Mutaxassis bilan bog'lanish")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExportScreen;
