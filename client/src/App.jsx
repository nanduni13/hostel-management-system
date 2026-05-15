import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { StudentAuthProvider } from './context/StudentAuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedStudentRoute from './components/ProtectedStudentRoute';
import Layout from './components/Layout';
import StudentLayout from './components/StudentLayout';
import LoginPage from './pages/LoginPage';
import StudentSignupPage from './pages/StudentSignupPage';
import StudentProfilePage from './pages/student/StudentProfilePage';
import StudentRoomPage from './pages/student/StudentRoomPage';
import StudentNoticesPage from './pages/student/StudentNoticesPage';
import StudentComplaintsPage from './pages/student/StudentComplaintsPage';
import Dashboard from './pages/Dashboard';
import StudentsPage from './pages/StudentsPage';
import RoomsPage from './pages/RoomsPage';
import AdminsPage from './pages/AdminsPage';
import NoticesPage from './pages/NoticesPage';
import ComplaintsPage from './pages/ComplaintsPage';
import './App.css';

export default function App() {
  return (
    <AuthProvider>
      <StudentAuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<StudentSignupPage />} />
            <Route
              path="/student"
              element={
                <ProtectedStudentRoute>
                  <StudentLayout />
                </ProtectedStudentRoute>
              }
            >
              <Route index element={<StudentProfilePage />} />
              <Route path="room" element={<StudentRoomPage />} />
              <Route path="notices" element={<StudentNoticesPage />} />
              <Route path="complaints" element={<StudentComplaintsPage />} />
            </Route>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="students" element={<StudentsPage />} />
              <Route path="rooms" element={<RoomsPage />} />
              <Route path="notices" element={<NoticesPage />} />
              <Route path="complaints" element={<ComplaintsPage />} />
              <Route path="admins" element={<AdminsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </StudentAuthProvider>
    </AuthProvider>
  );
}
