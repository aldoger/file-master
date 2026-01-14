import fs from 'fs';
import { gdrive, spotify, youtube } from 'btch-downloader';
import { File } from 'megajs';
import os from 'os';
import path from 'path';
import { makeFile } from './file.js';

export const Media = {
  IMAGE: 'image',
  YOUTUBE: 'youtube',
  MEGA: 'mega',
  GDRIVE: 'gdrive',
  SPOTIFY: 'spotify'
}

const userHomeDir = os.homedir();

// TODO ubah semua menjadi promise based bukan callback (kalau bisa)
function getFileName(url, res) {
  const disposition = res.headers.get('content-disposition');

  if (disposition && disposition.includes('filename=')) {
    return disposition.split('filename=')[1].replace(/"/g, '');
  }

  const pathname = new URL(url).pathname;
  return path.basename(pathname) 
}

export async function downloadImage(url) {
  const res = await fetch(url);

  if (!res.ok) {
    return { ok: false, error: `Download failed: ${res.status}` };
  }

  const fileName = getFileName(url, res);
  const filePath = path.join(userHomeDir, fileName);

  const result = await makeFile(res.body, filePath);

  if (!result.ok) {
    return result.error;
  }

  return {
    ok: true,
    path: filePath,
  };
}



export async function downloadMegaFile(megaFileLink) {
  const files = File.fromURL(megaFileLink);
}

export async function downloadGDriveFile(driveLink) {
  return new Promise((resolve, reject) => {
    gdrive(driveLink)
      .then((response) => {
        if(!response.status) reject('failed to fetch google drive');
        

        const fileName = response.result.filename;
        const filePath = path.join(userHomeDir, fileName);
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

export async function downloadSpotifyMusic(spotifyLink) {
 return new Promise((resolve, reject) => {
    spotify(spotifyLink)
      .then((response) => {
        if(!response.status) reject('failed to fetch spotify link');

        const fileName = response.result.title;
        const filePath = path.join(userHomeDir, fileName);

        fetch(response.result.source)
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
          .catch((err) => reject(err))
      })
      .catch((err) => reject(err));
 }) 
}

export async function downloadYoutubeVideos(ytLink, isMP3) {
  return new Promise((resolve, reject) => {
    youtube(ytLink)
      .then((response) => {
        if(!response.status) reject('failed to fetch youtube link');

        const fileName = response.title;
        const filePath = path.join(userHomeDir, fileName);

        if(isMP3) {
          fetch(response.mp3)
            .then(async (res) => {
              
              try {
                const result = await makeFile(res.body, filePath);
                if(!result.ok) reject(result);

                resolve({
                  ok: true,
                  path: filePath
                });
              } catch (err) {
                reject(err);
              }
            })
            .catch((err) => reject(err));
        } else {
          fetch(response.mp4)
            .then(async (res) => {
              
              try {
                const result = await makeFile(res.body, filePath);
                if(!result.ok) reject(result);

                resolve({
                  ok: true,
                  path: filePath
                });
              } catch (err) {
                reject(err);
              }
            })
            .catch((err) => reject(err));
        }
      })
      .catch((err) => reject(err));
  })
}