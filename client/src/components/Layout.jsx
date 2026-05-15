import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/students', label: 'Students' },
  { to: '/rooms', label: 'Rooms' },
  { to: '/notices', label: 'Notices' },
  { to: '/complaints', label: 'Complaints' },
  { to: '/admins', label: 'Admins' },
];

export default function Layout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">H</span>
          <div>
            <h1>Hostel MS</h1>
            <p>Management System</p>
          </div>
        </div>

        <div className="sidebar-user">
          <span className="muted">Logged in as</span>
          <strong>{admin?.username}</strong>
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
