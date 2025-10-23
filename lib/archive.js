import { createGzip, createUnzip } from 'zlib'
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';

export async function zipFile(inputFile, outputFile) {
    try {
      const gzip = createGzip();
      const source = createReadStream(inputFile);
      const destination = createWriteStream(outputFile);
      await pipeline(source, gzip, destination);   
    } catch (error) {
      console.error("Error while unzipping file:", err);
    }
}

export async function unZipFile(inputFile, outputFile) {
  try {
    await pipeline(
      createReadStream(inputFile),
      createUnzip(),
      createWriteStream(outputFile)
    );

  } catch (err) {
    console.error("Error while unzipping file:", err);
  }
}