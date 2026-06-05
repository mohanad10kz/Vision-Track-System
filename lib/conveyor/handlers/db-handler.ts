import { handle } from '@/lib/main/shared';
import { dialog } from 'electron';
import { promises as fs } from 'fs';
import { getDbPath, getDb, closeDb, initDb } from '../../database/db';
import { tasksRepo } from '../../database/repositories/tasks.repo';
import { notesRepo } from '../../database/repositories/notes.repo';
import { visitsRepo } from '../../database/repositories/visits.repo';
import { clientsRepo } from '../../database/repositories/clients.repo';
import { techniciansRepo } from '../../database/repositories/technicians.repo';
import { techGroupsRepo } from '../../database/repositories/tech-groups.repo';
import { callsRepo } from '../../database/repositories/calls.repo';
import { dashboardRepo } from '../../database/repositories/dashboard.repo';

export const registerDbHandlers = () => {
  // ==================== TASKS ====================
  handle('getTasks', () => tasksRepo.findAll());
  handle('getTaskById', ({ id }: { id: number }) => tasksRepo.findById(id));
  handle('createTask', (input: Parameters<typeof tasksRepo.create>[0]) => tasksRepo.create(input));
  handle('updateTask', ({ id, input }: { id: number; input: Parameters<typeof tasksRepo.update>[1] }) => tasksRepo.update(id, input));
  handle('updateTaskStatus', ({ id, status, position }: { id: number; status: string; position: number }) => tasksRepo.updateStatus(id, status, position));
  handle('deleteTask', ({ id }: { id: number }) => tasksRepo.delete(id));
  handle('getArchivedTasks', (filter: { from?: string; to?: string; search?: string, page?: number, limit?: number }) => tasksRepo.findArchived(filter));

  // ==================== NOTES ====================
  handle('getNotes', () => notesRepo.findAll());
  handle('getNoteById', ({ id }: { id: number }) => notesRepo.findById(id));
  handle('createNote', (input: Parameters<typeof notesRepo.create>[0]) => notesRepo.create(input));
  handle('updateNote', ({ id, input }: { id: number; input: Parameters<typeof notesRepo.update>[1] }) => notesRepo.update(id, input));
  handle('updateNoteStatus', ({ id, status, position }: { id: number; status: string; position: number }) => notesRepo.updateStatus(id, status, position));
  handle('deleteNote', ({ id }: { id: number }) => notesRepo.delete(id));
  handle('getArchivedNotes', (filter: { from?: string; to?: string; search?: string, page?: number, limit?: number }) => notesRepo.findArchived(filter));

  // ==================== VISITS ====================
  handle('getVisits', (filter?: { type?: string; status?: string; technicianId?: number; from?: string; to?: string; search?: string }) => visitsRepo.findAll(filter ?? undefined));
  handle('getVisitById', ({ id }: { id: number }) => visitsRepo.findById(id));
  handle('createVisit', (input: Parameters<typeof visitsRepo.create>[0]) => visitsRepo.create(input));
  handle('updateVisit', ({ id, input }: { id: number; input: Parameters<typeof visitsRepo.update>[1] }) => visitsRepo.update(id, input));
  handle('updateVisitStatus', ({ id, status, resolutionNotes }: { id: number; status: string; resolutionNotes?: string }) => visitsRepo.updateStatus(id, status, resolutionNotes));
  handle('deleteVisit', ({ id }: { id: number }) => visitsRepo.delete(id));
  handle('getArchivedVisits', (filter: { from?: string; to?: string; search?: string, page?: number, limit?: number }) => visitsRepo.findArchived(filter));
  handle('getSurveysByClientPhone', ({ phone }: { phone: string }) => visitsRepo.findSurveysByClientPhone(phone));

  // ==================== CLIENTS ====================
  handle('getClients', (filter?: { search?: string }) => clientsRepo.findAll(filter?.search));
  handle('getClientById', ({ id }: { id: number }) => clientsRepo.findById(id));
  handle('createClient', (input: Parameters<typeof clientsRepo.create>[0]) => clientsRepo.create(input));
  handle('updateClient', ({ id, input }: { id: number; input: Parameters<typeof clientsRepo.update>[1] }) => clientsRepo.update(id, input));
  handle('deleteClient', ({ id }: { id: number }) => clientsRepo.delete(id));

  // ==================== TECHNICIANS ====================
  handle('getTechnicians', () => techniciansRepo.findAll());
  handle('getTechnicianById', ({ id }: { id: number }) => techniciansRepo.findById(id));
  handle('createTechnician', (input: Parameters<typeof techniciansRepo.create>[0]) => techniciansRepo.create(input));
  handle('updateTechnician', ({ id, input }: { id: number; input: Parameters<typeof techniciansRepo.update>[1] }) => techniciansRepo.update(id, input));
  handle('updateTechnicianStatus', ({ id, status }: { id: number; status: string }) => techniciansRepo.updateStatus(id, status));
  handle('deleteTechnician', ({ id }: { id: number }) => techniciansRepo.delete(id));
  handle('getTechnicianTodayVisits', ({ id, today }: { id: number; today: string }) => techniciansRepo.countTodayVisits(id, today));
  handle('getTechQueueByGroup', ({ groupId, queueType }: { groupId: number; queueType: 'installation' | 'maintenance' | 'followup' }) => techniciansRepo.findQueueByGroup(groupId, queueType));
  handle('skipTechnician', ({ id, queueType }: { id: number; queueType: 'installation' | 'maintenance' | 'followup' }) => techniciansRepo.updateQueueDate(id, queueType));

  // ==================== TECH GROUPS ====================
  handle('getTechGroups', () => techGroupsRepo.findAll());
  handle('createTechGroup', (input: Parameters<typeof techGroupsRepo.create>[0]) => techGroupsRepo.create(input));
  handle('updateTechGroup', ({ id, input }: { id: number; input: Parameters<typeof techGroupsRepo.update>[1] }) => techGroupsRepo.update(id, input));
  handle('deleteTechGroup', ({ id }: { id: number }) => techGroupsRepo.delete(id));

  // ==================== CALLS ====================
  handle('getCalls', (filter?: { search?: string; contactType?: string; direction?: string; requiresFollowup?: boolean, page?: number, limit?: number }) => callsRepo.findAll(filter ?? undefined));
  handle('getCallById', ({ id }: { id: number }) => callsRepo.findById(id));
  handle('createCall', (input: Parameters<typeof callsRepo.create>[0]) => callsRepo.create(input));
  handle('updateCall', ({ id, input }: { id: number; input: Parameters<typeof callsRepo.update>[1] }) => callsRepo.update(id, input));
  handle('markCallFollowupDone', ({ id }: { id: number }) => callsRepo.markFollowupDone(id));
  handle('deleteCall', ({ id }: { id: number }) => callsRepo.delete(id));

  // ==================== DASHBOARD ====================
  handle('getDashboardData', () => dashboardRepo.getDashboardData());

  // ==================== BACKUP & RESTORE ====================
  handle('getDbPath', () => getDbPath());

  handle('backupDatabase', async () => {
    try {
      const db = getDb();

      const { filePath, canceled } = await dialog.showSaveDialog({
        title: 'حفظ النسخة الاحتياطية',
        defaultPath: `visiontrack_backup_${new Date().toISOString().split('T')[0]}.db`,
        filters: [
          { name: 'SQLite Database', extensions: ['db', 'sqlite'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      });

      if (canceled || !filePath) {
        return { success: false, cancelled: true };
      }

      await db.backup(filePath);
      return { success: true, path: filePath };
    } catch (err: any) {
      console.error('Backup database failed:', err);
      return { success: false, error: err.message };
    }
  });

  handle('restoreDatabase', async () => {
    try {
      const dbPath = getDbPath();

      const { filePaths, canceled } = await dialog.showOpenDialog({
        title: 'استعادة قاعدة البيانات من ملف',
        properties: ['openFile'],
        filters: [
          { name: 'SQLite Database', extensions: ['db', 'sqlite'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      });

      if (canceled || filePaths.length === 0) {
        return { success: false, cancelled: true };
      }

      const selectedPath = filePaths[0];

      // Close the current database connection
      closeDb();

      // Copy the selected file over the live database
      await fs.copyFile(selectedPath, dbPath);

      // Reinitialize the database (runs migrations if needed)
      initDb();

      return { success: true };
    } catch (err: any) {
      console.error('Restore database failed:', err);
      try {
        initDb();
      } catch (e) {
        console.error('Reinitializing database after restore failed failed:', e);
      }
      return { success: false, error: err.message };
    }
  });
};
