import * as Discord from 'discord.js';
import { SlashCommand } from '../../structures/SlashCommand';
import { logLevel } from '../../structures/logLevel';

declare module 'discord.js' {
  export interface Client {
    commands: Discord.Collection<Discord.Snowflake | 'global', Array<SlashCommand>>;
    logLevel: logLevel;
  }
}
