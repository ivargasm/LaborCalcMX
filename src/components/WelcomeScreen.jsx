import { Calculator, FileText, BarChart3, Download, Info } from 'lucide-react';
import { useStore } from '../store/useStore';
import { BuyMeACoffeeButton } from './BuyMeACoffeeButton';
import ThemeButton from './ThemeButton';

const WelcomeScreen = () => {
  const { setCurrentStep, isDark } = useStore();

  const features = [
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Cálculo de Finiquito",
      description: "Obtén un desglose completo de tu finiquito según la ley."
    },
    {
      icon: <Calculator className="h-8 w-8" />,
      title: "Cálculo de Indemnización", 
      description: "Calcula la indemnización correspondiente en diferentes escenarios."
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Resultados Detallados",
      description: "Visualiza cada concepto y monto de forma clara y transparente."
    },
    {
      icon: <Download className="h-8 w-8" />,
      title: "Exportar a PDF",
      description: "Genera un documento PDF con tus resultados para tus registros."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{backgroundColor: 'var(--main-bg)'}}>
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg" style={{backgroundColor: 'var(--details)'}}>
            <Calculator className="h-6 w-6 text-white" />
          </div>
          <span className="text-lg font-semibold" style={{color: 'var(--main-text)'}}>
            Calculadora Unificada
          </span>
        </div>
        <div className="flex items-center gap-3">
          <BuyMeACoffeeButton />
          <ThemeButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Hero Section */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight" style={{color: 'var(--main-title)'}}>
              Calculadora Unificada de Finiquito e Indemnización
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto" style={{color: 'var(--gray)'}}>
              Calcula de forma rápida y sencilla tu liquidación laboral en México.
            </p>
            <button
              onClick={() => setCurrentStep('unified')}
              className="px-8 py-4 font-semibold rounded-lg shadow-lg hover:opacity-90 transition-opacity text-lg"
              style={{backgroundColor: 'var(--btn)', color: 'var(--btn-text)'}}
            >
              Empezar Cálculo
            </button>
          </div>

          {/* Features Section */}
          <div className="pt-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{color: 'var(--main-title)'}}>
              ¿Qué puedes hacer?
            </h2>
            <p className="text-lg mb-12 max-w-2xl mx-auto" style={{color: 'var(--gray)'}}>
              Nuestra herramienta te permite realizar cálculos precisos y obtener reportes detallados de manera sencilla.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="p-6 rounded-lg border text-center space-y-4"
                  style={{backgroundColor: 'var(--section-light-90)', borderColor: 'var(--brackets)'}}
                >
                  <div className="inline-flex p-3 rounded-lg" style={{backgroundColor: 'var(--card-code)', color: 'var(--details)'}}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold" style={{color: 'var(--main-text)'}}>
                    {feature.title}
                  </h3>
                  <p className="text-sm" style={{color: 'var(--gray)'}}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-16 p-6 rounded-lg border flex items-start gap-4 text-left max-w-3xl mx-auto" style={{backgroundColor: 'var(--card-code)', borderColor: 'var(--details)'}}>
            <Info className="h-5 w-5 mt-0.5 shrink-0" style={{color: 'var(--main-title)'}} />
            <div>
              <p className="text-sm" style={{color: 'var(--subtitle)'}}>
                Los resultados proporcionados por esta calculadora son estimaciones basadas en la información 
                ingresada y las leyes laborales vigentes. Están destinados únicamente para fines informativos y no 
                constituyen asesoría legal o financiera.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 border-t" style={{borderColor: 'var(--brackets)'}}>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm" style={{color: 'var(--gray)'}}>
          <div className="flex gap-6">
            <span>Acerca de</span>
            <span>Código Fuente en GitHub</span>
            <span>BuyMeACoffee</span>
          </div>
          <div>
            <span>© 2024 Calculadora Unificada</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WelcomeScreen;