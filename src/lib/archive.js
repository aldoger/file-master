import { Zip, extract } from "zip-lib";

export async function zipFiles(arrFilePath, outPath) {
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

export async function zipFolders(arrFolderPath, outPath) {
    const zip = new Zip();

    return new Promise((resolve, reject) => {
        arrFolderPath.forEach((folder) => {
            zip.addFolder(folderPath);
        });

        zip.archive(outPath + ".zip").then(() => {
            resolve();
        }, (err) => {
            return reject(err.message);
        });
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