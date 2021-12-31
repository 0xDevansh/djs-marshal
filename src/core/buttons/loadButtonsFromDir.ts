import { Client } from 'discord.js';
import fs from 'fs';
import { ButtonCommand } from '../../structures/ButtonCommand';
import { loadButtons } from './loadButtons';

export const loadButtonsFromDir = async (client: Client, path: string): Promise<void> => {
  const files = fs.readdirSync(path).filter((file) => file.endsWith('.js'));
  const buttons: ButtonCommand[] = [];

  await Promise.all(
    files.map(async (file) => {
      const button = await import(`${path}/${file}`);
      if (button.default) buttons.push(button.default);
    }),
  );

  loadButtons(client, buttons);
};
