
import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Users, Calendar, Phone, MessageSquare, ExternalLink, Edit, Trash2 } from 'lucide-react';
import { formatDate } from '@/utils/formatters';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Booking {
  bookId: string;
  propId: string;
  firstName: string;
  lastName: string;
  dateFrom: string;
  dateTo: string;
  timeCheckIn?: string;
  timeCheckOut?: string;
  status: string;
  channelName: string;
  totalAmount: number;
  adults?: number;
  children?: number;
  phone?: string;
  email?: string;
  whatsapp?: string;
  [key: string]: any;
}

interface BookingCalendarProps {
  bookings: Booking[];
  onEditBooking?: (bookingId: string) => void;
  onCancelBooking?: (bookingId: string) => void;
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

const BookingCalendar: React.FC<BookingCalendarProps> = ({ 
  bookings, 
  onEditBooking,
  onCancelBooking 
}) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const calendarRef = useRef<HTMLDivElement>(null);

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
    const dayNames = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
    return dayNames[dayIndex];
  };

  // Get color for booking status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      case 'maintenance': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  // Get status text in Portuguese
  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmada';
      case 'pending': return 'Pendente';
      case 'cancelled': return 'Cancelada';
      case 'maintenance': return 'Manutenção';
      default: return status;
    }
  };

  // Get channel logo
  const getChannelLogo = (channelName: string) => {
    switch (channelName.toLowerCase()) {
      case 'booking.com':
        return 'https://framerusercontent.com/images/LufDI55ARulWfIEA3s2avmCTt58.png';
      case 'airbnb':
        return 'https://framerusercontent.com/images/WeNZ2R8hNTOTEWb2p4eOaz9Pk0.png';
      case 'google':
        return 'https://framerusercontent.com/images/anqTImRpoTPRVHjXhVpnoNggw.png';
      case 'tripadvisor':
        return 'https://framerusercontent.com/images/I3nRevOxGtaehkwOlGB4ChuVc0s.png';
      case 'hoteis.com':
        return 'https://framerusercontent.com/images/iOohUDOYIlHQujjO2sWkGz1Y.png';
      case 'hostelworld':
        return 'https://framerusercontent.com/images/L0chDi2ow8tyJaMbSOQnMViIFzU.png';
      default:
        return '/lovable-uploads/98072037-459b-4f82-8b51-2e6a6902fafa.png';
    }
  };

  // Format phone number to WhatsApp link
  const formatWhatsAppLink = (phone: string) => {
    // Remove non-numeric characters
    const cleaned = phone.replace(/\D/g, '');
    return `https://wa.me/${cleaned}`;
  };

  // Calculate the width and position of booking bar
  const calculateBookingBarStyle = (booking: Booking) => {
    const startDate = new Date(booking.dateFrom);
    const endDate = new Date(booking.dateTo);
    
    // Check if booking is in current month
    const startInCurrentMonth = startDate.getMonth() === currentMonth && startDate.getFullYear() === currentYear;
    const endInCurrentMonth = endDate.getMonth() === currentMonth && endDate.getFullYear() === currentYear;
    
    // Calculate the start day within this month
    let startDay = startInCurrentMonth ? startDate.getDate() : 1;
    
    // Calculate the end day within this month
    let endDay = endInCurrentMonth ? endDate.getDate() : daysInMonth;
    
    // Calculate the width based on days
    const duration = endDay - startDay;
    
    // Get check-in and check-out times
    const checkInTime = booking.timeCheckIn || '12:00';
    const checkOutTime = booking.timeCheckOut || '14:00';
    
    // Convert time to percentage of day (e.g., 12:00 = 50%)
    const checkInHours = parseInt(checkInTime.split(':')[0]);
    const checkInMinutes = parseInt(checkInTime.split(':')[1]);
    const checkInPercent = (checkInHours * 60 + checkInMinutes) / (24 * 60);
    
    const checkOutHours = parseInt(checkOutTime.split(':')[0]);
    const checkOutMinutes = parseInt(checkOutTime.split(':')[1]);
    const checkOutPercent = (checkOutHours * 60 + checkOutMinutes) / (24 * 60);
    
    // Calculate start offset based on check-in time
    const startOffset = startInCurrentMonth ? checkInPercent : 0;
    
    // Calculate end offset based on check-out time
    const endOffset = endInCurrentMonth ? 1 - checkOutPercent : 0;
    
    // Calculate total width taking into account check-in and check-out times
    const totalDaysWidth = duration + 1 - startOffset - endOffset;
    
    return {
      left: `${(startDay - 1 + startOffset) * 100 / daysInMonth}%`,
      width: `${totalDaysWidth * 100 / daysInMonth}%`,
    };
  };

  // Get the days of the month as an array
  const getDaysArray = () => {
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  // Check if a date is today
  const isToday = (day: number) => {
    const now = new Date();
    return day === now.getDate() && currentMonth === now.getMonth() && currentYear === now.getFullYear();
  };

  // Check if a date is a weekend
  const isWeekend = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // 0 is Sunday, 6 is Saturday
  };

  // Get property name by ID
  const getPropertyName = (propId: string) => {
    switch (propId) {
      case '1001': return 'Apartamento Luxo Centro';
      case '1002': return 'Casa de Praia Premium';
      case '1003': return 'Chalé na Montanha';
      case '1004': return 'Hotel Central - Standard';
      case '1005': return 'Hotel Central - Suíte Luxo';
      case '1006': return 'Hostel Backpackers';
      default: return `Propriedade ${propId}`;
    }
  };

  // Get unique property IDs from bookings
  const propertyIds = Object.keys(groupedBookings);
  const days = getDaysArray();

  return (
    <div className="p-2 md:p-6" ref={calendarRef}>
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
          {/* Days of the month header */}
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div className="flex">
              {/* Property column */}
              <div className="w-40 flex-shrink-0 p-2 bg-gray-50 font-medium text-xs text-gray-500 border-r border-gray-200">
                Propriedade
              </div>
              
              {/* Days columns */}
              <div className="flex-grow grid grid-cols-31 border-b border-gray-200">
                {days.map((day) => (
                  <div
                    key={day}
                    className={`text-center py-2 text-xs font-medium 
                      ${isToday(day) ? 'bg-blue-50 text-blue-700' : 
                        isWeekend(day) ? 'bg-gray-50 text-gray-700' : 'text-gray-600'}`}
                  >
                    <div>{day}</div>
                    <div>{getDayOfWeekName(new Date(currentYear, currentMonth, day).getDay())}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Property rows */}
          {propertyIds.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {propertyIds.map((propId) => (
                <div key={propId} className="flex border rounded-lg overflow-hidden">
                  {/* Property name */}
                  <div className="w-40 flex-shrink-0 p-3 bg-white font-medium border-r border-gray-200">
                    {getPropertyName(propId)}
                  </div>
                  
                  {/* Booking timeline */}
                  <div className="flex-grow relative bg-white min-h-[80px]">
                    {/* Grid lines for days */}
                    <div className="grid grid-cols-31 h-full absolute inset-0">
                      {days.map((day) => (
                        <div
                          key={day}
                          className={`border-l border-gray-100 h-full
                            ${isToday(day) ? 'bg-blue-50' : 
                              isWeekend(day) ? 'bg-gray-50' : ''}`}
                        />
                      ))}
                    </div>
                    
                    {/* Booking bars */}
                    <div className="relative h-full p-2">
                      {groupedBookings[propId].map((booking) => {
                        const barStyle = calculateBookingBarStyle(booking);
                        return (
                          <Popover key={booking.bookId}>
                            <PopoverTrigger asChild>
                              <div
                                className={`absolute h-10 rounded-md ${getStatusColor(booking.status)} text-white text-xs cursor-pointer
                                  hover:brightness-90 transition-all duration-200 flex items-center px-2 overflow-hidden`}
                                style={barStyle}
                              >
                                <div className="truncate whitespace-nowrap">
                                  {booking.firstName} {booking.lastName}
                                </div>
                              </div>
                            </PopoverTrigger>
                            <PopoverContent 
                              className="w-72 p-0 shadow-lg rounded-lg border border-gray-200"
                              side="bottom"
                              align="start"
                            >
                              <div className={`p-3 ${getStatusColor(booking.status)} text-white`}>
                                <div className="text-lg font-semibold">{booking.firstName} {booking.lastName}</div>
                                <div className="text-sm opacity-90">
                                  {getStatusText(booking.status)} • {booking.channelName}
                                </div>
                              </div>
                              <div className="p-4 space-y-3">
                                <div className="flex items-start gap-2">
                                  <Calendar size={18} className="mt-0.5 text-gray-500" />
                                  <div>
                                    <div className="font-medium text-sm">Check-in/Check-out</div>
                                    <div className="text-sm text-gray-600">
                                      {formatDate(booking.dateFrom)} às {booking.timeCheckIn || '12:00'} - 
                                      {formatDate(booking.dateTo)} às {booking.timeCheckOut || '14:00'}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-start gap-2">
                                  <Users size={18} className="mt-0.5 text-gray-500" />
                                  <div>
                                    <div className="font-medium text-sm">Hóspedes</div>
                                    <div className="text-sm text-gray-600">
                                      {booking.adults || 1} adulto{booking.adults !== 1 ? 's' : ''}
                                      {booking.children ? `, ${booking.children} criança${booking.children !== 1 ? 's' : ''}` : ''}
                                    </div>
                                  </div>
                                </div>
                                
                                {booking.phone && (
                                  <div className="flex items-start gap-2">
                                    <Phone size={18} className="mt-0.5 text-gray-500" />
                                    <div>
                                      <div className="font-medium text-sm">Telefone</div>
                                      <div className="text-sm text-gray-600">{booking.phone}</div>
                                    </div>
                                  </div>
                                )}
                                
                                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                                  {booking.whatsapp && (
                                    <a 
                                      href={formatWhatsAppLink(booking.whatsapp)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 transition-colors"
                                    >
                                      <MessageSquare size={16} />
                                      <span>WhatsApp</span>
                                    </a>
                                  )}
                                  
                                  <a 
                                    href={`/admin/bookings/${booking.bookId}`}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors"
                                  >
                                    <ExternalLink size={16} />
                                    <span>Detalhes</span>
                                  </a>
                                </div>
                                
                                <div className="flex gap-2">
                                  {onEditBooking && (
                                    <button 
                                      onClick={() => onEditBooking(booking.bookId)}
                                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors"
                                    >
                                      <Edit size={16} />
                                      <span>Editar</span>
                                    </button>
                                  )}
                                  
                                  {onCancelBooking && booking.status !== 'cancelled' && (
                                    <button 
                                      onClick={() => onCancelBooking(booking.bookId)}
                                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 rounded-md text-sm hover:bg-red-100 transition-colors"
                                    >
                                      <Trash2 size={16} />
                                      <span>Cancelar</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
          <span className="text-sm text-gray-600">Manutenção</span>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;
