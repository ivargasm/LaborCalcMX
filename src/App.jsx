import { useEffect } from 'react';
import { useStore } from './store/useStore';
import WelcomeScreen from './components/WelcomeScreen';
import UnifiedCalculator from './components/UnifiedCalculator';
import Disclaimer from './components/Disclaimer';
import ThemeButton from './components/ThemeButton';
import { BuyMeACoffeeButton } from './components/BuyMeACoffeeButton';

function App() {
  const { isDark, currentStep } = useStore();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Aplicar tema inicial
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, [isDark]);

  // Pantalla de bienvenida
  if (currentStep === 'welcome') {
    return (
      <div style={{backgroundColor: 'var(--main-bg)'}}>
        <WelcomeScreen />
      </div>
    );
  }

  // Pantalla de cálculo
  return (
    <main className="min-h-screen p-4 transition-colors duration-300" style={{backgroundColor: 'var(--main-bg)'}}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <section className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold" style={{color: 'var(--main-text)'}}>
            Calculadora de Finiquito e Indemnización
          </h1>
          <ThemeButton />
        </section>

        {/* Content */}
        <section className="mb-8">
          {currentStep === 'unified' && <UnifiedCalculator />}
        </section>

        {/* Footer */}
        <Disclaimer />

        <section className="flex flex-col items-center justify-center mt-8">
          <h2 className="text-2xl font-bold mb-4" style={{color: 'var(--main-text)'}}>
            ¡Apoya este proyecto! 🚀
          </h2>
          <BuyMeACoffeeButton />
        </section>
      </div>
    </main>
  );
}

export default App;