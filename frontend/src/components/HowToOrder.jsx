import React from 'react';
import './HowToOrder.css';
import { FiSmartphone, FiCoffee, FiTruck, FiSmile } from 'react-icons/fi';

const HowToOrder = () => {
  const steps = [
    {
      id: 1,
      title: "Explore Menu",
      desc: "Browse our hand-crafted coffee, drinks, and tasty treats.",
      icon: <FiSmartphone />
    },
    {
      id: 2,
      title: "Add to Cart",
      desc: "Select your favorites, customize them, and review your cart.",
      icon: <FiCoffee />
    },
    {
      id: 3,
      title: "Fast Checkout",
      desc: "Pay securely online with cards/UPI or choose Cash on Delivery.",
      icon: <FiTruck />
    },
    {
      id: 4,
      title: "Enjoy Your Order!",
      desc: "Track your order and get it delivered fresh to your door in minutes.",
      icon: <FiSmile />
    }
  ];

  return (
    <section className="how-to-order-section" id="how-to-order">
      <div className="section-header">
        <h2>How To <span className="highlight">Order</span></h2>
        <p>Getting your favorite coffee is just a few clicks away</p>
      </div>
      <div className="steps-container">
        {steps.map((step) => (
          <div className="step-card" key={step.id}>
            <div className="step-icon-wrap">
              {step.icon}
              <span className="step-number">{step.id}</span>
            </div>
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowToOrder;
