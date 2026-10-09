import React, { useContext, useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { tUZ } from '../utils/translateHelper';
import { FaShoppingCart, FaHeart, FaPhoneAlt, FaBars, FaTimes, FaMapMarkerAlt, FaChevronDown } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';
import TopBar from './TopBar';
import SearchBox from './SearchBox';
import { useTranslation } from 'react-i18next';
import { PRODUCT_CATEGORIES } from '../utils/categories';
import NotificationBell from './NotificationBell';

const navClass = ({ isActive }) =>
  `whitespace-nowrap rounded-lg px-3 py-2 text-[14px] font-medium transition flex items-center gap-1.5 ${
    isActive ? 'bg-ink-900/[0.05] text-ink-900' : 'text-ink-500 hover:text-ink-900'
  }`;

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useTranslation();

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <TopBar />
      <header className={`sticky top-0 z-50 border-b transition-colors ${scrolled ? 'border-line bg-white/90 backdrop-blur-xl' : 'border-transparent bg-canvas/80 backdrop-blur'}`}>
        {/* Main Header Middle Section */}
        <div className="container mx-auto px-4 py-2.5 lg:py-3">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-3 lg:gap-6">

            {/* Top Row: Logo & Mobile Toggle & Cart (Mobile) */}
            <div className="flex w-full lg:w-auto lg:shrink-0 justify-between items-center">
              {/* Mobile Menu Button */}
              <button onClick={toggleMobileMenu} className="lg:hidden grid size-10 place-items-center rounded-xl text-ink-800 hover:bg-ink-50" aria-label="Menu">
                {isMobileMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
              </button>

              {/* Logo */}
              <Link to="/" className="flex shrink-0 items-center">
                <img src="/images/logo.png" alt="AgroM Logo" className="h-10 lg:h-12 w-auto shrink-0 object-contain" />
              </Link>

              {/* Mobile Cart Icon */}
              <Link to="/cart" className="lg:hidden relative grid size-10 place-items-center rounded-xl text-ink-800 hover:bg-ink-50">
                <FaShoppingCart className="text-lg" />
                {cartItemCount > 0 && (
                  <span className="absolute top-1 right-1 bg-harvest-400 text-ink-950 text-[9px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {/* Location Widget (Desktop Only) */}
              <Link to="/contact" className="hidden 2xl:flex shrink-0 items-center rounded-xl h-10 px-3 ml-4 text-ink-500 hover:bg-ink-50 hover:text-ink-900 transition-colors">
                <FaMapMarkerAlt className="mr-2 text-ink-400 text-sm" />
                <span className="text-sm font-medium whitespace-nowrap">{t('header.find_store')}</span>
              </Link>
            </div>


            {/* Search Section */}
            <div className="w-full min-w-0 lg:flex-grow">
              <div className="flex items-center h-11 gap-3">
                {/* Browse Dropdown (Desktop Only) */}
                <Link to="/shop" className="hidden lg:flex items-center h-full rounded-xl bg-brand-50 px-4 text-brand-800 hover:bg-brand-100 transition-colors whitespace-nowrap gap-2">
                  <span className="text-sm font-semibold">{t('header.browse_now')}</span>
                  <FaChevronDown className="text-[10px] opacity-60" />
                </Link>

                <div className="flex-grow">
                  <SearchBox />
                </div>
              </div>
            </div>


            {/* Right Actions (Desktop Only) */}
            <div className="hidden lg:flex shrink-0 items-center gap-2">
              {user && <NotificationBell />}
              {/* User/Sign In */}
              {user ? (
                <div className="relative group z-50">
                  <button className="flex h-10 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-ink-700 hover:bg-ink-50 focus:outline-none">
                    <span className="grid size-7 place-items-center rounded-full bg-brand-600 text-xs font-bold text-white">
                      {user.name?.charAt(0).toUpperCase() || '?'}
                    </span>
                    <span className="max-w-[120px] truncate">{user.name}</span>
                    <FaChevronDown className="text-[10px] text-ink-400" />
                  </button>
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full pt-2 w-52 z-50 hidden group-hover:block">
                    <div className="animate-fade-up overflow-hidden rounded-2xl border border-line bg-white p-1.5 shadow-lift">
                      <div className="px-3 py-2">
                        <p className="text-[10px] text-ink-400 uppercase font-semibold tracking-[0.12em]">{t('header.signed_in_as')}</p>
                        <p className="text-sm font-semibold truncate text-ink-900 mt-0.5">{user.name}</p>
                      </div>
                      <div className="my-1 h-px bg-line" />

                      <Link to="/profile" className="block rounded-xl px-3 py-2 text-sm text-ink-600 hover:bg-ink-50 hover:text-ink-900 transition-colors">
                        {t('common.profile')}
                      </Link>

                      {user.isAdmin && (
                        <Link to="/admin/dashboard" className="block rounded-xl px-3 py-2 text-sm text-ink-600 hover:bg-ink-50 hover:text-ink-900 transition-colors">
                          {t('header.admin_dashboard')}
                        </Link>
                      )}

                      <Link to="/admin/productlist" className="block rounded-xl px-3 py-2 text-sm text-ink-600 hover:bg-ink-50 hover:text-ink-900 transition-colors">
                        {tUZ('Mahsulotlarim')}
                      </Link>

                      <div className="my-1 h-px bg-line" />
                      <button
                        onClick={logout}
                        className="block w-full text-left rounded-xl px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 transition-colors"
                      >
                        {t('common.logout')}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="flex h-10 items-center rounded-xl px-3 text-sm font-semibold text-ink-700 hover:bg-ink-50">
                  <span className="hidden xl:inline whitespace-nowrap">{t('common.sign_in')}</span>
                </Link>
              )}

              <Link to="/wishlist" className="flex h-10 items-center gap-2 rounded-xl px-3 text-ink-700 hover:bg-ink-50 transition-colors">
                <FaHeart className="text-ink-400" />
                <span className="hidden xl:inline text-sm font-semibold">{t('header.wishlist')}</span>
              </Link>

              <div className="mx-1 h-6 w-px bg-line"></div>

              <Link to="/cart" className="flex h-11 items-center gap-3 rounded-2xl border border-line bg-white px-3 shadow-card hover:shadow-lift transition-shadow">
                <span className="relative">
                  <FaShoppingCart className="text-ink-700" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2.5 -right-2.5 bg-harvest-400 text-ink-950 text-[9px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </span>
                <span className="text-left leading-none whitespace-nowrap">
                  <span className="block text-ink-400 text-[10px] uppercase font-semibold tracking-[0.12em]">{t('header.shopping_cart')}</span>
                  <span className="block font-bold text-ink-900 mt-1 text-sm">{cartTotal} UZS</span>
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Link Bar */}
        <div className="hidden lg:block border-t border-line/70">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center py-1.5">
              <nav className="flex items-center gap-0.5">
                <NavLink to="/" end className={navClass}>
                  {tUZ("Bosh sahifa")}
                </NavLink>
                <NavLink to="/shop" className={navClass}>
                  {tUZ("Mahsulotlar")}
                </NavLink>
                <div className="mx-2 h-4 w-px bg-line"></div>
                <NavLink to="/certification" className={navClass}>
                  <span className="h-2 w-2 rounded-full bg-harvest-400 animate-pulse"></span>
                  {tUZ("Sertifikatlash (Halal/Organic)")}
                </NavLink>
                <NavLink to="/export" className={navClass}>
                  {tUZ("Logistika & Eksport")}
                </NavLink>
                <NavLink to="/contracts" className={navClass}>
                  {tUZ("ERI Shartnomalar")}
                </NavLink>
              </nav>

              <a href="tel:+998999970515" className="hidden xl:flex shrink-0 whitespace-nowrap items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50">
                <FaPhoneAlt size={11} />
                <span>{tUZ("Yordam: +998 (99) 997-05-15")}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-ink-950/40" onClick={toggleMobileMenu}></div>

          {/* Drawer Content */}
          <div className={`absolute top-0 left-0 bottom-0 w-[88%] max-w-sm bg-white shadow-lift transform transition-transform duration-300 flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>

            {/* Drawer Header */}
            <div className="flex h-16 items-center justify-between border-b border-line px-4">
              <img src="/images/logo.png" alt="AgroM Logo" className="h-8 w-auto object-contain" />
              <button onClick={toggleMobileMenu} className="grid size-10 place-items-center rounded-xl text-ink-600 hover:bg-ink-50" aria-label="Close">
                <FaTimes size={18} />
              </button>
            </div>

            {/* Drawer Body - Scrollable */}
            <div className="flex-grow overflow-y-auto p-3">

              {/* User Section */}
              {user ? (
                <div className="mb-4 rounded-2xl border border-line bg-canvas p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-brand-600 text-white rounded-full size-10 flex items-center justify-center font-bold">
                      {user.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="text-xs text-ink-400">{t('header.signed_in_as')}</p>
                      <p className="font-semibold text-ink-900">{user.name}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-1.5">
                    <Link to="/profile" onClick={toggleMobileMenu} className="text-sm bg-white px-3 py-2.5 rounded-xl text-ink-700 block border border-line">
                      {t('common.profile')}
                    </Link>
                    {user.isAdmin && (
                      <Link to="/admin/dashboard" onClick={toggleMobileMenu} className="text-sm bg-white px-3 py-2.5 rounded-xl text-ink-700 block border border-line">
                        {t('header.admin_dashboard')}
                      </Link>
                    )}
                    <Link to="/admin/productlist" onClick={toggleMobileMenu} className="text-sm bg-white px-3 py-2.5 rounded-xl text-ink-700 block border border-line">
                      {tUZ('Mahsulotlarim')}
                    </Link>
                    <Link to="/wishlist" onClick={toggleMobileMenu} className="text-sm bg-white px-3 py-2.5 rounded-xl text-ink-700 border border-line flex justify-between items-center">
                      <span>{t('header.wishlist')}</span>
                      <FaHeart className="text-red-400" />
                    </Link>
                    <button onClick={() => { logout(); toggleMobileMenu(); }} className="text-sm bg-white text-red-700 px-3 py-2.5 rounded-xl block border border-red-200 text-left">
                      {t('common.logout')}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2 mb-4">
                  <Link to="/login" onClick={toggleMobileMenu} className="btn-outline flex-1">
                    {t('common.sign_in')}
                  </Link>
                  <Link to="/register" onClick={toggleMobileMenu} className="btn-primary flex-1">
                    {t('common.sign_up')}
                  </Link>
                </div>
              )}

              <nav className="space-y-0.5">
                {[
                  ['/', tUZ("Bosh sahifa")],
                  ['/certification', tUZ("Sertifikatlash (Halal/Organic)")],
                  ['/export', tUZ("Logistika & Eksport")],
                  ['/contracts', tUZ("ERI Shartnomalar")],
                ].map(([to, label]) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === '/'}
                    onClick={toggleMobileMenu}
                    className={({ isActive }) => `block rounded-xl px-4 py-3 text-base font-semibold ${isActive ? 'bg-brand-50 text-brand-800' : 'text-ink-800 hover:bg-ink-50'}`}
                  >
                    {label}
                  </NavLink>
                ))}
              </nav>

              {/* Navigation Links */}
              <div className="my-3 h-px bg-line" />
              <div className="space-y-0.5">
                <p className="px-4 text-xs font-semibold text-ink-400 uppercase tracking-[0.12em] mb-2 mt-4">{t('header.shop_by_category')}</p>

                <Link to="/shop" onClick={toggleMobileMenu} className="block rounded-xl px-4 py-2.5 text-[15px] font-medium text-ink-600 hover:bg-ink-50">
                  {t('header.browse_now')} (All)
                </Link>
                {PRODUCT_CATEGORIES.map((c) => (
                  <Link
                    key={c.value}
                    to={`/shop?category=${c.value}`}
                    onClick={toggleMobileMenu}
                    className="block rounded-xl px-4 py-2.5 text-[15px] font-medium text-ink-600 hover:bg-ink-50"
                  >
                    {t(`header.nav.${c.navKey}`)}
                  </Link>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-line">
                <p className="px-4 text-xs font-semibold text-ink-400 uppercase tracking-[0.12em] mb-2">{t('footer.helps')}</p>
                <Link to="/contact" onClick={toggleMobileMenu} className="block rounded-xl px-4 py-2.5 text-[15px] text-ink-600 hover:bg-ink-50">{t('footer.contact')}</Link>
                <Link to="/about" onClick={toggleMobileMenu} className="block rounded-xl px-4 py-2.5 text-[15px] text-ink-600 hover:bg-ink-50">{t('footer.about')}</Link>
              </div>

            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-line text-center text-xs text-ink-400">
              &copy; 2024 AgroM Inc.
            </div>

          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
