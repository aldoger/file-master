import { scrypt, randomFill, createCipheriv } from 'crypto';
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream'

export const ALGORITHM = {
    CCM: { AES128: "aes-128-ccm", AES192: "aes-192-ccm", AES256: "aes-256-ccm" },
    GCM: { AES128: "aes-128-gcm", AES192: "aes-192-gcm", AES256: "aes-256-gcm" },
    OCB: { AES128: "aes-128-ocb", AES192: "aes-192-ocb", AES256: "aes-256-ocb" }
}

function encyrptFile(algorithm, password, fileName) {
    
}