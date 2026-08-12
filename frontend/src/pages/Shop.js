import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../services/api';
import { useCart } from '../context/CartContext';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [added, setAdded] = useState({});

  useEffect(() => {
    setLoading(true);
    getProducts({ search, category, limit: 50 })
      .then(r => setProducts(r.data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [search, category]);

  const handleAdd = (e, product) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(p => ({ ...p, [product.id]: true }));
    setTimeout(() => setAdded(p => ({ ...p, [product.id]: false })), 1500);
  };

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  return (
    <div className="page">
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Shop</h1>
        <p style={{ color: '#666', fontSize: 13 }}>{products.length} products available</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap' }}>
        <input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 260, flex: '1' }} />
        <select value={category} onChange={e => setCategory(e.target.value)} style={{ maxWidth: 180 }}>
          <option value="">All categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {(search || category) && (
          <button className="btn btn-secondary btn-sm" onClick={() => { setSearch(''); setCategory(''); }}>Clear</button>
        )}
      </div>

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">🔍</div>
          <p style={{ fontWeight: 500, marginBottom: 4 }}>No products found</p>
          <p style={{ fontSize: 12, color: '#999' }}>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 14 }}>
          {products.map(p => (
            <div key={p.id} onClick={() => navigate(`/product/${p.id}`)}
              style={{ border: '1px solid #e5e5e5', borderRadius: 10, overflow: 'hidden', cursor: 'pointer', background: '#fff', transition: 'box-shadow 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
              <div style={{ height: 170, background: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ color: '#ccc', textAlign: 'center' }}>
                    <div style={{ fontSize: 28 }}>📦</div>
                  </div>
                )}
              </div>
              <div style={{ padding: '12px 14px 14px' }}>
                {p.category && <div style={{ fontSize: 10, color: '#999', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{p.category}</div>}
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10, color: '#111', lineHeight: 1.4 }}>{p.name}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>${p.price}</span>
                  <button className={`btn btn-sm ${added[p.id] ? 'btn-success' : 'btn-primary'}`}
                    onClick={e => handleAdd(e, p)}>
                    {added[p.id] ? '✓ Added' : '+ Add'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
