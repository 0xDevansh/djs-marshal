import { SelectMenuInteraction } from 'discord.js';

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
    return int.client.logMethod(
      `Received SelectMenu interaction with customId: ${int.customId}, but no such registered menu`,
      'warn',
    );

  // beforeExecute stuff
  if (selectMenu.beforeExecute?.deferReplyEphemeral) {
    await int.deferReply({ ephemeral: true });
  } else if (selectMenu.beforeExecute?.deferReply) {
    await int.deferReply();
  }

  await selectMenu.execute(int);
};
