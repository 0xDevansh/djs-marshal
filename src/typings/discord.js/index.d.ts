import * as Discord from 'discord.js';

declare module 'discord.js' {
  export interface Client {
    commands: Discord.Collection<string>;
  }
}
