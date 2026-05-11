import React from 'react';
import './CartModal.css';

const CartModal = ({ isOpen, onClose, cartItems, increment, decrement, removeFromCart, onCheckout }) => {
  if (!isOpen) return null;

  const total = cartItems.reduce((sum, item) => sum + (parseFloat(item.price.replace('₹', '')) * item.quantity), 0);

  return (
    <div className="cart-modal-overlay" onClick={onClose}>
      <div className="cart-modal" onClick={e => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Your Order</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <p className="empty-cart">Your cart is empty. Add some delicious coffee!</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <p>{item.price}</p>
                </div>
                <div className="cart-item-actions">
                  <div className="quantity-controls">
                    <button className="qty-btn" onClick={() => decrement(item.id)}>-</button>
                    <span>{item.quantity}</span>
                    <button className="qty-btn" onClick={() => increment(item.id)}>+</button>
                  </div>
                  <button className="remove-btn" onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>
        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <button className="btn-primary checkout-btn" onClick={onCheckout}>Proceed to Checkout</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
