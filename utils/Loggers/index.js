import chalk from "chalk";

export const logFail = (msg) => console.log(chalk.bgRed(msg));
export const logProgress = (msg) => console.log(chalk.bgGreenBright(msg));
