import React, { useEffect, useState } from 'react';
import { getAllPayments, refundPayment } from '../../services/api';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setError('');
    getAllPayments()
      .then(r => {
        setPayments(r.data.payments || []);
        setRevenue(r.data.total_revenue || 0);
      })
      .catch(err => {
        const msg = err.response?.data?.error || 'Failed to load payments';
        setError(msg);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleRefund = async (id) => {
    if (window.confirm('Refund this payment?')) {
      try { await refundPayment(id); load(); }
      catch { alert('Refund failed'); }
    }
  };

  const statusColor = { success: '#16a34a', failed: '#dc2626', pending: '#d97706', refunded: '#7c3aed' };

  if (loading) return <div className="loading">Loading payments...</div>;

  return (
    <div className="page">
      <h1 className="page-title">Payments</h1>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: 20 }}>
          {error} — Make sure Payment Service (port 3005) is running.
          <button className="btn btn-secondary btn-sm" style={{ marginLeft: 12 }} onClick={load}>Retry</button>
        </div>
      )}

      <div className="grid2" style={{ marginBottom: 24 }}>
        <div className="card">
          <div style={{ fontSize: 11, color: '#999', fontWeight: 500, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Total Revenue</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>${revenue}</div>
        </div>
        <div className="card">
          <div style={{ fontSize: 11, color: '#999', fontWeight: 500, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Total Transactions</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{payments.length}</div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table>
          <thead><tr><th>ID</th><th>Order</th><th>User</th><th>Amount</th><th>Status</th><th>Card</th><th>Date</th><th>Action</th></tr></thead>
          <tbody>
            {payments.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', color: '#999', padding: 40 }}>No payments yet</td></tr>
            ) : payments.map(p => (
              <tr key={p.id}>
                <td style={{ color: '#666' }}>#{p.id}</td>
                <td>#{p.order_id}</td>
                <td style={{ color: '#666' }}>User #{p.user_id}</td>
                <td style={{ fontWeight: 600 }}>${p.amount}</td>
                <td><span style={{ color: statusColor[p.status], fontWeight: 600, textTransform: 'capitalize' }}>{p.status}</span></td>
                <td style={{ color: '#666' }}>**** {p.card_last_four}</td>
                <td style={{ color: '#666', fontSize: 12 }}>{new Date(p.created_at).toLocaleDateString()}</td>
                <td>{p.status === 'success' && <button className="btn btn-danger btn-sm" onClick={() => handleRefund(p.id)}>Refund</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
