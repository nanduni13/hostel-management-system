import { useEffect, useState } from 'react';
import { studentAuthApi } from '../../api/api';

export default function StudentProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    studentAuthApi
      .profile()
      .then(setProfile)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <header className="page-header">
        <h2>My Profile</h2>
        <p>Your hostel registration details</p>
      </header>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <p className="muted">Loading...</p>
      ) : profile ? (
        <section className="panel">
          <div className="profile-grid">
            <div className="profile-row">
              <span className="muted">Name</span>
              <strong>{profile.name}</strong>
            </div>
            <div className="profile-row">
              <span className="muted">Username</span>
              <strong>{profile.username || '—'}</strong>
            </div>
            <div className="profile-row">
              <span className="muted">Email</span>
              <strong>{profile.email || '—'}</strong>
            </div>
            <div className="profile-row">
              <span className="muted">Age</span>
              <strong>{profile.age}</strong>
            </div>
            <div className="profile-row">
              <span className="muted">Department</span>
              <strong>{profile.department}</strong>
            </div>
            <div className="profile-row">
              <span className="muted">Room</span>
              <strong>
                {profile.roomId?.roomNumber ? `Room ${profile.roomId.roomNumber}` : 'Not assigned'}
              </strong>
            </div>
            <div className="profile-row">
              <span className="muted">Fees</span>
              <span className={`badge ${profile.feesPaid ? 'badge-success' : 'badge-warn'}`}>
                {profile.feesPaid ? 'Paid' : 'Pending'}
              </span>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
