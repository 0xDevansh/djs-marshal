import { ClientOptions } from 'discord.js';
import { logLevel } from './logging';

/**
 * Options for initializing bot. Intents are required
 */
export interface MarshalOptions extends ClientOptions {
  /** The bot token. Logs in the bot if provided */
  token?: string;
  /** Path to the slash commands directory */
  slashCommandsPath?: string;
  /** Path to the buttons directory */
  buttonsPath?: string;
  /** Path to the select menus directory */
  selectMenusPath?: string;
  /** Message to be logged when bot is ready */
  readyMessage?: string;
  /** Custom function for logging, if required */
  logMethod?: (message: string, level: logLevel) => void;
}
