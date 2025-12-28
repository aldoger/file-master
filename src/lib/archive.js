import { Zip } from "zip-lib";

export function ZipFiles(arrFilePath, outPath) {
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