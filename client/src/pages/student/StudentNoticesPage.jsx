import { useEffect, useState } from 'react';
import { studentAuthApi } from '../../api/api';

export default function StudentNoticesPage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    studentAuthApi
      .getNotices()
      .then(setNotices)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <header className="page-header">
        <h2>Hostel Notices</h2>
        <p>Announcements from hostel administration</p>
      </header>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <p className="muted">Loading...</p>
      ) : notices.length === 0 ? (
        <section className="panel">
          <p className="muted">No notices posted yet.</p>
        </section>
      ) : (
        <div className="card-list">
          {notices.map((notice) => (
            <article key={notice._id} className="notice-card">
              <h3>{notice.title}</h3>
              <p className="notice-meta muted">
                Posted by {notice.postedBy} · {new Date(notice.createdAt).toLocaleString()}
              </p>
              <p className="notice-body">{notice.message}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
