import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyOrders } from '../services/api';

const statusColors = { pending:'badge-pending', confirmed:'badge-confirmed', processing:'badge-processing', shipped:'badge-shipped', delivered:'badge-delivered', cancelled:'badge-cancelled' };

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getMyOrders().then(r => setOrders(r.data.orders || [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="page">
      <h1 className="page-title">My Orders</h1>
      {orders.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">📦</div>
          <p style={{ fontWeight: 500, marginBottom: 4 }}>No orders yet</p>
          <p style={{ fontSize: 12, color: '#999', marginBottom: 20 }}>Your orders will appear here</p>
          <button className="btn btn-primary" onClick={() => navigate('/shop')}>Start shopping →</button>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table>
            <thead><tr><th>Order</th><th>Date</th><th>Total</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/orders/${o.id}`)}>
                  <td style={{ fontWeight: 600 }}>#{o.id}</td>
                  <td style={{ color: '#666' }}>{new Date(o.created_at).toLocaleDateString()}</td>
                  <td style={{ fontWeight: 600 }}>${o.total_amount}</td>
                  <td><span className={`badge ${statusColors[o.status]}`}>{o.status}</span></td>
                  <td style={{ color: '#666', fontSize: 12 }}>View →</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
