import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from '../../api/axios';
import './Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nom: '',
    prenom: '',
    age: '',
    telephone: '',
    matiere: '',
  });
  const [role, setRole] = useState('eleve');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const validatePassword = (password) => {
    if (password.length < 6 || password.length > 30) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/[a-z]/.test(password)) return false;
    if (!/\d/.test(password)) return false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        // Login
        const response = await axios.post(`/${role}/login`, {
          email: formData.email,
          password: formData.password
        });

        if (response.data) {
          login({ email: formData.email, role }, response.data);
          navigateToRole(role);
        }
      } else {
        // Register
        if (!validatePassword(formData.password)) {
          setError('Le mot de passe doit contenir au moins 6 caractères, une majuscule, une minuscule et un chiffre');
          return;
        }

        const registerData = {
          ...formData,
          photo: "default.jpg"
        };

        const response = await axios.post(`/${role}/register`, registerData);
        if (response.data) {
          login({ email: formData.email, role }, response.data);
          navigateToRole(role);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion');
    }
  };

  const navigateToRole = (role) => {
    switch(role) {
      case 'eleve':
        navigate('/student');
        break;
      case 'prof':
        navigate('/teacher');
        break;
      case 'vieScolaire':
        navigate('/admin');
        break;
      default:
        setError('Rôle non reconnu');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? Number(value) : value
    }));
  };

  return (
    <div className="login-container">
      <h2>{isLogin ? 'Connexion' : 'Inscription'}</h2>
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <div>
              <label>Nom:</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required={!isLogin}
              />
            </div>
            <div>
              <label>Prénom:</label>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                required={!isLogin}
              />
            </div>
            <div>
              <label>Âge:</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required={!isLogin}
              />
            </div>
            <div>
              <label>Téléphone:</label>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                required={!isLogin}
                pattern="^0[67]\d{8}$"
              />
            </div>
            {role === 'prof' && (
              <div>
                <label>Matière:</label>
                <input
                  type="text"
                  name="matiere"
                  value={formData.matiere}
                  onChange={handleChange}
                  required={!isLogin && role === 'prof'}
                />
              </div>
            )}
          </>
        )}
        
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label>Mot de passe:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label>Rôle:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="eleve">Élève</option>
            <option value="prof">Professeur</option>
            <option value="vieScolaire">Vie Scolaire</option>
          </select>
        </div>
        
        <button type="submit">{isLogin ? 'Se connecter' : "S'inscrire"}</button>
      </form>
      
      <button 
        className="toggle-mode" 
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? "S'inscrire" : 'Se connecter'}
      </button>
    </div>
  );
};

export default Login; 