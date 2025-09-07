import { opendir, copyFile, constants } from 'fs/promises';
import fs from "fs";
import path from "path";

export async function getDirectory(Dir) {
    try {
        var directories = [];
        const dir = await opendir(Dir);
        for await (const dirent of dir)
            if(dirent.isDirectory()) directories.push(dirent.name);
        directories.push('../');
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

export function makeFile(data, ext, filename) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path.resolve(`${filename}.${ext}`), data, (err) => {
      if (err) {
        console.error(err);
        reject(false);
      } else {
        resolve(true);
      }
    });
  });
}

export async function moveFile(oldPath, newPath) {
    fs.rename(oldPath, newPath, (err) => {
        if(err) {
            console.error(err);
            return;
        }
        console.info("Successfully moved");
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
    await copyFile(sourceFile, destinationFile, constants.COPYFILE_EXCL);
  } catch {
    console.error("The file could not be opened, file already exist");
  }
}