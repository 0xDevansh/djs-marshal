import { SelectMenuCommand } from '../../structures/SelectMenuCommand';
import { Client, Collection } from 'discord.js';

/**
 * Loads the select menus provided into client.selectMenus
 *
 * @param {Client} client The bot's Client
 * @param {SelectMenuCommand[]} selectMenus The SelectMenuCommands to load
 */
export const loadSelectMenus = (client: Client, selectMenus: SelectMenuCommand[]): void => {
  const menuCollection = new Collection<string | RegExp, SelectMenuCommand>();

  selectMenus.forEach((menu) => menuCollection.set(menu.customId, menu));

  client.selectMenus = menuCollection;
};
