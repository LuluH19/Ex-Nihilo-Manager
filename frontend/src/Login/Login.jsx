import React, { useState } from 'react';
import './styles.css';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        nom: '',
        prenom: '',
        age: '',
        telephone: '',
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

        // Validation du mot de passe pendant la saisie
        if (name === 'password') {
            setPasswordError(validatePassword(value));
        }
    };

    async function loginUser(email, password) {
        try {
            const response = await fetch("http://localhost:4000/eleve/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la connexion');
            }

            return await response.text();
        } catch (error) {
            throw new Error('Erreur lors de la connexion: ' + error.message);
        }
    }

    async function registerUser(formData) {
        try {
            const response = await fetch('http://localhost:4000/eleve/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    photo: formData.photo || "default.jpg"
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors de l\'inscription');
            }

            return data;
        } catch (error) {
            console.error('Erreur détaillée:', error);
            throw new Error(error.message || 'Erreur lors de l\'inscription');
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            if (isLogin) {
                const data = await loginUser(formData.email, formData.password);
                localStorage.setItem('token', data);
                window.location.href = '/dashboard';
            } else {
                // Vérification des champs obligatoires
                if (!formData.nom || !formData.prenom || !formData.email || !formData.password || !formData.age || !formData.telephone) {
                    throw new Error('Tous les champs sont obligatoires');
                }

                // Validation du mot de passe
                const passwordValidationError = validatePassword(formData.password);
                if (passwordValidationError) {
                    throw new Error(passwordValidationError);
                }
                
                const data = await registerUser(formData);
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