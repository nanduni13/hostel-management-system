import { useCallback, useEffect, useState } from 'react';
import { adminsApi } from '../api/api';

const emptyForm = { username: '', password: '' };

export default function AdminsPage() {
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminsApi.getAll();
      setAdmins(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.message === 'No admins found') {
        setAdmins([]);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function handleEdit(admin) {
    setEditingId(admin._id);
    setForm({ username: admin.username, password: '' });
    setMessage('');
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    const payload = { username: form.username.trim() };
    if (form.password) payload.password = form.password;

    if (!editingId && !form.password) {
      setError('Password is required for new admins.');
      return;
    }

    try {
      if (editingId) {
        await adminsApi.update(editingId, payload);
        setMessage('Admin updated successfully.');
      } else {
        await adminsApi.create(payload);
        setMessage('Admin created successfully.');
      }
      resetForm();
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this admin?')) return;
    setError('');
    try {
      await adminsApi.remove(id);
      setMessage('Admin deleted.');
      if (editingId === id) resetForm();
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <h2>Admins</h2>
        <p>Manage admin accounts</p>
      </header>

      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <div className="page-grid">
        <section className="panel">
          <h3>{editingId ? 'Edit admin' : 'Add admin'}</h3>
          <form className="form" onSubmit={handleSubmit}>
            <label>
              Username
              <input
                required
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="admin"
              />
            </label>
            <label>
              Password {editingId && <span className="muted">(required to update)</span>}
              <input
                type="password"
                required={!editingId}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
              />
            </label>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update' : 'Create'}
              </button>
              {editingId && (
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="panel panel-wide">
          <h3>All admins ({admins.length})</h3>
          {loading ? (
            <p className="muted">Loading...</p>
          ) : admins.length === 0 ? (
            <p className="muted">No admins yet. Add one using the form.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin) => (
                    <tr key={admin._id}>
                      <td>{admin.username}</td>
                      <td>{admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : '—'}</td>
                      <td className="actions">
                        <button type="button" className="btn btn-sm" onClick={() => handleEdit(admin)}>
                          Edit
                        </button>
                        <button type="button" className="btn btn-sm btn-danger" onClick={() => handleDelete(admin._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
