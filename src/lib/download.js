import fs from 'fs';
import { gdrive, spotify, youtube } from 'btch-downloader';
import { File } from 'megajs';
import { pipeline } from 'stream/promises';
import path from 'path';
import { makeFile } from './file.js';

export const Media = {
  IMAGE: 'image',
  YOUTUBE: 'youtube',
  MEGA: 'mega',
  GDRIVE: 'gdrive',
  SPOTIFY: 'spotify'
}

// TODO ubah semua menjadi promise based bukan callback (kalau bisa)
function getFileName(url, res) {
  const disposition = res.headers.get('content-disposition');

  if (disposition && disposition.includes('filename=')) {
    return disposition.split('filename=')[1].replace(/"/g, '');
  }

  const pathname = new URL(url).pathname;
  return path.basename(pathname) 
}

export async function downloadImage(url, dirPath) {
  const res = await fetch(url);

  if (!res.ok) {
    return { ok: false, error: `Download failed: ${res.status}` };
  }

  fs.mkdirSync(dirPath, { recursive: true });

  const fileName = getFileName(url, res);
  const filePath = path.join(dirPath, fileName);

  const result = await makeFile(res.body, filePath);

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    path: filePath,
  };
}



export async function downloadMegaFile(megaFileLink, dirPath) {
  const files = File.fromURL(megaFileLink);
  
  
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