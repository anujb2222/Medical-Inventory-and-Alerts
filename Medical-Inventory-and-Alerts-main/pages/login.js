// pages/login.js
import { useState } from 'react';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1200); // Just a dummy loading effect
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #f0f4ff 0%, #e0e7ff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0,
    }}>
      <div style={{
        display: 'flex',
        background: 'white',
        borderRadius: '24px',
        boxShadow: '0 8px 32px rgba(30,58,138,0.13)',
        overflow: 'hidden',
        maxWidth: '900px',
        width: '100%',
        minHeight: '500px',
      }}>
        {/* Image Section */}
        <div style={{
          flex: 1.2,
          background: 'linear-gradient(120deg, #2563eb 0%, #38bdf8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}>
          <img
            src="https://www.eturns.com/media/drljj503/medical-hero.png"
            alt="Medical Illustration"
            style={{
              width: '100%',
              maxWidth: '350px',
              borderRadius: '18px',
              boxShadow: '0 4px 16px rgba(16,185,129,0.10)',
              objectFit: 'cover',
            }}
          />
        </div>
        {/* Form Section */}
        <div style={{
          flex: 1,
          padding: '3rem 2.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <h2 style={{
            fontSize: '2.1rem',
            fontWeight: 'bold',
            color: '#1e3a8a',
            marginBottom: '1.2rem',
            textAlign: 'center',
            letterSpacing: '1px',
          }}>
            Welcome Back!
          </h2>
          <p style={{
            color: '#64748b',
            textAlign: 'center',
            marginBottom: '2rem',
            fontSize: '1.08rem',
          }}>
            Login to access your medical inventory dashboard.
          </p>
          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.2rem',
          }}>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
              style={{
                padding: '1rem',
                borderRadius: '10px',
                border: '1px solid #c7d2fe',
                fontSize: '1.05rem',
                outline: 'none',
                boxShadow: '0 2px 8px rgba(37,99,235,0.03)',
              }}
            />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
              style={{
                padding: '1rem',
                borderRadius: '10px',
                border: '1px solid #c7d2fe',
                fontSize: '1.05rem',
                outline: 'none',
                boxShadow: '0 2px 8px rgba(37,99,235,0.03)',
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                background: 'linear-gradient(90deg, #2563eb 0%, #1e40af 100%)',
                color: 'white',
                padding: '1rem',
                borderRadius: '10px',
                border: 'none',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 8px rgba(37,99,235,0.08)',
                transition: 'background 0.2s',
              }}
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>
          <div style={{
            textAlign: 'center',
            marginTop: '2rem',
            color: '#64748b',
            fontSize: '1rem',
          }}>
            <span>Forgot your password? </span>
            <a href="#" style={{ color: '#2563eb', fontWeight: 'bold', textDecoration: 'underline', cursor: 'pointer' }}>
              Reset here
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
