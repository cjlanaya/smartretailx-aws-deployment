import React, { useEffect, useState, useRef } from 'react';
import { getMyNotifications, getAdminNotifications, markAllRead, markAdminAllRead } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function NotificationBell() {
  const { user, isAdmin } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const ref = useRef();

  const load = async () => {
    try {
      const r = isAdmin ? await getAdminNotifications() : await getMyNotifications();
      setNotifications(r.data.notifications || []);
      setUnread(r.data.unread || 0);
    } catch {}
  };

  useEffect(() => {
    if (!user) return;
    load();
    const t = setInterval(load, 10000);
    return () => clearInterval(t);
  }, [user, isAdmin]);

  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const handleMarkAll = async () => {
    try { isAdmin ? await markAdminAllRead() : await markAllRead(); load(); } catch {}
  };

  if (!user) return null;

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, padding: '4px 6px', borderRadius: 5, position: 'relative' }}>
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        {unread > 0 && <span style={{ position: 'absolute', top: 0, right: 0, background: '#dc2626', color: '#fff', borderRadius: '50%', width: 15, height: 15, fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unread > 9 ? '9+' : unread}</span>}
      </button>

      {open && (
        <div style={{ position: 'absolute', right: 0, top: '110%', width: 340, background: '#fff', border: '1px solid #e5e5e5', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.08)', zIndex: 200, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e5e5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, fontSize: 13 }}>Notifications {unread > 0 && <span style={{ color: '#dc2626' }}>({unread} new)</span>}</span>
            {unread > 0 && <button onClick={handleMarkAll} style={{ background: 'none', border: 'none', color: '#666', fontSize: 11, cursor: 'pointer' }}>Mark all read</button>}
          </div>
          <div style={{ maxHeight: 360, overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: 32, textAlign: 'center', color: '#999', fontSize: 13 }}>No notifications</div>
            ) : notifications.map(n => (
              <div key={n.id} style={{ padding: '12px 16px', borderBottom: '1px solid #f3f3f3', background: n.is_read ? '#fff' : '#fafafa', borderLeft: n.is_read ? '3px solid transparent' : '3px solid #111' }}>
                <div style={{ fontSize: 12, fontWeight: n.is_read ? 400 : 600, marginBottom: 3, color: '#111' }}>{n.title}</div>
                <div style={{ fontSize: 11, color: '#666', lineHeight: 1.5 }}>{n.message}</div>
                <div style={{ fontSize: 10, color: '#999', marginTop: 4 }}>{new Date(n.created_at).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
