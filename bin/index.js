#!/usr/bin/env node

import chalk from "chalk";
import intro from "../intro.js";
import inquirer from "inquirer";
import ora from 'ora';
import { readFileData, getAllFiles, getDirectory, moveFile, makeFile, copyFile, getEncFiles  } from "../lib/file-operation.js";
import path from 'path';
import {  Algo, encyrptFile  } from "../lib/encrypt.js";

const enumOp = {
    MAKE: 'make file',
    READ: 'read file',
    MOVE: 'move file',
    EDIT: 'edit file',
    COPY: 'copy paste file',
    ENCYRPT: 'encyrpt file',
    DECYRPT: 'decyrpt file'
};


async function main() {
    await intro();

    while (true) {

        const chooseOp = await inquirer.prompt([
            {
                type: 'list',
                name: 'operation',
                message: 'Choose operation',
                choices: [enumOp.MAKE, enumOp.READ, enumOp.MOVE, enumOp.EDIT, enumOp.COPY, enumOp.ENCYRPT, enumOp.DECYRPT]
            }
        ]);


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
            
            console.info(chalk.blue(`File akan dipindahkan ke direktori: ${currentPath}`));

            const spinner = ora({ text: 'making file', color: 'cyan' }).start();

            const newPath = path.join(currentPath, chooseFile.file);
            await moveFile(oldPath, newPath);
            spinner.succeed(chalk.green(`File moved to ${newPath}`));

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

                
            console.info(chalk.blue(`File akan dicopy ke direktori: ${currentPath}`));

            const spinner = ora({ text: 'making file', color: 'cyan' }).start();
            
            const destinationPath = path.resolve(currentPath, chooseFile.file);

            await copyFile(sourcePath, destinationPath)

            spinner.succeed(chalk.green(`File dicopy di ${destinationPath}`));

             
        }else if(chooseOp.operation == enumOp.EDIT){ //TODO hapus operator  
            console.info(chalk.red("Operation is in development"));
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
        }

        const isContinue = await inquirer.prompt([
            {
                type: 'select',
                name: 'answer',
                message: 'Do you want to continue?',
                choices: ['yes', 'no']
            }
        ]);

         if(isContinue.answer === 'no') {
            process.exit(0); 
        }
    }
}

main();
