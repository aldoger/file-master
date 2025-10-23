import chalk from "chalk";

async function intro() {
  const figlet = await import("figlet"); 
  return new Promise((resolve, reject) => {
    figlet.default.text("FILE MASTER", { font: "DOS Rebel", horizontalLayout: 'full' }, (err, data) => {
      if (err) return reject(err);
      console.log(chalk.green(data));
      resolve();
    });
  });
}

export default intro;
