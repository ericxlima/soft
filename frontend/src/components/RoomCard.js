import React from 'react';
import '../styles/RoomCard.css';
import api from '../services/api';


function RoomCard({ room, userId, availableRooms, bookingStartDateTime, bookingEndDateTime }) {

  const rentRoom = async () => {
    try {
      const response = await api.post('/bookings', {
        roomId: room.id,
        userId: userId,
        startBooking: bookingStartDateTime,
        endBooking: bookingEndDateTime,
      });
      alert('Reserva solicitada com sucesso!');
    } catch (error) {
      console.error('Erro ao solicitar reserva:', error.response.data);
      alert('Erro ao solicitar reserva. Tente novamente mais tarde.');
    }
  };

  return (
    <div className="room-card">
      <h2>{room.name}</h2>
      <p>Capacidade: {room.capacity} Pessoas</p>
      {availableRooms.some(availableRoom => availableRoom.id === room.id) && (
        <button onClick={rentRoom}>Reservar</button>
      )}
    </div>
  );
}

export default RoomCard;
