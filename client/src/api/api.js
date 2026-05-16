import { getToken, clearAuth } from '../utils/authStorage';
import { getStudentToken, clearStudentAuth } from '../utils/studentAuthStorage';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}, authType = 'admin') {
  const isPublicAuth =
    path.startsWith('/auth/login') ||
    path.startsWith('/auth/student/register') ||
    path.startsWith('/auth/student/login') ||
    path === '/auth/rooms';

  if (authType === 'admin' && !isPublicAuth && !getToken()) {
    throw new Error('Admin login required. Use Admin Login before adding or editing data.');
  }
  if (authType === 'student' && !isPublicAuth && !getStudentToken()) {
    throw new Error('Student login required. Please log in first.');
  }

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
      'Cannot reach the API. Start the backend (npm start in project root) and use the Vite dev server (npm run dev in client).'
    );
  }

  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await res.json().catch(() => ({}))
    : {};

  if (!contentType.includes('application/json') && res.ok) {
    throw new Error(
      'Unexpected API response. Run the frontend with "npm run dev" in the client folder so /api proxies to the backend.'
    );
  }

  if (res.status === 401 && !isPublicAuth) {
    const message = data.error || 'Session expired. Please log in again.';
    if (authType === 'student') {
      clearStudentAuth();
      window.location.href = '/login?tab=student';
    } else {
      clearAuth();
      window.location.href = '/login';
    }
    throw new Error(message);
  }

  if (res.status === 403 && !isPublicAuth) {
    throw new Error(
      data.error ||
        'Access denied. Admin pages need an admin token from Admin Login (not student login).'
    );
  }

  if (!res.ok) {
    const message = data.error || data.message || res.statusText;
    throw new Error(message);
  }
  return data;
}

export const authApi = {
  login: (username, password) =>
    request(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      },
      'none'
    ),
  me: () => request('/auth/me'),
};

export const studentAuthApi = {
  getRooms: () => request('/auth/rooms', {}, 'none'),
  register: (body) =>
    request(
      '/auth/student/register',
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      'none'
    ),
  login: (username, password) =>
    request(
      '/auth/student/login',
      {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      },
      'none'
    ),
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
