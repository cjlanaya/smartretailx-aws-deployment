import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/api';

const empty = { name: '', description: '', price: '', category: '', sku: '', image_url: '' };

export default function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');

  const load = () => getProducts({ limit: 100 }).then(r => setProducts(r.data.products || []));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    try {
      if (editing) { await updateProduct(editing, form); setSuccess('Product updated successfully.'); }
      else { await createProduct(form); setSuccess('Product created successfully.'); }
      setForm(empty); setEditing(null); setShowForm(false); load();
    } catch (err) { setError(err.response?.data?.error || 'Operation failed'); }
  };

  const handleEdit = (p) => {
    setForm({ name: p.name, description: p.description || '', price: p.price, category: p.category || '', sku: p.sku, image_url: p.image_url || '' });
    setEditing(p.id); setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deactivate this product?')) { await deleteProduct(id); load(); }
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>Products</h1>
          <p style={{ color: '#666', fontSize: 13, marginTop: 2 }}>{products.length} total products</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditing(null); setForm(empty); }}>
          {showForm ? 'Cancel' : '+ Add product'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>{editing ? 'Edit Product' : 'New Product'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid2" style={{ gap: 14, marginBottom: 14 }}>
              <div>
                <label>Product name *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Apple iPhone 15" required />
              </div>
              <div>
                <label>SKU * {editing && <span style={{ color: '#999' }}>(cannot change)</span>}</label>
                <input value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} placeholder="e.g. IPH15-BLK" required disabled={!!editing} />
              </div>
              <div>
                <label>Price (USD) *</label>
                <input type="number" step="0.01" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0.00" required />
              </div>
              <div>
                <label>Category</label>
                <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="e.g. Electronics" />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label>Image URL</label>
                <input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="https://example.com/product-image.jpg" />
                {form.image_url && (
                  <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img src={form.image_url} alt="preview" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6, border: '1px solid #e5e5e5' }} onError={e => e.target.style.display='none'} />
                    <span style={{ fontSize: 11, color: '#666' }}>Image preview</span>
                  </div>
                )}
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label>Description</label>
                <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Product description..." />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" type="submit">{editing ? 'Update product' : 'Create product'}</button>
              <button className="btn btn-secondary" type="button" onClick={() => { setShowForm(false); setEditing(null); setForm(empty); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        <input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 280 }} />
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table>
          <thead>
            <tr><th>ID</th><th>Product</th><th>SKU</th><th>Category</th><th>Price</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: '#999', padding: 40 }}>No products found</td></tr>
            ) : filtered.map(p => (
              <tr key={p.id}>
                <td style={{ fontSize: 12, color: '#666', fontFamily: 'monospace' }}>#{p.id}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 6, overflow: 'hidden', background: '#f3f3f3', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {p.image_url ? <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display='none'; }} /> : <span style={{ fontSize: 16 }}>📦</span>}
                    </div>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: '#999', marginTop: 1 }}>{p.description?.slice(0, 40)}{p.description?.length > 40 ? '...' : ''}</div>
                    </div>
                  </div>
                </td>
                <td style={{ fontSize: 12, color: '#666', fontFamily: 'monospace' }}>{p.sku}</td>
                <td>{p.category ? <span className="tag">{p.category}</span> : <span style={{ color: '#ccc' }}>—</span>}</td>
                <td style={{ fontWeight: 600 }}>${p.price}</td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(p)}>Edit</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => navigate('/admin/inventory', { state: { product_id: p.id, product_name: p.name } })}>Manage stock</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Remove</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
