import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { styles } from '../assets/dummyadmin'
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
    <nav className={styles.navWrapper}>
      <div className={styles.navContainer}>
        <div className={styles.logoSection}>
          <GiChefToque className={styles.logoIcon} />
          <span className={styles.logoText}>Admin Panel</span>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={styles.menuButton}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        <div className={styles.desktopMenu}>
          {navLinks.map(link => (
            <NavLink
              key={link.name}
              to={link.href}
              className={({ isActive }) =>
                `${styles.navLinkBase} ${
                  isActive ? styles.navLinkActive : styles.navLinkInactive
                }`
              }
            >
              {link.icon}
              <span>{link.name}</span>
            </NavLink>
          ))}
        </div>

        {/* FOR MOBILE VIEW */}
        {menuOpen && (
          <div className={styles.mobileMenu}>
            {navLinks.map(link => (
              <NavLink
                key={link.name}
                to={link.href}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `${styles.navLinkBase} ${
                    isActive ? styles.navLinkActive : styles.navLinkInactive
                  }`
                }
              >
                {link.icon}
                <span>{link.name}</span>
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
