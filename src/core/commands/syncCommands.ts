import { ApplicationCommandData, Client, ClientApplication, GuildApplicationCommandManager } from 'discord.js';
import { SlashCommand } from '../../structures/SlashCommand';
import deepEqual from 'deep-equal';
import { logVerbose } from '../../utils/logger';
import { toApplicationCommand } from '../../utils/toApplicationCommand';

/**
 * Compares and syncs global commands if needed
 *
 * @param application
 * @param {SlashCommand[]} newCommands The commands to sync
 */
const syncGlobalCommands = async (application: ClientApplication, newCommands: SlashCommand[]) => {
  const currentCommands = await application.commands.fetch();
  const cc = currentCommands.map((c) => toApplicationCommand(c));

  for (const command of newCommands) {
    if (!command.options?.length) command.options = [];
    const matching = cc.find((c) => c.name === command.name);

    // command is new
    if (!matching) {
      logVerbose(`Syncing new global command: ${command.name}`, application.client);
      await application.commands.create(command);
      console.log('created');
      continue;
    }

    // command has changed
    if (!deepEqual(matching, toApplicationCommand(command))) {
      logVerbose(`Syncing changed global command: ${command.name}`, application.client);
      await application.commands.create(command);
    }

    // finally, remove from synced commands
    cc.splice(cc.indexOf(matching), 1);
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
 * Compares and syncs commands for a guild
 *
 * @param {GuildApplicationCommandManager} guildCommandManager The CommandManager for the guild
 * @param {ApplicationCommandData[]} newCommands The current commands to sync
 */
const syncGuildCommands = async (
  guildCommandManager: GuildApplicationCommandManager,
  newCommands: ApplicationCommandData[],
) => {
  const guildCommands = await guildCommandManager.fetch();
  const gc = Array.from(guildCommands.values());

  for (const command of newCommands) {
    const existing = gc.find((c) => c.name === command.name);
    // no existing command
    if (!existing) {
      await guildCommandManager.create(command);
    } else {
      // existing command
      const commandsAreEqual = deepEqual(toApplicationCommand(existing), command);
      if (!commandsAreEqual) {
        await guildCommandManager.create(command);
      }
      gc.splice(gc.indexOf(existing), 1);
    }
  }

  // delete leftover commands
  if (gc.length) {
    await Promise.all(gc.map(async (c) => await c.delete()));
  }
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
  for (const [guildId, guild] of client.guilds.cache) {
    const guildCommands = (commands.get('allGuild') || [])?.concat(commands.get(guildId) || []);
    await syncGuildCommands(
      guild.commands,
      guildCommands.map((c) => toApplicationCommand(c)),
    );
  }
  logVerbose('Successfully synced commands', client);
};
