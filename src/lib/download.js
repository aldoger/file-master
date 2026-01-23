import { gdrive, spotify, youtube, ttdl } from 'btch-downloader';
import { File } from 'megajs';
import os from 'os';
import fs, { read } from 'fs';
import path from 'path';
import { checkAndMakeDir, makeFile } from './file.js';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';

export const Media = {
  INTERNET: 'internet',
  YOUTUBE: 'youtube',
  MEGA: 'mega',
  GDRIVE: 'gdrive',
  SPOTIFY: 'spotify',
  TIKTOK: 'tiktok'
}

function getOptimalMegaChunkConfig(fileSize) {
  const KB = 1024;
  const MB = 1024 * KB;

  if (fileSize <= 0 || !Number.isFinite(fileSize)) {
    // fallback safe default
    return {
      initialChunkSize: 256 * KB,
      chunkSizeIncrement: 256 * KB
    };
  }

  // Small files (< 256 KB)
  if (fileSize < 256 * KB) {
    return {
      initialChunkSize: 128 * KB,
      chunkSizeIncrement: 0
    };
  }

  // Large files (5 MB – 100 MB)
  if (fileSize < 100 * MB) {
    return {
      initialChunkSize: 512 * KB,
      chunkSizeIncrement: 512 * KB
    };
  }

  // Very large files (> 100 MB)
  return {
    initialChunkSize: 1 * MB,
    chunkSizeIncrement: 1 * MB
  };
}

const userHomeDir = checkAndMakeDir(`${os.homedir}/Downloads`);

function returnFailure(err) {
  return {
    ok: false,
    error: err.message
  }
};

function returnSuccess(path) {
  return {
    ok: true,
    path: path
  }
};

function getFileName(url, res) {
  const disposition = res.headers.get('content-disposition');

  if (disposition && disposition.includes('filename=')) {
    return disposition.split('filename=')[1].replace(/"/g, '');
  }

  const pathname = new URL(url).pathname;
  return path.basename(pathname) 
}

export async function downloadFromInternet(url) {
  const res = await fetch(url);

  if (!res.ok) {
    return { ok: false, error: `Download failed: ${res.status}` };
  }

  const fileName = getFileName(url, res);
  const filePath = path.join(userHomeDir, fileName);

  const stream = Readable.fromWeb(res.body);

  const result = await makeFile(stream, filePath);

  if (!result.ok) {
    return returnFailure(result.error);
  }

  return {
    ok: true,
    path: filePath,
  };
}

export async function downloadMegaFile(megaFileLink) {


  try {
    const file = File.fromURL(megaFileLink);

    const data = await file.loadAttributes();

    const chunkConfig = getOptimalMegaChunkConfig(data.size);

    const opt = {
      initialChunkSize: chunkConfig.initialChunkSize,
      chunkSizeIncrement: chunkConfig.chunkSizeIncrement,
      forceHttps: true
    };

    const filePath = path.join(userHomeDir, data.name);

    await pipeline(
      data.download(opt),
      fs.createWriteStream(filePath)
    );

    return returnSuccess(filePath);

  } catch (err) {
    return returnFailure(err);
  }
}


export async function downloadGDriveFile(driveLink) {
  try {
    const gDriveFile = await gdrive(driveLink);

    if(!gDriveFile.status) return returnFailure(new Error("failed to fetch google drive link"));

    const fileName = gDriveFile.result.filename;
    const filePath = path.join(userHomeDir, fileName);

    const response = await fetch(gDriveFile.result.downloadUrl);

    if(!response.ok) return returnFailure(new Error(`failed to fetch: ${response.statusText}`));

    const stream = Readable.fromWeb(response.body);

    const result = await makeFile(stream, filePath);

    if(!result.ok) return returnFailure(result.error);

    return returnSuccess(filePath);
  } catch (err) {
    return returnFailure(err);
  }
}

export async function downloadSpotifyMusic(spotifyLink) {
  try {
    const spotifyMusic = await spotify(spotifyLink);

    if(!spotifyMusic.status) return returnFailure(new Error("failed to fetch spotify link"));

    const fileName = spotifyMusic.result.title;
    const filePath = path.join(userHomeDir, fileName);

    const response = await fetch(spotifyMusic.result.source);

    const stream = Readable.fromWeb(response.body);

    const result = await makeFile(stream, filePath);

    if(!result.ok) return returnFailure(result.error);
    
    return returnSuccess(filePath);
  } catch (err) {
    return returnFailure(err);
  }
}

export async function downloadYoutubeVideos(ytLink, isMP3) {
  try {
    const ytVid = await youtube(ytLink);

    if(!ytVid.status) return returnFailure(new Error("failed to fetch youtube link"));

    const fileName = ytVid.title;
    const filePath = path.join(userHomeDir, fileName);

    let ytMedia;
    if(isMP3) ytMedia = ytVid.mp3;
    else ytMedia = ytVid.mp4;

    const response = await fetch(ytMedia);

    const stream = Readable.fromWeb(response.body);

    const result = await makeFile(stream, filePath);

    if(!result.ok) return returnFailure(result.error);

    return returnSuccess(filePath);
  } catch (err) {
    return returnFailure(err);
  }
}

export async function downloadTiktokVideos(tiktokLink) {
  try {
    const tiktokVid = await ttdl(tiktokLink);

    if(!tiktokVid.status) return returnFailure("failed to fetch tiktok link");

    console.log(tiktokVid);

    return returnSuccess('wait');

    const fileName = tiktokVid.title;
    const filePath = path.join(userHomeDir, fileName);

  } catch (err) {
    return returnFailure(err);
  }
}
