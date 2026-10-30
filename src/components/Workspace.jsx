import React, { useRef, useEffect, useState, useCallback } from 'react';
import Sortable from 'sortablejs';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { 
  UploadCloud, 
  RotateCw, 
  Copy, 
  Trash2, 
  Replace, 
  Download, 
  Search, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpDown, 
  CheckSquare, 
  Square, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  FileText, 
  Layers,
  Loader2
} from 'lucide-react';

// Asegurar la inicialización del worker de PDF.js
if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
}

/**
 * Componente de Alta Resolución (Renderizado Vectorial Nativo a 300 DPI)
 * Procesa el PDF binario directamente a escala 2.5x para máxima nitidez en pantalla grande.
 */
function HighResPdfViewer({ page, zoom }) {
  const canvasRef = useRef(null);
  const [isRendering, setIsRendering] = useState(true);

  useEffect(() => {
    let isCancelled = false;
    let currentRenderTask = null;

    async function renderSharpPage() {
      if (!page) return;

      if (page.isBlank || !page.fileData) {
        setIsRendering(false);
        return;
      }

      try {
        setIsRendering(true);

        const loadingTask = pdfjsLib.getDocument({
          data: page.fileData.slice(0),
          isEvalSupported: false
        });
        const pdf = await loadingTask.promise;
        if (isCancelled) return;

        const pdfPage = await pdf.getPage(page.pageIndex + 1);
        if (isCancelled) return;

        // Escala 2.5x: Calidad nítida 300 DPI profesional para monitores de alta densidad
        const baseScale = 2.5;
        const finalRotation = ((pdfPage.rotate || 0) + (page.rotation || 0)) % 360;
        const viewport = pdfPage.getViewport({ scale: baseScale, rotation: finalRotation });

        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d', { alpha: false });

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        currentRenderTask = pdfPage.render({
          canvasContext: context,
          viewport: viewport
        });

        await currentRenderTask.promise;
        if (!isCancelled) {
          setIsRendering(false);
        }
      } catch (err) {
        if (err?.name !== 'RenderingCancelledException') {
          console.error('Error al renderizar foja en alta definición:', err);
        }
        if (!isCancelled) setIsRendering(false);
      }
    }

    renderSharpPage();

    return () => {
      isCancelled = true;
      if (currentRenderTask) {
        try {
          currentRenderTask.cancel();
        } catch {
          // Cancelación segura al cambiar rápido de página
        }
      }
    };
  }, [page.fileData, page.pageIndex, page.rotation, page.isBlank]);

  // Ancho base del documento en visualización (800px al 100%)
  const calculatedWidth = Math.round(800 * zoom);

  if (page.isBlank) {
    return (
      <div 
        className="bg-white rounded-lg shadow-2xl border border-slate-300 flex flex-col items-center justify-center text-slate-400 font-mono transition-all duration-150"
        style={{ width: `${calculatedWidth}px`, aspectRatio: '1 / 1.414' }}
      >
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Hoja en Blanco</p>
          <p className="text-xs text-slate-400 mt-1">Sin texto ni marcas registradas</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative bg-white rounded-lg shadow-2xl border border-slate-300/80 overflow-hidden transition-all duration-150 ease-out"
      style={{ width: `${calculatedWidth}px` }}
    >
      {isRendering && (
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex flex-col items-center justify-center z-10 transition-opacity">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mb-2" />
          <span className="text-xs text-white font-medium bg-slate-900/90 px-3 py-1 rounded-full shadow border border-slate-700">
            Renderizando resolución 4K...
          </span>
        </div>
      )}
      <canvas 
        ref={canvasRef} 
        className="w-full h-auto block"
        style={{ imageRendering: 'auto' }}
      />
    </div>
  );
}

export default function Workspace({
  pages,
  onPagesReorder,
  onAddFiles,
  onRotate,
  onDuplicate,
  onDelete,
  onReplaceInit,
  onExtractPage,
  isLoading,
  loadingText,
  loadingSubText
}) {
  const gridRef = useRef(null);

  // Estados de visualización y herramientas
  const [activePreviewIndex, setActivePreviewIndex] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [zoomLevel, setZoomLevel] = useState(2); // Zoom de mesa: 1 (Compacto), 2 (Estándar), 3 (Detalle)
  const [modalZoom, setModalZoom] = useState(1.0); // Factor de escala dentro del visor (1.0 = 100%, 2.0 = 200%)

  // SortableJS para drag & drop de miniaturas
  useEffect(() => {
    if (!gridRef.current || pages.length === 0) return;

    const sortable = Sortable.create(gridRef.current, {
      animation: 200,
      ghostClass: 'opacity-25',
      chosenClass: 'ring-2',
      dragClass: 'scale-105',
      handle: '.drag-handle',
      onEnd: (evt) => {
        if (evt.oldIndex === evt.newIndex) return;
        const newPages = [...pages];
        const [movedItem] = newPages.splice(evt.oldIndex, 1);
        newPages.splice(evt.newIndex, 0, movedItem);
        onPagesReorder(newPages);
      }
    });

    return () => sortable.destroy();
  }, [pages, onPagesReorder]);

  // Atajos de teclado en el visor y globales
  const handleKeyDown = useCallback((e) => {
    if (activePreviewIndex === null) return;

    if (e.key === 'ArrowRight') {
      setActivePreviewIndex((prev) => {
        if (prev < pages.length - 1) {
          setModalZoom(1.0);
          return prev + 1;
        }
        return prev;
      });
    } else if (e.key === 'ArrowLeft') {
      setActivePreviewIndex((prev) => {
        if (prev > 0) {
          setModalZoom(1.0);
          return prev - 1;
        }
        return prev;
      });
    } else if (e.key === 'Escape') {
      setActivePreviewIndex(null);
      setModalZoom(1.0);
    } else if (e.key === '+' || e.key === '=') {
      setModalZoom((z) => Math.min(3.0, Number((z + 0.25).toFixed(2))));
    } else if (e.key === '-') {
      setModalZoom((z) => Math.max(0.5, Number((z - 0.25).toFixed(2))));
    } else if (e.key === '0') {
      setModalZoom(1.0);
    }
  }, [activePreviewIndex, pages.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Selección individual de fojas
  const toggleSelectPage = (id, e) => {
    e.stopPropagation();
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Selección masiva
  const handleSelectAll = () => {
    if (selectedIds.size === pages.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(pages.map((p) => p.id)));
    }
  };

  const handleBatchRotate = () => {
    selectedIds.forEach((id) => onRotate(id));
  };

  const handleBatchDelete = () => {
    if (window.confirm(`¿Confirmas la eliminación de las ${selectedIds.size} fojas seleccionadas?`)) {
      const remainingPages = pages.filter((p) => !selectedIds.has(p.id));
      onPagesReorder(remainingPages);
      setSelectedIds(new Set());
    }
  };

  const handleInvertOrder = () => {
    if (pages.length < 2) return;
    const inverted = [...pages].reverse();
    onPagesReorder(inverted);
  };

  const handleJumpToPosition = (currentIndex, e) => {
    e.stopPropagation();
    const targetFolioStr = window.prompt(`Mover Foja ${currentIndex + 1} a la posición: (1 al ${pages.length})`);
    if (!targetFolioStr) return;

    const targetPos = parseInt(targetFolioStr, 10);
    if (isNaN(targetPos) || targetPos < 1 || targetPos > pages.length) {
      alert(`Ingresa un número de posición válido entre 1 y ${pages.length}.`);
      return;
    }

    const newIndex = targetPos - 1;
    if (newIndex === currentIndex) return;

    const newPages = [...pages];
    const [movedItem] = newPages.splice(currentIndex, 1);
    newPages.splice(newIndex, 0, movedItem);
    onPagesReorder(newPages);
  };

  const getGridClasses = () => {
    if (zoomLevel === 1) {
      return 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3';
    }
    if (zoomLevel === 2) {
      return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4';
    }
    return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto';
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-900 relative">
      
      {/* 1. BARRA SUPERIOR DE HERRAMIENTAS DE MESA */}
      {pages.length > 0 && (
        <div className="bg-slate-950/70 border-b border-slate-800 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition font-medium border border-slate-700 shadow-sm"
            >
              {selectedIds.size === pages.length && pages.length > 0 ? (
                <>
                  <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Deseleccionar Todo</span>
                </>
              ) : (
                <>
                  <Square className="w-3.5 h-3.5 text-slate-400" />
                  <span>Seleccionar Todo</span>
                </>
              )}
            </button>

            <button
              onClick={handleInvertOrder}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition font-medium border border-slate-700 shadow-sm"
              title="Invierte el orden de todo el expediente"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-300" />
              <span>Invertir Orden</span>
            </button>

            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-slate-400 text-xs font-mono">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>{pages.length} {pages.length === 1 ? 'foja montada' : 'fojas montadas'}</span>
            </div>
          </div>

          {/* Ajuste de escala de cuadrícula */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 shadow-inner">
            <button
              onClick={() => setZoomLevel(1)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                zoomLevel === 1 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title="Vista Compacta"
            >
              <ZoomOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Compacto</span>
            </button>

            <button
              onClick={() => setZoomLevel(2)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                zoomLevel === 2 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title="Vista Estándar"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Estándar</span>
            </button>

            <button
              onClick={() => setZoomLevel(3)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                zoomLevel === 3 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title="Vista Detallada"
            >
              <ZoomIn className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Detalle</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. ÁREA DE CUADRÍCULA DE FOJAS */}
      <div className="flex-1 p-6 overflow-y-auto relative z-0">
        {pages.length === 0 ? (
          <div 
            onClick={onAddFiles}
            className="h-full w-full border-2 border-dashed border-slate-700/80 hover:border-indigo-500 rounded-2xl flex flex-col items-center justify-center bg-slate-800/10 hover:bg-slate-800/30 transition-all duration-300 cursor-pointer group p-8"
          >
            <div className="p-5 bg-slate-800/80 rounded-2xl mb-4 group-hover:scale-110 group-hover:bg-indigo-950/50 transition-all duration-300 shadow-xl border border-slate-700/70">
              <UploadCloud className="w-10 h-10 text-indigo-400" />
            </div>
            <h3 className="text-base font-bold mb-1 text-white">Preparar Nuevo Expediente</h3>
            <p className="text-slate-400 mb-5 text-center max-w-md text-xs leading-relaxed">
              Arrastra tus documentos PDF o Bóvedas (.ENC) aquí.<br />
              <strong className="text-indigo-300">Client-Side Estricto:</strong> Memoria local sin almacenamiento externo.
            </p>
            <button 
              type="button"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-semibold text-white transition shadow-lg shadow-indigo-600/25"
            >
              Seleccionar Archivos Locales
            </button>
          </div>
        ) : (
          <div ref={gridRef} className={`grid ${getGridClasses()} pb-28`}>
            {pages.map((page, index) => {
              const isSelected = selectedIds.has(page.id);

              return (
                <div 
                  key={page.id} 
                  className={`bg-slate-800/90 border rounded-2xl overflow-hidden flex flex-col relative group transition-all duration-200 shadow-lg select-none ${
                    isSelected 
                      ? 'border-indigo-500 ring-2 ring-indigo-500/50 bg-slate-800' 
                      : 'border-slate-700/80 hover:border-slate-500 hover:shadow-xl'
                  }`}
                >
                  {/* Encabezado Flotante */}
                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10 pointer-events-none">
                    <div className="flex items-center gap-1.5 pointer-events-auto">
                      <button 
                        onClick={(e) => handleJumpToPosition(index, e)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white min-w-[22px] h-5 px-1.5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-md transition cursor-pointer"
                        title={`Foja ${index + 1}. Clic para cambiar de número.`}
                      >
                        {index + 1}
                      </button>

                      <button
                        onClick={(e) => toggleSelectPage(page.id, e)}
                        className={`p-1 rounded-md transition backdrop-blur-md ${
                          isSelected 
                            ? 'bg-indigo-600 text-white shadow' 
                            : 'bg-slate-900/70 text-slate-300 opacity-0 group-hover:opacity-100 hover:text-white'
                        }`}
                        title={isSelected ? 'Deseleccionar' : 'Seleccionar foja'}
                      >
                        {isSelected ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <button 
                      onClick={() => onDelete(page.id)}
                      className="pointer-events-auto bg-slate-900/75 hover:bg-rose-600 text-slate-300 hover:text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition shadow backdrop-blur-md"
                      title="Eliminar foja del expediente"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Previsualización Miniatura en Mesa */}
                  <div className="p-3 bg-slate-950/40 flex-1 flex items-center justify-center drag-handle cursor-grab active:cursor-grabbing">
                    <div className="w-full aspect-[1/1.414] bg-white rounded shadow border border-slate-300/40 relative overflow-hidden flex items-center justify-center transition-transform group-hover:shadow-xl">
                      <img 
                        src={page.previewUrl} 
                        alt="foja"
                        className="w-full h-full object-contain pointer-events-none select-none"
                        style={{ 
                          transform: `rotate(${page.rotation}deg)`
                        }}
                      />

                      {/* Botón Central de Inspección (Lupa) */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalZoom(1.0);
                          setActivePreviewIndex(index);
                        }}
                        className="absolute inset-0 m-auto w-10 h-10 bg-slate-950/85 hover:bg-indigo-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-2xl backdrop-blur-sm cursor-pointer"
                        title="Inspeccionar en resolución nítida 4K"
                      >
                        <Search className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Pie de Foja con Botones */}
                  <div className="p-2.5 pt-2 flex flex-col border-t border-slate-700/60 bg-slate-800/90">
                    <div 
                      className="text-[10px] text-slate-400 truncate text-center mb-2 px-1 font-mono tracking-tight" 
                      title={page.sourceName}
                    >
                      {page.isBlank ? 'Hoja en Blanco' : `Pág ${page.originalPageNumber} · ${page.sourceName}`}
                    </div>
                    
                    <div className="flex items-center justify-center gap-1.5 w-full">
                      <button 
                        onClick={() => onRotate(page.id)}
                        className="flex-1 max-w-[42px] py-1.5 bg-slate-700/80 hover:bg-indigo-600 text-slate-200 hover:text-white rounded-lg flex justify-center items-center transition shadow-sm"
                        title="Rotar 90° hacia la derecha"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => onDuplicate(page.id)}
                        className="flex-1 max-w-[42px] py-1.5 bg-slate-700/80 hover:bg-emerald-600 text-slate-200 hover:text-white rounded-lg flex justify-center items-center transition shadow-sm"
                        title="Duplicar foja correlativa"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => onReplaceInit(page.id)}
                        className="flex-1 max-w-[42px] py-1.5 bg-slate-700/80 hover:bg-amber-600 text-slate-200 hover:text-white rounded-lg flex justify-center items-center transition shadow-sm"
                        title="Reemplazar por otro archivo PDF"
                      >
                        <Replace className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => onExtractPage(page.id)}
                        className="flex-1 max-w-[42px] py-1.5 bg-slate-700/80 hover:bg-sky-600 text-slate-200 hover:text-white rounded-lg flex justify-center items-center transition shadow-sm"
                        title="Descargar esta foja individual"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. BARRA FLOTANTE DE ACCIONES EN LOTE */}
      {selectedIds.size > 0 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-indigo-500/80 rounded-2xl px-5 py-3 flex items-center gap-4 shadow-2xl backdrop-blur-md z-40">
          <div className="text-xs font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            {selectedIds.size} {selectedIds.size === 1 ? 'foja seleccionada' : 'fojas seleccionadas'}
          </div>

          <div className="h-4 w-px bg-slate-700"></div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBatchRotate}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-indigo-600 text-white rounded-lg text-xs font-medium transition border border-slate-700"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Rotar Selección</span>
            </button>

            <button
              onClick={handleBatchDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600/90 hover:bg-rose-600 text-white rounded-lg text-xs font-medium transition shadow-md"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Eliminar Selección</span>
            </button>

            <button
              onClick={() => setSelectedIds(new Set())}
              className="p-1.5 text-slate-400 hover:text-white transition rounded-lg hover:bg-slate-800"
              title="Cancelar selección"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 4. VISOR DE PRECISIÓN 4K (ALTA DEFINICIÓN VECTORIAL) */}
      {activePreviewIndex !== null && pages[activePreviewIndex] && (
        <div 
          className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-lg animate-fadeIn select-none"
          onClick={() => {
            setActivePreviewIndex(null);
            setModalZoom(1.0);
          }}
        >
          {/* BARRA SUPERIOR DEL VISOR */}
          <div 
            className="h-14 bg-slate-900/90 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-3 shrink-0 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Metadatos de la Foja */}
            <div className="flex items-center gap-3 min-w-0">
              <span className="bg-indigo-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-sm whitespace-nowrap">
                Foja {activePreviewIndex + 1} de {pages.length}
              </span>
              <span className="text-xs text-slate-300 font-mono truncate hidden sm:inline" title={pages[activePreviewIndex].sourceName}>
                {pages[activePreviewIndex].sourceName}
              </span>
            </div>

            {/* CONTROLES DE ZOOM Y ACCIONES */}
            <div className="flex items-center gap-2">
              
              {/* Selector de Zoom */}
              <div className="flex items-center bg-slate-950 border border-slate-700/80 rounded-xl p-1 shadow-inner">
                <button
                  onClick={() => setModalZoom((z) => Math.max(0.5, Number((z - 0.25).toFixed(2))))}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
                  title="Alejar (-) [Tecla -]"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setModalZoom(1.0)}
                  className="px-2.5 py-1 text-xs font-mono font-semibold text-indigo-300 hover:text-white transition"
                  title="Restablecer al 100% [Tecla 0]"
                >
                  {Math.round(modalZoom * 100)}%
                </button>

                <button
                  onClick={() => setModalZoom((z) => Math.min(3.0, Number((z + 0.25).toFixed(2))))}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
                  title="Acercar (+) [Tecla +]"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setModalZoom((z) => (z === 1.75 ? 1.0 : 1.75))}
                  className={`p-1.5 rounded-lg transition ml-1 hidden sm:block ${
                    modalZoom === 1.75 ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                  title="Modo Lectura (175%)"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Botón Rotar */}
              <button
                onClick={() => onRotate(pages[activePreviewIndex].id)}
                className="p-2 bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white rounded-xl transition border border-slate-700 shadow-sm"
                title="Girar foja 90°"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              {/* Botón Extraer */}
              <button
                onClick={() => onExtractPage(pages[activePreviewIndex].id)}
                className="p-2 bg-slate-800 hover:bg-sky-600 text-slate-200 hover:text-white rounded-xl transition border border-slate-700 shadow-sm"
                title="Descargar foja individual"
              >
                <Download className="w-4 h-4" />
              </button>

              {/* Botón Cerrar */}
              <button 
                onClick={() => {
                  setActivePreviewIndex(null);
                  setModalZoom(1.0);
                }}
                className="p-2 bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white rounded-xl transition border border-slate-700 shadow-sm"
                title="Cerrar visor [Escape]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* LIENZO CON DESPLAZAMIENTO FLUIDO (SCROLL NATIVO) */}
          <div 
            className="flex-1 w-full overflow-auto relative flex items-start justify-center p-6 sm:p-10 cursor-default"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setActivePreviewIndex(null);
                setModalZoom(1.0);
              }
            }}
          >
            {/* Renderizador de Precisión */}
            <div 
              className="my-auto"
              onClick={(e) => e.stopPropagation()}
              onDoubleClick={() => setModalZoom((z) => (z === 1.0 ? 1.75 : 1.0))}
              title="Doble clic para alternar modo lectura"
            >
              <HighResPdfViewer 
                page={pages[activePreviewIndex]} 
                zoom={modalZoom} 
              />
            </div>

            {/* Flecha Anterior */}
            {activePreviewIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setModalZoom(1.0);
                  setActivePreviewIndex(activePreviewIndex - 1);
                }}
                className="fixed left-6 top-1/2 -translate-y-1/2 p-3.5 bg-slate-900/80 hover:bg-indigo-600 text-white rounded-full transition shadow-2xl backdrop-blur-md border border-slate-700 z-30"
                title="Foja anterior [Flecha Izquierda]"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Flecha Siguiente */}
            {activePreviewIndex < pages.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setModalZoom(1.0);
                  setActivePreviewIndex(activePreviewIndex + 1);
                }}
                className="fixed right-6 top-1/2 -translate-y-1/2 p-3.5 bg-slate-900/80 hover:bg-indigo-600 text-white rounded-full transition shadow-2xl backdrop-blur-md border border-slate-700 z-30"
                title="Foja siguiente [Flecha Derecha]"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Pie informativo */}
          <div className="h-8 bg-slate-900/60 border-t border-slate-800/80 px-6 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
            <span>Usa <strong>+</strong> y <strong>-</strong> para zoom · Flechas <strong>←</strong> <strong>→</strong> para navegar</span>
            <span>Doble clic en la hoja para alternar entre 100% y 175%</span>
          </div>

        </div>
      )}

      {/* 5. OVERLAY DE CARGA */}
      {isLoading && (
        <div className="absolute inset-0 bg-slate-900/85 backdrop-blur-sm flex flex-col items-center justify-center z-50 rounded-2xl m-6">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
          <p className="text-indigo-300 font-semibold text-sm">{loadingText}</p>
          <p className="text-slate-400 text-xs mt-1">{loadingSubText}</p>
        </div>
      )}

    </div>
  );
}