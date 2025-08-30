import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode

  // Load theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: {
      // Background colors
      primary: isDarkMode ? 'from-gray-900 via-gray-800 to-gray-900' : 'from-gray-50 via-white to-gray-100',
      secondary: isDarkMode ? 'bg-gray-800/40' : 'bg-white/80',
      card: isDarkMode ? 'bg-gray-700/20' : 'bg-white/60',
      
      // Text colors
      textPrimary: isDarkMode ? 'text-white' : 'text-gray-900',
      textSecondary: isDarkMode ? 'text-gray-200' : 'text-gray-700',
      textTertiary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
      textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
      
      // Border colors
      border: isDarkMode ? 'border-gray-700/50' : 'border-gray-200/60',
      borderCard: isDarkMode ? 'border-gray-600/30' : 'border-gray-300/40',
      
      // Input colors
      input: isDarkMode 
        ? 'from-gray-800/50 to-gray-700/50' 
        : 'from-gray-100/80 to-white/90',
      inputBorder: isDarkMode ? 'border-gray-600/50' : 'border-gray-300/60',
      inputText: isDarkMode ? 'text-white' : 'text-gray-900',
      inputPlaceholder: isDarkMode ? 'placeholder-gray-400' : 'placeholder-gray-500',
      
      // Button colors
      button: isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300',
      buttonText: isDarkMode ? 'text-white' : 'text-gray-900',
      buttonBorder: isDarkMode ? 'border-gray-600/50' : 'border-gray-300/50',
      
      // Accent colors (these stay the same)
      accent: 'from-red-500 to-red-600',
      accentHover: 'from-red-400 to-red-500',
      success: 'text-green-400',
      error: 'text-red-400',
      warning: 'text-yellow-400',
      
      // Chart colors
      chartBackground: isDarkMode ? 'bg-gray-700/20' : 'bg-white/40',
      chartBorder: isDarkMode ? 'border-gray-600/30' : 'border-gray-300/40',
      
      // Backdrop blur
      backdrop: isDarkMode ? 'backdrop-blur-sm' : 'backdrop-blur-md'
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};