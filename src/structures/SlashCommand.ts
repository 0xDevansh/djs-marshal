import { ChatInputApplicationCommandData, CommandInteraction, Snowflake } from 'discord.js';

export interface GlobalSlashCommand extends ChatInputApplicationCommandData {
  execute: (command: CommandInteraction) => void | Promise<void>;
}

export interface GuildSlashCommand extends GlobalSlashCommand {
  guildId: Snowflake;
}

export type SlashCommand = GlobalSlashCommand | GuildSlashCommand;
