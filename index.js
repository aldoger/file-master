import intro from "./intro.js";
import inquirer from "inquirer";

async function main() {
    await intro();

    inquirer
        .prompt([
            {
                type: 'list',
                name: 'extension',
                message: 'Choose extension: ',
                choices: ['txt', 'msg', 'json']
            },
        ])
        .then((answer) => {
            console.info(`Your extension is ${answer.extension}`);
        })
        .catch((error) => {
            console.error("Something went wrong");
        });
}

main();
