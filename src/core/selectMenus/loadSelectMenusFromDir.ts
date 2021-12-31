import { Client } from 'discord.js';
import fs from 'fs';
import { SelectMenuCommand } from '../../structures/SelectMenuCommand';
import { loadSelectMenus } from './loadSelectMenus';

export const loadSelectMenusFromDir = async (client: Client, path: string): Promise<void> => {
  const files = fs.readdirSync(path).filter((file) => file.endsWith('.js'));
  const selectMenus: SelectMenuCommand[] = [];

  await Promise.all(
    files.map(async (file) => {
      const menu = await import(`${path}/${file}`);
      if (menu.default) selectMenus.push(menu.default);
    }),
  );

  loadSelectMenus(client, selectMenus);
};
