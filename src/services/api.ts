
// API service for Beds24 integration

const API_BASE_URL = 'https://beds24.com/api/v2';

// Mock API responses for development
const mockResponses = {
  properties: [
    { 
      propId: '1001',
      name: 'Apartamento Luxo Centro',
      address: 'Av Paulista, 1000',
      city: 'São Paulo',
      images: ['https://placehold.co/600x400?text=Apartamento+1'],
      maxGuests: 4
    },
    { 
      propId: '1002',
      name: 'Casa de Praia Premium',
      address: 'Rua da Praia, 123',
      city: 'Florianópolis',
      images: ['https://placehold.co/600x400?text=Casa+Praia'],
      maxGuests: 6
    },
    { 
      propId: '1003',
      name: 'Studio Moderno',
      address: 'Rua Augusta, 500',
      city: 'São Paulo',
      images: ['https://placehold.co/600x400?text=Studio'],
      maxGuests: 2
    }
  ],
  bookings: [
    {
      bookId: 'B1001',
      propId: '1001',
      firstName: 'João',
      lastName: 'Silva',
      adults: 2,
      children: 0,
      dateFrom: '2023-12-10',
      dateTo: '2023-12-15',
      status: 'confirmed',
      totalAmount: 800,
      channelName: 'Airbnb'
    },
    {
      bookId: 'B1002',
      propId: '1002',
      firstName: 'Maria',
      lastName: 'Santos',
      adults: 4,
      children: 2,
      dateFrom: '2023-12-20',
      dateTo: '2023-12-27',
      status: 'confirmed',
      totalAmount: 1500,
      channelName: 'Booking.com'
    },
    {
      bookId: 'B1003',
      propId: '1003',
      firstName: 'Pedro',
      lastName: 'Ferreira',
      adults: 1,
      children: 0,
      dateFrom: '2023-12-05',
      dateTo: '2023-12-08',
      status: 'confirmed',
      totalAmount: 450,
      channelName: 'Direto'
    }
  ],
  users: [
    {
      id: '101',
      name: 'Carlos Oliveira',
      email: 'carlos@example.com',
      properties: ['1001']
    },
    {
      id: '102',
      name: 'Ana Costa',
      email: 'ana@example.com',
      properties: ['1002', '1003']
    }
  ]
};

// Helper to simulate API delay
const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Validate token with API
export const validateToken = async (token: string) => {
  try {
    // In a real implementation, this would be a real API call
    await simulateDelay(1000);
    
    // For demo purposes, accept a specific token as valid
    const validToken = "U51gBw5Si1hKKHk78czHCNpysUX/5/zGupZAaLjImfYctuc9eFoIlVBUFrpX9PBJU4uNj+koeqJA+FuvhRu9DFKPHzrs+BEOMX/pT+zruycX+zkjwaeovrPTvDO3vPBF6kwDSpQ8TT/4uff/+lc/LUPiaxqLa+4cIP+HWZvx9Eo=";
    
    if (token === validToken) {
      return { success: true, data: mockResponses.properties };
    } else {
      return { success: false, error: 'Token inválido ou sem permissão' };
    }
  } catch (error) {
    console.error('Error validating token:', error);
    return { success: false, error: 'Erro ao validar token' };
  }
};

// Get properties
export const getProperties = async (token: string) => {
  try {
    await simulateDelay();
    return { success: true, data: mockResponses.properties };
  } catch (error) {
    console.error('Error fetching properties:', error);
    return { success: false, error: 'Erro ao buscar propriedades' };
  }
};

// Get bookings
export const getBookings = async (token: string, propId?: string) => {
  try {
    await simulateDelay();
    let bookings = mockResponses.bookings;
    
    if (propId) {
      bookings = bookings.filter(booking => booking.propId === propId);
    }
    
    return { success: true, data: bookings };
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return { success: false, error: 'Erro ao buscar reservas' };
  }
};

