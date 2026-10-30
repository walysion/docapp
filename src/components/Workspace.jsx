import React, { useRef, useEffect } from 'react';
import Sortable from 'sortablejs';
import { UploadCloud, RotateCw, Copy, Trash2 } from 'lucide-react';

export default function Workspace({
  pages,
  onPagesReorder,
  onAddFiles,
  onRotate,
  onDuplicate,
  onDelete,
  isLoading,
  loadingText,
  loadingSubText
}) {
  const gridRef = useRef(null);

  useEffect(() => {
    if (!gridRef.current || pages.length === 0) return;

    const sortable = Sortable.create(gridRef.current, {
      animation: 150,
      ghostClass: 'opacity-40',
      dragClass: 'scale-105',
      onEnd: (evt) => {
        const newPages = [...pages];
        const [movedItem] = newPages.splice(evt.oldIndex, 1);
        newPages.splice(evt.newIndex, 0, movedItem);
        onPagesReorder(newPages);
      }
    });

    return () => sortable.destroy();
  }, [pages]);

  return (
    <div className="flex-1 p-6 overflow-y-auto relative z-0 bg-slate-900">
      {pages.length === 0 ? (
        <div 
          onClick={onAddFiles}
          className="h-full w-full border-2 border-dashed border-slate-700 hover:border-indigo-500/80 rounded-2xl flex flex-col items-center justify-center bg-slate-800/20 hover:bg-slate-800/40 transition cursor-pointer group p-8"
        >
          <div className="p-5 bg-slate-800 rounded-full mb-4 group-hover:scale-110 transition-transform shadow-xl border border-slate-700">
            <UploadCloud className="w-10 h-10 text-indigo-400" />
          </div>
          <h3 className="text-lg font-bold mb-1 text-white">Preparar Nuevo Expediente</h3>
          <p className="text-slate-400 mb-5 text-center max-w-md text-xs leading-relaxed">
            Arrastra tus documentos PDF o Bóvedas (.ENC) aquí.<br />
            <strong>Client-Side Estricto:</strong> Ningún documento sale de la memoria de tu equipo.
          </p>
          <button 
            type="button"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold text-white transition shadow-lg shadow-indigo-500/20"
          >
            Seleccionar Archivos Locales
          </button>
        </div>
      ) : (
        <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 pb-20">
          {pages.map((page, index) => (
            <div 
              key={page.id} 
              className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden flex flex-col relative group hover:border-indigo-500/60 transition shadow-md"
            >
              {/* Badge de Folio */}
              <div className="absolute top-2 left-2 bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shadow-md z-10">
                {index + 1}
              </div>

              {/* Botón Borrar */}
              <button 
                onClick={() => onDelete(page.id)}
                className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition shadow z-10"
                title="Eliminar hoja"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              {/* Vista previa */}
              <div className="bg-slate-200 aspect-[1/1.4] m-2 mb-0 rounded flex items-center justify-center relative overflow-hidden shadow-inner">
                <img 
                  src={page.previewUrl} 
                  alt="preview"
                  className="w-full h-full object-contain bg-white transition-transform duration-200"
                  style={{ transform: `rotate(${page.rotation}deg)` }}
                />
              </div>

              {/* Pie de la tarjeta */}
              <div className="p-2 flex flex-col flex-1 mt-1 border-t border-slate-700/60 bg-slate-800/80">
                <div className="text-[10px] text-slate-400 truncate text-center mb-1.5" title={page.sourceName}>
                  {page.isBlank ? 'Hoja en Blanco' : `Pág ${page.originalPageNumber} · ${page.sourceName}`}
                </div>
                <div className="grid grid-cols-2 gap-1 mt-auto">
                  <button 
                    onClick={() => onRotate(page.id)}
                    className="py-1 bg-slate-700 hover:bg-indigo-600 text-slate-200 rounded flex justify-center items-center transition"
                    title="Rotar 90°"
                  >
                    <RotateCw className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={() => onDuplicate(page.id)}
                    className="py-1 bg-slate-700 hover:bg-emerald-600 text-slate-200 rounded flex justify-center items-center transition"
                    title="Duplicar"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Overlay de Carga */}
      {isLoading && (
        <div className="absolute inset-0 bg-slate-900/85 backdrop-blur-sm flex flex-col items-center justify-center z-30 rounded-2xl m-6">
          <div className="loader mb-3"></div>
          <p className="text-indigo-300 font-semibold text-sm">{loadingText}</p>
          <p className="text-slate-400 text-xs mt-1">{loadingSubText}</p>
        </div>
      )}
    </div>
  );
}