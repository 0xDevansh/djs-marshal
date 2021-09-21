import * as Discord from 'discord.js';
import { SlashCommand } from '../../structures/SlashCommand';

declare module 'discord.js' {
  export interface Client {
    commands: Discord.Collection<Discord.Snowflake | 'global', Array<SlashCommand>>;
  }
}
