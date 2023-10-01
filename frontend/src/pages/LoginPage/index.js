import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  const handleLogin = async () => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const token = response.data.token;
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      navigate('/rooms');
      // Armazene o token e redirecione o usuário conforme necessário
    } catch (err) {
      setError(err.response?.data?.message || 'Erro desconhecido ao fazer login');
    }
  };

  return (
    <div>
      <h1>Login</h1>
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
      <button onClick={handleLogin}>Login</button>
      <Link to="/register">Não tem uma conta? Registre-se</Link>
    </div>
  );
}

export default LoginPage;
