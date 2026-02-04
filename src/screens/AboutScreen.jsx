import React from 'react';
import { Link } from 'react-router-dom';
import { FaLeaf, FaShippingFast, FaHeadset, FaShieldAlt, FaCheckCircle } from 'react-icons/fa';

const AboutScreen = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="bg-green-50 p-8 rounded-lg mb-12 text-center bg-[url('/images/breadcrumb.jpg')] bg-cover bg-center relative">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">About Us</h1>
                    <div className="flex justify-center space-x-2 text-sm text-gray-500">
                        <Link to="/" className="hover:text-brand">Home</Link>
                        <span>/</span>
                        <span className="text-brand font-medium">About Us</span>
                    </div>
                </div>
            </div>

            {/* Introduction Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
                <div className="relative">
                    {/* Placeholder for About Image. Real app should use a real image */}
                    <img
                        src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                        alt="Fresh Vegetables"
                        className="rounded-2xl shadow-xl w-full object-cover h-[500px]"
                    />
                    <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg border border-gray-100 hidden md:block">
                        <div className="flex items-center space-x-4">
                            <div className="bg-green-100 p-3 rounded-full text-brand">
                                <FaLeaf className="text-2xl" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-gray-900">100% Organic</h4>
                                <p className="text-gray-500 text-sm">Fresh & Non-GMO</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                        We Deliver the Best <span className="text-brand">Organic Food</span> from our Farm to your Details.
                    </h2>
                    <p className="text-gray-500 mb-6 leading-relaxed">
                        AgroM is dedicated to providing the freshest, highest quality organic produce directly from local farmers to your table. We believe in sustainable agriculture and fair trade practices that benefit both our growers and our customers.
                    </p>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                        Our mission is to make healthy eating accessible to everyone while supporting the local economy. Every product you buy from us is carefully selected and quality checked to ensure you receive only the best nature has to offer.
                    </p>

                    <ul className="space-y-4 mb-8">
                        <li className="flex items-start space-x-3">
                            <FaCheckCircle className="text-brand mt-1 flex-shrink-0" />
                            <span className="text-gray-700">Fresh products harvested daily</span>
                        </li>
                        <li className="flex items-start space-x-3">
                            <FaCheckCircle className="text-brand mt-1 flex-shrink-0" />
                            <span className="text-gray-700">100% Organic & Natural</span>
                        </li>
                        <li className="flex items-start space-x-3">
                            <FaCheckCircle className="text-brand mt-1 flex-shrink-0" />
                            <span className="text-gray-700">Quality checked and approved</span>
                        </li>
                        <li className="flex items-start space-x-3">
                            <FaCheckCircle className="text-brand mt-1 flex-shrink-0" />
                            <span className="text-gray-700">Supporting local farmers</span>
                        </li>
                    </ul>

                    <Link to="/shop" className="inline-block bg-brand hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:-translate-y-1">
                        Shop Now
                    </Link>
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-gray-50 rounded-2xl p-8 lg:p-12 mb-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-brand text-2xl">
                            <FaShippingFast />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Free Shipping</h3>
                        <p className="text-gray-500 text-sm">Free shipping with discount</p>
                    </div>
                    <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-brand text-2xl">
                            <FaHeadset />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Great Support 24/7</h3>
                        <p className="text-gray-500 text-sm">Instant access to Contact</p>
                    </div>
                    <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-brand text-2xl">
                            <FaShieldAlt />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">100% Secure Payment</h3>
                        <p className="text-gray-500 text-sm">We ensure your money is save</p>
                    </div>
                </div>
            </div>

            {/* Team Section (Optional, can be static for now) */}
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Awesome Team</h2>
                <p className="text-gray-500 max-w-2xl mx-auto">
                    Meet the dedicated professionals who work hard to ensure you get the best quality products and service.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Team Member 1 */}
                <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
                    <div className="h-64 overflow-hidden">
                        <img src="/images/ourteam/behruz_karimov.png" alt="Team Member" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="p-6 text-center">
                        <h3 className="text-lg font-bold text-gray-900">Karimov Behruz</h3>
                        <p className="text-brand text-sm mb-3">CEO & Founder</p>
                    </div>
                </div>

                {/* Team Member 2 */}
                <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
                    <div className="h-64 overflow-hidden">
                        <img src="/images/ourteam/usmon_rakhimjonov.png" alt="Team Member" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="p-6 text-center">
                        <h3 className="text-lg font-bold text-gray-900">Karimjonov Usmon</h3>
                        <p className="text-brand text-sm mb-3">Rivojlanish va aloqlar bo‘yicha maslahatchi</p>
                    </div>
                </div>

                {/* Team Member 3 */}
                <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
                    <div className="h-64 overflow-hidden">
                        <img src="/images/ourteam/azizbek_jorayev.png" alt="Team Member" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="p-6 text-center">
                        <h3 className="text-lg font-bold text-gray-900">Jo'rayev Azizbek</h3>
                        <p className="text-brand text-sm mb-3">FullStack developer</p>
                    </div>
                </div>

                {/* Team Member 4 */}
                <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
                    <div className="h-64 overflow-hidden">
                        <img src="/images/ourteam/umedjon_karayev.png" alt="Team Member" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="p-6 text-center">
                        <h3 className="text-lg font-bold text-gray-900">Karayev Umedjon</h3>
                        <p className="text-brand text-sm mb-3">Backend Developer</p>
                    </div>
                </div>

                {/* Team Member 5 */}
                <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
                    <div className="h-64 overflow-hidden">
                        <img src="/images/ourteam/durdona_kattayeva.png" alt="Team Member" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="p-6 text-center">
                        <h3 className="text-lg font-bold text-gray-900">Kattayeva Durdona</h3>
                        <p className="text-brand text-sm mb-3">FullStack Developer</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutScreen;
