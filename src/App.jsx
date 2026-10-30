import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Workspace from './components/Workspace';
import Footer from './components/Footer';
import Modals from './components/Modals';
import { encriptarWebCrypto, desencriptarWebCrypto } from './utils/cryptoService';
import { generarBytesMaster, descargarBlob } from './utils/pdfEngine';
import JSZip from 'jszip';
import { PDFDocument, degrees } from 'pdf-lib';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const MAX_FREE_PAGES = 25;

// Tu clave secreta de dueño (para acceso PRO vitalicio sin pagar)
const OWNER_MASTER_KEY = 'DOCAPP-OWNER-2026';

export default function App() {
  const [pages, setPages] = useState([]);
  const [isPro, setIsPro] = useState(false);
  const [licenseData, setLicenseData] = useState(null);
  
  const [folioEnabled, setFolioEnabled] = useState(false);
  const [watermarkEnabled, setWatermarkEnabled] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [loadingSubText, setLoadingSubText] = useState('');
  const [activeModal, setActiveModal] = useState(null);

  const fileInputRef = useRef(null);
  const replaceInputRef = useRef(null);
  const [targetReplaceId, setTargetReplaceId] = useState(null);

  // Verificación de Licencia Guardada al Iniciar
  useEffect(() => {
    const stored = localStorage.getItem('docapp_license_data');
    if (!stored) return;

    try {
      const data = JSON.parse(stored);
      // Licencia de Dueño
      if (data.isOwner) {
        setIsPro(true);
        setLicenseData(data);
        return;
      }

      // Verificación de expiración (Pase 24h, mensual o anual)
      if (data.expiresAt) {
        const expirationDate = new Date(data.expiresAt);
        const now = new Date();
        if (now > expirationDate) {
          localStorage.removeItem('docapp_license_data');
          setIsPro(false);
          setLicenseData(null);
          return;
        }
      }

      setIsPro(true);
      setLicenseData(data);
    } catch {
      localStorage.removeItem('docapp_license_data');
    }
  }, []);

  // Activación de Licencias (Lemon Squeezy API + Dueño)
  const handleActivateLicense = async (key) => {
    if (!key) {
      setActiveModal('pricing');
      return;
    }

    const cleanKey = key.trim();

    // 1. Acceso de Dueño
    if (cleanKey.toUpperCase() === OWNER_MASTER_KEY) {
      const ownerData = {
        key: cleanKey,
        plan: 'Administrador Vitalicio',
        isOwner: true,
        activatedAt: new Date().toISOString()
      };
      localStorage.setItem('docapp_license_data', JSON.stringify(ownerData));
      setIsPro(true);
      setLicenseData(ownerData);
      setActiveModal(null);
      alert('¡Acceso Maestro de Propietario activado para siempre!');
      return;
    }

    // 2. Validación de Clave en Lemon Squeezy
    setIsLoading(true);
    setLoadingText('Validando clave con Lemon Squeezy...');
    setLoadingSubText('Consultando estado del pago...');

    try {
      // Generar o reutilizar un ID único para la máquina del cliente
      let instanceId = localStorage.getItem('docapp_instance_id');
      if (!instanceId) {
        instanceId = 'web_' + Math.random().toString(36).substring(2, 11);
        localStorage.setItem('docapp_instance_id', instanceId);
      }

      const response = await fetch('https://api.lemonsqueezy.com/v1/licenses/activate', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          license_key: cleanKey,
          instance_name: instanceId
        })
      });

      const result = await response.json();

      if (result.activated) {
        const newLicense = {
          key: cleanKey,
          instanceId: result.instance?.id,
          productName: result.meta?.product_name || 'DocApp PRO',
          customerEmail: result.meta?.customer_email,
          expiresAt: result.license_key?.expires_at, // Fecha límite enviada por Lemon Squeezy
          activatedAt: new Date().toISOString(),
          isOwner: false
        };

        localStorage.setItem('docapp_license_data', JSON.stringify(newLicense));
        setIsPro(true);
        setLicenseData(newLicense);
        setActiveModal(null);
        alert(`¡Licencia activada con éxito!\nPlan: ${newLicense.productName}`);
      } else {
        alert(result.error || 'La clave de licencia ingresada no es válida o ya ha expirado.');
      }
    } catch (err) {
      console.error(err);
      alert('No se pudo verificar la licencia. Comprueba tu conexión a internet.');
    } finally {
      setIsLoading(false);
    }
  };

  // Carga de Archivos Locales
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsLoading(true);
    setLoadingText('Asegurando entorno de memoria...');

    try {
      const newPagesList = [...pages];

      for (const file of files) {
        let fileBytes;
        let sourceName = file.name;

        if (file.name.endsWith('.enc')) {
          const pass = prompt(`Bóveda Asegurada: [${file.name}]\nIngresa la contraseña criptográfica:`);
          if (!pass) continue;

          setLoadingSubText('Desencriptando AES-GCM local...');
          const arrayBuffer = await file.arrayBuffer();
          fileBytes = await desencriptarWebCrypto(arrayBuffer, pass);
          sourceName = file.name.replace('.enc', ' (Desencriptado)');
        } else {
          const arrayBuffer = await file.arrayBuffer();
          const headerChunk = new Uint8Array(arrayBuffer.slice(0, 1024));
          const headerString = String.fromCharCode(...headerChunk);
          const isPDF = headerString.includes('%PDF-');
          
          if (!isPDF) {
            alert(`El archivo "${file.name}" no cuenta con una estructura PDF válida.`);
            continue;
          }
          fileBytes = new Uint8Array(arrayBuffer);
        }

        const loadingTask = pdfjsLib.getDocument({
          data: fileBytes.slice(0),
          isEvalSupported: false
        });
        const pdf = await loadingTask.promise;

        if (!isPro && newPagesList.length + pdf.numPages > MAX_FREE_PAGES) {
          alert(`El plan básico gratuito permite hasta ${MAX_FREE_PAGES} páginas. Activa el pase PRO para procesar expedientes ilimitados.`);
          setActiveModal('pricing');
          break;
        }

        for (let i = 1; i <= pdf.numPages; i++) {
          setLoadingSubText(`Procesando foja ${i} de ${pdf.numPages}...`);
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 0.5 });
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({ canvasContext: ctx, viewport: viewport }).promise;

          newPagesList.push({
            id: Math.random().toString(36).substr(2, 9),
            fileData: fileBytes,
            pageIndex: i - 1,
            sourceName: sourceName,
            originalPageNumber: i,
            previewUrl: canvas.toDataURL('image/jpeg', 0.8),
            rotation: 0,
            isBlank: false
          });
        }
      }

      setPages(newPagesList);
    } catch (err) {
      console.error(err);
      alert('Error al leer el archivo. Comprueba que no tenga claves de lectura.');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Reemplazar Foja
  const handleReplaceInit = (id) => {
    setTargetReplaceId(id);
    replaceInputRef.current.click();
  };

  const handleReplaceFile = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== 'application/pdf') return;

    setIsLoading(true);
    setLoadingText('Sustituyendo foja seleccionada...');
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const fileBytes = new Uint8Array(arrayBuffer);
      
      const loadingTask = pdfjsLib.getDocument({ data: fileBytes.slice(0), isEvalSupported: false });
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);
      
      const viewport = page.getViewport({ scale: 0.5 });
      const canvas = document.createElement('canvas');
      await page.render({ canvasContext: canvas.getContext('2d'), viewport: viewport }).promise;
      
      const targetIdx = pages.findIndex(p => p.id === targetReplaceId);
      if (targetIdx !== -1) {
        const newPages = [...pages];
        newPages[targetIdx] = {
          id: Math.random().toString(36).substr(2, 9),
          fileData: fileBytes,
          pageIndex: 0,
          sourceName: file.name,
          originalPageNumber: 1,
          previewUrl: canvas.toDataURL('image/jpeg', 0.8),
          rotation: 0,
          isBlank: false
        };
        setPages(newPages);
      }
    } catch {
      alert('Error al sustituir la foja.');
    } finally {
      setIsLoading(false);
      replaceInputRef.current.value = '';
      setTargetReplaceId(null);
    }
  };

  // Extraer Foja Original
  const handleExtractPage = async (id) => {
    const pageData = pages.find(p => p.id === id);
    if (!pageData || pageData.isBlank) return;

    setIsLoading(true);
    setLoadingText('Extrayendo foja original sin marcas...');
    try {
      const pdfFinal = await PDFDocument.create();
      const sourceDoc = await PDFDocument.load(pageData.fileData.slice(0));
      const [copied] = await pdfFinal.copyPages(sourceDoc, [pageData.pageIndex]);
      
      const originalRotation = copied.getRotation().angle;
      if (pageData.rotation !== 0) copied.setRotation(degrees(originalRotation + pageData.rotation));
      
      pdfFinal.addPage(copied);
      const pdfBytes = await pdfFinal.save();
      descargarBlob(pdfBytes, `Foja_Extraida_${pageData.originalPageNumber}.pdf`, 'application/pdf');
    } catch {
      alert('Error al extraer la pieza.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRotate = (id) => {
    setPages(pages.map(p => p.id === id ? { ...p, rotation: (p.rotation + 90) % 360 } : p));
  };

  const handleDuplicate = (id) => {
    if (!isPro && pages.length >= MAX_FREE_PAGES) {
      setActiveModal('pricing');
      return;
    }
    const idx = pages.findIndex(p => p.id === id);
    if (idx !== -1) {
      const copy = { ...pages[idx], id: Math.random().toString(36).substr(2, 9) };
      const updated = [...pages];
      updated.splice(idx + 1, 0, copy);
      setPages(updated);
    }
  };

  const handleDelete = (id) => {
    setPages(pages.filter(p => p.id !== id));
  };

  const handleAddBlankPage = () => {
    if (!isPro && pages.length >= MAX_FREE_PAGES) {
      setActiveModal('pricing');
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = 420;
    canvas.height = 595;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    setPages([
      ...pages,
      {
        id: Math.random().toString(36).substr(2, 9),
        fileData: null,
        pageIndex: -1,
        sourceName: 'Hoja en Blanco',
        originalPageNumber: '-',
        previewUrl: canvas.toDataURL('image/jpeg', 0.8),
        rotation: 0,
        isBlank: true
      }
    ]);
  };

  const handleExportMaster = async () => {
    setActiveModal(null);
    setIsLoading(true);
    setLoadingText('Ensamblando Expediente Master...');
    try {
      const bytes = await generarBytesMaster(pages, isPro, watermarkEnabled, folioEnabled);
      descargarBlob(bytes, `Expediente_Master_${Date.now()}.pdf`, 'application/pdf');
    } catch {
      alert('Error en el ensamblado del PDF.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportZip = async () => {
    setActiveModal(null);
    setIsLoading(true);
    setLoadingText('Comprimiendo folios individuales...');
    try {
      const zip = new JSZip();
      const folder = zip.folder("Expediente_Desglosado");
      const cache = new Map();

      for (let i = 0; i < pages.length; i++) {
        const pageData = pages[i];
        const singlePdf = await PDFDocument.create();

        if (pageData.isBlank) {
          singlePdf.addPage([595.28, 841.89]);
        } else {
          if (!cache.has(pageData.fileData)) {
            cache.set(pageData.fileData, await PDFDocument.load(pageData.fileData.slice(0)));
          }
          const [copied] = await singlePdf.copyPages(cache.get(pageData.fileData), [pageData.pageIndex]);
          const originalRotation = copied.getRotation().angle;
          if (pageData.rotation !== 0) copied.setRotation(degrees(originalRotation + pageData.rotation));
          singlePdf.addPage(copied);
        }
        folder.file(`Folio_${String(i + 1).padStart(3, '0')}.pdf`, await singlePdf.save());
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      descargarBlob(zipBlob, `Expediente_Fojas_${Date.now()}.zip`, 'application/zip');
    } catch {
      alert('Error al generar el archivo ZIP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportVault = async (password) => {
    setActiveModal(null);
    setIsLoading(true);
    setLoadingText('Aplicando cifrado WebCrypto AES-GCM...');
    try {
      const bytes = await generarBytesMaster(pages, isPro, watermarkEnabled, folioEnabled);
      const vaultBlob = await encriptarWebCrypto(bytes, password);
      descargarBlob(vaultBlob, `Boveda_Expediente_${Date.now()}.enc`, 'application/octet-stream');
    } catch {
      alert('Error durante el cifrado criptográfico.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareEmail = async () => {
    setActiveModal(null);
    setIsLoading(true);
    setLoadingText('Preparando archivo para despacho por correo...');
    try {
      const bytes = await generarBytesMaster(pages, isPro, watermarkEnabled, folioEnabled);
      const fileName = `Expediente_Foliado_${Date.now()}.pdf`;
      const file = new File([bytes], fileName, { type: 'application/pdf' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Expediente Foliado',
          text: `Se acompaña expediente compilado de ${pages.length} fojas.`
        });
      } else {
        descargarBlob(bytes, fileName, 'application/pdf');
        const subject = encodeURIComponent(`Envío de Expediente Foliado (${pages.length} fojas)`);
        const body = encodeURIComponent(
          `Estimados/as,\n\nSe adjunta el expediente consolidado y foliado de ${pages.length} fojas.\n\nEl documento ha sido compilado en memoria local sin almacenamiento en nubes públicas.\n\nDocApp Legal Tech.`
        );
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
      }
    } catch {
      alert('No se pudo abrir el despachador de correo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySummary = () => {
    const summary = 
`--- CERTIFICADO DE INTEGRIDAD DOCUMENTAL ---
Fecha: ${new Date().toLocaleDateString('es-CL')}
Total de Fojas: ${pages.length}
Foliación Aplicada: ${folioEnabled && isPro ? 'Sí (Correlativa)' : 'Sin foliar'}
Sello de Confidencialidad: ${watermarkEnabled && isPro ? 'Activo' : 'Inactivo'}
Entorno de Procesamiento: 100% Client-Side (Cumplimiento Ley N° 21.719)
Generado por: DocApp`;
    navigator.clipboard.writeText(summary);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-900 text-slate-50 font-sans">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="application/pdf, .enc" 
        multiple 
        className="hidden" 
      />
      <input 
        type="file" 
        ref={replaceInputRef} 
        onChange={handleReplaceFile} 
        accept="application/pdf" 
        className="hidden" 
      />

      <Header 
        isPro={isPro}
        pagesCount={pages.length}
        onClear={() => setPages([])}
        onAddFiles={() => fileInputRef.current.click()}
        onOpenExport={() => setActiveModal('export')}
        onOpenPricing={() => setActiveModal('pricing')}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          isPro={isPro}
          pagesCount={pages.length}
          maxFreePages={MAX_FREE_PAGES}
          folioEnabled={folioEnabled}
          setFolioEnabled={setFolioEnabled}
          watermarkEnabled={watermarkEnabled}
          setWatermarkEnabled={setWatermarkEnabled}
          onAddBlankPage={handleAddBlankPage}
          onOpenPricing={() => setActiveModal('pricing')}
        />

        <Workspace 
          pages={pages}
          onPagesReorder={setPages}
          onAddFiles={() => fileInputRef.current.click()}
          onRotate={handleRotate}
          onDuplicate={handleDuplicate}
          onReplaceInit={handleReplaceInit}
          onExtractPage={handleExtractPage}
          onDelete={handleDelete}
          isLoading={isLoading}
          loadingText={loadingText}
          loadingSubText={loadingSubText}
        />
      </div>

      <Footer onOpenModal={(modalName) => setActiveModal(modalName)} />

      <Modals 
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        isPro={isPro}
        pagesCount={pages.length}
        onActivateLicense={handleActivateLicense}
        onExportMaster={handleExportMaster}
        onExportZip={handleExportZip}
        onExportVault={handleExportVault}
        onShareEmail={handleShareEmail}
        onCopySummary={handleCopySummary}
        onSwitchToPasswordModal={(goBack) => setActiveModal(goBack ? 'export' : 'password')}
      />
    </div>
  );
}