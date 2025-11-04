import { create } from 'zustand';

export const useStore = create((set, get) => ({
  // Estado del tema
  isDark: false,
  toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
  
  // Estado del flujo de navegación
  currentStep: 'welcome', // 'welcome', 'initial', 'unified', 'finiquito', 'indemnizacion'
  setCurrentStep: (step) => set({ currentStep: step }),
  
  // Datos compartidos
  sharedData: {
    fechaEntrada: '',
    fechaSalida: '',
    salarioDiario: 0,
    diasAguinaldo: 15,
    diasVacaciones: 12,
    salarioMinimo: 278.80,
  },
  
  updateSharedData: (data) => set((state) => ({
    sharedData: { ...state.sharedData, ...data }
  })),
  
  // Resetear datos
  resetData: () => set({
    currentStep: 'welcome',
    sharedData: {
      fechaEntrada: '',
      fechaSalida: '',
      salarioDiario: 0,
      diasAguinaldo: 15,
      diasVacaciones: 12,
      salarioMinimo: 278.80,
    }
  }),
  
  // Validar si los datos básicos están completos
  isBasicDataComplete: () => {
    const { sharedData } = get();
    return sharedData.fechaEntrada && sharedData.fechaSalida && sharedData.salarioDiario > 0;
  }
}));