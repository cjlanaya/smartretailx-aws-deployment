import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct } from '../services/api';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    getProduct(id).then(r => setProduct(r.data)).catch(() => navigate('/shop'));
  }, [id]);

  const handleAdd = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!product) return <div className="loading">Loading product...</div>;

  return (
    <div className="page">
      <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 28 }}>← Back</button>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
        <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #e5e5e5', height: 420, background: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ textAlign: 'center', color: '#ccc' }}>
              <div style={{ fontSize: 56, marginBottom: 8 }}>📦</div>
              <div style={{ fontSize: 12 }}>No image available</div>
            </div>
          )}
        </div>

        <div style={{ paddingTop: 8 }}>
          {product.category && <span className="tag" style={{ marginBottom: 12, display: 'inline-block' }}>{product.category}</span>}
          <h1 style={{ fontSize: 28, fontWeight: 700, marginTop: 8, marginBottom: 8, letterSpacing: '-0.3px' }}>{product.name}</h1>
          <div style={{ fontSize: 11, color: '#999', marginBottom: 20 }}>SKU: {product.sku}</div>
          <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 20 }}>${product.price}</div>
          {product.description && <p style={{ color: '#555', lineHeight: 1.7, fontSize: 14, marginBottom: 28 }}>{product.description}</p>}

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <label style={{ marginBottom: 0 }}>Quantity</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e5e5e5', borderRadius: 6, overflow: 'hidden' }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 36, height: 36, background: '#fafafa', border: 'none', cursor: 'pointer', fontSize: 16 }}>−</button>
              <span style={{ minWidth: 36, textAlign: 'center', fontSize: 14, fontWeight: 600 }}>{qty}</span>
              <button onClick={() => setQty(q => q + 1)} style={{ width: 36, height: 36, background: '#fafafa', border: 'none', cursor: 'pointer', fontSize: 16 }}>+</button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className={`btn btn-lg ${added ? 'btn-success' : 'btn-primary'}`} style={{ flex: 1 }} onClick={handleAdd}>
              {added ? '✓ Added to cart' : 'Add to cart'}
            </button>
            <button className="btn btn-secondary btn-lg" style={{ flex: 1 }} onClick={() => { handleAdd(); navigate('/cart'); }}>
              Buy now
            </button>
          </div>

          <div style={{ marginTop: 24, padding: 16, background: '#fafafa', borderRadius: 8, border: '1px solid #e5e5e5' }}>
            {[['Free shipping', 'On orders over $50'], ['Secure payment', 'JWT-secured checkout'], ['Easy returns', '30-day return policy']].map(([title, desc]) => (
              <div key={title} style={{ display: 'flex', gap: 12, marginBottom: 10, alignItems: 'center' }}>
                <span style={{ fontSize: 14 }}>✓</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>{title}</div>
                  <div style={{ fontSize: 11, color: '#999' }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
