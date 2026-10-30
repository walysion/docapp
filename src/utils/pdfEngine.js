// src/utils/pdfEngine.js
import { PDFDocument, rgb, degrees } from 'pdf-lib';

export async function generarBytesMaster(pages, isPro, applyWatermark, applyFolio) {
    const pdfFinal = await PDFDocument.create();
    const cache = new Map(); 

    for (let i = 0; i < pages.length; i++) {
        const pageData = pages[i];
        let tPage;

        if (pageData.isBlank) { 
            tPage = pdfFinal.addPage([595.28, 841.89]); 
        } else {
            if (!cache.has(pageData.fileData)) { 
                cache.set(pageData.fileData, await PDFDocument.load(pageData.fileData.slice(0))); 
            }
            const sourceDoc = cache.get(pageData.fileData);
            const [copied] = await pdfFinal.copyPages(sourceDoc, [pageData.pageIndex]);
            
            // Suma la rotación original a la aplicada por el usuario
            const originalRotation = copied.getRotation().angle;
            if (pageData.rotation !== 0) {
                copied.setRotation(degrees(originalRotation + pageData.rotation));
            }
            tPage = pdfFinal.addPage(copied);
        }
        
        const { width, height } = tPage.getSize();
        
        // Foliado judicial (solo PRO)
        if (isPro && applyFolio) {
            tPage.drawText(`F. ${(i + 1).toString().padStart(3, '0')}`, { 
                x: width - 70, y: height - 40, size: 12, color: rgb(0.1, 0.1, 0.1) 
            });
        }
        
        // Marca de agua (solo PRO)
        if (isPro && applyWatermark) {
            tPage.drawText('CONFIDENCIAL', { 
                x: width/2 - 250, y: height/2 - 50, size: 70, color: rgb(0.85, 0.1, 0.1), opacity: 0.15, rotate: degrees(45) 
            });
        }
    }
    
    return await pdfFinal.save();
}

export function descargarBlob(data, nombre, mime) {
    const blob = new Blob([data], { type: mime }); 
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = nombre;
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}