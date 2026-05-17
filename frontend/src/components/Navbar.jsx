import React, { useState, useEffect } from 'react';
import { FiShoppingBag, FiMenu, FiX, FiUser } from 'react-icons/fi';
import './Navbar.css';

const Navbar = ({ cartCount, openCart, user, openAuth, logout, openAdmin }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className={`navbar-container container ${scrolled ? 'glass-panel floating-pill' : ''}`}>
        <div className="logo">
          <h2>AETHER<span style={{ color: '#e23744' }}>.</span></h2>
        </div>

        <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <li><a href="#home" onClick={() => setIsMobileMenuOpen(false)}>Home</a></li>
          <li><a href="#about" onClick={() => setIsMobileMenuOpen(false)}>Story</a></li>
          <li><a href="#how-to-order" onClick={() => setIsMobileMenuOpen(false)}>How to Order</a></li>
          <li><a href="#menu" onClick={() => setIsMobileMenuOpen(false)}>Menu</a></li>
          <li><a href="#contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</a></li>
          <li>
            <button 
              onClick={() => { openAdmin(); setIsMobileMenuOpen(false); }} 
              className="nav-admin-btn"
            >
              Admin
            </button>
          </li>
          
          {/* Mobile-Only Auth View inside hamburger menu */}
          <li className="auth-nav-item mobile-only-auth">
            {user ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.1rem', opacity: 0.8 }}>Hi, {user.name}</span>
                <button className="logout-btn" onClick={() => { logout(); setIsMobileMenuOpen(false); }}>Logout</button>
              </div>
            ) : (
              <button className="btn-primary" style={{ width: '100%', marginTop: '10px' }} onClick={() => { openAuth(); setIsMobileMenuOpen(false); }}>Login</button>
            )}
          </li>
        </ul>

        <div className="nav-actions">
          {/* Desktop-Only Auth View in the top navbar */}
          <div className="desktop-only-auth">
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span className="desktop-user-greeting">Hi, {user.name}</span>
                <button className="logout-btn desktop-logout-btn" onClick={logout}>Logout</button>
              </div>
            ) : (
              <button className="btn-primary login-btn-desktop" onClick={openAuth}>Login</button>
            )}
          </div>

          <button className="cart-btn" aria-label="Cart" onClick={openCart}>
            <FiShoppingBag />
            {cartCount > 0 && <span className="cart-badge animate-fade">{cartCount}</span>}
          </button>
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
