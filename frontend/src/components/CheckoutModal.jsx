import React, { useState } from 'react';
import './CheckoutModal.css';

const CheckoutModal = ({ isOpen, onClose, onCheckoutSuccess, cartItems }) => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState(null);
  const [orderId, setOrderId] = useState(null);

  if (!isOpen) return null;

  const total = cartItems.reduce((sum, item) => sum + (parseFloat(item.price.replace('₹', '')) * item.quantity), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    const orderPayload = {
      customer_name: customerName,
      address: address,
      total_amount: total.toFixed(2),
      items: cartItems.map(item => ({
        product_name: item.name,
        price: parseFloat(item.price.replace('₹', '')),
        quantity: item.quantity,
        image: item.image
      }))
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/orders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        throw new Error('Failed to submit order');
      }
      
      const result = await response.json();
      setOrderId(result.id);

      setStep(2); // Success step
    } catch (err) {
      console.error(err);
      setError('An error occurred while processing your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinish = () => {
    setStep(1);
    setCustomerName('');
    setAddress('');
    onCheckoutSuccess();
  };

  return (
    <div className="checkout-overlay" onClick={onClose}>
      <div className="checkout-modal" onClick={e => e.stopPropagation()}>
        {step === 1 ? (
          <>
            <div className="checkout-header">
              <h2>Secure Checkout</h2>
              <button className="close-btn" onClick={onClose}>&times;</button>
            </div>
            <div className="checkout-body">
              <div className="checkout-summary">
                <h3>Order Summary</h3>
                <p>Total Items: {cartItems.reduce((a, b) => a + b.quantity, 0)}</p>
                <p className="summary-total">Total: ₹{total.toFixed(2)}</p>
              </div>

              <form onSubmit={handleSubmit} className="checkout-form">
                {error && <div className="error-message" style={{color: 'red', marginBottom: '1rem'}}>{error}</div>}
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" required placeholder="Jane Doe" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Shipping Address</label>
                  <input type="text" required placeholder="123 Coffee Street, Seattle, WA" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Card Details</label>
                  <input type="text" required placeholder="XXXX XXXX XXXX XXXX" maxLength="19" />
                </div>
                <div className="form-group-row">
                  <div className="form-group">
                    <label>Expiry</label>
                    <input type="text" required placeholder="MM/YY" maxLength="5" />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input type="password" required placeholder="123" maxLength="4" />
                  </div>
                </div>
                <button type="submit" className="btn-primary checkout-pay-btn" disabled={isProcessing}>
                  {isProcessing ? 'Processing securely...' : `Pay ₹${total.toFixed(2)}`}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="checkout-success">
            <div className="success-icon">✓</div>
            <h2>Order Confirmed!</h2>
            <p style={{ marginBottom: '0.5rem' }}>Your delicious coffee is on the way.</p>
            {orderId && (
              <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '0.5rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.8rem', color: '#d4af37' }}>
                Order ID: <span style={{ fontWeight: 'bold' }}>{orderId}</span>
              </div>
            )}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
              <button className="btn-primary" onClick={handleFinish}>Continue Exploring</button>
              
              <button 
                onClick={async () => {
                  if (window.confirm('Are you sure you want to cancel this order?')) {
                    try {
                      await fetch(`http://127.0.0.1:8000/api/orders/${orderId}/status/`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: 'Cancelled' })
                      });
                      alert('Order Cancelled successfully.');
                      handleFinish();
                    } catch (err) {
                      alert('Failed to cancel order.');
                    }
                  }
                }}
                style={{ 
                  background: 'transparent', 
                  border: '1px solid #ff4444', 
                  color: '#ff4444', 
                  padding: '0.8rem', 
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Cancel My Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
