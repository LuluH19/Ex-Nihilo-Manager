import React, { useState } from 'react';
import './styles.css';
import axios from 'axios';


export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [role, setRole] = useState('eleve');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        nom: '',
        prenom: '',
        age: '',
        telephone: '',
        matiere: '',
    });

    const validatePassword = (password) => {
        if (password.length < 6 || password.length > 30) {
            return "Le mot de passe doit contenir entre 6 et 30 caractères";
        }
        if (!/[A-Z]/.test(password)) {
            return "Le mot de passe doit contenir au moins une majuscule";
        }
        if (!/[a-z]/.test(password)) {
            return "Le mot de passe doit contenir au moins une minuscule";
        }
        if (!/\d/.test(password)) {
            return "Le mot de passe doit contenir au moins un chiffre";
        }
        return "";
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'age' ? Number(value) : value
        }));

        if (name === 'password') {
            setPasswordError(validatePassword(value));
        }
    };

    async function loginUser(email, password, role) {
        try {
            const response = await axios.post(`http://localhost:4000/${role}/login`, { 
                email, 
                password 
            });

            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Erreur lors de la connexion');
        }
    }

    async function registerUser(formData, role) {
        try {
            const response = await axios.post(`http://localhost:4000/${role}/register`, {
                ...formData,
                photo: formData.photo || "default.jpg"
            });
            
            return response.data;
        } catch (error) {
            console.error('Erreur détaillée:', error);
            throw new Error(error.response?.data?.message || 'Erreur lors de l\'inscription');
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            if (isLogin) {
                const data = await loginUser(formData.email, formData.password, role);
                localStorage.setItem('token', data);
                switch(role) {
                    case 'eleve':
                        window.location.href = '/dashboard';
                        break;
                    case 'prof':
                        window.location.href = '/dashboardprof';
                        break;
                    case 'vieScolaire':
                        window.location.href = '/dashboardadmin';
                        break;
                    default:
                        setError('Rôle non reconnu');
                        break;
                }
            } else {
                if (!formData.nom || !formData.prenom || !formData.email || !formData.password || !formData.age || !formData.telephone) {
                    throw new Error('Tous les champs sont obligatoires');
                }

                if (role === 'prof' && !formData.matiere) {
                    throw new Error('La matière est obligatoire pour les professeurs');
                }

                const passwordValidationError = validatePassword(formData.password);
                if (passwordValidationError) {
                    throw new Error(passwordValidationError);
                }
                
                const data = await registerUser(formData, role);
                localStorage.setItem('token', data);
                setIsLogin(true);
            }
        } catch (error) {
            setError(error.message);
            console.error('Erreur complète:', error);
        }
    };

    return (
        <div className="auth-container">
            <h1>{isLogin ? 'Connexion' : 'Inscription'}</h1>
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label htmlFor="role">Rôle</label>
                    <select 
                        name="role" 
                        id="role" 
                        value={role} 
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="eleve">Élève</option>
                        <option value="prof">Professeur</option>
                        <option value="vieScolaire">Vie Scolaire</option>
                    </select>
                </div>

                {!isLogin && (
                    <>
                        <div className="form-group">
                            <label htmlFor="nom">Nom</label>
                            <input type="text" name="nom" id="nom" value={formData.nom} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="prenom">Prénom</label>
                            <input type="text" name="prenom" id="prenom" value={formData.prenom} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="age">Âge</label>
                            <input type="number" name="age" id="age" value={formData.age} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="telephone">Téléphone</label>
                            <input type="tel" name="telephone" id="telephone" value={formData.telephone} onChange={handleChange} />
                        </div>
                        {role === 'prof' && (
                            <div className="form-group">
                                <label htmlFor="matiere">Matière</label>
                                <input type="text" name="matiere" id="matiere" value={formData.matiere} onChange={handleChange} />
                            </div>
                        )}
                    </>
                )}
                
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Mot de passe</label>
                    <input 
                        type="password" 
                        name="password" 
                        id="password" 
                        value={formData.password} 
                        onChange={handleChange} 
                    />
                    {!isLogin && passwordError && (
                        <div className="password-requirements">
                            {passwordError}
                        </div>
                    )}
                </div>
                
                <button type="submit" className="submit-btn">
                    {isLogin ? 'Se connecter' : "S'inscrire"}
                </button>
            </form>
            
            <button 
                className="toggle-btn" 
                onClick={() => setIsLogin(!isLogin)}
            >
                {isLogin ? "S'inscrire" : 'Se connecter'}
            </button>
        </div>
    );
}