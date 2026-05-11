import React, { useState, useEffect } from 'react';
import { FiShoppingBag, FiMenu, FiX, FiUser } from 'react-icons/fi';
import './Navbar.css';

const Navbar = ({ cartCount, openCart, user, openAuth, logout }) => {
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
          <h2 style={{ letterSpacing: '-1px', fontWeight: '800' }}>AETHER<span style={{ color: 'var(--accent-gold)' }}>.</span></h2>
        </div>

        <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <li><a href="#home" onClick={() => setIsMobileMenuOpen(false)}>Home</a></li>
          <li><a href="#about" onClick={() => setIsMobileMenuOpen(false)}>Story</a></li>
          <li><a href="#menu" onClick={() => setIsMobileMenuOpen(false)}>Menu</a></li>
          <li><a href="#contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</a></li>
          <li><a href="http://127.0.0.1:8000/api/custom-admin/" target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--accent-gold)', fontWeight: 'bold' }}>Admin</a></li>
          <li className="auth-nav-item">
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Hi, {user.name}</span>
                <button className="logout-btn" onClick={() => { logout(); setIsMobileMenuOpen(false); }} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.4rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem' }}>Logout</button>
              </div>
            ) : (
              <button className="login-link btn-primary" onClick={() => { openAuth(); setIsMobileMenuOpen(false); }} style={{ padding: '0.5rem 1.5rem', fontSize: '0.8rem', borderRadius: '10px' }}>Join Club</button>
            )}
          </li>
        </ul>

        <div className="nav-actions">
          <button className="cart-btn" aria-label="Cart" onClick={openCart} style={{ position: 'relative' }}>
            <FiShoppingBag style={{ fontSize: '1.4rem' }} />
            {cartCount > 0 && <span className="cart-badge animate-fade" style={{ background: 'var(--accent-gold)', color: 'black', fontWeight: 'bold' }}>{cartCount}</span>}
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
