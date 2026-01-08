import { Command } from "commander";

export const FileMasterProgram = new Command();
FileMasterProgram
    .name("filemaster")
    .usage("[command] [options] [arguments]");

export function AddProgram(
  command,
  description,
  argument,
  argDescription,
  options,
  action
) {
  const cmd = FileMasterProgram
    .command(command)
    .description(description ?? '');

  if (argument) {
    cmd.argument(argument, argDescription);
  }

  if (Array.isArray(options)) {
    for (const option of options) {
      cmd.option(option.flag, option.description);
    }
  }

  cmd.action(action);
}

