const TOKEN_KEY = 'hostel_student_token';
const STUDENT_KEY = 'hostel_student_user';

export function getStudentToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStudentAuth(token, student) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(STUDENT_KEY, JSON.stringify(student));
}

export function clearStudentAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(STUDENT_KEY);
}

export function getSavedStudent() {
  const saved = localStorage.getItem(STUDENT_KEY);
  return saved ? JSON.parse(saved) : null;
}
