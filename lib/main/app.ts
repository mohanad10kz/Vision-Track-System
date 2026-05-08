import { app, BrowserWindow, shell } from 'electron';
import { join } from 'path';
import { registerAppHandlers } from '../conveyor/handlers/app-handler';
import { registerWindowHandlers } from '../conveyor/handlers/window-handler';
import { registerDbHandlers } from '../conveyor/handlers/db-handler';
import { getDb } from '../database/db';

export function createAppWindow(): void {
  // Initialize Database
  getDb();

  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 768,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: join(__dirname, '../preload/preload.js'),
      sandbox: false,
    },
  });

  // Register Conveyor IPC Handlers
  registerAppHandlers(app);
  registerWindowHandlers(mainWindow);
  registerDbHandlers();

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}
