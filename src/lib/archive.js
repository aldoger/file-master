import { Zip, extract } from "zip-lib";
import path from 'path';

export function zipFiles(arrFilePath, outPath) {
    const zip = new Zip();
    return new Promise((resolve, reject) => {
        arrFilePath.forEach((path) => {
            zip.addFile(path);
        });

        zip.archive(outPath + ".zip").then(() => {
            resolve();
        }, (err) => {
            console.error("Error zipping files: ", err.message);
            reject(err);
        })
    });
}

export function unZip(zipFile, outDir) {
    return new Promise((resolve, reject) => {
        extract(zipFile, outDir).then(() => {
            resolve()
        }, (err) => {
            console.error("Error zipping file: ", err.message);
            reject(err);
        });
    })
}