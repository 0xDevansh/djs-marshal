import { ButtonCommand } from '../../structures/ButtonCommand';
import { Client, Collection } from 'discord.js';

/**
 * Loads the buttons provided into client.buttons
 *
 * @param {Client} client The bot's Client
 * @param {ButtonCommand[]} buttons The buttons to load
 */
export const loadButtons = (client: Client, buttons: ButtonCommand[]): void => {
  client.logMethod('Loading buttons', 'verbose');
  const buttonCollection = new Collection<string | RegExp, ButtonCommand>();

  buttons.forEach((button) => {
    // checks
    if (button.beforeExecute?.deferReplyEphemeral && button.beforeExecute?.deferReply) {
      client.logMethod(
        `deferReply and deferReplyEphemeral are both set to true for button ${button.customId}`,
        'erroronly',
      );
    }
    const defer = button.beforeExecute?.deferReplyEphemeral || button.beforeExecute?.deferReply;
    if (defer && button.beforeExecute?.deferUpdate) {
      client.logMethod(`deferReply and deferUpdate are both set to true for button ${button.customId}`, 'erroronly');
    }

    buttonCollection.set(button.customId, button);
  });

  client.buttons = buttonCollection;
};
