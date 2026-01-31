import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaSearch, FaPhoneAlt, FaBars, FaTimes, FaMapMarkerAlt, FaChevronDown } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';
import TopBar from './TopBar';
import SearchBox from './SearchBox';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <TopBar />
      <header className="bg-white sticky top-0 z-50">
        {/* Main Header Middle Section */}
        <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
          <div className="flex w-full lg:w-auto justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 mr-8">
              <span className="text-4xl">🌱</span>
              <span className="text-3xl font-bold text-gray-900 tracking-tight">AgroM</span>
            </Link>

            {/* Location Widget (Hidden on mobile) */}
            <Link to="/contact" className="hidden xl:flex items-center border border-gray-200 rounded px-3 py-2 mr-4 hover:border-brand transition-colors group">
              <FaMapMarkerAlt className="text-gray-500 mr-2 group-hover:text-brand transition-colors" />
              <span className="text-gray-500 text-sm group-hover:text-brand transition-colors">Find a store</span>
            </Link>

            {/* Mobile Actions (Hamburger) */}
            <div className="lg:hidden flex items-center space-x-4">
              <button onClick={toggleMobileMenu} className="text-gray-900 focus:outline-none">
                {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>
          </div>


          {/* Search Section */}
          <div className="flex flex-grow w-full lg:w-auto items-center space-x-4">

            {/* Browse Dropdown (Hidden on mobile) */}
            {/* Browse Dropdown (Hidden on mobile) */}
            <Link to="/shop" className="hidden lg:flex items-center bg-green-50 px-4 py-3 rounded border border-brand cursor-pointer min-w-[150px] justify-between hover:bg-green-100 transition-colors">
              <span className="text-gray-700 font-medium">Browse now</span>
              <FaChevronDown className="text-gray-500 text-xs ml-2" />
            </Link>

            {/* Search Box - Centered */}
            <div className="flex-grow">
              <SearchBox />
            </div>
          </div>


          {/* Right Actions */}
          <div className="flex items-center space-x-6 ml-0 lg:ml-8 mt-4 lg:mt-0">
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
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-bold truncate text-gray-900">{user.name}</p>
                    </div>

                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-brand transition-colors">
                      Profile
                    </Link>

                    {user.isAdmin && (
                      <Link to="/admin/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-brand transition-colors">
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-50 mt-1 pt-2"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="flex items-center space-x-2 text-gray-900 hover:text-brand font-bold">
                <span className="hidden xl:inline">Sign In</span>
              </Link>
            )}

            <Link to="/wishlist" className="relative group hidden lg:flex items-center text-gray-900">
              <FaHeart className="text-3xl mr-2" />
              <span className="hidden xl:inline text-sm">Wishlist</span>
            </Link>

            <div className="border-l border-gray-200 h-8 hidden lg:block"></div>

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
              <div className="hidden lg:block text-sm">
                <p className="text-gray-500 text-xs">Shopping cart:</p>
                <p className="font-bold text-gray-900">${cartTotal}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Bar - White Strip with Specific Links */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} lg:block bg-white border-t border-gray-100 transition-all duration-300`}>
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center py-3">
              {/* Main Nav Links (Categories) */}
              <nav className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-8 text-gray-500 font-medium mb-4 lg:mb-0 text-sm">
                <Link to="/shop?category=Wheat" className="hover:text-brand transition-colors flex items-center">
                  <span className="text-brand font-bold mr-1">Wheat</span> Cereal Crops
                </Link>
                <Link to="/shop?category=Beans" className="hover:text-brand transition-colors flex items-center">
                  <span className="text-brand font-bold mr-1">Beans</span> Legumes
                </Link>
                <div className="relative group">
                  <button className="hover:text-brand transition-colors flex items-center border border-gray-200 rounded px-3 py-1">
                    Vegetables <FaChevronDown className="ml-2 text-xs" />
                  </button>
                </div>
                <div className="relative group">
                  <button className="hover:text-brand transition-colors flex items-center border border-gray-200 rounded px-3 py-1">
                    Fresh Fruits <FaChevronDown className="ml-2 text-xs" />
                  </button>
                </div>
                <Link to="/shop?category=Sunflower" className="hover:text-brand transition-colors flex items-center">
                  <span className="text-brand font-bold mr-1">Sunflower</span> Oil Crops
                </Link>
              </nav>

              {/* Phone Number */}
              <div className="flex items-center space-x-2 text-brand font-bold">
                <FaPhoneAlt />
                <span>Need help? Call Us: +998 (00) 000-00-00</span>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
