import fs from 'fs';
import http from 'http';
import https from 'https';
import { gdrive, spotify } from 'btch-downloader';
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

// Dependencies not maintain, mediafire cannot be downloaded
export async function downloadMediaFireFile(mediaFireLink, dirPath) {
  return new Promise((resolve, reject) => {
    mediafire(mediaFireLink)
      .then(async (file) => {
        if (file.status !== true) {
          return reject(new Error("failed to get direct link"));
        }

        let directUrl = file.result.url;
        const filePath = path.join(dirPath, file.result.filename);


        const response = await fetch(directUrl);

        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("text/html")) {
          const html = await response.text();
          const match = html.match(/https:\/\/download[^"]+/);

          if (!match) {
            return reject(
              new Error("cannot extract download url")
            );
          }

          directUrl = match[0];
          console.log("Re-fetch real link:", directUrl);
        }

        const realResponse = await fetch(directUrl);
        if (!realResponse.ok) {
          return reject(new Error(`HTTP error: ${realResponse.status}`));
        }

        const writer = fs.createWriteStream(filePath);
        pipeline(realResponse.body, writer, (err) => {
          if (err) return reject(err);
          resolve(filePath);
        });
      })
      .catch((err) => reject(err));
  });
}

// Some downloads still not be done
export async function downloadMegaFile(megaFileLink, dirPath) {
  return new Promise((resolve, reject) => {
    const file = File.fromURL(megaFileLink);

    file.loadAttributes((err) => {
      if (err) return reject(err);

      file.children.forEach(async (data) => {
        const filePath = path.join(dirPath, data.name);
        const success = await downloadIterMegaFile(data, filePath);
        if(!success) return reject("Error downloading file");
      });

      resolve();
    });
  });
}

export async function downloadGDriveFile(driveLink, dirPath) {
  return new Promise((resolve, reject) => {
    gdrive(driveLink)
      .then((file) => {
        if(file.status !== true) {
          return reject(new Error('failed to get link gdrive'));
        }

        const directUrl = file.result.data.downloadUrl;
        const fileName = file.result.data.filename;
        console.log("Downloading file: " + fileName);
        const filePath = path.join(dirPath, file.result.data.filename);

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
  });
}

export async function downloadSpotifyMusic(spotifyLink, dirPath) {
  return new Promise((resolve, reject) => {
    spotify(spotifyLink)
      .then((file) => {
        if(file.status !== true) {
          return reject(new Error('failed to get link spotify'));
        }

        const fileName = file.result.title;
        console.log("Downloading music: " + fileName);
        const filePath = path.join(dirPath, fileName);

        const writer = fs.createWriteStream(filePath);
        
        fetch(file.result.formats[0].url)
          .then((response) => {
            if(!response.ok) {
              return reject(new Error(`HTTP error: ${response.status}`));
            }

            pipeline(response.body, writer, (err) => {
              if (err) return reject(err);
              resolve(filePath);
            });
          });
        resolve();

      }).catch((err) => reject(err));
  });
}

async function downloadIterMegaFile(file, filePath) {
  const writer = fs.createWriteStream(filePath);
  const reader = file.download();
  return new Promise((resolve, reject) => {
    pipeline(reader, writer, (err) => {
      if (err) return reject(err);
      resolve();
    });
  }); 
}