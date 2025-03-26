
// Format a number as currency (BRL)
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Format a date string to dd/mm/yyyy
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) return dateString;
  
  return date.toLocaleDateString('pt-BR');
};

// Get current year
export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

// Get current month name
export const getCurrentMonthName = (): string => {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  return months[new Date().getMonth()];
};

// Get channel logo based on channel name
export const getChannelLogo = (channelName: string): string => {
  const logos: Record<string, string> = {
    'Booking.com': 'https://framerusercontent.com/images/LufDI55ARulWfIEA3s2avmCTt58.png',
    'Airbnb': 'https://framerusercontent.com/images/WeNZ2R8hNTOTEWb2p4eOaz9Pk0.png',
    'Google': 'https://framerusercontent.com/images/anqTImRpoTPRVHjXhVpnoNggw.png',
    'TripAdvisor': 'https://framerusercontent.com/images/I3nRevOxGtaehkwOlGB4ChuVc0s.png',
    'Hotels.com': 'https://framerusercontent.com/images/iOohUDOYIlHQujjO2sWkGz1Y.png',
    'HostelWorld': 'https://framerusercontent.com/images/L0chDi2ow8tyJaMbSOQnMViIFzU.png',
  };
  
  // Default to a placeholder if the channel logo isn't found
  return logos[channelName] || 'https://placehold.co/32x32?text=' + channelName.charAt(0);
};
