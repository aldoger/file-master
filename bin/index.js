#!/usr/bin/env node
import chalk from 'chalk';
import { AddProgram, FileMasterProgram } from '../src/config/program.js';
import { downloadFromInternet, downloadGDriveFile, downloadMegaFile, downloadSpotifyMusic, downloadTiktokVideos, downloadYoutubeVideos, Media } from '../src/lib/download.js';
import { decyrptFile, encyrptFile } from '../src/lib/encrypt.js';
import { isDirectory, isFile, makeFile, readFileData } from '../src/lib/file.js';
import info from '../src/utils/info.js';
import { errorMessage, processMessage, successMessage } from '../src/utils/message.js';
import process from 'process';
import { zipFiles, zipFolders } from '../src/lib/archive.js';
import { convertDocsToPDF } from '../src/lib/convert.js';
import path from 'path';
import { streamFromString, readInput } from '../src/utils/stream.js';

async function download(url, options) {

    processMessage('downloading...');
    let downloadPath;
    try {
        switch (options.media) {
            case Media.YOUTUBE:
                let isMp3
                let input = await readInput('do you want to download mp3? (Y/N) ');

                if(input == 'Y' || input == 'y') isMp3 = true;
                else if(input == 'N' || input == 'n') isMp3 = false;
                else {
                    errorMessage('Invalid input');
                    process.exit(0);
                } 

                const resultYt = await downloadYoutubeVideos(url, isMp3);
                if(!resultYt.ok) {
                    errorMessage(`Error download: ${resultYt.error}`);
                    process.exit(1);
                }

                downloadPath = resultYt.path;
                break;
            case Media.INTERNET:
                
                const resultIn = await downloadFromInternet(url);
                if(!resultIn.ok) {
                    errorMessage(`Error download: ${resultIn.error}`);
                    process.exit(1);
                }

                downloadPath = resultIn.path;
                break;
            case Media.GDRIVE:
            
                const resultGD = await downloadGDriveFile(url);
                if(!resultGD.ok) {
                    errorMessage(`Error download: ${resultGD.error}`);
                    process.exit(1);
                }

                downloadPath = resultGD.path;
                break;
            case Media.MEGA:

                const resultMEG = await downloadMegaFile(url);
                if(!resultMEG.ok) {
                    errorMessage(`Error download: ${resultMEG.error}`);
                    process.exit(1);
                }

                downloadPath = resultMEG.path;
                break;
            case Media.SPOTIFY:
                
                const resultSPO = await downloadSpotifyMusic(url);
                if(!resultSPO.ok) {
                    errorMessage(`Error download: ${resultSPO.error}`);
                    process.exit(1);
                }

                downloadPath = resultSPO.path;
                break;

            case Media.TIKTOK:
                const resultTik = await downloadTiktokVideos(url);
                if(!resultTik.ok) {
                    errorMessage(`Error download: ${resultTik.error}`);
                    process.exit(1);
                }
            default:
                errorMessage(`invalid media: ${options.media}`);
                process.exit(1);
        }
    } catch (err) {
        errorMessage(`Error downloading: ${err.message}`);
    }

    successMessage(`download success. File: ${downloadPath}`);
    process.exit(0);
}

async function encyrpt(filePath, options) {
    processMessage('encrypting...');
    
    const dirName = process.cwd();

    console.log(dirName);

    const encFilePath = path.join(dirName, options.name);
    const secretFilePath = path.join(dirName, `${options.name}_secret.txt`)

    try {
        const data = readFileData(filePath);
        const encrypt = encyrptFile(options.algo, data);

        const encData = streamFromString(encrypt.encryptData);

        await makeFile(encData, encFilePath);

        const secretData = streamFromString(encrypt.secretData);

        await makeFile(secretData, secretFilePath);

        successMessage('encryption success');
        process.exit(0);
    } catch (err) {
        errorMessage(err.message);
        process.exit(1);
    }
}

async function decrypt(filePath, options) {
    processMessage('decrypting...');

    
    const algo = options.algo;
    const key = options.key;
    const iv = options.iv;

    const decyrptMessage = decyrptFile(algo, key, iv);
    console.log("\n" + chalk.green("=== Decyrpt Message ==="));
    console.info(decyrptMessage)
    console.log(chalk.green("===================\n"));

    successMessage('decrypt success');
    process.exit(1);
}

async function zip(paths, options) {
    processMessage(chalk.blueBright('zipping...'));

    if(options.type == 'folders') {
        paths.forEach(path => {
            if(!isDirectory(path)) {
                errorMessage(chalk.red(`path: ${path} is not a folder`));
                return;
            }
        });

        try {
            await zipFolders(paths, options.out);
        } catch (err) {
            errorMessage(err.message);
        }

        successMessage(`zip folders success`);
    }

    if(options.type == 'files') {
        paths.forEach(path => {
            if(!isFile(path)) {
                errorMessage(chalk.red(`path: ${path} is not a file`));
                process.exit(1);
            }
        });

        try {
            await zipFiles(paths, options.out);
        } catch (err) {
            errorMessage(err.message);
            process.exit(1);
        }

        successMessage(`zip files success`);
    }

    process.exit(0);
}

async function convert(file, options) {
    if(path.extname(file) == '.pdf') {
        errorMessage(`file already pdf type`);
        process.exit(1);
    }

    convertDocsToPDF(file, options.name);

    successMessage(`convert success`);

    process.exit(0);
}

async function main() {


    // info filemaster application
    AddProgram('info',
        'Filemaster features information',
        null, null, null,
        info
    );

    // download files
    const downloadOpt = [
        {
            flag: '--media <media>',
            description: 'media file you want to download (youtube, spotify, google drive, megafile, random image from internet'
        }
    ];

    AddProgram('download', 
        'download files from the internet',
        '<url>', 'download url',
        downloadOpt, download
    );

    // zip files or folder
    const zipOpt = [
        {
            flag: '--type <type>',
            description: 'zip files or folder you want. type files if you want to zip files. type folders if you want to zip folders',
        },
        {
            flag: '--out <out>',
            description: 'zip file name'
        }
    ];

    AddProgram('zip', 
        'zip files or folder you want',
        '<paths...>', 'path to folder or files (you can only contain one type)',
        zipOpt, zip
    );

    // encrypt file
    const encryptOpt = [
        {
            flag: '--algo <algorithm>',
            description: 'algorithm you choose (aes128, aes192, aes256)'
        },
        {
            flag: '--name <name>',
            description: 'file encrypted name'
        }
    ];

    AddProgram('encrypt',
        'encrypt your file', 
        '<filePath>', 'path to your file you want to encrypt',
        encryptOpt, encyrpt
    );

    // convert docs to pdf
    const convertOpt = [
        {
            flag: '--type <type>',
            description: 'type of file to convert (current only pdf)'
        },
        {
            flag: '--name <name>',
            description: 'pdf file name'
        }
    ];

    AddProgram('convert',
        'convert docs file into pdf',
        '<file>', 'file you want to convert',
        convertOpt, convert
    );
}

main();
FileMasterProgram.parse(process.argv);
