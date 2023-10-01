import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

// Importando os estilos
import { 
  Container, 
  Title, 
  StyledInput, 
  StyledButton, 
  StyledLink 
} from './styles';

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
    <Container>
      <Title>Login</Title>
      {error && <p>{error}</p>}
      <StyledInput
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Usuário"
      />
      <StyledInput
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Senha"
      />
      <StyledButton onClick={handleLogin}>Login</StyledButton>
      <StyledLink as={Link} to="/register">Não tem uma conta? Registre-se</StyledLink>
    </Container>
  );
}

export default LoginPage;
