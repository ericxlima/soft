import React, { useState, useEffect, useMemo } from 'react';
import api from '../../services/api';
import RoomCard from '../../components/RoomCard';
import { useNavigate } from 'react-router-dom';

import { useTable, useFilters, useGlobalFilter, usePagination } from 'react-table';

import {
  Container,
  StyledButton,
  ProfileInfo,
  SectionTitle,
  LabelInputPair,
  StyledInput,
  TableStyles,
  PaginationControls
} from './styles';


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
      return { ...booking, roomName: room ? room.name : 'Sala não encontrada' };
    });
  }, [userBookings, rooms]);

  const {
    getTableProps,
    getTableBodyProps,
    prepareRow,
    headerGroups,
    setGlobalFilter,
    state,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    pageCount,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: transformedData,
      initialState: { pageIndex: 0, pageSize: 2 },
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
        if (response.data.is_adm)
          navigate('/roomsAdmin');
        fetchUserBookings(response.data.id);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    const fetchUserBookings = async (userId) => {
      try {
        const response = await api.get('/bookings/user/' + userId);
        setUserBookings(response.data);
      } catch (error) {
        console.error("Error fetching user bookings:", error.response.data);
      }
    };

    fetchRooms();
    fetchProfile();

  }, []);

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
    <Container>
      <h1>Reserva de Salas</h1>
      <StyledButton onClick={backPage}>Voltar</StyledButton>

      {profile && (
        <ProfileInfo>
          <h3>Nome: {profile.username}</h3>
          <h3>Cargo: {profile.is_adm ? 'Administrador' : 'Aluno'}</h3>

          {!profile.is_adm && (
            <>
              <SectionTitle>Selecione Data e Horário para Reserva de Sala:</SectionTitle>
              <LabelInputPair>
                <label>Data Inicial:</label>
                <StyledInput type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
              </LabelInputPair>
              <LabelInputPair>
                <label>Hora Inicial:</label>
                <StyledInput type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required />
              </LabelInputPair>
              <LabelInputPair>
                <label>Data Final:</label>
                <StyledInput type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
              </LabelInputPair>
              <LabelInputPair>
                <label>Hora Final:</label>
                <StyledInput type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required />
              </LabelInputPair>
              <StyledButton onClick={handleBookRoom}>Ver Disponibilidade de Horários</StyledButton>
              <p><b>{availabilityMessage}</b></p>
            </>
          )}
        </ProfileInfo>
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
        <TableStyles>
          <SectionTitle>Minhas Reservas</SectionTitle>

          <StyledInput
            value={state.globalFilter || ''}
            onChange={e => setGlobalFilter(e.target.value || undefined)}
            placeholder="Buscar por Nome da Sala"
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
              {page.map(row => {
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

          <PaginationControls>
            <span>
              Página
              <strong>
                {pageIndex + 1} de {pageOptions.length}
              </strong>
            </span>

            <span>
              Ir para página:
              <input
                type="number"
                defaultValue={pageIndex + 1}
                onChange={e => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  gotoPage(page);
                }}
                style={{ width: '50px' }}
              />
            </span>

            <select
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
              }}
            >
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Exibir {pageSize}
                </option>
              ))}
            </select>

            <StyledButton onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
              {'<<'}
            </StyledButton>
            <StyledButton onClick={() => previousPage()} disabled={!canPreviousPage}>
              {'<'}
            </StyledButton>
            <StyledButton onClick={() => nextPage()} disabled={!canNextPage}>
              {'>'}
            </StyledButton>
            <StyledButton onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
              {'>>'}
            </StyledButton>
          </PaginationControls>
        </TableStyles>
      )}
    </Container>
  );
}

export default Rooms;
