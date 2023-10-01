import React, { useState, useEffect, useMemo } from 'react';
import api from '../../services/api';
import RoomCard from '../../components/RoomCard';
import { useNavigate } from 'react-router-dom';

import { useTable, useFilters, useGlobalFilter, usePagination } from 'react-table';


function RoomsAdmin() {
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
  const [allBookings, setAllBookings] = useState([]);

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
        Header: 'Usuário',
        accessor: 'user',
        Filter: TableInputFilter,
      },
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

  const allTransformedData = useMemo(() => {
    return allBookings.map(booking => {
      console.log(booking)
      const room = rooms.find(r => r.id === booking.roomId);
      return { ...booking, roomName: room ? room.name : 'Sala não encontrada' };
    });
  }, [allBookings, rooms]);


  const {
    getTableProps: getAllTableProps,
    getTableBodyProps: getAllTableBodyProps,
    prepareRow: prepareAllRow,
    headerGroups: allHeaderGroups,
    setGlobalFilter: setAllGlobalFilter,
    state: allState,
    page: allPage,
    nextPage: allNextPage,
    previousPage: allPreviousPage,
    canNextPage: allCanNextPage,
    canPreviousPage: allCanPreviousPage,
    pageOptions: allPageOptions,
    gotoPage: allGotoPage,
    pageCount: allPageCount,
    setPageSize: allSetPageSize,
    state: { pageIndex: allPageIndex, pageSize: allPageSize },
  } = useTable(
    {
      columns,
      data: allTransformedData,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useFilters,
    useGlobalFilter,
    usePagination
  );

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
        if (!response.data.is_adm)
          navigate('/rooms');
        fetchAllBookings(response.data.id);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    const fetchAllBookings = async () => {
      try {
        const response = await api.get('/bookings');
        setAllBookings(response.data);
      } catch (error) {
        console.error("Error fetching all bookings:", error.response.data);
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

      {profile?.is_adm && (
        <>
          <h2>Todas as Reservas</h2>

          <input
            value={allState.globalFilter || ''}
            onChange={e => setAllGlobalFilter(e.target.value || undefined)}
            placeholder={`Buscar por Nome da Sala`}
          />

          <table {...getAllTableProps()}>
            <thead>
              {allHeaderGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getAllTableBodyProps()}>
              {allPage.map(row => {
                prepareAllRow(row);
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
          <div>
            <div>
              <span>
                Página{' '}
                <strong>
                  {allPageIndex + 1} de {allPageOptions.length}
                </strong>
              </span>
              <span>
                | Ir para página:
                <input
                  type="number"
                  defaultValue={allPageIndex + 1}
                  onChange={e => {
                    const page = e.target.value ? Number(e.target.value) - 1 : 0;
                    allGotoPage(page);
                  }}
                  style={{ width: '50px' }}
                />
              </span>
              <select
                value={allPageSize}
                onChange={e => {
                  allSetPageSize(Number(e.target.value));
                }}
              >
                {[10, 20, 30, 40, 50].map(pageSize => (
                  <option key={pageSize} value={pageSize}>
                    Exibir {pageSize}
                  </option>
                ))}
              </select>
              <button onClick={() => allGotoPage(0)} disabled={!allCanPreviousPage}>
                {'<<'}
              </button>
              <button onClick={() => allPreviousPage()} disabled={!allCanPreviousPage}>
                {'<'}
              </button>
              <button onClick={() => allNextPage()} disabled={!allCanNextPage}>
                {'>'}
              </button>
              <button onClick={() => allGotoPage(allPageCount - 1)} disabled={!allCanNextPage}>
                {'>>'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default RoomsAdmin;