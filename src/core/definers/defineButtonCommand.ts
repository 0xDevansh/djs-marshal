import {ButtonCommand} from "../../structures/ButtonCommand";
import chalk from "chalk";

const logSimpleWarning = (warning: string) => {
  console.log(chalk.yellow("warn ") + warning)
}

export const defineButtonCommand = (command: ButtonCommand): ButtonCommand => {
  if (!command.customId) {
    logSimpleWarning(`The required property customId is missing in this ButtonCommand, setting it to "unknown"...`)
    command.customId = 'unknown'
  }
  if (!command.execute) {
    logSimpleWarning(`The execute callback is missing in this ButtonCommand`)
    command.execute = () => console.error(`This button command has not been implemented yet`)
  }

  return command;
}