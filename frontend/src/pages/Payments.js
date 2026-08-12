import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { processPayment, getMyPayments } from '../services/api';

export default function Payments() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;
  const amount = location.state?.amount;

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ card_number: '', card_expiry: '', card_cvv: '' });
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getMyPayments().then(r => setPayments(r.data.payments || [])).finally(() => setLoading(false));
  }, []);

  const handlePay = async (e) => {
    e.preventDefault();
    setProcessing(true); setError(''); setResult(null);
    try {
      const r = await processPayment({ order_id: orderId, amount, ...form });
      setResult({ success: true, data: r.data });
      getMyPayments().then(r => setPayments(r.data.payments || []));
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Payment failed';
      setResult({ success: false, message: msg });
    } finally { setProcessing(false); }
  };

  const statusColor = { success: '#10b981', failed: '#ef4444', pending: '#f59e0b', refunded: '#8b5cf6' };

  return (
    <div className="page">
      <h1 className="page-title">Payments</h1>

      {orderId && (
        <div className="card" style={{ marginBottom: 32 }}>
          <h3 style={{ fontWeight: 600, marginBottom: 4 }}>Pay for Order #{orderId}</h3>
          <p style={{ color: '#a0a0a0', fontSize: 14, marginBottom: 20 }}>Amount: <span style={{ color: '#f59e0b', fontWeight: 700 }}>${amount}</span></p>

          {result && (
            <div className={`alert ${result.success ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: 16 }}>
              {result.success ? `✅ Payment successful! Transaction: ${result.data.transaction_id}` : `❌ ${result.message}`}
            </div>
          )}

          {!result?.success && (
            <form onSubmit={handlePay}>
              <div className="grid2" style={{ marginBottom: 16 }}>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={{ fontSize: 13, color: '#a0a0a0', display: 'block', marginBottom: 6 }}>Card Number</label>
                  <input placeholder="4111 1111 1111 1111" maxLength={16} value={form.card_number} onChange={e => setForm({ ...form, card_number: e.target.value })} required />
                </div>
                <div>
                  <label style={{ fontSize: 13, color: '#a0a0a0', display: 'block', marginBottom: 6 }}>Expiry</label>
                  <input placeholder="MM/YY" value={form.card_expiry} onChange={e => setForm({ ...form, card_expiry: e.target.value })} required />
                </div>
                <div>
                  <label style={{ fontSize: 13, color: '#a0a0a0', display: 'block', marginBottom: 6 }}>CVV</label>
                  <input placeholder="123" maxLength={4} value={form.card_cvv} onChange={e => setForm({ ...form, card_cvv: e.target.value })} required />
                </div>
              </div>
              <p style={{ fontSize: 12, color: '#a0a0a0', marginBottom: 16 }}>💡 Use any card number. End with 0000 to simulate a failed payment.</p>
              <button className="btn btn-primary" style={{ width: '100%', padding: 14 }} disabled={processing}>
                {processing ? 'Processing...' : `Pay $${amount}`}
              </button>
            </form>
          )}
        </div>
      )}

      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Payment History</h2>
      {loading ? <div className="loading">Loading...</div> : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table>
            <thead><tr><th>Order</th><th>Amount</th><th>Status</th><th>Card</th><th>Date</th></tr></thead>
            <tbody>
              {payments.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: '#a0a0a0', padding: 40 }}>No payments yet</td></tr>
              ) : payments.map(p => (
                <tr key={p.id}>
                  <td>#{p.order_id}</td>
                  <td style={{ color: '#f59e0b', fontWeight: 600 }}>${p.amount}</td>
                  <td><span style={{ color: statusColor[p.status], fontWeight: 600, textTransform: 'capitalize' }}>{p.status}</span></td>
                  <td style={{ color: '#a0a0a0' }}>**** {p.card_last_four}</td>
                  <td style={{ color: '#a0a0a0', fontSize: 13 }}>{new Date(p.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
