
import React from 'react';
import { Airbnb, BookOpen, PlusCircle } from 'lucide-react';
import Modal from './Modal';
import { useAuth } from '@/hooks/useAuth';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomeModal = ({ isOpen, onClose }: WelcomeModalProps) => {
  const { setUserAsReturning } = useAuth();
  
  const handleOptionClick = (option: 'import' | 'create') => {
    setUserAsReturning();
    
    // In a real app, these would navigate to different setup flows
    if (option === 'import') {
      console.log('User chose to import property');
    } else {
      console.log('User chose to create new property');
    }
    
    onClose();
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Bem-vindo ao Frontdesk"
      size="lg"
      disableClose={true}
    >
      <div className="py-2">
        <p className="text-gray-600 mb-6">
          Como gostaria de começar?
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div 
            className="border border-gray-200 rounded-[10px] p-4 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors"
            onClick={() => handleOptionClick('import')}
          >
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                <Airbnb size={24} />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Importar de outra plataforma</h3>
                <p className="text-sm text-gray-500">
                  Importe suas propriedades e reservas do Airbnb, Booking.com ou outros canais
                </p>
              </div>
            </div>
          </div>
          
          <div 
            className="border border-gray-200 rounded-[10px] p-4 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors"
            onClick={() => handleOptionClick('create')}
          >
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                <PlusCircle size={24} />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Criar uma nova propriedade</h3>
                <p className="text-sm text-gray-500">
                  Configure manualmente sua propriedade no sistema Frontdesk
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-[10px] border border-gray-200">
          <div className="flex items-start space-x-3">
            <div className="text-blue-600 mt-1">
              <BookOpen size={18} />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 text-sm">Precisa de ajuda?</h4>
              <p className="text-xs text-gray-500 mt-1">
                Consulte nossa documentação para obter ajuda com a configuração de sua propriedade ou entre em contato com nosso suporte.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default WelcomeModal;
