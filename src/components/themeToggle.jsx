// theme toggle component for light/dark mode
export default function ThemeToggle({ theme, onThemeChange }) {
  return (
    <div className="theme-toggle">
      <button 
        className={`theme-button ${theme === 'light' ? 'active' : ''}`}
        onClick={() => onThemeChange('light')}
      >
        ☀️
      </button>
      <button 
        className={`theme-button ${theme === 'dark' ? 'active' : ''}`}
        onClick={() => onThemeChange('dark')}
      >
        🌙
      </button>
    </div>
  );
}
