import React from 'react';
import './Footer.css';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = ({ openAdmin }) => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h2 className="footer-logo">AETHER</h2>
            <p className="footer-text">Elevating the coffee experience one cup at a time. Crafted with passion, served with excellence.</p>
            <div className="social-links">
              <a href="#"><FaFacebookF /></a>
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaInstagram /></a>
            </div>
          </div>
          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#menu">Menu</a></li>
              <li><a href="#contact">Contact</a></li>
              <li>
                <button onClick={openAdmin} className="footer-admin-btn">
                  Admin Dashboard
                </button>
              </li>
            </ul>
          </div>
          <div className="footer-contact">
            <h3>Contact Us</h3>
            <p>123 Brew Avenue<br />Seattle, WA 98101</p>
            <p>hello@aethercoffee.com<br />(555) 123-4567</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Aether Coffee. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
