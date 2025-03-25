
// Format currency values
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

// Format date to Brazilian format
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR').format(date);
};

// Format date to yyyy-mm-dd
export const formatDateISO = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Get current month name in Portuguese
export const getCurrentMonthName = (): string => {
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 
    'Maio', 'Junho', 'Julho', 'Agosto', 
    'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  const currentDate = new Date();
  return monthNames[currentDate.getMonth()];
};

// Get current year
export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

// Format booking status in Portuguese
export const formatBookingStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'confirmed': 'Confirmada',
    'cancelled': 'Cancelada',
    'pending': 'Pendente',
    'inquiry': 'Consulta',
    'denied': 'Negada'
  };
  
  return statusMap[status] || status;
};

// Get channel logo URL by name
export const getChannelLogo = (channelName: string): string => {
  const channelMap: Record<string, string> = {
    'Airbnb': 'https://placehold.co/20x20/FF5A5F/fff?text=A',
    'Booking.com': 'https://placehold.co/20x20/003580/fff?text=B',
    'Expedia': 'https://placehold.co/20x20/FFD700/000?text=E',
    'Direto': 'https://placehold.co/20x20/00A699/fff?text=D'
  };
  
  return channelMap[channelName] || 'https://placehold.co/20x20/888/fff?text=?';
};

// Truncate text with ellipsis
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

// Generate random color for charts
export const getRandomColor = (): string => {
  const colors = [
    '#0EA5E9', '#10B981', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#EC4899', '#0891B2', '#4F46E5'
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
};
