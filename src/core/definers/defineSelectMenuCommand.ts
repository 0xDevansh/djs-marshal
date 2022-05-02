import chalk from "chalk";
import {SelectMenuCommand} from "../../structures/SelectMenuCommand";

const logSimpleWarning = (warning: string) => {
  console.log(chalk.yellow("warn ") + warning)
}

export const defineSelectMenuCommand = (command: SelectMenuCommand): SelectMenuCommand => {
  if (!command.customId) {
    logSimpleWarning(`The required property customId is missing in this SelectMenuCommand, setting it to "unknown"...`)
    command.customId = 'unknown'
  }
  if (!command.execute) {
    logSimpleWarning(`The execute callback is missing in this SelectMenuCommand`)
    command.execute = () => console.error(`This select menu command has not been implemented yet`)
  }

  return command;
}