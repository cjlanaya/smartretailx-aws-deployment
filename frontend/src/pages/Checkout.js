import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from '../services/api';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!address.trim()) return setError('Please enter a shipping address');
    setLoading(true); setError('');
    try {
      const items = cart.map(i => ({
        product_id: i.id,
        product_name: i.name,
        quantity: i.quantity,
        unit_price: i.price
      }));
      const r = await placeOrder({ shipping_address: address, items });
      clearCart();
      // Redirect to payment page with order details
      navigate('/payments', { state: { orderId: r.data.orderId, amount: r.data.total } });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order');
    } finally { setLoading(false); }
  };

  return (
    <div className="page">
      <h1 className="page-title">Checkout</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Shipping Details</h3>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleOrder}>
            <label style={{ fontSize: 13, color: '#a0a0a0', display: 'block', marginBottom: 6 }}>Shipping Address</label>
            <textarea rows={4} placeholder="123 Main St, City, Country" value={address} onChange={e => setAddress(e.target.value)} style={{ marginBottom: 24 }} required />
            <button className="btn btn-primary" style={{ width: '100%', padding: 14 }} disabled={loading}>
              {loading ? 'Placing order...' : `Continue to Payment — $${total.toFixed(2)}`}
            </button>
          </form>
        </div>

        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Order Summary</h3>
          {cart.map(i => (
            <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 14 }}>
              <span style={{ color: '#a0a0a0' }}>{i.name} × {i.quantity}</span>
              <span>${(i.price * i.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: 16, marginTop: 8, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18 }}>
            <span>Total</span><span style={{ color: '#f59e0b' }}>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
