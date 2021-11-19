import * as fs from 'fs';
import { Client } from 'discord.js';
import * as path from 'path';
import { SlashCommand } from '../../structures/SlashCommand';
import { loadCommands } from './loadCommands';

/**
 * Loads slash commands from a specified directory (does not check sub-folders)
 *
 * @param {Client} client The bot's Client
 * @param {string} dir The full path of the directory containing the command files
 *
 * @remark All commands that need to be loaded should be in the root level
 * @remark All command files should export by default a SlashCommand structure
 */
export const loadCommandsFromDir = async (client: Client, dir: string): Promise<void> => {
  const files: string[] = fs.readdirSync(dir).filter((file) => file.endsWith('.js'));
  const commands: Array<SlashCommand> = [];

  for (const file of files) {
    const exported = await import(path.join(dir, file));
    commands.push(exported.default as SlashCommand);
  }

  await loadCommands(client, commands);
};
