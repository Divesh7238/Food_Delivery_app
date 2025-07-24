import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { GiChefToque } from 'react-icons/gi'
import { FiMenu, FiX } from 'react-icons/fi'

const navLinks = [
  { name: 'Add Items', href: '/add', icon: '➕' },
  { name: 'List', href: '/list', icon: '📋' },
  { name: 'Orders', href: '/orders', icon: '🛒' }
]

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="w-full bg-[#3a2a20] text-yellow-500 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <div className="flex items-center gap-2 text-xl font-bold">
          <GiChefToque className="text-2xl" />
          <span>Admin Panel</span>
        </div>

        {/* Hamburger menu button (only on small screens) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-2xl focus:outline-none"
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.href}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-yellow-500 text-black'
                    : 'hover:bg-[#4a3a30] text-yellow-500'
                }`
              }
            >
              <span>{link.icon}</span>
              <span>{link.name}</span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-2 px-4 pb-4 bg-[#3a2a20]">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.href}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-yellow-500 text-black'
                    : 'hover:bg-[#4a3a30] text-yellow-500'
                }`
              }
            >
              <span>{link.icon}</span>
              <span>{link.name}</span>
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  )
}

export default Navbar
