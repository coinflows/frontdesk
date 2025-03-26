
import React from 'react';
import { Check } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface ColorOption {
  id: string;
  name: string;
  mainColor: string;
  accentColor: string;
  hoverColor: string;
}

const ThemeColorSelector = () => {
  const { currentTheme, setTheme } = useTheme();

  const colorOptions: ColorOption[] = [
    {
      id: 'blue',
      name: 'Azul',
      mainColor: '#3B82F6',
      accentColor: '#1D4ED8',
      hoverColor: '#2563EB'
    },
    {
      id: 'green',
      name: 'Verde',
      mainColor: '#10B981',
      accentColor: '#059669',
      hoverColor: '#047857'
    },
    {
      id: 'purple',
      name: 'Roxo',
      mainColor: '#8B5CF6',
      accentColor: '#7C3AED',
      hoverColor: '#6D28D9'
    },
    {
      id: 'red',
      name: 'Vermelho',
      mainColor: '#EF4444',
      accentColor: '#DC2626',
      hoverColor: '#B91C1C'
    },
    {
      id: 'amber',
      name: 'Âmbar',
      mainColor: '#F59E0B',
      accentColor: '#D97706',
      hoverColor: '#B45309'
    },
    {
      id: 'teal',
      name: 'Turquesa',
      mainColor: '#14B8A6',
      accentColor: '#0D9488',
      hoverColor: '#0F766E'
    },
  ];

  const handleColorSelect = (colorId: string) => {
    setTheme(colorId);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium font-sora">Cores do Tema</h3>
      <div className="grid grid-cols-3 gap-3">
        {colorOptions.map((option) => (
          <button
            key={option.id}
            className={`flex flex-col items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors ${
              currentTheme === option.id ? 'border-frontdesk-500 ring-2 ring-frontdesk-200' : 'border-gray-200'
            }`}
            onClick={() => handleColorSelect(option.id)}
          >
            <div className="relative mb-2">
              <div 
                className="h-6 w-6 rounded-full"
                style={{ backgroundColor: option.mainColor }}
              />
              {currentTheme === option.id && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
            <span className="text-sm font-medium text-gray-700">{option.name}</span>
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Selecione uma opção de cor para personalizar a aparência do sistema.
      </p>
    </div>
  );
};

export default ThemeColorSelector;
