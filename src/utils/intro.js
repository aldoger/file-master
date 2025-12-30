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
  ▸ ${chalk.white("create/Make")} new files and directories effortlessly.
  ▸ ${chalk.white("read")} read file content right from the terminal.
  ▸ ${chalk.white("copy paste")} copy files safely.
  ▸ ${chalk.white("move")} Move files between directories instantly.
  ▸ ${chalk.white("encyrpt")} Encyrpt your file.
  ▸ ${chalk.white("decyrpt")} Decyrpt your file.
  ▸ ${chalk.white("compress")} Compress file
  ▸ ${chalk.white("zip")} Zip files
  ▸ ${chalk.white("download file")} Download files/videos from internet
        `)
        );

        console.log(chalk.redBright("Press (Esc, CTRL + C, CTRL + D) to stop"));
        console.log(chalk.gray("──────────────────────────────────────────────"));
        resolve();
      }
    );
  });
}

export default intro;
