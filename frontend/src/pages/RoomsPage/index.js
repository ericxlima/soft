import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import RoomCard from '../../components/RoomCard';
import { useNavigate } from 'react-router-dom';


function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [profile, setProfile] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const navigate = useNavigate();


  function setAuthToken(token) {
    if (token) {
        api.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    } else {
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

  // Admin

  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [submitError, setSubmitError] = useState(null);

  const handleCreateRoom = async (event) => {
    event.preventDefault();
    try {
        const userId = profile.id;
        const response = await api.post('/rooms', { name, capacity, userId });
        setName('');  // Reset the form fields
        setCapacity('');
    } catch (err) {
        setSubmitError(err.response?.data?.message || 'Erro ao criar a sala.');
    }
  };

  // Common User

  const handleBookRoom = async () => {
    try {
      const response = await api.get('/bookings');
      const allBookings = response.data;

      const selectedStart = new Date(`${startDate}T${startTime}:00`);
      const selectedEnd = new Date(`${endDate}T${endTime}:00`);

      const conflictingRooms = allBookings.filter(booking => {
        const bookingStart = new Date(booking.startBooking);
        const bookingEnd = new Date(booking.endBooking);
        
        return !(
          (selectedStart < bookingStart && selectedEnd <= bookingStart) ||
          (selectedStart >= bookingEnd && selectedEnd > bookingEnd)
        );
      }).map(booking => booking.roomId);
      const allRooms = await api.get('/rooms');

      const availableRooms = allRooms.data.filter(room => !conflictingRooms.includes(room.id));

      if (availableRooms.length > 0) {
        setAvailabilityMessage(`Salas disponíveis: ${availableRooms.map(room => room.name).join(', ')}`);
      } else {
        setAvailabilityMessage("Nenhuma sala disponível para o horário selecionado.");
      }

    } catch (error) {
      console.log(error);
      alert("Erro ao verificar disponibilidade. Tente novamente mais tarde.");
    }
  };


  function backPage() {
    navigate('/');
  }

  return (
    <div>
      <h1>Reserva de Salas</h1>
      <button onClick={backPage}>Voltar</button>
      {profile && (
        <div>
          <h3>Nome: {profile.username}</h3>
          <h3>Cargo: {profile.is_adm ? 'Administrador' : 'Aluno'}</h3>
          
          {!profile.is_adm && (
            <>
              <h4>Selecione Data e Horário para Reserva de Sala:</h4>
              <div>
                <label>Data Inicial:</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
              </div>
              <div>
                <label>Hora Inicial:</label>
                <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
              </div>
              <div>
                <label>Data Final:</label>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
              </div>
              <div>
                <label>Hora Final:</label>
                <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
              </div>
              <button onClick={() => handleBookRoom()}>Ver Disponibilidade de Horários</button>
              <p><b>{availabilityMessage}</b></p>
            </>
          )}

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
        <RoomCard key={room.id} room={room} userId={profile?.id} />
      ))}
    </div>
  );
}

export default Rooms;
