import { SelectMenuInteraction } from 'discord.js';

export type SelectMenuCommand = {
  customId: string | RegExp;
  execute: (int: SelectMenuInteraction) => void | Promise<void>;
  beforeExecute?: {
    deferReply?: boolean;
    deferReplyEphemeral?: boolean;
  };
};
