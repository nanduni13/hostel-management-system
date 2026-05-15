import { Navigate } from 'react-router-dom';
import { useStudentAuth } from '../context/StudentAuthContext';

export default function ProtectedStudentRoute({ children }) {
  const { isAuthenticated, loading } = useStudentAuth();

  if (loading) {
    return (
      <div className="login-page">
        <p className="muted">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login?tab=student" replace />;
  }

  return children;
}
