import React from 'react';
import './About.css';

const About = () => {
  return (
    <section id="about" className="about section-padding">
      <div className="container about-container">
        <div className="about-image">
          <img src="https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=1000&auto=format&fit=crop" alt="Coffee pouring" />
          <div className="experience-badge">
            <h3>15+</h3>
            <p>Years of<br/>Excellence</p>
          </div>
        </div>
        <div className="about-content">
          <h4 className="section-subtitle">Our Story</h4>
          <h2 className="section-title" style={{textAlign: 'left'}}>Crafting the perfect cup since 2008.</h2>
          <p className="about-text">
            At Aether, we believe that coffee is more than just a beverage; it's a profound experience. We source the finest, ethically-grown beans from remote artisan farmers worldwide.
          </p>
          <p className="about-text">
            Our master roasters meticulously bring out the unique flavor profiles of each bean, ensuring that every cup you enjoy is a masterpiece of taste and harmony.
          </p>
          <button className="btn-primary" style={{marginTop: '1.5rem'}}>Read Our Full Story</button>
        </div>
      </div>
    </section>
  );
};

export default About;
