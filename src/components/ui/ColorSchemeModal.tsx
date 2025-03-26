
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import ThemeColorSelector from './ThemeColorSelector';

interface ColorSchemeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ColorSchemeModal = ({ isOpen, onClose }: ColorSchemeModalProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
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

  if (!isOpen && !isAnimating) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 transition-opacity duration-300 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleBackdropClick}
    >
      <div
        className={`max-w-md w-full rounded-xl bg-white shadow-lg transition-all duration-300 ${
          isAnimating ? 'translate-y-0 scale-100' : 'translate-y-4 scale-95'
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900 font-sora">Personalização</h3>
          <button
            onClick={handleClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="px-6 py-4">
          <ThemeColorSelector />
          
          <div className="flex justify-end pt-4">
            <button
              className="btn-primary"
              onClick={handleClose}
            >
              Concluído
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorSchemeModal;
