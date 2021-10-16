import { ChatInputApplicationCommandData, CommandInteraction, Snowflake } from 'discord.js';

export interface GlobalSlashCommand extends ChatInputApplicationCommandData {
  execute: (command: CommandInteraction) => void | Promise<void>;
  defer?: boolean;
  deferEphemeral?: boolean;
}

export interface GuildSlashCommand extends GlobalSlashCommand {
  guildId: Snowflake;
}

export type SlashCommand = GlobalSlashCommand | GuildSlashCommand;
