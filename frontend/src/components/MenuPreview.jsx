import React, { useState, useEffect } from 'react';
import { FiStar, FiClock, FiPlus, FiMinus, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import './MenuPreview.css';
import { api } from '../api';

const categories = [
  { name: 'Bestseller', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=150&auto=format&fit=crop' },
  { name: 'Drinks', image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=150&auto=format&fit=crop' },
  { name: 'Food', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=150&auto=format&fit=crop' },
  { name: 'Cake', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=150&auto=format&fit=crop' },
  { name: 'Coffee At Home', image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=150&auto=format&fit=crop' }
];

const MenuPreview = ({ addToCart, cartItems, increment, decrement, isAdminMode }) => {
  const [activeCategory, setActiveCategory] = useState('Bestseller');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const getQuantity = (id) => {
    const item = cartItems.find(i => i.id === id);
    return item ? item.quantity : 0;
  };

  const handleToggleStock = async (id) => {
    await api.toggleStock(id);
    loadProducts();
  };

  const loadProducts = () => {
    api.getProducts()
      .then(data => {
        const formattedData = data.map(item => ({
          ...item,
          rating: item.rating || (3.5 + Math.random() * 1.4).toFixed(1), // Simulated rating
          time: item.time || Math.floor(Math.random() * 20 + 20) + ' min', // Simulated delivery time
          price: typeof item.price === 'string' && item.price.startsWith('₹') ? item.price : `₹${parseFloat(item.price || 0).toFixed(0)}`,
          category: typeof item.category === 'string' ? item.category.split(',').map(c => c.trim()) : (Array.isArray(item.category) ? item.category : ['All'])
        }));
        setMenuItems(formattedData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProducts();
  }, [isAdminMode]);

  const filteredItems = activeCategory === 'All'
    ? menuItems
    : menuItems.filter(item => item.category.some(c => c.toLowerCase() === activeCategory.toLowerCase()));

  return (
    <section id="menu" className="menu-preview">
      <div className="container">
        <div className="collection-header">
          <h2 className="section-title">Our Menu</h2>
          <div className="category-scroll">
            {categories.map(cat => (
              <button
                key={cat.name}
                className={`category-pill ${activeCategory === cat.name ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.name)}
              >
                <img src={cat.image} alt={cat.name} className="category-img" />
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="menu-grid">
          {loading ? (
            <div className="loading-state">
              <div className="shimmer-card"></div>
              <div className="shimmer-card"></div>
              <div className="shimmer-card"></div>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const qty = getQuantity(item.id);
              const isBestseller = item.category.includes('Bestseller');
              
              return (
                <div
                  key={item.id}
                  className={`food-card animate-slide ${!item.is_available ? 'unavailable' : ''}`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="food-img-wrapper">
                    <img src={item.image} alt={item.name} loading="lazy" />
                    {isBestseller && <span className="bestseller-tag">Bestseller</span>}
                    <div className="delivery-time-tag">
                      <FiClock /> {item.time}
                    </div>
                    {!item.is_available && (
                      <div className="sold-out-overlay animate-fade">
                        <div className="sold-out-badge">
                          Out Of Stock
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="food-details">
                    <div className="food-header">
                      <h3 className="food-name">{item.name}</h3>
                      <div className="rating-badge">
                        {item.rating} <FiStar />
                      </div>
                    </div>
                    
                    <div className="food-meta">
                      <p className="food-type">{item.category.filter(c => c !== 'All' && c !== 'Bestseller').join(', ')}</p>
                      <p className="food-price-for-two">{item.price} for one</p>
                    </div>
                    
                    <div className="food-action">
                      {isAdminMode ? (
                        <button
                          className={`admin-toggle-stock-btn ${item.is_available ? 'in-stock' : 'out-of-stock'}`}
                          onClick={() => handleToggleStock(item.id)}
                        >
                          {item.is_available ? 'Set Out of Stock' : 'Set In Stock'}
                        </button>
                      ) : qty > 0 ? (
                        <div className="qty-selector">
                          <button onClick={() => decrement(item.id)}><FiMinus /></button>
                          <span>{qty}</span>
                          <button onClick={() => increment(item.id)}><FiPlus /></button>
                        </div>
                      ) : (
                        <button 
                          className="add-to-cart-btn"
                          onClick={() => item.is_available && addToCart(item)}
                          disabled={!item.is_available}
                        >
                          {item.is_available ? 'Add +' : 'Out of Stock'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default MenuPreview;
