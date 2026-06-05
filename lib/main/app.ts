import { app, BrowserWindow, shell } from 'electron';
import { join } from 'path';
import { registerAppHandlers } from '../conveyor/handlers/app-handler';
import { registerWindowHandlers } from '../conveyor/handlers/window-handler';
import { registerDbHandlers } from '../conveyor/handlers/db-handler';
import { getDb } from '../database/db';
import { tasksRepo } from '../database/repositories/tasks.repo';
import { notesRepo } from '../database/repositories/notes.repo';
import { visitsRepo } from '../database/repositories/visits.repo';

export function createAppWindow(): void {
  // Initialize Database
  getDb();

  // تشغيل الأرشفة التلقائية عند بدء التطبيق
  try {
    const archivedTasks = tasksRepo.archiveOldDone();
    const archivedNotes = notesRepo.archiveOldDone();
    const archivedVisits = visitsRepo.archiveOldDone();
    if (archivedTasks > 0 || archivedNotes > 0 || archivedVisits > 0) {
      console.log(`[Startup] Archived ${archivedTasks} tasks, ${archivedNotes} notes, ${archivedVisits} visits`);
    }
  } catch (err) {
    console.error('[Startup] Auto-archive failed:', err);
  }

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
