#!/usr/bin/env node
import chalk from "chalk";
import intro from "../src/utils/intro.js";
import inquirer from "inquirer";
import ora from 'ora';
import { readFileData, getAllFiles, getDirectory, moveFile, makeFile, copyFile, getEncFiles, getZipFiles  } from "../src/lib/file.js";
import { unZip, zipFiles } from '../src/lib/archive.js'
import path from 'path';
import {  Algo, decyrptFile, encyrptFile  } from "../src/lib/encrypt.js";
import {  compressFile, decompressFile } from "../src/lib/compress.js";
import { downloadImage, downloadMegaFile, downloadGDriveFile, downloadSpotifyMusic } from "../src/lib/download.js";
import process from 'process';

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', (key) => {
  if (key === '\u001b') { 
    console.clear();
    process.exit(0);
  }

  if (key === '\u0003') { 
    process.exit(0);
  }
});

const enumOp = {
    MAKE: 'make file',
    READ: 'read file',
    MOVE: 'move file',
    COPY: 'copy paste file',
    ENCYRPT: 'encyrpt file',
    DECYRPT: 'decyrpt file',
    COMPRESS: 'compress file',
    DECOMPRESS: 'decompress file',
    ZIP: 'zip files', 
    UNZIP: 'unzip',
    DOWNLOADIMG: 'download image, mediafire, gdrive, mega from web',
    CONVERT: 'convert file extension'
};


