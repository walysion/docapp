import React, { useState } from 'react';
import { 
  X, Check, Lock, Download, Archive, 
  ShieldAlert, ArrowLeft, Key, Eye, Scale, 
  Compass, ShieldCheck, CheckCircle2, Mail, Copy, Share2
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
            <h2 className="text-xl font-bold text-white">Licencias Profesionales DocApp</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Foliado, foliación inversa y cifrado blindado sin transferir causas ni fojas a servidores externos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-6">
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between hover:border-slate-500 transition">
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Urgencias</span>
                <h3 className="font-bold text-white text-sm mt-1">Pase 24 Horas</h3>
                <div className="mt-2 mb-3">
                  <span className="text-2xl font-extrabold text-white">$2</span>
                  <span className="text-xs text-slate-400"> USD</span>
                </div>
                <ul className="text-[11px] text-slate-300 space-y-1.5">
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Fojas ilimitadas</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Foliador OJV habilitado</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Validez por 24 hrs</li>
                </ul>
              </div>
              <button 
                onClick={() => window.open('https://tu-link-de-pago.com/pase24h', '_blank')} 
                className="mt-4 w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold transition"
              >
                Comprar Pase
              </button>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between hover:border-slate-500 transition">
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Litigación Continua</span>
                <h3 className="font-bold text-white text-sm mt-1">Suscripción Mensual</h3>
                <div className="mt-2 mb-3">
                  <span className="text-2xl font-extrabold text-white">$5</span>
                  <span className="text-xs text-slate-400"> USD/mes</span>
                </div>
                <ul className="text-[11px] text-slate-300 space-y-1.5">
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Expedientes ilimitados</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Bóvedas criptográficas</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Sin contratos forzosos</li>
                </ul>
              </div>
              <button 
                onClick={() => window.open('https://tu-link-de-pago.com/mensual', '_blank')} 
                className="mt-4 w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold transition"
              >
                Suscribir Plan
              </button>
            </div>

            <div className="bg-gradient-to-b from-indigo-950/70 to-slate-900 border-2 border-indigo-500 rounded-xl p-4 flex flex-col justify-between shadow-lg shadow-indigo-500/10 relative">
              <span className="absolute -top-2.5 right-3 bg-indigo-600 text-[10px] font-bold text-white px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                Ahorra 35%
              </span>
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Estudios Jurídicos</span>
                <h3 className="font-bold text-white text-sm mt-1">Plan Anual</h3>
                <div className="mt-2 mb-3">
                  <span className="text-2xl font-extrabold text-white">$39</span>
                  <span className="text-xs text-slate-400"> USD/año</span>
                </div>
                <ul className="text-[11px] text-slate-300 space-y-1.5">
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Todo incluido sin topes</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Equivale a $3.25 USD/mes</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> SLA de soporte prioritario</li>
                </ul>
              </div>
              <button 
                onClick={() => window.open('https://tu-link-de-pago.com/anual', '_blank')} 
                className="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition shadow-md shadow-indigo-600/30"
              >
                Activar Plan Anual
              </button>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4">
            <p className="text-xs text-slate-400 mb-2 font-medium">¿Ya recibiste tu clave de activación? Ingrésala aquí:</p>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={licenseKeyInput}
                onChange={(e) => setLicenseKeyInput(e.target.value)}
                placeholder="Ej: DOCAPP-PRO-LEGAL" 
                className="flex-1 bg-slate-950 border border-slate-700 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 uppercase font-mono"
              />
              <button 
                onClick={() => onActivateLicense(licenseKeyInput)} 
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition"
              >
                Validar Licencia
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. MODAL EXPORTAR (CENTRO DE DESPACHO Y EXPORTACIÓN) */}
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
              Expediente preparado: <span className="text-white font-semibold">{pagesCount} fojas</span> procesadas en memoria local.
            </p>
          </div>

          <div className="space-y-2.5">
            {/* Opción 1: PDF Master */}
            <button 
              onClick={onExportMaster}
              className="w-full flex items-center justify-between p-3.5 bg-slate-800/80 hover:bg-indigo-950/40 border border-slate-700 hover:border-indigo-500/80 rounded-xl transition text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 bg-slate-700 rounded-lg group-hover:bg-indigo-600 transition text-indigo-300 group-hover:text-white">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-xs">Expediente PDF Master Consolidado</h3>
                  <p className="text-[11px] text-slate-400">Archivo único oficial con foliación y sellos para OJV o archivo notarial.</p>
                </div>
              </div>
              <span className="text-[10px] bg-slate-700 group-hover:bg-indigo-600 text-slate-300 group-hover:text-white px-2 py-1 rounded font-medium transition">
                .PDF
              </span>
            </button>

            {/* Opción 2: ZIP / WinRAR */}
            <button 
              onClick={isPro ? onExportZip : () => onActivateLicense(null)}
              className="w-full flex items-center justify-between p-3.5 bg-slate-800/80 hover:bg-emerald-950/30 border border-slate-700 hover:border-emerald-500/80 rounded-xl transition text-left group"
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
                  <p className="text-[11px] text-slate-400">Desglosa cada foja en un PDF individual numerado (Folio_001.pdf...).</p>
                </div>
              </div>
              <span className="text-[10px] bg-slate-700 group-hover:bg-emerald-600 text-slate-300 group-hover:text-white px-2 py-1 rounded font-medium transition">
                .ZIP
              </span>
            </button>

            {/* Opción 3: Bóveda Cifrada */}
            <button 
              onClick={isPro ? onSwitchToPasswordModal : () => onActivateLicense(null)}
              className="w-full flex items-center justify-between p-3.5 bg-slate-800/80 hover:bg-amber-950/30 border border-slate-700 hover:border-amber-500/80 rounded-xl transition text-left group"
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
                  <p className="text-[11px] text-slate-400">Protección con contraseña contra accesos no autorizados en traslados.</p>
                </div>
              </div>
              <span className="text-[10px] bg-slate-700 group-hover:bg-amber-600 text-slate-300 group-hover:text-white px-2 py-1 rounded font-medium transition">
                .ENC
              </span>
            </button>

            {/* Opción 4: Despacho por Correo / Compartir Directo */}
            <button 
              onClick={onShareEmail}
              className="w-full flex items-center justify-between p-3.5 bg-slate-800/80 hover:bg-sky-950/30 border border-slate-700 hover:border-sky-500/80 rounded-xl transition text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 bg-slate-700 rounded-lg group-hover:bg-sky-600 transition text-sky-300 group-hover:text-white">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-xs">Despachar por Correo Electrónico</h3>
                  <p className="text-[11px] text-slate-400">Abre Outlook o tu cliente de correo con el PDF adjunto y plantilla redactada.</p>
                </div>
              </div>
              <span className="text-[10px] bg-slate-700 group-hover:bg-sky-600 text-slate-300 group-hover:text-white px-2 py-1 rounded font-medium transition">
                EMAIL
              </span>
            </button>
          </div>

          {/* Opción 5: Copiar Certificado / Minuta de Foliado */}
          <div className="mt-4 pt-3.5 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
            <span className="text-[11px]">¿Necesitas la minuta para el escrito judicial?</span>
            <button 
              onClick={handleCopyAction}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white border border-slate-700 rounded-lg text-[11px] font-medium transition"
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
            Se generará una derivación de clave con <strong>600.000 iteraciones PBKDF2</strong>. Debido a que no almacenamos llaves, la pérdida de esta contraseña imposibilitará abrir el archivo.
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
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold transition shadow-md disabled:opacity-30 disabled:cursor-not-allowed"
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
              <p className="text-xs text-slate-400">Soberanía de datos para auxiliares de la administración de justicia</p>
            </div>
          </div>

          <div className="overflow-y-auto space-y-4 text-xs text-slate-300 pr-2">
            <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
              <h3 className="font-bold text-indigo-300 mb-1 flex items-center gap-1.5 text-xs">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" /> Nuestra Misión
              </h3>
              <p className="leading-relaxed text-slate-300">
                Proveer herramientas de gestión procesal de alto desempeño para abogados, notarías y receptores judiciales, asegurando que la digitalización y el foliado de expedientes no vulnere el <strong>secreto profesional ni la custodia de documentos confidenciales</strong>.
              </p>
            </div>

            <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
              <h3 className="font-bold text-emerald-300 mb-1 flex items-center gap-1.5 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Nuestra Visión
              </h3>
              <p className="leading-relaxed text-slate-300">
                Erradicar el uso de plataformas que capturan y almacenan documentos legales en nubes públicas, consolidando a DocApp como el estándar en computación local (Client-Side) bajo el principio de <strong>Zero-Knowledge Architecture</strong>.
              </p>
            </div>

            <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
              <h3 className="font-bold text-amber-300 mb-2 flex items-center gap-1.5 text-xs">
                <CheckCircle2 className="w-4 h-4 text-amber-400" /> Tres Pilares Inquebrantables
              </h3>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-white">1. Privacidad Física:</span> Los documentos residen únicamente en la memoria RAM del equipo de trabajo.
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-white">2. Independencia Tecnológica:</span> La aplicación funciona incluso desconectando el cable de red o Wi-Fi.
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-white">3. Neutralidad Procesal:</span> No almacenamos metadatos de las causas, partes involucradas ni contenido de las fojas.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL VERIFICAR PRIVACIDAD */}
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
              <p className="text-xs text-slate-400">Procedimiento paso a paso para verificar la ausencia de tráfico web</p>
            </div>
          </div>

          <div className="overflow-y-auto space-y-4 text-xs text-slate-300 pr-2">
            <div className="p-3 bg-emerald-950/20 border border-emerald-800/40 rounded-xl text-emerald-300">
              <strong>Garantía Cero Servidor:</strong> A diferencia de conversores tradicionales que procesan los PDFs en servidores remotos, DocApp compila usando WebAssembly y JavaScript en el procesador local de su máquina.
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">Cómo auditar el comportamiento en 3 pasos:</h3>
              
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5 font-mono text-[11px]">
                <div className="text-indigo-400 font-bold">1. Abrir las Herramientas de Desarrollador</div>
                <div className="text-slate-400">Presione <kbd className="bg-slate-800 px-1 py-0.5 rounded text-slate-200">F12</kbd> o clic derecho &rarr; <em>Inspeccionar</em>. Seleccione la pestaña <strong>Network</strong> (Red).</div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5 font-mono text-[11px]">
                <div className="text-indigo-400 font-bold">2. Filtrar por Tráfico de Datos</div>
                <div className="text-slate-400">Seleccione el filtro <strong>Fetch / XHR</strong> y marque la casilla <strong>Preserve log</strong>.</div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5 font-mono text-[11px]">
                <div className="text-indigo-400 font-bold">3. Ejecutar Foliado y Exportación</div>
                <div className="text-slate-400">Cargue un expediente confidencial de 50 hojas y presione <em>Compilar Expediente</em>. Constatará que el registro permanece en <strong>0 peticiones salientes (0 bytes subidos)</strong>.</div>
              </div>
            </div>

            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/60 text-[11px] text-slate-400">
              <strong>Prueba definitiva sin conexión:</strong> Cargue la página, desactive el Wi-Fi de su equipo y continúe utilizando la herramienta. La totalidad de las funciones de ensamblado y foliado seguirán operando con normalidad.
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
              <h2 className="text-base font-bold text-white">Términos de Licencia y Acuerdo de Servicio (SLA)</h2>
              <p className="text-xs text-slate-400">Regulado bajo normativa chilena para el ejercicio forense y administrativo</p>
            </div>
          </div>

          <div className="overflow-y-auto space-y-4 text-xs text-slate-300 pr-2 leading-relaxed">
            <div className="p-3.5 bg-emerald-950/25 border border-emerald-800/50 rounded-xl">
              <h3 className="font-bold text-emerald-300 text-xs mb-1">
                1. Cumplimiento Ley N° 21.719 (Protección de Datos Personales en Chile)
              </h3>
              <p className="text-slate-300 text-[11px]">
                En virtud de que el software opera bajo la modalidad de <strong>Procesamiento en el Extremo (Edge/Client-Side)</strong>, DocApp Legal Tech no recopila, procesa, transfiere ni almacena datos personales de litigantes, jueces o terceros. DocApp no reviste la calidad de «Responsable del Tratamiento» ni de «Encargado» al no tener acceso físico ni lógico a los archivos procesados.
              </p>
            </div>

            <div className="p-3.5 bg-slate-800/60 border border-slate-700/60 rounded-xl">
              <h3 className="font-bold text-white text-xs mb-1">
                2. Indemnidad del Secreto Profesional (Art. 247 Código Penal)
              </h3>
              <p className="text-slate-300 text-[11px]">
                La herramienta ha sido construida para que abogados y notarías den cabal cumplimiento al deber de sigilo y reserva procesal. Al no existir sincronización en servidores en la nube, se extingue el riesgo de filtraciones por accesos no autorizados a bases de datos corporativas de terceros.
              </p>
            </div>

            <div className="p-3.5 bg-slate-800/60 border border-slate-700/60 rounded-xl">
              <h3 className="font-bold text-white text-xs mb-1">
                3. Acuerdo de Nivel de Servicio (SLA)
              </h3>
              <p className="text-slate-300 text-[11px]">
                Al ejecutarse en un entorno estático alojado sobre redes perimetrales globales (CDN) con protección perimetral, la disponibilidad teórica de descarga del código fuente de la aplicación es de un <strong>99.9%</strong>. El desempeño del procesamiento algorítmico (velocidad de renderizado y foliado) dependerá exclusivamente de la capacidad de memoria RAM y procesador del equipo del usuario.
              </p>
            </div>

            <div className="p-3.5 bg-slate-800/60 border border-slate-700/60 rounded-xl">
              <h3 className="font-bold text-white text-xs mb-1">
                4. Política Comercial y Ley N° 19.496 (Protección al Consumidor)
              </h3>
              <p className="text-slate-300 text-[11px]">
                Las claves de licencia son personales e intransferibles conforme al plan contratado (Pase Diario, Mensual o Anual). El usuario podrá solicitar el desistimiento o reembolso íntegro durante los primeros 5 días hábiles siguientes a la compra si la herramienta presenta incompatibilidad técnica insalvable con su navegador.
              </p>
            </div>

            <div className="p-3.5 bg-slate-800/60 border border-slate-700/60 rounded-xl">
              <h3 className="font-bold text-rose-300 text-xs mb-1">
                5. Exclusión de Responsabilidad por Pérdida de Claves
              </h3>
              <p className="text-slate-300 text-[11px]">
                DocApp no dispone de llaves maestras ni mecanismos de recuperación («Backdoors») para los archivos generados con extensión <code>.enc</code>. El usuario asume toda la responsabilidad por el resguardo de la contraseña elegida.
              </p>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-slate-800 text-right shrink-0">
            <button 
              onClick={onClose} 
              className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition border border-slate-700"
            >
              Comprendido y Aceptado
            </button>
          </div>
        </div>
      )}

    </div>
  );
}