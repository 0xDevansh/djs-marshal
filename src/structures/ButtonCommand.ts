import { ButtonInteraction } from 'discord.js';

/**
 * Data for a ButtonInteraction to be executed
 */
export type ButtonCommand = {
  /**
   * The customId to be executed
   * @remark Ensure that there aren't multiple executors for the same customId
   */
  customId: string | RegExp;
  /**
   * The function to be run when the ButtonInteraction is received
   * @param {ButtonInteraction} int The interaction received
   */
  execute: (int: ButtonInteraction) => void | Promise<void>;
  /**
   * Options to do stuff before button is executed
   */
  beforeExecute?: {
    /** defer the reply before executing */
    deferReply?: boolean;
    /** defer the reply as ephemeral before executing */
    deferReplyEphemeral?: boolean;
    /** deferUpdate() before executing */
    deferUpdate?: boolean;
  };
};
