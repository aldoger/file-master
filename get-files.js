import fs from "fs";
import path from "path";

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    arrayOfFiles.push(fullPath);
  });

  return arrayOfFiles;
}

export default getAllFiles;
