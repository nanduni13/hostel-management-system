import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStudentAuth } from '../context/StudentAuthContext';

export default function WelcomePage() {
  const { isAuthenticated: isAdmin, loading: adminLoading } = useAuth();
  const { isAuthenticated: isStudent, loading: studentLoading } = useStudentAuth();

  if (adminLoading || studentLoading) {
    return (
      <div className="login-page auth-page auth-page-loading">
        <div className="auth-backdrop" aria-hidden />
        <p className="muted loading-pulse">Loading…</p>
      </div>
    );
  }

  if (isAdmin) return <Navigate to="/manage" replace />;
  if (isStudent) return <Navigate to="/student" replace />;

  return (
    <div className="welcome-page">
      <div className="welcome-backdrop" aria-hidden />
      <div className="welcome-grid-lines" aria-hidden />

      <main className="welcome-center">
        <p className="welcome-greeting">Welcome</p>
        <h1 className="welcome-title">Hostel Management System</h1>
        <p className="welcome-university">University of Vavuniya</p>

        <nav className="welcome-actions" aria-label="Registration and login">
          <Link to="/signup" className="btn btn-primary btn-lg welcome-btn">
            Student register
          </Link>
          <Link to="/login?tab=student" className="btn btn-outline btn-lg welcome-btn">
            Student login
          </Link>
          <Link to="/login" className="btn btn-warm btn-lg welcome-btn">
            Admin login
          </Link>
        </nav>
      </main>
    </div>
  );
}
