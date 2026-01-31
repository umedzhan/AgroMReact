import React from 'react';
import { FaTruck, FaHeadset, FaShoppingBag, FaBox } from 'react-icons/fa';

const InfoSection = () => {
    const items = [
        {
            icon: <FaTruck size={32} />,
            title: 'Free Shipping',
            subtitle: 'Free shipping on all your order'
        },
        {
            icon: <FaHeadset size={32} />,
            title: 'Customer Support 24/7',
            subtitle: 'Instant access to Support'
        },
        {
            icon: <FaShoppingBag size={32} />,
            title: '100% Secure Payment',
            subtitle: 'We ensure your money is save'
        },
        {
            icon: <FaBox size={32} />,
            title: 'Money-Back Guarantee',
            subtitle: '30 Days Money-Back Guarantee'
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
