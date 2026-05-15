import { createContext, useContext, useEffect, useState } from 'react';
import { studentAuthApi } from '../api/api';
import { getStudentToken, setStudentAuth, clearStudentAuth, getSavedStudent } from '../utils/studentAuthStorage';

const StudentAuthContext = createContext(null);

export function StudentAuthProvider({ children }) {
  const [student, setStudent] = useState(getSavedStudent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getStudentToken();
    if (!token) {
      setLoading(false);
      return;
    }

    studentAuthApi
      .me()
      .then((profile) => {
        setStudent({ id: profile._id, name: profile.name, username: profile.username });
      })
      .catch(() => {
        clearStudentAuth();
        setStudent(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(username, password) {
    const data = await studentAuthApi.login(username, password);
    setStudentAuth(data.token, data.student);
    setStudent(data.student);
    return data;
  }

  async function register(formData) {
    const data = await studentAuthApi.register(formData);
    setStudentAuth(data.token, data.student);
    setStudent(data.student);
    return data;
  }

  function logout() {
    clearStudentAuth();
    setStudent(null);
  }

  return (
    <StudentAuthContext.Provider
      value={{ student, loading, login, register, logout, isAuthenticated: !!student }}
    >
      {children}
    </StudentAuthContext.Provider>
  );
}

export function useStudentAuth() {
  const ctx = useContext(StudentAuthContext);
  if (!ctx) throw new Error('useStudentAuth must be used within StudentAuthProvider');
  return ctx;
}
