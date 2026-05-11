import React, { useState } from 'react';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, onLogin }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      onLogin(email); 
      onClose();
    } else {
      alert('Please enter both email and password.');
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        <div className="auth-header">
          <h2>{isLoginView ? 'Welcome Back' : 'Create Account'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <form className="auth-body" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="you@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn-primary auth-submit-btn">
            {isLoginView ? 'Login' : 'Sign Up'}
          </button>
        </form>
        <div className="auth-footer">
          <p>
            {isLoginView ? "Don't have an account? " : "Already have an account? "}
            <span className="toggle-auth" onClick={() => setIsLoginView(!isLoginView)}>
              {isLoginView ? 'Sign Up' : 'Login'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
