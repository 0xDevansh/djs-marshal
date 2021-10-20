import { logLevel } from '../../structures/logging';

/**
 * Check logging and log verbose message
 * @param message The message to log
 * @param logLevel The client's logging
 */
export const logNormal = (message: string, logLevel: logLevel): void => {
  if (logLevel === 'verbose') console.log(message);
};
