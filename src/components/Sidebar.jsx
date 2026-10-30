import React from 'react';
import { Settings2, FilePlus, Lock, Info } from 'lucide-react';

export default function Sidebar({
  isPro,
  pagesCount,
  maxFreePages,
  folioEnabled,
  setFolioEnabled,
  watermarkEnabled,
  setWatermarkEnabled,
  onAddBlankPage,
  onOpenPricing
}) {
  const handleToggle = (setter, currentValue) => {
    if (!isPro) {
      onOpenPricing();
      return;
    }
    setter(!currentValue);
  };

  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col p-5 overflow-y-auto shrink-0 z-10 select-none">
      <h2 className="text-xs font-semibold mb-4 flex items-center gap-2 text-slate-400 uppercase tracking-wider">
        <Settings2 className="w-4 h-4 text-indigo-400" /> Herramientas
      </h2>

      <div className="space-y-4 flex-1">
        {/* Herramienta Base */}
        <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/50">
          <h3 className="font-semibold text-white mb-2.5 text-xs">Estructura del Expediente</h3>
          <button 
            onClick={onAddBlankPage}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 transition rounded-lg text-xs font-medium text-slate-200 border border-slate-700"
          >
            <FilePlus className="w-4 h-4 text-slate-400" /> Insertar Hoja Blanca
          </button>
        </div>

        {/* Automatización Legal (PRO) con Explicaciones */}
        <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-xs text-amber-400 uppercase flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Automatización PRO
            </h3>
            {!isPro && (
              <span className="text-[10px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded font-bold border border-amber-500/20">
                Bloqueado
              </span>
            )}
          </div>

          <div className="space-y-5">
            {/* Toggle Foliado */}
            <div className="group">
              <div 
                onClick={() => handleToggle(setFolioEnabled, folioEnabled)} 
                className="flex items-center justify-between cursor-pointer mb-1.5"
              >
                <span className="text-xs font-medium text-slate-200 group-hover:text-white transition">Foliar páginas (F. 001)</span>
                <div className={`w-9 h-5 flex items-center rounded-full p-1 duration-300 cursor-pointer ${folioEnabled && isPro ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                  <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform duration-300 ${folioEnabled && isPro ? 'translate-x-4' : ''}`}></div>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight flex items-start gap-1">
                <Info className="w-3 h-3 text-slate-500 shrink-0 mt-0.5" />
                Estampa numeración correlativa en la esquina superior derecha (Estándar Oficina Judicial Virtual).
              </p>
            </div>

            {/* Toggle Marca de Agua */}
            <div className="group">
              <div 
                onClick={() => handleToggle(setWatermarkEnabled, watermarkEnabled)} 
                className="flex items-center justify-between cursor-pointer mb-1.5"
              >
                <span className="text-xs font-medium text-slate-200 group-hover:text-white transition">Marca CONFIDENCIAL</span>
                <div className={`w-9 h-5 flex items-center rounded-full p-1 duration-300 cursor-pointer ${watermarkEnabled && isPro ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                  <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform duration-300 ${watermarkEnabled && isPro ? 'translate-x-4' : ''}`}></div>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight flex items-start gap-1">
                <Info className="w-3 h-3 text-slate-500 shrink-0 mt-0.5" />
                Aplica un sello rojo diagonal translúcido en el centro de todas las fojas para prevenir filtraciones.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contador de Hojas */}
      {pagesCount > 0 && (
        <div className="mt-4 p-3.5 bg-slate-800/80 rounded-xl border border-slate-700">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-medium">Fojas en memoria:</span>
            <span className={`font-bold ${!isPro && pagesCount >= maxFreePages ? 'text-amber-400' : 'text-indigo-400'}`}>
              {pagesCount} {!isPro && `/ ${maxFreePages}`}
            </span>
          </div>
        </div>
      )}

      {/* Banner de Estado Freemium */}
      <div 
        onClick={onOpenPricing} 
        className="mt-3 p-4 bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-indigo-500/20 rounded-xl cursor-pointer hover:border-indigo-400/40 transition group"
      >
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[11px] font-bold text-slate-300">Licencia de Uso</span>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isPro ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 border border-slate-600 text-slate-300'}`}>
            {isPro ? 'PRO Activo' : 'Básico'}
          </span>
        </div>
        <p className="text-[10px] text-slate-400 leading-tight">
          {isPro ? 'Modo empresarial activo con soporte local.' : 'Haz clic para ver pases diarios y planes anuales B2B.'}
        </p>
      </div>
    </aside>
  );
}