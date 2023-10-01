import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import RoomCard from '../../components/RoomCard';

function Rooms() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await api.get('/salas');
        setRooms(response.data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div>
      <h1>Salas</h1>
      {rooms.map(room => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  );
}

export default Rooms;
