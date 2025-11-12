import React, { useState } from 'react';
import '../Styles/Authentifier.css';
import { Link, useNavigate } from 'react-router-dom';

const Input = ({ id, label, type = 'text', placeholder, value, onChange }) => (
  <label className="field" htmlFor={id}>
    <div className="field-label">{label}</div>
    <input
      id={id}
      className="input"
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </label>
);

export default function AuthCard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [remember, setRemember] = useState(false);
  const [agree, setAgree] = useState(false); // pour "I agree..." (signup)

  // états d'erreur pour le sign up
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // validations en temps réel
  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);

    // Validation : non vide et uniquement lettres et espaces
    if (!value.trim()) {
      setNameError('Name is required');
    } else if (!/^[A-Za-z\s]+$/.test(value)) {
      setNameError('Name must contain only letters and spaces');
    } else {
      setNameError('');
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!e.target.value.trim()) setEmailError('Email is required');
    else if (!emailRegex.test(e.target.value)) setEmailError('Invalid email format');
    else setEmailError('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (!e.target.value) setPasswordError('Password is required');
    else if (e.target.value.length < 6) setPasswordError('Password must be at least 6 characters');
    else setPasswordError('');
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (!e.target.value) setConfirmPasswordError('Please confirm your password');
    else if (e.target.value !== password) setConfirmPasswordError("Passwords don't match");
    else setConfirmPasswordError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (tab === 'signin') {
      if (!email || !password) {
        alert('Please fill email and password');
        return;
      }
      console.log('Sign in', { email, password, remember });
      navigate('/connectedAdmin');
    } else {
      // check si des erreurs existent
      if (!name || !email || !password || !confirmPassword || !agree) {
        alert('Please complete all fields and accept the terms');
        return;
      }
      if (nameError || emailError || passwordError || confirmPasswordError) {
        alert('Please fix the errors before submitting');
        return;
      }

      console.log('Sign up', { name, email, password });
      navigate('/abonnement');
    }
  };

  return (
    <div className="app-bg">
      <div className="top-bar">
        <Link to="/" className="back-link">← Back to Home</Link>
      </div>
      <main className="center-wrap">
        <h1 className="welcome-title">Welcome to StockEase</h1>
        <p className="subtitle">Sign in to your account or create a new one</p>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Account Access</div>
            <div className="card-sub">Choose how you'd like to continue</div>
          </div>

          <div className="tabs" role="tablist" aria-label="Auth tabs">
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'signin'}
              className={`tab ${tab === 'signin' ? 'active' : ''}`}
              onClick={() => setTab('signin')}
            >
              Sign In
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'signup'}
              className={`tab ${tab === 'signup' ? 'active' : ''}`}
              onClick={() => setTab('signup')}
            >
              Sign Up
            </button>
          </div>

          <form className="form" onSubmit={handleSubmit}>
            {tab === 'signup' && (
              <>
                <Input
                  id="full-name"
                  label="Full name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={handleNameChange}
                />
                {nameError && <span className="error">{nameError}</span>}
              </>
            )}

            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
            />
            {emailError && <span className="error">{emailError}</span>}

            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
            />
            {passwordError && <span className="error">{passwordError}</span>}

            {tab === 'signup' && (
              <>
                <Input
                  id="confirm-password"
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                />
                {confirmPasswordError && <span className="error">{confirmPasswordError}</span>}
              </>
            )}

            <div className="row-between">
              {tab === 'signin' ? (
                <>
                  <label className="remember">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                    />{' '}
                    Remember me
                  </label>

                  <a className="forgot" href="#" onClick={(e) => e.preventDefault()}>
                    Forgot password?
                  </a>
                </>
              ) : (
                <label className="remember">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                  />{' '}
                  I agree to the Terms of Service and Privacy Policy
                </label>
              )}
            </div>

            <button
              type="submit"
              className={`primary-btn ${tab === 'signup' ? 'signup' : ''}`}
            >
              {tab === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="or-line" aria-hidden>
            <hr />
            <span>Or continue with</span>
          </div>

          <div className="socials">
            <button type="button" className="social-btn" onClick={() => console.log('Google login')}>
              Google
            </button>
            <button type="button" className="social-btn" onClick={() => console.log('Facebook login')}>
              Facebook
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
