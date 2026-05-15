import { useEffect, useState } from 'react';
import { studentAuthApi } from '../../api/api';

export default function StudentRoomPage() {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    studentAuthApi
      .getRoom()
      .then(setRoom)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <header className="page-header">
        <h2>My Room</h2>
        <p>Your room assignment and roommates</p>
      </header>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <p className="muted">Loading...</p>
      ) : !room?.assigned ? (
        <section className="panel">
          <p className="muted">{room?.message || 'No room assigned yet. Contact the hostel admin.'}</p>
        </section>
      ) : (
        <>
          <section className="panel" style={{ marginBottom: '1rem' }}>
            <h3>Room {room.roomNumber}</h3>
            <div className="profile-grid">
              <div className="profile-row">
                <span className="muted">Capacity</span>
                <strong>{room.capacity} beds</strong>
              </div>
              <div className="profile-row">
                <span className="muted">Occupied</span>
                <strong>{room.occupants?.length || 0}</strong>
              </div>
              <div className="profile-row">
                <span className="muted">Available beds</span>
                <strong>{room.availableBeds}</strong>
              </div>
            </div>
          </section>

          <section className="panel">
            <h3>Roommates</h3>
            {room.occupants?.length ? (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Department</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {room.occupants.map((o) => (
                      <tr key={o._id}>
                        <td>{o.name}</td>
                        <td>{o.department}</td>
                        <td>{o.email || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="muted">No other occupants listed.</p>
            )}
          </section>
        </>
      )}
    </div>
  );
}
