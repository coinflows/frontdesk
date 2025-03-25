
import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Search, RefreshCw, Eye, Calendar, User } from 'lucide-react';
import { formatCurrency, formatDate, getChannelLogo } from '../../utils/formatters';

const Bookings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // In a real app, this would come from an API
  const bookings = [
    {
      id: 'B1001',
      propertyName: 'Apartamento Luxo Centro',
      propertyId: '1001',
      guest: 'João Silva',
      checkin: '2023-12-10',
      checkout: '2023-12-15',
      nights: 5,
      guests: 2,
      status: 'confirmed',
      channel: 'Airbnb',
      totalAmount: 1250.0,
      commission: 187.5,
      netAmount: 1062.5,
    },
    {
      id: 'B1002',
      propertyName: 'Casa de Praia Premium',
      propertyId: '1002',
      guest: 'Maria Santos',
      checkin: '2023-12-20',
      checkout: '2023-12-27',
      nights: 7,
      guests: 4,
      status: 'confirmed',
      channel: 'Booking.com',
      totalAmount: 3080.0,
      commission: 462.0,
      netAmount: 2618.0,
    },
    {
      id: 'B1003',
      propertyName: 'Studio Moderno',
      propertyId: '1003',
      guest: 'Pedro Ferreira',
      checkin: '2023-12-05',
      checkout: '2023-12-08',
      nights: 3,
      guests: 1,
      status: 'confirmed',
      channel: 'Direto',
      totalAmount: 720.0,
      commission: 0,
      netAmount: 720.0,
    },
    {
      id: 'B1004',
      propertyName: 'Chalé na Montanha',
      propertyId: '1004',
      guest: 'Roberto Almeida',
      checkin: '2023-12-24',
      checkout: '2023-12-28',
      nights: 4,
      guests: 5,
      status: 'confirmed',
      channel: 'Airbnb',
      totalAmount: 1600.0,
      commission: 240.0,
      netAmount: 1360.0,
    }
  ];

  const filteredBookings = bookings.filter(
    booking =>
      booking.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRefresh = () => {
    setIsLoading(true);
    // In a real app, this would be an API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'confirmed':
        return 'badge-green';
      case 'cancelled':
        return 'badge-red';
      case 'pending':
        return 'badge-yellow';
      default:
        return 'badge-blue';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'confirmed':
        return 'Confirmada';
      case 'cancelled':
        return 'Cancelada';
      case 'pending':
        return 'Pendente';
      default:
        return status;
    }
  };

  return (
    <DashboardLayout adminOnly>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Reservas</h1>
          <button
            className="btn-primary mt-4 flex items-center gap-2 sm:mt-0"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            <span>{isLoading ? 'Atualizando...' : 'Atualizar Reservas'}</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="input-control pl-10 w-full"
              placeholder="Buscar reservas..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="input-control sm:w-48">
            <option value="all">Todos status</option>
            <option value="confirmed">Confirmadas</option>
            <option value="pending">Pendentes</option>
            <option value="cancelled">Canceladas</option>
          </select>
        </div>

        {/* Bookings Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Reserva
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Propriedade
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Hóspede
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Check-in / Check-out
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Canal
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Valor
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {booking.id}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {booking.propertyName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <User size={14} className="mr-1" />
                      {booking.guest}
                      <span className="ml-1 text-xs text-gray-400">
                        ({booking.guests} pax)
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      <div>
                        <div>{formatDate(booking.checkin)}</div>
                        <div>{formatDate(booking.checkout)}</div>
                        <div className="text-xs text-gray-400">
                          {booking.nights} noites
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span className={`badge ${getStatusColor(booking.status)}`}>
                      {getStatusText(booking.status)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <img
                        src={getChannelLogo(booking.channel)}
                        alt={booking.channel}
                        className="mr-2 h-5 w-5 rounded-full"
                      />
                      {booking.channel}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{formatCurrency(booking.totalAmount)}</div>
                      <div className="text-xs text-gray-500">
                        Taxa: {formatCurrency(booking.commission)}
                      </div>
                      <div className="text-xs text-green-600">
                        Líquido: {formatCurrency(booking.netAmount)}
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button
                      className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-frontdesk-600"
                      title="Ver detalhes"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                    Nenhuma reserva encontrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Bookings;
