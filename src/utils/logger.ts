import chalk from 'chalk';
import { Client } from 'discord.js';

/**
 * Log a verbose (information) message in the console
 * @param message The message to log
 * @param client The client (for logLevel and logStyle)
 */
export const logVerbose = (message: string, client: Client): void => {
  if (client.logMethod) {
    return client.logMethod(message, client.logLevel);
  }

  if (client.logLevel !== 'verbose') return;
  switch (client.logStyle) {
    case 'none':
      return console.log(message);
    case 'simple':
      return console.log(message);
    case 'expanded':
      const now = new Date();
      const time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
      return console.log(`${chalk.bgGrey('VERB')}  ${chalk.grey(time)}\n${message}`);
  }
};

/**
 * Log a warning to the console
 * @param warning The warning to log
 * @param client The The client (for logLevel and logStyle)
 */
export const logWarning = (warning: string, client: Client): void => {
  if (client.logMethod) {
    return client.logMethod(warning, client.logLevel);
  }

  if (client.logLevel !== 'warn' && client.logLevel !== 'verbose') return;
  switch (client.logStyle) {
    case 'none':
      return console.log(warning);
    case 'simple':
      return console.log(`${chalk.yellow('warning')} ${warning}`);
    case 'expanded':
      const now = new Date();
      const time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
      return console.log(`${chalk.bgGrey('WARN')}  ${chalk.grey(time)}\n${warning}`);
  }
};

/**
 * Log an error to the console
 * @param error The error to log
 * @param client The The client (for logLevel and logStyle)
 */
export const logError = (error: string, client: Client): void => {
  if (client.logMethod) {
    return client.logMethod(error, client.logLevel);
  }

  switch (client.logStyle) {
    case 'none':
      return console.log(error);
    case 'simple':
      return console.log(`${chalk.red('error')} ${error}`);
    case 'expanded':
      const now = new Date();
      const time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
      return console.log(`${chalk.bgGrey('ERROR')} ${chalk.grey(time)}\n${error}`);
  }
};
