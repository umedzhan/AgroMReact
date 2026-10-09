import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Hero = () => {
    const { t } = useTranslation();

    return (
        <section className="relative">
            <div className="bg-grid pointer-events-none absolute inset-x-0 -top-8 h-[420px] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
            <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 py-2 lg:py-4">
                {/* Main Banner */}
                <div className="lg:col-span-2 relative overflow-hidden rounded-3xl border border-line bg-white shadow-card aspect-[4/3] md:aspect-auto md:h-[420px] flex items-center">
                    <img
                        src="/images/hero-delivery.png"
                        alt="Delivery"
                        className="absolute inset-0 w-full h-full object-cover z-0"
                    />
                    <div className="absolute inset-0 z-0 bg-gradient-to-r from-white/95 via-white/80 md:via-white/70 to-transparent" />
                    <div className="relative z-10 p-6 md:pl-12 max-w-lg animate-fade-up">
                        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-white/80 py-1 pl-1 pr-3 text-xs font-semibold text-ink-600 shadow-sm backdrop-blur">
                            <span className="rounded-full bg-ink-900 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white">AgroM</span>
                            {t('hero.welcome')}
                        </span>
                        <h1 className="text-[2rem] md:text-6xl font-extrabold text-ink-950 leading-[1.04] mb-4 text-balance">
                            {t('hero.delivery_text')}
                        </h1>
                        <p className="text-ink-500 mb-6 md:mb-8 text-sm md:text-lg">{t('hero.free_shipping_note')}</p>
                        <Link to="/shop" className="btn-primary group">
                            {t('hero.shop_now')} <FaArrowRight className="transition group-hover:translate-x-0.5" />
                        </Link>
                    </div>
                </div>

                {/* Side Banner */}
                <div className="hidden lg:block relative overflow-hidden rounded-3xl bg-ink-950 text-white shadow-lift h-[420px]">
                    <img
                        src="/images/hero-vegetables.png"
                        alt="Vegetables"
                        className="absolute inset-0 w-full h-full object-cover z-0 opacity-60"
                    />
                    <div className="absolute inset-0 z-0 bg-gradient-to-b from-ink-950/80 via-ink-950/30 to-ink-950/80" />
                    <div className="absolute -right-16 -top-16 size-56 rounded-full bg-brand-500/25 blur-3xl" />
                    <div className="relative z-10 p-8 h-full flex flex-col justify-start">
                        <span className="text-xs font-bold uppercase tracking-[0.16em] text-harvest-300 mb-3">{t('hero.summer_sale')}</span>
                        <h2 className="text-4xl font-extrabold mb-2">
                            {t('hero.off_75')}
                        </h2>
                        <h3 className="text-ink-200 mb-4">
                            {t('hero.only_fruit_veg')}
                        </h3>
                        <Link to="/shop" className="btn-harvest group mt-auto self-start">
                            {t('hero.shop_now')} <FaArrowRight className="transition group-hover:translate-x-0.5" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
