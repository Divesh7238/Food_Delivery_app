import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiBook,
  FiStar,
  FiPhone,
  FiShoppingCart,
  FiLogOut,
  FiKey,
  FiPackage,
} from 'react-icons/fi';
import { GiForkKnifeSpoon, GiChefToque } from 'react-icons/gi';
import { useCart } from '../../CartContext/CartContext';
import Login from '../Login/Login';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useCart();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem('authToken'))
  );

  useEffect(() => {
    setShowLoginModal(location.pathname === '/login');
    setIsAuthenticated(Boolean(localStorage.getItem('authToken')));
  }, [location.pathname]);

  const handleLoginSuccess = () => {
    // token is already set in Login component
    setIsAuthenticated(true);
    navigate('/');
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('loginData'); // optional clear
    setIsAuthenticated(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', to: '/', icon: <FiHome /> },
    { name: 'Menu', to: '/menu', icon: <FiBook /> },
    { name: 'About', to: '/about', icon: <FiStar /> },
    { name: 'Contact', to: '/contact', icon: <FiPhone /> },
    ...(isAuthenticated ? [{ name: 'My Orders', to: '/myorder', icon: <FiPackage /> }] : []),
  ];

  const renderDesktopAuthButton = () =>
    isAuthenticated ? (
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-gradient-to-br from-rose-500 to-amber-400 hover:from-pink-500 hover:to-yellow-400 rounded-2xl font-semibold text-white shadow-md hover:shadow-lg transition-transform hover:scale-105 border border-pink-200/30 flex items-center space-x-2 text-sm"
      >
        <FiLogOut className="text-lg" />
        <span>Logout</span>
      </button>
    ) : (
      <button
        onClick={() => navigate('/login')}
        className="px-4 py-2 bg-gradient-to-br from-rose-500 to-amber-400 hover:from-pink-500 hover:to-yellow-400 rounded-2xl font-semibold text-white shadow-md hover:shadow-lg transition-transform hover:scale-105 border border-pink-200/30 flex items-center space-x-2 text-sm"
      >
        <FiKey className="text-lg" />
        <span>Login</span>
      </button>
    );

  const renderMobileAuthButton = () =>
    isAuthenticated ? (
      <button
        onClick={handleLogout}
        className="w-full px-4 py-3 bg-gradient-to-br from-rose-500 to-amber-400 text-white rounded-xl font-semibold flex items-center justify-center space-x-2 text-sm"
      >
        <FiLogOut />
        <span>Logout</span>
      </button>
    ) : (
      <button
        onClick={() => {
          navigate('/login');
          setIsOpen(false);
        }}
        className="w-full px-4 py-3 bg-gradient-to-br from-rose-500 to-amber-400 text-white rounded-xl font-semibold flex items-center justify-center space-x-2 text-sm"
      >
        <FiKey />
        <span>Login</span>
      </button>
    );

  return (
    <nav className="bg-[#1C1B1F] border-b-4 border-amber-900/30 shadow-lg sticky top-0 z-50 font-vibes group/nav">
      {/* Top Decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl px-4">
        <div className="h-[4px] bg-gradient-to-r from-transparent via-amber-600/50 to-transparent shadow-[0_0_20px] shadow-amber-500/30 rounded-full" />
        <div className="flex justify-between px-6">
          <GiForkKnifeSpoon className="text-amber-500/40 -mt-3 -ml-2 rotate-45" size={28} />
          <GiForkKnifeSpoon className="text-amber-500/40 -mt-3 -mr-2 -rotate-45" size={28} />
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="flex justify-between items-center h-16 md:h-20 lg:h-24">

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center space-x-2 group relative ml-2">
            <div className="absolute inset-4 bg-amber-500/10 rounded-full blur-xl opacity-0 group-hover/nav:opacity-100 transition-opacity duration-300" />
            <GiChefToque className="text-3xl md:text-4xl lg:text-5xl text-amber-500 transition-transform group-hover:rotate-12 group-hover:text-amber-400 hover:drop-shadow-[0_0_15px]" />
            <div className="flex flex-col relative ml-2">
              <NavLink
                to="/"
                className="text-2xl md:text-3xl lg:text-4xl bg-gradient-to-r from-rose-400 to-orange-300 bg-clip-text text-transparent font-monsieur tracking-wider drop-shadow-black truncate"
              >
                Bhukkad Bites
              </NavLink>
              <div className="h-[3px] bg-gradient-to-r from-amber-600/30 via-amber-400/50 to-amber-600/30 mt-1 ml-1 rounded-full shadow-[0_2px_5px] shadow-amber-500/20" />
            </div>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center mr-2">
            <button
              className="text-amber-500 hover:text-amber-300 focus:outline-none transition-all p-2 rounded-xl border-2 border-amber-900/30 hover:border-amber-600/50 shadow-md hover:shadow-amber-500/30"
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className="space-y-1.5">
                <span
                  className={`block w-6 h-[2px] bg-current transition-all ${
                    isOpen ? 'rotate-45 translate-y-[6px]' : ''
                  }`}
                />
                <span
                  className={`block w-6 h-[2px] bg-current transition-all ${
                    isOpen ? 'opacity-0' : ''
                  }`}
                />
                <span
                  className={`block w-6 h-[2px] bg-current transition-all ${
                    isOpen ? '-rotate-45 -translate-y-[6px]' : ''
                  }`}
                />
              </div>
            </button>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-3 flex-1 justify-end">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.to}
                className={({ isActive }) =>
                  `group px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base rounded-3xl border-2 flex items-center transition-all duration-300 ${
                    isActive
                      ? 'border-amber-600/50 bg-amber-200 text-black shadow-inner'
                      : 'border-amber-900/30 hover:border-amber-600/50 hover:bg-amber-900/20'
                  }`
                }
              >
                <span className="mr-2 text-amber-500 group-hover:text-amber-300 transition-colors">
                  {link.icon}
                </span>
                <span className="text-amber-100 group-hover:text-amber-300 relative">
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-amber-400 transition-all group-hover:w-full rounded-full" />
                </span>
              </NavLink>
            ))}
            <NavLink to="/cart" className="relative group p-2">
              <FiShoppingCart className="text-amber-500 group-hover:text-amber-300 text-xl" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-400 text-xs text-white rounded-full px-1 font-bold">
                  {totalItems}
                </span>
              )}
            </NavLink>
            {renderDesktopAuthButton()}
          </div>
        </div>

        {/* Mobile Links */}
        {isOpen && (
          <div className="md:hidden mt-3 space-y-2 pb-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-amber-100 rounded-md hover:bg-amber-700/40 transition"
              >
                <div className="flex items-center space-x-2">
                  {link.icon}
                  <span>{link.name}</span>
                </div>
              </NavLink>
            ))}
            <NavLink
              to="/cart"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-amber-100 rounded-md hover:bg-amber-700/40 transition"
            >
              <div className="flex items-center space-x-2">
                <FiShoppingCart /> <span>Cart ({totalItems})</span>
              </div>
            </NavLink>
            {renderMobileAuthButton()}
          </div>
        )}
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#1f1c2c] to-[#928dab] rounded-xl p-6 w-full max-w-md relative border-4 border-rose-400 shadow-[0_0_30px] shadow-yellow-200/20">
            <button
              onClick={() => navigate('/')}
              className="absolute top-2 right-2 text-amber-200 hover:text-white text-2xl"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-rose-400 to-orange-300 bg-clip-text text-transparent mb-4 text-center">
              Bhukkad Bites
            </h2>
       
            <Login handleLoginSuccess={handleLoginSuccess} onClose={() => navigate('/')} />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
