import { ButtonInteraction } from 'discord.js';

export type ButtonCommand = {
  customId: string | RegExp;
  execute: (int: ButtonInteraction) => void | Promise<void>;
  beforeExecute?: {
    deferReply?: boolean;
    deferReplyEphemeral?: boolean;
    deferUpdate?: boolean;
  };
};
