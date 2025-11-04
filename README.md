# LaborCalcMX 💼

Calculadora web gratuita para calcular liquidaciones laborales en México: finiquitos, indemnizaciones y más. Basada en la Ley Federal del Trabajo.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 🎯 Características

- ✅ **Cálculo de Finiquito**: Aguinaldo, vacaciones, prima vacacional y días pendientes
- ✅ **Cálculo de Indemnización**: Incluye indemnización constitucional (45/90 días) y reinstalación
- ✅ **Prima de Antigüedad**: Cálculo automático según años trabajados
- ✅ **Conceptos Extras**: Agrega bonos, vales, comisiones y otros conceptos
- ✅ **Detalles Transparentes**: Visualiza cada paso del cálculo
- ✅ **Exportar Reporte**: Descarga tus resultados en formato TXT
- ✅ **Tema Oscuro/Claro**: Interfaz adaptable a tus preferencias
- ✅ **Responsive**: Funciona en móviles, tablets y escritorio

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 16+ 
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/ivargasm/laborcalcmx.git

# Navegar al directorio
cd laborcalcmx/calculadora-unificada

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Compilar para Producción

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`

## 📖 Uso

1. **Ingresa los datos básicos**:
   - Salario diario
   - Fecha de ingreso y salida
   - Días de aguinaldo (por defecto 15)
   - Salario mínimo vigente

2. **Selecciona el tipo de cálculo**:
   - **Finiquito**: Para terminación de contrato normal
   - **Indemnización**: Para despido injustificado o reinstalación

3. **Agrega conceptos adicionales** (opcional):
   - Días trabajados no pagados
   - Bonos y comisiones pendientes
   - Conceptos extras (vales, despensa, etc.)

4. **Visualiza los resultados**:
   - Resumen de montos
   - Detalles de cada cálculo
   - Total a recibir

5. **Descarga el reporte** en formato TXT para tus registros

## 🧮 Cálculos Implementados

### Finiquito
- **Aguinaldo proporcional**: `(días aguinaldo / 365) × días trabajados año × salario diario`
- **Vacaciones proporcionales**: `(días vacaciones / 365) × días trabajados × salario diario`
- **Prima vacacional**: `vacaciones × 0.25` (25%)
- **Prima de antigüedad**: `(12 / 365) × días trabajados × (2 × salario mínimo)` (≥15 años)

### Indemnización
- **Indemnización 45 días**: `45 × salario diario integrado`
- **Indemnización 90 días**: `90 × salario diario integrado`
- **Reinstalación**: `años trabajados × 20 días × salario diario integrado`
- **Prima de antigüedad**: Obligatoria en todos los casos

## 🛠️ Tecnologías

- **React 18** - Framework UI
- **Vite** - Build tool
- **Zustand** - State management
- **Tailwind CSS** - Estilos
- **Lucide React** - Iconos

## 📁 Estructura del Proyecto

```
calculadora-unificada/
├── src/
│   ├── components/
│   │   ├── WelcomeScreen.jsx      # Pantalla de bienvenida
│   │   ├── UnifiedCalculator.jsx  # Calculadora principal
│   │   ├── ExtrasSection.jsx      # Sección de extras
│   │   ├── ThemeButton.jsx        # Botón de tema
│   │   ├── BuyMeACoffeeButton.jsx # Botón de donación
│   │   └── Disclaimer.jsx         # Aviso legal
│   ├── hooks/
│   │   └── useCalculos.js         # Lógica de cálculos
│   ├── store/
│   │   └── useStore.js            # Estado global
│   ├── App.jsx                    # Componente principal
│   ├── main.jsx                   # Punto de entrada
│   └── index.css                  # Estilos globales
├── public/
├── package.json
└── vite.config.js
```

## ⚖️ Base Legal

Los cálculos están basados en:
- **Ley Federal del Trabajo** (México)
- **Artículo 87**: Aguinaldo mínimo de 15 días
- **Artículo 76**: Vacaciones según antigüedad
- **Artículo 80**: Prima vacacional del 25%
- **Artículo 162**: Prima de antigüedad (12 días por año)
- **Artículo 50**: Indemnización por despido injustificado

## ⚠️ Aviso Legal

LaborCalcMX proporciona **estimaciones** con fines informativos. Los resultados no constituyen asesoría legal o financiera. Para casos específicos, consulta con un abogado laboralista.

## 🤝 Contribuir

Las contribuciones son bienvenidas:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/mejora`)
3. Commit tus cambios (`git commit -m 'Agrega nueva característica'`)
4. Push a la rama (`git push origin feature/mejora`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

## 💖 Apoya el Proyecto

Si esta herramienta te ha sido útil, considera:
- ⭐ Dar una estrella al repositorio
- ☕ [Invitarme un café](https://buymeacoffee.com/ivargasm)
- 📢 Compartir con otros

## 📧 Contacto

- GitHub: [@tu-usuario](https://github.com/ivargasm)
- Email: tu-email@ejemplo.com

---

Hecho con ❤️ en México 🇲🇽
