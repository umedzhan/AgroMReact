import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { tUZ } from '../utils/translateHelper';
import { FaShoppingCart, FaHeart, FaSearch, FaPhoneAlt, FaBars, FaTimes, FaMapMarkerAlt, FaChevronDown } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';
import TopBar from './TopBar';
import SearchBox from './SearchBox';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <TopBar />
      <header className="bg-white sticky top-0 z-50 shadow-sm">
        {/* Main Header Middle Section */}
        <div className="container mx-auto px-4 py-2.5 lg:py-3.5">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">

            {/* Top Row: Logo & Mobile Toggle & Cart (Mobile) */}
            <div className="flex w-full lg:w-auto justify-between items-center">
              {/* Mobile Menu Button */}
              <button onClick={toggleMobileMenu} className="lg:hidden text-gray-900 focus:outline-none p-2">
                {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>

              {/* Logo */}
              <Link to="/" className="flex items-center">
                <img src="/images/logo.png" alt="AgroM Logo" className="h-8 lg:h-10 w-auto object-contain" />
              </Link>

              {/* Mobile Cart Icon */}
              <Link to="/cart" className="lg:hidden relative text-gray-900 p-2">
                <FaShoppingCart className="text-xl" />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 bg-brand text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-white">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {/* Location Widget (Desktop Only) */}
              <Link to="/contact" className="hidden xl:flex items-center border border-gray-200 rounded h-10 px-4 mr-4 hover:border-brand transition-colors group ml-8 min-w-[150px]">
                <FaMapMarkerAlt className="text-gray-400 mr-2 group-hover:text-brand transition-colors text-sm" />
                <span className="text-gray-500 text-xs font-semibold group-hover:text-brand transition-colors">{t('header.find_store')}</span>
              </Link>
            </div>


            {/* Search Section */}
            <div className="w-full lg:flex-grow lg:mx-8">
              <div className="flex items-center h-10 gap-4">
                {/* Browse Dropdown (Desktop Only) */}
                <Link to="/shop" className="hidden lg:flex items-center h-full bg-green-50 px-4 rounded border border-brand cursor-pointer min-w-[150px] justify-between hover:bg-green-100 transition-colors whitespace-nowrap">
                  <span className="text-gray-700 text-xs font-semibold">{t('header.browse_now')}</span>
                  <FaChevronDown className="text-gray-400 text-[10px] ml-2" />
                </Link>

                <div className="flex-grow">
                  <SearchBox />
                </div>
              </div>
            </div>


            {/* Right Actions (Desktop Only) */}
            <div className="hidden lg:flex items-center space-x-6">
              {/* User/Sign In */}
              {user ? (
                <div className="relative group z-50">
                  <button className="flex items-center space-x-1 text-gray-700 hover:text-brand font-semibold text-sm focus:outline-none">
                    <span>{user.name}</span>
                    <FaChevronDown className="text-[10px] text-gray-400" />
                  </button>
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full pt-2 w-44 z-50 hidden group-hover:block">
                    <div className="bg-white rounded-xl shadow-xl py-1.5 border border-gray-100">
                      <div className="px-4 py-2 border-b border-gray-50">
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{t('header.signed_in_as')}</p>
                        <p className="text-xs font-black truncate text-gray-900 mt-0.5">{user.name}</p>
                      </div>

                      <Link to="/profile" className="block px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-green-50 hover:text-brand transition-colors">
                        {t('common.profile')}
                      </Link>

                      {user.isAdmin && (
                        <Link to="/admin/dashboard" className="block px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-green-50 hover:text-brand transition-colors">
                          {t('header.admin_dashboard')}
                        </Link>
                      )}

                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors border-t border-gray-50 mt-1 pt-2"
                      >
                        {t('common.logout')}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="flex items-center space-x-2 text-gray-700 hover:text-brand font-semibold text-sm">
                  <span className="hidden xl:inline">{t('common.sign_in')}</span>
                </Link>
              )}

              <Link to="/wishlist" className="relative group flex items-center text-gray-700 hover:text-brand transition-colors">
                <FaHeart className="text-lg mr-2 text-gray-400 group-hover:text-brand transition-colors" />
                <span className="hidden xl:inline text-sm font-semibold">{t('header.wishlist')}</span>
              </Link>

              <div className="border-l border-gray-250 h-6"></div>

              <div className="flex items-center space-x-3 group">
                <div className="relative">
                  <Link to="/cart" className="flex items-center">
                    <FaShoppingCart className="text-lg text-gray-700 group-hover:text-brand transition-colors" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-brand text-white text-[9px] font-bold rounded-full h-4.5 w-4.5 flex items-center justify-center border border-white">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                </div>
                <div className="text-sm">
                  <p className="text-gray-400 text-[9px] uppercase font-bold tracking-wider leading-none">{t('header.shopping_cart')}</p>
                  <p className="font-black text-gray-900 mt-0.5 text-xs">{cartTotal} UZS</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Link Bar */}
        <div className="hidden lg:block bg-white border-t border-gray-100 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center py-2">
               <nav className="flex space-x-6 text-gray-600 font-semibold text-sm">
                <Link to="/" className="hover:text-brand transition-colors">
                  {tUZ("Bosh sahifa")}
                </Link>
                <Link to="/shop" className="hover:text-brand transition-colors">
                  {tUZ("Mahsulotlar")}
                </Link>
                <div className="h-4 w-[1px] bg-gray-200 align-middle my-auto"></div>
                <Link to="/certification" className="hover:text-brand transition-colors flex items-center gap-1.5 py-1 px-2.5 rounded bg-green-50 text-brand">
                  <span className="h-2 w-2 rounded-full bg-brand animate-pulse"></span>
                  {tUZ("Sertifikatlash (Halal/Organic)")}
                </Link>
                <Link to="/export" className="hover:text-brand transition-colors flex items-center gap-1.5 py-1 px-2.5 rounded bg-blue-50 text-blue-600">
                  {tUZ("Logistika & Eksport")}
                </Link>
                <Link to="/contracts" className="hover:text-brand transition-colors flex items-center gap-1.5 py-1 px-2.5 rounded bg-amber-50 text-amber-700">
                  {tUZ("ERI Shartnomalar")}
                </Link>
              </nav>

              <div className="flex items-center space-x-2 text-brand font-bold text-sm">
                <FaPhoneAlt size={12} />
                <span>{tUZ("Yordam: +998 (99) 997-05-15")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={toggleMobileMenu}></div>

          {/* Drawer Content */}
          <div className={`absolute top-0 left-0 bottom-0 w-[80%] max-w-sm bg-white shadow-xl transform transition-transform duration-300 flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>

            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
              <div className="font-bold text-lg text-brand">Menu</div>
              <button onClick={toggleMobileMenu} className="text-gray-500 hover:text-red-500">
                <FaTimes size={24} />
              </button>
            </div>

            {/* Drawer Body - Scrollable */}
            <div className="flex-grow overflow-y-auto p-4 py-2">

              {/* User Section */}
              {user ? (
                <div className="mb-6 bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-brand text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{t('header.signed_in_as')}</p>
                      <p className="font-bold text-gray-900">{user.name}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <Link to="/profile" onClick={toggleMobileMenu} className="text-sm bg-white px-3 py-2 rounded text-gray-700 block border border-gray-100">
                      {t('common.profile')}
                    </Link>
                    {user.isAdmin && (
                      <Link to="/admin/dashboard" onClick={toggleMobileMenu} className="text-sm bg-white px-3 py-2 rounded text-gray-700 block border border-gray-100">
                        {t('header.admin_dashboard')}
                      </Link>
                    )}
                    <Link to="/wishlist" onClick={toggleMobileMenu} className="text-sm bg-white px-3 py-2 rounded text-gray-700 block border border-gray-100 flex justify-between items-center">
                      <span>{t('header.wishlist')}</span>
                      <FaHeart className="text-red-400" />
                    </Link>
                    <button onClick={() => { logout(); toggleMobileMenu(); }} className="text-sm bg-red-50 text-red-600 px-3 py-2 rounded block border border-red-100 text-left">
                      {t('common.logout')}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2 mb-6">
                  <Link to="/login" onClick={toggleMobileMenu} className="flex-1 text-center bg-gray-100 text-gray-700 py-2 rounded font-semibold hover:bg-gray-200">
                    {t('common.sign_in')}
                  </Link>
                  <Link to="/register" onClick={toggleMobileMenu} className="flex-1 text-center bg-brand text-white py-2 rounded font-semibold hover:bg-brand-dark">
                    {t('common.sign_up')}
                  </Link>
                </div>
              )}


              {/* Navigation Links */}
              <div className="space-y-1">
                <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-4">{t('header.shop_by_category')}</p>

                <Link to="/shop" onClick={toggleMobileMenu} className="block px-2 py-2 text-gray-700 font-medium hover:bg-green-50 hover:text-brand rounded transition-colors">
                  {t('header.browse_now')} (All)
                </Link>
                <Link to="/shop?category=Wheat" onClick={toggleMobileMenu} className="block px-2 py-2 text-gray-700 font-medium hover:bg-green-50 hover:text-brand rounded transition-colors">
                  {t('header.nav.wheat')}
                </Link>
                <Link to="/shop?category=Beans" onClick={toggleMobileMenu} className="block px-2 py-2 text-gray-700 font-medium hover:bg-green-50 hover:text-brand rounded transition-colors">
                  {t('header.nav.beans')}
                </Link>
                <Link to="/shop?category=Sunflower" onClick={toggleMobileMenu} className="block px-2 py-2 text-gray-700 font-medium hover:bg-green-50 hover:text-brand rounded transition-colors">
                  {t('header.nav.sunflower')}
                </Link>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{t('footer.helps')}</p>
                <Link to="/contact" onClick={toggleMobileMenu} className="block px-2 py-2 text-gray-600 hover:text-brand">{t('footer.contact')}</Link>
                <Link to="/about" onClick={toggleMobileMenu} className="block px-2 py-2 text-gray-600 hover:text-brand">{t('footer.about')}</Link>
              </div>

            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-500">
              &copy; 2024 AgroM Inc.
            </div>

          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
