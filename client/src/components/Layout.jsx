import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/manage', label: 'Dashboard', end: true },
  { to: '/manage/students', label: 'Students' },
  { to: '/manage/rooms', label: 'Rooms' },
  { to: '/manage/notices', label: 'Notices' },
  { to: '/manage/complaints', label: 'Complaints' },
  { to: '/manage/admins', label: 'Admins' },
];

export default function Layout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/', { replace: true });
  }

  return (
    <div className="app-shell app-shell-admin">
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
