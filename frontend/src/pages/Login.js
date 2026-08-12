import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const r = await login(form);
      loginUser(r.data.user, r.data.token);
      navigate(r.data.user.role === 'admin' ? '/admin' : '/shop');
    } catch (err) { setError(err.response?.data?.error || 'Login failed'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 360 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 36, height: 36, background: '#111', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>S</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Sign in</h1>
          <p style={{ color: '#666', fontSize: 13 }}>Welcome back to SmartRetailX</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label>Email address</label>
            <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button className="btn btn-primary" style={{ width: '100%', padding: 11 }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#666' }}>
          Don't have an account? <Link to="/register" style={{ color: '#111', fontWeight: 500 }}>Register</Link>
        </p>

        <div style={{ marginTop: 24, padding: 14, background: '#fafafa', borderRadius: 8, border: '1px solid #e5e5e5' }}>
          <div style={{ fontSize: 11, color: '#999', fontWeight: 500, marginBottom: 8 }}>Demo credentials</div>
          <div style={{ fontSize: 12, color: '#444' }}>Admin: <code style={{ background: '#f0f0f0', padding: '1px 5px', borderRadius: 3 }}>admin@smartretailx.com</code></div>
          <div style={{ fontSize: 12, color: '#444', marginTop: 4 }}>Password: <code style={{ background: '#f0f0f0', padding: '1px 5px', borderRadius: 3 }}>admin123</code></div>
        </div>
      </div>
    </div>
  );
}
