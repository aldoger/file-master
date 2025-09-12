import { createCipheriv, randomBytes, createDecipheriv, getCiphers } from 'crypto';
import { makeFile } from './file-operation.js';

export const Algo = [
    "aes128",
    "aes192",
    "aes256"
]

export async function encyrptFile(algorithm, message, filename) { 
    var size;

    if(algorithm.includes("128")) size = 16;
    if(algorithm.includes("192")) size = 24;
    if(algorithm.includes("256")) size = 32;

    const key = randomBytes(size);
    const iv = randomBytes(16);

    const cipher = createCipheriv(algorithm, key, iv);
    
    const secretData = { key: key.toString('hex'), iv: iv.toString('hex'), algo: algorithm };
    
    const secretDataString = JSON.stringify(secretData);
    
    await makeFile(secretDataString, 'txt', `${filename}_secret`);

    const encyrptedMessage = cipher.update(message, 'utf8', 'hex') + cipher.final('hex');

    await makeFile(encyrptedMessage, 'enc', filename);
}

export async function decyrptFile(algorithm, fileEnc) {

}