import { ButtonInteraction } from 'discord.js';
import { logWarning } from '../../utils/logger';

/**
 * Intercepts a ButtonInteraction and executes the matching button
 *
 * @param {ButtonInteraction} int The incoming interaction
 */
export const handleButtonInteraction = async (int: ButtonInteraction): Promise<void> => {
  const button = int.client.buttons.find((button) => {
    return typeof button.customId === 'string' ? button.customId === int.customId : button.customId.test(int.customId);
  });

  if (!button)
    return logWarning(
      `Received Button interaction with customId: ${int.customId}, but no such registered button`,
      int.client,
    );

  // beforeExecute stuff
  if (button.beforeExecute?.deferUpdate) {
    await int.deferUpdate();
  } else if (button.beforeExecute?.deferReplyEphemeral) {
    await int.deferReply({ ephemeral: true });
  } else if (button.beforeExecute?.deferReply) {
    await int.deferReply();
  }

  await button.execute(int);
};
