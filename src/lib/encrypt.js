import { createCipheriv, randomBytes, createDecipheriv, getCiphers, KeyObject } from 'crypto';
import { makeFile } from './file.js';
import chalk from 'chalk';

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

    const encyrptedMessage = cipher.update(message, 'utf8', 'hex') + cipher.final('hex');

    return {
        secretData: secretDataString,
        encryptData: encyrptedMessage
    };
}

export function decyrptFile(algorithm, key, iv, message) {

    const bufferKey = Buffer.from(key, 'hex');
    const bufferIv = Buffer.from(iv, 'hex');

    const decipher = createDecipheriv(algorithm, bufferKey, bufferIv);

    try {
        const decyrptMessage = decipher.update(message, 'hex', 'utf8') + decipher.final('utf8');

        console.log("\n" + chalk.green("=== Decyrpt Message ==="));
        console.info(decyrptMessage)
        console.log(chalk.green("===================\n"));
    } catch (err) {
        
        if(err === "ERR_OSSL_BAD_DECRYPT") {
            console.info(chalk.red("Bad decrypt: wrong key or IV"));
        }
    }
}

export function encryptImage() {
    
}

export function decryptImage() {

}