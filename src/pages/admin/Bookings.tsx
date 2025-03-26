
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Search, RefreshCw, Eye, Calendar, User, Filter } from 'lucide-react';
import { formatCurrency, formatDate, getChannelLogo } from '../../utils/formatters';
import { useAuth } from '@/hooks/useAuth';
import { getBookings } from '@/services/api';
import { toast } from '@/components/ui/use-toast';
import BookingCalendar from '@/components/booking/BookingCalendar';

const Bookings = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar');

  const fetchBookings = async () => {
    if (!user?.token) {
      toast({
        title: "Erro",
        description: "Token de API não encontrado",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await getBookings(user.token);
      if (result.success && result.data) {
        setBookings(result.data);
      } else {
        toast({
          title: "Erro",
          description: "Falha ao carregar reservas",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast({
        title: "Erro",
        description: "Falha ao carregar reservas",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user?.token]);

  const filteredBookings = bookings.filter(
    booking =>
      booking.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.bookId.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-2xl font-bold text-gray-900 font-sora">Reservas</h1>
          <div className="mt-4 flex items-center gap-3 sm:mt-0">
            <div className="flex rounded-md shadow-sm">
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  viewMode === 'calendar'
                    ? 'bg-frontdesk-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } rounded-l-md border border-gray-300`}
                onClick={() => setViewMode('calendar')}
              >
                <Calendar size={16} className="mr-1 inline-block" />
                <span>Calendário</span>
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  viewMode === 'list'
                    ? 'bg-frontdesk-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } rounded-r-md border border-l-0 border-gray-300`}
                onClick={() => setViewMode('list')}
              >
                <Filter size={16} className="mr-1 inline-block" />
                <span>Lista</span>
              </button>
            </div>
            
            <button
              className="btn-primary flex items-center gap-2"
              onClick={fetchBookings}
              disabled={isLoading}
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              <span>{isLoading ? 'Atualizando...' : 'Atualizar'}</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="input-control pl-10 w-full"
            placeholder="Buscar reservas por nome, ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <BookingCalendar bookings={filteredBookings} />
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
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
                  <tr key={booking.bookId} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {booking.bookId}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {booking.propertyName || `Propriedade ${booking.propId}`}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <User size={14} className="mr-1" />
                        {booking.firstName} {booking.lastName}
                        <span className="ml-1 text-xs text-gray-400">
                          ({booking.adults + (booking.children || 0)} pax)
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        <div>
                          <div>{formatDate(booking.dateFrom)}</div>
                          <div>{formatDate(booking.dateTo)}</div>
                          <div className="text-xs text-gray-400">
                            {
                              // Calculate nights
                              Math.ceil(
                                (new Date(booking.dateTo).getTime() - new Date(booking.dateFrom).getTime()) / 
                                (1000 * 60 * 60 * 24)
                              )
                            } noites
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
                          src={getChannelLogo(booking.channelName)}
                          alt={booking.channelName}
                          className="mr-2 h-5 w-5 rounded-full"
                        />
                        {booking.channelName}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{formatCurrency(booking.totalAmount)}</div>
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
        )}
      </div>
    </DashboardLayout>
  );
};

export default Bookings;
