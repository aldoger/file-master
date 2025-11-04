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
  ▸ ${chalk.white("Read")} read file content right from the terminal.
  ▸ ${chalk.white("Copy Paste")} copy files safely.
  ▸ ${chalk.white("Move")} move files between directories instantly.
  ▸ ${chalk.white("encyrpt")} encyrpt your file.
  ▸ ${chalk.white("decyrpt")} decyrpt your file.
  ▸ ${chalk.white("zip")} zip files
        `)
        );

        console.log(chalk.gray("──────────────────────────────────────────────"));
        resolve();
      }
    );
  });
}

export default intro;
