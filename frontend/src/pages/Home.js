import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts } from '../services/api';

export default function Home() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getProducts({ limit: 6 }).then(r => setProducts(r.data.products || [])).catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <div style={{ borderBottom: '1px solid #e5e5e5', padding: '80px 24px 72px', textAlign: 'center', background: '#fff' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', border: '1px solid #e5e5e5', borderRadius: 20, padding: '3px 14px', marginBottom: 24 }}>
            <span style={{ fontSize: 11, color: '#666', fontWeight: 500 }}>Fast delivery · Secure payments · Easy returns</span>
          </div>
          <h1 style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.1, marginBottom: 20, letterSpacing: '-1.5px' }}>
            Shop everything.<br />All in one place.
          </h1>
          <p style={{ color: '#666', fontSize: 16, marginBottom: 36, lineHeight: 1.7, maxWidth: 480, margin: '0 auto 36px' }}>
            SmartRetailX brings you thousands of products across every category — delivered fast, backed by world-class customer support.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link to="/shop"><button className="btn btn-primary btn-lg">Browse products →</button></Link>
            <Link to="/register"><button className="btn btn-secondary btn-lg">Create account</button></Link>
          </div>
        </div>
      </div>

      {/* Trust bar */}
      <div style={{ background: '#fafafa', borderBottom: '1px solid #e5e5e5', padding: '24px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', display: 'flex', justifyContent: 'center', gap: 64, flexWrap: 'wrap' }}>
          {[['10,000+', 'Products'], ['99.9%', 'Uptime'], ['Free shipping', 'Over $50'], ['24/7', 'Support']].map(([val, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#111' }}>{val}</div>
              <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '56px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 28 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700 }}>Featured products</h2>
            <p style={{ color: '#666', fontSize: 13, marginTop: 4 }}>Hand-picked for you</p>
          </div>
          <Link to="/shop" style={{ fontSize: 13, color: '#111', fontWeight: 500, textDecoration: 'none' }}>View all →</Link>
        </div>

        {products.length === 0 ? (
          <div style={{ border: '1px dashed #e5e5e5', borderRadius: 10, padding: 56, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🛍️</div>
            <p style={{ color: '#999', fontSize: 13 }}>Products coming soon</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 16 }}>
            {products.map(p => <ProductCard key={p.id} product={p} navigate={navigate} />)}
          </div>
        )}
      </div>

      {/* Why us */}
      <div style={{ background: '#fafafa', borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5', padding: '56px 24px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, textAlign: 'center' }}>Why SmartRetailX?</h2>
          <p style={{ color: '#666', fontSize: 13, marginBottom: 36, textAlign: 'center' }}>Built for speed, security, and scale</p>
          <div className="grid3">
            {[
              { icon: '🔒', title: 'Secure by default', desc: 'Every transaction is protected with industry-standard encryption and multi-layer authentication.' },
              { icon: '📦', title: 'Real-time inventory', desc: 'Stock levels update instantly across all warehouses so you always know what\'s available.' },
              { icon: '🚀', title: 'Lightning fast', desc: 'Our distributed cloud infrastructure ensures fast page loads and zero downtime, even during peak hours.' },
            ].map(f => (
              <div key={f.title} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '72px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12, letterSpacing: '-0.5px' }}>Ready to start shopping?</h2>
          <p style={{ color: '#666', marginBottom: 28, fontSize: 14, lineHeight: 1.6 }}>Join thousands of customers who trust SmartRetailX for their everyday needs.</p>
          <Link to="/register"><button className="btn btn-primary btn-lg">Get started for free →</button></Link>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #e5e5e5', padding: '32px 24px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 22, height: 22, background: '#111', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>S</span>
            </div>
            <span style={{ fontWeight: 600, fontSize: 13 }}>SmartRetailX</span>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {[['/shop', 'Shop'], ['/about', 'About'], ['/contact', 'Contact']].map(([to, label]) => (
              <Link key={to} to={to} style={{ fontSize: 12, color: '#666', textDecoration: 'none' }}>{label}</Link>
            ))}
          </div>
          <span style={{ fontSize: 11, color: '#999' }}>© 2026 SmartRetailX. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}

function ProductCard({ product, navigate }) {
  return (
    <div onClick={() => navigate(`/product/${product.id}`)}
      style={{ border: '1px solid #e5e5e5', borderRadius: 10, overflow: 'hidden', cursor: 'pointer', background: '#fff', transition: 'box-shadow 0.15s' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
      <div style={{ height: 180, background: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {product.image_url
          ? <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ color: '#ddd', textAlign: 'center' }}><div style={{ fontSize: 32 }}>📦</div></div>}
      </div>
      <div style={{ padding: '12px 14px' }}>
        {product.category && <div style={{ fontSize: 10, color: '#999', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{product.category}</div>}
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8, color: '#111' }}>{product.name}</div>
        <div style={{ fontWeight: 700, fontSize: 15 }}>${product.price}</div>
      </div>
    </div>
  );
}
