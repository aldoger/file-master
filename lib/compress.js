import fs from 'fs';

export async function compressPDF(file, out) {
    const writer = fs.createWriteStream(out);
    const reader = fs.createReadStream(file);
    const buf = Buffer.alloc();

    return new Promise((resolve, reject) => {
        reader.read(file);

        reader.on('data', (data) => {
            buf += data;
        });
    });
}

export async function compressImage(file, out) {
    
}
