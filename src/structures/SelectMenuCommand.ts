import { SelectMenuInteraction } from 'discord.js';

export type SelectMenuCommand = {
  /**
   * The customId to be executed
   * @remark Ensure that there aren't multiple executors for the same customId
   */
  customId: string | RegExp;
  /**
   * The function to be run when the SelectMenuInteraction is received
   * @param {SelectMenuInteraction} int The interaction received
   */
  execute: (int: SelectMenuInteraction) => void | Promise<void>;
  /**
   * Options to do stuff before button is executed
   */
  beforeExecute?: {
    /** defer the reply before executing */
    deferReply?: boolean;
    /** defer the reply as ephemeral before executing */
    deferReplyEphemeral?: boolean;
  };
};
