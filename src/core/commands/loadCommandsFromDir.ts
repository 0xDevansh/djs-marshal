import * as fs from 'fs';
import { Client } from 'discord.js';
import * as path from 'path';
import { SlashCommand } from '../../structures/SlashCommand';
import { loadCommands } from './loadCommands';

/**
 * Load slash commands from a specified directory (does not check sub-folders)
 * @param client The bot's Client
 * @param dir The *full* path of the directory
 */
export const loadCommandsFromDir = async (client: Client, dir: string): Promise<void> => {
  const files: string[] = fs.readdirSync(dir).filter((file) => file.endsWith('.js'));
  const commands: Array<SlashCommand> = [];

  for (const file of files) {
    const exported = await import(path.join(dir, file));
    commands.push(exported.default as SlashCommand);
  }

  loadCommands(client, commands);
};
