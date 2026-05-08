import { electronAPI } from '@electron-toolkit/preload';
import { AppApi } from './app-api';
import { WindowApi } from './window-api';
import { DbApi } from './db-api';

export const conveyor = {
  app: new AppApi(electronAPI),
  window: new WindowApi(electronAPI),
  db: new DbApi(electronAPI),
};

export type Conveyor = typeof conveyor;
