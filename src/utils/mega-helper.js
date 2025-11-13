import { createWriteStream } from 'fs';
import path from 'path';

export async function downloadSingleMegaFile(file, dirPath) {
  const savePath = path.join(dirPath, file.name);
  console.info(`⬇️ Downloading ${file.name}...`);
  const opts = {
    forceHttps: true,
    maxConnections: 12,
    maxChunkSize: 1024 * 1024, // 1 MB
    initialChunkSize: 1024 * 1024,
    chunkSizeIncrement: 0,
  }

  try {
    const buf = await file.downloadBuffer(opts);

    await new Promise((resolve, reject) => {
      const writer = createWriteStream(savePath);
      writer.write(buf);
      writer.end();
      writer.on("finish", () => {
        console.log(`✅ Download complete: ${file.name}`);
        resolve();
      });
      writer.on("error", reject);
    });
  } catch (err) {
    console.error(`✖ Error downloading ${file.name}`);
    throw err;
  }
}



