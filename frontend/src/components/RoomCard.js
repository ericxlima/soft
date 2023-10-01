import React from 'react';
// import '../styles/RoomCard.css';

function RoomCard({ room }) {
  return (
    <div className="room-card">
      <h2>{room.name}</h2>
      <p>Capacidade: {room.capacity}</p>
      <p>Status: {room.status}</p>
    </div>
  );
}

export default RoomCard;
