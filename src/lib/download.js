import fs from 'fs';
import { gdrive, spotify, youtube } from 'btch-downloader';
import { File } from 'megajs';
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
    return result.error;
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
      .then((response) => {
        if(!response.status) reject('failed to fetch google drive');
        

        const fileName = response.result.filename;
        const filePath = path.join(dirPath, fileName);
        fetch(response.result.downloadUrl)
          .then(async (res) => {
            
            try {
              const result = await makeFile(res.body, filePath);
              if(!result.ok) reject(result.error);

              resolve({
                ok: true,
                path: filePath
              });
            } catch (err) {
              reject(err);
            }

          })
          .catch((err) => reject(err));
      })
      .catch((err) => reject(err));
  });
}

export async function downloadSpotifyMusic(spotifyLink, dirPath) {
 return new Promise((resolve, reject) => {
    spotify(spotifyLink)
      .then((response) => {
        if(!response.status) reject('failed to fetch spotify link');

        const fileName = response.result.title;
        const filePath = path.join(dirPath, fileName);

        fetch(response.result.source)
          .then(async (res) => {

            try {
              const result = await makeFile(res.body, filePath);
              if(!result.ok) reject(result.error);
              
              reject({
                ok: true,
                path: filePath
              });
            } catch (err) {
              reject(err);
            }
          })
          .catch((err) => reject(err))
      })
      .catch((err) => reject(err));
 }) 
}

export async function downloadYoutubeVideos(ytLink, dirPath, isMP3) {
  return new Promise((resolve, reject) => {
    youtube(ytLink)
      .then((response) => {
        
      })
      .catch((err) => reject(err));
  })
}