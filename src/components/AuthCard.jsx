import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import '../Styles/Authentifier.css';

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
)

export default function AuthCard() {
  const [tab, setTab] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [remember, setRemember] = useState(false)
  const [agree, setAgree] = useState(false) // pour "I agree..." (signup)

  const handleSubmit = (e) => {
    e.preventDefault()

    if (tab === 'signin') {
      // validation sign in minimale
      if (!email || !password) {
        console.warn('Please fill email and password')
        return
      }
      console.log('Sign in', { email, password, remember })
      // TODO: appeler votre API de connexion
    } else {
      // validation sign up
      if (!name || !email || !password || !confirmPassword) {
        console.warn('Please complete all fields')
        return
      }
      if (password !== confirmPassword) {
        console.warn("Passwords don't match")
        return
      }
      if (!agree) {
        console.warn('You must accept terms and privacy policy')
        return
      }
      console.log('Sign up', { name, email, password })
      // TODO: appeler votre API d'inscription
    }
  }

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
          <Input
            id="full-name"
            label="Full name"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {tab === 'signup' && (
          <Input
            id="confirm-password"
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
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
            // signup: replace remember + remove Forgot password
            <label className="remember">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />{' '}
              I agree to the Terms of Service  and Privacy Policy
            </label>
          )}
        </div>

        <button type="submit"
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
        <button
          type="button"
          className="social-btn"
          onClick={() => console.log('Google login')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
            <path d="M21.6 11.2H12v2.8h5.4c-.6 2-2.2 3.4-4.6 3.4-2.6 0-4.8-2.2-4.8-4.8S10.2 8.8 12.8 8.8c1.3 0 2.2.6 2.8 1.2l2-2C16.8 6.4 15 5.6 12.8 5.6 8.6 5.6 5.2 9 5.2 13.2s3.4 7.6 7.6 7.6c6 0 9.2-4.6 9.2-8.8 0-.6 0-1-.4-1.8z" />
          </svg>
          Google
        </button>

        <button
          type="button"
          className="social-btn"
          onClick={() => console.log('Facebook login')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
            <path d="M22 12.1C22 6.7 17.5 2.4 12 2.4S2 6.7 2 12.1c0 5 3.6 9.2 8.4 9.9v-7h-2.5v-2.9h2.5V9.5c0-2.4 1.4-3.8 3.6-3.8 1 0 1.9.1 2.1.1v2.3h-1.2c-1 0-1.3.6-1.3 1.2v1.5h2.6l-.4 2.9h-2.2V22C18.4 21.3 22 17.1 22 12.1z" />
          </svg>
          Facebook
        </button>
      </div>
    </div>
      </main>
    </div>
  )
}
