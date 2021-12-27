import { ButtonInteraction } from 'discord.js';
import { logWarning } from '../../utils/logger';

/**
 * Intercepts a ButtonInteraction and executes the matching button
 *
 * @param {ButtonInteraction} int The incoming interaction
 */
export const handleButtonInteraction = async (int: ButtonInteraction): Promise<void> => {
  // find and execute matching command
  const button = int.client.buttons.get(int.customId);
  if (!button)
    return logWarning(
      `Received Button interaction with customId: ${int.customId}, but no such registered button`,
      int.client,
    );

  await button.execute(int);
};
