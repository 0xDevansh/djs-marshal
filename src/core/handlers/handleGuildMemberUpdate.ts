import { GuildMember, PartialGuildMember } from 'discord.js';
import deepEqual from 'deep-equal';

/**
 * Refresh command permissions when a member is updated
 *
 * @param {GuildMember} oldM The old member
 * @param {GuildMember} newM The updated member
 */
export const handleGuildMemberUpdate = async (
  oldM: GuildMember | PartialGuildMember,
  newM: GuildMember,
): Promise<void> => {
  const rolesChanged = deepEqual(oldM.roles.cache.keys(), newM.roles.cache.keys());
  const permissionsChanged = oldM.permissions.bitfield === newM.permissions.bitfield;

  if (!rolesChanged && permissionsChanged) {
    const commands = (newM.client.commands.get(newM.guild.id) || []).concat(newM.client.commands.get('allGuild') || []);
    for (const command of commands) {
      if (!('allowWithPermission' in command && command.allowWithPermission?.length)) continue;
      // check if member has perms
      const allowed = command.allowWithPermission.some((perm) => newM.permissions.has(perm));
      if (allowed) {
        // find application command
        const actualCommands = await newM.guild.commands.fetch();
        const actualCommand = actualCommands.find((c) => c.name === command.name);
        if (!actualCommand) continue;

        // add permission
        await actualCommand.permissions.add({
          permissions: [{ type: 'USER', id: newM.id, permission: true }],
        });
      }
    }
  }
};
