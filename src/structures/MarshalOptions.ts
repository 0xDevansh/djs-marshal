import { ClientOptions } from 'discord.js';
import { logLevel, logStyle } from './logging';

/**
 * Options for initializing bot. Intents are required
 */
export interface MarshalOptions extends ClientOptions {
  /** The bot token. Logs in the bot if provided */
  token?: string;
  /** Path to the slash commands directory */
  slashCommandsPath?: string;
  /** Message to be logged when bot is ready */
  readyMessage?: string;
  /** Specifies what information should be logged to the console */
  logLevel?: logLevel;
  /** How much information should be logged */
  logStyle?: logStyle;
  /** Custom function for logging, if required */
  logMethod?: (message: string, level: logLevel) => void;
}
