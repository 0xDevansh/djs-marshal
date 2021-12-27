import { ButtonCommand } from '../../structures/ButtonCommand';
import { Client, Collection } from 'discord.js';

/**
 * Loads the buttons provided into client.buttons
 *
 * @param {Client} client The bot's Client
 * @param {ButtonCommand[]} buttons The buttons to load
 */
export const loadButtons = (client: Client, buttons: ButtonCommand[]): void => {
  const buttonCollection = new Collection<string | RegExp, ButtonCommand>();

  buttons.forEach((button) => {
    buttonCollection.set(button.customId, button);
  });

  client.buttons = buttonCollection;
};
