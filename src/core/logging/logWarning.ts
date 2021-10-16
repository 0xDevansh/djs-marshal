import chalk from 'chalk';
import { logLevel } from '../../structures/logLevel';

/**
 * Check logLevel and log warning
 * @param warning The warning to log
 * @param logLevel The client's logLevel
 */
export const logWarning = (warning: string, logLevel: logLevel): void => {
  if (logLevel === 'warn' || logLevel === 'verbose') console.warn(`${chalk.yellow('warning')} ${warning}`);
};
