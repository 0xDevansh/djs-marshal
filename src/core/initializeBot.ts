import { Client } from 'discord.js';
import { MarshalOptions } from '../structures/MarshalOptions';

export const initializeBot = (options: MarshalOptions): Client => {
  const client = new Client(options);

  // TODO register interaction event here

  client.on('ready', () => {
    if (options.readyMessage) {
      const logMessage = options.readyMessage
        .replace('{username}', client.user?.username || 'Username not found')
        .replace('{tag}', client.user?.tag || 'User tag not found');
      console.log(logMessage);
    }
  });

  if (options.token) client.login(options.token);
  return client;
};
