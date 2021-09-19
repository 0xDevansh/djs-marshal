import { ClientOptions } from 'discord.js';

/**
 * Options for initializing bot. Intents are required
 */
export interface MarshalOptions extends ClientOptions {
  /**The bot token. Logs in the bot if provided*/
  token?: string;
  /**Path to the slash commands directory*/
  slashCommandsPath?: string;
  /**Message to be logged when bot is ready*/
  readyMessage?: string;
}
