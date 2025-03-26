
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ColorSchemeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ColorSchemeModal: React.FC<ColorSchemeModalProps> = ({ isOpen, onClose }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  React.useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Color scheme options
  const colorSchemes = [
    { name: 'Azul (Padrão)', primary: '#3B82F6', secondary: '#60A5FA', class: 'theme-blue' },
    { name: 'Roxo', primary: '#7E69AB', secondary: '#9b87f5', class: 'theme-purple' },
    { name: 'Verde', primary: '#10B981', secondary: '#34D399', class: 'theme-green' },
    { name: 'Vermelho', primary: '#EF4444', secondary: '#F87171', class: 'theme-red' },
    { name: 'Laranja', primary: '#F59E0B', secondary: '#FBBF24', class: 'theme-orange' },
    { name: 'Rosa', primary: '#EC4899', secondary: '#F472B6', class: 'theme-pink' },
  ];

  const setColorScheme = (scheme: typeof colorSchemes[0]) => {
    document.documentElement.style.setProperty('--primary-color', scheme.primary);
    document.documentElement.style.setProperty('--secondary-color', scheme.secondary);
    
    // Remove all theme classes and add the selected one
    document.documentElement.classList.remove(
      'theme-blue', 
      'theme-purple', 
      'theme-green', 
      'theme-red', 
      'theme-orange', 
      'theme-pink'
    );
    document.documentElement.classList.add(scheme.class);
    
    handleClose();
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
        className={`w-full max-w-md rounded-xl bg-white shadow-lg transition-all duration-300 ${
          isAnimating ? 'translate-y-0 scale-100' : 'translate-y-4 scale-95'
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900 font-sora">Esquema de Cores</h3>
          <button
            onClick={handleClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            {colorSchemes.map((scheme) => (
              <button
                key={scheme.name}
                className="flex flex-col items-center p-4 border rounded-lg hover:shadow-md transition-all"
                onClick={() => setColorScheme(scheme)}
              >
                <div className="flex space-x-2 mb-2">
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: scheme.primary }}></div>
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: scheme.secondary }}></div>
                </div>
                <span className="text-sm text-gray-700">{scheme.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorSchemeModal;
