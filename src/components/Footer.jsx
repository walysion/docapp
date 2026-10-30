import React from 'react';
import { ShieldCheck, Scale, FileText, Compass, ExternalLink } from 'lucide-react';

export default function Footer({ onOpenModal }) {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 px-6 py-2.5 flex flex-col md:flex-row justify-between items-center text-[11px] text-slate-400 shrink-0 gap-2">
      <div className="flex items-center gap-3">
        <span className="font-semibold text-slate-300">&copy; 2026 DocApp Legal Tech</span>
        <span className="text-slate-700 hidden sm:inline">|</span>
        <span className="hidden sm:inline text-slate-400">
          Diseñado bajo Arquitectura Zero-Knowledge para Secretos Profesionales
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs">
        <button 
          onClick={() => onOpenModal('about')} 
          className="hover:text-indigo-300 transition flex items-center gap-1 text-slate-400"
        >
          <Compass className="w-3.5 h-3.5 text-indigo-400" /> Quiénes Somos
        </button>
        <button 
          onClick={() => onOpenModal('privacy')} 
          className="hover:text-emerald-300 transition flex items-center gap-1 text-slate-400"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Auditoría de Privacidad
        </button>
        <button 
          onClick={() => onOpenModal('legal')} 
          className="hover:text-slate-200 transition flex items-center gap-1 text-slate-400"
        >
          <Scale className="w-3.5 h-3.5 text-slate-400" /> Términos y SLA Judicial
        </button>
        <button 
          onClick={() => onOpenModal('pricing')} 
          className="text-amber-400 hover:text-amber-300 font-semibold transition"
        >
          Planes y Precios
        </button>
      </div>
    </footer>
  );
}