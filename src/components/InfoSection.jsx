import React from 'react';
import { FaTruck, FaHeadset, FaShoppingBag, FaBox } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const InfoSection = () => {
    const { t } = useTranslation();

    const items = [
        {
            icon: <FaTruck size={20} />,
            title: t('info.free_shipping'),
            subtitle: t('info.free_shipping_desc')
        },
        {
            icon: <FaHeadset size={20} />,
            title: t('info.support'),
            subtitle: t('info.support_desc')
        },
        {
            icon: <FaShoppingBag size={20} />,
            title: t('info.payment'),
            subtitle: t('info.payment_desc')
        },
        {
            icon: <FaBox size={20} />,
            title: t('info.guarantee'),
            subtitle: t('info.guarantee_desc')
        }
    ];

    return (
        <section className="py-10">
            <div className="card grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 lg:divide-x divide-line">
                {items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-5 md:p-6">
                        <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                            {item.icon}
                        </div>
                        <div>
                            <h3 className="font-bold text-ink-900">{item.title}</h3>
                            <p className="text-ink-500 text-sm">{item.subtitle}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default InfoSection;
