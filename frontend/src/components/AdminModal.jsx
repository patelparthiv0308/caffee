import React, { useState } from 'react';
import { FiX, FiLock, FiShield } from 'react-icons/fi';
import './AdminModal.css';

const AdminModal = ({ isOpen, onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Verify against admin credentials
    if (password === 'admin123') {
      setError('');
      setPassword('');
      onSuccess();
      onClose();
    } else {
      setError('Invalid Administrator password.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className={`auth-modal admin-modal ${isShaking ? 'shake-anim' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="auth-header">
          <div className="admin-title-wrap">
            <FiShield className="admin-shield-icon" />
            <h2>Admin Verification</h2>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            <FiX />
          </button>
        </div>
        
        <div className="auth-body">
          <p className="admin-hint-text">
            This area is restricted to restaurant managers and administrators. Please enter the Administrator access key to open the dashboard.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group auth-group">
              <label>Admin Password</label>
              <div className="input-with-icon">
                <FiLock className="input-icon" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  autoFocus
                />
              </div>
              {error && <span className="admin-error-text animate-fade-in">{error}</span>}
            </div>

            <button type="submit" className="btn-primary auth-submit-btn admin-submit-btn">
              Verify & Open Dashboard
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminModal;
