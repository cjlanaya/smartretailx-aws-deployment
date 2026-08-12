import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { cart, removeFromCart, updateQty, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (cart.length === 0) return (
    <div className="page" style={{ maxWidth: 480, margin: '80px auto', textAlign: 'center' }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>🛒</div>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Your cart is empty</h2>
      <p style={{ color: '#666', fontSize: 13, marginBottom: 24 }}>Add some products to get started.</p>
      <Link to="/shop"><button className="btn btn-primary">Browse products →</button></Link>
    </div>
  );

  return (
    <div className="page">
      <h1 className="page-title">Cart ({cart.length} item{cart.length !== 1 ? 's' : ''})</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {cart.map((item, i) => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderBottom: i < cart.length - 1 ? '1px solid #e5e5e5' : 'none' }}>
              <div style={{ width: 56, height: 56, borderRadius: 8, overflow: 'hidden', background: '#f3f3f3', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {item.image_url ? <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 20 }}>📦</span>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 13, marginBottom: 2 }}>{item.name}</div>
                <div style={{ fontSize: 12, color: '#666' }}>${item.price} each</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e5e5e5', borderRadius: 6, overflow: 'hidden' }}>
                <button onClick={() => updateQty(item.id, item.quantity - 1)} style={{ width: 30, height: 30, background: '#fafafa', border: 'none', cursor: 'pointer' }}>−</button>
                <span style={{ minWidth: 28, textAlign: 'center', fontSize: 13, fontWeight: 500 }}>{item.quantity}</span>
                <button onClick={() => updateQty(item.id, item.quantity + 1)} style={{ width: 30, height: 30, background: '#fafafa', border: 'none', cursor: 'pointer' }}>+</button>
              </div>
              <div style={{ fontWeight: 600, fontSize: 14, minWidth: 64, textAlign: 'right' }}>${(item.price * item.quantity).toFixed(2)}</div>
              <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', fontSize: 16 }}>✕</button>
            </div>
          ))}
          <div style={{ padding: '12px 20px', display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn btn-secondary btn-sm" onClick={clearCart}>Clear cart</button>
            <Link to="/shop" style={{ textDecoration: 'none' }}><button className="btn btn-secondary btn-sm">← Continue shopping</button></Link>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Order summary</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#666', marginBottom: 8 }}>
            <span>Subtotal ({cart.reduce((s,i) => s+i.quantity, 0)} items)</span><span>${total.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#666', marginBottom: 16 }}>
            <span>Shipping</span><span style={{ color: '#16a34a' }}>Free</span>
          </div>
          <hr style={{ marginBottom: 16 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16, marginBottom: 20 }}>
            <span>Total</span><span>${total.toFixed(2)}</span>
          </div>
          <button className="btn btn-primary" style={{ width: '100%', padding: 11 }} onClick={() => user ? navigate('/checkout') : navigate('/login')}>
            {user ? 'Checkout →' : 'Sign in to checkout →'}
          </button>
        </div>
      </div>
    </div>
  );
}
