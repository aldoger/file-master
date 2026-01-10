import { opendir, copyFile as copyFileSafe, constants, glob, stat } from 'fs/promises';
import fs from "fs";
import { pipeline } from 'stream/promises';
import path from "path";

export async function getDirectory(Dir) {
    try {
        var directories = [];
        const dir = await opendir(Dir);
        for await (const dirent of dir)
            if(dirent.isDirectory()) directories.push(dirent.name);
        directories.push('../');
        directories.push('./');
        return directories;
    } catch (err) {
        console.error(err);      
    }
};

export function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const file of files) {
    if(file.isDirectory()) {
      continue;
    }
    const fullPath = path.join(dirPath, file.name);
    arrayOfFiles.push(fullPath);
  }

  return arrayOfFiles;
}

export async function getZipFiles(arrayOfZipFiles = []) {
  for await (const file of glob("*.zip")) {
    arrayOfZipFiles.push(file);
  }
  return arrayOfZipFiles;
}

export async function getEncFiles(arrayFilesEnc = [], arrayFileSecret = []) {
  for await (const file of glob("*.enc")) {
    arrayFilesEnc.push(file);
  }

  for await (const file of glob("*_secret.txt")) {
    arrayFileSecret.push(file);
  }

  return {arrayFilesEnc, arrayFileSecret}
}

export async function makeFile(stream, filePath) {
  const writer = fs.createWriteStream(filePath);

  try {
    await pipeline(stream, writer);
    return { ok: true };
  } catch (err) {
    writer.destroy();
    fs.unlink(filePath, () => {});
    return {
      ok: false,
      error: err.message,
    };
  }
}


export async function moveFile(oldPath, newPath) {
    fs.rename(oldPath, newPath, (err) => {
        if(err) {
            console.error(err);
            return;
        }
    });
}

export function readFileData(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(filename), 'utf8', (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
}

export async function copyFile(sourceFile, destinationFile) {
  
  try {
    await copyFileSafe(sourceFile, destinationFile, constants.COPYFILE_EXCL);
  } catch {
    console.error("The file could not be opened, file already exist");
  }
}

export function isFile(filePath) {
  const stat = fs.statSync(filePath);
  return stat.isFile();
}

export function isDirectory(dirPath) {
  const stat = fs.statSync(dirPath);
  return stat.isDirectory();
}