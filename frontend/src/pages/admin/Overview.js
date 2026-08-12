import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllOrders, getProducts, getLowStock, getAllUsers, getAllPayments } from '../../services/api';

export default function AdminOverview() {
  const [stats, setStats] = useState({ orders: 0, revenue: '0.00', products: 0, users: 0, lowStock: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);

  useEffect(() => {
    // Load each independently so one failure doesn't break others
    getAllOrders().then(r => {
      const list = r.data.orders || [];
      setRecentOrders(list.slice(0, 6));
      setStats(s => ({ ...s, orders: list.length }));
    }).catch(() => {});

    getProducts({ limit: 100 }).then(r => {
      setStats(s => ({ ...s, products: r.data.total || 0 }));
    }).catch(() => {});

    getLowStock().then(r => {
      const items = r.data.low_stock_items || [];
      setLowStockItems(items);
      setStats(s => ({ ...s, lowStock: items.length }));
    }).catch(() => {});

    getAllUsers().then(r => {
      setStats(s => ({ ...s, users: (r.data.users || []).length }));
    }).catch(() => {});

    getAllPayments().then(r => {
      setStats(s => ({ ...s, revenue: r.data.total_revenue || '0.00' }));
    }).catch(() => {});
  }, []);

  const statusColors = { pending:'badge-pending', confirmed:'badge-confirmed', processing:'badge-processing', shipped:'badge-shipped', delivered:'badge-delivered', cancelled:'badge-cancelled' };

  return (
    <div className="page">
      <h1 className="page-title">Overview</h1>

      {stats.lowStock > 0 && (
        <div className="alert alert-error" style={{ marginBottom: 24 }}>
          ⚠️ {stats.lowStock} item(s) are low on stock.{' '}
          <Link to="/admin/inventory" style={{ color: '#991b1b', fontWeight: 500 }}>View inventory →</Link>
        </div>
      )}

      <div className="grid4" style={{ marginBottom: 28 }}>
        {[
          { label: 'Total orders', value: stats.orders, link: '/admin/orders' },
          { label: 'Revenue', value: `$${stats.revenue}`, link: '/admin/payments' },
          { label: 'Products', value: stats.products, link: '/admin/products' },
          { label: 'Users', value: stats.users, link: '/admin/users' },
        ].map(s => (
          <Link key={s.label} to={s.link} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ cursor: 'pointer', transition: 'border-color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#111'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e5e5'}>
              <div style={{ fontSize: 11, color: '#999', fontWeight: 500, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>{s.value}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid2">
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #e5e5e5', display: 'flex', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: 13, fontWeight: 600 }}>Recent orders</h3>
            <Link to="/admin/orders" style={{ fontSize: 11, color: '#666', textDecoration: 'none' }}>View all →</Link>
          </div>
          {recentOrders.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: '#999', fontSize: 13 }}>No orders yet</div>
          ) : (
            <table>
              <thead><tr><th>Order</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {recentOrders.map(o => (
                  <tr key={o.id}>
                    <td style={{ fontWeight: 500 }}>#{o.id}</td>
                    <td>${o.total_amount}</td>
                    <td><span className={`badge ${statusColors[o.status]}`}>{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #e5e5e5', display: 'flex', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: 13, fontWeight: 600 }}>Low stock alerts</h3>
            <Link to="/admin/inventory" style={{ fontSize: 11, color: '#666', textDecoration: 'none' }}>View all →</Link>
          </div>
          {lowStockItems.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: '#999', fontSize: 13 }}>All stock levels healthy ✓</div>
          ) : (
            <table>
              <thead><tr><th>Product</th><th>Available</th><th>Reorder at</th></tr></thead>
              <tbody>
                {lowStockItems.map(i => (
                  <tr key={i.id}>
                    <td style={{ fontWeight: 500 }}>{i.product_name}</td>
                    <td style={{ color: '#dc2626', fontWeight: 600 }}>{i.quantity - i.reserved_quantity}</td>
                    <td style={{ color: '#999' }}>{i.reorder_level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
