import { Sun, Moon } from 'lucide-react';
import { useStore } from '../store/useStore';

const ThemeButton = () => {
  const { isDark, toggleTheme } = useStore();

  return (
    <button
      onClick={toggleTheme}
      className="p-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:opacity-90"
      style={{backgroundColor: 'var(--section-light)', color: 'var(--main-text)'}}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
};

export default ThemeButton;