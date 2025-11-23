import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import '../Styles/Authentifier.css';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

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
  const navigate = useNavigate()
  const { login } = useAuth()
  const [tab, setTab] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [agree, setAgree] = useState(false)
  const [selectedRole, setSelectedRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (tab === 'signin') {
      if (!email || !password) {
        setError('Please fill email and password')
        return
      }
      setLoading(true)
      try {
        const response = await authAPI.login(email, password)
        if (response.userId) {
          const userData = { 
            id: response.userId, 
            name: response.name, 
            email: response.email,
            role: response.role
          }
          const token = response.token || response.userId.toString()
          if (response.token) {
            localStorage.setItem('token', response.token)
          }
          login(token, userData)
        }
        setSuccess('Login successful! Redirecting...')
        setTimeout(() => navigate('/'), 1000)
      } catch (err) {
        setError(err.message || 'Login failed. Please check your credentials.')
      } finally {
        setLoading(false)
      }
    } else {
      if (!name || !email || !password || !confirmPassword || !phone) {
        setError('Please complete all fields')
        return
      }
      if (password !== confirmPassword) {
        setError("Passwords don't match")
        return
      }
      if (!agree) {
        setError('You must accept terms and privacy policy')
        return
      }
      if (!selectedRole) {
        setError('Please select your role')
        return
      }
      setLoading(true)
      try {
        const response = await authAPI.register(name, email, password, phone, selectedRole)
        if (response.userId) {
          const userData = {
            id: response.userId,
            name: response.name,
            email: response.email,
            role: response.role || selectedRole
          }
          // Use token if available, otherwise use userId as fallback
          const token = response.token || response.userId.toString()
          if (response.token) {
            localStorage.setItem('token', response.token)
          }
          login(token, userData)
        }
        setSuccess('Registration successful! Redirecting...')
        // If seller, redirect to shop setup, otherwise to home
        if (selectedRole === 'supplier' || response.role === 'SELLER' || response.role === 'supplier') {
          setTimeout(() => navigate('/seller/setup'), 1000)
        } else {
          setTimeout(() => navigate('/'), 1000)
        }
      } catch (err) {
        setError(err.message || 'Registration failed. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="app-bg">
      <div className="top-bar">
        <Link to="/" className="back-link">Back to Home</Link>
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

          {(error || success) && (
            <div className={`message ${error ? 'error' : 'success'}`} style={{
              padding: '12px',
              marginBottom: '16px',
              borderRadius: '8px',
              backgroundColor: error ? '#fee' : '#efe',
              color: error ? '#c33' : '#3c3',
              textAlign: 'center'
            }}>
              {error || success}
            </div>
          )}

          <form className="form" onSubmit={handleSubmit}>
            {tab === 'signup' && (
              <Input id="full-name" label="Full name" placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} />
            )}

            <Input id="email" label="Email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />

            {tab === 'signup' && (
              <Input id="phone" label="Phone Number" type="tel" placeholder="Enter your phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
            )}

            <Input id="password" label="Password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />

            {tab === 'signup' && (
              <Input id="confirm-password" label="Confirm Password" type="password" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            )}

            {tab === 'signup' && (
              <div className="row-between" style={{ margin: '16px 0' }}>
                <label className="remember">
                  <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} /> I agree to the Terms of Service and Privacy Policy
                </label>
              </div>
            )}

            {tab === 'signup' && (
              <>
                <div className="or-line" style={{ margin: '24px 0 16px' }}>
                  <hr />
                  <span>Choose your role</span>
                </div>

                <div className="socials" style={{ gap: '12px', marginBottom: '20px' }}>
                  <button
                    type="button"
                    className={`social-btn ${selectedRole === 'client' ? 'selected' : ''}`}
                    onClick={() => setSelectedRole('client')}
                  >
                    Register as Client
                  </button>
                  <button
                    type="button"
                    className={`social-btn ${selectedRole === 'supplier' ? 'selected' : ''}`}
                    onClick={() => setSelectedRole('supplier')}
                  >
                    Register as Supplier
                  </button>
                </div>
              </>
            )}

            <button
              type="submit"
              className="primary-btn"
              disabled={loading || (tab === 'signup' && !selectedRole)}
            >
              {loading ? 'Loading...' : (tab === 'signin' ? 'Sign In' : 'Create Account')}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}