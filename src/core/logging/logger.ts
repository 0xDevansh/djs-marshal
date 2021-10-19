import chalk from 'chalk';
import { logLevel } from '../../structures/logLevel';

/**
 * Check logLevel and log verbose message
 * @param message The message to log
 * @param logLevel The client's logLevel
 */
export const logVerbose = (message: string, logLevel: logLevel): void => {
  if (logLevel === 'verbose') console.log(message);
};

/**
 * Check logLevel and log warning
 * @param warning The warning to log
 * @param logLevel The client's logLevel
 */
export const logWarning = (warning: string, logLevel: logLevel): void => {
  if (logLevel === 'warn' || logLevel === 'verbose') console.warn(`${chalk.yellow('warning')} ${warning}`);
};

/**
 * Check logLevel and log warning
 * @param error The error to log
 */
export const logError = (error: string): void => {
  console.error(`${chalk.red('error')} ${error}`);
};
