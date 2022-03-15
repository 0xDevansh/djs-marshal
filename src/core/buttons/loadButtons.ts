import { ButtonCommand } from '../../structures/ButtonCommand';
import { Client, Collection } from 'discord.js';
import { logVerbose, logWarning } from '../../utils/logger';

/**
 * Loads the buttons provided into client.buttons
 *
 * @param {Client} client The bot's Client
 * @param {ButtonCommand[]} buttons The buttons to load
 */
export const loadButtons = (client: Client, buttons: ButtonCommand[]): void => {
  logVerbose('Loading buttons', client);
  const buttonCollection = new Collection<string | RegExp, ButtonCommand>();

  buttons.forEach((button) => {
    // checks
    if (button.beforeExecute?.deferReplyEphemeral && button.beforeExecute?.deferReply) {
      logWarning(`deferReply and deferReplyEphemeral are both set to true for button ${button.customId}`, client);
    }
    const defer = button.beforeExecute?.deferReplyEphemeral || button.beforeExecute?.deferReply;
    if (defer && button.beforeExecute?.deferUpdate) {
      logWarning(`deferReply and deferUpdate are both set to true for button ${button.customId}`, client);
    }

    buttonCollection.set(button.customId, button);
    logVerbose(`    ✅ ${button.customId}`, client);
  });

  client.buttons = buttonCollection;
};
