
import React, { createContext, useState, useEffect } from 'react';

interface ThemeContextType {
  currentTheme: string;
  setTheme: (theme: string) => void;
  theme: string;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  currentTheme: 'blue',
  setTheme: () => {},
  theme: 'light',
  toggleTheme: () => {},
});

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<string>(() => {
    // Retrieve from local storage or use default
    return localStorage.getItem('frontdesk-theme') || 'blue';
  });

  const [theme, setTheme] = useState<string>(() => {
    return localStorage.getItem('frontdesk-theme-mode') || 'light';
  });

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('frontdesk-theme-mode', newTheme);
  };

  useEffect(() => {
    // Save theme to local storage when it changes
    localStorage.setItem('frontdesk-theme', currentTheme);
    
    // Apply theme variables to CSS
    applyThemeColors(currentTheme);
    
  }, [currentTheme]);

  const applyThemeColors = (themeId: string) => {
    const root = document.documentElement;
    
    // Default to blue theme if theme ID is invalid
    let mainColor = '#3B82F6';
    let accentColor = '#1D4ED8';
    let hoverColor = '#2563EB';
    
    switch (themeId) {
      case 'blue':
        mainColor = '#3B82F6';
        accentColor = '#1D4ED8';
        hoverColor = '#2563EB';
        break;
      case 'green':
        mainColor = '#10B981';
        accentColor = '#059669';
        hoverColor = '#047857';
        break;
      case 'purple':
        mainColor = '#8B5CF6';
        accentColor = '#7C3AED';
        hoverColor = '#6D28D9';
        break;
      case 'red':
        mainColor = '#EF4444';
        accentColor = '#DC2626';
        hoverColor = '#B91C1C';
        break;
      case 'amber':
        mainColor = '#F59E0B';
        accentColor = '#D97706';
        hoverColor = '#B45309';
        break;
      case 'teal':
        mainColor = '#14B8A6';
        accentColor = '#0D9488';
        hoverColor = '#0F766E';
        break;
    }
    
    // Apply colors to CSS variables
    root.style.setProperty('--frontdesk-500', mainColor);
    root.style.setProperty('--frontdesk-600', accentColor);
    root.style.setProperty('--frontdesk-700', hoverColor);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme: setCurrentTheme, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
