import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { studentsApi, roomsApi, adminsApi } from '../api/api';

async function safeCount(fetcher) {
  try {
    const data = await fetcher();
    return Array.isArray(data) ? data.length : 0;
  } catch {
    return 0;
  }
}

export default function Dashboard() {
  const [stats, setStats] = useState({ students: 0, rooms: 0, admins: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [students, rooms, admins] = await Promise.all([
        safeCount(studentsApi.getAll),
        safeCount(roomsApi.getAll),
        safeCount(adminsApi.getAll),
      ]);
      setStats({ students, rooms, admins });
      setLoading(false);
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
      </header>

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
