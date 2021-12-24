import { ChatInputApplicationCommandData, CommandInteraction, PermissionString, Snowflake } from 'discord.js';

export type BaseSlashCommand = ChatInputApplicationCommandData & {
  execute: (command: CommandInteraction) => void | Promise<void>;
  beforeExecute?: {
    defer?: boolean;
    deferEphemeral?: boolean;
  };
};

export type RegularSlashCommand = BaseSlashCommand & {
  commandType: 'global' | 'allGuild';
};

export type GuildSlashCommand = BaseSlashCommand & {
  commandType: 'guild';
  guildId: Snowflake;
  allowWithPermission?: PermissionString[];
};

export type SlashCommand = RegularSlashCommand | GuildSlashCommand;
