
import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'user';
  token?: string;
  apiConnected: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  setApiConnected: (connected: boolean) => void;
  setUserToken: (token: string) => void;
  updateApiConnection: (connected: boolean, token: string) => void;
}

// Token padrão para iniciar já conectado
const DEFAULT_TOKEN = 'U51gBw5Si1hKKHk78czHCNpysUX/5/zGupZAaLjImfYctuc9eFoIlVBUFrpX9PBJU4uNj+koeqJA+FuvhRu9DFKPHzrs+BEOMX/pT+zruycX+zkjwaeovrPTvDO3vPBF6kwDSpQ8TT/4uff/+lc/LUPiaxqLa+4cIP+HWZvx9Eo=';

const ADMIN_USER = {
  id: '1',
  email: 'contato.frontdesk@gmail.com',
  name: 'Admin',
  role: 'admin' as const,
  apiConnected: true,
  token: DEFAULT_TOKEN
};

const REGULAR_USER = {
  id: '2',
  email: 'usuario@frontdesk.com.br',
  name: 'Usuário',
  role: 'user' as const,
  apiConnected: true,
  token: DEFAULT_TOKEN
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  loading: true,
  isLoading: true,
  isAuthenticated: false,
  setApiConnected: () => {},
  setUserToken: () => {},
  updateApiConnection: () => {}
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('frontdesk_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Ensure the user has the token and active API connection
      if (!parsedUser.token) {
        parsedUser.token = DEFAULT_TOKEN;
        parsedUser.apiConnected = true;
        localStorage.setItem('frontdesk_user', JSON.stringify(parsedUser));
      }
      setUser(parsedUser);
    }
    setLoading(false);
  }, []);

  const isAuthenticated = user !== null;

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    if (email === ADMIN_USER.email && password === 'Acesso@01') {
      const userData = {...ADMIN_USER};
      setUser(userData);
      localStorage.setItem('frontdesk_user', JSON.stringify(userData));
      setLoading(false);
      return true;
    } else if (email === REGULAR_USER.email && password === 'Acesso@01') {
      const userData = {...REGULAR_USER};
      setUser(userData);
      localStorage.setItem('frontdesk_user', JSON.stringify(userData));
      setLoading(false);
      return true;
    }
    
    setLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('frontdesk_user');
  };

  const setApiConnected = (connected: boolean) => {
    if (user) {
      const updatedUser = { ...user, apiConnected: connected };
      setUser(updatedUser);
      localStorage.setItem('frontdesk_user', JSON.stringify(updatedUser));
    }
  };

  const setUserToken = (token: string) => {
    if (user) {
      const updatedUser = { ...user, token };
      setUser(updatedUser);
      localStorage.setItem('frontdesk_user', JSON.stringify(updatedUser));
    }
  };

  const updateApiConnection = (connected: boolean, token: string) => {
    if (user) {
      const updatedUser = { ...user, apiConnected: connected, token };
      setUser(updatedUser);
      localStorage.setItem('frontdesk_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading, 
      isLoading: loading, 
      isAuthenticated,
      setApiConnected, 
      setUserToken,
      updateApiConnection 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
