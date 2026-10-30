import React from 'react';
import { Settings2, FilePlus, Lock } from 'lucide-react';

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
    <aside className="w-72 bg-slate-800/80 border-r border-slate-700/60 flex flex-col p-5 overflow-y-auto shrink-0 z-10 select-none">
      <h2 className="text-xs font-semibold mb-4 flex items-center gap-2 text-slate-400 uppercase tracking-wider">
        <Settings2 className="w-3.5 h-3.5 text-indigo-400" /> Herramientas
      </h2>

      <div className="space-y-4 flex-1">
        {/* Herramienta Base */}
        <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-700/60">
          <h3 className="font-semibold text-white mb-2 text-xs">Estructura</h3>
          <button 
            onClick={onAddBlankPage}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 transition rounded-lg text-xs font-medium text-slate-200"
          >
            <FilePlus className="w-3.5 h-3.5" /> Insertar Hoja Blanca
          </button>
        </div>

        {/* Automatización Legal (PRO) */}
        <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-700/60">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-xs text-amber-400 uppercase flex items-center gap-1.5">
              <Lock className="w-3 h-3" /> Automatización PRO
            </h3>
            {!isPro && (
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
                Bloqueado
              </span>
            )}
          </div>

          <div className="space-y-3">
            <div 
              onClick={() => handleToggle(setFolioEnabled, folioEnabled)} 
              className="flex items-center justify-between cursor-pointer group"
            >
              <span className="text-xs text-slate-300 group-hover:text-white transition">Foliar páginas (F. 001)</span>
              <div className={`w-9 h-5 flex items-center rounded-full p-1 duration-300 cursor-pointer ${folioEnabled && isPro ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform duration-300 ${folioEnabled && isPro ? 'translate-x-4' : ''}`}></div>
              </div>
            </div>

            <div 
              onClick={() => handleToggle(setWatermarkEnabled, watermarkEnabled)} 
              className="flex items-center justify-between cursor-pointer group"
            >
              <span className="text-xs text-slate-300 group-hover:text-white transition">Marca CONFIDENCIAL</span>
              <div className={`w-9 h-5 flex items-center rounded-full p-1 duration-300 cursor-pointer ${watermarkEnabled && isPro ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform duration-300 ${watermarkEnabled && isPro ? 'translate-x-4' : ''}`}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contador de Hojas */}
      {pagesCount > 0 && (
        <div className="mt-4 p-3.5 bg-slate-900/80 rounded-xl border border-slate-700/60">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">Hojas cargadas:</span>
            <span className={`font-bold ${!isPro && pagesCount >= maxFreePages ? 'text-amber-400' : 'text-indigo-400'}`}>
              {pagesCount} {!isPro && `/ ${maxFreePages}`}
            </span>
          </div>
        </div>
      )}

      {/* Banner de Estado Freemium */}
      <div 
        onClick={onOpenPricing} 
        className="mt-3 p-3.5 bg-gradient-to-br from-slate-900 to-indigo-950/60 border border-indigo-500/30 rounded-xl cursor-pointer hover:border-indigo-400/50 transition group"
      >
        <div className="flex justify-between items-center mb-1">
          <span className="text-[11px] font-bold text-slate-300">Plan Actual</span>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isPro ? 'bg-amber-500 text-slate-900' : 'bg-slate-700 text-slate-300'}`}>
            {isPro ? 'PRO Activo' : 'Básico'}
          </span>
        </div>
        <p className="text-[10px] text-slate-400 leading-tight">
          {isPro ? 'Licencia activa con soporte corporativo.' : 'Haz clic para ver pases diarios, mensuales o vitalicios.'}
        </p>
      </div>
    </aside>
  );
}