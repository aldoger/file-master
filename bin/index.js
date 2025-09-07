#!/usr/bin/env node

import chalk from "chalk";
import intro from "../intro.js";
import inquirer from "inquirer";
import ora from 'ora';
import { readFileData, getAllFiles, getDirectory, moveFile, makeFile  } from "../lib/file-operation.js";

const enumOp = {
    MAKE: 'make file',
    READ: 'read file',
    MOVE: 'move file',
    EDIT: 'edit file',
    COPY: 'copy paste file'
};


async function main() {
    await intro();

    while (true) {

        const chooseOp = await inquirer.prompt([
            {
                type: 'list',
                name: 'operation',
                message: 'Choose operation',
                choices: [enumOp.MAKE, enumOp.READ, enumOp.MOVE, enumOp.EDIT, enumOp.COPY]
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

            spinner.succeed("File succesfuly created");
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
            let directories = await getDirectory('./');
            const chooseDir = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'directory',
                    message: 'choose a directory',
                    choices: directories
                }
            ]);
            console.info(chalk.green(`you choose ${chooseDir.directory}`));
        }else if(chooseOp.operation == enumOp.COPY){
            console.info(chalk.red('Operation is still on development'));
        }else{
            console.info(chalk.red('Operation is still on development'));
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
