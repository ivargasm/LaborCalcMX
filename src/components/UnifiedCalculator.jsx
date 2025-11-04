import { useState, useEffect } from 'react';
import { ArrowLeft, Download } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useCalculos } from '../hooks/useCalculos';

const UnifiedCalculator = () => {
  const { sharedData, setCurrentStep, isDark } = useStore();
  const [activeTab, setActiveTab] = useState('finiquito');
  const [salarioDiario, setSalarioDiario] = useState(0);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [diasAguinaldo, setDiasAguinaldo] = useState(15);
  const [diasVacaciones, setDiasVacaciones] = useState(12);
  const [salarioMinimo, setSalarioMinimo] = useState(278.80);
  const [diasTrabajadosNoPagados, setDiasTrabajadosNoPagados] = useState(0);
  const [incluirBonos, setIncluirBonos] = useState(false);
  const [montoBonos, setMontoBonos] = useState(0);
  const [tipoAccion, setTipoAccion] = useState('indemnizacion');
  const [extras, setExtras] = useState([]);
  const [showDetails, setShowDetails] = useState(false);

  // Cálculos automáticos
  const [diasTrabajados, setDiasTrabajados] = useState(0);
  const [diasTrabajadosAnio, setDiasTrabajadosAnio] = useState(0);
  const [diasVacacionesTrabajados, setDiasVacacionesTrabajados] = useState(0);

  useEffect(() => {
    if (fechaInicio && fechaFin) {
      const entrada = new Date(fechaInicio);
      const salida = new Date(fechaFin);
      
      if (salida < entrada) return;
      
      const diffTime = Math.abs(salida - entrada);
      setDiasTrabajados(Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

      // Calcular años trabajados completos
      const antiguedad = salida.getFullYear() - entrada.getFullYear();
      const mesActual = salida.getMonth();
      const diaActual = salida.getDate();
      const mesEntrada = entrada.getMonth();
      const diaEntrada = entrada.getDate();
      let aniosTrabajados = antiguedad;
      if (mesActual < mesEntrada || (mesActual === mesEntrada && diaActual < diaEntrada)) {
        aniosTrabajados -= 1;
      }

      const diasVac = getDiasVacacionesPorAntiguedad(aniosTrabajados);
      setDiasVacaciones(diasVac);

      // calcular nueva fecha de entrada al año actual con el mismo mes y día
      let nuevaFechaEntrada = new Date(salida.getFullYear(), entrada.getMonth(), entrada.getDate());

      // si la nueva fecha de entrada es mayor a la fecha de salida, restar un año
      if (nuevaFechaEntrada > salida) {
          nuevaFechaEntrada.setFullYear(nuevaFechaEntrada.getFullYear() - 1);
      }

      // Calcular días trabajados en el último año
      setDiasVacacionesTrabajados(Math.ceil((salida - nuevaFechaEntrada) / (1000 * 60 * 60 * 24)) - 1);

      const inicioAnio = new Date(salida.getFullYear(), 0, 1);
      const diasTrabajadosAnio = Math.ceil((salida - (entrada > inicioAnio ? entrada : inicioAnio)) / (1000 * 60 * 60 * 24));
      setDiasTrabajadosAnio(diasTrabajadosAnio > 0 ? diasTrabajadosAnio : 0);
    }
  }, [fechaInicio, fechaFin]);

  const getDiasVacacionesPorAntiguedad = (anios) => {
    if (anios >= 31) return 32;
    if (anios >= 26) return 30;
    if (anios >= 21) return 28;
    if (anios >= 16) return 26;
    if (anios >= 11) return 24;
    if (anios >= 6) return 22;
    if (anios === 5) return 20;
    if (anios === 4) return 18;
    if (anios === 3) return 16;
    if (anios === 2) return 14;
    return 12; // por default año 1 o menos
  };

  // Preparar extras para cálculos
  useEffect(() => {
    if (incluirBonos && montoBonos > 0) {
      setExtras([{ monto: montoBonos, periodicidad: 'mensual', concepto: 'Bonos pendientes' }]);
    } else {
      setExtras([]);
    }
  }, [incluirBonos, montoBonos]);

  const calculos = useCalculos({
    salarioDiario,
    extras,
    diasTrabajados,
    diasAguinaldo,
    diasTrabajadosAnio,
    diasVacaciones,
    diasVacacionesTrabajados,
    salarioMinimo,
    tipoAccion
  });

  const calculateFiniquito = () => {
    const aguinaldo = (diasAguinaldo / 365) * diasTrabajadosAnio * salarioDiario;
    const vacaciones = (diasVacaciones / 365) * diasVacacionesTrabajados * salarioDiario;
    const primaVacacional = vacaciones / 4; // 25% = dividir entre 4
    const diasNoPagados = diasTrabajadosNoPagados * salarioDiario;
    const bonosPendientes = incluirBonos ? montoBonos : 0;
    
    // Prima de antigüedad obligatoria para 15+ años
    const añosAntiguedad = diasTrabajados / 365;
    const primaAntiguedad = añosAntiguedad >= 15 ? (12 / 365) * diasTrabajados * (2 * salarioMinimo) : 0;
    
    return {
      aguinaldo,
      vacaciones,
      primaVacacional,
      diasNoPagados,
      bonosPendientes,
      primaAntiguedad,
      añosAntiguedad,
      diasVacacionesTrabajados,
      total: aguinaldo + vacaciones + primaVacacional + diasNoPagados + bonosPendientes + primaAntiguedad
    };
  };

  const finiquitoResults = calculateFiniquito();
  const results = activeTab === 'finiquito' ? finiquitoResults : calculos;

  const descargarReporte = () => {
    const fecha = new Date().toLocaleDateString('es-MX');
    const añosDeAntigüedad = (diasTrabajados / 365).toFixed(2);
    
    const contenido = activeTab === 'finiquito' ? 
      `REPORTE DE FINIQUITO
${'='.repeat(50)}

Fecha de elaboración: ${fecha}

DATOS DEL TRABAJADOR:
${'-'.repeat(25)}
Fecha de ingreso: ${fechaInicio}
Fecha de salida: ${fechaFin}
Días trabajados: ${diasTrabajados}
Años de antigüedad: ${añosDeAntigüedad}

SALARIOS:
${'-'.repeat(25)}
Salario diario base: $${salarioDiario.toFixed(2)}

CONCEPTOS A PAGAR:
${'-'.repeat(25)}
1. Aguinaldo proporcional:
   - Días: ${diasAguinaldo}
   - Días trabajados en el año: ${diasTrabajadosAnio}
   - Cálculo: (${diasAguinaldo}/365) × ${diasTrabajadosAnio} × $${salarioDiario.toFixed(2)}
   - Importe: $${results.aguinaldo}

2. Vacaciones proporcionales:
   - Días por antigüedad: ${diasVacaciones}
   - Días trabajados: ${results.diasVacacionesTrabajados || 0}
   - Cálculo: (${diasVacaciones}/365) × ${results.diasVacacionesTrabajados || 0} × $${salarioDiario.toFixed(2)}
   - Importe: $${results.vacaciones}

3. Prima vacacional (25%):
   - Base: $${results.vacaciones}
   - Cálculo: $${results.vacaciones} × 0.25
   - Importe: $${results.primaVacacional}

${diasTrabajadosNoPagados > 0 ? `4. Días trabajados no pagados:
   - Días: ${diasTrabajadosNoPagados}
   - Cálculo: ${diasTrabajadosNoPagados} × $${salarioDiario.toFixed(2)}
   - Importe: $${results.diasNoPagados}

` : ''}${incluirBonos ? `${diasTrabajadosNoPagados > 0 ? '5' : '4'}. Bonos y comisiones pendientes:
   - Importe: $${results.bonosPendientes}

` : ''}${results.añosAntiguedad >= 15 ? `${(diasTrabajadosNoPagados > 0 ? (incluirBonos ? '6' : '5') : (incluirBonos ? '5' : '4'))}. Prima de antigüedad:
   - 12 días por año trabajado (obligatoria ≥ 15 años)
   - Base: 2 veces salario mínimo ($${(salarioMinimo * 2).toFixed(2)})
   - Cálculo: (12/365) × ${diasTrabajados} × $${(salarioMinimo * 2).toFixed(2)}
   - Importe: $${results.primaAntiguedad?.toFixed(2) || '0.00'}

` : ''}
RESUMEN TOTAL:
${'='.repeat(25)}
Total a recibir: $${results.total}

NOTAS LEGALES:
${'-'.repeat(25)}
- Cálculo basado en la Ley Federal del Trabajo
- Los montos están sujetos a deducciones fiscales
- Este documento es una propuesta económica

Generado por: Calculadora Unificada
Fecha: ${fecha}
` :
      `PROPUESTA ECONÓMICA - FINIQUITO LABORAL
${'='.repeat(50)}

Fecha de elaboración: ${fecha}
Tipo de acción: ${tipoAccion.toUpperCase()}

DATOS DEL TRABAJADOR:
${'-'.repeat(25)}
Fecha de ingreso: ${fechaInicio}
Fecha de salida: ${fechaFin}
Días trabajados: ${diasTrabajados}
Años de antigüedad: ${añosDeAntigüedad}

SALARIOS:
${'-'.repeat(25)}
Salario diario base: $${salarioDiario.toFixed(2)}
${extras.length > 0 ? `Extras:
${extras.map(extra => {
  const divisor = extra.periodicidad === 'mensual' ? 30 : extra.periodicidad === 'quincenal' ? 15 : extra.periodicidad === 'semanal' ? 7 : 1;
  const montoDiario = extra.monto / divisor;
  return `  - ${extra.concepto}: $${extra.monto.toFixed(2)} ${extra.periodicidad} = $${montoDiario.toFixed(2)} diario`;
}).join('\n')}
Total extras diarios: $${results.totalExtrasDiarios?.toFixed(2) || '0.00'}
` : ''}Salario diario integrado: $${results.salarioDiarioIntegrado?.toFixed(2) || salarioDiario.toFixed(2)}
Salario mínimo vigente: $${salarioMinimo.toFixed(2)}

CONCEPTOS A PAGAR:
${'-'.repeat(25)}
1. Aguinaldo proporcional:
   - Días: ${diasAguinaldo}
   - Días trabajados en el año: ${diasTrabajadosAnio}
   - Cálculo: (${diasAguinaldo}/365) × ${diasTrabajadosAnio} × $${salarioDiario.toFixed(2)}
   - Importe: $${results.aguinaldo?.toFixed(2) || '0.00'}

2. Vacaciones proporcionales:
   - Días por antigüedad: ${diasVacaciones}
   - Días trabajados: ${diasVacacionesTrabajados}
   - Cálculo: (${diasVacaciones}/365) × ${diasVacacionesTrabajados} × $${salarioDiario.toFixed(2)}
   - Importe: $${results.vacaciones?.toFixed(2) || '0.00'}

3. Prima vacacional (25%):
   - Base: $${results.vacaciones?.toFixed(2) || '0.00'}
   - Cálculo: $${results.vacaciones?.toFixed(2) || '0.00'} ÷ 4
   - Importe: $${results.primaVacacional?.toFixed(2) || '0.00'}

${tipoAccion === 'indemnizacion' ? `4. Indemnización constitucional:
   - 45 días: ${Math.floor(diasTrabajados / 365)} años × 45 días × $${results.salarioDiarioIntegrado?.toFixed(2) || salarioDiario.toFixed(2)} = $${results.indemnizacion45?.toFixed(2) || '0.00'}
   - 90 días: ${Math.floor(diasTrabajados / 365)} años × 90 días × $${results.salarioDiarioIntegrado?.toFixed(2) || salarioDiario.toFixed(2)} = $${results.indemnizacion90?.toFixed(2) || '0.00'}` : `4. Reinstalación:
   - 20 días por año trabajado
   - ${añosDeAntigüedad} años × 20 días × $${results.salarioDiarioIntegrado?.toFixed(2) || salarioDiario.toFixed(2)}
   - Importe: $${results.reinstalacion?.toFixed(2) || '0.00'}`}

5. Prima de antigüedad:
   - 12 días por año trabajado
   - Base: 2 veces salario mínimo ($${(salarioMinimo * 2).toFixed(2)})
   - Cálculo: (12/365) × ${diasTrabajados} × $${(salarioMinimo * 2).toFixed(2)}
   - Importe: $${results.primaAntiguedad?.toFixed(2) || '0.00'}

RESUMEN TOTAL:
${'='.repeat(25)}
${tipoAccion === 'indemnizacion' ? `Total con indemnización 45 días: $${results.totalFiniquito45?.toFixed(2) || '0.00'}
Total con indemnización 90 días: $${results.totalFiniquito90?.toFixed(2) || '0.00'}` : `Total con reinstalación: $${results.totalFiniquito45?.toFixed(2) || '0.00'}`}

NOTAS LEGALES:
${'-'.repeat(25)}
- Cálculo basado en la Ley Federal del Trabajo
- Prima de antigüedad: Obligatoria en despidos
- Los montos están sujetos a deducciones fiscales
- Este documento es una propuesta económica

Generado por: Calculadora Unificada
Fecha: ${fecha}
`;

    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Propuesta_${activeTab === 'finiquito' ? 'Finiquito' : tipoAccion.toUpperCase()}_${fecha.replace(/\//g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen" style={{backgroundColor: 'var(--main-bg)'}}>
      {/* Header */}
      <div className="border-b" style={{borderColor: 'var(--brackets)'}}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentStep('welcome')}
                className="flex items-center gap-2 px-4 py-2 rounded-md transition-colors hover:opacity-90"
                style={{backgroundColor: 'var(--btn)', color: 'var(--btn-text)'}}
              >
                <ArrowLeft className="h-4 w-4" />
                Inicio
              </button>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded" style={{backgroundColor: 'var(--details)'}}></div>
                <span className="text-lg font-semibold" style={{color: 'var(--main-title)'}}>
                  Calculadora de Finiquito e Indemnización
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{color: 'var(--main-title)'}}>
            Calculadora Unificada
          </h1>
          <p style={{color: 'var(--gray)'}}>
            Ingrese los datos para calcular el monto correspondiente a su finiquito o indemnización.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Datos Iniciales */}
            <div className="p-6 rounded-lg border" style={{backgroundColor: 'var(--section-light-90)', borderColor: 'var(--brackets)'}}>
              <h2 className="text-xl font-semibold mb-6" style={{color: 'var(--main-text)'}}>
                Datos Iniciales
              </h2>
              
              {/* Primera fila */}
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: 'var(--labels)'}}>
                    Salario diario (MXN)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={salarioDiario}
                    onChange={(e) => setSalarioDiario(parseFloat(e.target.value) || 0)}
                    placeholder="Ej: 500.00"
                    className="w-full p-3 border rounded-md"
                    style={{backgroundColor: 'var(--main-bg-90)', borderColor: 'var(--brackets)', color: 'var(--main-text)'}}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: 'var(--labels)'}}>
                    Fecha de ingreso
                  </label>
                  <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="w-full p-3 border rounded-md"
                    style={{backgroundColor: 'var(--main-bg-90)', borderColor: 'var(--brackets)', color: 'var(--main-text)'}}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: 'var(--labels)'}}>
                    Fecha de salida
                  </label>
                  <input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="w-full p-3 border rounded-md"
                    style={{backgroundColor: 'var(--main-bg-90)', borderColor: 'var(--brackets)', color: 'var(--main-text)'}}
                  />
                </div>
              </div>
              
              {/* Segunda fila */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-labels dark:text-labels-dark">
                    Días de aguinaldo
                  </label>
                  <input
                    type="number"
                    value={diasAguinaldo}
                    onChange={(e) => setDiasAguinaldo(parseInt(e.target.value) || 15)}
                    className="w-full p-3 border rounded-md bg-main-bg dark:bg-main-bg-dark-90 border-gray-300 dark:border-brackets-dark text-main-text dark:text-main-text-dark"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-labels dark:text-labels-dark">
                    Días de vacaciones
                  </label>
                  <input
                    type="number"
                    value={diasVacaciones}
                    onChange={(e) => setDiasVacaciones(parseInt(e.target.value) || 12)}
                    className="w-full p-3 border rounded-md bg-main-bg dark:bg-main-bg-dark-90 border-gray-300 dark:border-brackets-dark text-main-text dark:text-main-text-dark"
                  />
                  <p className="text-xs mt-1 text-labels dark:text-labels-dark">
                    Se calcula automáticamente, pero puedes editarlo
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-labels dark:text-labels-dark">
                    Salario mínimo vigente
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={salarioMinimo}
                    onChange={(e) => setSalarioMinimo(parseFloat(e.target.value) || 278.80)}
                    className="w-full p-3 border rounded-md bg-main-bg dark:bg-main-bg-dark-90 border-gray-300 dark:border-brackets-dark text-main-text dark:text-main-text-dark"
                  />
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b" style={{borderColor: 'var(--brackets)'}}>
              <div className="flex">
                <button
                  onClick={() => setActiveTab('finiquito')}
                  className="px-6 py-3 font-medium border-b-2 transition-colors"
                  style={{
                    borderBottomColor: activeTab === 'finiquito' ? 'var(--details)' : 'transparent',
                    color: activeTab === 'finiquito' ? 'var(--details)' : 'var(--gray)'
                  }}
                >
                  Finiquito
                </button>
                <button
                  onClick={() => setActiveTab('indemnizacion')}
                  className="px-6 py-3 font-medium border-b-2 transition-colors"
                  style={{
                    borderBottomColor: activeTab === 'indemnizacion' ? 'var(--details)' : 'transparent',
                    color: activeTab === 'indemnizacion' ? 'var(--details)' : 'var(--gray)'
                  }}
                >
                  Indemnización
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6 rounded-lg border" style={{backgroundColor: 'var(--section-light-90)', borderColor: 'var(--brackets)'}}>
              {activeTab === 'finiquito' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-labels dark:text-labels-dark">
                      Días trabajados no pagados
                    </label>
                    <input
                      type="number"
                      value={diasTrabajadosNoPagados}
                      onChange={(e) => setDiasTrabajadosNoPagados(parseFloat(e.target.value) || 0)}
                      placeholder="Ej: 10"
                      className="w-full p-3 border rounded-md bg-main-bg dark:bg-main-bg-dark-90 border-gray-300 dark:border-brackets-dark text-main-text dark:text-main-text-dark"
                    />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="incluirBonos"
                      checked={incluirBonos}
                      onChange={(e) => setIncluirBonos(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <label htmlFor="incluirBonos" className="text-sm text-labels dark:text-labels-dark">
                      Incluir bonos y comisiones pendientes
                    </label>
                  </div>

                  {incluirBonos && (
                    <div>
                      <label className="block text-sm font-medium mb-2 text-labels dark:text-labels-dark">
                        Monto de bonos/comisiones pendientes
                      </label>
                      <input
                        type="number"
                        value={montoBonos}
                        onChange={(e) => setMontoBonos(parseFloat(e.target.value) || 0)}
                        placeholder="Ej: 5000"
                        className="w-full p-3 border rounded-md bg-main-bg dark:bg-main-bg-dark-90 border-gray-300 dark:border-brackets-dark text-main-text dark:text-main-text-dark"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-labels dark:text-labels-dark">
                      Tipo de acción
                    </label>
                    <select
                      value={tipoAccion}
                      onChange={(e) => setTipoAccion(e.target.value)}
                      className="w-full p-3 border rounded-md bg-main-bg dark:bg-main-bg-dark-90 border-gray-300 dark:border-brackets-dark text-main-text dark:text-main-text-dark"
                    >
                      <option value="indemnizacion">Indemnización</option>
                      <option value="reinstalacion">Reinstalación</option>
                    </select>
                  </div>
                  
                  {/* Sección de Extras */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-main-text dark:text-main-text-dark">Conceptos Extras</h4>
                      <button
                        onClick={() => setExtras([...extras, { id: Date.now(), concepto: '', monto: 0, periodicidad: 'mensual' }])}
                        className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors hover:opacity-90 bg-btn dark:bg-btn-dark"
                      >
                        <span className="text-sm">+</span>
                        Agregar Extra
                      </button>
                    </div>
                    
                    {extras.length > 0 && (
                      <div className="space-y-3">
                        {extras.map((extra) => (
                          <div key={extra.id} className="flex gap-3 items-center">
                            <input
                              type="text"
                              placeholder="Concepto (ej: Vales de despensa)"
                              value={extra.concepto}
                              onChange={e => setExtras(extras.map(ex => ex.id === extra.id ? {...ex, concepto: e.target.value} : ex))}
                              className="flex-1 p-2 border rounded-md bg-main-bg dark:bg-main-bg-dark-90 border-gray-300 dark:border-brackets-dark text-main-text dark:text-main-text-dark"
                            />
                            <select
                              value={extra.periodicidad}
                              onChange={e => setExtras(extras.map(ex => ex.id === extra.id ? {...ex, periodicidad: e.target.value} : ex))}
                              className="w-28 p-2 border rounded-md bg-main-bg dark:bg-main-bg-dark-90 border-gray-300 dark:border-brackets-dark text-main-text dark:text-main-text-dark"
                            >
                              <option value="mensual">Mensual</option>
                              <option value="quincenal">Quincenal</option>
                              <option value="semanal">Semanal</option>
                              <option value="diario">Diario</option>
                            </select>
                            <input
                              type="number"
                              placeholder="Monto"
                              value={extra.monto}
                              onChange={e => setExtras(extras.map(ex => ex.id === extra.id ? {...ex, monto: Number(e.target.value)} : ex))}
                              className="w-24 p-2 border rounded-md bg-main-bg dark:bg-main-bg-dark-90 border-gray-300 dark:border-brackets-dark text-main-text dark:text-main-text-dark"
                            />
                            <button
                              onClick={() => setExtras(extras.filter(ex => ex.id !== extra.id))}
                              className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        <div className="mt-3 p-3 rounded-lg bg-card-code dark:bg-card-code-dark">
                          <p className="text-sm font-medium text-main-text dark:text-main-text-dark">
                            Total extras diarios: <span className="text-details">${calculos.totalExtrasDiarios?.toFixed(2) || '0.00'}</span>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Summary */}
          <div className="lg:col-span-1">
            <div className="p-6 rounded-lg border sticky top-8" style={{backgroundColor: 'var(--section-light-90)', borderColor: 'var(--brackets)'}}>
              <h3 className="text-xl font-semibold mb-6" style={{color: 'var(--main-text)'}}>
                Resumen de Cálculo
              </h3>
              
              <div className="space-y-4">
                {activeTab === 'finiquito' ? (
                  <>
                    <div className="flex justify-between">
                      <span style={{color: 'var(--labels)'}}>Salario diario base:</span>
                      <span style={{color: 'var(--main-text)'}}>${salarioDiario.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{color: 'var(--labels)'}}>Aguinaldo proporcional:</span>
                      <span style={{color: 'var(--main-text)'}}>${results.aguinaldo?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-labels dark:text-labels-dark">Vacaciones:</span>
                      <span className="text-main-text dark:text-main-text-dark">${results.vacaciones?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-labels dark:text-labels-dark">Prima vacacional (25%):</span>
                      <span className="text-main-text dark:text-main-text-dark">${results.primaVacacional?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-labels dark:text-labels-dark">Días no pagados:</span>
                      <span className="text-main-text dark:text-main-text-dark">${results.diasNoPagados?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-labels dark:text-labels-dark">Bonos pendientes:</span>
                      <span className="text-main-text dark:text-main-text-dark">${results.bonosPendientes?.toFixed(2) || '0.00'}</span>
                    </div>
                    {results.añosAntiguedad >= 15 && (
                      <div className="flex justify-between">
                        <span className="text-labels dark:text-labels-dark">Prima de antigüedad:</span>
                        <span className="text-main-text dark:text-main-text-dark">${results.primaAntiguedad?.toFixed(2) || '0.00'}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-labels dark:text-labels-dark">Salario diario base:</span>
                      <span className="text-main-text dark:text-main-text-dark">${salarioDiario.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-labels dark:text-labels-dark">Salario diario integrado:</span>
                      <span className="text-main-text dark:text-main-text-dark">${results.salarioDiarioIntegrado?.toFixed(2) || salarioDiario.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-labels dark:text-labels-dark">Aguinaldo:</span>
                      <span className="text-main-text dark:text-main-text-dark">${results.aguinaldo?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-labels dark:text-labels-dark">Vacaciones:</span>
                      <span className="text-main-text dark:text-main-text-dark">${results.vacaciones?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-labels dark:text-labels-dark">Prima vacacional:</span>
                      <span className="text-main-text dark:text-main-text-dark">${results.primaVacacional?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-labels dark:text-labels-dark">Prima de antigüedad:</span>
                      <span className="text-main-text dark:text-main-text-dark">${results.primaAntiguedad?.toFixed(2) || '0.00'}</span>
                    </div>
                    {tipoAccion === 'indemnizacion' ? (
                      <>
                        <div className="flex justify-between">
                          <span className="text-labels dark:text-labels-dark">Indemnización (45 días):</span>
                          <span className="text-main-text dark:text-main-text-dark">${results.indemnizacion45?.toFixed(2) || '0.00'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-labels dark:text-labels-dark">Indemnización (90 días):</span>
                          <span className="text-main-text dark:text-main-text-dark">${results.indemnizacion90?.toFixed(2) || '0.00'}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between">
                        <span className="text-labels dark:text-labels-dark">Reinstalación:</span>
                        <span className="text-main-text dark:text-main-text-dark">${results.reinstalacion?.toFixed(2) || '0.00'}</span>
                      </div>
                    )}
                  </>
                )}
                
                <div className="border-t pt-4" style={{borderColor: 'var(--brackets)'}}>
                  {activeTab === 'finiquito' ? (
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold" style={{color: 'var(--main-text)'}}>
                        TOTAL A RECIBIR:
                      </span>
                      <span className="text-2xl font-bold" style={{color: 'var(--subtitle)'}}>
                        ${results.total?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {tipoAccion === 'indemnizacion' ? (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-main-text dark:text-main-text-dark">TOTAL (45 días):</span>
                            <span className="text-xl font-bold text-subtitle dark:text-subtitle-dark">
                              ${results.totalFiniquito45?.toFixed(2) || '0.00'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-main-text dark:text-main-text-dark">TOTAL (90 días):</span>
                            <span className="text-xl font-bold text-subtitle dark:text-subtitle-dark">
                              ${results.totalFiniquito90?.toFixed(2) || '0.00'}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-main-text dark:text-main-text-dark">TOTAL REINSTALACIÓN:</span>
                          <span className="text-2xl font-bold text-subtitle dark:text-subtitle-dark">
                            ${results.totalFiniquito45?.toFixed(2) || '0.00'}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-3 pt-4">
                  <button
                    onClick={descargarReporte}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-white font-semibold rounded-md transition-colors hover:opacity-90 bg-btn dark:bg-btn-dark"
                  >
                    <Download className="h-4 w-4" />
                    Descargar PDF
                  </button>
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 font-semibold rounded-md transition-colors hover:opacity-90 border border-btn text-btn dark:border-btn-dark dark:text-btn-dark"
                  >
                    <span className="text-sm">📊</span>
                    {showDetails ? 'Ocultar Detalles' : 'Ver Detalles'}
                  </button>
                </div>
              </div>

              {/* Sección de Detalles */}
              {showDetails && (
                <div className="mt-6 p-4 rounded-lg border bg-card-code dark:bg-card-code-dark border-gray-300 dark:border-brackets-dark">
                  <h4 className="text-lg font-semibold mb-4 text-main-text dark:text-main-text-dark">
                    📊 Detalles de Cálculos
                  </h4>
                  <div className="space-y-3 text-sm">
                    {activeTab === 'finiquito' ? (
                      <>
                        <div className="p-3 rounded bg-main-bg dark:bg-main-bg-dark-90">
                          <strong className="text-main-text dark:text-main-text-dark">Aguinaldo:</strong>
                          <p className="text-labels dark:text-labels-dark">({diasAguinaldo} días ÷ 365) × {diasTrabajadosAnio} días × ${salarioDiario.toFixed(2)} = ${results.aguinaldo}</p>
                        </div>
                        <div className="p-3 rounded bg-main-bg dark:bg-main-bg-dark-90">
                          <strong className="text-main-text dark:text-main-text-dark">Vacaciones:</strong>
                          <p className="text-labels dark:text-labels-dark">({diasVacaciones} días ÷ 365) × {results.diasVacacionesTrabajados || 0} días × ${salarioDiario.toFixed(2)} = ${results.vacaciones}</p>
                        </div>
                        <div className="p-3 rounded bg-main-bg dark:bg-main-bg-dark-90">
                          <strong className="text-main-text dark:text-main-text-dark">Prima Vacacional:</strong>
                          <p className="text-labels dark:text-labels-dark">${results.vacaciones} ÷ 4 (25%) = ${results.primaVacacional}</p>
                        </div>
                        {diasTrabajadosNoPagados > 0 && (
                          <div className="p-3 rounded bg-main-bg dark:bg-main-bg-dark-90">
                            <strong className="text-main-text dark:text-main-text-dark">Días No Pagados:</strong>
                            <p className="text-labels dark:text-labels-dark">{diasTrabajadosNoPagados} días × ${salarioDiario.toFixed(2)} = ${results.diasNoPagados}</p>
                          </div>
                        )}
                        {results.añosAntiguedad >= 15 && (
                          <div className="p-3 rounded bg-main-bg dark:bg-main-bg-dark-90">
                            <strong className="text-main-text dark:text-main-text-dark">Prima de Antigüedad:</strong>
                            <p className="text-labels dark:text-labels-dark">(12 ÷ 365) × {diasTrabajados} × ${(salarioMinimo * 2).toFixed(2)} = ${results.primaAntiguedad?.toFixed(2) || '0.00'}</p>
                            <p className="text-xs mt-1 text-subtitle dark:text-subtitle-dark">* Obligatoria para antigüedad ≥ 15 años ({results.añosAntiguedad?.toFixed(1)} años)</p>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="p-3 rounded bg-main-bg dark:bg-main-bg-dark-90">
                          <strong className="text-main-text dark:text-main-text-dark">Salario Integrado:</strong>
                          <p className="text-labels dark:text-labels-dark">${salarioDiario.toFixed(2)} (base) + ${results.totalExtrasDiarios?.toFixed(2) || '0.00'} (extras) = ${results.salarioDiarioIntegrado?.toFixed(2) || salarioDiario.toFixed(2)}</p>
                        </div>
                        <div className="p-3 rounded bg-main-bg dark:bg-main-bg-dark-90">
                          <strong className="text-main-text dark:text-main-text-dark">Aguinaldo:</strong>
                          <p className="text-labels dark:text-labels-dark">({diasAguinaldo} ÷ 365) × {diasTrabajadosAnio} × ${salarioDiario.toFixed(2)} = ${results.aguinaldo?.toFixed(2) || '0.00'}</p>
                        </div>
                        <div className="p-3 rounded bg-main-bg dark:bg-main-bg-dark-90">
                          <strong className="text-main-text dark:text-main-text-dark">Vacaciones:</strong>
                          <p className="text-labels dark:text-labels-dark">({diasVacaciones} ÷ 365) × {diasVacacionesTrabajados} × ${salarioDiario.toFixed(2)} = ${results.vacaciones?.toFixed(2) || '0.00'}</p>
                        </div>
                        <div className="p-3 rounded bg-main-bg dark:bg-main-bg-dark-90">
                          <strong className="text-main-text dark:text-main-text-dark">Prima Vacacional:</strong>
                          <p className="text-labels dark:text-labels-dark">${results.vacaciones?.toFixed(2) || '0.00'} ÷ 4 = ${results.primaVacacional?.toFixed(2) || '0.00'}</p>
                        </div>
                        {tipoAccion === 'indemnizacion' ? (
                          <>
                            <div className="p-3 rounded bg-main-bg dark:bg-main-bg-dark-90">
                              <strong className="text-main-text dark:text-main-text-dark">Indemnización 45 días:</strong>
                              <p className="text-labels dark:text-labels-dark">45 × ${results.salarioDiarioIntegrado?.toFixed(2) || salarioDiario.toFixed(2)} = ${results.indemnizacion45?.toFixed(2) || '0.00'}</p>
                            </div>
                            <div className="p-3 rounded bg-main-bg dark:bg-main-bg-dark-90">
                              <strong className="text-main-text dark:text-main-text-dark">Indemnización 90 días:</strong>
                              <p className="text-labels dark:text-labels-dark">90 × ${results.salarioDiarioIntegrado?.toFixed(2) || salarioDiario.toFixed(2)} = ${results.indemnizacion90?.toFixed(2) || '0.00'}</p>
                            </div>
                          </>
                        ) : (
                          <div className="p-3 rounded bg-main-bg dark:bg-main-bg-dark-90">
                            <strong className="text-main-text dark:text-main-text-dark">Reinstalación:</strong>
                            <p className="text-labels dark:text-labels-dark">{Math.floor(diasTrabajados / 365)} años × 20 días × ${results.salarioDiarioIntegrado?.toFixed(2) || salarioDiario.toFixed(2)} = ${results.reinstalacion?.toFixed(2) || '0.00'}</p>
                          </div>
                        )}
                        <div className="p-3 rounded bg-main-bg dark:bg-main-bg-dark-90">
                          <strong className="text-main-text dark:text-main-text-dark">Prima de Antigüedad:</strong>
                          <p className="text-labels dark:text-labels-dark">(12 ÷ 365) × {diasTrabajados} × ${(salarioMinimo * 2).toFixed(2)} = ${results.primaAntiguedad?.toFixed(2) || '0.00'}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedCalculator;