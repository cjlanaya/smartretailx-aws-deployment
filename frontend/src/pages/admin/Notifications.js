import React, { useEffect, useState } from 'react';
import { getAdminNotifications, markAdminAllRead } from '../../services/api';

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setError('');
    getAdminNotifications()
      .then(r => setNotifications(r.data.notifications || []))
      .catch(err => setError(err.response?.data?.error || 'Failed to load notifications'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleMarkAll = async () => {
    try { await markAdminAllRead(); load(); } catch {}
  };

  const typeColor = { order_placed: '#2563eb', payment_success: '#16a34a', payment_failed: '#dc2626' };
  const typeIcon  = { order_placed: '🛍️', payment_success: '✅', payment_failed: '❌' };

  if (loading) return <div className="loading">Loading notifications...</div>;

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 className="page-title" style={{ margin: 0 }}>Notifications</h1>
        {notifications.length > 0 && <button className="btn btn-secondary btn-sm" onClick={handleMarkAll}>Mark all read</button>}
      </div>

      {error && (
        <div className="alert alert-error">
          {error} — Make sure Notification Service (port 3006) is running.
          <button className="btn btn-secondary btn-sm" style={{ marginLeft: 12 }} onClick={load}>Retry</button>
        </div>
      )}

      {!error && notifications.length === 0 && <div className="empty"><div className="empty-icon">🔔</div><p>No notifications yet</p></div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {notifications.map(n => (
          <div key={n.id} className="card" style={{ borderLeft: `3px solid ${typeColor[n.type] || '#e5e5e5'}`, opacity: n.is_read ? 0.6 : 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <span style={{ fontSize: 20 }}>{typeIcon[n.type] || '🔔'}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{n.title}</div>
                  <div style={{ color: '#666', fontSize: 12, lineHeight: 1.5 }}>{n.message}</div>
                </div>
              </div>
              <div style={{ fontSize: 11, color: '#999', flexShrink: 0, marginLeft: 16 }}>{new Date(n.created_at).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