// Get users (admin only)
export const getUsers = async (token: string) => {
  try {
    await simulateDelay();
    return { success: true, data: mockResponses.users };
  } catch (error) {
    console.error('Error fetching users:', error);
    return { success: false, error: 'Erro ao buscar usuários' };
  }
};

// Create user (admin only)
export const createUser = async (token: string, userData: any) => {
  try {
    await simulateDelay(1000);
    // In a real implementation, this would create a user via the API
    const newUser = {
      id: `10${mockResponses.users.length + 1}`,
      ...userData,
      properties: []
    };
    
    return { success: true, data: newUser };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, error: 'Erro ao criar usuário' };
  }
};

// Create booking
export const createBooking = async (token: string, bookingData: any) => {
  try {
    await simulateDelay(1000);
    // In a real implementation, this would create a booking via the API
    const newBooking = {
      bookId: `B${1000 + mockResponses.bookings.length + 1}`,
      status: 'confirmed',
      ...bookingData
    };
    
    return { success: true, data: newBooking };
  } catch (error) {
    console.error('Error creating booking:', error);
    return { success: false, error: 'Erro ao criar reserva' };
  }
};

// Get availability
export const getAvailability = async (token: string, propId: string, dateFrom: string, dateTo: string) => {
  try {
    await simulateDelay();
    // Mock availability data - in a real implementation this would come from the API
    const availability = {
      propId,
      dateFrom,
      dateTo,
      days: [
        { date: '2023-12-10', available: true, price: 200 },
        { date: '2023-12-11', available: true, price: 200 },
        { date: '2023-12-12', available: true, price: 200 },
        { date: '2023-12-13', available: true, price: 200 },
        { date: '2023-12-14', available: true, price: 200 },
        { date: '2023-12-15', available: false, price: 200 },
        { date: '2023-12-16', available: false, price: 200 },
        { date: '2023-12-17', available: true, price: 220 },
        { date: '2023-12-18', available: true, price: 220 },
        { date: '2023-12-19', available: true, price: 220 },
        { date: '2023-12-20', available: true, price: 250 },
      ]
    };
    
    return { success: true, data: availability };
  } catch (error) {
    console.error('Error fetching availability:', error);
    return { success: false, error: 'Erro ao buscar disponibilidade' };
  }
};

// Set availability
export const setAvailability = async (token: string, propId: string, dates: any[]) => {
  try {
    await simulateDelay(1000);
    // In a real implementation, this would update availability via the API
    return { success: true, message: 'Disponibilidade atualizada com sucesso' };
  } catch (error) {
    console.error('Error setting availability:', error);
    return { success: false, error: 'Erro ao atualizar disponibilidade' };
  }
};

// Get prices
export const getPrices = async (token: string, propId: string, dateFrom: string, dateTo: string) => {
  try {
    await simulateDelay();
    // Mock price data - in a real implementation this would come from the API
    const prices = {
      propId,
      dateFrom,
      dateTo,
      days: [
        { date: '2023-12-10', price: 200 },
        { date: '2023-12-11', price: 200 },
        { date: '2023-12-12', price: 200 },
        { date: '2023-12-13', price: 200 },
        { date: '2023-12-14', price: 200 },
        { date: '2023-12-15', price: 250 },
        { date: '2023-12-16', price: 250 },
        { date: '2023-12-17', price: 220 },
        { date: '2023-12-18', price: 220 },
        { date: '2023-12-19', price: 220 },
        { date: '2023-12-20', price: 250 },
      ]
    };
    
    return { success: true, data: prices };
  } catch (error) {
    console.error('Error fetching prices:', error);
    return { success: false, error: 'Erro ao buscar preços' };
  }
};

// Set prices
export const setPrices = async (token: string, propId: string, prices: any[]) => {
  try {
    await simulateDelay(1000);
    // In a real implementation, this would update prices via the API
    return { success: true, message: 'Preços atualizados com sucesso' };
  } catch (error) {
    console.error('Error setting prices:', error);
    return { success: false, error: 'Erro ao atualizar preços' };
  }
};
