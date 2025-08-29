#!/usr/bin/env node

import chalk from "chalk";
import intro from "../intro.js";
import inquirer from "inquirer";
import inputData from "../file-data.js";
import ora from 'ora';
import makeFile from "../make-file.js";
import readFileData from "../read-file.js";
import getAllFiles from "../get-files.js";

const enumOp = {
    MAKE: 'make file',
    READ: 'read file',
    UPDATE: 'update file'
};

async function main() {
    await intro();

    while (true) {

        const chooseOp = await inquirer.prompt([
            {
                type: 'list',
                name: 'operation',
                message: 'Choose operation',
                choices: [enumOp.MAKE, enumOp.READ, enumOp.UPDATE]
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
            ]);

            const data = await inputData(chalk.blue("Input data for your file:\n"));

            const spinner = ora({ text: 'making file', color: 'cyan' }).start();
            
            const result = await makeFile(data, file.extension, file.fileName);

            if(!result) {
                spinner.fail("Fail to make file");
            }

            spinner.succeed("File succesfuly created");
        }else if (chooseOp.operation == enumOp.READ) {
            const allFiles = getAllFiles(".");

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
        }else {
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

         if (isContinue.answer === 'no') {
            process.emit('SIGINT'); 
        }
    }
}

process.on('SIGINT', () => {
    process.exit(0);
});

main();
