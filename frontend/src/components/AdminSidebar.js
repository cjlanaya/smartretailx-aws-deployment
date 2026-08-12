import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getAdminUnreadCount } from '../services/api';

const links = [
  { to: '/admin', icon: '▪', label: 'Overview' },
  { to: '/admin/products', icon: '▪', label: 'Products' },
  { to: '/admin/orders', icon: '▪', label: 'Orders' },
  { to: '/admin/payments', icon: '▪', label: 'Payments' },
  { to: '/admin/inventory', icon: '▪', label: 'Inventory' },
  { to: '/admin/notifications', icon: '▪', label: 'Notifications' },
  { to: '/admin/users', icon: '▪', label: 'Users' },
];

export default function AdminSidebar() {
  const location = useLocation();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const load = () => getAdminUnreadCount().then(r => setUnread(r.data.unread || 0)).catch(() => {});
    load();
    const t = setInterval(load, 10000);
    return () => clearInterval(t);
  }, []);

  return (
    <aside style={{ width: 200, background: '#fafafa', borderRight: '1px solid #e5e5e5', minHeight: 'calc(100vh - 56px)', padding: '20px 0', flexShrink: 0 }}>
      <div style={{ padding: '0 16px 16px', borderBottom: '1px solid #e5e5e5', marginBottom: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: 1 }}>Admin</span>
      </div>
      {links.map(link => {
        const isActive = link.to === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(link.to);
        return (
          <Link key={link.to} to={link.to} style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '9px 16px', fontSize: 13, fontWeight: isActive ? 600 : 400,
              color: isActive ? '#111' : '#666',
              background: isActive ? '#fff' : 'transparent',
              borderRight: isActive ? '2px solid #111' : '2px solid transparent',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              transition: 'all 0.1s'
            }}>
              {link.label}
              {link.to === '/admin/notifications' && unread > 0 && (
                <span style={{ background: '#dc2626', color: '#fff', borderRadius: 10, padding: '1px 6px', fontSize: 10, fontWeight: 600 }}>{unread}</span>
              )}
            </div>
          </Link>
        );
      })}
    </aside>
  );
}
