import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MenuPreview from './components/MenuPreview';
import About from './components/About';
import HowToOrder from './components/HowToOrder';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CartModal from './components/CartModal';
import AuthModal from './components/AuthModal';
import AdminModal from './components/AdminModal';
import CheckoutModal from './components/CheckoutModal';
import { FiArrowUp, FiAlertTriangle } from 'react-icons/fi';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('aetherUser');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed && parsed.name) {
          // Capitalize first letter of every word
          const cleanedName = parsed.name.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
          if (parsed.name !== cleanedName) {
            parsed.name = cleanedName;
            localStorage.setItem('aetherUser', JSON.stringify(parsed));
          }
        }
        return parsed;
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  React.useEffect(() => {
    const checkStore = () => {
      fetch('http://127.0.0.1:8000/api/store-status/')
        .then(res => res.json())
        .then(data => setIsStoreOpen(data.is_open))
        .catch(err => console.error("Error fetching store status:", err));
    };

    checkStore();
    const interval = setInterval(checkStore, 30000);

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (item) => {
    if (!isStoreOpen) {
      alert("We are currently closed. Please visit us again later!");
      return;
    }
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const incrementQuantity = (id) => {
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i));
  };

  const decrementQuantity = (id) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === id);
      if (existing && existing.quantity > 1) {
        return prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter(i => i.id !== id);
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogin = (email, displayName) => {
    let rawName = displayName || email.split('@')[0];
    const cleanName = rawName.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    
    const newUser = { email, name: cleanName };
    setUser(newUser);
    localStorage.setItem('aetherUser', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    setCartItems([]);
    localStorage.removeItem('aetherUser');
  };

  const startCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const finishCheckout = () => {
    setCartItems([]);
    setIsCheckoutOpen(false);
  };

  return (
    <div className="app-container">
      <Navbar
        cartCount={cartCount}
        openCart={() => setIsCartOpen(true)}
        user={user}
        openAuth={() => setIsAuthModalOpen(true)}
        logout={handleLogout}
        openAdmin={() => setIsAdminModalOpen(true)}
      />
      
      {!isStoreOpen && (
        <div className="store-closed-banner animate-fade">
          <FiAlertTriangle />
          <span>Currently Closed: New orders are disabled for now.</span>
        </div>
      )}

      <main>
        <Hero openCart={() => setIsCartOpen(true)} />
        <div className="main-content-wrap">
          <About />
          <HowToOrder />
          <MenuPreview
            addToCart={addToCart}
            cartItems={cartItems}
            increment={incrementQuantity}
            decrement={decrementQuantity}
          />
          <Contact />
        </div>
      </main>
      
      <Footer openAdmin={() => setIsAdminModalOpen(true)} />

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`scroll-top-btn ${showScrollTop ? 'visible' : ''}`}
        aria-label="Back to top"
      >
        <FiArrowUp />
      </button>

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        increment={incrementQuantity}
        decrement={decrementQuantity}
        removeFromCart={removeFromCart}
        onCheckout={startCheckout}
      />
      
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />

      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSuccess={() => {
          window.open('http://127.0.0.1:8000/api/custom-admin/', '_blank');
        }}
      />
      
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onCheckoutSuccess={finishCheckout}
      />

      <style jsx>{`
        .app-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .main-content-wrap {
          background-color: transparent;
          padding-top: 2rem;
        }

        .store-closed-banner {
          background: #333;
          color: #fff;
          padding: 12px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-weight: 500;
          font-size: 0.9rem;
          position: sticky;
          top: 0;
          z-index: 1001;
        }

        .scroll-top-btn {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background: #e23744;
          border: none;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 999;
          transition: all 0.3s ease;
          opacity: 0;
          visibility: hidden;
          transform: translateY(20px);
          font-size: 1.2rem;
        }

        .scroll-top-btn.visible {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .scroll-top-btn:hover {
          background: #d22734;
          transform: translateY(-5px);
        }

        @media (max-width: 480px) {
          .scroll-top-btn {
            bottom: 1.5rem;
            right: 1.5rem;
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
