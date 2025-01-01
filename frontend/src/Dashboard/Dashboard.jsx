import React, { useState, useEffect } from 'react';
import './styles.css';
import api from '../api/axios';

export default function Dashboard() {
    const [userData, setUserData] = useState(null);
    const [notes, setNotes] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Veuillez vous connecter');
            window.location.href = '/login';
            return;
        }

        const fetchUserData = async () => {
            try {
                const response = await api.post('/eleve/info', {}, {
                    headers: {
                        'Authorization': token
                    }
                });
                if (response.status === 200) {
                    setUserData(response.data);
                    fetchNotes();
                }
            } catch (err) {
                setError('Erreur lors de la récupération des données');
                localStorage.removeItem('token');
                window.location.href = '/login';
            } finally {
                setLoading(false);
            }
        };

        const fetchNotes = async () => {
            try {
                const response = await api.post('/eleve/notes', {}, {
                    headers: {
                        'Authorization': token
                    }
                });
                
                console.log('Response notes:', response.data);
                
                if (response.status === 200) {
                    let notesArray = response.data;
                    if (response.data && !Array.isArray(response.data)) {
                        notesArray = Object.values(response.data)[0] || [];
                    }
                    
                    const notesData = Array.isArray(notesArray) ? notesArray : [];
                    console.log('Notes processed:', notesData);
                    setNotes(notesData);
                }
            } catch (err) {
                console.error('Error fetching notes:', err);
                setError('Erreur lors de la récupération des notes');
                setNotes([]);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return <div className="dashboard-loading">Chargement...</div>;
    }

    if (error) {
        return <div className="dashboard-error">{error}</div>;
    }

    return (
        <div className="dashboard-container">
            {userData && (
                <div className="dashboard-header">
                    <div className="user-info">
                        <div className="user-details">
                            <h2>{userData.prenom} {userData.nom}</h2>
                            <p>{userData.email}</p>
                            <p>Téléphone: {userData.telephone}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="dashboard-content">
                <div className="notes-section">
                    <h3>Mes Notes</h3>
                    <div className="notes-grid">
                        {notes && Array.isArray(notes) ? (
                            notes.length > 0 ? (
                                notes.map((note, index) => (
                                    <div key={index} className="note-card">
                                        <h4>{note?.matiere?.nom || 'Matière inconnue'}</h4>
                                        <p className="note-value">{note?.valeur || 0}/20</p>
                                    </div>
                                ))
                            ) : (
                                <p>Aucune note disponible</p>
                            )
                        ) : (
                            <p>Chargement des notes...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 