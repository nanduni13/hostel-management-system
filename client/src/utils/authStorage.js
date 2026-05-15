const TOKEN_KEY = 'hostel_admin_token';
const ADMIN_KEY = 'hostel_admin_user';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuth(token, admin) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ADMIN_KEY);
}

export function getSavedAdmin() {
  const saved = localStorage.getItem(ADMIN_KEY);
  return saved ? JSON.parse(saved) : null;
}

export { TOKEN_KEY, ADMIN_KEY };
