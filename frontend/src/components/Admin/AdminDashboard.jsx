import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from '../../api/axios';
import './AdminDashboard.css';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import frLocale from '@fullcalendar/core/locales/fr';

const AdminDashboard = () => {
  const [classes, setClasses] = useState([]);
  const [newClass, setNewClass] = useState({ nom: '', nbPlace: '' });
  const [cours, setCours] = useState([]);
  const { token, logout } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchClasses();
  }, [token]);

  const fetchClasses = async () => {
    try {
      const response = await axios.post('/viescolaire/classes/show', {}, {
        headers: { Authorization: token }
      });
      setClasses(response.data);

      const coursResponse = await axios.post('/viescolaire/cours', {}, {
        headers: { Authorization: token }
      });

      setCours(coursResponse.data);
    } catch (err) {
      setError('Erreur lors du chargement des classes');
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/viescolaire/classes/create', newClass, {
        headers: { Authorization: token }
      });
      setSuccess('Classe créée avec succès');
      setNewClass({ nom: '', nbPlace: '' });
      fetchClasses();
    } catch (err) {
      setError('Erreur lors de la création de la classe');
    }
  };

  const handleAddStudent = async (classId, studentId) => {
    try {
      await axios.post('http://localhost:4000/viescolaire/classes/eleves/add', {
        idClasse: classId,
        idEleve: studentId
      }, {
        headers: { Authorization: token }
      });
      setSuccess('Élève ajouté avec succès');
      fetchClasses();
    } catch (err) {
      setError('Erreur lors de l\'ajout de l\'élève');
    }
  };

  const handleRemoveStudent = async (classId, studentId) => {
    try {
      await axios.post('http://localhost:4000/viescolaire/classes/eleves/remove', {
        idClasse: classId,
        idEleve: studentId
      }, {
        headers: { Authorization: token }
      });
      setSuccess('Élève retiré avec succès');
      fetchClasses();
    } catch (err) {
      setError('Erreur lors du retrait de l\'élève');
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="admin-dashboard">
      <header>
        <h1>Tableau de bord administratif</h1>
        <button onClick={handleLogout}>Déconnexion</button>
      </header>

      <div className="create-class-section">
        <h2>Créer une nouvelle classe</h2>
        <form onSubmit={handleCreateClass}>
          <div>
            <label>Nom de la classe:</label>
            <input
              type="text"
              value={newClass.nom}
              onChange={(e) => setNewClass({...newClass, nom: e.target.value})}
              required
            />
          </div>
          <div>
            <label>Nombre de places:</label>
            <input
              type="number"
              value={newClass.nbPlace}
              onChange={(e) => setNewClass({...newClass, nbPlace: e.target.value})}
              required
            />
          </div>
          <button type="submit">Créer la classe</button>
        </form>
      </div>

      <div className="classes-list">
        <h2>Liste des classes</h2>
        {classes.map((classe) => (
          <div key={classe._id} className="class-card">
            <h3>{classe.nom}</h3>
            <p>Places: {classe.eleves.length}/{classe.nbPlace}</p>
            <div className="students-list">
              <h4>Élèves:</h4>
              {classe.eleves.map((eleve) => (
                <div key={eleve._id} className="student-item">
                  <span>{eleve.nom} {eleve.prenom}</span>
                  <button onClick={() => handleRemoveStudent(classe._id, eleve._id)}>
                    Retirer
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
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
            {daysOfWeek:[6],startTime: '8:00', endTime: '17:00'}
          ]}
          weekNumbers="true"
          nowIndicator="true"
        />
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
    </div>
  );
};

export default AdminDashboard; 