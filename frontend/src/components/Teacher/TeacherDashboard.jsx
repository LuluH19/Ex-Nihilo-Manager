import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from '../../api/axios';
import './TeacherDashboard.css';

const TeacherDashboard = () => {
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [students, setStudents] = useState([]);
  const [newGrade, setNewGrade] = useState({ studentEmail: '', grade: '' });
  const { token, logout } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const response = await axios.post('/prof/info', {}, {
          headers: { Authorization: token }
        });
        setTeacherInfo(response.data);
      } catch (err) {
        setError('Erreur lors du chargement des données');
      }
    };

    fetchTeacherData();
  }, [token]);

  const handleAddGrade = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/prof/notes/add', {
        emailEleve: newGrade.studentEmail,
        note: newGrade.grade
      }, {
        headers: { Authorization: token }
      });
      
      setSuccess('Note ajoutée avec succès');
      setNewGrade({ studentEmail: '', grade: '' });
    } catch (err) {
      setError('Erreur lors de l\'ajout de la note');
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (!teacherInfo) return <div>Chargement...</div>;

  return (
    <div className="teacher-dashboard">
      <header>
        <h1>Tableau de bord professeur</h1>
        <button onClick={handleLogout}>Déconnexion</button>
      </header>

      <div className="teacher-info">
        <h2>Informations personnelles</h2>
        <p>Nom: {teacherInfo.prof.nom}</p>
        <p>Prénom: {teacherInfo.prof.prenom}</p>
        <p>Matière: {teacherInfo.matiere}</p>
      </div>

      <div className="add-grade-section">
        <h2>Ajouter une note</h2>
        <form onSubmit={handleAddGrade}>
          <div>
            <label>Email de l'élève:</label>
            <input
              type="email"
              value={newGrade.studentEmail}
              onChange={(e) => setNewGrade({...newGrade, studentEmail: e.target.value})}
              required
            />
          </div>
          <div>
            <label>Note:</label>
            <input
              type="number"
              min="0"
              max="20"
              step="0.5"
              value={newGrade.grade}
              onChange={(e) => setNewGrade({...newGrade, grade: e.target.value})}
              required
            />
          </div>
          <button type="submit">Ajouter la note</button>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
    </div>
  );
};

export default TeacherDashboard; 