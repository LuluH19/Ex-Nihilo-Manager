import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from '../../api/axios';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('eleve');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Réinitialiser l'erreur

    try {
      const response = await axios.post(`/${role}/login`, {
        email,
        password
      });

      if (response.data) {
        const token = response.data;
        login({ email, role }, token);

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
      } else {
        setError('Réponse invalide du serveur');
      }
    } catch (err) {
      console.error('Erreur complète:', err);
      setError(err.response?.data?.message || 'Erreur de connexion. Vérifiez vos identifiants.');
    }
  };

  return (
    <div className="login-container">
      <h2>Connexion</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Mot de passe:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
};

export default Login; 