import React, { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus } from '../../services/api';

const statuses = ['pending','confirmed','processing','shipped','delivered','cancelled'];
const statusColors = { pending:'badge-pending', confirmed:'badge-confirmed', processing:'badge-processing', shipped:'badge-shipped', delivered:'badge-delivered', cancelled:'badge-cancelled' };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(null);

  const load = () => {
    setError('');
    getAllOrders()
      .then(r => setOrders(r.data.orders || []))
      .catch(err => setError(err.response?.data?.error || 'Failed to load orders'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleStatus = async (id, status) => {
    setUpdating(id);
    try { await updateOrderStatus(id, status); load(); }
    catch { alert('Failed to update status'); }
    finally { setUpdating(null); }
  };

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="page">
      <h1 className="page-title">All Orders</h1>

      {error && (
        <div className="alert alert-error">
          {error}
          <button className="btn btn-secondary btn-sm" style={{ marginLeft: 12 }} onClick={load}>Retry</button>
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table>
          <thead><tr><th>Order</th><th>User</th><th>Amount</th><th>Date</th><th>Status</th><th>Update</th></tr></thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: '#999', padding: 40 }}>No orders yet</td></tr>
            ) : orders.map(o => (
              <tr key={o.id}>
                <td style={{ fontWeight: 600 }}>#{o.id}</td>
                <td style={{ color: '#666' }}>User #{o.user_id}</td>
                <td style={{ fontWeight: 600 }}>${o.total_amount}</td>
                <td style={{ color: '#666', fontSize: 12 }}>{new Date(o.created_at).toLocaleDateString()}</td>
                <td><span className={`badge ${statusColors[o.status]}`}>{o.status}</span></td>
                <td>
                  <select value={o.status} disabled={updating === o.id}
                    onChange={e => handleStatus(o.id, e.target.value)}
                    style={{ width: 'auto', padding: '5px 8px', fontSize: 12 }}>
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
