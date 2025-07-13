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
    Boolean(localStorage.getItem('loginData'))
  );

  useEffect(() => {
    setShowLoginModal(location.pathname === '/login');
    setIsAuthenticated(Boolean(localStorage.getItem('loginData')));
  }, [location.pathname]);

  const handleLoginSuccess = () => {
    localStorage.setItem('loginData', JSON.stringify({ loggedIn: true }));
    setIsAuthenticated(true);
    navigate('/');
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('loginData');
    setIsAuthenticated(false);
  };

  const navLinks = [
    { name: 'Home', to: '/', icon: <FiHome /> },
    { name: 'Menu', to: '/menu', icon: <FiBook /> },
    { name: 'About', to: '/about', icon: <FiStar /> },
    { name: 'Contact', to: '/contact', icon: <FiPhone /> },
  ];

  // Desktop Auth Button
  const renderDesktopAuthButton = () => {
    return isAuthenticated ? (
      <button
        onClick={handleLogout}
        className="px-3 md:px-3 lg:px-6 py-1.5 md:py-2 lg:py-3 bg-gradient-to-br from-rose-500 to-amber-400 hover:from-pink-500 hover:to-yellow-400 rounded-2xl font-bold text-white shadow-md hover:shadow-lg transition-all transform hover:scale-[1.03] border-2 border-pink-200/30 flex items-center space-x-2 text-sm"
      >
        <FiLogOut className="text-lg" />
        <span>Logout</span>
      </button>
    ) : (
      <button
        onClick={() => navigate('/login')}
        className="px-3 md:px-3 lg:px-6 py-1.5 md:py-2 lg:py-3 bg-gradient-to-br from-rose-500 to-amber-400 hover:from-pink-500 hover:to-yellow-400 rounded-2xl font-bold text-white shadow-md hover:shadow-lg transition-all transform hover:scale-[1.03] border-2 border-pink-200/30 flex items-center space-x-2 text-sm"
      >
        <FiKey className="text-lg" />
        <span>Login</span>
      </button>
    );
  };

  // Mobile Auth Button
  const renderMobileAuthButton = () => {
    return isAuthenticated ? (
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
  };

  return (
    <nav className="bg-[#1C1B1F] border-b-8 border-amber-900/30 shadow-amber-900/30 sticky top-0 z-50 shadow-[0_25px_50px_-12px] font-vibes group/nav overflow-x-hidden">
      {/* Top Decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl px-4">
        <div className="h-[6px] bg-gradient-to-r from-transparent via-amber-600/50 to-transparent shadow-[0_0_20px] shadow-amber-500/30" />
        <div className="flex justify-between px-6">
          <GiForkKnifeSpoon className="text-amber-500/40 -mt-4 -ml-2 rotate-45" size={32} />
          <GiForkKnifeSpoon className="text-amber-500/40 -mt-4 -mr-2 -rotate-45" size={32} />
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="flex justify-between items-center h-15 md:h-20 lg:h-24">

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center space-x-2 group relative md:translate-x-4 lg:translate-x-6 ml-6 md:ml-2">
            <div className="absolute inset-4 bg-amber-500/10 rounded-full blur-xl opacity-0 group-hover/nav:opacity-100 transition-opacity duration-300" />
            <GiChefToque className="text-3xl md:text-4xl lg:text-5xl text-amber-500 transition-all group-hover:rotate-12 group-hover:text-amber-400 hover:drop-shadow-[0_0_15px]" />
            <div className="flex flex-col relative ml-2 max-w-[148px] md:max-w-[160px] lg:max-w-none">
              <NavLink
                to="/"
                className="text-2xl md:text-xl lg:text-4xl bg-gradient-to-r from-rose-400 to-orange-300 bg-clip-text text-transparent font-monsieur tracking-wider drop-shadow-black -translate-x-2 truncate md:truncate-none"
              >
                Bhukkad Bites
              </NavLink>
              <div className='h-[3px] bg-gradient-to-r from-amber-600/30 via-amber-400/50 to-amber-600/30 mt-1 ml-1 shadow-[0_2px_5px] shadow-amber-500/20' />
            </div>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center mr-2">
            <button
              className="text-amber-500 hover:text-amber-300 focus:outline-none transition-all p-2 rounded-xl border-2 border-amber-900/30 hover:border-amber-600/50 relative shadow-md hover:shadow-amber-500/30"
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className="space-y-2 relative">
                <span className={`block w-6 h-[2px] bg-current transition-all ${isOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
                <span className={`block w-6 h-[2px] bg-current transition-all ${isOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-6 h-[2px] bg-current transition-all ${isOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
              </div>
            </button>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-2 md:space-x-1 lg:space-x-4 flex-1 justify-end">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.to}
                className={({ isActive }) =>
                  `group px-3 md:px-3 lg:px-4 py-2 md:py-2 lg:py-3 text-sm md:text-[15px] text-base relative
                  transition-all duration-300 flex items-center 
                  hover:bg-amber-900/20 rounded-3xl border-2
                  ${isActive ? 'border-amber-600/50 bg-amber-200 shadow-[inset_0_0_15px] shadow-amber-500/20' : 'border-amber-900/30 hover:border-amber-600/50'}`
                }
              >
                <span className="mr-2 text-sm md:text-[15px] text-base text-amber-500 group-hover:text-amber-300 transition-all">
                  {link.icon}
                </span>
                <span className="text-amber-100 group-hover:text-amber-300 relative">
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-amber-400 transition-all group-hover:w-full" />
                </span>
              </NavLink>
            ))}
            <NavLink to="/cart" className="relative group p-2">
              <FiShoppingCart className="text-amber-500 group-hover:text-amber-300 text-xl" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-400 text-xs text-white rounded-full px-1">
                  {totalItems}
                </span>
              )}
            </NavLink>
            {renderDesktopAuthButton()}
          </div>
        </div>

        {/* Mobile Links */}
        {isOpen && (
          <div className="md:hidden mt-2 space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-amber-100 rounded-md hover:bg-amber-700/40 transition"
              >
                {link.icon} <span className="ml-2">{link.name}</span>
              </NavLink>
            ))}
            <NavLink to="/cart" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-amber-100 rounded-md hover:bg-amber-700/40 transition">
              <FiShoppingCart className="inline mr-2" /> Cart ({totalItems})
            </NavLink>
            {renderMobileAuthButton()}
          </div>
        )}
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#1f1c2c] to-[#928dab] rounded-xl p-6 w-full max-w-[480px] relative border-4 border-rose-400 shadow-[0_0_30px] shadow-yellow-200/20">
            <button onClick={() => navigate('/')} className="absolute top-2 right-2 text-amber-200 hover:text-white text-2xl">
              &times;
            </button>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-rose-400 to-orange-300 bg-clip-text text-transparent mb-4 text-center">
              Bhukkad Bites
            </h2>
            <Login
              onLoginSuccess={handleLoginSuccess} onClose={() => navigate('/')} />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
