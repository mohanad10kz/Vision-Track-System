import { ConveyorApi } from '@/lib/preload/shared';

export class DbApi extends ConveyorApi {
  getTasks = () => this.invoke('getTasks');
  getTaskById = (id: number) => this.invoke('getTaskById', { id });
  createTask = (input: any) => this.invoke('createTask', input);
  updateTask = (id: number, input: any) => this.invoke('updateTask', { id, input });
  updateTaskStatus = (id: number, status: string, position: number) => this.invoke('updateTaskStatus', { id, status, position });
  deleteTask = (id: number) => this.invoke('deleteTask', { id });

  getNotes = () => this.invoke('getNotes');
  getNoteById = (id: number) => this.invoke('getNoteById', { id });
  createNote = (input: any) => this.invoke('createNote', input);
  updateNote = (id: number, input: any) => this.invoke('updateNote', { id, input });
  updateNoteStatus = (id: number, status: string, position: number) => this.invoke('updateNoteStatus', { id, status, position });
  deleteNote = (id: number) => this.invoke('deleteNote', { id });
}
