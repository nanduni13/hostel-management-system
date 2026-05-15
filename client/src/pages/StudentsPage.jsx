import { useCallback, useEffect, useState } from 'react';
import { studentsApi, roomsApi } from '../api/api';

const emptyForm = { name: '', username: '', email: '', age: '', department: '', roomId: '', feesPaid: false };

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [viewStudent, setViewStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [studentList, roomList] = await Promise.all([
        studentsApi.getAll(),
        roomsApi.getAll().catch(() => []),
      ]);
      setStudents(Array.isArray(studentList) ? studentList : []);
      setRooms(Array.isArray(roomList) ? roomList : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function handleEdit(student) {
    setEditingId(student._id);
    setForm({
      name: student.name,
      username: student.username || '',
      email: student.email || '',
      age: String(student.age),
      department: student.department,
      roomId: student.roomId?._id || student.roomId || '',
      feesPaid: student.feesPaid ?? false,
    });
    setMessage('');
    setError('');
  }

  async function handleView(id) {
    setError('');
    try {
      const student = await studentsApi.getById(id);
      setViewStudent(student);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    const payload = {
      name: form.name.trim(),
      age: Number(form.age),
      department: form.department.trim(),
      feesPaid: form.feesPaid,
      ...(form.username ? { username: form.username.trim() } : {}),
      ...(form.email ? { email: form.email.trim() } : {}),
      roomId: form.roomId || '',
    };

    try {
      if (editingId) {
        await studentsApi.update(editingId, payload);
        setMessage('Student updated successfully.');
      } else {
        await studentsApi.create(payload);
        setMessage('Student created successfully.');
      }
      resetForm();
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this student?')) return;
    setError('');
    try {
      await studentsApi.remove(id);
      setMessage('Student deleted.');
      if (editingId === id) resetForm();
      if (viewStudent?._id === id) setViewStudent(null);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <h2>Students</h2>
        <p>Manage students, assign rooms, and view details</p>
      </header>

      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <div className="page-grid">
        <section className="panel">
          <h3>{editingId ? 'Edit student' : 'Add student'}</h3>
          <form className="form" onSubmit={handleSubmit}>
            <label>
              Name
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
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="johndoe"
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="student@email.com"
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
              Assign room
              <select value={form.roomId} onChange={(e) => setForm({ ...form, roomId: e.target.value })}>
                <option value="">No room</option>
                {rooms.map((room) => {
                  const count = room.occupants?.length || 0;
                  const full = count >= room.capacity;
                  return (
                    <option key={room._id} value={room._id}>
                      Room {room.roomNumber} ({count}/{room.capacity}){full ? ' - Full' : ''}
                    </option>
                  );
                })}
              </select>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={form.feesPaid}
                onChange={(e) => setForm({ ...form, feesPaid: e.target.checked })}
              />
              Fees paid
            </label>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update' : 'Create'}
              </button>
              {editingId && (
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="panel panel-wide">
          <h3>All students ({students.length})</h3>
          {loading ? (
            <p className="muted">Loading...</p>
          ) : students.length === 0 ? (
            <p className="muted">No students yet.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Room</th>
                    <th>Fees</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s._id}>
                      <td>{s.name}</td>
                      <td>{s.username || '—'}</td>
                      <td>{s.email || '—'}</td>
                      <td>{s.department}</td>
                      <td>{s.roomId?.roomNumber ? `Room ${s.roomId.roomNumber}` : '—'}</td>
                      <td>
                        <span className={`badge ${s.feesPaid ? 'badge-success' : 'badge-warn'}`}>
                          {s.feesPaid ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                      <td className="actions">
                        <button type="button" className="btn btn-sm" onClick={() => handleView(s._id)}>
                          View
                        </button>
                        <button type="button" className="btn btn-sm" onClick={() => handleEdit(s)}>
                          Edit
                        </button>
                        <button type="button" className="btn btn-sm btn-danger" onClick={() => handleDelete(s._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {viewStudent && (
        <div className="modal-overlay" onClick={() => setViewStudent(null)}>
          <div className="modal panel" onClick={(e) => e.stopPropagation()}>
            <h3>Student details</h3>
            <div className="profile-grid">
              <div className="profile-row">
                <span className="muted">Name</span>
                <strong>{viewStudent.name}</strong>
              </div>
              <div className="profile-row">
                <span className="muted">Username</span>
                <strong>{viewStudent.username || '—'}</strong>
              </div>
              <div className="profile-row">
                <span className="muted">Email</span>
                <strong>{viewStudent.email || '—'}</strong>
              </div>
              <div className="profile-row">
                <span className="muted">Age</span>
                <strong>{viewStudent.age}</strong>
              </div>
              <div className="profile-row">
                <span className="muted">Department</span>
                <strong>{viewStudent.department}</strong>
              </div>
              <div className="profile-row">
                <span className="muted">Room</span>
                <strong>
                  {viewStudent.roomId?.roomNumber
                    ? `Room ${viewStudent.roomId.roomNumber} (cap ${viewStudent.roomId.capacity})`
                    : 'Not assigned'}
                </strong>
              </div>
              <div className="profile-row">
                <span className="muted">Fees</span>
                <span className={`badge ${viewStudent.feesPaid ? 'badge-success' : 'badge-warn'}`}>
                  {viewStudent.feesPaid ? 'Paid' : 'Pending'}
                </span>
              </div>
            </div>
            <button type="button" className="btn btn-secondary" onClick={() => setViewStudent(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
