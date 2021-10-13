import chalk from 'chalk';

export const logWarning = (message: string): void => {
  console.warn(`${chalk.yellow('warning')} ${message}`);
};
