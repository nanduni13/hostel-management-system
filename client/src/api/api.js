import { getToken, clearAuth } from '../utils/authStorage';
import { getStudentToken, clearStudentAuth } from '../utils/studentAuthStorage';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}, authType = 'admin') {
  const token =
    authType === 'student' ? getStudentToken() : authType === 'admin' ? getToken() : null;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  } catch {
    throw new Error(
      'Cannot connect to server. Start the backend with: npm start (from project root).'
    );
  }

  const data = await res.json().catch(() => ({}));

  const isPublicAuth =
    path.startsWith('/auth/login') ||
    path.startsWith('/auth/student/register') ||
    path.startsWith('/auth/student/login') ||
    path === '/auth/rooms';

  if (res.status === 401 && !isPublicAuth) {
    if (authType === 'student') {
      clearStudentAuth();
      window.location.href = '/login?tab=student';
    } else {
      clearAuth();
      window.location.href = '/login';
    }
    throw new Error('Session expired. Please login again.');
  }

  if (!res.ok) {
    const message = data.message || data.error || res.statusText;
    throw new Error(message);
  }
  return data;
}

export const authApi = {
  login: (username, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  me: () => request('/auth/me'),
};

export const studentAuthApi = {
  getRooms: () => request('/auth/rooms', {}, 'none'),
  register: (body) =>
    request('/auth/student/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }, 'none'),
  login: (username, password) =>
    request('/auth/student/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }, 'none'),
  me: () => request('/auth/student/me', {}, 'student'),
  profile: () => request('/student/profile', {}, 'student'),
  getRoom: () => request('/student/room', {}, 'student'),
  getNotices: () => request('/student/notices', {}, 'student'),
  getComplaints: () => request('/student/complaints', {}, 'student'),
  createComplaint: (body) =>
    request('/student/complaints', { method: 'POST', body: JSON.stringify(body) }, 'student'),
};

export const studentsApi = {
  getAll: () => request('/students'),
  getById: (id) => request(`/students/${id}`),
  create: (body) => request('/students', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/students/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (id) => request(`/students/${id}`, { method: 'DELETE' }),
};

export const complaintsApi = {
  getAll: () => request('/complaints'),
  update: (id, body) => request(`/complaints/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (id) => request(`/complaints/${id}`, { method: 'DELETE' }),
};

export const noticesApi = {
  getAll: () => request('/notices'),
  create: (body) => request('/notices', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/notices/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (id) => request(`/notices/${id}`, { method: 'DELETE' }),
};

export const roomsApi = {
  getAll: () => request('/rooms'),
  create: (body) => request('/rooms', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/rooms/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (id) => request(`/rooms/${id}`, { method: 'DELETE' }),
};

export const adminsApi = {
  getAll: () => request('/admins'),
  create: (body) => request('/admins', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/admins/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (id) => request(`/admins/${id}`, { method: 'DELETE' }),
};
