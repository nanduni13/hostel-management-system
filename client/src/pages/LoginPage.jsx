import { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStudentAuth } from '../context/StudentAuthContext';

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'student' ? 'student' : 'admin';

  const { login: adminLogin, isAuthenticated: isAdmin, loading: adminLoading } = useAuth();
  const { login: studentLogin, isAuthenticated: isStudent, loading: studentLoading } = useStudentAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState(initialTab);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!adminLoading && !studentLoading) {
    if (isAdmin) return <Navigate to="/manage" replace />;
    if (isStudent) return <Navigate to="/student" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (tab === 'admin') {
        await adminLogin(username.trim(), password);
        navigate('/manage', { replace: true });
      } else {
        await studentLogin(username.trim(), password);
        navigate('/student', { replace: true });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-page auth-page">
      <div className="auth-backdrop" aria-hidden />
      <div className="login-shell">
        <Link to="/" className="auth-back-link muted">
          ← Back to welcome
        </Link>
        <div className="login-card login-card-accent">
        <div className={`login-role-bar ${tab === 'admin' ? 'role-admin' : 'role-student'}`} aria-hidden />
        <div className="login-brand">
          <span className={`brand-icon ${tab === 'admin' ? 'brand-icon-warm' : ''}`}>H</span>
          <div>
            <h1>Hostel MS</h1>
            <p>{tab === 'admin' ? 'Admin login' : 'Student login'}</p>
          </div>
        </div>

        <div className="login-tabs">
          <button
            type="button"
            className={tab === 'admin' ? 'tab active' : 'tab'}
            onClick={() => { setTab('admin'); setError(''); }}
          >
            Admin
          </button>
          <button
            type="button"
            className={tab === 'student' ? 'tab active' : 'tab'}
            onClick={() => { setTab('student'); setError(''); }}
          >
            Student
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form className="form" onSubmit={handleSubmit}>
          <label>
            Username
            <input
              required
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={tab === 'admin' ? 'admin' : 'your_username'}
            />
          </label>
          <label>
            Password
            <input
              required
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>
          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Login'}
          </button>
        </form>

        {tab === 'student' && (
          <p className="auth-switch">
            New student? <Link to="/signup">Sign up here</Link>
          </p>
        )}

        {tab === 'admin' && (
          <p className="login-hint muted">
            Default admin: <code>admin</code> / <code>admin123</code>
          </p>
        )}
        </div>
      </div>
    </div>
  );
}
