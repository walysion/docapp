import React from 'react';
import { Scale, Trash2, Plus, Share2 } from 'lucide-react';

export default function Header({ 
  isPro, 
  pagesCount, 
  onClear, 
  onAddFiles, 
  onOpenExport 
}) {
  return (
    <header className="bg-slate-800 border-b border-slate-700/60 px-6 py-3.5 flex justify-between items-center shadow-lg z-10 shrink-0">
      <div className="flex items-center gap-3.5">
        <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/25">
          <Scale className="text-white w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold tracking-tight text-white leading-none">DocApp Legal</h1>
            {isPro ? (
              <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-bold rounded tracking-wider">
                PRO
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-slate-700 text-slate-300 text-[10px] font-semibold rounded">
                FREE
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">Foliador y Compilador de Expedientes</p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {pagesCount > 0 && (
          <button 
            onClick={onClear} 
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-700 hover:bg-red-600 transition text-slate-200 hover:text-white rounded-lg text-xs font-medium border border-slate-600 hover:border-red-500"
          >
            <Trash2 className="w-3.5 h-3.5" /> Limpiar
          </button>
        )}
        <button 
          onClick={onAddFiles} 
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-700 hover:bg-slate-600 transition text-white rounded-lg text-xs font-medium border border-slate-600"
        >
          <Plus className="w-3.5 h-3.5" /> Añadir Hojas
        </button>
        <button 
          onClick={onOpenExport} 
          disabled={pagesCount === 0}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 transition text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/20 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Share2 className="w-3.5 h-3.5" /> Exportar
        </button>
      </div>
    </header>
  );
}