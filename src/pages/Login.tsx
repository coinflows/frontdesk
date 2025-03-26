
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AlertCircle, Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { Button } from '@/components/ui/button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const { user, login } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('E-mail e senha são obrigatórios');
      return;
    }
    
    setIsLoggingIn(true);
    setError('');
    
    try {
      const success = await login(email, password);
      
      if (!success) {
        setError('E-mail ou senha inválidos');
      }
    } catch (err) {
      setError('Ocorreu um erro durante o login. Tente novamente.');
      console.error('Login error:', err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Redirect if user is already logged in
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/user'} replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-gray-900">
      <div className="absolute top-4 right-4">
        <button 
          onClick={toggleTheme} 
          className="rounded-full p-2 bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
      
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <img
            src="https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://frontdesk.com.br/&size=64"
            alt="Frontdesk Logo"
            className="mx-auto h-12"
          />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">Login</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Entre com suas credenciais para acessar o painel
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/30">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400 dark:text-red-300" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-300">{error}</h3>
                </div>
              </div>
            </div>
          )}
          
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                E-mail
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={isLoggingIn}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-[10px] text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isLoggingIn ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Entrando...
                </span>
              ) : (
                'Entrar'
              )}
            </Button>
          </div>

          <div className="text-center text-sm">
            <p className="text-gray-600 dark:text-gray-300">
              Acesso de demonstração:
            </p>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div className="rounded-md bg-gray-50 p-2 border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <p className="font-semibold dark:text-white">Admin</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">contato.frontdesk@gmail.com</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Padrao@01</p>
              </div>
              <div className="rounded-md bg-gray-50 p-2 border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <p className="font-semibold dark:text-white">Usuário</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">usuario@frontdesk.com.br</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Padrao@01</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
