import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate, Link } from 'react-router-dom';

// Importando os estilos
import {
  Container,
  Title,
  StyledInput,
  StyledButton,
  StyledLink,
  CheckboxWrapper,
  StyledCheckbox,
  StyledLabel
} from './styles';

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
    <Container>
      <Title>Registrar</Title>
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
      <CheckboxWrapper>
        <StyledCheckbox
          type="checkbox"
          checked={is_admin}
          onChange={(e) => setIsAdmin(e.target.checked)}
        />
        <StyledLabel>Sou Administrador</StyledLabel>
      </CheckboxWrapper>
      <StyledButton onClick={handleRegister}>Registrar</StyledButton>
      <StyledLink as={Link} to="/login">Já tem uma conta? Faça login</StyledLink>
    </Container>
  );
}

export default RegisterPage;

