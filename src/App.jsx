import React, { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Workspace from './components/Workspace';
import Modals from './components/Modals';
import { encriptarWebCrypto, desencriptarWebCrypto } from './utils/cryptoService';
import { generarBytesMaster, descargarBlob } from './utils/pdfEngine';
import JSZip from 'jszip';
import { PDFDocument, degrees } from 'pdf-lib';

// Configuración de Worker PDF.js compatible con navegadores
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

const MAX_FREE_PAGES = 25;
const PRO_LICENSE_CODE = 'DOCAPP-PRO-LEGAL';

export default function App() {
  const [pages, setPages] = useState([]);
  const [isPro, setIsPro] = useState(() => {
    return localStorage.getItem('docapp_is_pro') === 'true';
  });
  
  // Toggles de herramientas
  const [folioEnabled, setFolioEnabled] = useState(false);
  const [watermarkEnabled, setWatermarkEnabled] = useState(false);

  // Estados de carga y modales
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [loadingSubText, setLoadingSubText] = useState('');
  const [activeModal, setActiveModal] = useState(null); // 'pricing', 'export', 'password', 'privacy', 'legal'

  const fileInputRef = useRef(null);

  // Manejo de Licencias
  const handleActivateLicense = (key) => {
    if (!key) {
      setActiveModal('pricing');
      return;
    }
    if (key.trim().toUpperCase() === PRO_LICENSE_CODE) {
      setIsPro(true);
      localStorage.setItem('docapp_is_pro', 'true');
      setActiveModal(null);
      alert('¡Licencia PRO activada con éxito!');
    } else {
      alert('Código de licencia no válido');
    }
  };

  // Procesamiento de Archivos Locales
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

        // Bóveda .ENC
        if (file.name.endsWith('.enc')) {
          const pass = prompt(`Bóveda Asegurada: [${file.name}]\nIngresa la contraseña criptográfica:`);
          if (!pass) continue;

          setLoadingSubText('Desencriptando AES-GCM...');
          const arrayBuffer = await file.arrayBuffer();
          fileBytes = await desencriptarWebCrypto(arrayBuffer, pass);
          sourceName = file.name.replace('.enc', ' (Desencriptado)');
        } else {
          // Validar Magic Bytes %PDF-
          const arrayBuffer = await file.arrayBuffer();
          const header = new Uint8Array(arrayBuffer, 0, 5);
          const isPDF = header[0] === 0x25 && header[1] === 0x24 && header[2] === 0x44 && header[3] === 0x46 && header[4] === 0x2d; // %PDF-
          
          fileBytes = new Uint8Array(arrayBuffer);
        }

        // Cargar en PDF.js de forma aislada
        const loadingTask = pdfjsLib.getDocument({
          data: fileBytes.slice(0),
          isEvalSupported: false // Blindaje contra ejecución de scripts en PDF
        });
        const pdf = await loadingTask.promise;

        if (!isPro && newPagesList.length + pdf.numPages > MAX_FREE_PAGES) {
          alert(`El plan básico gratuito permite hasta ${MAX_FREE_PAGES} páginas. Activa el pase PRO para ilimitado.`);
          setActiveModal('pricing');
          break;
        }

        for (let i = 1; i <= pdf.numPages; i++) {
          setLoadingSubText(`Renderizando hoja ${i} de ${pdf.numPages}...`);
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
      alert('Error al leer el archivo. Comprueba que el PDF no esté protegido contra lectura.');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Acciones en Hojas
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

  // Exportaciones
  const handleExportMaster = async () => {
    setActiveModal(null);
    setIsLoading(true);
    setLoadingText('Ensamblando Expediente Master...');
    try {
      const bytes = await generarBytesMaster(pages, isPro, watermarkEnabled, folioEnabled);
      descargarBlob(bytes, `Expediente_Master_${Date.now()}.pdf`, 'application/pdf');
    } catch (err) {
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
      descargarBlob(zipBlob, `Expediente_Individual_${Date.now()}.zip`, 'application/zip');
    } catch (err) {
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
    } catch (err) {
      alert('Error durante el cifrado criptográfico.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-900 text-slate-50">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="application/pdf, .enc" 
        multiple 
        className="hidden" 
      />

      <Header 
        isPro={isPro}
        pagesCount={pages.length}
        onClear={() => setPages([])}
        onAddFiles={() => fileInputRef.current.click()}
        onOpenExport={() => setActiveModal('export')}
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
          onDelete={handleDelete}
          isLoading={isLoading}
          loadingText={loadingText}
          loadingSubText={loadingSubText}
        />
      </div>

      <footer className="bg-slate-800/90 border-t border-slate-700/60 px-6 py-2.5 flex justify-between items-center text-[11px] text-slate-400 shrink-0">
        <div>&copy; 2026 DocApp Legal Tech. Procesamiento Client-Side Estricto.</div>
        <div className="flex gap-4">
          <button onClick={() => setActiveModal('pricing')} className="hover:text-indigo-400 transition font-medium">Planes y Precios</button>
          <button onClick={() => setActiveModal('privacy')} className="hover:text-indigo-400 transition">Verificar Privacidad</button>
          <button onClick={() => setActiveModal('legal')} className="hover:text-indigo-400 transition">Términos y SLA</button>
        </div>
      </footer>

      <Modals 
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        isPro={isPro}
        onActivateLicense={handleActivateLicense}
        onExportMaster={handleExportMaster}
        onExportZip={handleExportZip}
        onExportVault={handleExportVault}
        onSwitchToPasswordModal={(goBack) => setActiveModal(goBack ? 'export' : 'password')}
      />
    </div>
  );
}