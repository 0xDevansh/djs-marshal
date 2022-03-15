import { SelectMenuCommand } from '../../structures/SelectMenuCommand';
import { Client, Collection } from 'discord.js';
import { logVerbose, logWarning } from '../../utils/logger';

/**
 * Loads the select menus provided into client.selectMenus
 *
 * @param {Client} client The bot's Client
 * @param {SelectMenuCommand[]} selectMenus The SelectMenuCommands to load
 */
export const loadSelectMenus = (client: Client, selectMenus: SelectMenuCommand[]): void => {
  logVerbose('Loading select menus', client);
  const menuCollection = new Collection<string | RegExp, SelectMenuCommand>();

  selectMenus.forEach((menu) => {
    // checks
    if (menu.beforeExecute?.deferReplyEphemeral && menu.beforeExecute?.deferReply) {
      logWarning(`deferReply and deferReplyEphemeral are both set to true for select menu ${menu.customId}`, client);
    }

    menuCollection.set(menu.customId, menu);
    logVerbose(`    ✅ ${menu.customId}`, client);
  });

  client.selectMenus = menuCollection;
};
