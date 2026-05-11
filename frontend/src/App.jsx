import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MenuPreview from './components/MenuPreview';
import Contact from './components/Contact';
import About from './components/About';
import Footer from './components/Footer';
import CartModal from './components/CartModal';
import AuthModal from './components/AuthModal';
import CheckoutModal from './components/CheckoutModal';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('aetherUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
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

  const handleLogin = (email) => {
    const newUser = { email, name: email.split('@')[0] };
    setUser(newUser);
    localStorage.setItem('aetherUser', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    setCartItems([]); // Optional: clear cart on logout
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
      />
      {!isStoreOpen && (
        <div className="animate-fade" style={{ 
          background: 'rgba(255, 68, 68, 0.95)', 
          backdropFilter: 'blur(10px)',
          color: 'white', 
          textAlign: 'center', 
          padding: '0.8rem', 
          fontWeight: '800', 
          fontSize: '0.9rem', 
          position: 'fixed', 
          bottom: '0px', 
          left: '0px',
          width: '100%',
          zIndex: 1000,
          boxShadow: '0 -4px 20px rgba(0,0,0,0.4)',
          letterSpacing: '2px',
          textTransform: 'uppercase'
        }}>
          ⚠️ STORE IS CURRENTLY CLOSED. NEW ORDERS ARE DISABLED.
        </div>
      )}
      <main>
        <Hero openCart={() => setIsCartOpen(true)} />
        <About />
        <MenuPreview 
          addToCart={addToCart} 
          cartItems={cartItems}
          increment={incrementQuantity}
          decrement={decrementQuantity}
        />
        <Contact />
      </main>
      <Footer />
      
      {/* Back to Top Button */}
      <button 
        onClick={scrollToTop}
        className="glass-panel"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: 'rgba(198, 159, 80, 0.9)',
          border: 'none',
          color: 'black',
          cursor: 'pointer',
          display: showScrollTop ? 'flex' : 'none',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 5px 15px rgba(0,0,0,0.4)',
          zIndex: 999,
          transition: 'all 0.3s ease',
          fontSize: '1.2rem',
          fontWeight: 'bold'
        }}
      >
        ↑
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
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onCheckoutSuccess={finishCheckout}
      />
    </div>
  );
}

export default App;
