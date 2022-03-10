import {
  ApplicationCommand,
  ApplicationCommandPermissionData,
  Client,
  ClientApplication,
  Guild,
  Intents,
  Role,
  Snowflake,
} from 'discord.js';
import { SlashCommand } from '../../structures/SlashCommand';
import deepEqual from 'deep-equal';
import { logVerbose } from '../../utils/logger';
import { toApplicationCommand } from '../../utils/toApplicationCommand';

/**
 * Sets the permissions of a registered ApplicationCommand according to SlashCommand properties
 *
 * @param {ApplicationCommand} registered The registered application command
 * @param {SlashCommand} command The registered slash command
 */
const setPermissions = async (registered: ApplicationCommand, command: SlashCommand): Promise<void> => {
  const permissions: ApplicationCommandPermissionData[] = (command.allowRoles || []).map((id) => {
    return { id, type: 'ROLE', permission: true };
  });
  permissions.push(
    ...(command.denyRoles || []).map((id) => {
      return <ApplicationCommandPermissionData>{ id, type: 'ROLE', permission: false };
    }),
  );
  permissions.push(
    ...(command.allowUsers || []).map((id) => {
      return <ApplicationCommandPermissionData>{ id, type: 'USER', permission: true };
    }),
  );
  permissions.push(
    ...(command.denyUsers || []).map((id) => {
      return <ApplicationCommandPermissionData>{ id, type: 'USER', permission: false };
    }),
  );
  console.log(`Syncing perms for ${command.name}`);

  await registered.permissions.set({ permissions });
};

/**
 * Compares and syncs global commands if needed
 *
 * @param application The client's application (client.application)
 * @param {SlashCommand[]} newCommands The commands to sync
 */
const syncGlobalCommands = async (application: ClientApplication, newCommands: SlashCommand[]): Promise<void> => {
  const currentCommands = await application.commands.fetch();
  const cc = currentCommands.map((c) => toApplicationCommand(c));

  for (const command of newCommands) {
    if (!command.options?.length) command.options = [];
    const matching = cc.find((c) => c.name === command.name);

    // command is new
    if (!matching) {
      logVerbose(`Syncing new global command: ${command.name}`, application.client);
      const registered = await application.commands.create(command);
      await setPermissions(registered, command);
      continue;
    }

    // command has changed
    if (!deepEqual(matching, toApplicationCommand(command))) {
      logVerbose(`Syncing changed global command: ${command.name}`, application.client);
      const registered = await application.commands.create(command);
      await setPermissions(registered, command);
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

const syncPermissionForRole = async (
  command: SlashCommand,
  role: Role,
): Promise<{
  allowedRoles: Snowflake[];
  allowedMembers: Snowflake[];
}> => {
  const allowedRoles: Snowflake[] = [];
  const allowedMembers: Snowflake[] = [];
  const seenMembers: Snowflake[] = [];

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

  return { allowedRoles, allowedMembers };
};

/**
 * Makes sure users with only selected permissions can use the command
 *
 * @param guild The guild in which command should be checked
 * @param command The SlashCommand to be checked
 * @param existing The existing ApplicationCommand in guild
 *
 * @deprecated buggy and not recommended
 */
export const syncPermissions = async (
  guild: Guild,
  command: SlashCommand,
  existing: ApplicationCommand,
): Promise<void> => {
  if ('allowWithPermission' in command && command.allowWithPermission?.length) {
    // this won't work without GUILDS and GUILD_MEMBERS intents
    if (!new Intents(guild.client.options.intents).has('GUILD_MEMBERS'))
      throw new Error('allowWithPermission requires the GUILD_MEMBERS intent');

    // fetch members for cache
    await guild.members.fetch();

    const roles = await guild.roles.fetch();
    let everyoneRole: Role | undefined = undefined;

    const aRoles: Snowflake[] = [];
    const aMembers: Snowflake[] = [];

    for (const [, role] of roles) {
      // ensure that @everyone is checked last
      if (role.name === '@everyone') {
        everyoneRole = role;
        continue;
      }

      const { allowedMembers, allowedRoles } = await syncPermissionForRole(command, role);
      aMembers.push(...allowedMembers);
      aRoles.push(...allowedRoles);
    }
    if (everyoneRole) await syncPermissionForRole(command, everyoneRole);

    // add permissions
    if (aMembers.length || aRoles.length) {
      const commandPerms = aMembers
        .map((id) => {
          return { type: 'USER', id, permission: true };
        })
        .concat(
          aRoles.map((id) => {
            return { type: 'ROLE', id, permission: true };
          }),
        ) as ApplicationCommandPermissionData[];

      await existing.permissions.set({ permissions: commandPerms });
    }
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

  await guild.commands.set([]);
  for (const command of guildCommands) {
    const registered = await guild.commands.create(command);
    await setPermissions(registered, command);
  }

  // sync permission
  await Promise.all(
    guildCommands.map(async (com) => {
      if ('allowWithPermission' in com && com.allowWithPermission?.length) {
        const registered = guild.commands.cache.find((c) => c.name === com.name);

        if (!registered) return;
        await syncPermissions(guild, com, registered);
      }
    }),
  );
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
  const guilds = await client.guilds.fetch();
  for (const [, g] of guilds) {
    const guild = await g.fetch();
    await syncGuildCommands(guild);
  }

  logVerbose('Successfully synced commands', client);
};
