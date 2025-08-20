import fs from 'fs/promises';
import path from 'path';

async function makeFile(data, ext, filename) {
  try {
    await fs.writeFile(path.resolve(`${filename}.${ext}`), data);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export default makeFile;
