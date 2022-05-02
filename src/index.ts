import {initializeBot} from './core/initializeBot';

export {initializeBot} from './core/initializeBot';

export * from './structures/SlashCommand';
export * from './structures/ButtonCommand';
export * from './structures/SelectMenuCommand';
export * from './structures/MarshalOptions';
export * from './structures/logging';

export * from './core/commands/loadCommandsFromDir';
export * from './core/commands/loadCommands';
import {loadCommandsFromDir} from './core/commands/loadCommandsFromDir';
import {loadCommands} from './core/commands/loadCommands';

export * from './core/buttons/loadButtonsFromDir';
export * from './core/buttons/loadButtons';
import {loadButtonsFromDir} from './core/buttons/loadButtonsFromDir';
import {loadButtons} from './core/buttons/loadButtons';

export * from './core/selectMenus/loadSelectMenusFromDir';
export * from './core/selectMenus/loadSelectMenus';

import {loadSelectMenusFromDir} from './core/selectMenus/loadSelectMenusFromDir';
import {loadSelectMenus} from './core/selectMenus/loadSelectMenus';

import {handleInteraction} from './core/handlers/handleInteraction';
import {handleGuildJoin} from './core/handlers/handleGuildJoin';
import {handleGuildMemberUpdate} from './core/handlers/handleGuildMemberUpdate';

export * from './core/handlers/handleInteraction';
export * from './core/handlers/handleGuildJoin';
export * from './core/handlers/handleGuildMemberUpdate';

export * from './core/commands/syncCommands';

export * from './core/definers/defineSlashCommand'
export * from './core/definers/defineButtonCommand'
export * from './core/definers/defineSelectMenuCommand'
import {defineSlashCommand} from "./core/definers/defineSlashCommand";
import {defineButtonCommand} from "./core/definers/defineButtonCommand";
import {defineSelectMenuCommand} from "./core/definers/defineSelectMenuCommand";

const handlers = {
  handleInteraction,
  handleGuildJoin,
  handleGuildMemberUpdate,
};

export default {
  initializeBot,

  loadCommands,
  loadCommandsFromDir,
  loadButtons,
  loadButtonsFromDir,
  loadSelectMenus,
  loadSelectMenusFromDir,

  handlers,

  defineSlashCommand,
  defineButtonCommand,
  defineSelectMenuCommand
};
