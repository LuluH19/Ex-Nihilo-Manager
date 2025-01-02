import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from '../../api/axios';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const [studentInfo, setStudentInfo] = useState(null);
  const [notes, setNotes] = useState([]);
  const { token, logout } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const infoResponse = await axios.post('/eleve/info', {}, {
          headers: { Authorization: token }
        });
        setStudentInfo(infoResponse.data);

        const notesResponse = await axios.post('/eleve/notes', {}, {
          headers: { Authorization: token }
        });
        setNotes(notesResponse.data);
      } catch (err) {
        setError('Erreur lors du chargement des données');
        console.error(err);
      }
    };

    fetchStudentData();
  }, [token]);

  const handleLogout = () => {
    logout();
  };

  if (!studentInfo) return <div>Chargement...</div>;

  return (
    <div className="student-dashboard">
      <header>
        <h1>Tableau de bord étudiant</h1>
        <button onClick={handleLogout}>Déconnexion</button>
      </header>

      <div className="student-info">
        <h2>Informations personnelles</h2>
        <p>Nom: {studentInfo.nom}</p>
        <p>Prénom: {studentInfo.prenom}</p>
        <p>Email: {studentInfo.email}</p>
        <p>Téléphone: {studentInfo.telephone}</p>
      </div>

      <div className="grades-section">
        <h2>Mes notes</h2>
        {notes.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Matière</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {notes.map((note, index) => (
                <tr key={index}>
                  <td>{note.matiere.nom}</td>
                  <td>{note.valeur}/20</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Aucune note disponible</p>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default StudentDashboard; 