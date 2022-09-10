import * as Discord from 'discord.js';
import { SlashCommand } from '../../structures/SlashCommand';
import { logLevel } from '../../structures/logging';
import { ButtonCommand } from '../../structures/ButtonCommand';
import { SelectMenuCommand } from '../../structures/SelectMenuCommand';

// modifying the discord.js client to store additional data

declare module 'discord.js' {
  export interface Client {
    commands: Discord.Collection<Discord.Snowflake | 'global' | 'allGuild', Array<SlashCommand>>;
    buttons: Discord.Collection<string | RegExp, ButtonCommand>;
    selectMenus: Discord.Collection<string | RegExp, SelectMenuCommand>;
    logMethod: (message: string, level: logLevel) => void;
  }
}
