import React, { useState } from 'react';
import './styles.css';

export default function Connexion() {
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        nom: '',
        prenom: '',
        age: '',
        telephone: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'age' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            if (isLogin) {
                const data = await loginUser(formData.email, formData.password);
                console.log('Connexion réussie:', data);
                // Gérer la connexion réussie ici (redirection, stockage du token, etc.)
            } else {
                const data = await registerUser(formData);
                console.log('Inscription réussie:', data);
                setIsLogin(true); // Retour au formulaire de connexion
            }
        } catch (error) {
            setError(error.message);
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
                    <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} />
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
