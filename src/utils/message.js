import chalk from "chalk";


export function errorMessage(msg) {
    console.info(chalk.red(msg));
    return
}

export function successMessage(msg) {
    console.info(chalk.green(msg));
    return;
}

export function processMessage(msg) {
    console.info(chalk.blueBright(msg));
    return;
}