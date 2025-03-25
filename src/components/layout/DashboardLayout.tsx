
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../hooks/useAuth';
import Modal from '../ui/Modal';
import { validateToken } from '../../services/api';
import { toast } from '@/components/ui/use-toast';

interface DashboardLayoutProps {
  children: React.ReactNode;
  requiresAuth?: boolean;
  adminOnly?: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  requiresAuth = true,
  adminOnly = false,
}) => {
  const { user, loading, setApiConnected, setUserToken } = useAuth();
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [token, setToken] = useState('U51gBw5Si1hKKHk78czHCNpysUX/5/zGupZAaLjImfYctuc9eFoIlVBUFrpX9PBJU4uNj+koeqJA+FuvhRu9DFKPHzrs+BEOMX/pT+zruycX+zkjwaeovrPTvDO3vPBF6kwDSpQ8TT/4uff/+lc/LUPiaxqLa+4cIP+HWZvx9Eo=');
  const [tokenError, setTokenError] = useState('');
  const [tokenLoading, setTokenLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Show the token modal for admin without API connection
    if (user?.role === 'admin' && !user.apiConnected && !loading) {
      setShowTokenModal(true);
    }
  }, [user, loading]);

  const handleTokenSubmit = async () => {
    if (!token.trim()) {
      setTokenError('O token é obrigatório');
      return;
    }

    setTokenLoading(true);
    setTokenError('');

    try {
      const result = await validateToken(token);
      
      if (result.success) {
        setApiConnected(true);
        setUserToken(token);
        setShowTokenModal(false);
        toast({
          title: "Conectado com sucesso",
          description: "A conexão com a Beds24 foi estabelecida com sucesso.",
          variant: "default",
        });
      } else {
        setTokenError(result.error || 'Token inválido ou sem permissão');
        toast({
          title: "Erro de conexão",
          description: result.error || 'Token inválido ou sem permissão',
          variant: "destructive",
        });
      }
    } catch (error) {
      setTokenError('Erro ao validar token');
      console.error('Token validation error:', error);
      toast({
        title: "Erro de conexão",
        description: "Ocorreu um erro ao tentar validar o token.",
        variant: "destructive",
      });
    } finally {
      setTokenLoading(false);
    }
  };

  // If loading, show loading screen
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-frontdesk-500 mx-auto"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // If not authenticated and auth is required
  if (!user && requiresAuth) {
    return <Navigate to="/login" replace />;
  }

  // If user is not admin but trying to access admin pages
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/user" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar collapsed={sidebarCollapsed} toggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <div 
        className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <main className="h-full overflow-auto p-6">{children}</main>
      </div>

      {/* Token Modal for Admin */}
      <Modal
        isOpen={showTokenModal}
        onClose={() => {}}
        title="Conexão com Beds24"
        disableClose={true}
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Para utilizar o Frontdesk, é necessário conectar com a API do Beds24. 
            O token de acesso já está inserido abaixo.
          </p>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Token de acesso (long life)
            </label>
            <textarea
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-frontdesk-500 focus:outline-none focus:ring-1 focus:ring-frontdesk-500"
              rows={4}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Cole seu token da API Beds24 aqui..."
            />
            {tokenError && <p className="mt-1 text-sm text-red-600">{tokenError}</p>}
          </div>
          
          <div className="mt-5 flex justify-end">
            <button
              onClick={handleTokenSubmit}
              disabled={tokenLoading}
              className="btn-primary flex items-center"
            >
              {tokenLoading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent border-white"></span>
                  Validando...
                </>
              ) : (
                'Conectar'
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DashboardLayout;
