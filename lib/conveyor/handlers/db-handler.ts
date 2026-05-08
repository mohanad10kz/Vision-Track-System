import { handle } from '@/lib/main/shared';
import { tasksRepo } from '../../database/repositories/tasks.repo';
import { notesRepo } from '../../database/repositories/notes.repo';

export const registerDbHandlers = () => {
  handle('getTasks', () => tasksRepo.findAll());
  handle('getTaskById', ({ id }: any) => tasksRepo.findById(id));
  handle('createTask', (input: any) => tasksRepo.create(input));
  handle('updateTask', ({ id, input }: any) => tasksRepo.update(id, input));
  handle('updateTaskStatus', ({ id, status, position }: any) => tasksRepo.updateStatus(id, status, position));
  handle('deleteTask', ({ id }: any) => tasksRepo.delete(id));

  handle('getNotes', () => notesRepo.findAll());
  handle('getNoteById', ({ id }: any) => notesRepo.findById(id));
  handle('createNote', (input: any) => notesRepo.create(input));
  handle('updateNote', ({ id, input }: any) => notesRepo.update(id, input));
  handle('updateNoteStatus', ({ id, status, position }: any) => notesRepo.updateStatus(id, status, position));
  handle('deleteNote', ({ id }: any) => notesRepo.delete(id));
};
