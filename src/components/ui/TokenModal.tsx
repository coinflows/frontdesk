
import React, { useState, useEffect } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import { toast } from './use-toast';
import { useAuth } from '@/hooks/useAuth';
import { validateToken } from '@/services/api';

interface TokenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TokenModal = ({ isOpen, onClose }: TokenModalProps) => {
  const { user, updateApiConnection } = useAuth();
  const [isAnimating, setIsAnimating] = useState(false);
  const [token, setToken] = useState(user?.token || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationResult, setValidationResult] = useState<{ success: boolean; message: string } | null>(null);

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
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
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
      const result = await validateToken(token);
      
      if (result.success) {
        setValidationResult({ 
          success: true, 
          message: `Conectado com sucesso! ${result.data?.length || 0} propriedades encontradas.` 
        });
        
        // Update user state with connection and token
        updateApiConnection(true, token);
        
        toast({
          title: "Conectado com sucesso",
          description: `API conectada com ${result.data?.length || 0} propriedades encontradas.`,
          variant: "default",
        });
        
        // Close the modal after successful connection
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setValidationResult({ 
          success: false, 
          message: result.error || "Falha na validação do token." 
        });
      }
    } catch (error) {
      console.error("Token validation error:", error);
      setValidationResult({ 
        success: false, 
        message: "Erro ao validar o token. Verifique sua conexão." 
      });
    } finally {
      setIsSubmitting(false);
    }
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
        className={`max-w-lg w-full rounded-xl bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ${
          isAnimating ? 'translate-y-0 scale-100' : 'translate-y-4 scale-95'
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Conexão com API Beds24</h3>
          <button
            onClick={handleClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="px-6 py-4">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="api-token" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Token de Acesso
                </label>
                <textarea
                  id="api-token"
                  rows={4}
                  className="mt-1 input-control w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Cole seu token de acesso da API Beds24..."
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Obtenha seu token de acesso no painel da Beds24 em Configurações &gt; Integrações &gt; API v2.
                </p>
              </div>
              
              {validationResult && (
                <div className={`p-3 rounded-md ${
                  validationResult.success 
                    ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                    : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {validationResult.success ? (
                        <Check className="h-5 w-5 text-green-400 dark:text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-red-400 dark:text-red-500" />
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm">{validationResult.message}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  className="btn-secondary dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
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
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TokenModal;
