import { z } from 'zod';

export const dbIpcSchema = {
  // ==================== TASKS ====================
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
  getArchivedTasks: {
    args: z.tuple([z.object({ from: z.string().optional(), to: z.string().optional(), search: z.string().optional() })]),
    return: z.any(),
  },

  // ==================== NOTES ====================
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
  getArchivedNotes: {
    args: z.tuple([z.object({ from: z.string().optional(), to: z.string().optional(), search: z.string().optional() })]),
    return: z.any(),
  },

  // ==================== VISITS ====================
  getVisits: {
    args: z.tuple([z.object({
      type: z.string().optional(),
      status: z.string().optional(),
      technicianId: z.number().optional(),
      from: z.string().optional(),
      to: z.string().optional(),
      search: z.string().optional(),
    }).optional()]),
    return: z.any(),
  },
  getVisitById: {
    args: z.tuple([z.object({ id: z.number() })]),
    return: z.any(),
  },
  createVisit: {
    args: z.tuple([z.any()]),
    return: z.any(),
  },
  updateVisit: {
    args: z.tuple([z.object({ id: z.number(), input: z.any() })]),
    return: z.any(),
  },
  updateVisitStatus: {
    args: z.tuple([z.object({ id: z.number(), status: z.string(), resolutionNotes: z.string().optional() })]),
    return: z.any(),
  },
  deleteVisit: {
    args: z.tuple([z.object({ id: z.number() })]),
    return: z.any(),
  },

  // ==================== CLIENTS ====================
  getClients: {
    args: z.tuple([z.object({ search: z.string().optional() }).optional()]),
    return: z.any(),
  },
  getClientById: {
    args: z.tuple([z.object({ id: z.number() })]),
    return: z.any(),
  },
  createClient: {
    args: z.tuple([z.any()]),
    return: z.any(),
  },
  updateClient: {
    args: z.tuple([z.object({ id: z.number(), input: z.any() })]),
    return: z.any(),
  },
  deleteClient: {
    args: z.tuple([z.object({ id: z.number() })]),
    return: z.any(),
  },

  // ==================== TECHNICIANS ====================
  getTechnicians: {
    args: z.tuple([]),
    return: z.any(),
  },
  getTechnicianById: {
    args: z.tuple([z.object({ id: z.number() })]),
    return: z.any(),
  },
  createTechnician: {
    args: z.tuple([z.any()]),
    return: z.any(),
  },
  updateTechnician: {
    args: z.tuple([z.object({ id: z.number(), input: z.any() })]),
    return: z.any(),
  },
  updateTechnicianStatus: {
    args: z.tuple([z.object({ id: z.number(), status: z.string() })]),
    return: z.any(),
  },
  deleteTechnician: {
    args: z.tuple([z.object({ id: z.number() })]),
    return: z.any(),
  },
  getTechnicianTodayVisits: {
    args: z.tuple([z.object({ id: z.number(), today: z.string() })]),
    return: z.any(),
  },

  // ==================== CALLS ====================
  getCalls: {
    args: z.tuple([z.object({
      search: z.string().optional(),
      contactType: z.string().optional(),
      direction: z.string().optional(),
      requiresFollowup: z.boolean().optional(),
    }).optional()]),
    return: z.any(),
  },
  getCallById: {
    args: z.tuple([z.object({ id: z.number() })]),
    return: z.any(),
  },
  createCall: {
    args: z.tuple([z.any()]),
    return: z.any(),
  },
  updateCall: {
    args: z.tuple([z.object({ id: z.number(), input: z.any() })]),
    return: z.any(),
  },
  markCallFollowupDone: {
    args: z.tuple([z.object({ id: z.number() })]),
    return: z.any(),
  },
  deleteCall: {
    args: z.tuple([z.object({ id: z.number() })]),
    return: z.any(),
  },
};
