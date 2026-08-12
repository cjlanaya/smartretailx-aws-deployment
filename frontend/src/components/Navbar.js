import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };
  const isActive = (path) => location.pathname === path;

  const navLink = (to, label) => (
    <Link to={to} onClick={() => setMenuOpen(false)} style={{
      fontSize: 13, fontWeight: 500, textDecoration: 'none',
      color: isActive(to) ? '#111' : '#666',
      borderBottom: isActive(to) ? '1px solid #111' : '1px solid transparent',
      paddingBottom: 1
    }}>{label}</Link>
  );

  return (
    <nav style={{ background: '#fff', borderBottom: '1px solid #e5e5e5', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, background: '#111', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 700, fontFamily: 'Space Grotesk' }}>S</span>
          </div>
          <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 16, color: '#111', letterSpacing: '-0.3px' }}>SmartRetailX</span>
        </Link>

        {/* Center nav */}
        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          {navLink('/shop', 'Shop')}
          {navLink('/about', 'About')}
          {navLink('/contact', 'Contact')}
          {user && !isAdmin && navLink('/orders', 'My Orders')}
          {isAdmin && <Link to="/admin" style={{ fontSize: 13, fontWeight: 600, color: '#111', textDecoration: 'none', background: '#f3f3f3', padding: '4px 10px', borderRadius: 5 }}>Admin ↗</Link>}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {user ? (
            <>
              <NotificationBell />
              <Link to="/cart" style={{ textDecoration: 'none', color: '#111', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 5 }}>
                Cart
                {itemCount > 0 && <span style={{ background: '#111', color: '#fff', borderRadius: 10, padding: '1px 6px', fontSize: 11, fontWeight: 600 }}>{itemCount}</span>}
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 12, color: '#666' }}>{user.name?.split(' ')[0]}</span>
                <button onClick={handleLogout} className="btn btn-secondary btn-sm">Sign out</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/cart" style={{ textDecoration: 'none', color: '#666', fontSize: 13 }}>
                Cart {itemCount > 0 && `(${itemCount})`}
              </Link>
              <Link to="/login" style={{ textDecoration: 'none', color: '#666', fontSize: 13, fontWeight: 500 }}>Sign in</Link>
              <Link to="/register"><button className="btn btn-primary btn-sm">Get started</button></Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
