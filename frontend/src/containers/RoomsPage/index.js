import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import RoomCard from '../../components/RoomCard';

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [profile, setProfile] = useState(null);

  function setAuthToken(token) {
    if (token) {
        // Aplicando token a cada requisição
        api.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    } else {
        // Deletando o cabeçalho de autenticação
        delete api.defaults.headers.common['Authorization'];
    }
  }


  useEffect(() => {
    const token = localStorage.getItem('token');
    setAuthToken(token);

    const fetchRooms = async () => {
      try {
        const response = await api.get('/rooms');
        setRooms(response.data);
        console.log('Rooms:', response.data)
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    const fetchProfile = async () => {
      try {
        const response = await api.get('/auth/profile/');
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchRooms();
    fetchProfile();
  }, []);

  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [submitError, setSubmitError] = useState(null);

  const handleCreateRoom = async (event) => {
    event.preventDefault();
    try {
        const userId = profile.id;
        console.log(userId);
        const response = await api.post('/rooms', { name, capacity, userId });
        console.log(response.data);
        setName('');  // Reset the form fields
        setCapacity('');
    } catch (err) {
        setSubmitError(err.response?.data?.message || 'Erro ao criar a sala.');
    }
  };

  function refreshPage() {
    window.location.reload(false);
  }

  return (
    <div>
      <h1>Salas</h1>
      <button onClick={refreshPage}>Atualizar</button>
      {profile && (
        <div>
          <h3>Nome: {profile.username}</h3>
          <h3>Cargo: {profile.is_adm ? 'Administrador' : 'Usuário'}</h3>
          {profile.is_adm && (
            <>
              <h3>Cadastrar uma Nova Sala</h3>
                <form onSubmit={handleCreateRoom}>
                  <div>
                    <label>Nome:</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nome da sala"
                      required
                    />
                  </div>
                  <div>
                    <label>Capacidade:</label>
                    <input
                      type="number"
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      placeholder="Capacidade"
                      required
                    />
                  </div>
                  <button type="submit">Criar</button>
                </form>
              {submitError && <p style={{ color: 'red' }}>{submitError}</p>}
            </>
          )}
        </div>
      )}
      {rooms.map(room => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  );
}

export default Rooms;
