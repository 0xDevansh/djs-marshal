import { Collection, Snowflake } from 'discord.js';
import { SlashCommand } from './SlashCommand';

export type CommandCollection = Collection<Snowflake | 'global', Array<SlashCommand>>;
