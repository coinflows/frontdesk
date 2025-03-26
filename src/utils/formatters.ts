
// Formatação de dados para exibição na UI

import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Formatação de moeda em Real (BRL)
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Formatação de data para o formato brasileiro (DD/MM/YYYY)
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = parseISO(dateString);
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

// Formatação de data e hora para o formato brasileiro
export const formatDateTime = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = parseISO(dateString);
    return format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR });
  } catch (error) {
    console.error('Error formatting date and time:', error);
    return dateString;
  }
};

// Obtém o nome do mês atual
export const getCurrentMonthName = (): string => {
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return monthNames[new Date().getMonth()];
};

// Obtém o URL do logo do canal de reserva
export const getChannelLogo = (channelName: string): string => {
  if (!channelName) return '';
  
  switch (channelName.toLowerCase()) {
    case 'booking.com':
      return 'https://framerusercontent.com/images/LufDI55ARulWfIEA3s2avmCTt58.png';
    case 'airbnb':
      return 'https://framerusercontent.com/images/WeNZ2R8hNTOTEWb2p4eOaz9Pk0.png';
    case 'google':
    case 'google ads':
      return 'https://framerusercontent.com/images/anqTImRpoTPRVHjXhVpnoNggw.png';
    case 'tripadvisor':
      return 'https://framerusercontent.com/images/I3nRevOxGtaehkwOlGB4ChuVc0s.png';
    case 'hoteis.com':
      return 'https://framerusercontent.com/images/iOohUDOYIlHQujjO2sWkGz1Y.png';
    case 'hostelworld':
      return 'https://framerusercontent.com/images/L0chDi2ow8tyJaMbSOQnMViIFzU.png';
    case 'expedia':
      return 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Expedia_2012_logo.svg';
    case 'direto':
      return 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://frontdesk.com.br/&size=64';
    default:
      return '/lovable-uploads/98072037-459b-4f82-8b51-2e6a6902fafa.png';
  }
};

// Formata um nome para um slug amigável para URL
export const formatSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Formata número de telefone para WhatsApp (remove caracteres não numéricos)
export const formatWhatsAppNumber = (phone: string): string => {
  if (!phone) return '';
  
  // Remove todos os caracteres não numéricos
  return phone.replace(/\D/g, '');
};
