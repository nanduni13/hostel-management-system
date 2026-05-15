import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useStudentAuth } from '../context/StudentAuthContext';

const navItems = [
  { to: '/student', label: 'Profile', end: true },
  { to: '/student/room', label: 'My Room' },
  { to: '/student/notices', label: 'Notices' },
  { to: '/student/complaints', label: 'Complaints' },
];

export default function StudentLayout() {
  const { student, logout } = useStudentAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login?tab=student', { replace: true });
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">H</span>
          <div>
            <h1>Hostel MS</h1>
            <p>Student Portal</p>
          </div>
        </div>

        <div className="sidebar-user">
          <span className="muted">Logged in as</span>
          <strong>{student?.name}</strong>
        </div>

        <nav>
          {navItems.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <button type="button" className="btn btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
