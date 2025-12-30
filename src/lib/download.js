import fs from 'fs';
import http from 'http';
import https from 'https';
import { gdrive, spotify, youtube } from 'btch-downloader';
import { File } from 'megajs';
import { pipeline } from 'stream/promises';
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


export async function downloadMegaFile(megaFileLink, dirPath) {
  return new Promise((resolve, reject) => {
    const files = File.fromURL(megaFileLink);

    files.loadAttributes(async (err, file) => {
      if (err) reject(err);

      const savePath = path.join(dirPath, file.name);
      const opts = {
        forceHttps: true,
        maxConnections: 12,
        maxChunkSize: 1024 * 1024, // 1 MB
        initialChunkSize: 1024 * 1024,
        chunkSizeIncrement: 0,
      }

      try {

        const buf = await file.downloadBuffer(opts);
        const writer = fs.createWriteStream(savePath);
        writer.write(buf);
        writer.end();
        writer.on("finish", () => {
          resolve();
        });
        writer.on("error", reject);
        resolve(file.name);
      }catch(err) {
        reject(err);
      }
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
        const filePath = path.join(dirPath, fileName);

        const writer = fs.createWriteStream(filePath);
        
        fetch(file.result.formats[0].url)
          .then((response) => {
            if(!response.ok) {
              return reject(new Error(`HTTP error: ${response.status}`));
            }

            pipeline(response.body, writer, (err) => {
              if (err) return reject(err);
            });
          });
        resolve();

      }).catch((err) => reject(err));
  });
}

export async function downloadVideyVideo(videyLink, dirPath) {
  return new Promise((resolve, reject) => {
    resolve();
  });
}

export async function downloadYoutubeVideos(ytLink, dirPath, isMP3) {
  return new Promise((resolve, reject) => {
    youtube(ytLink)
      .then( async (data) => {

        const fileName = data.title;

        const filePath = path.join(dirPath, fileName);

        const writer = fs.createWriteStream(filePath);

        let dataLink;
        if(isMP3) dataLink = data.mp3;
        else dataLink = data.mp4;

        if(dataLink == null || dataLink == "") {
          reject("No data found");
        } 

        const response = await fetch(dataLink);

        if(!response.ok) reject("failed to load data body");

        const arrBuf = await response.arrayBuffer();

        writer.write(Buffer.from(arrBuf), (err) => {
          if (err) return reject(err);
          writer.end();
        });

        resolve();
      })
      .catch(err => reject(err));
  });
}