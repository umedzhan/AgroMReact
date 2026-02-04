import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Hero = () => {
    const { t } = useTranslation();

    return (
        <section className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Banner */}
                <div className="lg:col-span-2 relative bg-gray-100 rounded-lg overflow-hidden h-[400px] flex items-center">
                    <img
                        src="/images/hero-delivery.png"
                        alt="Delivery"
                        className="absolute inset-0 w-full h-full object-cover z-0"
                    />
                    <div className="relative z-10 pl-12 max-w-lg">
                        <span className="text-brand font-medium tracking-wide uppercase text-sm mb-2 block">{t('hero.welcome')}</span>
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-4">
                            {t('hero.delivery_text')}
                        </h1>
                        <p className="text-gray-500 mb-8">{t('hero.free_shipping_note')}</p>
                        <Link to="/shop" className="bg-brand text-white px-8 py-3 rounded-full font-semibold hover:bg-brand-dark transition-colors inline-flex items-center">
                            {t('hero.shop_now')} <FaArrowRight className="ml-2" />
                        </Link>
                    </div>
                </div>

                {/* Side Banner */}
                <div className="relative bg-green-50 rounded-lg overflow-hidden h-[400px]">
                    <img
                        src="/images/hero-vegetables.png"
                        alt="Vegetables"
                        className="absolute inset-0 w-full h-full object-cover z-0"
                    />
                    <div className="relative z-10 p-8 h-full flex flex-col justify-start">
                        <span className="text-gray-900 font-medium tracking-wide uppercase text-sm mb-2">{t('hero.summer_sale')}</span>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            {t('hero.off_75')}
                        </h2>
                        <h3 className="text-gray-600 mb-4">
                            {t('hero.only_fruit_veg')}
                        </h3>
                        <Link to="/shop" className="text-brand font-bold hover:text-brand-dark transition-colors inline-flex items-center mt-auto">
                            {t('hero.shop_now')} <FaArrowRight className="ml-2" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
