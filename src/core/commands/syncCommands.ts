import { Client, ClientApplication, Guild } from 'discord.js';
import { SlashCommand } from '../../structures/SlashCommand';
import deepEqual from 'deep-equal';
import { toApplicationCommand } from '../../utils/toApplicationCommand';

/**
 * Compares and syncs global commands if needed
 *
 * @param application The client's application (client.application)
 * @param {SlashCommand[]} newCommands The commands to sync
 */
const syncGlobalCommands = async (application: ClientApplication, newCommands: SlashCommand[]): Promise<void> => {
  application.client.logMethod('Syncing global commands', 'verbose');
  const currentCommands = await application.commands.fetch();
  const cc = [...currentCommands.values()];

  for (const command of newCommands) {
    if (!command.options?.length) command.options = [];
    const matching = cc.find((c) => c.name === command.name);

    // command is new
    if (!matching) {
      application.client.logMethod(`Syncing new global command: ${command.name}`, 'verbose');
      await application.commands.create(command);
      continue;
    }

    // command has changed
    if (!deepEqual(matching, toApplicationCommand(command))) {
      application.client.logMethod(`Syncing changed global command: ${command.name}`, 'verbose');
      await application.commands.edit(matching.id, command);
    }

    // finally, remove from synced commands
    cc.splice(cc.indexOf(matching), 1);
    application.client.logMethod(`    ✅ ${command.name}`, 'verbose');
  }

  // delete left over commands
  if (cc.length) {
    await Promise.all(
      cc.map(async (c) => {
        await application.commands.cache.find((com) => com.name === c.name)?.delete();
      }),
    );
  }
};

/**
 * Sync commands of a guild
 *
 * @param {Guild} guild The guild to sync
 */
export const syncGuildCommands = async (guild: Guild): Promise<void> => {
  const commands = guild.client.commands;
  const guildCommands = (commands.get('allGuild') || [])?.concat(commands.get(guild.id) || []);

  await guild.commands.set(guildCommands);
};

/**
 * Syncs the slash commands with Discord
 *
 * @param {Client} client The bot's client
 */
export const syncCommands = async (client: Client): Promise<void> => {
  const commands = client.commands;

  const application = client.application?.partial ? await client.application?.fetch() : client.application;
  if (!application) throw new Error('Client application not found');

  // sync global commands
  const global = commands.get('global');

  if (global) await syncGlobalCommands(application, global);

  // sync guild commands
  application.client.logMethod(`Syncing guild commands`, 'verbose');
  const guilds = await client.guilds.fetch();
  for (const [, g] of guilds) {
    const guild = await g.fetch();
    await syncGuildCommands(guild);
  }

  application.client.logMethod('Successfully synced commands', 'verbose');
};

/**
 * Force-syncs all global slash commands
 *
 * @param {Client} client The bot's client
 */
export const syncAllGlobalCommands = async (client: Client): Promise<void> => {
  const application = client.application?.partial ? await client.application?.fetch() : client.application;
  if (!application) throw new Error('Client application not found');

  // sync global commands
  const global = client.commands.get('global');
  if (global) {
    await application.commands.set(global);
  }
};
