import { SelectMenuInteraction } from 'discord.js';
import { logWarning } from '../../utils/logger';

/**
 * Intercepts a SelectMenuInteraction and executes matching menu
 *
 * @param {SelectMenuInteraction} int The incoming interaction
 */
export const handleSelectMenuInteraction = async (int: SelectMenuInteraction): Promise<void> => {
  const selectMenu = int.client.selectMenus.find((menu) => {
    return typeof menu.customId === 'string' ? menu.customId === int.customId : menu.customId.test(int.customId);
  });

  if (!selectMenu)
    return logWarning(
      `Received SelectMenu interaction with customId: ${int.customId}, but no such registered menu`,
      int.client,
    );

  await selectMenu.execute(int);
};
