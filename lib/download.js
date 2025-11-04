import fs from 'fs';
import http from 'http';
import https from 'https';

export async function downloadImage(url, filePath) {
  const client = url.startsWith('https') ? https : http;

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);

    const request = client.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close(() => resolve(filePath));
      });
    });

    request.on('error', (err) => {
      fs.unlink(filePath, () => reject(err));
    });
  });
}

export async function downloadMediaFireFile(file, filePath) {
    
}
