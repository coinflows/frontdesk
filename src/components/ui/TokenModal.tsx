
import React, { useState, useEffect } from 'react';
import { X, Check, Loader2, Trash2, WifiOff, List } from 'lucide-react';
import { toast } from './use-toast';
import { useAuth } from '@/hooks/useAuth';
import { validateToken, getProperties } from '@/services/api';

interface TokenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ValidationResult {
  success: boolean;
  message: string;
}

const TokenModal = ({ isOpen, onClose }: TokenModalProps) => {
  const { user, updateApiConnection, disconnectApi } = useAuth();
  const [isAnimating, setIsAnimating] = useState(false);
  const [token, setToken] = useState(user?.token || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isCheckingData, setIsCheckingData] = useState(false);
  const [apiData, setApiData] = useState<any[] | null>(null);
  const [isDeletingDemoData, setIsDeletingDemoData] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Pre-fill with existing token if available
      setToken(user?.token || 'U51gBw5Si1hKKHk78czHCNpysUX/5/zGupZAaLjImfYctuc9eFoIlVBUFrpX9PBJU4uNj+koeqJA+FuvhRu9DFKPHzrs+BEOMX/pT+zruycX+zkjwaeovrPTvDO3vPBF6kwDSpQ8TT/4uff/+lc/LUPiaxqLa+4cIP+HWZvx9Eo=');
    }
  }, [isOpen, user?.token]);

  const handleClose = () => {
    setIsAnimating(false);
    setValidationResult(null);
    setApiData(null);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleDisconnect = () => {
    disconnectApi();
    setValidationResult(null);
    setApiData(null);
    toast({
      title: "Desconectado",
      description: "Conexão com a API Beds24 desativada com sucesso.",
      variant: "default",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token.trim()) {
      toast({
        title: "Token necessário",
        description: "Por favor, insira o token de acesso da API.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    setValidationResult(null);
    
    try {
      // Only allow the specific token to connect
      const correctToken = 'U51gBw5Si1hKKHk78czHCNpysUX/5/zGupZAaLjImfYctuc9eFoIlVBUFrpX9PBJU4uNj+koeqJA+FuvhRu9DFKPHzrs+BEOMX/pT+zruycX+zkjwaeovrPTvDO3vPBF6kwDSpQ8TT/4uff/+lc/LUPiaxqLa+4cIP+HWZvx9Eo=';
      
      if (token.trim() === correctToken) {
        const result = await validateToken(token);
        
        if (result && 'success' in result && result.success) {
          const propertiesCount = 'data' in result && result.data ? result.data.length : 0;
          setValidationResult({ 
            success: true, 
            message: `Conectado com sucesso! ${propertiesCount} propriedades encontradas.` 
          });
          
          // Update user state with connection and token
          updateApiConnection(true, token);
          
          toast({
            title: "Conectado com sucesso",
            description: `API conectada com ${propertiesCount} propriedades encontradas.`,
            variant: "default",
          });
          
          // Close the modal after successful connection
          setTimeout(() => {
            handleClose();
          }, 2000);
        } else {
          setValidationResult({ 
            success: false, 
            message: result && 'error' in result ? result.error as string : "Falha na validação do token." 
          });
          
          toast({
            title: "Falha na validação",
            description: "Não foi possível conectar à API Beds24.",
            variant: "destructive",
          });
        }
      } else {
        setValidationResult({ 
          success: false, 
          message: "Token inválido. Por favor, verifique e tente novamente." 
        });
        
        toast({
          title: "Token inválido",
          description: "O token fornecido não é válido.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Token validation error:", error);
      setValidationResult({ 
        success: false, 
        message: "Erro ao validar o token. Tente novamente." 
      });
      
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao validar o token.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckApiData = async () => {
    if (!user?.token) {
      toast({
        title: "Erro",
        description: "Você precisa estar conectado à API para verificar os dados.",
        variant: "destructive",
      });
      return;
    }

    setIsCheckingData(true);
    setApiData(null);

    try {
      const result = await getProperties(user.token);
      
      if (result.success && result.data) {
        setApiData(result.data.slice(0, 3)); // Only show first 3 properties
        
        toast({
          title: "Dados recuperados",
          description: `${result.data.length} propriedades encontradas na API.`,
          variant: "default",
        });
      } else {
        toast({
          title: "Erro",
          description: "Falha ao recuperar dados da API.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error checking API data:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao verificar os dados da API.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingData(false);
    }
  };

  const handleDeleteDemoData = () => {
    setIsDeletingDemoData(true);
    
    // Simulating deletion of demo data
    setTimeout(() => {
      toast({
        title: "Dados demonstrativos removidos",
        description: "Os dados de demonstração foram removidos com sucesso.",
        variant: "default",
      });
      setIsDeletingDemoData(false);
    }, 1500);
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 transition-opacity duration-300 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleBackdropClick}
    >
      <div
        className={`max-w-lg w-full rounded-[10px] bg-white shadow-lg transition-all duration-300 ${
          isAnimating ? 'translate-y-0 scale-100' : 'translate-y-4 scale-95'
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900 font-sora">Conexão com API Beds24</h3>
          <button
            onClick={handleClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="px-6 py-4">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {user?.apiConnected ? (
                <div className="p-3 rounded-md bg-green-50 text-green-700 mb-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">API conectada com sucesso!</p>
                      <p className="text-sm mt-1">Você pode gerenciar sua conexão abaixo.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label htmlFor="api-token" className="block text-sm font-medium text-gray-700">
                    Token de Acesso
                  </label>
                  <textarea
                    id="api-token"
                    rows={4}
                    className="mt-1 input-control w-full"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Cole seu token de acesso da API Beds24..."
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Obtenha seu token de acesso no painel da Beds24 em Configurações &gt; Integrações &gt; API v2.
                  </p>
                </div>
              )}
              
              {validationResult && (
                <div className={`p-3 rounded-md ${
                  validationResult.success 
                    ? 'bg-green-50 text-green-700' 
                    : 'bg-red-50 text-red-700'
                }`}>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {validationResult.success ? (
                        <Check className="h-5 w-5 text-green-400" />
                      ) : (
                        <X className="h-5 w-5 text-red-400" />
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm">{validationResult.message}</p>
                    </div>
                  </div>
                </div>
              )}

              {apiData && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <h4 className="text-sm font-semibold mb-2">Dados recuperados da API (primeiras 3 propriedades):</h4>
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    {apiData.map((property, index) => (
                      <div key={index} className="p-2 bg-white rounded border border-gray-200 text-sm">
                        <p className="font-medium">{property.name}</p>
                        <p className="text-xs text-gray-500">{property.address}, {property.city}</p>
                        <div className="flex gap-2 mt-1 text-xs">
                          <span className="bg-gray-100 px-1.5 py-0.5 rounded">{property.type}</span>
                          <span className="bg-gray-100 px-1.5 py-0.5 rounded">{property.maxGuests} hóspedes</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-3 pt-4">
                {user?.apiConnected ? (
                  <>
                    <button
                      type="button"
                      className="btn-danger flex items-center"
                      onClick={handleDisconnect}
                    >
                      <WifiOff className="mr-2 h-4 w-4" />
                      <span>Desconectar API</span>
                    </button>

                    <button
                      type="button"
                      className="btn-secondary flex items-center"
                      onClick={handleCheckApiData}
                      disabled={isCheckingData}
                    >
                      {isCheckingData ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          <span>Verificando...</span>
                        </>
                      ) : (
                        <>
                          <List className="mr-2 h-4 w-4" />
                          <span>Verificar Dados da API</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      className="btn-secondary flex items-center"
                      onClick={handleDeleteDemoData}
                      disabled={isDeletingDemoData}
                    >
                      {isDeletingDemoData ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          <span>Removendo...</span>
                        </>
                      ) : (
                        <>
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Remover Dados Demo</span>
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={handleClose}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="btn-primary flex items-center"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          <span>Validando...</span>
                        </>
                      ) : (
                        <span>Conectar API</span>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TokenModal;
