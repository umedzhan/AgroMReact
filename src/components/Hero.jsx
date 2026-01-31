import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const Hero = () => {
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
                        <span className="text-brand font-medium tracking-wide uppercase text-sm mb-2 block">Welcome to Ecobazar</span>
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-4">
                            We Delivery on <span className="text-brand">Next Day</span> from 10:00 AM to 08:00 PM
                        </h1>
                        <p className="text-gray-500 mb-8">* For free shipping orders starts from $100</p>
                        <Link to="/shop" className="bg-brand text-white px-8 py-3 rounded-full font-semibold hover:bg-brand-dark transition-colors inline-flex items-center">
                            Shop Now <FaArrowRight className="ml-2" />
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
                        <span className="text-gray-900 font-medium tracking-wide uppercase text-sm mb-2">Summer Sale</span>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            75% OFF
                        </h2>
                        <h3 className="text-gray-600 mb-4">
                            Only Fruit & Vegetable
                        </h3>
                        <Link to="/shop" className="text-brand font-bold hover:text-brand-dark transition-colors inline-flex items-center mt-auto">
                            Shop Now <FaArrowRight className="ml-2" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
