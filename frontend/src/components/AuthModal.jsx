import React, { useState } from 'react';
import { FiX, FiMail, FiLock, FiSmartphone, FiUser } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, onLogin }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      onLogin(email, isLoginView ? email.split('@')[0] : name); 
      onClose();
    } else {
      alert('Please enter both email and password.');
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="auth-header">
          <h2>{isLoginView ? 'Login' : 'Sign Up'}</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            <FiX />
          </button>
        </div>
        
        <div className="auth-body">
          <form onSubmit={handleSubmit}>
            {!isLoginView && (
              <div className="form-group auth-group animate-fade-in">
                <label>Full Name</label>
                <div className="input-with-icon">
                  <FiUser className="input-icon" />
                  <input 
                    type="text" 
                    placeholder="Enter your full name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLoginView} 
                  />
                </div>
              </div>
            )}
            <div className="form-group auth-group">
              <label>Email</label>
              <div className="input-with-icon">
                <FiMail className="input-icon" />
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>
            <div className="form-group auth-group">
              <label>Password</label>
              <div className="input-with-icon">
                <FiLock className="input-icon" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>
            <button type="submit" className="btn-primary auth-submit-btn">
              {isLoginView ? 'Login' : 'Create account'}
            </button>
          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <div className="social-logins">
            <button className="social-btn google">
              <FcGoogle /> <span>Continue with Google</span>
            </button>
            <button className="social-btn phone">
              <FiSmartphone /> <span>Continue with Phone</span>
            </button>
          </div>
        </div>

        <div className="auth-footer">
          <p>
            {isLoginView ? "New to Aether? " : "Already have an account? "}
            <span className="toggle-auth" onClick={() => setIsLoginView(!isLoginView)}>
              {isLoginView ? 'Create account' : 'Login'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
