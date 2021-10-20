import chalk from 'chalk';
import { logLevel } from '../../structures/logging';

/**
 * Check logging and log warning
 * @param warning The warning to log
 * @param logLevel The client's logging
 */
export const logWarning = (warning: string, logLevel: logLevel): void => {
  if (logLevel === 'warn' || logLevel === 'verbose') console.warn(`${chalk.yellow('warning')} ${warning}`);
};
