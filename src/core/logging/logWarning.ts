import chalk from 'chalk';
import { logLevel } from '../../structures/logLevel';

export const logWarning = (message: string, logLevel: logLevel): void => {
  if (logLevel === 'warn' || logLevel === 'verbose') console.warn(`${chalk.yellow('warning')} ${message}`);
};
