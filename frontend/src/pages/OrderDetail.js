import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getOrder } from '../services/api';

const steps = ['pending','confirmed','processing','shipped','delivered'];
const statusColors = { pending:'badge-pending', confirmed:'badge-confirmed', processing:'badge-processing', shipped:'badge-shipped', delivered:'badge-delivered', cancelled:'badge-cancelled' };

export default function OrderDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const success = searchParams.get('success');

  useEffect(() => {
    getOrder(id).then(r => setOrder(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading">Loading order...</div>;
  if (!order) return <div className="empty">Order not found</div>;

  const stepIndex = steps.indexOf(order.status);

  return (
    <div className="page">
      {success && <div className="alert alert-success">✅ Order placed successfully! Your order is being processed.</div>}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Order #{order.id}</h1>
        <span className={`badge ${statusColors[order.status]}`} style={{ fontSize: 14, padding: '6px 16px' }}>{order.status}</span>
      </div>

      {/* Tracking bar */}
      {order.status !== 'cancelled' && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ fontWeight: 600, marginBottom: 20 }}>Order Tracking</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 16, left: '10%', right: '10%', height: 2, background: '#2a2a2a', zIndex: 0 }} />
            <div style={{ position: 'absolute', top: 16, left: '10%', width: `${Math.max(0, stepIndex / (steps.length - 1)) * 80}%`, height: 2, background: '#f59e0b', zIndex: 1, transition: 'width 0.5s' }} />
            {steps.map((step, i) => (
              <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: i <= stepIndex ? '#f59e0b' : '#1a1a1a',
                  border: `2px solid ${i <= stepIndex ? '#f59e0b' : '#2a2a2a'}`,
                  color: i <= stepIndex ? '#000' : '#a0a0a0', fontWeight: 700, fontSize: 13
                }}>{i <= stepIndex ? '✓' : i + 1}</div>
                <div style={{ fontSize: 12, marginTop: 8, color: i <= stepIndex ? '#f5f5f5' : '#a0a0a0', textTransform: 'capitalize' }}>{step}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        <div className="card">
          <h3 style={{ fontWeight: 600, marginBottom: 16 }}>Items</h3>
          {(order.items || []).map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #2a2a2a' }}>
              <div>
                <div style={{ fontWeight: 500 }}>{item.product_name}</div>
                <div style={{ fontSize: 13, color: '#a0a0a0' }}>Qty: {item.quantity} × ${item.unit_price}</div>
              </div>
              <div style={{ fontWeight: 700, color: '#f59e0b' }}>${(item.quantity * item.unit_price).toFixed(2)}</div>
            </div>
          ))}
        </div>

        <div className="card">
          <h3 style={{ fontWeight: 600, marginBottom: 16 }}>Details</h3>
          <div style={{ fontSize: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div><span style={{ color: '#a0a0a0' }}>Order Date:</span><br />{new Date(order.created_at).toLocaleString()}</div>
            <div><span style={{ color: '#a0a0a0' }}>Shipping To:</span><br />{order.shipping_address}</div>
            <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18 }}>
              <span>Total</span><span style={{ color: '#f59e0b' }}>${order.total_amount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
