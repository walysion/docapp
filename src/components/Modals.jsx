import React, { useState } from 'react';
import { 
  X, Check, Lock, Download, Archive, 
  ShieldAlert, ArrowLeft, Key, Scale, 
  Compass, ShieldCheck, CheckCircle2, Mail, Copy,
  HelpCircle, Files, Sparkles, BookOpen, ArrowRight,
  Shield, Layers, Eye
} from 'lucide-react';
import { checkPasswordStrength } from '../utils/cryptoService';

export default function Modals({
  activeModal,
  onClose,
  isPro,
  pagesCount,
  onActivateLicense,
  onExportMaster,
  onExportZip,
  onExportVault,
  onShareEmail,
  onCopySummary,
  onSwitchToPasswordModal
}) {
  const [licenseKeyInput, setLicenseKeyInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const passStrength = checkPasswordStrength(passwordInput);

  const handleCopyAction = () => {
    onCopySummary();
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      
      {/* 1. MODAL PLANES Y LICENCIAS */}
      {activeModal === 'pricing' && (
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-2xl w-full shadow-2xl relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-white">Planes y Licencias Profesionales</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Foliado automático, marcas de reserva y cifrado blindado para empresas, estudios jurídicos, logística y call centers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-6">
            {/* Pase 24 Horas */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between hover:border-slate-500 transition">
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Urgencias</span>
                <h3 className="font-bold text-white text-sm mt-1">Pase 24 Horas</h3>
                <div className="mt-2 mb-3">
                  <span className="text-2xl font-extrabold text-white">$2.000</span>
                  <span className="text-xs text-slate-400"> CLP</span>
                </div>
                <ul className="text-[11px] text-slate-300 space-y-1.5">
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Fojas ilimitadas</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Foliador correlativo</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Acceso por 24 horas</li>
                </ul>
              </div>
              <button 
                onClick={() => window.open('https://docapp.lemonsqueezy.com/checkout/buy/d471855d-199f-463d-ba9d-2c9662da67c3', '_blank')} 
                className="mt-4 w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                Comprar Pase
              </button>
            </div>

            {/* Mensual */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between hover:border-slate-500 transition">
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Flujo Continuo</span>
                <h3 className="font-bold text-white text-sm mt-1">Plan Mensual</h3>
                <div className="mt-2 mb-3">
                  <span className="text-2xl font-extrabold text-white">$4.990</span>
                  <span className="text-xs text-slate-400"> CLP/mes</span>
                </div>
                <ul className="text-[11px] text-slate-300 space-y-1.5">
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Expedientes ilimitados</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Desglose ZIP y .ENC</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Cancela cuando quieras</li>
                </ul>
              </div>
              <button 
                onClick={() => window.open('https://docapp.lemonsqueezy.com/checkout/buy/523ea087-70d1-4223-bdb5-1b3570a54ef7', '_blank')} 
                className="mt-4 w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                Suscribir Plan
              </button>
            </div>

            {/* Anual */}
            <div className="bg-gradient-to-b from-indigo-950/70 to-slate-900 border-2 border-indigo-500 rounded-xl p-4 flex flex-col justify-between shadow-lg shadow-indigo-500/10 relative">
              <span className="absolute -top-2.5 right-3 bg-indigo-600 text-[10px] font-bold text-white px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                Ahorra 35%
              </span>
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Corporativo</span>
                <h3 className="font-bold text-white text-sm mt-1">Plan Anual</h3>
                <div className="mt-2 mb-3">
                  <span className="text-2xl font-extrabold text-white">$39.000</span>
                  <span className="text-xs text-slate-400"> CLP/año</span>
                </div>
                <ul className="text-[11px] text-slate-300 space-y-1.5">
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Todo incluido sin topes</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Equivalente a ~$3.250/mes</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Facturación formal y SLA</li>
                </ul>
              </div>
              <button 
                onClick={() => window.open('https://docapp.lemonsqueezy.com/checkout/buy/0fcbbba4-48f4-491d-b228-c065d1c4c38e', '_blank')} 
                className="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition shadow-md shadow-indigo-600/30 cursor-pointer"
              >
                Activar Plan Anual
              </button>
            </div>
          </div>

          {/* Validador de Licencia */}
          <div className="border-t border-slate-800 pt-4">
            <p className="text-xs text-slate-400 mb-2 font-medium">¿Ya compraste tu licencia? Pega aquí la clave que recibiste por correo:</p>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={licenseKeyInput}
                onChange={(e) => setLicenseKeyInput(e.target.value)}
                placeholder="Ej: 3d8a7c2e-4b11-4f9e-8219-abcdef123456" 
                className="flex-1 bg-slate-950 border border-slate-700 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 uppercase font-mono"
              />
              <button 
                onClick={() => onActivateLicense(licenseKeyInput)} 
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
              >
                Activar Licencia
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. MODAL EXPORTAR */}
      {activeModal === 'export' && (
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-xl w-full shadow-2xl relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
          
          <div className="mb-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Download className="text-indigo-400 w-5 h-5" /> Centro de Despacho y Exportación
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Documento compilado: <span className="text-white font-semibold">{pagesCount} fojas</span> en memoria segura.
            </p>
          </div>

          <div className="space-y-2.5">
            <button 
              onClick={onExportMaster}
              className="w-full flex items-center justify-between p-3.5 bg-slate-800/80 hover:bg-indigo-950/40 border border-slate-700 hover:border-indigo-500/80 rounded-xl transition text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 bg-slate-700 rounded-lg group-hover:bg-indigo-600 transition text-indigo-300 group-hover:text-white">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-xs">Expediente PDF Master Consolidado</h3>
                  <p className="text-[11px] text-slate-400">Archivo único oficial con foliación correlativa y timbres.</p>
                </div>
              </div>
              <span className="text-[10px] bg-slate-700 group-hover:bg-indigo-600 text-slate-300 group-hover:text-white px-2 py-1 rounded font-medium transition">
                .PDF
              </span>
            </button>

            <button 
              onClick={isPro ? onExportZip : () => onActivateLicense(null)}
              className="w-full flex items-center justify-between p-3.5 bg-slate-800/80 hover:bg-emerald-950/30 border border-slate-700 hover:border-emerald-500/80 rounded-xl transition text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 bg-slate-700 rounded-lg group-hover:bg-emerald-600 transition text-emerald-300 group-hover:text-white relative">
                  <Archive className="w-4 h-4" />
                  {!isPro && <Lock className="w-2.5 h-2.5 absolute -top-1 -right-1 text-amber-400" />}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-semibold text-white text-xs">Paquete ZIP / WinRAR (Fojas Sueltas)</h3>
                    {!isPro && <span className="text-[9px] text-amber-400 font-bold uppercase">PRO</span>}
                  </div>
                  <p className="text-[11px] text-slate-400">Desglosa cada foja en un PDF individual numerado.</p>
                </div>
              </div>
              <span className="text-[10px] bg-slate-700 group-hover:bg-emerald-600 text-slate-300 group-hover:text-white px-2 py-1 rounded font-medium transition">
                .ZIP
              </span>
            </button>

            <button 
              onClick={isPro ? onSwitchToPasswordModal : () => onActivateLicense(null)}
              className="w-full flex items-center justify-between p-3.5 bg-slate-800/80 hover:bg-amber-950/30 border border-slate-700 hover:border-amber-500/80 rounded-xl transition text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 bg-slate-700 rounded-lg group-hover:bg-amber-600 transition text-amber-300 group-hover:text-white relative">
                  <ShieldAlert className="w-4 h-4" />
                  {!isPro && <Lock className="w-2.5 h-2.5 absolute -top-1 -right-1 text-amber-400" />}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-semibold text-white text-xs">Bóveda Cifrada AES-256-GCM</h3>
                    {!isPro && <span className="text-[9px] text-amber-400 font-bold uppercase">PRO</span>}
                  </div>
                  <p className="text-[11px] text-slate-400">Protección con clave contra accesos no autorizados en traslados.</p>
                </div>
              </div>
              <span className="text-[10px] bg-slate-700 group-hover:bg-amber-600 text-slate-300 group-hover:text-white px-2 py-1 rounded font-medium transition">
                .ENC
              </span>
            </button>

            <button 
              onClick={onShareEmail}
              className="w-full flex items-center justify-between p-3.5 bg-slate-800/80 hover:bg-sky-950/30 border border-slate-700 hover:border-sky-500/80 rounded-xl transition text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 bg-slate-700 rounded-lg group-hover:bg-sky-600 transition text-sky-300 group-hover:text-white">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-xs">Despachar por Correo Electrónico</h3>
                  <p className="text-[11px] text-slate-400">Abre el cliente de correo con el archivo preparado y minuta lista.</p>
                </div>
              </div>
              <span className="text-[10px] bg-slate-700 group-hover:bg-sky-600 text-slate-300 group-hover:text-white px-2 py-1 rounded font-medium transition">
                EMAIL
              </span>
            </button>
          </div>

          <div className="mt-4 pt-3.5 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
            <span className="text-[11px]">¿Necesitas la minuta para el escrito o guía?</span>
            <button 
              onClick={handleCopyAction}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white border border-slate-700 rounded-lg text-[11px] font-medium transition cursor-pointer"
            >
              {copiedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Minuta Copiada</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Resumen Procesal</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* 3. MODAL CLAVE BÓVEDA */}
      {activeModal === 'password' && (
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative">
          <button onClick={() => onSwitchToPasswordModal(true)} className="absolute top-4 right-4 text-slate-400 hover:text-white transition">
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <Key className="text-amber-400 w-4 h-4" /> Cifrado Criptográfico Local
          </h2>
          <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
            Se generará una derivación con <strong>600.000 iteraciones PBKDF2</strong>. DocApp no almacena llaves; si olvidas esta clave el archivo no se podrá recuperar.
          </p>

          <input 
            type="password" 
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="Clave segura (mínimo 10 caracteres)" 
            className="w-full bg-slate-950 border border-slate-700 text-white text-xs rounded-lg px-3 py-2.5 mb-2 focus:outline-none focus:border-amber-500 font-mono"
          />

          <div className="w-full bg-slate-800 h-1.5 rounded-full mb-4 overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${passStrength.score < 40 ? 'bg-rose-500' : passStrength.score < 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ width: `${passStrength.score}%` }}
            ></div>
          </div>

          <button 
            disabled={!passStrength.isValid}
            onClick={() => onExportVault(passwordInput)}
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold transition shadow-md disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            Bloquear con AES-256-GCM y Descargar
          </button>
        </div>
      )}

      {/* 4. MODAL QUIÉNES SOMOS */}
      {activeModal === 'about' && (
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-xl w-full shadow-2xl relative max-h-[85vh] flex flex-col">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-4 shrink-0">
            <div className="p-2 bg-indigo-600/20 rounded-lg border border-indigo-500/30 text-indigo-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Nuestra Identidad Institucional</h2>
              <p className="text-xs text-slate-400">Soberanía y custodia absoluta de documentos críticos</p>
            </div>
          </div>

          <div className="overflow-y-auto space-y-4 text-xs text-slate-300 pr-2">
            <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
              <h3 className="font-bold text-indigo-300 mb-1 flex items-center gap-1.5 text-xs">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" /> Nuestra Misión
              </h3>
              <p className="leading-relaxed text-slate-300">
                Proveer herramientas de gestión documental transversal (jurídica, tributaria, logística y corporativa), garantizando que la digitalización, ordenamiento y foliado se ejecuten sin quebrantar el <strong>secreto profesional ni las normativas de protección de datos</strong>.
              </p>
            </div>

            <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
              <h3 className="font-bold text-emerald-300 mb-1 flex items-center gap-1.5 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Nuestra Visión
              </h3>
              <p className="leading-relaxed text-slate-300">
                Eliminar la dependencia de servicios que capturan y almacenan documentos confidenciales en nubes públicas, consolidando a DocApp como el referente en computación en el extremo (Client-Side) bajo arquitectura <strong>Zero-Knowledge</strong>.
              </p>
            </div>

            <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
              <h3 className="font-bold text-amber-300 mb-2 flex items-center gap-1.5 text-xs">
                <CheckCircle2 className="w-4 h-4 text-amber-400" /> Tres Pilares Inquebrantables
              </h3>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-white">1. Procesamiento Aislado:</span> Los documentos residen únicamente en la memoria RAM del dispositivo.
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-white">2. Autonomía Offline:</span> La herramienta opera plenamente sin conexión a internet.
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-white">3. Neutralidad:</span> Cero recolección de metadatos, nombres de partes o registros de archivo.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL AUDITORÍA DE PRIVACIDAD */}
      {activeModal === 'privacy' && (
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-xl w-full shadow-2xl relative max-h-[85vh] flex flex-col">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-4 shrink-0">
            <div className="p-2 bg-emerald-600/20 rounded-lg border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Auditoría Técnica de Privacidad</h2>
              <p className="text-xs text-slate-400">Verificación empírica de ausencia de tráfico de red</p>
            </div>
          </div>

          <div className="overflow-y-auto space-y-4 text-xs text-slate-300 pr-2">
            <div className="p-3 bg-emerald-950/20 border border-emerald-800/40 rounded-xl text-emerald-300">
              <strong>Garantía Cero Servidor:</strong> A diferencia de utilidades PDF tradicionales, DocApp ejecuta el motor binario mediante WebAssembly directamente en el navegador del usuario.
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">Auditoría en 3 pasos:</h3>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1 font-mono text-[11px]">
                <div className="text-indigo-400 font-bold">1. Abrir DevTools</div>
                <div className="text-slate-400">Presiona <kbd className="bg-slate-800 px-1 py-0.5 rounded text-slate-200">F12</kbd> y dirígete a la pestaña <strong>Network (Red)</strong>.</div>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1 font-mono text-[11px]">
                <div className="text-indigo-400 font-bold">2. Filtrar peticiones</div>
                <div className="text-slate-400">Selecciona la subpestaña <strong>Fetch / XHR</strong>.</div>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1 font-mono text-[11px]">
                <div className="text-indigo-400 font-bold">3. Cargar y compilar documentos</div>
                <div className="text-slate-400">Arrastra archivos y compílalos. Constatarás que se registran <strong>0 bytes transferidos</strong> hacia el exterior.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL TÉRMINOS Y SLA */}
      {activeModal === 'legal' && (
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-2xl w-full shadow-2xl relative max-h-[85vh] flex flex-col">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-4 shrink-0">
            <div className="p-2 bg-indigo-600/20 rounded-lg border border-indigo-500/30 text-indigo-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Términos de Licencia y SLA</h2>
              <p className="text-xs text-slate-400">Condiciones de servicio y marco de protección normativa</p>
            </div>
          </div>

          <div className="overflow-y-auto space-y-4 text-xs text-slate-300 pr-2 leading-relaxed">
            <div className="p-3.5 bg-emerald-950/25 border border-emerald-800/50 rounded-xl">
              <h3 className="font-bold text-emerald-300 text-xs mb-1">
                1. Cumplimiento Ley N° 21.719 (Protección de Datos Personales)
              </h3>
              <p className="text-slate-300 text-[11px]">
                Dado que la ejecución técnica transcurre en la memoria RAM del cliente, DocApp no almacena, recopila ni perfila datos de carácter personal. DocApp no reviste condición de Responsable ni Encargado del Tratamiento.
              </p>
            </div>

            <div className="p-3.5 bg-slate-800/60 border border-slate-700/60 rounded-xl">
              <h3 className="font-bold text-white text-xs mb-1">
                2. Indemnidad del Secreto Profesional y Comercial
              </h3>
              <p className="text-slate-300 text-[11px]">
                Se resguarda el deber de reserva en el ejercicio forense, pericial, médico, contable o logístico al suprimir toda intermediación de servidores de terceros.
              </p>
            </div>

            <div className="p-3.5 bg-slate-800/60 border border-slate-700/60 rounded-xl">
              <h3 className="font-bold text-white text-xs mb-1">
                3. Acuerdo de Nivel de Servicio (SLA)
              </h3>
              <p className="text-slate-300 text-[11px]">
                La entrega estática de los paquetes de código mediante red global de distribución de contenido (CDN) asegura un <strong>99.9%</strong> de disponibilidad. El rendimiento en renderizado depende de la CPU y memoria RAM del equipo anfitrión.
              </p>
            </div>

            <div className="p-3.5 bg-slate-800/60 border border-slate-700/60 rounded-xl">
              <h3 className="font-bold text-rose-300 text-xs mb-1">
                4. Exclusión de Responsabilidad Criptográfica
              </h3>
              <p className="text-slate-300 text-[11px]">
                DocApp no posee puertas traseras ni llaves de descifrado maestro para archivos <code>.enc</code>. La custodia de contraseñas es de exclusiva responsabilidad del usuario emisor.
              </p>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-slate-800 text-right shrink-0">
            <button 
              onClick={onClose} 
              className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition border border-slate-700 cursor-pointer"
            >
              Comprendido y Aceptado
            </button>
          </div>
        </div>
      )}

      {/* 7. MODAL INSTRUCTIVO / ¿CÓMO FUNCIONA? */}
      {activeModal === 'help' && (
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-2xl w-full shadow-2xl relative max-h-[85vh] flex flex-col">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-5 shrink-0">
            <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Guía Rápida de DocApp Legal
              </h2>
              <p className="text-xs text-slate-400">
                Aprende a unir PDFs, intercalar fojas y compilar expedientes oficiales en 3 pasos simples.
              </p>
            </div>
          </div>

          <div className="overflow-y-auto space-y-3.5 text-xs text-slate-300 pr-1">
            
            {/* Paso 1 */}
            <div className="p-4 bg-slate-800/70 border border-slate-700/80 rounded-xl relative overflow-hidden group hover:border-indigo-500/60 transition">
              <div className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-xs mb-1 flex items-center gap-1.5">
                    <Files className="w-3.5 h-3.5 text-indigo-400" /> Carga y Fusión Automática de Documentos
                  </h3>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Haz clic en <strong>"Unir / Cargar PDFs"</strong> o arrastra múltiples archivos a la mesa (por ejemplo: demandas, contratos, certificados o anexos). DocApp desglosa cada hoja de forma individual para que puedas combinarlas a voluntad.
                  </p>
                </div>
              </div>
            </div>

            {/* Paso 2 */}
            <div className="p-4 bg-slate-800/70 border border-slate-700/80 rounded-xl relative overflow-hidden group hover:border-indigo-500/60 transition">
              <div className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-xs mb-1 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-400" /> Ordena, Intercala y Aplica Foliación
                  </h3>
                  <p className="text-slate-300 text-[11px] leading-relaxed mb-2">
                    Arrastra las hojas con el ratón para intercalarlas o cambiar su orden. En la barra lateral izquierda puedes:
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
                    <li className="flex items-center gap-1.5 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span><strong>Foliar (F. 001):</strong> Numeración correlativa judicial.</span>
                    </li>
                    <li className="flex items-center gap-1.5 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span><strong>Confidencial:</strong> Sello traslúcido institucional.</span>
                    </li>
                    <li className="flex items-center gap-1.5 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span><strong>Lupa 4K:</strong> Revisa el texto y firmas en alta nitidez.</span>
                    </li>
                    <li className="flex items-center gap-1.5 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span><strong>Hoja Blanca:</strong> Inserta separadores de pieza.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Paso 3 */}
            <div className="p-4 bg-slate-800/70 border border-slate-700/80 rounded-xl relative overflow-hidden group hover:border-indigo-500/60 transition">
              <div className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-sky-600/20 border border-sky-500/40 text-sky-300 font-bold flex items-center justify-center shrink-0 text-xs">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-xs mb-1 flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5 text-sky-400" /> Exporta el Expediente Consolidado
                  </h3>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Presiona el botón superior <strong>"Exportar PDF Unificado"</strong>. Podrás generar el <strong>PDF Master único</strong> cosido con numeración correlativa, un <strong>archivo ZIP</strong> con cada foja suelta o una <strong>Bóveda .ENC</strong> protegida con clave criptográfica militar.
                  </p>
                </div>
              </div>
            </div>

            {/* Banner de Garantía de Privacidad */}
            <div className="p-3.5 bg-emerald-950/30 border border-emerald-800/50 rounded-xl flex items-center gap-3 text-emerald-300">
              <Shield className="w-5 h-5 shrink-0 text-emerald-400" />
              <p className="text-[11px] leading-relaxed">
                <strong>Soberanía Total:</strong> Todo el proceso transcurre en la memoria RAM de tu navegador. Ningún documento se transmite a servidores externos (Cumplimiento estricto Ley N° 21.719).
              </p>
            </div>

          </div>

          <div className="mt-4 pt-3.5 border-t border-slate-800 flex justify-between items-center shrink-0">
            <span className="text-[11px] text-slate-400">DocApp Legal Tech · v3.2 Enterprise</span>
            <button 
              onClick={onClose} 
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              Comenzar a Trabajar
            </button>
          </div>
        </div>
      )}

    </div>
  );
}