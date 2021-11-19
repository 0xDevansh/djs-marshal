import chalk from 'chalk';
import { logLevel } from '../../structures/logLevel';

/**
 * Checks logLevel and logs a verbose message
 *
 * @param {string} message The message to log
 * @param {logLevel} logLevel The client's logLevel
 */
export const logVerbose = (message: string, logLevel: logLevel): void => {
  if (logLevel === 'verbose') console.log(message);
};

/**
 * Checks logLevel and logs a warning
 *
 * @param {string} warning The warning to log
 * @param {logLevel} logLevel The client's logLevel
 */
export const logWarning = (warning: string, logLevel: logLevel): void => {
  if (logLevel === 'warn' || logLevel === 'verbose') console.warn(`${chalk.yellow('warning')} ${warning}`);
};

/**
 * Checks logLevel and logs an error
 *
 * @param {string} error The error to log
 */
export const logError = (error: string): void => {
  console.error(`${chalk.red('error')} ${error}`);
};
