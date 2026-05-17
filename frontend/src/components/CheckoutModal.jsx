import React, { useState, useEffect } from 'react';
import { FiX, FiCheckCircle, FiTruck, FiCreditCard, FiMapPin, FiUser } from 'react-icons/fi';
import './CheckoutModal.css';
import { api } from '../api';

const CheckoutModal = ({ isOpen, onClose, onCheckoutSuccess, cartItems }) => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('online'); // 'online' or 'cod'
  const [error, setError] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [liveStatus, setLiveStatus] = useState('pending');

  useEffect(() => {
    if (!orderId) return;

    const fetchStatus = async () => {
      try {
        const res = await api.getOrderStatus(orderId);
        if (res && res.status) {
          setLiveStatus(res.status);
          if (res.status === 'Cancelled') {
            setIsCancelled(true);
          }
        }
      } catch (e) {
        console.error("Error fetching order status:", e);
      }
    };
    fetchStatus();

    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, [orderId]);

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return <span className="detail-value status" style={{ color: '#24963f', fontWeight: 'bold' }}>Delivered ✓</span>;
      case 'Cancelled':
        return <span className="detail-value status" style={{ color: '#e23744', fontWeight: 'bold' }}>Cancelled ✕</span>;
      default:
        return <span className="detail-value status" style={{ color: '#ffb300', fontWeight: 'bold' }}>Preparing...</span>;
    }
  };

  if (!isOpen) return null;

  const total = cartItems.reduce((sum, item) => sum + (parseFloat(item.price.replace('₹', '')) * item.quantity), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    if (paymentMethod === 'online') {
      setPaymentStatus('Initiating Payment...');
      await new Promise(resolve => setTimeout(resolve, 800));
      setPaymentStatus('Verifying Details...');
      await new Promise(resolve => setTimeout(resolve, 1200));
      setPaymentStatus('Payment Successful!');
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    setPaymentStatus('Placing Order...');

    const orderPayload = {
      customer_name: customerName,
      address: address,
      phone: phone,
      payment_method: paymentMethod,
      total_amount: total.toFixed(2),
      items: cartItems.map(item => ({
        product_name: item.name,
        price: parseFloat(item.price.replace('₹', '')),
        quantity: item.quantity,
        image: item.image
      }))
    };

    try {
      const result = await api.placeOrder(orderPayload);
      setOrderId(result.order_id || result.id);
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
    setPhone('');
    setPaymentStatus('');
    setIsCancelled(false);
    onCheckoutSuccess();
  };

  const handleCancelOrder = async () => {
    if (!orderId) return;
    setIsCancelling(true);
    try {
      await api.cancelOrder(orderId);
      setIsCancelled(true);
    } catch (err) {
      console.error('Error cancelling order:', err);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="checkout-overlay" onClick={onClose}>
      <div className="checkout-modal animate-slide-up" onClick={e => e.stopPropagation()}>
        {step === 1 ? (
          <>
            <div className="checkout-header">
              <div className="header-title-wrap">
                <h2>Secure Checkout</h2>
                <p>Complete your order to enjoy delicious food</p>
              </div>
              <button className="close-btn" onClick={onClose} aria-label="Close modal">
                <FiX />
              </button>
            </div>
            
            <div className="checkout-body">
              <div className="checkout-content-grid">
                <div className="checkout-form-section">
                  <form onSubmit={handleSubmit} className="checkout-form">
                    <h3 className="section-title"><FiUser /> Personal Details</h3>
                    <div className="form-group">
                      <label>Full Name</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="Enter your name" 
                        value={customerName} 
                        onChange={(e) => setCustomerName(e.target.value)} 
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input 
                        type="tel" 
                        required 
                        placeholder="Enter 10-digit phone number" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                      />
                    </div>

                    <h3 className="section-title"><FiMapPin /> Delivery Address</h3>
                    <div className="form-group">
                      <label>Complete Address</label>
                      <textarea 
                        required 
                        placeholder="House No, Building Name, Area, Landmark" 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)}
                        rows="3"
                      />
                    </div>

                    <h3 className="section-title"><FiCreditCard /> Payment Method</h3>
                    <div className="payment-options">
                      <div 
                        className={`payment-option ${paymentMethod === 'online' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('online')}
                      >
                        <div className="option-radio"></div>
                        <div className="option-info">
                          <span className="option-title">Online Payment</span>
                          <span className="option-desc">Cards, UPI, Netbanking</span>
                        </div>
                        <FiCreditCard className="option-icon" />
                      </div>
                      
                      <div 
                        className={`payment-option ${paymentMethod === 'cod' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('cod')}
                      >
                        <div className="option-radio"></div>
                        <div className="option-info">
                          <span className="option-title">Cash on Delivery</span>
                          <span className="option-desc">Pay when food arrives</span>
                        </div>
                        <FiTruck className="option-icon" />
                      </div>
                    </div>

                    {paymentMethod === 'online' && (
                      <div className="card-details-simulated animate-fade-in">
                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                          <label>Card Number</label>
                          <input type="text" placeholder="XXXX XXXX XXXX XXXX" required={paymentMethod === 'online'} maxLength="19" />
                        </div>
                        <div className="card-row">
                          <div className="form-group" style={{ marginBottom: '0' }}>
                            <label>Expiry Date</label>
                            <input type="text" placeholder="MM/YY" required={paymentMethod === 'online'} maxLength="5" />
                          </div>
                          <div className="form-group" style={{ marginBottom: '0' }}>
                            <label>CVV</label>
                            <input type="password" placeholder="XXX" required={paymentMethod === 'online'} maxLength="3" />
                          </div>
                        </div>
                      </div>
                    )}

                    {error && <div className="error-message">{error}</div>}
                    
                    <button type="submit" className="btn-primary checkout-pay-btn" disabled={isProcessing}>
                      {isProcessing ? (paymentStatus || 'Processing...') : (paymentMethod === 'online' ? `Pay ₹${total.toFixed(2)}` : `Place Order (₹${total.toFixed(2)})`)}
                    </button>
                  </form>
                </div>

                <div className="checkout-summary-section">
                  <div className="summary-card">
                    <h3>Order Summary</h3>
                    <div className="summary-items">
                      {cartItems.map(item => (
                        <div key={item.id} className="summary-item">
                          <span className="item-qty">{item.quantity} x</span>
                          <span className="item-name">{item.name}</span>
                          <span className="item-price">₹{(parseFloat(item.price.replace('₹', '')) * item.quantity).toFixed(0)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="summary-divider"></div>
                    <div className="summary-row">
                      <span>Item Total</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Delivery Fee</span>
                      <span className="free-text">FREE</span>
                    </div>
                    <div className="summary-divider"></div>
                    <div className="summary-row total">
                      <span>Total Amount</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="checkout-success animate-fade-in">
            {isCancelled ? (
              <>
                <div className="success-icon-wrap">
                  <FiX className="success-icon" style={{ color: '#e23744', filter: 'drop-shadow(0 10px 15px rgba(226, 55, 68, 0.2))' }} />
                </div>
                <h2>Order Cancelled</h2>
                <p>Your order has been successfully cancelled. The restaurant has been notified.</p>
                <button className="btn-primary success-btn" onClick={handleFinish}>
                  Back to Menu
                </button>
              </>
            ) : (
              <>
                <div className="success-icon-wrap">
                  <FiCheckCircle className="success-icon" />
                </div>
                <h2>Order Placed Successfully!</h2>
                <p>Your order is confirmed and will be delivered within 30-40 mins.</p>
                
                <div className="order-details-card">
                  <div className="detail-row">
                    <span>Order ID</span>
                    <span className="detail-value">#{orderId || '76543'}</span>
                  </div>
                  <div className="detail-row">
                    <span>Payment</span>
                    <span className="detail-value">{paymentMethod === 'online' ? 'Online Paid' : 'Cash on Delivery'}</span>
                  </div>
                  <div className="detail-row">
                    <span>Status</span>
                    {getStatusLabel(liveStatus)}
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn-primary success-btn" onClick={handleFinish} style={{ flex: 1 }}>
                    Continue
                  </button>
                  <button 
                    className="btn-secondary success-btn" 
                    onClick={handleCancelOrder}
                    disabled={isCancelling}
                    style={{ 
                      flex: 1, 
                      background: 'rgba(226, 55, 68, 0.1)', 
                      color: '#e23744', 
                      border: '1px solid rgba(226, 55, 68, 0.3)' 
                    }}
                  >
                    {isCancelling ? 'Cancelling...' : 'Cancel Order'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
