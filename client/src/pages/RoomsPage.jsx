import { useCallback, useEffect, useState } from 'react';
import { roomsApi } from '../api/api';

const emptyForm = { roomNumber: '', capacity: '' };

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await roomsApi.getAll();
      setRooms(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.message === 'No rooms found') {
        setRooms([]);
      } else {
        setError(err.message);
      }
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

  function handleEdit(room) {
    setEditingId(room._id);
    setForm({
      roomNumber: room.roomNumber,
      capacity: String(room.capacity),
    });
    setMessage('');
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    const payload = {
      roomNumber: form.roomNumber.trim(),
      capacity: Number(form.capacity),
    };

    try {
      if (editingId) {
        await roomsApi.update(editingId, payload);
        setMessage('Room updated successfully.');
      } else {
        await roomsApi.create(payload);
        setMessage('Room created successfully.');
      }
      resetForm();
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this room?')) return;
    setError('');
    try {
      await roomsApi.remove(id);
      setMessage('Room deleted.');
      if (editingId === id) resetForm();
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <h2>Rooms</h2>
        <p>Manage hostel rooms and capacity</p>
      </header>

      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <div className="page-grid">
        <section className="panel">
          <h3>{editingId ? 'Edit room' : 'Add room'}</h3>
          <form className="form" onSubmit={handleSubmit}>
            <label>
              Room number
              <input
                required
                value={form.roomNumber}
                onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
                placeholder="101"
              />
            </label>
            <label>
              Capacity
              <input
                required
                type="number"
                min="1"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                placeholder="4"
              />
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
          <h3>All rooms ({rooms.length})</h3>
          {loading ? (
            <p className="muted">Loading...</p>
          ) : rooms.length === 0 ? (
            <p className="muted">No rooms yet. Add one using the form.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Room #</th>
                    <th>Capacity</th>
                    <th>Occupants</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room) => (
                    <tr key={room._id}>
                      <td>{room.roomNumber}</td>
                      <td>{room.capacity}</td>
                      <td>
                        {room.occupants?.length
                          ? room.occupants.map((o) => (typeof o === 'object' ? o.name : o)).join(', ')
                          : '—'}
                      </td>
                      <td className="actions">
                        <button type="button" className="btn btn-sm" onClick={() => handleEdit(room)}>
                          Edit
                        </button>
                        <button type="button" className="btn btn-sm btn-danger" onClick={() => handleDelete(room._id)}>
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
    </div>
  );
}
