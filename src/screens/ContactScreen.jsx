import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';

const ContactScreen = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="bg-green-50 p-8 rounded-lg mb-12 text-center bg-[url('/images/breadcrumb.jpg')] bg-cover bg-center relative">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
                    <div className="flex justify-center space-x-2 text-sm text-gray-500">
                        <Link to="/" className="hover:text-brand">Home</Link>
                        <span>/</span>
                        <span className="text-brand font-medium">Contact Us</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                {/* Contact Info Cards */}
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 text-2xl">
                        <FaMapMarkerAlt />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Address</h3>
                    <p className="text-gray-500">
                        Termez, Surkhandarya,<br /> Uzbekistan
                    </p>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 text-2xl">
                        <FaEnvelope />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Email Address</h3>
                    <p className="text-gray-500">
                        <a href="mailto:agrom.contact@gmail.com" className="hover:text-brand">agrom.contact@gmail.com</a>
                    </p>
                    <p className="text-gray-500">
                        <a href="mailto:support@agrom.com" className="hover:text-brand">support@agrom.com</a>
                    </p>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 text-2xl">
                        <FaPhoneAlt />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Phone Number</h3>
                    <p className="text-gray-500">
                        <a href="tel:+998999970515" className="hover:text-brand">(99) 997-05-15</a>
                    </p>
                    <p className="text-gray-500">
                        <a href="tel:+998999970515" className="hover:text-brand">+998 (99) 997-05-15</a>
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-8 lg:p-12 rounded-2xl shadow-lg border border-gray-100">
                {/* Contact Form */}
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Just Say Hello!</h2>
                    <p className="text-gray-500 mb-8">Do you have any questions? We would love to hear from you.</p>

                    <form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <input type="text" placeholder="Your Name" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" />
                            </div>
                            <div>
                                <input type="email" placeholder="Your Email" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" />
                            </div>
                        </div>
                        <div>
                            <input type="text" placeholder="Subject" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" />
                        </div>
                        <div>
                            <textarea rows="5" placeholder="Message" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"></textarea>
                        </div>
                        <button type="submit" className="bg-brand text-white font-bold py-3 px-8 rounded-full hover:bg-green-700 transition-colors transform hover:-translate-y-1 duration-200">
                            Send Message
                        </button>
                    </form>
                </div>

                {/* Map Placeholder or Additional Text */}
                <div className="h-full min-h-[400px] bg-gray-100 rounded-xl overflow-hidden relative group">
                    {/* Placeholder for Map. Using an image or iframe would be better, but for now a styled placeholder */}
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3096.3684827017835!2d67.2755255!3d37.2274488!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f353a8b2772591b%3A0x6b87617326b47c0!2sTermez%2C%20Surkhandarya%20Region%2C%20Uzbekistan!5e0!3m2!1sen!2s!4v1695555555555!5m2!1sen!2s"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default ContactScreen;
