#!/usr/bin/env node

import chalk from "chalk";
import intro from "../intro.js";
import inquirer from "inquirer";
import ora from 'ora';
import makeFile from "../make-file.js";
let status = true

async function main() {
    await intro();

    while (status) {
        const file = await inquirer.prompt([
            {
                type: 'list',
                name: 'extension',
                message: 'Choose extension: ',
                choices: ['txt', 'msg', 'json']
            },
            {
                type: 'input',
                name: 'fileName',
                message: 'file name: ',
            },
        ]);

        const spinner = ora({ text: 'making file', color: 'cyan' }).start();
        
        //TODO make input text for user data
        const result = await makeFile('Hello World', file.extension, file.fileName);

        if(!result) {
            spinner.fail("Fail to make file");
        }

        spinner.succeed("File succesfuly created");

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
    console.log(chalk.green("Thank you for using us"));
    process.exit(0);
});

main();
