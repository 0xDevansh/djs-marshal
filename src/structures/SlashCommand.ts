import { ChatInputApplicationCommandData, CommandInteraction, PermissionString, Snowflake } from 'discord.js';

type BaseSlashCommand = ChatInputApplicationCommandData & {
  execute: (command: CommandInteraction) => void | Promise<void>;
  beforeExecute?: {
    defer?: boolean;
    deferEphemeral?: boolean;
  };
  allowWithPermission?: PermissionString[];
};

export type RegularSlashCommand = BaseSlashCommand & {
  commandType: 'global' | 'allGuild';
};

type GuildSlashCommand = BaseSlashCommand & {
  commandType: 'guild';
  guildId: Snowflake;
};

export type SlashCommand = RegularSlashCommand | GuildSlashCommand;
