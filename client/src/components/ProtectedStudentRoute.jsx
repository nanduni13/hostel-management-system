import { Navigate } from 'react-router-dom';
import { useStudentAuth } from '../context/StudentAuthContext';

export default function ProtectedStudentRoute({ children }) {
  const { isAuthenticated, loading } = useStudentAuth();

  if (loading) {
    return (
      <div className="login-page auth-page auth-page-loading">
        <div className="auth-backdrop" aria-hidden />
        <p className="muted loading-pulse">Loading…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login?tab=student" replace />;
  }

  return children;
}
