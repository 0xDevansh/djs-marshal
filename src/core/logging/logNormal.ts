import { logLevel } from '../../structures/logLevel';

export const logNormal = (message: string, logLevel: logLevel): void => {
  if (logLevel === 'verbose') console.log(message);
};
