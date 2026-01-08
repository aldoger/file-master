import chalk from "chalk";

export default async function info() {
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
  ▸ ${chalk.white("encyrpt")} Encyrpt a file.
  ▸ ${chalk.white("decyrpt")} Decyrpt a file.
  ▸ ${chalk.white("compress")} Compress a file
  ▸ ${chalk.white("zip")} Zip files or folder
  ▸ ${chalk.white("download file")} Download files/videos from internet (youtube, google drive, spotify, random image/videos, mega)
        `)
        );

        console.log(chalk.gray("──────────────────────────────────────────────"));
        resolve();
      }
    );
  });
}
