import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useStudentAuth } from '../context/StudentAuthContext';
import { studentAuthApi } from '../api/api';

const emptyForm = {
  name: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  age: '',
  department: '',
  roomId: '',
};

export default function StudentSignupPage() {
  const { register, isAuthenticated } = useStudentAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    studentAuthApi.getRooms().then(setRooms).catch(() => setRooms([]));
  }, []);

  if (isAuthenticated) {
    return <Navigate to="/student" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setSubmitting(true);
    try {
      await register({
        name: form.name.trim(),
        username: form.username.trim(),
        ...(form.email.trim() ? { email: form.email.trim() } : {}),
        password: form.password,
        age: Number(form.age),
        department: form.department.trim(),
        ...(form.roomId ? { roomId: form.roomId } : {}),
      });
      setMessage('Registration successful! Redirecting...');
      setTimeout(() => navigate('/student', { replace: true }), 1000);
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
        <div className="login-card login-card-wide signup-card login-card-accent">
          <div className="login-role-bar role-student" aria-hidden />
          <div className="login-brand">
            <span className="brand-icon">H</span>
            <div>
              <h1>Student Sign Up</h1>
              <p>Create your hostel account</p>
            </div>
          </div>

        {error && <div className="alert alert-error">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <form className="form" onSubmit={handleSubmit}>
          <label>
            Full name
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="John Doe"
            />
          </label>
          <label>
            Username
            <input
              required
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="johndoe"
            />
          </label>
          <label>
            Email <span className="muted">(optional)</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="student@email.com"
            />
          </label>
          <label>
            Password
            <input
              required
              type="password"
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Min 6 characters"
            />
          </label>
          <label>
            Confirm password
            <input
              required
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              placeholder="Repeat password"
            />
          </label>
          <label>
            Age
            <input
              required
              type="number"
              min="1"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              placeholder="20"
            />
          </label>
          <label>
            Department
            <input
              required
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              placeholder="Computer Science"
            />
          </label>
          <label>
            Room (optional)
            <select value={form.roomId} onChange={(e) => setForm({ ...form, roomId: e.target.value })}>
              <option value="">No room yet</option>
              {rooms.map((room) => {
                const full = room.occupants?.length >= room.capacity;
                return (
                  <option key={room._id} value={room._id} disabled={full}>
                    Room {room.roomNumber} ({room.occupants?.length || 0}/{room.capacity})
                    {full ? ' - Full' : ''}
                  </option>
                );
              })}
            </select>
          </label>
          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Registering...' : 'Sign Up'}
          </button>
        </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login?tab=student">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
