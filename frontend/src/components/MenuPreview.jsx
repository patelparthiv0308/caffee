import React, { useState, useEffect } from 'react';
import './MenuPreview.css';

const categories = ['All', 'Bestseller', 'Drinks', 'Merchandise', 'Coffee At Home', 'Food', 'Cake'];

const MenuPreview = ({ addToCart, cartItems, increment, decrement }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [showAll, setShowAll] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to get quantity in cart
  const getQuantity = (id) => {
    const item = cartItems.find(i => i.id === id);
    return item ? item.quantity : 0;
  };

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/products/')
      .then(res => res.json())
      .then(data => {
        // Ensure price is formatted with '₹' as the frontend expects
        const formattedData = data.map(item => ({
          ...item,
          price: `₹${parseFloat(item.price || 0).toFixed(0)}`, // Convert decimal string to ₹ price
          category: typeof item.category === 'string' ? item.category.split(',').map(c => c.trim()) : (Array.isArray(item.category) ? item.category : ['All']) // Convert safely
        }));
        setMenuItems(formattedData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  const filteredItems = activeCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category.includes(activeCategory));

  const displayedItems = showAll ? filteredItems : filteredItems.slice(0, 6);

  return (
    <section id="menu" className="menu-preview section-padding">
      <div className="container">
        <div className="menu-header">
          <h4 className="section-subtitle">Our Menu</h4>
          <h2 className="section-title" style={{textAlign: 'center', marginBottom: '1.5rem'}}>Discover the Taste</h2>
        </div>
        
        <div className="menu-filters">
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => {
                setActiveCategory(cat);
                setShowAll(false);
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="menu-grid">
          {loading ? (
            <div style={{ textAlign: 'center', width: '100%', gridColumn: '1 / -1', padding: '2rem' }}>
              <p>Loading fresh products from the oven...</p>
            </div>
          ) : (
            displayedItems.map((item, index) => {
              const qty = getQuantity(item.id);
              return (
                <div 
                  key={item.id} 
                  className={`menu-card glass-panel animate-fade ${!item.is_available ? 'out-of-stock' : ''}`} 
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    opacity: item.is_available ? 1 : 0.7 
                  }}
                >
                  <div className="menu-card-img" style={{ 
                    backgroundImage: `url(${item.image})`, 
                    filter: item.is_available ? 'none' : 'grayscale(1) brightness(0.7)',
                    transition: 'all 0.5s ease'
                  }}></div>
                  <div className="menu-card-content">
                    <div className="menu-card-header">
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>{item.name}</h3>
                        {!item.is_available && <span style={{ color: '#ff4444', fontSize: '0.6rem', fontWeight: '900', letterSpacing: '2px', marginTop: '4px' }}>OUT OF STOCK</span>}
                      </div>
                      <span className="price" style={{ color: '#d4af37', fontWeight: '800' }}>{item.price}</span>
                    </div>
                    <p className="menu-card-desc" style={{ marginBottom: '1.5rem', fontSize: '0.85rem', color: '#a39c94' }}>{item.desc}</p>
                    
                    {qty > 0 ? (
                      <div className="quantity-controls" style={{ 
                        marginTop: 'auto', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        background: 'rgba(212, 175, 55, 0.1)',
                        borderRadius: '8px',
                        padding: '0.3rem',
                        border: '1px solid rgba(212, 175, 55, 0.3)'
                      }}>
                        <button 
                          className="qty-btn" 
                          style={{ 
                            background: '#d4af37', 
                            color: '#000', 
                            border: 'none', 
                            borderRadius: '5px', 
                            width: '30px', 
                            height: '30px', 
                            cursor: 'pointer',
                            fontWeight: 'bold'
                          }}
                          onClick={() => decrement(item.id)}
                        >
                          -
                        </button>
                        <span style={{ fontWeight: 'bold', color: '#d4af37' }}>{qty}</span>
                        <button 
                          className="qty-btn" 
                          style={{ 
                            background: '#d4af37', 
                            color: '#000', 
                            border: 'none', 
                            borderRadius: '5px', 
                            width: '30px', 
                            height: '30px', 
                            cursor: 'pointer',
                            fontWeight: 'bold'
                          }}
                          onClick={() => increment(item.id)}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button 
                        className="btn-primary" 
                        style={{ 
                          marginTop: 'auto', 
                          padding: '0.6rem 1rem',
                          background: item.is_available ? '#d4af37' : '#444',
                          cursor: item.is_available ? 'pointer' : 'not-allowed',
                          opacity: item.is_available ? 1 : 0.5
                        }} 
                        onClick={() => item.is_available && addToCart(item)}
                        disabled={!item.is_available}
                      >
                        {item.is_available ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        {filteredItems.length > 6 && (
          <div className="menu-actions" style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button 
              className="btn-primary" 
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'View Less' : 'View All in ' + activeCategory}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default MenuPreview;
