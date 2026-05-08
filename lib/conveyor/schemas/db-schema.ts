import { z } from 'zod';

export const dbIpcSchema = {
  getTasks: {
    args: z.tuple([]),
    return: z.any(),
  },
  getTaskById: {
    args: z.tuple([z.object({ id: z.number() })]),
    return: z.any(),
  },
  createTask: {
    args: z.tuple([z.any()]),
    return: z.any(),
  },
  updateTask: {
    args: z.tuple([z.object({ id: z.number(), input: z.any() })]),
    return: z.any(),
  },
  updateTaskStatus: {
    args: z.tuple([z.object({ id: z.number(), status: z.string(), position: z.number() })]),
    return: z.any(),
  },
  deleteTask: {
    args: z.tuple([z.object({ id: z.number() })]),
    return: z.any(),
  },

  getNotes: {
    args: z.tuple([]),
    return: z.any(),
  },
  getNoteById: {
    args: z.tuple([z.object({ id: z.number() })]),
    return: z.any(),
  },
  createNote: {
    args: z.tuple([z.any()]),
    return: z.any(),
  },
  updateNote: {
    args: z.tuple([z.object({ id: z.number(), input: z.any() })]),
    return: z.any(),
  },
  updateNoteStatus: {
    args: z.tuple([z.object({ id: z.number(), status: z.string(), position: z.number() })]),
    return: z.any(),
  },
  deleteNote: {
    args: z.tuple([z.object({ id: z.number() })]),
    return: z.any(),
  },
};
