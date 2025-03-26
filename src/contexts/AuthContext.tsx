
import React, { createContext, useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  apiConnected: boolean;
  token?: string;
  isNewUser?: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateApiConnection: (connected: boolean, token?: string) => void;
  disconnectApi: () => void;
  setUserAsReturning: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  isLoading: true,
  login: async () => false,
  logout: () => {},
  updateApiConnection: () => {},
  disconnectApi: () => {},
  setUserAsReturning: () => {},
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
    // Updated login credentials
    if (email === 'contato.frontdesk@gmail.com' && password === 'Padrao@01') {
      const adminUser: User = {
        id: '1',
        name: 'Admin',
        email: 'contato.frontdesk@gmail.com',
        role: 'admin',
        apiConnected: false,
        isNewUser: !localStorage.getItem('admin_returning')
      };
      
      setUser(adminUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(adminUser));
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo de volta!",
      });
      return true;
    } else if (email === 'usuario@frontdesk.com.br' && password === 'Padrao@01') {
      const regularUser: User = {
        id: '2',
        name: 'User Test',
        email: 'usuario@frontdesk.com.br',
        role: 'user',
        apiConnected: false,
        isNewUser: !localStorage.getItem('user_returning')
      };
      
      setUser(regularUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(regularUser));
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo de volta!",
      });
      return true;
    }
    
    toast({
      title: "Erro de autenticação",
      description: "E-mail ou senha inválidos",
      variant: "destructive",
    });
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    toast({
      title: "Logout realizado",
      description: "Você desconectou da sua conta",
    });
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
      toast({
        title: "API desconectada",
        description: "Sua conexão com a API foi removida",
      });
    }
  };

  const setUserAsReturning = () => {
    if (user) {
      const key = user.role === 'admin' ? 'admin_returning' : 'user_returning';
      localStorage.setItem(key, 'true');
      
      const updatedUser = {
        ...user,
        isNewUser: false
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
    disconnectApi,
    setUserAsReturning
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
