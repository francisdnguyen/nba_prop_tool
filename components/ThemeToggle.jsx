import React from 'react';
import { useTheme } from './ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme, colors } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative p-3 rounded-xl transition-all duration-300 ${colors.button} ${colors.buttonText} ${colors.border} border hover:scale-105 active:scale-95 shadow-lg group`}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Background gradient animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Icon container */}
      <div className="relative w-6 h-6 flex items-center justify-center">
        {/* Sun icon (for light mode) */}
        <svg
          className={`absolute w-6 h-6 transition-all duration-500 ${
            isDarkMode 
              ? 'rotate-90 scale-0 opacity-0' 
              : 'rotate-0 scale-100 opacity-100'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
        
        {/* Moon icon (for dark mode) */}
        <svg
          className={`absolute w-6 h-6 transition-all duration-500 ${
            isDarkMode 
              ? 'rotate-0 scale-100 opacity-100' 
              : '-rotate-90 scale-0 opacity-0'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
        </svg>
      </div>
      
      {/* Tooltip */}
      <div className={`absolute -bottom-12 left-1/2 transform -translate-x-1/2 px-3 py-1 ${colors.secondary} ${colors.textSecondary} text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap ${colors.border} border`}>
        Switch to {isDarkMode ? 'light' : 'dark'} mode
        <div className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 ${isDarkMode ? 'bg-gray-800/40' : 'bg-white/80'} rotate-45 ${colors.border} border-t border-l`} />
      </div>
    </button>
  );
};

export default ThemeToggle;