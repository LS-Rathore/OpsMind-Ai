import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import * as authService from '../services/authService.js';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await authService.register(name, email, password, 'user');
        await login(email, password);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const pageStyle = {
    backgroundColor: 'var(--bg-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    boxSizing: 'border-box',
    padding: '24px',
    backgroundImage: 'radial-gradient(circle at 50% 0%, var(--bg-tertiary) 0%, var(--bg-primary) 50%)',
  };

  const cardStyle = {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-subtle)',
    borderRadius: '24px',
    padding: '56px 48px',
    width: '100%',
    maxWidth: '440px',
    boxSizing: 'border-box',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    display: 'flex',
    flexDirection: 'column',
  };

  const titleStyle = {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '32px',
    color: 'var(--text-primary)',
    letterSpacing: '-0.03em',
    lineHeight: '1.2',
    marginBottom: '8px',
    textAlign: 'center',
    fontWeight: '600',
  };

  const subtitleStyle = {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '15px',
    color: 'var(--text-muted)',
    letterSpacing: '-0.01em',
    textAlign: 'center',
    marginBottom: '48px',
  };

  const labelStyle = {
    fontFamily: "'Space Mono', ui-monospace, monospace",
    fontSize: '11px',
    color: 'var(--text-muted)',
    letterSpacing: '0.1em',
    marginBottom: '10px',
    display: 'block',
    textTransform: 'uppercase',
    fontWeight: '500',
  };

  const getInputStyle = (fieldName) => {
    const isFocused = focusedField === fieldName;
    return {
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-secondary)',
      border: '1px solid',
      borderColor: isFocused ? 'var(--border-strong)' : 'var(--border-subtle)',
      borderRadius: '16px',
      padding: '16px 20px',
      fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
      fontSize: '15px',
      letterSpacing: '0em',
      width: '100%',
      outline: 'none',
      boxSizing: 'border-box',
      marginBottom: '24px',
      boxShadow: isFocused ? '0 0 0 1px var(--border-subtle)' : 'none',
      transition: 'all 0.2s ease',
    };
  };

  const submitButtonStyle = {
    backgroundColor: '#ffffff',
    color: '#000000',
    border: 'none',
    borderRadius: '9999px',
    padding: '16px 24px',
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '15px',
    fontWeight: '600',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    width: '100%',
    marginTop: '12px',
    opacity: isLoading ? 0.7 : 1,
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  };

  const toggleLinkStyle = {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '13px',
    color: 'var(--text-muted)',
    textAlign: 'center',
    marginTop: '32px',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    width: '100%',
    display: 'block',
    transition: 'color 0.2s ease',
  };

  const errorStyle = {
    color: '#ef4444',
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: '14px',
    textAlign: 'center',
    marginBottom: '24px',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid rgba(239, 68, 68, 0.2)',
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>OpsMind AI</h1>
        <h2 style={subtitleStyle}>Knowledge Assistant</h2>

        {error && <div style={errorStyle}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label style={labelStyle}>Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField('')}
                style={getInputStyle('name')}
                placeholder="Enter your name"
              />
            </div>
          )}

          <label style={labelStyle}>Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField('')}
            style={getInputStyle('email')}
            placeholder="name@company.com"
          />

          <label style={labelStyle}>Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField('')}
            style={getInputStyle('password')}
            placeholder="••••••••"
          />

          <button type="submit" disabled={isLoading} style={submitButtonStyle}>
            {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <button onClick={() => setIsLogin(!isLogin)} style={toggleLinkStyle}>
          {isLogin ? 'or create an account' : 'or sign in instead'}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
