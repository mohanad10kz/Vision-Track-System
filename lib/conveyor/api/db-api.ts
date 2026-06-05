import { ConveyorApi } from '@/lib/preload/shared';

export class DbApi extends ConveyorApi {
  // ==================== TASKS ====================
  getTasks = () => this.invoke('getTasks');
  getTaskById = (id: number) => this.invoke('getTaskById', { id });
  createTask = (input: unknown) => this.invoke('createTask', input);
  updateTask = (id: number, input: unknown) => this.invoke('updateTask', { id, input });
  updateTaskStatus = (id: number, status: string, position: number) => this.invoke('updateTaskStatus', { id, status, position });
  deleteTask = (id: number) => this.invoke('deleteTask', { id });
  getArchivedTasks = (filter: { from?: string; to?: string; search?: string; page?: number; limit?: number }) => this.invoke('getArchivedTasks', filter);

  // ==================== NOTES ====================
  getNotes = () => this.invoke('getNotes');
  getNoteById = (id: number) => this.invoke('getNoteById', { id });
  createNote = (input: unknown) => this.invoke('createNote', input);
  updateNote = (id: number, input: unknown) => this.invoke('updateNote', { id, input });
  updateNoteStatus = (id: number, status: string, position: number) => this.invoke('updateNoteStatus', { id, status, position });
  deleteNote = (id: number) => this.invoke('deleteNote', { id });
  getArchivedNotes = (filter: { from?: string; to?: string; search?: string; page?: number; limit?: number }) => this.invoke('getArchivedNotes', filter);

  // ==================== VISITS ====================
  getVisits = (filter?: { type?: string; status?: string; technicianId?: number; from?: string; to?: string; search?: string }) => this.invoke('getVisits', filter);
  getVisitById = (id: number) => this.invoke('getVisitById', { id });
  createVisit = (input: unknown) => this.invoke('createVisit', input);
  updateVisit = (id: number, input: unknown) => this.invoke('updateVisit', { id, input });
  updateVisitStatus = (id: number, status: string, resolutionNotes?: string) => this.invoke('updateVisitStatus', { id, status, resolutionNotes });
  deleteVisit = (id: number) => this.invoke('deleteVisit', { id });
  getArchivedVisits = (filter: { from?: string; to?: string; search?: string; page?: number; limit?: number }) => this.invoke('getArchivedVisits', filter);

  // ==================== CLIENTS ====================
  getClients = (filter?: { search?: string }) => this.invoke('getClients', filter);
  getClientById = (id: number) => this.invoke('getClientById', { id });
  createClient = (input: unknown) => this.invoke('createClient', input);
  updateClient = (id: number, input: unknown) => this.invoke('updateClient', { id, input });
  deleteClient = (id: number) => this.invoke('deleteClient', { id });

  // ==================== TECHNICIANS ====================
  getTechnicians = () => this.invoke('getTechnicians');
  getTechnicianById = (id: number) => this.invoke('getTechnicianById', { id });
  createTechnician = (input: unknown) => this.invoke('createTechnician', input);
  updateTechnician = (id: number, input: unknown) => this.invoke('updateTechnician', { id, input });
  updateTechnicianStatus = (id: number, status: string) => this.invoke('updateTechnicianStatus', { id, status });
  deleteTechnician = (id: number) => this.invoke('deleteTechnician', { id });
  getTechnicianTodayVisits = (id: number, today: string) => this.invoke('getTechnicianTodayVisits', { id, today });

  // ==================== CALLS ====================
  getCalls = (filter?: { search?: string; contactType?: string; direction?: string; requiresFollowup?: boolean }) => this.invoke('getCalls', filter);
  getCallById = (id: number) => this.invoke('getCallById', { id });
  createCall = (input: unknown) => this.invoke('createCall', input);
  updateCall = (id: number, input: unknown) => this.invoke('updateCall', { id, input });
  markCallFollowupDone = (id: number) => this.invoke('markCallFollowupDone', { id });
  deleteCall = (id: number) => this.invoke('deleteCall', { id });

  // ==================== DASHBOARD ====================
  getDashboardData = () => this.invoke('getDashboardData');

  // ==================== TECH GROUPS & QUEUES ====================
  getSurveysByClientPhone = (filter: { phone: string }) => this.invoke('getSurveysByClientPhone', filter);
  getTechQueueByGroup = (filter: { groupId: number; queueType: 'installation' | 'maintenance' | 'followup' }) => this.invoke('getTechQueueByGroup', filter);
  skipTechnician = (filter: { id: number; queueType: 'installation' | 'maintenance' | 'followup' }) => this.invoke('skipTechnician', filter);
  getTechGroups = () => this.invoke('getTechGroups');
  createTechGroup = (input: unknown) => this.invoke('createTechGroup', input);
  updateTechGroup = (id: number, input: unknown) => this.invoke('updateTechGroup', { id, input });
  deleteTechGroup = (id: number) => this.invoke('deleteTechGroup', { id });

  // ==================== BACKUP & RESTORE ====================
  getDbPath = () => this.invoke('getDbPath');
  backupDatabase = () => this.invoke('backupDatabase');
  restoreDatabase = () => this.invoke('restoreDatabase');
}
