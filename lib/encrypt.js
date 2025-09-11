import { createCipheriv, randomBytes } from 'crypto';
import { makeFile } from './file-operation.js';
export const ALGORITHM = {
    CCM: { AES128: "aes-128-ccm", AES192: "aes-192-ccm", AES256: "aes-256-ccm" },
    GCM: { AES128: "aes-128-gcm", AES192: "aes-192-gcm", AES256: "aes-256-gcm" },
    OCB: { AES128: "aes-128-ocb", AES192: "aes-192-ocb", AES256: "aes-256-ocb" }
}

export async function encyrptFile(algorithm, message, key, filename) { // TODO benerkan fungsi 
    const iv = randomBytes(16);

    const cipher = createCipheriv(algorithm, key, iv);

    await makeFile({ key: key, iv: iv, algo: algorithm }, 'txt', `${filename}_secret`);

    const encyrptedMessage = cipher.update(message, 'utf8', 'hex') + cipher.final('hex');

    await makeFile(encyrptedMessage, 'enc', filename);
}
