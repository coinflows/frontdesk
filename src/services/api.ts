
// API service for Beds24 integration

const API_BASE_URL = 'https://beds24.com/api/v2';

// Helper to simulate API delay for non-real requests
const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data for the application
const mockResponses = {
  users: [
    {
      id: '101',
      name: 'João Silva',
      email: 'joao@frontdesk.com.br',
      role: 'user',
      apiConnected: true,
      properties: ['1001']
    },
    {
      id: '102',
      name: 'Maria Santos',
      email: 'maria@frontdesk.com.br',
      role: 'user',
      apiConnected: true,
      properties: ['1002']
    },
    {
      id: '103',
      name: 'Pedro Ferreira',
      email: 'pedro@frontdesk.com.br',
      role: 'user',
      apiConnected: false,
      properties: ['1003']
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
  ]
};

// Validate token with API
export const validateToken = async (token: string) => {
  try {
    console.log("Validating token:", token);
    
    // Real API call to validate the token by fetching properties
    const response = await fetch(`${API_BASE_URL}/properties`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'token': token
      }
    });
    
    const data = await response.json();
    
    if (data && data.data) {
      return { 
        success: true, 
        data: data.data.map((prop: any) => ({
          propId: prop.id,
          name: prop.name || 'Sem nome',
          address: prop.address || 'Sem endereço',
          city: prop.city || '',
          images: prop.images || ['https://placehold.co/600x400?text=Propriedade'],
          maxGuests: prop.maxGuests || 2
        }))
      };
    } else {
      return { success: false, error: data.error || 'Token inválido ou sem permissão' };
    }
  } catch (error) {
    console.error('Error validating token:', error);
    return { success: false, error: 'Erro ao validar token' };
  }
};

// Get properties
export const getProperties = async (token: string) => {
  try {
    console.log("Getting properties with token:", token);
    
    if (!token) {
      return { success: false, error: 'Token não fornecido' };
    }
    
    // Real API call to get properties
    const response = await fetch(`${API_BASE_URL}/properties`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'token': token
      }
    });
    
    const data = await response.json();
    
    if (data && data.data) {
      return { 
        success: true, 
        data: data.data.map((prop: any) => ({
          propId: prop.id,
          name: prop.name || 'Sem nome',
          address: prop.address || 'Sem endereço',
          city: prop.city || '',
          images: prop.images || ['https://placehold.co/600x400?text=Propriedade'],
          maxGuests: prop.maxGuests || 2
        }))
      };
    } else {
      return { success: false, error: data.error || 'Erro ao buscar propriedades' };
    }
  } catch (error) {
    console.error('Error fetching properties:', error);
    return { success: false, error: 'Erro ao buscar propriedades' };
  }
};

// Get bookings
export const getBookings = async (token: string, propId?: string) => {
  try {
    console.log("Getting bookings with token:", token, "for property:", propId);
    
    if (!token) {
      return { success: false, error: 'Token não fornecido' };
    }
    
    // In a real implementation with the actual API
    const url = propId 
      ? `${API_BASE_URL}/bookings?propId=${propId}` 
      : `${API_BASE_URL}/bookings`;
      
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'token': token
        }
      });
      
      const data = await response.json();
      
      if (data && data.data) {
        return { 
          success: true, 
          data: data.data 
        };
      } else {
        console.log("Using mock bookings data");
        // Fallback to mock data if the API doesn't return bookings
        let bookings = mockResponses.bookings;
        
        if (propId) {
          bookings = bookings.filter(booking => booking.propId === propId);
        }
        
        return { success: true, data: bookings };
      }
    } catch (error) {
      console.error("Error fetching real bookings:", error);
      console.log("Using mock bookings data");
      
      // Fallback to mock data if the API call fails
      let bookings = mockResponses.bookings;
      
      if (propId) {
        bookings = bookings.filter(booking => booking.propId === propId);
      }
      
      return { success: true, data: bookings };
    }
  } catch (error) {
    console.error('Error in getBookings:', error);
    return { success: false, error: 'Erro ao buscar reservas' };
  }
};

// Get users (admin only)
export const getUsers = async (token: string) => {
  try {
    // For admin functionality, we'll continue to use mock data
    // In a real implementation, this would make an API call
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
    // For admin functionality, we'll continue to use mock data
    await simulateDelay(1000);
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
    // This would be a real API call in production
    await simulateDelay(1000);
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
    // Real API call to get availability would go here
    // For now using mock data
    await simulateDelay();
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
    // Real API call to update availability would go here
    await simulateDelay(1000);
    return { success: true, message: 'Disponibilidade atualizada com sucesso' };
  } catch (error) {
    console.error('Error setting availability:', error);
    return { success: false, error: 'Erro ao atualizar disponibilidade' };
  }
};

// Get prices
export const getPrices = async (token: string, propId: string, dateFrom: string, dateTo: string) => {
  try {
    // Real API call to get prices would go here
    await simulateDelay();
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
    // Real API call to update prices would go here
    await simulateDelay(1000);
    return { success: true, message: 'Preços atualizados com sucesso' };
  } catch (error) {
    console.error('Error setting prices:', error);
    return { success: false, error: 'Erro ao atualizar preços' };
  }
};
