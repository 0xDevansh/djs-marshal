import {
  ApplicationCommand,
  ApplicationCommandPermissionData,
  Client,
  ClientApplication,
  Guild,
  Intents,
  Snowflake,
} from 'discord.js';
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

const syncPermissions = async (guild: Guild, command: SlashCommand, existing: ApplicationCommand) => {
  if ('allowWithPermission' in command && command.allowWithPermission?.length) {
    // this won't work without GUILDS and GUILD_MEMBERS intents
    if (!new Intents(guild.client.options.intents).has('GUILD_MEMBERS'))
      throw new Error('allowWithPermission requires the GUILD_MEMBERS intent');

    // get allowed roles
    const allowedRoles: Snowflake[] = [];
    const allowedMembers: Snowflake[] = [];
    const seenMembers: Snowflake[] = [];

    // fetch members for cache
    await guild.members.fetch();

    const roles = await guild.roles.fetch();
    roles.forEach((role) => {
      const isAllowed = command.allowWithPermission?.some((perm) => role.permissions.has(perm));
      if (isAllowed) allowedRoles.push(role.id);
      // doesn't have permission, check members individually
      else {
        role.members.forEach((member) => {
          // make sure member is not repeated
          if (seenMembers.includes(member.id)) return;

          const memberAllowed = command.allowWithPermission?.some((perm) => member.permissions.has(perm));
          if (memberAllowed) allowedMembers.push(member.id);

          seenMembers.push(member.id);
        });
      }
    });

    // add permissions
    if (allowedMembers.length || allowedRoles.length) {
      const commandPerms = allowedMembers
        .map((id) => {
          return { type: 'USER', id, permission: true };
        })
        .concat(
          allowedRoles.map((id) => {
            return { type: 'ROLE', id, permission: true };
          }),
        ) as ApplicationCommandPermissionData[];

      await existing.permissions.set({ permissions: commandPerms });
    }
  }
};

/**
 * Compares and syncs commands for a guild
 *
 * @param guild
 * @param {SlashCommand[]} newCommands The current commands to sync
 */
const syncGuildCommands = async (guild: Guild, newCommands: SlashCommand[]) => {
  const guildCommands = await guild.commands.fetch();
  const gc = Array.from(guildCommands.values());

  for (const command of newCommands) {
    const existing = gc.find((c) => c.name === command.name);

    // no existing command
    if (!existing) {
      const created = await guild.commands.create(command);
      await syncPermissions(guild, command, created);
    } else {
      // existing command
      const commandsAreEqual = deepEqual(toApplicationCommand(existing), toApplicationCommand(command));
      if (!commandsAreEqual) {
        const created = await guild.commands.create(command);
        await syncPermissions(guild, command, created);
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
    await syncGuildCommands(guild, guildCommands);
  }
  logVerbose('Successfully synced commands', client);
};
