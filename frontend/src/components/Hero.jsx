import React from 'react';
import './Hero.css';

const Hero = ({ openCart }) => {
  return (
    <section id="home" className="hero">
      <div className="hero-overlay"></div>
      <div className="hero-inner container">
        {/* Left: Text Content */}
        <div className="hero-content animate-slide">
          <span className="hero-badge" style={{ animationDelay: '0.2s' }}>✨ Aether Signature Bar</span>
          <h1 className="hero-title">Experience <br />True <span>Artisanal</span> Pairings.</h1>
          <p className="hero-subtitle">
            Ethically sourced coffee and freshly baked pastries, meticulously crafted to elevate your daily ritual.
          </p>
          <div className="hero-cta">
            <button className="btn-primary" onClick={openCart}>Order Now</button>
            <button className="btn-secondary-white"
              onClick={() => document.getElementById('menu').scrollIntoView({ behavior: 'smooth' })}
            >View Menu</button>
          </div>
        </div>

        {/* Right: Hero Image */}
        <div className="hero-image-wrap animate-fade" style={{ animationDelay: '0.4s' }}>
          <div className="hero-image-ring"></div>
          <img
            src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80"
            alt="Artisanal Cappuccino"
            className="hero-img"
            style={{
              borderRadius: '30px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              filter: 'brightness(0.9)'
            }}
          />
          <div className="hero-image-badge" style={{ background: 'var(--accent-gold)', color: '#111' }}>Premium Selection</div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
