import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

const ExtrasSection = ({ extras, setExtras, totalExtrasDiarios }) => {
  const [nuevoExtra, setNuevoExtra] = useState({
    concepto: '',
    monto: 0,
    periodicidad: 'mensual'
  });

  const agregarExtra = () => {
    if (nuevoExtra.concepto && nuevoExtra.monto > 0) {
      setExtras([...extras, { ...nuevoExtra, id: Date.now() }]);
      setNuevoExtra({ concepto: '', monto: 0, periodicidad: 'mensual' });
    }
  };

  const eliminarExtra = (id) => {
    setExtras(extras.filter(extra => extra.id !== id));
  };

  const getDivisor = (periodicidad) => {
    switch (periodicidad) {
      case 'mensual': return 30;
      case 'quincenal': return 15;
      case 'semanal': return 7;
      default: return 1;
    }
  };

  return (
    <section className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Extras Salariales</h3>
      
      {/* Agregar nuevo extra */}
      <div className="grid gap-4 md:grid-cols-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Concepto
          </label>
          <input
            type="text"
            value={nuevoExtra.concepto}
            onChange={(e) => setNuevoExtra({ ...nuevoExtra, concepto: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Ej: Bono, Comisión"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Monto
          </label>
          <input
            type="number"
            step="0.01"
            value={nuevoExtra.monto}
            onChange={(e) => setNuevoExtra({ ...nuevoExtra, monto: parseFloat(e.target.value) || 0 })}
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Periodicidad
          </label>
          <select
            value={nuevoExtra.periodicidad}
            onChange={(e) => setNuevoExtra({ ...nuevoExtra, periodicidad: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="mensual">Mensual</option>
            <option value="quincenal">Quincenal</option>
            <option value="semanal">Semanal</option>
            <option value="diario">Diario</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={agregarExtra}
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Agregar
          </button>
        </div>
      </div>

      {/* Lista de extras */}
      {extras.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-800 dark:text-white">Extras agregados:</h4>
          {extras.map((extra) => {
            const montoDiario = extra.monto / getDivisor(extra.periodicidad);
            return (
              <div key={extra.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                <div className="flex-1">
                  <span className="font-medium text-gray-800 dark:text-white">{extra.concepto}</span>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    ${extra.monto.toFixed(2)} {extra.periodicidad} = ${montoDiario.toFixed(2)} diario
                  </div>
                </div>
                <button
                  onClick={() => eliminarExtra(extra.id)}
                  className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
          
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
            <div className="flex justify-between items-center">
              <span className="font-medium text-blue-800 dark:text-blue-300">Total extras diarios:</span>
              <span className="font-bold text-blue-800 dark:text-blue-300">${totalExtrasDiarios.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {extras.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          No hay extras agregados. Los extras son pagos adicionales al salario base como bonos, comisiones, etc.
        </p>
      )}
    </section>
  );
};

export default ExtrasSection;