import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [is_admin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await api.post('/auth/register', { username, password, is_admin });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro desconhecido ao registrar');
    }
  };

  return (
    <div>
      <h1>Registrar</h1>
      {error && <p>{error}</p>}
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Usuário"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Senha"
      />
      <input
        type="checkbox"
        checked={is_admin}
        onChange={(e) => setIsAdmin(e.target.checked)}
      />
      <label>Sou Administrador</label>
      <button onClick={handleRegister}>Registrar</button>
      <Link to="/login">Já tem uma conta? Faça login</Link>
    </div>
  );
}

export default RegisterPage;
