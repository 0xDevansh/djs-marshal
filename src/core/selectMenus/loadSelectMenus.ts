import { SelectMenuCommand } from '../../structures/SelectMenuCommand';
import { Client, Collection } from 'discord.js';

/**
 * Loads the select menus provided into client.selectMenus
 *
 * @param {Client} client The bot's Client
 * @param {SelectMenuCommand[]} selectMenus The SelectMenuCommands to load
 */
export const loadSelectMenus = (client: Client, selectMenus: SelectMenuCommand[]): void => {
  client.logMethod('Loading select menus', 'verbose');
  const menuCollection = new Collection<string | RegExp, SelectMenuCommand>();

  selectMenus.forEach((menu) => {
    // checks
    if (menu.beforeExecute?.deferReplyEphemeral && menu.beforeExecute?.deferReply) {
      client.logMethod(
        `deferReply and deferReplyEphemeral are both set to true for select menu ${menu.customId}`,
        'warn',
      );
    }

    menuCollection.set(menu.customId, menu);
    client.logMethod(`    ✅ ${menu.customId}`, 'verbose');
  });

  client.selectMenus = menuCollection;
};
