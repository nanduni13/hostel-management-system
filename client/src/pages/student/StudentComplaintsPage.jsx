import { useEffect, useState } from 'react';
import { studentAuthApi } from '../../api/api';

const emptyForm = { subject: '', message: '' };

export default function StudentComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await studentAuthApi.getComplaints();
      setComplaints(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    setSubmitting(true);
    try {
      await studentAuthApi.createComplaint({
        subject: form.subject.trim(),
        message: form.message.trim(),
      });
      setForm(emptyForm);
      setMessage('Complaint submitted successfully.');
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const statusLabel = {
    pending: 'Pending',
    in_progress: 'In progress',
    resolved: 'Resolved',
  };

  return (
    <div className="page">
      <header className="page-header">
        <h2>Complaints</h2>
        <p>Submit and track your hostel complaints</p>
      </header>

      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <div className="page-grid">
        <section className="panel">
          <h3>New complaint</h3>
          <form className="form" onSubmit={handleSubmit}>
            <label>
              Subject
              <input
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="Water issue in room"
              />
            </label>
            <label>
              Message
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Describe your complaint..."
              />
            </label>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit complaint'}
            </button>
          </form>
        </section>

        <section className="panel panel-wide">
          <h3>My complaints ({complaints.length})</h3>
          {loading ? (
            <p className="muted">Loading...</p>
          ) : complaints.length === 0 ? (
            <p className="muted">No complaints yet.</p>
          ) : (
            <div className="card-list">
              {complaints.map((c) => (
                <article key={c._id} className="notice-card">
                  <div className="complaint-header">
                    <h4>{c.subject}</h4>
                    <span className={`badge badge-status-${c.status}`}>
                      {statusLabel[c.status] || c.status}
                    </span>
                  </div>
                  <p className="notice-meta muted">{new Date(c.createdAt).toLocaleString()}</p>
                  <p className="notice-body">{c.message}</p>
                  {c.adminReply && (
                    <p className="admin-reply">
                      <strong>Admin reply:</strong> {c.adminReply}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
