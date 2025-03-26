
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';
import { formatDate } from '@/utils/formatters';

interface Booking {
  bookId: string;
  propId: string;
  firstName: string;
  lastName: string;
  dateFrom: string;
  dateTo: string;
  status: string;
  channelName: string;
  totalAmount: number;
  [key: string]: any;
}

interface BookingCalendarProps {
  bookings: Booking[];
}

// Function to group bookings by property
const groupBookingsByProperty = (bookings: Booking[]) => {
  return bookings.reduce((acc, booking) => {
    if (!acc[booking.propId]) {
      acc[booking.propId] = [];
    }
    acc[booking.propId].push(booking);
    return acc;
  }, {} as Record<string, Booking[]>);
};

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const BookingCalendar: React.FC<BookingCalendarProps> = ({ bookings }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const groupedBookings = groupBookingsByProperty(bookings);

  // Get month name in Portuguese
  const getMonthName = (month: number) => {
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return monthNames[month];
  };

  // Get day of week name in Portuguese
  const getDayOfWeekName = (dayIndex: number) => {
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return dayNames[dayIndex];
  };

  // Function to check if a booking overlaps with a specific day
  const bookingOverlapsWithDay = (booking: Booking, day: number) => {
    const checkDate = new Date(currentYear, currentMonth, day);
    const fromDate = new Date(booking.dateFrom);
    const toDate = new Date(booking.dateTo);
    
    return checkDate >= fromDate && checkDate < toDate;
  };

  // Get bookings for a specific day
  const getBookingsForDay = (propId: string, day: number) => {
    if (!groupedBookings[propId]) return [];
    
    return groupedBookings[propId].filter(booking => 
      bookingOverlapsWithDay(booking, day)
    );
  };

  // Get color for booking status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  // Get unique property IDs from bookings
  const propertyIds = Object.keys(groupedBookings);

  return (
    <div className="p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold font-sora">
          {getMonthName(currentMonth)} {currentYear}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => {
              setCurrentMonth(today.getMonth());
              setCurrentYear(today.getFullYear());
            }}
            className="px-3 py-1 text-sm bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Hoje
          </button>
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Day Headers */}
          <div className="grid grid-cols-8 gap-1 mb-2">
            <div className="p-2 bg-gray-50 font-medium text-xs text-gray-500 rounded">
              Propriedade
            </div>
            {Array.from({ length: 7 }, (_, i) => (
              <div 
                key={i} 
                className="p-2 bg-gray-50 font-medium text-center text-xs text-gray-500 rounded"
              >
                {getDayOfWeekName(i)}
              </div>
            ))}
          </div>

          {/* Calendar Rows */}
          {propertyIds.length > 0 ? (
            propertyIds.map(propId => (
              <React.Fragment key={propId}>
                {/* Week rows for this property */}
                {Array.from({ length: Math.ceil((daysInMonth + firstDay) / 7) }, (_, weekIndex) => {
                  const startDay = weekIndex * 7 - firstDay + 1;
                  const weekDays = Array.from({ length: 7 }, (_, dayIndex) => {
                    const day = startDay + dayIndex;
                    return day > 0 && day <= daysInMonth ? day : null;
                  });

                  // Skip rendering this week row if there are no bookings on any day
                  const hasBookingsThisWeek = weekDays.some(day => 
                    day !== null && getBookingsForDay(propId, day).length > 0
                  );

                  if (!hasBookingsThisWeek && weekIndex > 0) return null;

                  return (
                    <div key={`${propId}-week-${weekIndex}`} className="grid grid-cols-8 gap-1 mb-1">
                      {/* Property name, only on first week */}
                      {weekIndex === 0 && (
                        <div 
                          className="row-span-1 p-2 bg-white rounded shadow-sm border border-gray-100 flex items-center"
                          style={{ gridRow: `span ${Math.ceil((daysInMonth + firstDay) / 7)}` }}
                        >
                          <span className="text-sm font-medium truncate">
                            {propId === '1001' ? 'Apartamento Luxo Centro' :
                             propId === '1002' ? 'Casa de Praia Premium' :
                             propId === '1003' ? 'Studio Moderno' :
                             propId === '1004' ? 'Chalé na Montanha' :
                             propId === '1005' ? 'Hotel Central - Suíte Luxo' :
                             propId === '1006' ? 'Hostel Backpackers' :
                             `Propriedade ${propId}`}
                          </span>
                        </div>
                      )}

                      {/* Days of the week */}
                      {weekDays.map((day, dayIndex) => (
                        <div 
                          key={`${propId}-day-${day}-${dayIndex}`} 
                          className={`p-2 rounded min-h-[70px] ${
                            day === null ? 'bg-transparent' : 
                            day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear() 
                              ? 'bg-blue-50 border border-blue-200' 
                              : 'bg-white border border-gray-100'
                          }`}
                        >
                          {day !== null && (
                            <>
                              <div className="text-xs text-gray-500 mb-1">{day}</div>
                              {/* Bookings for this day */}
                              {getBookingsForDay(propId, day).map(booking => (
                                <div 
                                  key={`${booking.bookId}-${day}`} 
                                  className={`mb-1 p-1 rounded text-white text-xs ${getStatusColor(booking.status)}`}
                                  title={`${booking.firstName} ${booking.lastName} - Check-in: ${formatDate(booking.dateFrom)}, Check-out: ${formatDate(booking.dateTo)}`}
                                >
                                  <div className="flex items-center">
                                    <User size={10} className="mr-1" />
                                    <span className="truncate">{booking.firstName} {booking.lastName}</span>
                                  </div>
                                </div>
                              ))}
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </React.Fragment>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">
              Nenhuma reserva encontrada
            </div>
          )}
        </div>
      </div>

      {/* Calendar Legend */}
      <div className="mt-6 flex items-center space-x-4">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span className="text-sm text-gray-600">Confirmada</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
          <span className="text-sm text-gray-600">Pendente</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <span className="text-sm text-gray-600">Cancelada</span>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;
