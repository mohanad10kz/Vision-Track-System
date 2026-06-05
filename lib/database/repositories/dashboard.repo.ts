import { getDb } from '../db';

export const dashboardRepo = {
  getDashboardData: () => {
    const db = getDb();
    
    // 1. Today Visits Count
    const today = new Date().toISOString().split('T')[0];
    const todayVisits = db.prepare('SELECT count(*) as count FROM visits WHERE date(visit_date) = ?').get(today) as { count: number };

    // 2. Scheduled Maintenance Count
    const scheduledMaintenance = db.prepare('SELECT count(*) as count FROM visits WHERE visit_type = ? AND status = ?').get('maintenance', 'scheduled') as { count: number };

    // 3. Scheduled Installations Count
    const scheduledInstallations = db.prepare('SELECT count(*) as count FROM visits WHERE visit_type = ? AND status = ?').get('installation', 'scheduled') as { count: number };

    // 4. Total Clients Count
    const totalClients = db.prepare('SELECT count(*) as count FROM clients').get() as { count: number };

    // 5. Today Notes (Active Only)
    const todayNotes = db.prepare('SELECT * FROM notes WHERE (date(created_at) = ? OR date(updated_at) = ?) AND archived_at IS NULL ORDER BY updated_at DESC LIMIT 10').all(today, today);

    // 6. Today Visits
    const todayVisitsList = db.prepare('SELECT * FROM visits WHERE date(visit_date) = ? ORDER BY visit_time ASC').all(today);

    // 7. Today Tasks
    const todayTasks = db.prepare('SELECT * FROM tasks WHERE (date(created_at) = ? OR date(due_date) = ?) AND archived_at IS NULL ORDER BY created_at DESC LIMIT 10').all(today, today);

    // 8. Pending Followup Calls
    const pendingFollowupCalls = db.prepare('SELECT * FROM call_logs WHERE requires_followup = 1 AND followup_done = 0 ORDER BY followup_date ASC LIMIT 5').all();

    return {
      todayVisitsCount: todayVisits.count,
      scheduledMaintenanceCount: scheduledMaintenance.count,
      scheduledInstallationsCount: scheduledInstallations.count,
      totalClientsCount: totalClients.count,
      todayNotes,
      todayVisits: todayVisitsList,
      todayTasks,
      pendingFollowupCalls,
    };
  }
};
