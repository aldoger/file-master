import { Command } from "commander";

export const FileMasterProgram = new Command();
FileMasterProgram
    .name("filemaster")
    .usage("[command] [options] [arguments]");

export function AddProgram(command, description, argument, options, action) {
    FileMasterProgram.command(command)
        .description(description);

    FileMasterProgram
        .argument(argument);

    for(const option of options) {
        FileMasterProgram
            .option(option.flag, option.description);
    }

    FileMasterProgram
        .action(action);
}