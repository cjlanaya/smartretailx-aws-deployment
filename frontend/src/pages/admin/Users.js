import React, { useEffect, useState } from 'react';
import { getAllUsers, deleteUser } from '../../services/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setError('');
    getAllUsers()
      .then(r => setUsers(r.data.users || []))
      .catch(err => setError(err.response?.data?.error || 'Failed to load users'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this user?')) {
      try { await deleteUser(id); load(); }
      catch { alert('Failed to delete user'); }
    }
  };

  if (loading) return <div className="loading">Loading users...</div>;

  return (
    <div className="page">
      <h1 className="page-title">Users</h1>

      {error && (
        <div className="alert alert-error">
          {error}
          <button className="btn btn-secondary btn-sm" style={{ marginLeft: 12 }} onClick={load}>Retry</button>
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table>
          <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Action</th></tr></thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: '#999', padding: 40 }}>No users found</td></tr>
            ) : users.map(u => (
              <tr key={u.id}>
                <td style={{ color: '#999' }}>#{u.id}</td>
                <td style={{ fontWeight: 500 }}>{u.name}</td>
                <td style={{ color: '#666' }}>{u.email}</td>
                <td>
                  <span className="badge" style={{ background: u.role === 'admin' ? '#f3f4f6' : '#eff6ff', color: u.role === 'admin' ? '#111' : '#1d4ed8' }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ color: '#666', fontSize: 12 }}>{new Date(u.created_at).toLocaleDateString()}</td>
                <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(u.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
