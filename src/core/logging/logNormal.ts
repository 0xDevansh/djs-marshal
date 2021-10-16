import { logLevel } from '../../structures/logLevel';

/**
 * Check logLevel and log verbose message
 * @param message The message to log
 * @param logLevel The client's logLevel
 */
export const logNormal = (message: string, logLevel: logLevel): void => {
  if (logLevel === 'verbose') console.log(message);
};
