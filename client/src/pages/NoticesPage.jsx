import { useCallback, useEffect, useState } from 'react';
import { noticesApi } from '../api/api';

const emptyForm = { title: '', message: '' };

export default function NoticesPage() {
  const [notices, setNotices] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await noticesApi.getAll();
      setNotices(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
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

  function handleEdit(notice) {
    setEditingId(notice._id);
    setForm({ title: notice.title, message: notice.message });
    setError('');
    setMessage('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      if (editingId) {
        await noticesApi.update(editingId, form);
        setMessage('Notice updated.');
      } else {
        await noticesApi.create(form);
        setMessage('Notice posted.');
      }
      resetForm();
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this notice?')) return;
    try {
      await noticesApi.remove(id);
      setMessage('Notice deleted.');
      if (editingId === id) resetForm();
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <h2>Notices</h2>
        <p>Post hostel announcements for students</p>
      </header>

      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <div className="page-grid">
        <section className="panel">
          <h3>{editingId ? 'Edit notice' : 'Post notice'}</h3>
          <form className="form" onSubmit={handleSubmit}>
            <label>
              Title
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Maintenance schedule"
              />
            </label>
            <label>
              Message
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Notice details..."
              />
            </label>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update' : 'Post'}
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
          <h3>All notices ({notices.length})</h3>
          {loading ? (
            <p className="muted">Loading...</p>
          ) : notices.length === 0 ? (
            <p className="muted">No notices yet.</p>
          ) : (
            <div className="card-list">
              {notices.map((notice) => (
                <article key={notice._id} className="notice-card">
                  <h4>{notice.title}</h4>
                  <p className="notice-meta muted">
                    {notice.postedBy} · {new Date(notice.createdAt).toLocaleString()}
                  </p>
                  <p className="notice-body">{notice.message}</p>
                  <div className="form-actions" style={{ marginTop: '0.75rem' }}>
                    <button type="button" className="btn btn-sm" onClick={() => handleEdit(notice)}>
                      Edit
                    </button>
                    <button type="button" className="btn btn-sm btn-danger" onClick={() => handleDelete(notice._id)}>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
