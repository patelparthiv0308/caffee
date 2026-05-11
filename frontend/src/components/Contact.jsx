import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <section id="contact" className="contact section-padding">
      <div className="container contact-container">
        <div className="contact-info">
          <h4 className="section-subtitle">Get in Touch</h4>
          <h2 className="section-title" style={{ textAlign: 'left' }}>We'd Love to Hear From You</h2>
          <p className="contact-text">
            Whether you have a question about our beans, want to plan an event, or just want to say hi—drop us a message!
          </p>
          <div className="contact-details">
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <div>
                <h5>Location</h5>
                <p>123 Brew Avenue, Seattle, WA</p>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📧</span>
              <div>
                <h5>Email Us</h5>
                <p>hello@aethercoffee.com</p>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <div>
                <h5>Call Us</h5>
                <p>(555) 123-4567</p>
              </div>
            </div>
          </div>
        </div>
        <div className="contact-form glass-panel">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input type="text" id="name" placeholder="John Doe" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Your Email</label>
              <input type="email" id="email" placeholder="john@example.com" />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" rows="5" placeholder="How can we help?"></textarea>
            </div>
            <button className="btn-primary form-submit">Send Message</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
