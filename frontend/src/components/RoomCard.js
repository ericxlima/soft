import React from 'react';
import '../styles/RoomCard.css';
import api from '../services/api';


function RoomCard({ room, userId }) {
  const rentRoom = async (roomId) => {
    try {
        const response = await api.post('/reservas', {
            roomId: roomId,
            startBooking: '2023-10-02T10:00:00Z',
            endBooking: '2023-10-02T11:00:00Z',
        });
        console.log(response.data);
        alert('Reserva solicitada com sucesso!');
    } catch (error) {
        console.error('Erro ao solicitar reserva:', error);
        alert('Erro ao solicitar reserva. Tente novamente mais tarde.');
    }
};


  return (
    <div className="room-card">
      <h2>{room.name}</h2>
      <p>Capacidade: {room.capacity}</p>
      <p>Status: {room.status}</p>
      {room.status === 'AVAILABLE' && (
        <button onClick={() => rentRoom(room.id)}>Alugar</button>
      )}
    </div>
  );
}

export default RoomCard;
