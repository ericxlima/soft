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
  Form,
  LabelInputPair,
  StyledInput,
  ErrorMessage,
  TableStyles,
  PaginationControls
} from './styles';


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
        Cell: ({ row }) => (
          <select
            value={row.original.status}
            onChange={e => handleStatusChange(row.original.id, e.target.value)}
          >
            <option value="REQUESTED">REQUESTED</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
        )
      },
      {
        Header: 'Ação',
        accessor: 'apply',
        Cell: ({ row }) => (
          <button onClick={() => handleApplyClick(row.original.id)}>
            Aplicar
          </button>
        )
      }
    ],
    []
  );

  let allTransformedData = useMemo(() => {
    console.log(allBookings)
    return allBookings.map(booking => {
      const room = rooms.find(r => r.id === booking.roomId);
      return { ...booking, roomName: room ? room.name : 'Sala não encontrada' };
    });
  }, [allBookings]);


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
    fetchAllBookings();

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

  function backPage() {
    navigate('/');
  }

  const handleStatusChange = async (bookingId, newStatus) => {
    // Faça a requisição apropriada baseada no novo status.
    try {
        let response;
        if (newStatus === "APPROVED") {
            response = await api.post(`bookings/reservas/${bookingId}/aprovar`);
        } else if (newStatus === "REJECTED") {
            response = await api.post(`bookings/reservas/${bookingId}/rejeitar`);
        } else {
            return;
        }
        const updatedBooking = response.data;
        setAllBookings(prevBookings => 
            prevBookings.map(booking => 
                booking.id === updatedBooking.id ? updatedBooking : booking
            )
        );

    } catch (error) {
        console.error("Erro ao atualizar status da reserva:", error);
    }
};


  const handleApplyClick = (bookingId) => {
    console.log(`Apply changes for Booking ID: ${bookingId}`);
  };

  useEffect(() => {
    console.log("allBookings changed:", allBookings);
  }, [allBookings]);
  

  return (
    <Container>
      <h1>Reserva de Salas</h1>
      <StyledButton onClick={backPage}>Voltar</StyledButton>

      {profile && (
        <ProfileInfo>
          <h3>Nome: {profile.username}</h3>
          <h3>Cargo: {profile.is_adm ? 'Administrador' : 'Aluno'}</h3>

          {profile.is_adm && (
            <>
              <SectionTitle>Cadastrar uma Nova Sala</SectionTitle>
              <Form onSubmit={handleCreateRoom}>
                <LabelInputPair>
                  <label>Nome:</label>
                  <StyledInput
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nome da sala"
                    required
                  />
                </LabelInputPair>
                <LabelInputPair>
                  <label>Capacidade:</label>
                  <StyledInput
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder="Capacidade"
                    required
                  />
                </LabelInputPair>
                <StyledButton type="submit">Criar</StyledButton>
              </Form>
              {submitError && <ErrorMessage>{submitError}</ErrorMessage>}
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

      {profile?.is_adm && (
        <TableStyles>
          <SectionTitle>Todas as Reservas</SectionTitle>

          <StyledInput
            value={allState.globalFilter || ''}
            onChange={e => setAllGlobalFilter(e.target.value || undefined)}
            placeholder="Buscar por Nome da Sala"
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

          <PaginationControls>
            <span>
              Página
              <strong>
                {allPageIndex + 1} de {allPageOptions.length}
              </strong>
            </span>

            <span>
              Ir para página:
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

            <StyledButton onClick={() => allGotoPage(0)} disabled={!allCanPreviousPage}>
              {'<<'}
            </StyledButton>
            <StyledButton onClick={() => allPreviousPage()} disabled={!allCanPreviousPage}>
              {'<'}
            </StyledButton>
            <StyledButton onClick={() => allNextPage()} disabled={!allCanNextPage}>
              {'>'}
            </StyledButton>
            <StyledButton onClick={() => allGotoPage(allPageCount - 1)} disabled={!allCanNextPage}>
              {'>>'}
            </StyledButton>
          </PaginationControls>
        </TableStyles>
      )}
    </Container>
  );
}

export default RoomsAdmin;
