import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import StudentDashboard from './components/Student/StudentDashboard';
import TeacherDashboard from './components/Teacher/TeacherDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import HeaderComponent from './components/common/HeaderComponent';

function App() {
  return (
    <AuthProvider>
      <Router>
        <HeaderComponent/>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/student/*" 
            element={
              <PrivateRoute role="eleve">
                <StudentDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/teacher/*" 
            element={
              <PrivateRoute role="prof">
                <TeacherDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin/*" 
            element={
              <PrivateRoute role="vieScolaire">
                <AdminDashboard />
              </PrivateRoute>
            } 
          />
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App; 