import {SlashCommand} from "../../structures/SlashCommand";
import chalk from "chalk";

const logSimpleWarning = (warning: string) => {
  console.log(chalk.yellow("warn ") + warning)
}

export const defineSlashCommand = (command: SlashCommand): SlashCommand => {
  if (!command.name) {
    logSimpleWarning(`The required property name is missing in this SlashCommand, setting it to "unknown"`)
    command.name = 'unknown'
  }
  if (!command.description) {
    logSimpleWarning(`The required property description is missing in SlashCommand ${command.name}, setting it to "No description"...`)
    command.description = 'No description'
  }
  if (!command.execute) {
    logSimpleWarning(`The execute callback is missing in SlashCommand ${command.name}`)
    command.execute = (c) => console.error(`The slash command '${c.commandName}' has not been implemented yet`)
  }

  return command;
}