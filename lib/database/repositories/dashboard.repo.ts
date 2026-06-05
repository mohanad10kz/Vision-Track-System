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

    // 5. Notes (status = 'pending' or 'inprogress')
    const todayNotes = db.prepare("SELECT * FROM notes WHERE status IN ('pending', 'inprogress') AND archived_at IS NULL ORDER BY updated_at DESC LIMIT 10").all();

    // 6. Scheduled Visits (status = 'scheduled')
    const todayVisitsList = db.prepare("SELECT * FROM visits WHERE status = 'scheduled' AND archived_at IS NULL ORDER BY visit_date ASC, visit_time ASC LIMIT 10").all();

    // 7. Pending Tasks (status != 'done')
    const todayTasks = db.prepare("SELECT * FROM tasks WHERE status != 'done' AND archived_at IS NULL ORDER BY created_at DESC LIMIT 10").all();

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
