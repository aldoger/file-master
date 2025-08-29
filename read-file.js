import path from 'path';
import fs from 'fs';

function readFileData(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(filename), 'utf8', (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
}

export default readFileData;
