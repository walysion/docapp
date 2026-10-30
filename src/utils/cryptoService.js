// src/utils/cryptoService.js

/**
 * Deriva una clave fuerte usando PBKDF2 (600,000 iteraciones)
 */
async function derivarClave(password, salt) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        "raw", enc.encode(password), { name: "PBKDF2" }, false, ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
        { name: "PBKDF2", salt: salt, iterations: 600000, hash: "SHA-256" },
        keyMaterial, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]
    );
}

/**
 * Encripta un Uint8Array (PDF) y retorna un Blob (.enc)
 */
export async function encriptarWebCrypto(pdfBytes, password) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12)); // IV recomendado para GCM
    const key = await derivarClave(password, salt);
    
    const encryptedContent = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv }, key, pdfBytes
    );
    
    // Empaquetar: [Salt (16)] + [IV (12)] + [Encrypted Data]
    const payload = new Uint8Array(salt.length + iv.length + encryptedContent.byteLength);
    payload.set(salt, 0);
    payload.set(iv, salt.length);
    payload.set(new Uint8Array(encryptedContent), salt.length + iv.length);
    
    return new Blob([payload], { type: "application/octet-stream" });
}

/**
 * Desencripta un ArrayBuffer (.enc) y retorna un Uint8Array (PDF)
 */
export async function desencriptarWebCrypto(arrayBuffer, password) {
    const data = new Uint8Array(arrayBuffer);
    if (data.length < 28) throw new Error("Archivo corrupto o demasiado pequeño");
    
    const salt = data.slice(0, 16);
    const iv = data.slice(16, 28);
    const encryptedContent = data.slice(28);
    
    const key = await derivarClave(password, salt);
    const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: iv }, key, encryptedContent
    );
    
    return new Uint8Array(decrypted);
}

/**
 * Analizador de fuerza de contraseña
 */
export function checkPasswordStrength(val) {
    let score = 0;
    if(val.length >= 10) score += 30; 
    if(val.length >= 14) score += 20;
    if(val.match(/[0-9]/)) score += 15; 
    if(val.match(/[A-Z]/)) score += 15; 
    if(val.match(/[^a-zA-Z\d]/)) score += 20;
    
    return {
        score: Math.max(0, Math.min(100, score)),
        isValid: val.length >= 10
    };
}