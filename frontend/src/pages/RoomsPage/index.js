import React, { useState, useEffect, useMemo } from 'react';
import api from '../../services/api';
import RoomCard from '../../components/RoomCard';
import { useNavigate } from 'react-router-dom';

import { useTable, useFilters, useGlobalFilter } from 'react-table';


function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [profile, setProfile] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [bookingStartDateTime, setBookingStartDateTime] = useState("");
  const [bookingEndDateTime, setBookingEndDateTime] = useState("");
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const [availableRooms, setAvailableRooms] = useState([]);
  const [userBookings, setUserBookings] = useState([]);

  const navigate = useNavigate();

  function setAuthToken(token) {
    if (token) {
        api.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
  }

  const columns = React.useMemo(
    () => [
      {
        Header: 'Nome da Sala',
        accessor: 'roomName', 
        Filter: TableInputFilter,
      },
      {
        Header: 'Horário de Início',
        accessor: 'startBooking',
      },
      {
        Header: 'Horário de Término',
        accessor: 'endBooking',
      },
      {
        Header: 'Status',
        accessor: 'status',
      }
    ],
    []
  );

  const transformedData = useMemo(() => {
    return userBookings.map(booking => {
        const room = rooms.find(r => r.id === booking.roomId);
        return {...booking, roomName: room ? room.name : 'Sala não encontrada'};
    });
  }, [userBookings, rooms]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable({ columns, data: transformedData }, useFilters, useGlobalFilter);

  function TableInputFilter({ column }) {
    return (
      <input
        value={column.filterValue || ''}
        onChange={e => column.setFilter(e.target.value || undefined)}
        placeholder={`Buscar ${column.Header.toLowerCase()}`}
      />
    );
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
        fetchUserBookings(response.data.id);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    const fetchUserBookings = async (userId) => {
      try {
        const response = await api.get('/bookings/user/' +  userId);
        console.log(response.data);
        setUserBookings(response.data);
      } catch (error) {
        console.error("Error fetching user bookings:", error.response.data);
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

      setBookingStartDateTime(Date(`${startDate}T${startTime}:00`));
      setBookingEndDateTime(Date(`${endDate}T${endTime}:00`));

      const conflictingRooms = allBookings.filter(booking => {
        const bookingStart = new Date(booking.startBooking);
        const bookingEnd = new Date(booking.endBooking);
        
        return !(
          (bookingStartDateTime < bookingStart && bookingEndDateTime <= bookingStart) ||
          (bookingStartDateTime >= bookingEnd && bookingEndDateTime > bookingEnd)
        );
      }).map(booking => booking.roomId);
      const allRooms = await api.get('/rooms');

      setAvailableRooms(allRooms.data.filter(room => !conflictingRooms.includes(room.id)));

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
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required/>
              </div>
              <div>
                <label>Hora Inicial:</label>
                <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required/>
              </div>
              <div>
                <label>Data Final:</label>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required/>
              </div>
              <div>
                <label>Hora Final:</label>
                <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required/>
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
          <RoomCard 
              key={room.id} 
              room={room} 
              userId={profile?.id} 
              availableRooms={availableRooms}
              bookingStartDateTime={bookingStartDateTime}
              bookingEndDateTime={bookingEndDateTime}
          />
      ))}

  {profile && !profile.is_adm && userBookings.length > 0 && (
    <section>
      <h2>Minhas Reservas</h2>

      <input
        value={state.globalFilter || ''}
        onChange={e => setGlobalFilter(e.target.value || undefined)}
        placeholder={`Buscar por Nome da Sala`}
      />
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
        </table>
    </section>
  )}
    </div>
  );
}

export default Rooms;
