import React from 'react';
import { Scale, Trash2, Plus, Download, ShieldCheck, HardDrive } from 'lucide-react';

export default function Header({ 
  isPro, 
  pagesCount, 
  onClear, 
  onAddFiles, 
  onOpenExport,
  onOpenPricing
}) {
  return (
    <header className="bg-slate-900/90 border-b border-slate-800 px-6 py-3 flex justify-between items-center shadow-md z-10 shrink-0 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl shadow-lg shadow-indigo-600/20 border border-indigo-400/20">
          <Scale className="text-white w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-base font-bold tracking-tight text-white leading-none">DocApp Legal</h1>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full border border-slate-700 bg-slate-800/80 text-slate-300">
              v3.2 Enterprise
            </span>
            {isPro ? (
              <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[10px] font-black rounded tracking-wider shadow-sm">
                LICENCIA PRO
              </span>
            ) : (
              <button 
                onClick={onOpenPricing}
                className="px-2 py-0.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-semibold rounded transition"
              >
                MODO LIBRE (MÁX 25)
              </button>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Aislamiento Local Activo
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1 text-slate-400">
              <HardDrive className="w-3 h-3 text-slate-500" /> Cero Transferencia Externa
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {pagesCount > 0 && (
          <button 
            onClick={onClear} 
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-rose-950/40 hover:text-rose-300 transition text-slate-300 rounded-lg text-xs font-medium border border-slate-700 hover:border-rose-800/60"
            title="Borrar todas las fojas"
          >
            <Trash2 className="w-3.5 h-3.5" /> Limpiar Mesa
          </button>
        )}
        <button 
          onClick={onAddFiles} 
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 transition text-white rounded-lg text-xs font-semibold border border-slate-700 shadow-sm"
        >
          <Plus className="w-4 h-4 text-indigo-400" /> Añadir Fojas
        </button>
        
        {/* Botón Principal de Exportar */}
        <button 
          onClick={onOpenExport} 
          disabled={pagesCount === 0}
          className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 transition text-white rounded-lg text-xs font-bold shadow-lg shadow-indigo-600/25 disabled:opacity-40 disabled:cursor-not-allowed border border-indigo-400/30"
          title={pagesCount === 0 ? "Agrega al menos una foja para exportar" : "Opciones de descarga, ZIP, cifrado y correo"}
        >
          <Download className="w-4 h-4" /> Exportar Expediente
        </button>
      </div>
    </header>
  );
}