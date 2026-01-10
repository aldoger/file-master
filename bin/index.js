#!/usr/bin/env node
import chalk from 'chalk';
import { AddProgram, FileMasterProgram } from '../src/config/program.js';
import { Media } from '../src/lib/download.js';
import { isDirectory, isFile } from '../src/lib/file.js';
import info from '../src/utils/info.js';
import { errorMessage, processMessage, successMessage } from '../src/utils/message.js';
import process from 'process';
import { zipFiles, zipFolders } from '../src/lib/archive.js';

async function download(url, options) {
    switch (options.media) {
        case Media.YOUTUBE:
            successMessage("download youtube success\n");
            break;
        case Media.IMAGE:
            successMessage("download image success\n");
            break;
        case Media.GDRIVE:
            successMessage("download google drive file success\n");
            break;
        case Media.MEGA:
            successMessage("download mega file success\n");
            break;
        case Media.SPOTIFY:
            successMessage("download spotify music success\n");
            break;
        default:
            errorMessage(`invalid media: ${options.media}`);
            process.exit(1);
    }
    process.exit(0);
}

async function encyrpt() {
    
}

async function zip(paths, options) {
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

async function main() {


    // info filemaster application
    AddProgram('info',
        'Filemaster features information',
        null, null, null,
        info
    )

    // download files
    const downloadOpt = [
        {
            flag: '--media <media>',
            description: 'media file you want to download (youtube, spotify, google drive, megafile, random image from internet'
        }
    ]

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
    ]

    AddProgram('zip', 
        'zip files or folder you want',
        '<paths...>', 'path to folder or files (you can only contain one type)',
        zipOpt, zip
    );

    // encrypt file
    
}

main();
FileMasterProgram.parse(process.argv);