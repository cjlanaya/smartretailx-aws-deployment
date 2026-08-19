import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getAllInventory, addInventory, restockProduct } from '../../services/api';

export default function AdminInventory() {
  const location = useLocation();
  const prefill = location.state || {};
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    product_id: prefill.product_id ? String(prefill.product_id) : '',
    product_name: prefill.product_name || '',
    quantity: '',
    reorder_level: '10',
    warehouse_location: ''
  });
  const [showForm, setShowForm] = useState(!!prefill.product_id);
  const [restockQty, setRestockQty] = useState({});
  const [success, setSuccess] = useState('');

  const load = () => {
    setError('');
    getAllInventory()
      .then(r => setInventory(r.data.inventory || []))
      .catch(err => setError(err.response?.data?.error || 'Failed to load inventory'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    try {
      await addInventory({ ...form, product_id: parseInt(form.product_id), quantity: parseInt(form.quantity), reorder_level: parseInt(form.reorder_level) });
      setSuccess('Inventory added!'); setShowForm(false);
      setForm({ product_id: '', product_name: '', quantity: '', reorder_level: '10', warehouse_location: '' });
      load();
    } catch (err) { setError(err.response?.data?.error || 'Failed to add inventory'); }
  };

  const handleRestock = async (productId) => {
    const qty = parseInt(restockQty[productId]);
    if (!qty || qty <= 0) return alert('Enter a valid quantity');
    try {
      await restockProduct(productId, qty);
      setSuccess(`Restocked ${qty} units successfully`);
      setRestockQty(prev => ({ ...prev, [productId]: '' }));
      load();
    } catch { setError('Restock failed'); }
  };

  if (loading) return <div className="loading">Loading inventory...</div>;

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 className="page-title" style={{ margin: 0 }}>Inventory</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : '+ Add stock'}</button>
      </div>

      {error && <div className="alert alert-error">{error}<button className="btn btn-secondary btn-sm" style={{ marginLeft: 12 }} onClick={load}>Retry</button></div>}
      {success && <div className="alert alert-success">{success}</div>}

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Add Product to Inventory</h3>
          <form onSubmit={handleAdd}>
            <div className="grid2" style={{ gap: 12, marginBottom: 14 }}>
              <div><label>Product ID *</label><input type="number" value={form.product_id} onChange={e => setForm({ ...form, product_id: e.target.value })} required disabled={!!prefill.product_id} /></div>
              <div><label>Product Name *</label><input value={form.product_name} onChange={e => setForm({ ...form, product_name: e.target.value })} required disabled={!!prefill.product_id} /></div>
              <div><label>Quantity *</label><input type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} required /></div>
              <div><label>Reorder Level</label><input type="number" value={form.reorder_level} onChange={e => setForm({ ...form, reorder_level: e.target.value })} /></div>
              <div><label>Warehouse Location</label><input value={form.warehouse_location} onChange={e => setForm({ ...form, warehouse_location: e.target.value })} /></div>
            </div>
            <button className="btn btn-primary" type="submit">Add to inventory</button>
          </form>
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table>
          <thead><tr><th>Product</th><th>Available</th><th>Reserved</th><th>Total</th><th>Reorder At</th><th>Location</th><th>Restock</th></tr></thead>
          <tbody>
            {inventory.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: '#999', padding: 40 }}>No inventory records yet</td></tr>
            ) : inventory.map(i => {
              const available = i.quantity - i.reserved_quantity;
              const isLow = available <= i.reorder_level;
              return (
                <tr key={i.id}>
                  <td style={{ fontWeight: 500 }}>{i.product_name}</td>
                  <td style={{ color: isLow ? '#dc2626' : '#16a34a', fontWeight: 600 }}>{available}{isLow ? ' ⚠️' : ''}</td>
                  <td style={{ color: '#666' }}>{i.reserved_quantity}</td>
                  <td>{i.quantity}</td>
                  <td style={{ color: '#666' }}>{i.reorder_level}</td>
                  <td style={{ color: '#666', fontSize: 12 }}>{i.warehouse_location || '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <input type="number" placeholder="Qty" min="1" style={{ width: 64, padding: '5px 8px' }}
                        value={restockQty[i.product_id] || ''}
                        onChange={e => setRestockQty(p => ({ ...p, [i.product_id]: e.target.value }))} />
                      <button className="btn btn-success btn-sm" onClick={() => handleRestock(i.product_id)}>Add</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
