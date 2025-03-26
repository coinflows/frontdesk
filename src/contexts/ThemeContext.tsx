
import React, { createContext, useState, useEffect } from 'react';

type ThemeType = 'blue' | 'green' | 'purple' | 'red' | 'amber' | 'teal';
type ThemeMode = 'light' | 'dark';

interface ThemeContextProps {
  currentTheme: ThemeType;
  theme: ThemeMode;  // Added missing property
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;  // Added missing function
}

export const ThemeContext = createContext<ThemeContextProps>({
  currentTheme: 'blue',
  theme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(() => {
    // Get theme from localStorage if available
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as ThemeType) || 'blue';
  });
  
  const [theme, setThemeMode] = useState<ThemeMode>(() => {
    // Get theme mode from localStorage if available
    const savedThemeMode = localStorage.getItem('theme-mode');
    return (savedThemeMode as ThemeMode) || 'light';
  });

  useEffect(() => {
    // Update CSS variables based on the current theme
    const root = document.documentElement;
    
    // Clear existing theme classes
    root.classList.remove('theme-blue', 'theme-green', 'theme-purple', 'theme-red', 'theme-amber', 'theme-teal');
    
    // Add the current theme class
    root.classList.add(`theme-${currentTheme}`);
    
    // Update the theme variables
    switch (currentTheme) {
      case 'blue':
        root.style.setProperty('--frontdesk-500', '#3B82F6');
        root.style.setProperty('--frontdesk-600', '#1D4ED8');
        root.style.setProperty('--frontdesk-700', '#2563EB');
        break;
      case 'green':
        root.style.setProperty('--frontdesk-500', '#10B981');
        root.style.setProperty('--frontdesk-600', '#059669');
        root.style.setProperty('--frontdesk-700', '#047857');
        break;
      case 'purple':
        root.style.setProperty('--frontdesk-500', '#8B5CF6');
        root.style.setProperty('--frontdesk-600', '#7C3AED');
        root.style.setProperty('--frontdesk-700', '#6D28D9');
        break;
      case 'red':
        root.style.setProperty('--frontdesk-500', '#EF4444');
        root.style.setProperty('--frontdesk-600', '#DC2626');
        root.style.setProperty('--frontdesk-700', '#B91C1C');
        break;
      case 'amber':
        root.style.setProperty('--frontdesk-500', '#F59E0B');
        root.style.setProperty('--frontdesk-600', '#D97706');
        root.style.setProperty('--frontdesk-700', '#B45309');
        break;
      case 'teal':
        root.style.setProperty('--frontdesk-500', '#14B8A6');
        root.style.setProperty('--frontdesk-600', '#0D9488');
        root.style.setProperty('--frontdesk-700', '#0F766E');
        break;
      default:
        // Default to blue
        root.style.setProperty('--frontdesk-500', '#3B82F6');
        root.style.setProperty('--frontdesk-600', '#1D4ED8');
        root.style.setProperty('--frontdesk-700', '#2563EB');
    }
    
    // Save to localStorage
    localStorage.setItem('theme', currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    // Update theme mode (light/dark)
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Save to localStorage
    localStorage.setItem('theme-mode', theme);
  }, [theme]);

  const setTheme = (newTheme: ThemeType) => {
    setCurrentTheme(newTheme);
  };
  
  const toggleTheme = () => {
    setThemeMode(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
