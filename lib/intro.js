import chalk from "chalk";

async function intro() {
  const figlet = await import("figlet");
  const gradient = (await import("gradient-string")).default;

  return new Promise((resolve, reject) => {
    figlet.default.text(
      "FILE MASTER",
      {
        font: "ANSI Shadow",
        horizontalLayout: "default",
        verticalLayout: "default",
      },
      (err, data) => {
        if (err) return reject(err);

        console.clear();
        console.log(gradient.passion.multiline(data)); 
        console.log(chalk.gray("──────────────────────────────────────────────"));
        console.log(
          chalk.cyanBright("📁 FileMaster") +
            chalk.white(" — Your Ultimate File Operation CLI Tool ⚡\n")
        );

        console.log(chalk.yellowBright("✨ Features:"));
        console.log(
          chalk.greenBright(`
  ▸ ${chalk.white("Create/Make")} new files and directories effortlessly.
  ▸ ${chalk.white("Read")} and preview file contents right from the terminal.
  ▸ ${chalk.white("Copy Paste")} items safely with confirmation prompts.
  ▸ ${chalk.white("Move")} files between directories instantly.
  ▸ ${chalk.white("encyrpt")} files by name, type, or pattern.
  ▸ ${chalk.white("decyrpt")} like file size, creation date, and permissions.
  ▸ ${chalk.white("zip")} for power users 🚀
        `)
        );

        console.log(chalk.gray("──────────────────────────────────────────────"));
        resolve();
      }
    );
  });
}

export default intro;
