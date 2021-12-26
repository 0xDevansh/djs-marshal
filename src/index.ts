import { initializeBot } from './core/initializeBot';
export { initializeBot } from './core/initializeBot';

export * from './structures/SlashCommand';
export * from './structures/MarshalOptions';
export * from './structures/logging';
export * from './structures/CommandCollection';

export * from './core/commands/loadCommandsFromDir';
export * from './core/commands/loadCommands';
import { loadCommandsFromDir } from './core/commands/loadCommandsFromDir';
import { loadCommands } from './core/commands/loadCommands';

import { handleInteraction } from './core/handlers/handleInteraction';
import { handleGuildJoin } from './core/handlers/handleGuildJoin';
import { handleGuildMemberUpdate } from './core/handlers/handleGuildMemberUpdate';

export * from './core/handlers/handleInteraction';
export * from './core/handlers/handleGuildJoin';
export * from './core/handlers/handleGuildMemberUpdate';

const handlers = {
  handleInteraction,
  handleGuildJoin,
  handleGuildMemberUpdate,
};

export default {
  initializeBot,
  loadCommands,
  loadCommandsFromDir,
  handlers,
};
