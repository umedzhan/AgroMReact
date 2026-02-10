import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
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
        <div className="container mx-auto px-4 py-4 lg:py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">

            {/* Top Row: Logo & Mobile Toggle & Cart (Mobile) */}
            <div className="flex w-full lg:w-auto justify-between items-center">
              {/* Mobile Menu Button */}
              <button onClick={toggleMobileMenu} className="lg:hidden text-gray-900 focus:outline-none p-2">
                {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>

              {/* Logo */}
              <Link to="/" className="flex items-center">
                <img src="/images/logo.png" alt="AgroM Logo" className="h-10 lg:h-16 w-auto object-contain" />
              </Link>

              {/* Mobile Cart Icon */}
              <Link to="/cart" className="lg:hidden relative text-gray-900 p-2">
                <FaShoppingCart className="text-2xl" />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 bg-brand text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-white">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {/* Location Widget (Desktop Only) */}
              <Link to="/contact" className="hidden xl:flex items-center border border-gray-200 rounded px-3 py-4 mr-4 hover:border-brand transition-colors group ml-8">
                <FaMapMarkerAlt className="text-gray-500 mr-2 group-hover:text-brand transition-colors" />
                <span className="text-gray-500 text-sm group-hover:text-brand transition-colors">{t('header.find_store')}</span>
              </Link>
            </div>


            {/* Search Section */}
            <div className="w-full lg:flex-grow lg:mx-8">
              <div className="flex items-center">
                {/* Browse Dropdown (Desktop Only) */}
                <Link to="/shop" className="hidden lg:flex items-center bg-green-50 px-4 py-3 rounded-l border border-brand border-r-0 cursor-pointer min-w-[150px] justify-between hover:bg-green-100 transition-colors whitespace-nowrap">
                  <span className="text-gray-700 font-medium">{t('header.browse_now')}</span>
                  <FaChevronDown className="text-gray-500 text-xs ml-2" />
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
                  <button className="flex items-center space-x-1 text-gray-900 hover:text-brand font-bold focus:outline-none">
                    <span>{user.name}</span>
                    <FaChevronDown className="text-xs text-gray-500" />
                  </button>
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full pt-2 w-48 z-50 hidden group-hover:block">
                    <div className="bg-white rounded-md shadow-lg py-2 border border-gray-100">
                      <div className="px-4 py-2 border-b border-gray-50">
                        <p className="text-xs text-gray-500">{t('header.signed_in_as')}</p>
                        <p className="text-sm font-bold truncate text-gray-900">{user.name}</p>
                      </div>

                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-brand transition-colors">
                        {t('common.profile')}
                      </Link>

                      {user.isAdmin && (
                        <Link to="/admin/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-brand transition-colors">
                          {t('header.admin_dashboard')}
                        </Link>
                      )}

                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-50 mt-1 pt-2"
                      >
                        {t('common.logout')}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="flex items-center space-x-2 text-gray-900 hover:text-brand font-bold">
                  <span className="hidden xl:inline">{t('common.sign_in')}</span>
                </Link>
              )}

              <Link to="/wishlist" className="relative group flex items-center text-gray-900">
                <FaHeart className="text-3xl mr-2" />
                <span className="hidden xl:inline text-sm">{t('header.wishlist')}</span>
              </Link>

              <div className="border-l border-gray-200 h-8"></div>

              <div className="flex items-center space-x-3 group">
                <div className="relative">
                  <Link to="/cart">
                    <FaShoppingCart className="text-3xl text-gray-900 group-hover:text-brand transition-colors" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-2 bg-brand text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                </div>
                <div className="text-sm">
                  <p className="text-gray-500 text-xs">{t('header.shopping_cart')}:</p>
                  <p className="font-bold text-gray-900">${cartTotal}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Link Bar */}
        <div className="hidden lg:block bg-white border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center py-3">
              <nav className="flex space-x-8 text-gray-500 font-medium text-sm">
                <Link to="/shop?category=Wheat" className="hover:text-brand transition-colors flex items-center">
                  <span className="text-brand font-bold mr-1">{t('header.nav.wheat')}</span> {t('header.nav.cereal_crops')}
                </Link>
                <Link to="/shop?category=Beans" className="hover:text-brand transition-colors flex items-center">
                  <span className="text-brand font-bold mr-1">{t('header.nav.beans')}</span> {t('header.nav.legumes')}
                </Link>
                <div className="relative group">
                  <button className="hover:text-brand transition-colors flex items-center border border-gray-200 rounded px-3 py-1">
                    {t('header.nav.vegetables')} <FaChevronDown className="ml-2 text-xs" />
                  </button>
                </div>
                <div className="relative group">
                  <button className="hover:text-brand transition-colors flex items-center border border-gray-200 rounded px-3 py-1">
                    {t('header.nav.fresh_fruits')} <FaChevronDown className="ml-2 text-xs" />
                  </button>
                </div>
                <Link to="/shop?category=Sunflower" className="hover:text-brand transition-colors flex items-center">
                  <span className="text-brand font-bold mr-1">{t('header.nav.sunflower')}</span> {t('header.nav.oil_crops')}
                </Link>
              </nav>

              <div className="flex items-center space-x-2 text-brand font-bold">
                <FaPhoneAlt />
                <span>{t('header.need_help')} +998 (99) 997-05-15</span>
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
