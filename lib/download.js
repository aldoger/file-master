import fs from 'fs';
import http from 'http';
import https from 'https';
import { mediafire, gdrive } from 'btch-downloader';
import { File } from 'megajs';
import { pipeline } from 'stream';
import path from 'path';

export async function downloadImage(url, dirPath) {
  const client = url.startsWith('https') ? https : http;
  const fileName = path.basename(new URL(url).pathname);
  const filePath = path.join(dirPath, fileName);

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

export async function downloadMediaFireFile(mediaFireLink, dirPath) {
  return new Promise((resolve, reject) => {
    mediafire(mediaFireLink)
      .then((file) => {
        if (!file || file.status !== 0) {
          return reject(new Error('failed get direct link MediaFire'));
        }

        const directUrl = file.result.url;
        console.log('Direct link:', directUrl);
        const filePath = path.join(dirPath, file.result.filename);

        fetch(directUrl)
          .then((response) => {
            if (!response.ok) {
              return reject(new Error(`HTTP error: ${response.status}`));
            }

            const writer = fs.createWriteStream(filePath);

            pipeline(response.body, writer, (err) => {
              if (err) return reject(err);
              resolve(filePath);
            });
          })
          .catch((err) => reject(err));
      })
      .catch((err) => reject(err));
  });
}

export async function downloadMegaFile(megaFileLink, dirPath) {
  return new Promise((resolve, reject) => {
    const file = File.fromURL(megaFileLink);

    file.loadAttributes((err) => {
      if (err) return reject(err);

      console.log(`🔗 Download: ${file.name} (${file.size} bytes)`);
      const filePath = path.join(dirPath, file.name);

      const writer = fs.createWriteStream(filePath);

      const reader = file.download();

      pipeline(reader, writer, (err) => {
        if (err) return reject(err);
        resolve(filePath);
      });
    });
  });
}

export async function downloadGDriveFile(driveLink, dirPath) {
  return new Promise((resolve, reject) => {
    gdrive(driveLink)
      .then((file) => {
        if(!file || file.status == 0) {
          return reject(new Error('failed to get link gdrive'));
        }

        const directUrl = file.result.downloadUrl;
        console.log('Direct link: ', directUrl);
        const filePath = path.join(dirPath, file.result.filename);

        fetch(directUrl)
          .then((response) => {
            if(!response.ok) {
              return reject(new Error(`HTTP error: ${response.status}`));
            }

            const writer = fs.createWriteStream(filePath);

            pipeline(response.body, writer, (err) => {
              if (err) return reject(err);
              resolve(filePath);
            });
        })
    }).catch((err) => reject(err));
  })
}