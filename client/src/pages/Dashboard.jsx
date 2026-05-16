import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { studentsApi, roomsApi, adminsApi } from '../api/api';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function safeCount(fetcher) {
  try {
    const data = await fetcher();
    return Array.isArray(data) ? data.length : 0;
  } catch (err) {
    if (err.message?.includes('login required') || err.message?.includes('Session expired')) {
      throw err;
    }
    return 0;
  }
}

export default function Dashboard() {
  const [stats, setStats] = useState({ students: 0, rooms: 0, admins: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dbName, setDbName] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/health`)
      .then((r) => r.json())
      .then((data) => {
        if (data.database) setDbName(data.database);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const [students, rooms, admins] = await Promise.all([
          safeCount(studentsApi.getAll),
          safeCount(roomsApi.getAll),
          safeCount(adminsApi.getAll),
        ]);
        setStats({ students, rooms, admins });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const cards = [
    { label: 'Students', value: stats.students, to: '/manage/students', color: 'card-blue' },
    { label: 'Rooms', value: stats.rooms, to: '/manage/rooms', color: 'card-green' },
    { label: 'Admins', value: stats.admins, to: '/manage/admins', color: 'card-purple' },
  ];

  return (
    <div className="page">
      <header className="page-header">
        <h2>Dashboard</h2>
        <p>Overview of your hostel management data</p>
        {dbName && (
          <p className="muted" style={{ marginTop: '0.35rem', fontSize: '0.85rem' }}>
            MongoDB database: <strong>{dbName}</strong> — open this name in Compass
          </p>
        )}
      </header>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="stats-grid">
        {cards.map(({ label, value, to, color }) => (
          <Link key={label} to={to} className={`stat-card ${color}`}>
            <span className="stat-label">{label}</span>
            <span className="stat-value">{loading ? '—' : value}</span>
            <span className="stat-link">Manage →</span>
          </Link>
        ))}
      </div>

      <section className="info-panel">
        <h3>Quick start</h3>
        <ul>
          <li>Add rooms first, then assign students to rooms.</li>
          <li>Use the Students page to create, edit, and delete student records.</li>
          <li>Admins can be managed from the Admins section.</li>
        </ul>
      </section>
    </div>
  );
}
