import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from '../../api/axios';
import './StudentDashboard.css';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import frLocale from '@fullcalendar/core/locales/fr';

const StudentDashboard = () => {
  const [studentInfo, setStudentInfo] = useState(null);
  const [notes, setNotes] = useState([]);
  const [cours, setCours] = useState([]);
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

        const coursResponse = await axios.post('/eleve/cours', {}, {
          headers: { Authorization: token }
        });
        setCours(coursResponse.data);
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
      
      <div className='calendar-section'>
        <FullCalendar
          plugins={[dayGridPlugin,timeGridPlugin]}
          locale={frLocale}
          initialView='timeGridWeek'
          headerToolbar={{left:'prev,next', center:'title',right: 'today,timeGridDay,timeGridWeek,dayGridYear'}}
          events={cours.map(cour=>{return {id:cour._id,start:cour.debut,end:cour.fin,title:`cours de ${cour.matiere.nom}\nprof : ${cour.prof.nom} ${cour.prof.prenom}\n${cour.classe.nom}`}})}
          slotMinTime={"06:00:00"}
          slotMaxTime={"20:00:00"}
          businessHours={[
            {daysOfWeek:[1,2,3,4,5],startTime: '8:00', endTime: '18:00'},
            {daysOfWeek:[6],startTime: '8:00', endTime: '13:00'}
          ]}
          weekNumbers="true"
          nowIndicator="true"
        />
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default StudentDashboard; 