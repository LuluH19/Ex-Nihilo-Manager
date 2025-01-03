import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login/Login';
import StudentDashboard from './components/Student/StudentDashboard'
import TeacherDashboard from './components/Teacher/TeacherDashboard'
import AdminDashboard from './components/Admin/AdminDashboard'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<StudentDashboard />} />
                <Route path="/dashboardprof" element={<TeacherDashboard />} />
                <Route path="/dashboardadmin" element={<AdminDashboard />} />
            </Routes>
        </Router>
    );
}

export default App;