async function main() {
    await intro();

    while (true) {

        const chooseOp = await inquirer.prompt([
            {
                type: 'list',
                name: 'operation',
                message: 'Choose operation',
                choices: [enumOp.MAKE, enumOp.READ, enumOp.MOVE, enumOp.COPY, enumOp.ENCYRPT, enumOp.DECYRPT, enumOp.ZIP, enumOp.UNZIP, enumOp.COMPRESS, enumOp.DECOMPRESS, enumOp.DOWNLOADIMG, enumOp.CONVERT],
                loop: false
            }
        ]);

        // Create a file
        if(chooseOp.operation == enumOp.MAKE) {
            const file = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'extension',
                    message: 'Choose extension: ',
                    choices: ['txt', 'msg']
                },
                {
                    type: 'input',
                    name: 'fileName',
                    message: 'file name: ',
                },
                {
                    type: 'editor',
                    name: 'fileData',
                    message: 'input data: ',
                }
            ]);

            const spinner = ora({ text: 'making file', color: 'cyan' }).start();
            
            const result = await makeFile(file.fileData, file.extension, file.fileName);

            if(!result) {
                spinner.fail("Fail to make file");
            }

            spinner.succeed(chalk.green("File succesfuly created"));

        // Read data from a file
        }else if (chooseOp.operation == enumOp.READ) {
            const allFiles = getAllFiles("./");

            const chooseFile = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'file',
                    message: 'choose file:',
                    choices: allFiles,
                }
            ]);

            try {       
                const data = await readFileData(chooseFile.file);
                console.log("\n" + chalk.green("=== File Content ==="));
                console.log(data);
                console.log(chalk.green("===================\n"));
            } catch (err) {
                console.error(chalk.red("Error reading file:"), err);
            }
            
        // Move file to another existing folder
        }else if(chooseOp.operation == enumOp.MOVE){

            let files = getAllFiles('./');
            let chooseFile = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'file',
                    message: 'Choose file',
                    choices: files
                }
            ]);

            let oldPath = path.resolve(chooseFile.file);
            let currentPath = './';
            let chooseDir;

            do {
                const directories = await getDirectory(currentPath);

                chooseDir = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'directory',
                        message: `Choose directory: (${currentPath} to move)`,
                        choices: directories,
                        loop: false,
                    }
                ]);

                currentPath = path.resolve(currentPath, chooseDir.directory);
                console.log(`your in directory: ${currentPath}`);
            }while(chooseDir.directory !== './')
            
            console.info(chalk.blue(`File will be moved to: ${currentPath}`));

            const spinner = ora({ text: 'making file', color: 'cyan' }).start();

            const newPath = path.join(currentPath, chooseFile.file);
            await moveFile(oldPath, newPath);
            spinner.succeed(chalk.green(`File moved to ${newPath}`));
    
        // Copy paste file to another existing folder    
        }else if(chooseOp.operation == enumOp.COPY){
            const files = getAllFiles('./');

            const chooseFile = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'file',
                    message: 'Choose file',
                    choices: files
                }
            ]);

            const sourcePath = path.resolve(chooseFile.file);

            let currentPath = './';
            let chooseDir;

            do {
                const directories = await getDirectory(currentPath);

                chooseDir = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'directory',
                        message: `Choose directory: (${currentPath} to move)`,
                        choices: directories,
                        loop: false,
                    }
                ]);

                currentPath = path.resolve(currentPath, chooseDir.directory);
                console.log(`your in directory: ${currentPath}`);
            }while(chooseDir.directory !== './')

                
            console.info(chalk.blue(`File will be copied to: ${currentPath}`));

            const spinner = ora({ text: 'making file', color: 'cyan' }).start();
            
            const destinationPath = path.resolve(currentPath, chooseFile.file);

            await copyFile(sourcePath, destinationPath)

            spinner.succeed(chalk.green(`File copied to ${destinationPath}`));

        // Encyrpt file
        }else if(chooseOp.operation == enumOp.ENCYRPT){
            const files =  getAllFiles('./');

            const chooseFile = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'file',
                    message: 'choose file to encyrpt',
                    choices: files
                }
            ]);

            const fileMessage = await readFileData(chooseFile.file);

            const encyrptOp = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'algo',
                    message: 'choose algorithm',
                    choices: Algo,
                }
            ]);

            const spinner = ora({ text: 'making file', color: 'cyan' }).start();

            await encyrptFile(encyrptOp.algo, fileMessage, chooseFile.file);

            spinner.succeed(chalk.green("Encyrption done"));
        
        // Decyrpt file
        }else if(chooseOp.operation == enumOp.DECYRPT) {
            const fileEnc = await getEncFiles();

            const chooseFileEnc = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'fileEnc',
                    message: 'Choose encyrpted file',
                    choices: fileEnc.arrayFilesEnc
                },
                {
                    type: 'list',
                    name: 'fileSecret',
                    message: 'file secret',
                    choices: fileEnc.arrayFileSecret
                }
            ]);

            const message = await readFileData(chooseFileEnc.fileEnc);
            
            const secrets = await readFileData(chooseFileEnc.fileSecret);

            const jsonSecrets = JSON.parse(secrets);

            decyrptFile(jsonSecrets.algo, jsonSecrets.key, jsonSecrets.iv, message);
        
        // Zip files
        } else if(chooseOp.operation == enumOp.ZIP){

            let arrayFiles = []

            const files = getAllFiles('./');

            do {
                const chooseFile = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'file',
                        message: 'Choose file',
                        choices: files,
                    },
                    {
                        type: 'confirm',
                        name: 'add',
                        message: 'do you want to add another file? (y/N)',
                        default: true
                    },
                ]);

                arrayFiles.push(chooseFile.file);

                if (!chooseFile.add) break
            } while (1);

            const outputFile = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'zip file name?'
                }
            ]);

            const spinner = ora({ text: 'making file', color: 'cyan' }).start();

            await zipFiles(arrayFiles, outputFile.name);

            spinner.succeed(chalk.green("zip success"));
        
            // Unzip
        } else if(chooseOp.operation == enumOp.UNZIP){

            const zipFiles = await getZipFiles();

            const chooseZipFile = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'zipFile',
                    message: 'choose zip file',
                    choices: zipFiles
                }
            ]);



            let currentPath = './';
            let chooseDir;

            do {
                const directories = await getDirectory(currentPath);

                chooseDir = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'directory',
                        message: `Choose directory: (${currentPath} to move)`,
                        choices: directories,
                        loop: false,
                    }
                ]);

                currentPath = path.resolve(currentPath, chooseDir.directory);
                console.log(`your in directory: ${currentPath}`);
            }while(chooseDir.directory !== './')

            const spinner = ora({ text: 'making file', color: 'cyan' }).start();

            await unZip(chooseZipFile.zipFile, chooseDir.directory);

            spinner.succeed(chalk.green("unzip success"));

        // Compress file
        } else if(chooseOp.operation == enumOp.COMPRESS) {
            const files = getAllFiles('./');

            const chooseFile = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'file',
                    message: 'Choose file',
                    choices: files
                },
                {
                    type: 'input',
                    name: 'output_file',
                    message: 'file output name',
                }
            ]);

            const sourcePath = path.resolve(chooseFile.file);
            const output = chooseFile.output_file + ".gz";

            try {
                await compressFile(sourcePath, output)
            } catch (err) {
                console.error(err);
            }

            console.info(chalk.green("File successfully compressed"));
        
        // Decompress file
        }else if(chooseOp.operation == enumOp.UNZIP) {
            const files = getAllFiles('./');

            const chooseFile = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'file',
                    message: 'Choose file',
                    choices: files
                },
                {
                    type: 'input',
                    name: 'output_file',
                    message: 'file output name',
                }
            ]);

            const sourcePath = path.resolve(chooseFile.file);
            const output = chooseFile.output_file;

            try {
                await decompressFile(sourcePath, output);   
            } catch (err) {
                console.error(err);
            }

            console.info(chalk.green("File successfully decompress"));
        
        // Download file
        }else if(chooseOp.operation == enumOp.DOWNLOADIMG) {

            let currentPath = './';
            let chooseDir;

            do {
                const directories = await getDirectory(currentPath);

                chooseDir = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'directory',
                        message: `Choose directory: (${currentPath} to move)`,
                        choices: directories,
                        loop: false,
                    }
                ]);

                currentPath = path.resolve(currentPath, chooseDir.directory);
                console.log(`Download path: ${currentPath}`);
            }while(chooseDir.directory !== './')

            const downloadFile = await inquirer.prompt([
                {
                    type: 'select',
                    name: 'download_platform',
                    message: 'what platform',
                    choices: ['mega', 'web image', 'mediafire', 'gdrive', 'spotify']
                },
                {
                    type: 'input',
                    name: 'link',
                    message: 'file url',
                }
            ]);

            const spinner = ora({ text: 'downloading ', color: 'blue' }).start();
            try {
                switch(downloadFile.download_platform) {
                    case 'web image':
                        const imgResult = await downloadImage(downloadFile.link, chooseDir.directory);
                        spinner.succeed(chalk.green("File successfully downloaded: " + imgResult));
                        break;
                    case 'mediafire':
                        spinner.fail(chalk.red("Still on development"))
                        break;
                    case 'mega':
                        const megaFile = await downloadMegaFile(downloadFile.link, chooseDir.directory);
                        spinner.succeed(chalk.green("Download complete: " + megaFile ));
                        break;
                    case 'gdrive':
                        const driveFile = await downloadGDriveFile(downloadFile.link, chooseDir.directory);
                        spinner.succeed(chalk.green("File successfully downloaded: " + driveFile));
                        break;
                    case 'spotify':
                        const spotifyMus = await downloadSpotifyMusic(downloadFile.link, chooseDir.directory);
                        spinner.succeed(chalk.green("File successfully downloaded: " + spotifyMus));
                        break;
                }   
            } catch (err) {
                spinner.fail("Error downloading file");
                console.error(chalk.red("Error downloading file: " + err.message));
            }

        }else if(chooseOp.operation == enumOp.CONVERT) {
            console.info(chalk.red("operation still on development"));
        }
        
    }
}

main();
