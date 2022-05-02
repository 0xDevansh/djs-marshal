import { ChatInputApplicationCommandData, CommandInteraction, PermissionString, Snowflake } from 'discord.js';

/**
 * The base options present in all types of SlashCommand
 */
export type BaseSlashCommand = ChatInputApplicationCommandData & {
  /**
   * The function to be run when the CommandInteraction is received
   * @param {CommandInteraction} int The interaction received
   */
  execute: (command: CommandInteraction) => void | Promise<void>;
  /**
   * Options to do stuff before button is executed
   */
  beforeExecute?: {
    /** defer the reply before executing */
    defer?: boolean;
    /** defer the reply as ephemeral before executing */
    deferEphemeral?: boolean;
  };
  /**
   * @deprecated Buggy and resource heavy, use allowRoles, denyRoles, allowUsers and denyUsers
   */
  allowWithPermission?: PermissionString[];

  /**
   * Send an error embed if there is an unhandled exception (default: true)
   */
  handleError?: boolean;

  /**
   * Allow access to these roles
   */
  allowRoles?: Snowflake[];
  /**
   * Do not allow access to these roles
   */
  denyRoles?: Snowflake[];

  /**
   * Allow access to these users
   */
  allowUsers?: Snowflake[];
  /**
   * Do not allow access to these users
   */
  denyUsers?: Snowflake[];

  commandType: string;
};

/**
 * A slash command registered either globally or in all guilds
 */
export type RegularSlashCommand = BaseSlashCommand & {
  commandType: 'global' | 'allGuild';
};

/**
 * A slash command registered in a specific guild
 */
export type GuildSlashCommand = BaseSlashCommand & {
  commandType: 'guild';
  guildId: Snowflake;
};

/**
 * A slash command which will be executed when a CommandInteraction is received
 */
export type SlashCommand = RegularSlashCommand | GuildSlashCommand;
