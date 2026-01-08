#!/usr/bin/env node
import { AddProgram, FileMasterProgram } from '../src/config/program.js';
import { Media } from '../src/lib/download.js';
import info from '../src/utils/info.js';
import { errorMessage, processMessage, successMessage } from '../src/utils/message.js';
import process from 'process';

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
}

main();
FileMasterProgram.parse(process.argv);