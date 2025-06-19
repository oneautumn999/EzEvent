import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';


const ThemeSwitcher = () => {
  const { changeTheme, currentTheme, themeOptions, themeColors } = useTheme()
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const themePreviewColors = {
    default: 'bg-blue-600',
    darkElegant: 'bg-purple-900',
    pastel: 'bg-pink-400',
    classy: 'bg-amber-800'
  };

  const formatThemeName = (name) => {
    switch(name) {
      case 'darkElegant':
        return 'Dark Elegant';
      case 'pastel':
        return 'Pastel';
      case 'classy':
        return 'Classy';
      default:
        return 'Default';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className={`flex items-center space-x-2 px-4 py-2 rounded-md ${themeColors.backgroundSecondary} ${themeColors.border} border transition-all ${themeColors.buttonHover}`}
      >
        <div className={`w-4 h-4 rounded-full ${themePreviewColors[currentTheme]}`}></div>
        <span className={`${themeColors.text}`}>{formatThemeName(currentTheme)}</span>
      </button>

      {isOpen && (
        <div className={`absolute top-full left-0 mt-1 w-40 rounded-md shadow-lg ${themeColors.backgroundSecondary} ${themeColors.border} border z-10`}>
          <div className="py-1">
            {themeOptions.map((theme) => (
              <button
                key={theme}
                onClick={() => {
                  changeTheme(theme);
                  setIsOpen(false);
                }}
                className={`flex items-center w-full px-4 py-2 text-left ${
                  currentTheme === theme ? `${themeColors.primary} text-white` : themeColors.text
                } hover:bg-gray-100 dark:hover:bg-gray-700`}
              >
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${themePreviewColors[theme]}`}></div>
                  <span>{formatThemeName(theme)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;