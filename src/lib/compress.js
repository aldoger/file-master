import { createGzip, createUnzip } from 'zlib'
import { createReadStream, createWriteStream, stat } from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';

export async function compressFile(inputFile, outputFile) {
    const extension = path.extname(inputFile);
    if(extension == '.gz' || extension == '.jpg' || extension == ".zip" || extension == ".png") {
        throw new Error("Cannot compress file with extension: " + extension);
    }

    const compress = createGzip({ level: 6 });
    try {
      await pipeline(
          createReadStream(inputFile), 
          compress, 
          createWriteStream(outputFile)
        );   
    } catch (error) {
      console.error("Error while compressing file:", err);
    }
}

export async function decompressFile(inputFile, outputFile) {
    const decompress = createUnzip()
    try {
        await pipeline(
        createReadStream(inputFile),
        decompress,
        createWriteStream(outputFile)
        );

    } catch (err) {
        console.error("Error while decompressing file:", err);
    }
}