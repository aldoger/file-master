import { createCipheriv, randomBytes, createDecipheriv, getCiphers, KeyObject } from 'crypto';
import { makeFile } from './file.js';
import chalk from 'chalk';

export const Algo = [
    "aes128",
    "aes192",
    "aes256"
]

export function encryptFile(algorithm, message) { 
    let keySize;
   
    switch (algorithm) {
      case 'aes128':
        keySize = 16;
        break;
      case 'aes192':
        keySize = 24;
        break;
      case 'aes256':
        keySize = 32;
        break;
      default:
        algorithm = 'aes128';
        keySize = 16;
        break;
    }

    const key = randomBytes(keySize);
    const iv = randomBytes(16);

    const cipher = createCipheriv(algorithm, key, iv);
    
    const encryptedMessage = cipher.update(message, 'utf8', 'hex') + cipher.final('hex');

    return {
        secretData: JSON.stringify({
        key: key.toString('hex'),
        iv: iv.toString('hex'),
        algo: algorithm,
    }),
        encryptData: encryptedMessage
    };
}

export function decyrptFile(algorithm, key, iv, message) {

    const bufferKey = Buffer.from(key, 'hex');
    const bufferIv = Buffer.from(iv, 'hex');

    const decipher = createDecipheriv(algorithm, bufferKey, bufferIv);

    try {
        const decyrptMessage = decipher.update(message, 'hex', 'utf8') + decipher.final('utf8');

        return decyrptMessage;
    } catch (err) {
        if(err === "ERR_OSSL_BAD_DECRYPT") {
            console.info(chalk.red("Bad decrypt: wrong key or IV"));
            process.exit(1);
        }
    }
}
