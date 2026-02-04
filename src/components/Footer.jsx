import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaPinterestP } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Column 1: Brand & About */}
                    <div>
                        <Link to="/" className="flex items-center space-x-2 mb-4">
                            <img src="/images/logo.png" alt="AgroM Logo" className="h-20 w-auto object-contain" />
                        </Link>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Morbi cursus porttitor enim lobortis molestie. Duis gravida turpis dui, eget bibendum magna congue nec.
                        </p>
                        <div className="flex flex-col space-y-2">
                            <a href="tel:+998999970515" className="text-white hover:text-brand transition-colors text-lg font-bold border-b-2 border-brand pb-1 w-max">
                                (99) 997-05-15
                            </a>
                            <span className="text-gray-500 text-sm">{t('footer.or')}</span>
                            <a href="mailto:agrom.contact@gmail.com" className="text-white hover:text-brand transition-colors text-lg font-bold border-b-2 border-brand pb-1 w-max">
                                agrom.contact@gmail.com
                            </a>
                        </div>
                    </div>

                    {/* Column 2: My Account */}
                    <div>
                        <h4 className="text-white text-lg font-medium mb-6">{t('footer.my_account')}</h4>
                        <ul className="space-y-3">
                            <li><Link to="/profile" className="hover:text-white transition-colors">{t('footer.my_account')}</Link></li>
                            <li><Link to="/order-history" className="hover:text-white transition-colors">{t('footer.order_history')}</Link></li>
                            <li><Link to="/cart" className="hover:text-white transition-colors">{t('footer.shopping_cart')}</Link></li>
                            <li><Link to="/wishlist" className="hover:text-white transition-colors">{t('footer.wishlist')}</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Helps */}
                    <div>
                        <h4 className="text-white text-lg font-medium mb-6">{t('footer.helps')}</h4>
                        <ul className="space-y-3">
                            <li><Link to="/contact" className="hover:text-white transition-colors">{t('footer.contact')}</Link></li>
                            <li><Link to="/faqs" className="hover:text-white transition-colors">{t('footer.faqs')}</Link></li>
                            <li><Link to="/terms" className="hover:text-white transition-colors">{t('footer.terms_condition')}</Link></li>
                            <li><Link to="/privacy" className="hover:text-white transition-colors">{t('footer.privacy_policy')}</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Proxy */}
                    <div>
                        <h4 className="text-white text-lg font-medium mb-6">{t('footer.proxy')}</h4>
                        <ul className="space-y-3">
                            <li><Link to="/about" className="hover:text-white transition-colors">{t('footer.about')}</Link></li>
                            <li><Link to="/shop" className="hover:text-white transition-colors">{t('footer.shop')}</Link></li>
                            <li><Link to="/product" className="hover:text-white transition-colors">{t('footer.product')}</Link></li>
                            <li><Link to="/track-order" className="hover:text-white transition-colors">{t('footer.track_order')}</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-gray-500 mb-4 md:mb-0">
                        {t('footer.copyright')}
                    </p>
                    <div className="flex space-x-6">
                        <FaFacebookF className="hover:text-white cursor-pointer transition-colors" />
                        <FaTwitter className="hover:text-white cursor-pointer transition-colors" />
                        <FaInstagram className="hover:text-white cursor-pointer transition-colors" />
                        <FaPinterestP className="hover:text-white cursor-pointer transition-colors" />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
