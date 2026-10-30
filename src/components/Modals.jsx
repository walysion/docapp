import React, { useState } from 'react';
import { 
  X, Check, Lock, Download, Archive, 
  ShieldAlert, ArrowLeft, Key, Eye, Scale 
} from 'lucide-react';
import { checkPasswordStrength } from '../utils/cryptoService';

export default function Modals({
  activeModal,
  onClose,
  isPro,
  onActivateLicense,
  onExportMaster,
  onExportZip,
  onExportVault,
  onSwitchToPasswordModal
}) {
  const [licenseKeyInput, setLicenseKeyInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const passStrength = checkPasswordStrength(passwordInput);

  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      
      {/* 1. MODAL PLANES Y PRECIOS */}
      {activeModal === 'pricing' && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-2xl w-full shadow-2xl relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-white">Planes y Licencias B2B</h2>
            <p className="text-xs text-slate-400 mt-1">
              Herramienta privada diseñada para expedientes judiciales, notarías y gestión pública.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            
            {/* Pase 24 Horas */}
            <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between hover:border-slate-500 transition">
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Uso Temporal</span>
                <h3 className="font-bold text-white text-sm mt-1">Pase 24 Horas</h3>
                <div className="mt-2 mb-3">
                  <span className="text-2xl font-extrabold text-white">$2</span>
                  <span className="text-xs text-slate-400"> USD</span>
                </div>
                <ul className="text-[11px] text-slate-300 space-y-1.5">
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Sin límite de hojas</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Foliado OJV completo</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Acceso por 1 día</li>
                </ul>
              </div>
              <button 
                onClick={() => window.open('https://tu-link-de-pago.com/pase24h', '_blank')} 
                className="mt-4 w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold transition"
              >
                Comprar Pase
              </button>
            </div>

            {/* Mensual */}
            <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between hover:border-slate-500 transition">
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Suscripción Flexible</span>
                <h3 className="font-bold text-white text-sm mt-1">Mensual</h3>
                <div className="mt-2 mb-3">
                  <span className="text-2xl font-extrabold text-white">$5</span>
                  <span className="text-xs text-slate-400"> USD/mes</span>
                </div>
                <ul className="text-[11px] text-slate-300 space-y-1.5">
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Hojas ilimitadas</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Bóvedas AES-GCM</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Cancela cuando quieras</li>
                </ul>
              </div>
              <button 
                onClick={() => window.open('https://tu-link-de-pago.com/mensual', '_blank')} 
                className="mt-4 w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold transition"
              >
                Suscribir
              </button>
            </div>

            {/* Anual (Reemplaza a Vitalicia) */}
            <div className="bg-gradient-to-b from-indigo-950/60 to-slate-900 border-2 border-indigo-500 rounded-xl p-4 flex flex-col justify-between shadow-lg shadow-indigo-500/10 relative">
              <span className="absolute -top-2.5 right-3 bg-indigo-600 text-[10px] font-bold text-white px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                Ahorra 35%
              </span>
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Corporativo</span>
                <h3 className="font-bold text-white text-sm mt-1">Plan Anual</h3>
                <div className="mt-2 mb-3">
                  <span className="text-2xl font-extrabold text-white">$39</span>
                  <span className="text-xs text-slate-400"> USD/año</span>
                </div>
                <ul className="text-[11px] text-slate-300 space-y-1.5">
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Todo incluido sin límites</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Equivale a $3.25/mes</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Facturación formal y SLA</li>
                </ul>
              </div>
              <button 
                onClick={() => window.open('https://tu-link-de-pago.com/anual', '_blank')} 
                className="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition shadow-md shadow-indigo-600/30"
              >
                Obtener Licencia Anual
              </button>
            </div>

          </div>

          {/* Validador de Licencia */}
          <div className="border-t border-slate-700/80 pt-4">
            <p className="text-xs text-slate-400 mb-2 font-medium">¿Ya recibiste tu clave por correo? Ingrésala aquí:</p>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={licenseKeyInput}
                onChange={(e) => setLicenseKeyInput(e.target.value)}
                placeholder="Ej: DOCAPP-PRO-LEGAL" 
                className="flex-1 bg-slate-900 border border-slate-700 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 uppercase"
              />
              <button 
                onClick={() => onActivateLicense(licenseKeyInput)} 
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold rounded-lg transition"
              >
                Activar Licencia
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. MODAL EXPORTAR */}
      {activeModal === 'export' && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
          
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Download className="text-indigo-400 w-5 h-5" /> Exportar Expediente
          </h2>

          <div className="space-y-3">
            <button 
              onClick={onExportMaster}
              className="w-full flex items-center justify-between p-3.5 bg-slate-900/80 hover:bg-indigo-950/40 border border-slate-700 hover:border-indigo-500/80 rounded-xl transition text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-indigo-600 transition text-indigo-400 group-hover:text-white">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-xs">Expediente PDF Master</h3>
                  <p className="text-[11px] text-slate-400">Consolidado con foliado y marcas.</p>
                </div>
              </div>
            </button>

            <button 
              onClick={isPro ? onExportZip : () => onActivateLicense(null)}
              className="w-full flex items-center justify-between p-3.5 bg-slate-900/80 hover:bg-emerald-950/30 border border-slate-700 hover:border-emerald-500/80 rounded-xl transition text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-emerald-600 transition text-emerald-400 group-hover:text-white relative">
                  <Archive className="w-4 h-4" />
                  {!isPro && <Lock className="w-2.5 h-2.5 absolute -top-1 -right-1 text-amber-400" />}
                </div>
                <div>
                  <h3 className="font-semibold text-white text-xs">Archivo Comprimido (ZIP)</h3>
                  <p className="text-[11px] text-slate-400">PDFs individuales numerados.</p>
                </div>
              </div>
            </button>

            <button 
              onClick={isPro ? onSwitchToPasswordModal : () => onActivateLicense(null)}
              className="w-full flex items-center justify-between p-3.5 bg-slate-900/80 hover:bg-amber-950/30 border border-slate-700 hover:border-amber-500/80 rounded-xl transition text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-amber-600 transition text-amber-400 group-hover:text-white relative">
                  <ShieldAlert className="w-4 h-4" />
                  {!isPro && <Lock className="w-2.5 h-2.5 absolute -top-1 -right-1 text-amber-400" />}
                </div>
                <div>
                  <h3 className="font-semibold text-white text-xs">Bóveda Cifrada (.ENC)</h3>
                  <p className="text-[11px] text-slate-400">WebCrypto AES-256-GCM anti-fuerza bruta.</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* 3. MODAL CONTRASEÑA CIFRADO */}
      {activeModal === 'password' && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative">
          <button onClick={() => onSwitchToPasswordModal(true)} className="absolute top-4 right-4 text-slate-400 hover:text-white transition">
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <Key className="text-amber-400 w-4 h-4" /> Clave de Cifrado
          </h2>
          <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
            Se aplicarán 600.000 iteraciones PBKDF2 y AES-GCM. Si olvidas esta clave, el archivo no se podrá abrir.
          </p>

          <input 
            type="password" 
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="Mínimo 10 caracteres" 
            className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-lg px-3 py-2.5 mb-2 focus:outline-none focus:border-amber-500"
          />

          <div className="w-full bg-slate-700 h-1.5 rounded-full mb-4 overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${passStrength.score < 40 ? 'bg-red-500' : passStrength.score < 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ width: `${passStrength.score}%` }}
            ></div>
          </div>

          <button 
            disabled={!passStrength.isValid}
            onClick={() => onExportVault(passwordInput)}
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold transition shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Cifrar y Descargar Bóveda
          </button>
        </div>
      )}

      {/* 4. MODAL PRIVACIDAD / CÓMO VERIFICAR */}
      {activeModal === 'privacy' && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
          
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <Eye className="text-emerald-400 w-5 h-5" /> Arquitectura Zero-Trust
          </h2>
          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <p>
              DocApp opera completamente en tu navegador (Client-Side). No tenemos servidores de procesamiento ni base de datos donde almacenar tus expedientes.
            </p>
            <div className="p-3.5 bg-slate-900 border border-slate-700/80 rounded-xl space-y-2">
              <h4 className="font-bold text-white text-xs">Paso a paso para auditar el tráfico:</h4>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-400 text-[11px]">
                <li>Presiona <kbd className="bg-slate-800 px-1 py-0.5 rounded border border-slate-700 text-slate-300">F12</kbd> en tu teclado.</li>
                <li>Dirígete a la pestaña <strong>Network</strong> (Red).</li>
                <li>Arrastra un PDF y procésalo. Verás que no hay ninguna petición de subida (upload) hacia ningún servidor.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL LEGAL / SLA */}
      {activeModal === 'legal' && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-xl w-full shadow-2xl relative max-h-[85vh] flex flex-col">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2 shrink-0">
            <Scale className="text-indigo-400 w-5 h-5" /> Términos Legales y SLA
          </h2>

          <div className="overflow-y-auto space-y-4 text-xs text-slate-300 pr-2">
            <div className="p-3 bg-emerald-950/20 border border-emerald-800/40 rounded-xl text-emerald-300">
              <strong>Cumplimiento Normativo (Chile - Ley 21.719):</strong> Al procesar los datos enteramente en la memoria RAM del usuario, DocApp no recopila ni custodia datos de carácter personal.
            </div>
            <div>
              <h4 className="font-bold text-white mb-1">Responsabilidad del Usuario</h4>
              <p className="text-slate-400">El usuario es responsable exclusivo del contenido de los documentos foliados y de la custodia de sus contraseñas criptográficas.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-1">Ausencia de Puertas Traseras</h4>
              <p className="text-slate-400">DocApp no almacena copias de respaldo ni llaves de recuperación para las Bóvedas .ENC.</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}