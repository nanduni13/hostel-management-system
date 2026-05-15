import { useCallback, useEffect, useState } from 'react';
import { complaintsApi } from '../api/api';

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'resolved', label: 'Resolved' },
];

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [replyDrafts, setReplyDrafts] = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await complaintsApi.getAll();
      setComplaints(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleUpdate(id, status, adminReply) {
    setError('');
    try {
      await complaintsApi.update(id, { status, adminReply });
      setMessage('Complaint updated.');
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this complaint?')) return;
    try {
      await complaintsApi.remove(id);
      setMessage('Complaint deleted.');
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <h2>Complaints</h2>
        <p>View and respond to student complaints</p>
      </header>

      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      {loading ? (
        <p className="muted">Loading...</p>
      ) : complaints.length === 0 ? (
        <section className="panel">
          <p className="muted">No complaints submitted yet.</p>
        </section>
      ) : (
        <div className="card-list">
          {complaints.map((c) => (
            <article key={c._id} className="notice-card">
              <div className="complaint-header">
                <h4>{c.subject}</h4>
                <span className={`badge badge-status-${c.status}`}>{c.status}</span>
              </div>
              <p className="notice-meta muted">
                {c.studentId?.name} ({c.studentId?.email}) · {c.studentId?.department} ·{' '}
                {new Date(c.createdAt).toLocaleString()}
              </p>
              <p className="notice-body">{c.message}</p>

              <div className="form complaint-admin-form">
                <label>
                  Status
                  <select
                    value={c.status}
                    onChange={(e) => handleUpdate(c._id, e.target.value, c.adminReply || '')}
                  >
                    {statusOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Admin reply
                  <textarea
                    rows={2}
                    value={replyDrafts[c._id] ?? c.adminReply ?? ''}
                    onChange={(e) =>
                      setReplyDrafts((prev) => ({ ...prev, [c._id]: e.target.value }))
                    }
                    placeholder="Reply to student..."
                  />
                </label>
                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={() =>
                      handleUpdate(c._id, c.status, replyDrafts[c._id] ?? c.adminReply ?? '')
                    }
                  >
                    Save reply
                  </button>
                  <button type="button" className="btn btn-sm btn-danger" onClick={() => handleDelete(c._id)}>
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
