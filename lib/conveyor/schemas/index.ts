import { z } from 'zod';
import { appIpcSchema } from './app-schema';
import { windowIpcSchema } from './window-schema';
import { dbIpcSchema } from './db-schema';

export const ipcSchemas = {
  ...appIpcSchema,
  ...windowIpcSchema,
  ...dbIpcSchema,
};

export type ChannelName = keyof typeof ipcSchemas;

export type ChannelArgs<T extends ChannelName> = z.infer<typeof ipcSchemas[T]['args']>;

export type ChannelReturn<T extends ChannelName> = z.infer<typeof ipcSchemas[T]['return']>;

export const validateArgs = <T extends ChannelName>(channel: T, args: unknown[]) => {
  return ipcSchemas[channel].args.parse(args) as ChannelArgs<T>;
};

export const validateReturn = <T extends ChannelName>(channel: T, data: unknown) => {
  return ipcSchemas[channel].return.parse(data) as ChannelReturn<T>;
};
