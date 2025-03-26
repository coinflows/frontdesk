
import React, { createContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  apiConnected: boolean;
  token?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateApiConnection: (connected: boolean, token?: string) => void;
  disconnectApi: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  isLoading: true,
  login: async () => false,
  logout: () => {},
  updateApiConnection: () => {},
  disconnectApi: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login functionality
    if (email === 'admin@frontdesk.com.br' && password === 'admin123') {
      const adminUser: User = {
        id: '1',
        name: 'Admin',
        email: 'admin@frontdesk.com.br',
        role: 'admin',
        apiConnected: false
      };
      
      setUser(adminUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(adminUser));
      return true;
    } else if (email === 'user@frontdesk.com.br' && password === 'user123') {
      const regularUser: User = {
        id: '2',
        name: 'User Test',
        email: 'user@frontdesk.com.br',
        role: 'user',
        apiConnected: false
      };
      
      setUser(regularUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(regularUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const updateApiConnection = (connected: boolean, token?: string) => {
    if (user) {
      const updatedUser = { 
        ...user, 
        apiConnected: connected,
        token: token || user.token 
      };
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const disconnectApi = () => {
    if (user) {
      const updatedUser = { 
        ...user, 
        apiConnected: false,
        token: undefined
      };
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
    updateApiConnection,
    disconnectApi
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
