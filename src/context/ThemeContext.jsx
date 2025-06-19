import { createContext, useContext, useState, useEffect } from 'react';

const themes = {
  default: {
    primary: 'bg-dark',
    secondary: 'bg-dark',
    text: 'text-gray-800',
    textLight: 'text-gray-500',
    background: 'bg-gray-100',
    backgroundSecondary: 'bg-white',
    border: 'border-gray-300',
    buttonHover: 'hover:bg-gray-700',
    inputFocus: 'focus:ring-blue-500 focus:border-blue-500',
    inputBg: 'bg-white',
  },
  darkElegant: {
    primary: 'bg-purple-900',
    secondary: 'bg-purple-700',
    text: 'text-gray-200',
    textLight: 'text-gray-400',
    background: 'bg-gray-900',
    backgroundSecondary: 'bg-gray-800',
    border: 'border-gray-700',
    buttonHover: 'hover:bg-purple-800',
    inputFocus: 'focus:ring-purple-600 focus:border-purple-600',
    inputBg: 'bg-gray-800',
  },
  pastel: {
    primary: 'bg-pink-400',
    secondary: 'bg-pink-300',
    text: 'text-gray-700',
    textLight: 'text-gray-500',
    background: 'bg-purple-50',
    backgroundSecondary: 'bg-white',
    border: 'border-pink-200',
    buttonHover: 'hover:bg-pink-500',
    inputFocus: 'focus:ring-pink-300 focus:border-pink-300',
    inputBg: 'bg-white',
  },
  classy: {
    primary: 'bg-amber-800',
    secondary: 'bg-amber-600',
    text: 'text-gray-800',
    textLight: 'text-gray-600',
    background: 'bg-amber-50',
    backgroundSecondary: 'bg-white',
    border: 'border-amber-300',
    buttonHover: 'hover:bg-amber-900',
    inputFocus: 'focus:ring-amber-500 focus:border-amber-500',
    inputBg: 'bg-white',
  }
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme && themes[savedTheme] ? savedTheme : 'default';
  });

  useEffect(() => {
    localStorage.setItem('theme', currentTheme);
  }, [currentTheme]);

  const changeTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
    }
  };

  const value = {
    currentTheme,
    changeTheme,
    themes,
    themeColors: themes[currentTheme],
    themeOptions: Object.keys(themes)
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};