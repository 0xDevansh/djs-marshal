import { Client, Collection, Snowflake } from 'discord.js';
import { logLevel, logStyle } from './logging';
import { MarshalOptions } from './MarshalOptions';
import { SlashCommand } from './SlashCommand';
import { ButtonCommand } from './ButtonCommand';
import { SelectMenuCommand } from './SelectMenuCommand';
import { handleInteraction } from '../core/handlers/handleInteraction';
import { handleGuildJoin } from '../core/handlers/handleGuildJoin';
import { handleGuildMemberUpdate } from '../core/handlers/handleGuildMemberUpdate';
import { loadCommandsFromDir } from '../core/commands/loadCommandsFromDir';
import { loadButtonsFromDir } from '../core/buttons/loadButtonsFromDir';
import { loadSelectMenusFromDir } from '../core/selectMenus/loadSelectMenusFromDir';
import { syncGuildCommands } from '../core/commands/syncCommands';
import { loadCommands as lCommands } from '../core/commands/loadCommands';
import { loadCommandsFromDir as lCommandsFromDir } from '../core/commands/loadCommandsFromDir';
import { loadButtons as lButtons } from '../core/buttons/loadButtons';
import { loadButtonsFromDir as lButtonsFromDir } from '../core/buttons/loadButtonsFromDir';
import { loadSelectMenus as lSelectMenus } from '../core/selectMenus/loadSelectMenus';
import { loadSelectMenusFromDir as lSelectMenusFromDir } from '../core/selectMenus/loadSelectMenusFromDir';
import * as Discord from 'discord.js';

export class MarshalClient extends Client {
  /** Specifies what information should be logged to the console */
  public readonly logLevel?: logLevel;
  /** How much information should be logged */
  public readonly logStyle?: logStyle;
  /** Custom function for logging, if required */
  public readonly logMethod?: (message: string, level: logLevel) => void;
  /** The loaded slash commands for this bot */
  public readonly commands: Discord.Collection<Discord.Snowflake | 'global' | 'allGuild', Array<SlashCommand>>;
  /** The loaded buttons for this bot */
  public readonly buttons: Discord.Collection<string | RegExp, ButtonCommand>;
  /** The loaded select menus for this bot */
  public readonly selectMenus: Discord.Collection<string | RegExp, SelectMenuCommand>;

  constructor(options: MarshalOptions) {
    super(options);

    // logging stuff
    this.logLevel = options.logLevel || 'warn';
    this.logStyle = options.logStyle || 'simple';
    this.logMethod = options.logMethod;

    this.commands = new Collection<Snowflake | 'global' | 'allGuild', Array<SlashCommand>>();
    this.buttons = new Collection<string | RegExp, ButtonCommand>();
    this.selectMenus = new Collection<string | RegExp, SelectMenuCommand>();

    // handle all sorts of interactions
    super.on('interactionCreate', handleInteraction);

    super.on('guildCreate', handleGuildJoin);
    super.on('guildMemberUpdate', handleGuildMemberUpdate);

    super.on('ready', () => {
      // load commands, buttons and select menus
      if (options.slashCommandsPath) void loadCommandsFromDir(this, options.slashCommandsPath);
      if (options.buttonsPath) void loadButtonsFromDir(this, options.buttonsPath);
      if (options.selectMenusPath) void loadSelectMenusFromDir(this, options.selectMenusPath);

      // log readyMessage
      if (options.readyMessage) {
        const message = options.readyMessage
          .replace('{username}', this.user?.username || 'Username not found')
          .replace('{tag}', this.user?.tag || 'User tag not found');
        console.log(message);
      }
    });

    super.on('guildUpdate', (newGuild) => syncGuildCommands(newGuild));

    if (options.token) void super.login(options.token);
  }

  async loadCommands(commands: SlashCommand[]): Promise<void> {
    await lCommands(this, commands);
  }

  async loadCommandsFromDir(dir: string): Promise<void> {
    await lCommandsFromDir(this, dir);
  }

  loadButtons(buttons: ButtonCommand[]): void {
    lButtons(this, buttons);
  }

  async loadButtonsFromDir(dir: string): Promise<void> {
    await lButtonsFromDir(this, dir);
  }

  loadSelectMenus(menus: SelectMenuCommand[]): void {
    lSelectMenus(this, menus);
  }

  async loadSelectMenusFromDir(dir: string): Promise<void> {
    await lSelectMenusFromDir(this, dir);
  }
}
