import React from 'react';
import { FaTruck, FaHeadset, FaShoppingBag, FaBox } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const InfoSection = () => {
    const { t } = useTranslation();

    const items = [
        {
            icon: <FaTruck size={32} />,
            title: t('info.free_shipping'),
            subtitle: t('info.free_shipping_desc')
        },
        {
            icon: <FaHeadset size={32} />,
            title: t('info.support'),
            subtitle: t('info.support_desc')
        },
        {
            icon: <FaShoppingBag size={32} />,
            title: t('info.payment'),
            subtitle: t('info.payment_desc')
        },
        {
            icon: <FaBox size={32} />,
            title: t('info.guarantee'),
            subtitle: t('info.guarantee_desc')
        }
    ];

    return (
        <section className="container mx-auto px-4 py-12">
            <div className="bg-white rounded-lg shadow-sm p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4">
                        <div className="text-brand">
                            {item.icon}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
                            <p className="text-gray-500 text-sm">{item.subtitle}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default InfoSection;
